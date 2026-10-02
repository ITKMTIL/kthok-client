export function OnlineCount({
  online,
  connected,
}: {
  online: number | null;
  connected: boolean;
}) {
  return (
    <p className="text-xl" aria-live="polite">
      {online === null ? (
        <span className="text-ink-soft">
          {connected ? "กำลังนับคน…" : "กำลังเชื่อมต่อเซิร์ฟเวอร์…"}
        </span>
      ) : (
        <>
          <span className="font-bold text-accent">{online}</span> คนกำลังออนไลน์
        </>
      )}
    </p>
  );
}
