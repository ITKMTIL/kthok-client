# Ops ของ kthok-client

## รันตอนพัฒนา

- `pnpm dev` (port 3000) — เจ้าของรันเองอยู่ อย่า build ทับ `.next` ในที่เดิม
- ต้องมี kthok-core รันที่ 3001 (`../kthok-core`)
- เพื่อนเข้าทดสอบผ่าน cloudflared quick tunnel (`*.trycloudflare.com`) → อาจมีคนจริงต่ออยู่

## env

- `NEXT_PUBLIC_CORE_URL` (ค่าเริ่มต้น `http://localhost:3001`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` ต้องตรงกับ `GOOGLE_CLIENT_ID` ของ core, เว้นว่าง = โหมดทดลอง
- `NEXT_PUBLIC_SITE_URL` สำหรับลิงก์ preview
- ค่าจริงเจ้าของใส่เอง ห้ามเขียนลงไฟล์ที่ commit

## Docker

`scripts/build-image.sh` → image `linux/amd64` (~288MB, standalone). `NEXT_PUBLIC_*` ถูกฝังตอน build. compose อยู่ที่ `../kthok-core/docker-compose.yml`

## เทส (ห้ามใช้ 3000/3001)

```bash
.claude/scripts/test-stack.sh up | client | core | down
.claude/scripts/test-stack.sh node script.cjs
```

- client 3055 build จากสำเนาใน `/tmp/kthok-test` (webpack), core 3056 ไม่มี auth/DB
- partner จำลอง = socket.io-client script, faculty id เช่น `engineering`
- ห้ามเปิดเพลง YouTube, ห้ามใช้ไมค์จริง (fake `getUserMedia` ด้วย oscillator), ไฟล์เสียงเทสใช้ ffmpeg `anullsrc`
- browser pane ไม่เดิน animation frame → GSAP/Motion ค้าง ให้อ่าน DOM/state แทน splash หายเองหลัง ~8s (CSS fallback)
- check: `pnpm exec tsc --noEmit && pnpm lint`
