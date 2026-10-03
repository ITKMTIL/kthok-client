# Changelog งานที่ AI ทำใน kthok-client

เพิ่ม entry ใหม่ด้านบนสุด รูปแบบ:

```
## YYYY-MM-DD — หัวข้อสั้น
- ทำอะไร (commit hash)
- ความเป็นนิรนาม: ไม่กระทบ / กระทบ → ผ่าน checklist ใน privacy.md อย่างไร
- context ที่อัปเดต: ไฟล์ไหน
```

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
