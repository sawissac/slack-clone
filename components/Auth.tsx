import { supabase } from "@/lib/Store";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";

export const Auth: React.FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  const [lock, setLock] = useState(true);
  const session = supabase.auth.session();

  useEffect(() => {
    if (!session) {
      console.log(session);
      router.push("/");
    }
    setLock(false);
  }, [router, session]);

  return <div className="bg-dots">{lock ? null : props.children}</div>;
};
