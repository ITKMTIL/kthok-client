"use client";

import { useState } from "react";
import { Hero } from "@/components/ui/hero";
import { SiteFooter } from "@/components/ui/site-footer";
import { PrivacyNote } from "@/components/ui/privacy-note";
import { saveSessionToken } from "@/hooks/use-session";
import { signInWithGoogle } from "@/lib/auth-api";
import { EMAIL_DOMAIN } from "@/lib/config";
import { GoogleSignInButton } from "./google-sign-in-button";

export function LoginScreen({ notice }: { notice: string | null }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredential(credential: string) {
    setPending(true);
    setError(null);
    const result = await signInWithGoogle(credential);
    setPending(false);
    if (result.ok) saveSessionToken(result.token);
    else setError(result.error);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 pb-6 pt-6 text-center">
      <Hero bubble="ล็อกอิน~" />
      <section className="doodle-card flex w-full max-w-[445px] flex-col items-center gap-3 p-5">
        <h2 className="text-lg font-bold">เข้าด้วยอีเมลนักศึกษา</h2>
        <p className="text-sm text-ink-soft">
          ใช้บัญชี Google ของ @{EMAIL_DOMAIN} แล้วเราจะดูคณะจากรหัสนักศึกษาให้
          อีกฝ่ายเห็นแค่นามแฝงกับคณะ
        </p>
        <PrivacyNote className="w-full" />
        <GoogleSignInButton onCredential={handleCredential} />
        {pending && <p className="text-sm text-ink-soft">กำลังล็อกอิน…</p>}
        {(error ?? notice) && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error ?? notice}
          </p>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
