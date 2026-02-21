# BookFlow - スマート予約管理プラットフォーム

美容院・サロン・クリニック向けのAI搭載予約管理SaaS。
キャンセルリスクをAIが事前予測し、無断キャンセルを防止します。

## デモ
https://bookflow-five.vercel.app

## 主な機能
- 📊 ダッシュボード（本日の予約・週間売上・キャンセル率推移）
- 📅 カレンダービュー（週表示・日表示）
- 📋 予約一覧（ステータスフィルター・リスク表示）
- 🤖 AIキャンセルリスク予測（HIGH/MEDIUM/LOW自動判定）
- 💡 リスク要因分析・推奨アクション提案
- 🔔 要注意予約へのリマインド送信
- ⚙️ サービス管理・営業時間設定

## 技術スタック
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Charts**: Recharts
- **Deploy**: Vercel

## セットアップ

### 環境変数
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=（オプション：AI説明機能用）

### 起動
npm install
npx prisma generate
npx prisma db push
npm run dev

## ライセンス
MIT
