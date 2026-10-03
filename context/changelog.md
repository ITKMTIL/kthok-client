# Changelog งานที่ AI ทำใน kthok-client

เพิ่ม entry ใหม่ด้านบนสุด รูปแบบ:

```
## YYYY-MM-DD — หัวข้อสั้น
- ทำอะไร (commit hash)
- ความเป็นนิรนาม: ไม่กระทบ / กระทบ → ผ่าน checklist ใน privacy.md อย่างไร
- context ที่อัปเดต: ไฟล์ไหน
```

## 2026-10-03 — เกมดูดวง
- `d03c8e5` TaksaBoard/TarotBoard (`components/games/fortune-boards.tsx`), `constants/fortune.ts` (วัน + สีประจำวัน), ข้อความ `fortune` ใน th/en
- ความเป็นนิรนาม: ผ่าน — ถามแค่วันในสัปดาห์, ไม่โชว์ให้อีกฝ่ายถ้าไม่ติ๊ก, ไม่เก็บ
- context ที่อัปเดต: product, privacy, changelog

## 2026-10-03 — หน้าเว็บภาษาอังกฤษ + ปุ่มสลับภาษา
- `b5d6cb0` ย้ายข้อความทุก component (ยกเว้น admin), error map จาก `constants/messages.ts` (ลบไฟล์), ชื่อคณะ/หัวข้อ/สติกเกอร์, title แจ้งเตือน, นามแฝงสุ่ม ไปไว้ใน `lib/i18n/th.ts` + `en.ts` และเพิ่ม `components/app/language-toggle.tsx`; `abd58c3` ข้อความ push ใน `sw.js` สองภาษา
- ความเป็นนิรนาม: ไม่กระทบ — ภาษาเก็บใน localStorage ของผู้ใช้เท่านั้น ไม่ส่งไป core, payload socket/push ไม่เปลี่ยน
- context ที่อัปเดต: client, product, changelog

## 2026-10-03 — ชุดที่ 2: แชตเสริม + ความปลอดภัย
- `4e5f5e9` กฎชุมชน, `be350f9` + `fe3847b` ปุ่มออกฉุกเฉินพร้อมยืนยัน, `feed5f4` สติกเกอร์/ตอบกลับ/ยกเลิกส่ง/อ่านแล้ว, `e14d1c6` หน้าคำต้องห้าม, `6cf11ea` คำถามจากรหัส, ปุ่ม Google โปร่งใสใน dark mode (รวมใน `b5d6cb0`)
- ความเป็นนิรนาม: ไม่กระทบ — read receipt ส่งแค่ id และปิดได้, การยอมรับกฎเก็บใน localStorage
- context ที่อัปเดต: product, changelog

## 2026-10-03 — ฟีเจอร์ชุด 1–10
- `0177e96` หัวข้อ + ป้ายมีคนรอ, `174e442` คำถามชวนคุย, `2688199` มินิเกม, `9a6cc57` อยากคุยต่อ + ฟอร์มรายงาน (+ privacy note), `867af8a` คิวรายงาน admin, `d4c1ba9` dark mode, `1267de1` คนกดออกเห็นหน้าจบห้อง, `b4c5aea` PWA + push, `28124ff` README
- ความเป็นนิรนาม: กระทบ ผ่าน checklist โดยเจ้าของอนุมัติ — รายงานเก็บเฉพาะข้อความที่ผู้รายงานเลือก (เข้ารหัส, 30 วัน) แจ้งใน privacy note และฟอร์ม; contact ส่งเมื่อกดทั้งคู่ไม่เก็บ; push ส่งแค่ kind, subscription เก็บ DB; ป้ายคนรอไม่มีตัวเลข; sw ไม่โชว์เนื้อหา
- context ที่อัปเดต: privacy, product, client, decisions, open-items, changelog

## 2026-10-03 — ตั้งระบบ context + agents
- เพิ่ม `context/`, `CLAUDE.md`, `.claude/agents` (kthok-check, kthok-tester, kthok-scout, kthok-context), `.claude/scripts` (test-stack, context-guard), Stop hook
- ความเป็นนิรนาม: ไม่กระทบ (เอกสารและเครื่องมือ)
- context ที่อัปเดต: สร้างใหม่ทั้งหมด

## 2026-10-03 — ข้อความเสียง
- `d9f5570` อัด/ส่ง/รับ, `23caa16` recorder bar + voice bubble, `1b53135` ลดเสียงเพลง + การ์ดแชร์ + dashboard, `bfe852c` README
- ความเป็นนิรนาม: ผ่าน — เสียงเป็น blob URL ในเครื่องสองฝั่ง revoke เมื่อออกห้อง ไม่มีปุ่มดาวน์โหลด ไม่อัปโหลดที่อื่นนอกจากส่งผ่าน core
- context ที่อัปเดต: รวมในการสร้างครั้งแรก

## ก่อนหน้า (2026-10-02 → 2026-10-03)
- สร้างหน้าเว็บทั้งหมด: lobby, จับคู่, แชต, รีแอคชัน, เพลง, โทร, แชร์รูป, เสียงแจ้งเตือน, admin dashboard, Docker, อนิเมชัน — ดู `decisions.md` และ git log
