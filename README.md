<div align="center">

# BookFlow

### AI-Powered Smart Booking Management Platform

**美容院・サロン・クリニック向け — キャンセルリスクをAIが事前予測し、売上損失を未然に防ぐ次世代SaaS**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<br />

[**Live Demo**](https://bookflow-five.vercel.app) · [**Features**](#features) · [**Architecture**](#architecture) · [**Getting Started**](#getting-started) · [**API Reference**](#api-reference)

<br />

</div>

---

## Why BookFlow?

美容業界では**無断キャンセル・ノーショー**による売上損失が深刻な課題です。業界平均で予約の**10〜15%**がキャンセルされ、年間数百万円の機会損失が発生しています。

BookFlowは**ルールベースエンジン + Claude AI**のハイブリッドアプローチで、予約時点でキャンセルリスクを即座に判定。高リスク予約には事前リマインドや前金回収を提案し、**無断キャンセルを未然に防止**します。

<br />

## Skills Demonstrated

| Skill | Implementation |
|:---|:---|
| **AI活用 (Claude API)** | ルールベースエンジン + Claude Haiku のハイブリッドリスク判定。自然言語での要因分析・推奨アクション生成 |
| **多言語対応 (i18n)** | next-intlによる日英切替、公開予約ページのAccept-Language自動検出、日付・時刻のロケール別フォーマット（24h ↔ 12h AM/PM） |

<br />

## Features

### Core

| Feature | Description | Status |
|:---|:---|:---|
| **Dashboard** | 本日の予約数・週間売上・キャンセル率推移をリアルタイム表示。要注意予約をハイライト | ✅ 実装済 |
| **Calendar View** | 週表示/日表示の切り替え。スタッフ別フィルター・定休日の自動グレーアウト | ✅ 実装済 |
| **Booking Management** | ステータス別フィルター（確認済 / 完了 / キャンセル / ノーショー）、一括管理 | ✅ 実装済 |
| **Online Booking** | 4ステップのガイド付き予約フロー（サービス選択 → 日時 → 顧客情報 → 確認） | ✅ 実装済 |
| **Service Catalog** | サービスの作成・編集・無効化。料金・所要時間・担当スタッフの紐づけ | ✅ 実装済 |
| **Business Settings** | 店舗情報・営業時間・定休日のフレキシブル設定 | ✅ 実装済 |
| **多言語対応（JP/EN）** | 管理画面・公開予約ページともに日英切替対応。Accept-Language自動検出 | ✅ 実装済 |

### AI Cancel Risk Prediction

```
┌─────────────────────────────────────────────────────────┐
│                  Risk Scoring Engine                     │
│                                                         │
│  Factor              Weight    Condition                │
│  ─────────────────   ──────    ──────────────────────   │
│  Lead Time           0-40pt    < 2h → 40pt             │
│                                < 24h → 25pt            │
│                                < 72h → 10pt            │
│                                                         │
│  Cancel History      0-35pt    > 30% → 35pt            │
│                                > 15% → 20pt            │
│                                > 0%  → 5pt             │
│                                                         │
│  Day of Week         0-10pt    Mon/Fri → 10pt          │
│                                                         │
│  Time of Day         0-15pt    < 10:00 or ≥ 17:00      │
│                                → 15pt                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  Total Score:  ≥ 60 → HIGH  |  ≥ 30 → MEDIUM  |  LOW  │
└─────────────────────────────────────────────────────────┘
```

- **Rule-Based Engine** — 予約メタデータから4つの因子を即時スコアリング（レイテンシ < 5ms）
- **Claude AI Enhancement** — ルールベースの判定結果に対し、Claude Haiku が自然言語で要因分析・推奨アクションを生成
- **Actionable Insights** — HIGH判定時に「前金回収」「当日リマインド送信」等の具体的アクションを自動提案（推奨アクションは日英両対応）

<br />

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Landing Page   │  │ Booking Flow │  │  Admin Dashboard │  │
│  │  (Public)       │  │ (Public)     │  │  (Protected)     │  │
│  └────────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼───────────────────────────────┐
│                    Next.js 16 (App Router)                    │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Middleware  │  │  API Routes  │  │  Server Components  │  │
│  │  (Auth Gate) │  │  (14 endpoints)│  │  (SSR / RSC)       │  │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────────┘  │
│         │                │                                    │
│  ┌──────▼──────┐  ┌──────▼───────┐  ┌─────────────────────┐  │
│  │  NextAuth   │  │  Prisma ORM  │  │  Cancel Risk Engine │  │
│  │  (JWT/RBAC) │  │  (Type-safe) │  │  (Rule + AI Hybrid) │  │
│  └─────────────┘  └──────┬───────┘  └──────────┬──────────┘  │
└──────────────────────────┼──────────────────────┼────────────┘
                           │                      │
              ┌────────────▼──────┐    ┌──────────▼──────────┐
              │   PostgreSQL      │    │   Anthropic API     │
              │   (Neon)          │    │   (Claude Haiku)    │
              └───────────────────┘    └─────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|:---|:---|:---|
| **Framework** | Next.js 16 (App Router) | RSC + API Routes統合で BFF不要。Vercelとのゼロコンフィグデプロイ |
| **ORM** | Prisma 7 | 型安全なDB操作。スキーマからTypeScript型を自動生成 |
| **Auth** | NextAuth.js v5 | JWT + RBAC（ADMIN/CUSTOMER）。Middlewareでルート保護 |
| **DB** | PostgreSQL (Neon) | サーバーレスPostgreSQL。コールドスタート < 150ms |
| **AI** | Claude Haiku (Anthropic) | 高精度 × 低レイテンシ × 低コスト。リスク説明の自然言語生成に最適 |
| **Styling** | Tailwind CSS 4 | ユーティリティファースト。デザイントークンをCSS変数で一元管理 |
| **Charts** | Recharts 3 | React-native SVGチャート。SSR互換でバンドルサイズ軽量 |
| **i18n** | next-intl | App Router対応。cookieベースのロケール管理でURLパス不要 |
| **公開予約ページのAccept-Language自動検出** | Browser Accept-Language | エンドユーザー（一般客）は言語設定を手動で変えない。ブラウザ設定から自動推定が最適UX |
| **カレンダー週始まりのロケール連動（月曜 ↔ 日曜）** | Locale-aware | 日本の商習慣は月曜始まり、英語圏は日曜始まり。予約UXに直結する差異 |

<br />

## Tech Stack

```
Frontend        Next.js 16  ·  React 19  ·  TypeScript 5  ·  Tailwind CSS 4  ·  Recharts 3
Backend         Next.js API Routes  ·  NextAuth.js v5 (JWT)  ·  bcryptjs
Database        PostgreSQL (Neon Serverless)  ·  Prisma 7 ORM
AI              Anthropic Claude Haiku  ·  Rule-Based Risk Engine
i18n            next-intl  ·  Accept-Language Auto-Detection  ·  Cookie-Based Locale
Infrastructure  Vercel (Edge Network)  ·  Neon (Serverless PostgreSQL)
Security        RBAC Middleware  ·  bcrypt (12 rounds)  ·  CSRF Protection  ·  Security Headers
```

<br />

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** (or [Neon](https://neon.tech/) free tier)
- **Anthropic API Key** (optional — AI説明機能用)

### 1. Clone & Install

```bash
git clone https://github.com/mer-prog/bookflow.git
cd bookflow
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

```env
# Database (Neon recommended)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth
NEXTAUTH_SECRET="openssl rand -base64 32 で生成"
NEXTAUTH_URL="http://localhost:3000"

# AI (Optional)
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Database Setup

```bash
# スキーマをDBに反映
npx prisma db push

# シードデータ投入（70件のテスト予約）
npm run db:seed
```

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

### Demo Credentials

| Role | Email | Password |
|:---|:---|:---|
| Admin | `admin@bloom.com` | `password123` |
| Customer | `customer@bloom.com` | `password123` |

<br />

## Project Structure

```
bookflow/
├── prisma/
│   ├── schema.prisma          # データモデル定義（7モデル）
│   └── seed.mjs               # テストデータ（70予約・5サービス・3スタッフ）
│
├── src/
│   ├── app/
│   │   ├── api/               # REST API（14エンドポイント）
│   │   │   ├── auth/          #   認証（NextAuth）
│   │   │   ├── admin/         #   管理者API（stats / services / settings / cancel-trend）
│   │   │   ├── ai/            #   AIリスク分析
│   │   │   ├── bookings/      #   予約CRUD
│   │   │   ├── services/      #   サービス一覧
│   │   │   ├── staff/         #   スタッフ一覧
│   │   │   └── timeslots/     #   空き枠取得
│   │   │
│   │   ├── admin/             # 管理画面
│   │   │   ├── page.tsx       #   ダッシュボード
│   │   │   ├── bookings/      #   予約管理
│   │   │   ├── calendar/      #   カレンダー
│   │   │   ├── services/      #   サービス管理
│   │   │   └── settings/      #   設定
│   │   │
│   │   ├── book/              # 公開予約フロー
│   │   ├── login/             # ログイン
│   │   └── register/          # ユーザー登録
│   │
│   ├── components/
│   │   ├── ui/                # 汎用UIコンポーネント（6種）
│   │   ├── admin/             # 管理画面コンポーネント（9種）
│   │   ├── booking/           # 予約フローコンポーネント（5種）
│   │   ├── ai/                # AIリスク説明
│   │   └── layout/            # レイアウト（Header / Footer / Sidebar）
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth設定
│   │   ├── prisma.ts          # Prismaクライアント
│   │   ├── cancel-risk.ts     # リスクスコアリングエンジン（日英対応）
│   │   └── utils.ts           # ユーティリティ関数（ロケール別フォーマット）
│   │
│   ├── i18n/                  # 多言語対応（next-intl）
│   │   ├── config.ts          #   ロケール定義（ja / en）
│   │   ├── request.ts         #   サーバーサイドロケール解決
│   │   ├── locale-context.tsx  #   クライアントサイドロケール管理
│   │   └── locale-sync.tsx    #   localStorage ↔ cookie 同期
│   │
│   ├── messages/              # 翻訳ファイル
│   │   ├── ja.json            #   日本語
│   │   └── en.json            #   English
│   │
│   ├── types/                 # TypeScript型定義
│   └── middleware.ts          # ルート保護（RBAC）
│
├── next.config.ts             # セキュリティヘッダー設定
├── tailwind + postcss         # スタイリング設定
└── package.json
```

<br />

## API Reference

### Authentication

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth — ログイン / セッション管理 |
| `POST` | `/api/register` | 新規ユーザー登録 |

### Bookings

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/bookings` | 予約一覧取得（ロールベースフィルター） |
| `POST` | `/api/bookings` | 新規予約作成 + リスク自動算出 |
| `GET` | `/api/bookings/:id` | 予約詳細取得 |
| `PATCH` | `/api/bookings/:id` | ステータス更新 |
| `POST` | `/api/bookings/:id/cancel` | 予約キャンセル |

### Public

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/services` | サービス一覧 |
| `GET` | `/api/staff` | スタッフ一覧 |
| `GET` | `/api/timeslots` | 空き枠照会 |

### Admin (Protected)

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/admin/stats` | ダッシュボード統計 |
| `GET` | `/api/admin/cancel-trend` | キャンセル率推移データ |
| `GET` `POST` | `/api/admin/services` | サービスCRUD |
| `PATCH` | `/api/admin/services/:id` | サービス更新 |
| `GET` `PUT` | `/api/admin/settings` | 店舗設定・営業時間 |

### AI

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/ai/cancel-risk` | AIリスク要因分析 + 推奨アクション生成 |

<br />

## Database Schema

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Business   │       │   Service    │       │    Staff    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id           │◄──┐   │ id           │   ┌──►│ id          │
│ name         │   │   │ businessId ──┼───┘   │ businessId  │
│ description  │   │   │ name         │       │ name        │
│ address      │   │   │ duration     │       │ email       │
│ phone        │   │   │ price        │       │ active      │
│ email        │   │   │ active       │       └──────┬──────┘
│ businessHours│   │   └──────┬───────┘              │
└──────┬───────┘   │          │                      │
       │           │   ┌──────▼───────┐              │
       │           │   │ StaffService │              │
       │           │   ├──────────────┤              │
       │           │   │ staffId    ──┼──────────────┘
       │           │   │ serviceId    │
       │           │   └──────────────┘
       │           │
┌──────▼───────┐   │   ┌──────────────┐       ┌─────────────┐
│     User     │   │   │   Booking    │       │  TimeSlot   │
├──────────────┤   │   ├──────────────┤       ├─────────────┤
│ id           │   ├───┤ businessId   │       │ id          │
│ email        │   │   │ serviceId    │       │ staffId     │
│ password     │   │   │ staffId      │       │ date        │
│ name         │   │   │ customerId ──┼──►User│ startTime   │
│ phone        │   │   │ date         │       │ endTime     │
│ role (RBAC)  │   │   │ startTime    │       │ isAvailable │
│ businessId ──┼───┘   │ endTime      │       └─────────────┘
└──────────────┘       │ status       │
                       │ cancelRisk   │
                       │ cancelReason │
                       │ notes        │
                       └──────────────┘

Enums:
  Role          → ADMIN | CUSTOMER
  BookingStatus → PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
  CancelRisk    → LOW | MEDIUM | HIGH
```

<br />

## Design System

### Color Palette

| Token | Hex | Usage |
|:---|:---|:---|
| `navy` | `#1E3A5F` | Primary — ヘッダー・見出し・CTA背景 |
| `navy-light` | `#2A4F7F` | Hover states |
| `navy-dark` | `#152D4A` | Active states |
| `mint` | `#4ECDC4` | Accent — ボタン・アイコン・ハイライト |
| `mint-light` | `#7EDDD6` | Hover accent |
| `mint-dark` | `#3BADA5` | Active accent |
| `background` | `#FFFFFF` | Page background |
| `muted` | `#F5F5F5` | Section backgrounds |
| `border` | `#E5E5E5` | Dividers / card borders |
| `destructive` | `#EF4444` | Error / cancel actions |
| `warning` | `#F59E0B` | Medium risk / alerts |
| `success` | `#22C55E` | Confirmed / completed |

### Component Library

```
UI Components (6)           Admin Components (9)        Booking Components (5)
─────────────────           ────────────────────        ──────────────────────
Button (4 variants)         StatsCards                  StepIndicator
Card                        TodayBookings               ServiceSelect
Input                       AtRiskBookings              DatetimeSelect
Badge                       CancelRateChart             CustomerForm
Modal                       BookingTable                BookingConfirm
Select                      CancelRiskBadge
                            CalendarView
                            ServiceForm
                            HoursForm
```

<br />

## Security

| Layer | Implementation |
|:---|:---|
| **Authentication** | NextAuth.js v5 — Credentials Provider + JWT sessions |
| **Password Hashing** | bcryptjs — 12 rounds salt |
| **Authorization** | RBAC Middleware — ADMIN / CUSTOMER ロール分離 |
| **Route Protection** | Next.js Middleware — `/admin/*` を未認証・非ADMINからガード |
| **HTTP Headers** | `X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `X-XSS-Protection` · `Referrer-Policy` · `Permissions-Policy` |
| **Input Validation** | サーバーサイドバリデーション — 全APIエンドポイントで実施 |
| **SQL Injection** | Prisma ORM — パラメータ化クエリによる自動防御 |

<br />

## Scripts

```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint 実行
npm run db:push      # Prisma スキーマを DB に反映
npm run db:seed      # テストデータ投入（70件）
npm run db:reset     # DB リセット + 再シード
```

<br />

## License

[MIT](LICENSE)

<br />

<div align="center">

Built with [Next.js](https://nextjs.org/) · [Prisma](https://www.prisma.io/) · [Neon](https://neon.tech/) · [Claude AI](https://www.anthropic.com/)

</div>
