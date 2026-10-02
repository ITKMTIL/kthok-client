export const MAX_NICKNAME_LENGTH = 24;

const HEADS = ["ชาไทย", "หมูกรอบ", "ไข่เจียว", "โกโก้", "มาม่า", "ลูกชิ้น", "ชานม", "กะเพรา", "ปังปิ้ง", "น้ำแดง"];
const TAILS = ["ง่วงนอน", "ขี้เหงา", "สายชิล", "ติดแล็บ", "ตื่นสาย", "หิวข้าว", "อ่านไม่ทัน", "รอรถไฟ", "ปั่นงาน", "นอนดึก"];

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomNickname(): string {
  return pick(HEADS) + pick(TAILS);
}
