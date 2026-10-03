import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { Socket } from "socket.io-client";
import { decodeKey, pushSupport, registerServiceWorker } from "@/lib/push";

export type PushStatus = "off" | "on" | "denied" | "busy" | "failed";

const noopSubscribe = () => () => {};

async function currentSubscription() {
  const registration = await registerServiceWorker();
  return {
    registration,
    subscription: (await registration?.pushManager.getSubscription()) ?? null,
  };
}

function send(socket: Socket, subscription: PushSubscription) {
  return new Promise<boolean>((resolve) =>
    socket.emit(
      "push:subscribe",
      { subscription: subscription.toJSON() },
      (ack: { ok: boolean }) => resolve(ack.ok),
    ),
  );
}

export function usePush(socket: Socket | null, publicKey: string | null) {
  const support = useSyncExternalStore(
    noopSubscribe,
    pushSupport,
    () => "unsupported" as const,
  );
  const [status, setStatus] = useState<PushStatus>("off");

  useEffect(() => {
    if (support !== "supported" || !socket || !publicKey) return;
    let cancelled = false;
    const resend = async () => {
      const { subscription } = await currentSubscription();
      if (cancelled) return;
      if (Notification.permission === "denied") return setStatus("denied");
      if (!subscription || Notification.permission !== "granted") return;
      setStatus("on");
      if (socket.connected) await send(socket, subscription);
    };
    const onConnect = () => void resend();
    void resend();
    socket.on("connect", onConnect);
    return () => {
      cancelled = true;
      socket.off("connect", onConnect);
    };
  }, [support, socket, publicKey]);

  const enable = useCallback(async () => {
    if (!socket || !publicKey) return;
    setStatus("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return setStatus(permission === "denied" ? "denied" : "off");
      }
      const { registration } = await currentSubscription();
      if (!registration) return setStatus("failed");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeKey(publicKey),
      });
      setStatus((await send(socket, subscription)) ? "on" : "failed");
    } catch {
      setStatus("failed");
    }
  }, [socket, publicKey]);

  const disable = useCallback(async () => {
    setStatus("busy");
    try {
      const { subscription } = await currentSubscription();
      if (subscription) {
        socket?.emit("push:unsubscribe", { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
    } finally {
      setStatus("off");
    }
  }, [socket]);

  return {
    available: Boolean(publicKey),
    support,
    status,
    enable,
    disable,
  };
}
