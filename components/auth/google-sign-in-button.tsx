"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL_DOMAIN, GOOGLE_CLIENT_ID } from "@/lib/config";
import { loadGoogleIdentity } from "@/lib/google-identity";

const MAX_BUTTON_WIDTH = 400;

export function GoogleSignInButton({
  onCredential,
}: {
  onCredential: (credential: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | null = null;
    loadGoogleIdentity()
      .then((identity) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        identity.initialize({
          client_id: GOOGLE_CLIENT_ID,
          hd: EMAIL_DOMAIN,
          callback: (response) => {
            if (response.credential) onCredentialRef.current(response.credential);
          },
        });
        let renderedWidth = 0;
        const render = () => {
          const width = Math.min(MAX_BUTTON_WIDTH, Math.floor(host.clientWidth));
          if (width === renderedWidth || width === 0) return;
          renderedWidth = width;
          identity.renderButton(host, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "signin_with",
            locale: "th",
            width,
          });
        };
        render();
        observer = new ResizeObserver(render);
        observer.observe(host);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  if (failed) {
    return (
      <p role="alert" className="font-medium text-danger">
        โหลดปุ่มล็อกอินของ Google ไม่สำเร็จ ลองรีเฟรชหน้านี้นะ
      </p>
    );
  }
  return <div ref={hostRef} className="flex min-h-11 w-full justify-center" />;
}
