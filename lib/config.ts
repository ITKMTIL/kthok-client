export const CORE_URL =
  process.env.NEXT_PUBLIC_CORE_URL ?? "http://localhost:3001";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const AUTH_REQUIRED = GOOGLE_CLIENT_ID !== "";

export const EMAIL_DOMAIN = "kmitl.ac.th";
