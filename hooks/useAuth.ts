"use client";

import { useSupabase } from "@/providers/supabase-provider";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/types/user.types";

export const useAuth = () => {
  const { supabase, user, loading } = useSupabase();
  const [authLoading, setAuthLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
          },
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const getUserRole = async (): Promise<Role> => {
    if (!user) return "customer";

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return "customer";
    return data.role as Role;
  };

  const {
    data: userRole,
    isLoading: roleLoading,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: getUserRole,
    enabled: !!user && !loading,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";
  const isCustomer = userRole === "customer";

  return {
    user,
    loading: loading || authLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    forgotPassword,
    updatePassword,
    isAuthenticated: !!user,
    supabase,
    userRole: userRole || "customer",
    isAdmin,
    isManager,
    isCustomer,
    roleLoading,
    refetchRole,
  };
};
