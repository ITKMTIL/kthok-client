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
  - `music/`, `call/`, `share/`, `admin/`
  - `ui/` splash (GSAP), mascot (GSAP loops), hero, privacy-note, screen, slide-in, site-footer
- `hooks/`: `use-chat` (socket + reducer, revoke blob URL เสียง), `use-voice-call`, `use-voice-recorder`, `use-youtube-player` (sync 500ms, drift >2s, duck เสียง), `use-session`, `use-profile`, `use-notifications`, `use-visual-viewport`, ...
- `lib/`: `chat-reducer`, `config` (`NEXT_PUBLIC_*`), `storage` (`createStoredValue` + useSyncExternalStore), `sounds`, `share-image` (html-to-image 1080px), `voice*` (store ของ player/activity), `youtube-api`, `google-identity`, `admin-*`
- `constants/` faculties (ต้องตรงกับ core), messages (ข้อความ error ภาษาไทย), reactions
- `types/` chat, auth, admin

## Pattern

- state ห้องทั้งหมดผ่าน `chatReducer`; ค่าที่ต้องคงไว้ข้ามการหาห้องใหม่ (`callEnabled`, `voiceEnabled`, `blockEnabled`, `isAdmin`, `selfFaculty`, `online`) ต้อง copy ในทุก branch ที่ reset
- socket สร้างด้วย `useMemo` (`autoConnect: false`), handler ตั้งใน effect เดียว
- store ข้าม component ใช้ module + `useSyncExternalStore` (ดู `lib/voice-player.ts`)
- icon จาก lucide-react, ไม่มี emoji ใน UI
- อนิเมชัน: Motion (`motion/react`) สำหรับ UI, GSAP (`useGSAP`) สำหรับ splash/mascot
- ทุกปุ่ม/ไอคอนต้องมี `aria-label` ภาษาไทย
