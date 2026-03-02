"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    upsertUser({
      name: user.fullName ?? user.username ?? "Anonymous",
      email: user.primaryEmailAddress?.emailAddress ?? "",
    });
  }, [isLoaded, isSignedIn, user, upsertUser]);

  return null;
}
