export const FIND_ERRORS: Record<string, string> = {
  rate_limited: "กดหาห้องถี่ไปหน่อย รอสักครู่แล้วลองใหม่นะ",
  nickname_not_allowed: "นามแฝงนี้ใช้ไม่ได้ ลองเปลี่ยนชื่อใหม่นะ",
  invalid_nickname: "นามแฝงต้องมี 1–24 ตัวอักษร",
};
export const FIND_ERROR_FALLBACK = "หาห้องไม่สำเร็จ ลองใหม่อีกครั้งนะ";

export const SEND_ERRORS: Record<string, string> = {
  rate_limited: "ส่งถี่ไปหน่อย รอแป๊บแล้วกดส่งอีกที",
  not_in_chat: "ห้องนี้ปิดแล้ว",
  offline: "ยังต่อเน็ตไม่ติด รอแป๊บแล้วส่งอีกที",
};
export const SEND_ERROR_FALLBACK = "ส่งข้อความไม่สำเร็จ ลองอีกครั้งนะ";

export const ADD_TRACK_ERRORS: Record<string, string> = {
  invalid_url: "ลิงก์นี้ไม่ใช่ลิงก์ YouTube ที่ใช้ได้",
  video_unavailable: "คลิปนี้ไม่มีอยู่ หรือไม่อนุญาตให้เล่นนอก YouTube",
  queue_full: "คิวเต็มแล้ว ลองลบเพลงออกก่อนนะ",
  not_in_chat: "ห้องนี้ปิดแล้ว",
  rate_limited: "เพิ่มเพลงถี่ไปหน่อย รอสักครู่นะ",
};
export const ADD_TRACK_ERROR_FALLBACK = "เพิ่มเพลงไม่สำเร็จ ลองใหม่อีกครั้งนะ";

export const LOGIN_ERRORS: Record<string, string> = {
  not_student_email: "ใช้ได้เฉพาะอีเมลนักศึกษา สจล. (รหัสนักศึกษา@kmitl.ac.th)",
  unknown_faculty: "ยังไม่รู้จักรหัสคณะของเธอ แจ้งทีมงานให้เพิ่มได้เลย",
  email_not_verified: "อีเมลนี้ยังไม่ได้ยืนยันกับ Google",
  invalid_credential: "ยืนยันตัวตนกับ Google ไม่สำเร็จ ลองใหม่อีกครั้งนะ",
  google_login_disabled: "เซิร์ฟเวอร์ยังไม่ได้เปิดใช้การล็อกอินด้วย Google",
};
export const LOGIN_ERROR_FALLBACK = "ล็อกอินไม่สำเร็จ ลองใหม่อีกครั้งนะ";

export const DISCONNECTED_MESSAGE = "หลุดการเชื่อมต่อ ลองหาห้องใหม่อีกครั้งนะ";
export const SESSION_EXPIRED_MESSAGE = "เซสชันหมดอายุ ล็อกอินใหม่อีกครั้งนะ";
export const LOGIN_NOT_CONFIGURED_MESSAGE =
  "เซิร์ฟเวอร์บังคับล็อกอินแล้ว แต่หน้าเว็บยังไม่ได้ตั้ง NEXT_PUBLIC_GOOGLE_CLIENT_ID";

export const CALL_ERRORS: Record<string, string> = {
  too_early: "คุยกันอีกนิดก่อนนะ ส่งข้อความกันครบ 5 ข้อความแล้วถึงจะโทรได้",
  busy: "มีสายค้างอยู่แล้ว",
  rate_limited: "โทรถี่ไปหน่อย รอสักครู่แล้วลองใหม่นะ",
  not_in_chat: "ห้องนี้ปิดแล้ว",
};
export const CALL_ERROR_FALLBACK = "โทรไม่สำเร็จ ลองใหม่อีกครั้งนะ";

export const CALL_ENDED: Record<string, string> = {
  hangup: "อีกฝ่ายวางสายแล้ว",
  declined: "อีกฝ่ายยังไม่สะดวกรับสาย",
  no_answer: "ไม่มีคนรับสาย",
};

export const CALL_MIC_BLOCKED =
  "ใช้ไมค์ไม่ได้ ลองอนุญาตไมโครโฟนให้เว็บนี้ในตั้งค่าเบราว์เซอร์ก่อนนะ";
export const CALL_FAILED =
  "ต่อสายไม่ติด เครือข่ายของฝั่งใดฝั่งหนึ่งอาจไม่เปิดให้คุยเสียง";
