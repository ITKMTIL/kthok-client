"use client";

import { Copy, Download, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { facultyOf } from "@/constants/faculties";
import {
  canCopyImages,
  canShareFiles,
  copyPng,
  downloadPng,
  renderPng,
  sharePng,
} from "@/lib/share-image";
import type { ChatMessage } from "@/types/chat";
import { ShareCard, type ShareParty } from "./share-card";

type Action = "download" | "share" | "copy";

const DONE: Record<Action, string> = {
  download: "บันทึกรูปแล้ว",
  share: "ส่งต่อให้แอพที่เลือกแล้ว",
  copy: "คัดลอกรูปแล้ว วางได้เลย",
};

export function ShareDialog({
  messages,
  self,
  partner,
  onClose,
}: {
  messages: ChatMessage[];
  self: ShareParty;
  partner: ShareParty;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPartnerName, setShowPartnerName] = useState(false);
  const [busy, setBusy] = useState<Action | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const partnerFaculty = partner.faculty ? facultyOf(partner.faculty) : undefined;
  const shownPartner: ShareParty = showPartnerName
    ? partner
    : { ...partner, name: `เพื่อนจาก${partnerFaculty?.short ?? " สจล."}` };

  async function run(action: Action) {
    const card = cardRef.current;
    if (!card || busy) return;
    setBusy(action);
    setStatus(null);
    setFailed(false);
    try {
      const blob = await renderPng(card);
      if (action === "download") downloadPng(blob);
      else if (action === "share") await sharePng(blob);
      else await copyPng(blob);
      setStatus(DONE[action]);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setFailed(true);
        setStatus("สร้างรูปไม่สำเร็จ ลองอีกครั้งหรือใช้ปุ่มบันทึกรูปแทน");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="doodle-card m-auto flex max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-[min(26rem,calc(100vw-1.5rem))] flex-col gap-3 p-4 backdrop:bg-ink/50"
      aria-labelledby="share-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="share-title" className="text-lg font-bold">
          แชร์บทสนทนา
        </h2>
        <button
          type="button"
          className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="ปิด"
          onClick={() => dialogRef.current?.close()}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border-2 border-ink">
        <ShareCard
          ref={cardRef}
          messages={messages}
          self={self}
          partner={shownPartner}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-accent"
          checked={showPartnerName}
          onChange={(event) => setShowPartnerName(event.target.checked)}
        />
        โชว์นามแฝงของอีกฝ่ายในรูป
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="doodle-btn doodle-btn-primary flex flex-1 items-center justify-center gap-1.5 px-3 py-2 font-bold"
          disabled={busy !== null}
          onClick={() => run("download")}
        >
          <Download className="size-4" aria-hidden />
          บันทึกรูป
        </button>
        {canShareFiles() && (
          <button
            type="button"
            className="doodle-btn flex flex-1 items-center justify-center gap-1.5 px-3 py-2"
            disabled={busy !== null}
            onClick={() => run("share")}
          >
            <Share2 className="size-4" aria-hidden />
            แชร์
          </button>
        )}
        {canCopyImages() && (
          <button
            type="button"
            className="doodle-btn flex flex-1 items-center justify-center gap-1.5 px-3 py-2"
            disabled={busy !== null}
            onClick={() => run("copy")}
          >
            <Copy className="size-4" aria-hidden />
            คัดลอก
          </button>
        )}
      </div>
      <p
        className={`min-h-5 text-sm ${failed ? "font-medium text-danger" : "text-ink-soft"}`}
        role="status"
      >
        {busy ? "กำลังสร้างรูป…" : (status ?? "รูปสร้างในเครื่องเธอเอง เราไม่ได้เก็บไว้")}
      </p>
    </dialog>
  );
}
