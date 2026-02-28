"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ServiceForm } from "@/components/admin/service-form";
import { formatPrice, formatDuration } from "@/lib/utils";

interface ServiceData {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
}

export default function AdminServicesPage() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ServiceData | null>(null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  async function handleCreate(data: { name: string; description: string; duration: string; price: string }) {
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const created = await res.json();
      setServices((prev) => [created, ...prev]);
      setShowForm(false);
    }
  }

  async function handleUpdate(data: { id?: string; name: string; description: string; duration: string; price: string }) {
    if (!data.id) return;
    const res = await fetch(`/api/admin/services/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setServices((prev) => prev.map((s) => (s.id === data.id ? updated : s)));
      setEditing(null);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !active } : s))
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("count", { count: services.length })}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>{t("addNew")}</Button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={t("addTitle")}>
        <ServiceForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={t("editTitle")}
      >
        {editing && (
          <ServiceForm
            initial={{
              id: editing.id,
              name: editing.name,
              description: editing.description || "",
              duration: String(editing.duration),
              price: String(editing.price),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-navy">{service.name}</h3>
                  <Badge variant={service.active ? "success" : "default"}>
                    {service.active ? t("active") : t("inactive")}
                  </Badge>
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{formatDuration(service.duration, locale)}</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(service)}>
                  {tCommon("edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(service.id, service.active)}
                >
                  {service.active ? t("deactivate") : t("activate")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
