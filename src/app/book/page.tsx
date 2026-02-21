"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StepIndicator } from "@/components/booking/step-indicator";
import { ServiceSelect } from "@/components/booking/service-select";
import { DatetimeSelect } from "@/components/booking/datetime-select";
import { CustomerForm } from "@/components/booking/customer-form";
import { BookingConfirm } from "@/components/booking/booking-confirm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ServiceWithStaff } from "@/types";

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceWithStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  const selectedService = services.find((s) => s.id === serviceId) || null;
  const staffForService = selectedService
    ? selectedService.staffServices.map((ss) => ss.staff)
    : [];
  const selectedStaff = staffForService.find((s) => s.id === staffId) || null;

  const canNext = () => {
    switch (step) {
      case 1:
        return !!serviceId;
      case 2:
        return !!staffId && !!date && !!time;
      case 3:
        return !!customer.customerName && !!customer.customerEmail;
      default:
        return true;
    }
  };

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          staffId,
          date,
          time,
          ...customer,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "予約に失敗しました");
        setSubmitting(false);
        return;
      }

      const booking = await res.json();
      router.push(`/booking/${booking.id}`);
    } catch {
      setError("予約に失敗しました。もう一度お試しください。");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        <Card>
          {step === 1 && (
            <ServiceSelect
              services={services}
              selectedId={serviceId}
              onSelect={(id) => {
                setServiceId(id);
                setStaffId("");
                setTime("");
              }}
            />
          )}

          {step === 2 && (
            <DatetimeSelect
              serviceId={serviceId}
              staffId={staffId}
              selectedDate={date}
              selectedTime={time}
              onSelectDate={setDate}
              onSelectTime={setTime}
              onSelectStaff={setStaffId}
              staff={staffForService}
            />
          )}

          {step === 3 && <CustomerForm data={customer} onChange={setCustomer} />}

          {step === 4 && (
            <BookingConfirm
              service={selectedService}
              staff={selectedStaff}
              date={date}
              time={time}
              customer={customer}
            />
          )}

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mt-4">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                戻る
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                variant="primary"
                disabled={!canNext()}
                onClick={() => setStep(step + 1)}
              >
                次へ
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "予約中..." : "予約を確定する"}
              </Button>
            )}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
