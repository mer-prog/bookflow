"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LanguageToggle } from "@/components/layout/language-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("registerError"));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("autoLoginError"));
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="header" />
      </div>
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-navy">{t("registerTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("registerSubtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            id="email"
            label={t("email")}
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            id="phone"
            label={t("phone")}
            type="tel"
            placeholder={t("phonePlaceholder")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            id="password"
            label={t("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("registering") : t("createAccount")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-mint hover:underline font-medium">
            {t("loginLink")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
