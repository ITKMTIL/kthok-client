import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <BrandMark size={64} />
      </div>
    ),
    size,
  );
}
