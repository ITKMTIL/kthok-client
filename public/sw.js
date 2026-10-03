const MESSAGES = {
  match: {
    title: "เจอเพื่อนคุยแล้ว! · Matched!",
    body: "กลับมาทักทายกันเลย · Come back and say hi",
  },
  message: {
    title: "มีข้อความใหม่ · New message",
    body: "เพื่อนในห้องส่งข้อความมา · Your chat buddy sent a message",
  },
  call: {
    title: "มีสายเรียกเข้า · Incoming call",
    body: "เพื่อนในห้องชวนคุยเสียง · Your chat buddy wants to voice chat",
  },
  keep: {
    title: "มีคนอยากคุยต่อกับเธอ · Someone wants to keep talking",
    body: "กลับมาตอบได้ภายใน 10 นาที · Reply within 10 minutes",
  },
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
