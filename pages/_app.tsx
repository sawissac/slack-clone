import React, { useState, useEffect } from "react";
import Router from "next/router";
import UserContext from "@/lib/UserContext";
import { supabase, fetchUserRoles } from "@/lib/Store";
import { AppProps } from "next/app";
import { User } from "@supabase/supabase-js";
import "../styles/globals.css";

export default function SupabaseSlackClone({ Component, pageProps }: AppProps) {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<Array<string>>([]);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setUserLoaded(session ? true : false);

    if (user) {
      signIn()
      Router.replace("/channels/[id]", "/channels/1");
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setUserLoaded(!!currentUser);
        if (currentUser) {
          signIn();
          Router.replace("/channels/[id]", "/channels/1");
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  const signIn = async () => {
    await fetchUserRoles((userRoles) => {
      if (!userRoles) return;
      const roles = userRoles.map((userRole) => userRole.role);
      setUserRoles(roles);
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    Router.replace("/", "/");
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        userRoles,
        signIn,
        signOut,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
