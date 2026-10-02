import { toBlob } from "html-to-image";

const FILE_NAME = "k-thok.png";
const OUTPUT_WIDTH = 1080;

export async function renderPng(node: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  const options = { pixelRatio: OUTPUT_WIDTH / node.offsetWidth };
  await toBlob(node, options);
  const blob = await toBlob(node, options);
  if (!blob) throw new Error("Could not render the image");
  return blob;
}

function asFile(blob: Blob): File {
  return new File([blob], FILE_NAME, { type: "image/png" });
}

export function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  return navigator.canShare({
    files: [new File([], FILE_NAME, { type: "image/png" })],
  });
}

export function canCopyImages(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof ClipboardItem !== "undefined" &&
    Boolean(navigator.clipboard?.write)
  );
}

export function downloadPng(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = FILE_NAME;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function sharePng(blob: Blob) {
  await navigator.share({ files: [asFile(blob)], title: "K-Thok" });
}

export async function copyPng(blob: Blob) {
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
