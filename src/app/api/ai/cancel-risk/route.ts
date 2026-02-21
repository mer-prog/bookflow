import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getRiskFactors } from "@/lib/cancel-risk";

function getSuggestedAction(risk: string, riskFactors: string[], pastCancellations: number, totalBookings: number): string {
  const cancelRate = totalBookings > 0 ? pastCancellations / totalBookings : 0;

  if (risk === "HIGH") {
    if (cancelRate > 0.3) {
      return "Consider sending a confirmation reminder 24 hours before the appointment and requesting a deposit to reduce no-show risk.";
    }
    return "Consider sending a confirmation reminder 24 hours before the appointment and offering a flexible reschedule option.";
  }

  if (risk === "MEDIUM") {
    if (riskFactors.some((f) => f.includes("当日") || f.includes("直前"))) {
      return "Send a confirmation message to verify the customer still plans to attend the same-day booking.";
    }
    return "Consider sending a reminder the day before to confirm the appointment.";
  }

  return "No immediate action required. Standard reminder flow is sufficient.";
}

export async function POST(request: NextRequest) {
  const { bookingId } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, staff: true, customer: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Get customer history
  let pastCancellations = 0;
  let totalBookings = 0;
  if (booking.customerId) {
    totalBookings = await prisma.booking.count({
      where: { customerId: booking.customerId },
    });
    pastCancellations = await prisma.booking.count({
      where: { customerId: booking.customerId, status: "CANCELLED" },
    });
  }

  const riskFactors = getRiskFactors({
    bookingDate: booking.date,
    createdAt: booking.createdAt,
    startTime: booking.startTime,
    pastCancellations,
    totalBookings,
  });

  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return rule-based explanation without AI
    const explanation =
      riskFactors.length > 0
        ? `この予約のリスク要因: ${riskFactors.join("、")}。リスクレベル: ${booking.cancelRisk}`
        : `この予約のキャンセルリスクは${booking.cancelRisk === "LOW" ? "低い" : booking.cancelRisk === "MEDIUM" ? "中程度" : "高い"}です。特定のリスク要因は検出されませんでした。`;

    const suggestedAction = getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings);

    return NextResponse.json({ explanation, factors: riskFactors, suggestedAction });
  }

  try {
    const client = new Anthropic({ apiKey });

    const prompt = `あなたは予約管理システムのAIアシスタントです。以下の予約情報とリスク要因に基づいて、2つのセクションに分けて回答してください。

予約情報:
- サービス: ${booking.service.name}
- スタッフ: ${booking.staff.name}
- 日時: ${booking.date.toLocaleDateString("ja-JP")} ${booking.startTime}
- 顧客名: ${booking.customerName}
- リスクレベル: ${booking.cancelRisk}
- 予約作成日時: ${booking.createdAt.toLocaleString("ja-JP")}

リスク要因: ${riskFactors.length > 0 ? riskFactors.join("、") : "なし"}

顧客履歴:
- 過去の予約数: ${totalBookings}
- キャンセル数: ${pastCancellations}

以下のJSON形式で回答してください（他のテキストは不要）:
{
  "explanation": "キャンセルリスクの理由を2-3文の日本語で簡潔に説明",
  "suggestedAction": "推奨アクションを1-2文の英語で具体的に記述。例: Consider sending a confirmation reminder 24 hours before the appointment"
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({
        explanation: parsed.explanation || text,
        factors: riskFactors,
        suggestedAction: parsed.suggestedAction || getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings),
      });
    } catch {
      // If JSON parsing fails, use text as explanation with rule-based action
      return NextResponse.json({
        explanation: text,
        factors: riskFactors,
        suggestedAction: getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings),
      });
    }
  } catch {
    // Fallback to rule-based explanation
    const explanation =
      riskFactors.length > 0
        ? `この予約のリスク要因: ${riskFactors.join("、")}。リスクレベル: ${booking.cancelRisk}`
        : `この予約のキャンセルリスクは低いです。`;

    return NextResponse.json({
      explanation,
      factors: riskFactors,
      suggestedAction: getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings),
    });
  }
}
