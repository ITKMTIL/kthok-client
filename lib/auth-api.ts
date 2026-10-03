import { currentDict } from "@/hooks/use-locale";
import { errorText } from "@/lib/i18n";
import { CORE_URL } from "./config";

export type SignInResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function signInWithGoogle(
  credential: string,
): Promise<SignInResult> {
  const errors = currentDict().errors;
  try {
    const response = await fetch(`${CORE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        error: errorText(errors.login, data?.message, errors.loginFallback),
      };
    }
    if (typeof data?.token !== "string" || !data.token) {
      return { ok: false, error: errors.loginFallback };
    }
    return { ok: true, token: data.token };
  } catch {
    return { ok: false, error: errors.loginFallback };
  }
}
