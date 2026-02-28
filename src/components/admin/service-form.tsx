"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface ServiceData {
  id?: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}

interface Props {
  initial?: ServiceData;
  onSubmit: (data: ServiceData) => Promise<void>;
  onCancel: () => void;
}

export function ServiceForm({ initial, onSubmit, onCancel }: Props) {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const [form, setForm] = useState<ServiceData>(
    initial || { name: "", description: "", duration: "60", price: "5000" }
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label={t("serviceName")}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-foreground mb-1">
          {t("description")}
        </label>
        <textarea
          id="desc"
          rows={2}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="duration"
          label={t("duration")}
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          required
        />
        <Input
          id="price"
          label={t("priceYen")}
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? tCommon("saving") : initial?.id ? t("update") : t("add")}
        </Button>
      </div>
    </form>
  );
}
