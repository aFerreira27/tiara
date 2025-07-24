'use client';

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard", redirect: false })}>Sign in with Microsoft</button>
  );
}