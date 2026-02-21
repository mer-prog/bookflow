"use client";

import { Input } from "@/components/ui/input";

interface Props {
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
  };
  onChange: (data: Props["data"]) => void;
}

export function CustomerForm({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">お客様情報</h2>
      <div className="space-y-4">
        <Input
          id="name"
          label="お名前 *"
          placeholder="山田太郎"
          value={data.customerName}
          onChange={(e) => onChange({ ...data, customerName: e.target.value })}
          required
        />
        <Input
          id="email"
          label="メールアドレス *"
          type="email"
          placeholder="example@email.com"
          value={data.customerEmail}
          onChange={(e) => onChange({ ...data, customerEmail: e.target.value })}
          required
        />
        <Input
          id="phone"
          label="電話番号"
          type="tel"
          placeholder="090-1234-5678"
          value={data.customerPhone}
          onChange={(e) => onChange({ ...data, customerPhone: e.target.value })}
        />
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
            備考
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="ご要望やアレルギーなど"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
