export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(cents: number): string {
  return `¥${cents.toLocaleString()}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getDayName(date: Date): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
}

export function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "保留中",
  CONFIRMED: "確定",
  CANCELLED: "キャンセル",
  COMPLETED: "完了",
  NO_SHOW: "無断キャンセル",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
};

export const RISK_LABELS: Record<string, string> = {
  LOW: "低リスク",
  MEDIUM: "中リスク",
  HIGH: "高リスク",
};

export const RISK_COLORS: Record<string, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};
