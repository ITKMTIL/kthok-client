@AGENTS.md

# kthok-client

หน้าเว็บ Next.js 16 App Router + Tailwind 4 (pnpm) ส่วนหนึ่งของ K-Thok ("KMITL Thok") แชตนิรนาม 1 ต่อ 1 สำหรับนักศึกษา สจล. อีกฝั่งคือ `../kthok-core`

## ก่อนเริ่มงาน

1. อ่าน `context/privacy.md` — กรอบความเป็นนิรนาม ทุกการแก้ต้องอยู่ในกรอบนี้ ถ้าคำขอขัดกรอบ ให้หยุดถามเจ้าของก่อนลงมือ
2. อ่านเฉพาะไฟล์ context ที่ต้องใช้ผ่าน `context/README.md` แทนการไล่อ่านโค้ด

## หลังแก้ทุกครั้ง (บังคับ)

เพิ่ม entry ใน `context/changelog.md` (ระบุผลต่อความเป็นนิรนาม) อัปเดตไฟล์ context ที่ข้อเท็จจริงเปลี่ยน แล้ว commit แยกเป็น `docs(context): ...` งานใหญ่ให้ส่ง agent `kthok-context` ทำ ถ้างานแตะ `../kthok-core` ต้องอัปเดต context ฝั่งนั้นด้วย Stop hook จะไม่ให้จบงานถ้ามี commit โค้ดใหม่กว่า changelog

## กฎจากเจ้าของ

- โค้ดไม่มี comment เขียนให้เหมือนโค้ดรอบข้าง
- UI ไม่มี emoji (ยกเว้นรีแอคชัน) ใช้ lucide-react
- commit บน `main` ตรง ๆ แยกตามเรื่อง ไม่ใส่ Co-Authored-By หรือระบุว่าเป็น AI ห้ามสลับ branch push เมื่อสั่งเท่านั้น
- Docker image ใช้ `--platform=linux/amd64` เสมอ
- secret และ `ADMIN_STUDENT_IDS` เจ้าของตั้งเอง
- ตอบภาษาไทย กระชับ งานใหญ่ให้ plan ก่อน ลงมือเมื่อเจ้าของสั่ง "เริ่มเลย"
- ห้ามเทสกับ core (3001) / client (3000) ที่เจ้าของรันอยู่ ห้ามเปิดเพลง YouTube หรือใช้ไมค์จริงตอนเทส ดู `context/ops.md`

## Agents (`.claude/agents/`) ใช้เพื่อประหยัด context

- `kthok-check` — typecheck + lint คืน PASS หรือรายการ error
- `kthok-tester` — เทสบน stack แยก (`.claude/scripts/test-stack.sh`) คืน PASS/FAIL
- `kthok-scout` — หาโค้ด คืนตาราง file:line
- `kthok-context` — ตรวจกรอบนิรนาม + อัปเดต context/changelog หลังแก้
