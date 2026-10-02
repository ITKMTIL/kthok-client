import { loadScript } from "./load-script";

export interface GoogleIdentity {
  initialize(options: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
    hd?: string;
  }): void;
  renderButton(
    element: HTMLElement,
    options: Record<string, string | number>,
  ): void;
  disableAutoSelect(): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } };
  }
}

export async function loadGoogleIdentity(): Promise<GoogleIdentity> {
  await loadScript("https://accounts.google.com/gsi/client");
  if (!window.google) throw new Error("Google Identity Services unavailable");
  return window.google.accounts.id;
}
