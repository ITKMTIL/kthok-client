import { LoaderCircle, WifiOff } from "lucide-react";
import { SlideIn } from "@/components/ui/slide-in";
import { useT } from "@/hooks/use-locale";

export function ConnectionNotice({
  connected,
  partnerAway,
  partnerName,
}: {
  connected: boolean;
  partnerAway: boolean;
  partnerName: string;
}) {
  const t = useT();
  if (connected && !partnerAway) return null;

  return (
    <SlideIn>
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
          ? t.room.partnerDropped(partnerName)
          : t.room.reconnecting}
      </span>
    </p>
    </SlideIn>
  );
}
