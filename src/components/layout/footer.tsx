"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">BookFlow</span>
            </div>
            <p className="text-white/70 text-sm">
              {t("tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t("services")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{t("onlineBooking")}</li>
              <li>{t("scheduleManagement")}</li>
              <li>{t("customerManagement")}</li>
              <li>{t("aiAnalytics")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t("contact")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@bookflow.jp</li>
              <li>03-1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
