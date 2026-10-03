const MESSAGES = {
  match: { title: "เจอเพื่อนคุยแล้ว!", body: "กลับมาทักทายกันเลย" },
  message: { title: "มีข้อความใหม่", body: "เพื่อนในห้องส่งข้อความมา" },
  call: { title: "มีสายเรียกเข้า", body: "เพื่อนในห้องชวนคุยเสียง" },
  keep: { title: "มีคนอยากคุยต่อกับเธอ", body: "กลับมาตอบได้ภายใน 10 นาที" },
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let kind = "message";
  try {
    kind = event.data?.json().kind ?? kind;
  } catch {}
  const message = MESSAGES[kind] ?? MESSAGES.message;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        if (clients.some((client) => client.visibilityState === "visible")) return;
        return self.registration.showNotification(message.title, {
          body: message.body,
          icon: "/apple-icon",
          badge: "/icon",
          tag: `kthok-${kind}`,
          renotify: true,
        });
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((client) => "focus" in client);
        return existing ? existing.focus() : self.clients.openWindow("/");
      }),
  );
});
