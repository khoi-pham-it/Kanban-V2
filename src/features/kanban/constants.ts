/** Preset nhãn dán cho Card - dùng chung trong CardModal và TaskCard */
export const LABEL_PRESETS = [
  { key: "Đỏ", className: "bg-red-500" },
  { key: "Vàng", className: "bg-yellow-500" },
  { key: "Xanh", className: "bg-emerald-500" },
  { key: "Tím", className: "bg-violet-500" },
  { key: "Xám", className: "bg-slate-500" },
] as const;

const LABEL_CLASS_MAP: Record<string, string> = Object.fromEntries(
  LABEL_PRESETS.map((p) => [p.key, p.className])
);

/** Trả về class Tailwind cho nền theo tên nhãn (chip hoặc thanh màu) */
export function getLabelClassName(labelKey: string): string {
  return LABEL_CLASS_MAP[labelKey] ?? "bg-slate-500";
}
