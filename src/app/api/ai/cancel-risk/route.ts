import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getRiskFactors } from "@/lib/cancel-risk";
import { requireAdmin } from "@/lib/api-auth";

const suggestedActions = {
  ja: {
    highWithHistory: "予約24時間前にリマインドを送信し、デポジットの事前徴収を検討してください。",
    highDefault: "予約24時間前にリマインドを送信し、柔軟な日程変更オプションを提案してください。",
    mediumSameDay: "当日予約の来店意思を確認するメッセージを送信してください。",
    mediumDefault: "前日にリマインドを送信し、予約の確認を行ってください。",
    lowDefault: "特別な対応は不要です。通常のリマインド対応で問題ありません。",
  },
  en: {
    highWithHistory: "Send a reminder 24 hours before the appointment and consider requiring a deposit.",
    highDefault: "Send a reminder 24 hours before the appointment and offer flexible rescheduling options.",
    mediumSameDay: "Send a message to confirm the customer's intention to attend the same-day booking.",
    mediumDefault: "Send a reminder the day before and confirm the booking.",
    lowDefault: "No special action needed. Standard reminder procedures are sufficient.",
  },
};

function getSuggestedAction(risk: string, riskFactors: string[], pastCancellations: number, totalBookings: number, locale: string = "ja"): string {
  const cancelRate = totalBookings > 0 ? pastCancellations / totalBookings : 0;
  const msgs = locale === "en" ? suggestedActions.en : suggestedActions.ja;

  if (risk === "HIGH") {
    if (cancelRate > 0.3) {
      return msgs.highWithHistory;
    }
    return msgs.highDefault;
  }

  if (risk === "MEDIUM") {
    const sameDayKeywords = locale === "en"
      ? ["same-day", "last-minute"]
      : ["当日", "直前"];
    if (riskFactors.some((f) => sameDayKeywords.some((kw) => f.toLowerCase().includes(kw)))) {
      return msgs.mediumSameDay;
    }
    return msgs.mediumDefault;
  }

  return msgs.lowDefault;
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { bookingId, locale = "ja" } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      staff: true,
      customer: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
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
  }, locale);

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return rule-based explanation without AI
    let explanation: string;
    if (locale === "en") {
      explanation = riskFactors.length > 0
        ? `Risk factors for this booking: ${riskFactors.join(", ")}. Risk level: ${booking.cancelRisk}`
        : `The cancellation risk for this booking is ${booking.cancelRisk === "LOW" ? "low" : booking.cancelRisk === "MEDIUM" ? "moderate" : "high"}. No specific risk factors detected.`;
    } else {
      explanation = riskFactors.length > 0
        ? `この予約のリスク要因: ${riskFactors.join("、")}。リスクレベル: ${booking.cancelRisk}`
        : `この予約のキャンセルリスクは${booking.cancelRisk === "LOW" ? "低い" : booking.cancelRisk === "MEDIUM" ? "中程度" : "高い"}です。特定のリスク要因は検出されませんでした。`;
    }

    const suggestedAction = getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings, locale);

    return NextResponse.json({ explanation, factors: riskFactors, suggestedAction });
  }

  try {
    const client = new Anthropic({ apiKey });

    const isEn = locale === "en";
    const dateFmt = isEn ? "en-US" : "ja-JP";
    const prompt = isEn
      ? `You are an AI assistant for a booking management system. Based on the booking information and risk factors below, respond in two sections.

Booking Information:
- Service: ${booking.service.name}
- Staff: ${booking.staff.name}
- Date/Time: ${booking.date.toLocaleDateString(dateFmt)} ${booking.startTime}
- Customer: ${booking.customerName}
- Risk Level: ${booking.cancelRisk}
- Booking Created: ${booking.createdAt.toLocaleString(dateFmt)}

Risk Factors: ${riskFactors.length > 0 ? riskFactors.join(", ") : "None"}

Customer History:
- Total Bookings: ${totalBookings}
- Cancellations: ${pastCancellations}

Respond in the following JSON format only (no other text):
{
  "explanation": "Briefly explain the cancellation risk reason in 2-3 sentences in English",
  "suggestedAction": "Describe recommended action in 1-2 sentences in English. Example: Send a reminder 24 hours before the appointment and offer rescheduling options"
}`
      : `あなたは予約管理システムのAIアシスタントです。以下の予約情報とリスク要因に基づいて、2つのセクションに分けて回答してください。

予約情報:
- サービス: ${booking.service.name}
- スタッフ: ${booking.staff.name}
- 日時: ${booking.date.toLocaleDateString(dateFmt)} ${booking.startTime}
- 顧客名: ${booking.customerName}
- リスクレベル: ${booking.cancelRisk}
- 予約作成日時: ${booking.createdAt.toLocaleString(dateFmt)}

リスク要因: ${riskFactors.length > 0 ? riskFactors.join("、") : "なし"}

顧客履歴:
- 過去の予約数: ${totalBookings}
- キャンセル数: ${pastCancellations}

以下のJSON形式で回答してください（他のテキストは不要）:
{
  "explanation": "キャンセルリスクの理由を2-3文の日本語で簡潔に説明",
  "suggestedAction": "推奨アクションを1-2文の日本語で具体的に記述。例: 予約24時間前にリマインドを送信し、日程変更オプションを提案してください"
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
        suggestedAction: parsed.suggestedAction || getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings, locale),
      });
    } catch {
      // If JSON parsing fails, use text as explanation with rule-based action
      return NextResponse.json({
        explanation: text,
        factors: riskFactors,
        suggestedAction: getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings, locale),
      });
    }
  } catch {
    // Fallback to rule-based explanation
    const explanation = locale === "en"
      ? (riskFactors.length > 0
          ? `Risk factors for this booking: ${riskFactors.join(", ")}. Risk level: ${booking.cancelRisk}`
          : `The cancellation risk for this booking is low.`)
      : (riskFactors.length > 0
          ? `この予約のリスク要因: ${riskFactors.join("、")}。リスクレベル: ${booking.cancelRisk}`
          : `この予約のキャンセルリスクは低いです。`);

    return NextResponse.json({
      explanation,
      factors: riskFactors,
      suggestedAction: getSuggestedAction(booking.cancelRisk, riskFactors, pastCancellations, totalBookings, locale),
    });
  }
}
