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

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("loginError"));
    } else {
      router.push("/admin");
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
          <h1 className="text-2xl font-bold text-navy">{t("loginTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("loginSubtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label={t("email")}
            type="email"
            placeholder="admin@bloom.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label={t("password")}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loggingIn") : t("loginButton")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-mint hover:underline font-medium">
            {t("registerLink")}
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {t("demo")}
          </p>
        </div>
      </Card>
    </div>
  );
}
