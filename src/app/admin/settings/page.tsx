"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HoursForm } from "@/components/admin/hours-form";
import type { BusinessHours } from "@/types";

interface BusinessData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  businessHours: BusinessHours;
}

export default function AdminSettingsPage() {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setBusiness(data);
        setLoading(false);
      });
  }, []);

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    setSaving(true);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: business.name,
        description: business.description,
        address: business.address,
        phone: business.phone,
        email: business.email,
      }),
    });

    if (res.ok) {
      setSuccess("ビジネス情報を保存しました");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  }

  async function handleSaveHours(hours: BusinessHours) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessHours: hours }),
    });

    if (res.ok) {
      setSuccess("営業時間を保存しました");
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">設定</h1>
        <p className="text-muted-foreground text-sm mt-1">ビジネス情報と営業時間</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3">
          {success}
        </div>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-navy mb-4">ビジネス情報</h2>
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <Input
            id="bname"
            label="店舗名"
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
          />
          <div>
            <label htmlFor="bdesc" className="block text-sm font-medium mb-1">
              説明
            </label>
            <textarea
              id="bdesc"
              rows={2}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50"
              value={business.description || ""}
              onChange={(e) => setBusiness({ ...business, description: e.target.value })}
            />
          </div>
          <Input
            id="address"
            label="住所"
            value={business.address || ""}
            onChange={(e) => setBusiness({ ...business, address: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="bphone"
              label="電話番号"
              value={business.phone || ""}
              onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
            />
            <Input
              id="bemail"
              label="メールアドレス"
              type="email"
              value={business.email || ""}
              onChange={(e) => setBusiness({ ...business, email: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "情報を保存"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy mb-4">営業時間</h2>
        <HoursForm initial={business.businessHours} onSave={handleSaveHours} />
      </Card>
    </div>
  );
}
