import { ImageResponse } from "next/og";
import { BRAND, BrandMark } from "@/lib/brand";

export const alt = "K-Thok — แชตนิรนามสำหรับชาว สจล.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 48,
          background: BRAND.paper,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 56,
            padding: "0 64px",
            background: BRAND.card,
            border: `8px solid ${BRAND.ink}`,
            borderRadius: 56,
            boxShadow: `14px 14px 0 ${BRAND.ink}`,
          }}
        >
          <BrandMark size={270} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                fontSize: 124,
                fontWeight: 700,
                letterSpacing: 4,
                color: BRAND.ink,
              }}
            >
              K<span style={{ color: BRAND.accent }}>-</span>THOK
            </div>
            <div style={{ display: "flex", fontSize: 38, color: BRAND.inkSoft }}>
              Anonymous chat for KMITL students
            </div>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                marginTop: 20,
                padding: "10px 28px",
                fontSize: 34,
                fontWeight: 700,
                color: BRAND.ink,
                background: BRAND.accentSoft,
                border: `5px solid ${BRAND.ink}`,
                borderRadius: 999,
              }}
            >
              Tap. Match. Talk.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
