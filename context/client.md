# kthok-client (Next.js 16 App Router, Tailwind 4)

อ่าน `node_modules/next/dist/docs` ก่อนใช้ Next API (เวอร์ชันนี้ต่างจากที่โมเดลรู้). `output: "standalone"`, `allowedDevOrigins: ["*.trycloudflare.com"]`.

## โครงสร้าง

- `app/`: `page.tsx`, `admin/`, `layout.tsx` (viewport `interactiveWidget: resizes-content`, `viewportFit: cover`), `globals.css` (tokens เช่น `--color-accent`, `--color-tan`, `--color-leaf`, คลาส `doodle-*`, `bubble*`), metadata files (`icon`, `apple-icon`, `opengraph-image`, `manifest`)
- `components/`
  - `app/` `kthok-app.tsx` (MotionConfig, Splash, AnimatePresence `popLayout` ของ Screen ตาม phase), `app-header.tsx`
  - `auth/` login + ปุ่ม Google เต็มความกว้าง
  - `lobby/` profile card, faculty preference, online count
  - `chat/` room, header, menu (แชร์/บล็อก), notices, message list/bubble/form, reaction picker, feedback, searching
  - `voice/` waveform, voice bubble, recorder bar
  - `games/game-panel.tsx` XO/เป่ายิ้งฉุบ, `followup/` keep-talking + report dialog, `push/push-toggle.tsx`, `lobby/topic-picker.tsx` + `preference-chip.tsx` (จุด "มีคนรอ")
  - `chat/prompt-card.tsx` การ์ดคำถาม, `app/theme-toggle.tsx`
  - `admin/report-queue.tsx` คิวรายงาน
  - `music/`, `call/`, `share/`, `admin/`
  - `ui/` splash (GSAP), mascot (GSAP loops), hero, privacy-note, screen, slide-in, site-footer
- `hooks/`: `use-chat` (socket + reducer, revoke blob URL เสียง, ส่ง `presence:visibility`, `leave` = ไปหน้าจบห้อง / `exit` = กลับ lobby), `use-push`, `use-theme`, `use-voice-call`, `use-voice-recorder`, `use-youtube-player` (sync 500ms, drift >2s, duck เสียง), `use-session`, `use-profile`, `use-notifications`, `use-visual-viewport`, ...
- `lib/`: `theme` (THEME_SCRIPT inline ใน layout กัน flash), `push` (support/decodeKey/register sw), `config` (`NEXT_PUBLIC_*`), `storage` (`createStoredValue` + useSyncExternalStore), `sounds`, `share-image` (html-to-image 1080px), `voice*` (store ของ player/activity), `youtube-api`, `google-identity`, `admin-*`
- `constants/` faculties (id + icon ต้องตรงกับ core, ชื่อมาจาก dict ผ่าน `facultyText`), topics/stickers (id + icon), reactions
- `lib/i18n/`: `th.ts` (ต้นฉบับ, `Dict` derive จากนี้), `en.ts` (`en: Dict`), `index.ts` (`DICTS`, `errorText`, `promptText`); `hooks/use-locale.ts` (`useT`, `useLocale`, `currentDict`, เก็บ `kthok:locale`)
- `types/` chat, auth, admin

## Pattern

- state ห้องทั้งหมดผ่าน `chatReducer`; ค่าที่ต้องคงไว้ข้ามการหาห้องใหม่ (`callEnabled`, `voiceEnabled`, `blockEnabled`, `reportEnabled`, `pushKey`, `isAdmin`, `selfFaculty`, `online`, `waiting`) ต้อง copy ในทุก branch ที่ reset
- สีทั้งหมดเป็น token: ค่าจริงอยู่ใน `:root` / `[data-theme=dark]` / media dark ของ `globals.css`, `@theme inline` ชี้ไปที่ var ห้าม hard-code hex ใน component (ยกเว้น `lib/brand.tsx` ที่ใช้กับรูป OG/icon) กล่องวิดีโอใช้ `bg-black`
- socket สร้างด้วย `useMemo` (`autoConnect: false`), handler ตั้งใน effect เดียว
- store ข้าม component ใช้ module + `useSyncExternalStore` (ดู `lib/voice-player.ts`)
- icon จาก lucide-react, ไม่มี emoji ใน UI
- อนิเมชัน: Motion (`motion/react`) สำหรับ UI, GSAP (`useGSAP`) สำหรับ splash/mascot
- ทุกปุ่ม/ไอคอนต้องมี `aria-label` (มาจาก dict)
- i18n: ข้อความที่ผู้ใช้เห็นทั้งหมดอยู่ใน `lib/i18n/th.ts` + `en.ts` ห้าม hard-code ใน component; ใช้ `useT()` ใน component, `currentDict()` นอก React (ack callback ใน `use-chat`/`use-voice-call`, reducer, `auth-api`) error code จาก core แปลงด้วย `errorText(map, code, fallback)` เพิ่ม key ที่ `th.ts` ก่อนแล้ว tsc จะบังคับให้เติม `en.ts` admin (`app/admin`, `components/admin`, `lib/admin-stats`) และ metadata/OG คงภาษาไทย, `public/sw.js` เขียนสองภาษาในบรรทัดเดียว
