"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Alert,
  AlertDescription,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { useAuth } from "@/hooks/useAuth";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const router = useRouter();
  const { updatePassword, supabase } = useAuth();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setIsValidSession(false);
          setAuthError(
            "Invalid or expired reset link. Please request a new password reset."
          );
          return;
        }

        if (session && session.user) {
          setIsValidSession(true);
        } else {
          setIsValidSession(false);
          setAuthError(
            "Invalid or expired reset link. Please request a new password reset."
          );
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsValidSession(false);
        setAuthError(
          "Invalid or expired reset link. Please request a new password reset."
        );
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
      } else if (event === "SIGNED_OUT") {
        setIsValidSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const { error } = await updatePassword(values.password);

      if (error) {
        setAuthError(error.message);
      } else {
        setSuccess(true);
        form.reset();
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating password";
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex items-center justify-center py-8">
              <Icons.loader className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icons.shoe className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-primary">Soppir</span>
              </div>
              <CardTitle className="text-2xl">Password updated!</CardTitle>
              <CardDescription>
                Your password has been successfully updated. You can now sign in
                with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>

                <p className="text-sm text-muted-foreground">
                  Redirecting to sign in page...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icons.shoe className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-primary">Soppir</span>
              </div>
              <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired. Please
                request a new password reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/forgot-password">
                    Request New Reset Link
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">Back to Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icons.shoe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Soppir</span>
            </div>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your new password"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your new password"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
