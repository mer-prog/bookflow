"use client";

import { formatPrice, formatDuration } from "@/lib/utils";

interface Props {
  service: { name: string; duration: number; price: number } | null;
  staff: { name: string } | null;
  date: string;
  time: string;
  customer: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
  };
}

export function BookingConfirm({ service, staff, date, time, customer }: Props) {
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">予約内容の確認</h2>
      <div className="bg-muted rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">サービス</span>
          <span className="font-medium">{service?.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">所要時間</span>
          <span className="font-medium">{service ? formatDuration(service.duration) : ""}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">料金</span>
          <span className="font-bold text-navy">{service ? formatPrice(service.price) : ""}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">担当</span>
          <span className="font-medium">{staff?.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">日時</span>
          <span className="font-medium">
            {date ? formatDateLabel(date) : ""} {time}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">お名前</span>
          <span className="font-medium">{customer.customerName}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">メール</span>
          <span className="font-medium">{customer.customerEmail}</span>
        </div>
        {customer.customerPhone && (
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">電話番号</span>
            <span className="font-medium">{customer.customerPhone}</span>
          </div>
        )}
        {customer.notes && (
          <div className="py-2">
            <span className="text-sm text-muted-foreground">備考</span>
            <p className="font-medium mt-1">{customer.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
