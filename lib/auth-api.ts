import { LOGIN_ERROR_FALLBACK, LOGIN_ERRORS } from "@/constants/messages";
import { CORE_URL } from "./config";

export type SignInResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function signInWithGoogle(
  credential: string,
): Promise<SignInResult> {
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
        error: LOGIN_ERRORS[data?.message] ?? LOGIN_ERROR_FALLBACK,
      };
    }
    if (typeof data?.token !== "string" || !data.token) {
      return { ok: false, error: LOGIN_ERROR_FALLBACK };
    }
    return { ok: true, token: data.token };
  } catch {
    return { ok: false, error: LOGIN_ERROR_FALLBACK };
  }
}
