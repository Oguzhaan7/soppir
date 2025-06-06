"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Icons } from "@/components/common/icons";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { supabase } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/auth/login?error=oauth_failed");
          return;
        }

        if (data.session) {
          router.push("/");
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login?error=oauth_failed");
      }
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Icons.loader className="h-8 w-8 animate-spin mx-auto" />
        <h2 className="text-lg font-semibold">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
}
