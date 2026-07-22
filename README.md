[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# BookFlow

美容院・サロン・クリニック向けの AI キャンセルリスク予測付き予約管理プラットフォーム。

> AI-powered booking management platform for salons and clinics, with cancel-risk prediction.

[Live Demo](https://bookflow-five.vercel.app)

## 概要 / Overview

BookFlow は、無断キャンセル・ノーショーによる売上損失という美容業界の課題に対し、**ルールベースエンジン + Claude AI のハイブリッド**で予約時点のキャンセルリスクを判定する予約管理 SaaS です。ダブルブッキングを防ぐ枠競合チェック、ロールベースアクセス制御（ADMIN / CUSTOMER）、日英 i18n（Accept-Language 自動検出）を実装しています。

*BookFlow is a booking management SaaS that scores cancellation risk at booking time using a hybrid of a deterministic rule-based engine and Claude AI. It implements slot-conflict validation to prevent double bookings, role-based access control (ADMIN / CUSTOMER), and Japanese/English i18n with Accept-Language auto-detection.*

### 主な機能 / Features

- **ダブルブッキング防止** — 同一スタッフ・時間帯の重複予約を Serializable トランザクション内の競合チェックで拒否（`409`） / Double-booking prevention: slot-conflict check inside a Serializable transaction (returns `409`)
- **AI キャンセルリスク予測** — ルールベースの即時スコアリング + Claude Haiku による要因分析・推奨アクション生成（3段フォールバック付き） / Hybrid cancel-risk prediction: rule-based scoring + Claude Haiku analysis with a 3-tier fallback
- **管理ダッシュボード** — 本日の予約・売上・キャンセル率推移（Recharts）・要注意予約ハイライト / Admin dashboard with stats, cancel-rate trend, and at-risk booking highlights
- **カレンダー** — 週/日表示・スタッフ別フィルター・定休日グレーアウト / Week/day calendar with staff filter and closed-day handling
- **公開予約フロー** — 4ステップのガイド付き予約（サービス → 日時 → 顧客情報 → 確認） / 4-step guided public booking flow
- **RBAC** — NextAuth v5（JWT）+ Middleware で `/admin/*` を保護。顧客は自分の予約のみ閲覧・キャンセル可 / RBAC via NextAuth v5 (JWT) + middleware; customers can only view/cancel their own bookings
- **日英 i18n** — cookie ベース切替 + Accept-Language 自動検出。12h/24h 表記・週始まり（月/日）までロケール連動 / JA/EN i18n with locale-aware time format (12h/24h) and week start (Mon/Sun)

### 技術スタック / Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Recharts 3 |
| Backend | Next.js API Routes (14 endpoints), NextAuth.js v5 (JWT), bcryptjs |
| Database | PostgreSQL (Neon), Prisma 7 |
| AI | Anthropic Claude Haiku + rule-based risk engine |
| i18n | next-intl（cookie ベース・Accept-Language 自動検出） |
| Testing | Vitest |
| Infra | Vercel + Neon |

## アーキテクチャ / Architecture

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

### AI キャンセルリスク予測 / AI Cancel Risk Prediction

リスクスコアリングは以下の4因子による決定的なルールベース判定（`src/lib/cancel-risk.ts`）。外部 API に依存せず同期的にスコアを返します。

*Risk scoring is a deterministic rule-based engine (`src/lib/cancel-risk.ts`) over four factors — no external API dependency.*

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

このルールベース判定の上に、Claude Haiku が要因分析と推奨アクション（前金回収・当日リマインド等）を日英両対応の自然言語で生成します。**APIキー未設定・API 呼び出し失敗・レスポンス解析失敗の3段フォールバック**を実装しており、AI が使えない環境でも常にルールベース判定が返ります（`src/app/api/ai/cancel-risk/route.ts`）。

*On top of the rule-based result, Claude Haiku generates factor analysis and recommended actions in JA/EN. A 3-tier fallback (no API key / API failure / parse failure) guarantees the rule-based result is always returned even without AI.*

### プロジェクト構成 / Project Structure

```
bookflow/
├── prisma/
│   ├── schema.prisma          # データモデル定義（7モデル）
│   └── seed.mjs               # デモデータ（70予約・5サービス・3スタッフ）
│
├── src/
│   ├── app/
│   │   ├── api/               # REST API（14エンドポイント）
│   │   │   ├── auth/          #   認証（NextAuth）
│   │   │   ├── admin/         #   管理者API（stats / services / settings / cancel-trend）
│   │   │   ├── ai/            #   AIリスク分析
│   │   │   ├── bookings/      #   予約CRUD（枠競合チェック + テスト）
│   │   │   ├── services/      #   サービス一覧
│   │   │   ├── staff/         #   スタッフ一覧
│   │   │   └── timeslots/     #   空き枠取得
│   │   ├── admin/             # 管理画面（ダッシュボード / 予約 / カレンダー / サービス / 設定）
│   │   ├── book/              # 公開予約フロー
│   │   ├── login/             # ログイン
│   │   └── register/          # ユーザー登録
│   │
│   ├── components/            # UI（6）/ 管理画面（9）/ 予約フロー（5）/ AI / レイアウト
│   ├── lib/
│   │   ├── auth.ts            # NextAuth設定
│   │   ├── prisma.ts          # Prismaクライアント
│   │   ├── cancel-risk.ts     # リスクスコアリングエンジン（日英対応）
│   │   └── utils.ts           # ユーティリティ（時間帯重複判定・ロケール別フォーマット）
│   ├── i18n/                  # next-intl（ロケール解決・cookie同期）
│   ├── messages/              # 翻訳ファイル（ja / en）
│   ├── types/                 # 型定義
│   └── middleware.ts          # ルート保護（RBAC）
│
├── vitest.config.ts           # テスト設定
├── next.config.ts             # セキュリティヘッダー設定
└── package.json
```

## セットアップ / Getting Started

### 前提条件 / Prerequisites

- Node.js 18+
- PostgreSQL（[Neon](https://neon.tech/) free tier 可）
- Anthropic API Key（任意 — AI 説明機能用 / optional, for AI analysis）

### 手順 / Steps

```bash
# 1. クローンとインストール / Clone and install
git clone https://github.com/mer-prog/bookflow.git
cd bookflow
npm install

# 2. 環境変数 / Environment variables
cp .env.example .env
# DATABASE_URL / NEXTAUTH_SECRET を設定（ANTHROPIC_API_KEY は任意）

# 3. スキーマ反映とシード / Push schema and seed
npx prisma db push
npm run db:seed

# 4. 起動 / Run
npm run dev
# → http://localhost:3000
```

### デモアカウント / Demo Accounts

| Role | Email | Password |
|:---|:---|:---|
| Admin | `admin@bloom.com` | `password123` |
| Customer | `customer@bloom.com` | `password123` |

※ デモ専用の資格情報です。本番運用時は必ずシードデータの資格情報を変更してください。 / *Demo-only credentials — always change seeded credentials for production use.*

## テスト実行 / Running Tests

```bash
npm ci
npm test          # Vitest — 15 tests
npm run build
```

テストは予約ドメインの核である**ダブルブッキング防止**を重点的に検証しています。 / *Tests focus on the core booking domain: double-booking prevention.*

- **時間帯重複判定（純関数）** — 完全一致・部分重複・包含・隣接（境界時刻）・非重複の 8 ケース（`src/lib/utils.test.ts`） / *Time-range overlap (pure function): 8 cases incl. boundary times*
- **POST /api/bookings** — 重複拒否 `409` / 非重複成功 `201` / 境界時刻（背中合わせ予約の許可） / Serializable トランザクション指定 / 直列化競合（P2034）→ `409` の 7 ケース。Prisma・認証はモック（`src/app/api/bookings/route.test.ts`） / *Route tests: conflict rejection, success, boundary times, transaction options, serialization-conflict handling (Prisma/auth mocked)*

## API リファレンス / API Reference

### Authentication

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth — ログイン / セッション管理 |
| `POST` | `/api/register` | 新規ユーザー登録 |

### Bookings

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/bookings` | 予約一覧取得（ロールベースフィルター） |
| `POST` | `/api/bookings` | 新規予約作成 + リスク自動算出。枠競合時は `409` |
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

## データベーススキーマ / Database Schema

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Business   │       │   Service    │       │    Staff    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id           │◄──┐   │ id           │   ┌──►│ id          │
│ name         │   │   │ businessId ──┼───┘   │ businessId  │
│ businessHours│   │   │ duration     │       │ name        │
└──────┬───────┘   │   │ price        │       │ active      │
       │           │   │ active       │       └──────┬──────┘
       │           │   └──────┬───────┘              │
       │           │   ┌──────▼───────┐              │
       │           │   │ StaffService │◄─────────────┘
       │           │   └──────────────┘
┌──────▼───────┐   │   ┌──────────────┐
│     User     │   ├───┤   Booking    │
├──────────────┤   │   ├──────────────┤
│ id           │   │   │ serviceId    │
│ email        │   │   │ staffId      │
│ password     │   │   │ customerId ──┼──► User
│ role (RBAC)  │   │   │ date         │
│ businessId ──┼───┘   │ startTime    │
└──────────────┘       │ endTime      │
                       │ status       │
                       │ cancelRisk   │
                       └──────────────┘

Enums:
  Role          → ADMIN | CUSTOMER
  BookingStatus → PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
  CancelRisk    → LOW | MEDIUM | HIGH
```

※ スキーマにはもう1つ `TimeSlot` モデルが定義されていますが、現状のコードからは未使用です（[既知の制限](#既知の制限--known-limitations)参照）。 / *The schema also defines a `TimeSlot` model that is currently unused by the code (see Known Limitations).*

## 設計判断 / Design Decisions

- **ダブルブッキング防止はトランザクションで** — 枠競合チェックと予約作成を Serializable 分離レベルの単一トランザクションで実行。チェックと作成の間に他リクエストが割り込めず、直列化競合（P2034）は `409` として返す。隣接予約（前の予約の終了時刻 = 次の開始時刻）は半開区間 `[start, end)` の比較で許可。 / *Conflict check + create run in one Serializable transaction so concurrent requests cannot both pass the check; serialization conflicts (P2034) map to `409`. Back-to-back bookings are allowed via half-open interval comparison.*
- **リスク判定はルールベースを土台に AI を追加** — 決定的なスコアリング（上表）が常に土台。Claude Haiku は説明・推奨アクションの生成に限定し、3段フォールバックで AI 障害時も機能を失わない。 / *Deterministic scoring is the foundation; Claude only adds explanations/recommendations, guarded by a 3-tier fallback.*
- **RBAC は Middleware + API 両層で** — `/admin/*` は Middleware で ADMIN のみに制限し、管理 API 側でも `requireAdmin()` を再検証。顧客の予約閲覧・キャンセルは本人リソースに限定。 / *`/admin/*` gated in middleware and re-checked per admin API route; customers restricted to their own bookings.*
- **i18n は cookie + Accept-Language** — 一般客は言語設定を手動で変えないため、公開予約ページはブラウザの Accept-Language から自動推定。12h/24h 表記・週始まり（月曜/日曜）もロケール連動。 / *Public pages auto-detect locale from Accept-Language; time format and week start follow locale.*
- **Next.js App Router + Prisma 7 + Neon** — RSC + API Routes 統合で BFF 不要、スキーマから型を自動生成、サーバーレス PostgreSQL でゼロコンフィグデプロイ。 / *RSC + API routes without a separate BFF; schema-generated types; serverless PostgreSQL.*

## セキュリティ / Security

| Layer | Implementation |
|:---|:---|
| **Authentication** | NextAuth.js v5 — Credentials Provider + JWT sessions |
| **Password Hashing** | bcryptjs — 12 rounds |
| **Authorization** | RBAC — Middleware で `/admin/*` を保護 + 管理 API で `requireAdmin()` 再検証 |
| **Booking Integrity** | 枠競合チェック（Serializable トランザクション）でダブルブッキングを拒否 |
| **HTTP Headers** | `X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `X-XSS-Protection` · `Referrer-Policy` · `Permissions-Policy` |
| **SQL Injection** | Prisma ORM — パラメータ化クエリ |
| **Input Validation** | 登録・予約作成など主要エンドポイントでサーバーサイド検証（全ルート網羅は今後の課題） |
| **CSRF** | NextAuth 組込（認証ルート）。自前 API への CSRF トークンは未実装（既知の制限参照） |

## 既知の制限 / Known Limitations

- **シングルテナント実装** — スキーマは `Business` モデルを持つマルチテナント風の設計ですが、現在の実装は `prisma.business.findFirst()` による単一店舗前提です。テナント解決・データ分離（マルチテナント化）は未実装。 / *The schema looks multi-tenant (`Business` model), but the implementation is single-tenant (`findFirst()`). Tenant resolution and data isolation are not implemented.*
- **予約排他は アプリ層 + Serializable トランザクション** — PostgreSQL の排他制約（`EXCLUDE` + `btree_gist`）による DB レベルの重複禁止は未導入です（`prisma db push` 運用のため raw SQL migration が必要）。並行競合はトランザクションの直列化（P2034 → `409`）で防ぐ設計で、実 DB 上の並行動作はユニットテスト（モック）では検証対象外です。 / *No DB-level exclusion constraint; concurrency is handled by transaction serialization (P2034 → 409). Actual concurrent behavior on a live DB is not covered by the (mocked) unit tests.*
- **予約作成 API のドメイン検証** — 営業時間内・サービス有効（`active`）・スタッフのサービス対応可否のサーバー側再検証は未実装です（空き枠 UI では制御）。 / *POST /api/bookings does not re-validate business hours, service `active`, or staff-service capability server-side (the slot UI does).*
- **エラーハンドリング** — 共通エラーハンドラ未導入のため、不正な JSON ボディ等の一部異常系は `500` を返すルートが残っています。 / *No shared error handler yet; some routes return raw 500 on malformed input.*
- **テスト範囲** — 自動テストは予約競合ドメイン中心（15件）。リスクエンジン・他 API のテストは未整備。 / *Tests currently focus on the booking-conflict domain; the risk engine and other APIs are not yet covered.*
- **`TimeSlot` モデルは未使用** — 将来の休暇・臨時枠管理を見据えた定義のみで、現行コードからは参照されていません。 / *`TimeSlot` is defined for future vacation/ad-hoc slot management but unreferenced.*

## Scripts

```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm test             # ユニットテスト（Vitest）
npm run build        # プロダクションビルド
npm run lint         # ESLint 実行
npm run db:push      # Prisma スキーマを DB に反映
npm run db:seed      # デモデータ投入（70予約）
npm run db:reset     # DB リセット + 再シード
```

## License

[MIT](LICENSE)
