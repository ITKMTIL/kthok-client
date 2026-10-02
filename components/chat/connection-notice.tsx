import { LoaderCircle, WifiOff } from "lucide-react";

export function ConnectionNotice({
  connected,
  partnerAway,
  partnerName,
}: {
  connected: boolean;
  partnerAway: boolean;
  partnerName: string;
}) {
  if (connected && !partnerAway) return null;

  return (
    <p
      className="flex items-center gap-2.5 rounded-2xl border-2 border-dashed border-ink bg-card px-3 py-1.5 text-sm font-medium sm:px-4"
      role="status"
    >
      {connected ? (
        <LoaderCircle className="size-5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <WifiOff className="size-5 shrink-0 text-danger" aria-hidden />
      )}
      <span className="min-w-0">
        {connected
          ? `${partnerName} หลุดการเชื่อมต่อ รอสักครู่ เดี๋ยวน่าจะกลับมา`
          : "หลุดการเชื่อมต่อ กำลังต่อกลับเข้าห้องเดิมให้…"}
      </span>
    </p>
  );
}
