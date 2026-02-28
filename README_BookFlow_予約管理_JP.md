# BookFlow — AIキャンセル予測付きスマート予約管理プラットフォーム

> **何を:** 美容院・サロン・クリニック向けの予約管理SaaS。ルールベースエンジンとClaude AIのハイブリッドでキャンセルリスクを事前予測し、売上損失を未然に防止する
> **誰に:** 予約ベースのビジネスを運営する事業者、およびオンライン予約を利用する一般顧客
> **技術:** Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / PostgreSQL (Neon) / Prisma 7 / Claude Haiku 4.5 / next-intl

**ライブデモ:** [https://bookflow-five.vercel.app](https://bookflow-five.vercel.app)

| ロール | メールアドレス | パスワード |
|:---|:---|:---|
| 管理者 | `admin@bloom.com` | `password123` |
| 顧客 | `customer@bloom.com` | `password123` |

**ソースコード:** [https://github.com/mer-prog/bookflow](https://github.com/mer-prog/bookflow)

---

## このプロジェクトで証明できるスキル

| スキル | 実装内容 |
|:---|:---|
| **フルスタック開発** | Next.js 16 App Routerによるフロントエンド・API・認証・DB操作の統合実装。React Server Componentsを活用し、BFFレイヤー不要のアーキテクチャを構築 |
| **AI活用 (Claude API)** | ルールベースの4因子スコアリングエンジン（リードタイム・キャンセル率・曜日・時間帯）とClaude Haiku 4.5による自然言語での要因分析・推奨アクション生成のハイブリッド構成。APIキー未設定時はルールベースのみで動作するフォールバック設計 |
| **認証・認可** | NextAuth.js v5によるJWTセッション + ロールベースアクセス制御（ADMIN/CUSTOMER）。Middleware層でのルート保護、bcryptjs 12ラウンドによるパスワードハッシュ化 |
| **データベース設計** | Prisma 7 ORMによる7モデルの正規化スキーマ。StaffServiceの多対多中間テーブル、BookingStatusとCancelRiskのEnum型、Neon Serverless PostgreSQL対応 |
| **多言語対応 (i18n)** | next-intlによる日本語/英語の完全切替。Accept-Languageヘッダーによる公開ページの言語自動検出、Cookie + localStorageのデュアル永続化、ページリロード不要の動的切替、日付・時刻のロケール別フォーマット（24時間制 ↔ 12時間制AM/PM、カレンダー週始まり 月曜 ↔ 日曜） |
| **UI/UX設計** | Tailwind CSS 4のCSS変数によるデザインシステム。6種の汎用UIコンポーネント、4ステップのガイド付き予約フロー、レスポンシブ対応のダッシュボード・カレンダービュー |
| **セキュリティ** | セキュリティヘッダー5種（X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy）、Prisma ORMによるSQLインジェクション自動防御、ホワイトリスト方式のフィールド更新 |

---

## 機能一覧

| 機能 | 説明 | 状態 |
|:---|:---|:---|
| **ダッシュボード** | 本日の予約数・今週の予約数・週間売上・キャンセル率の4指標をリアルタイム表示。本日の予約一覧と要注意（HIGH/MEDIUM）予約のハイライト。過去4週間のキャンセル率推移チャート（Recharts） | 実装済 |
| **カレンダー表示** | 週表示・日表示の切替。スタッフ別フィルター、定休日の自動グレーアウト、予約のステータス色分け表示 | 実装済 |
| **予約管理** | 全予約の一覧表示。ステータス別フィルター（保留中/確定/キャンセル/完了/無断キャンセル）、ステータス変更操作（確定・取消・完了）、キャンセルリスクバッジ表示 | 実装済 |
| **オンライン予約フロー** | 4ステップのガイド付きフロー：サービス選択 → 日時・スタッフ選択 → 顧客情報入力 → 確認・確定。空き枠の自動算出、既存予約との衝突検出 | 実装済 |
| **サービス管理** | サービスの作成・編集・有効/無効切替。名前・説明・所要時間（分）・料金（円）の設定 | 実装済 |
| **店舗設定** | 店舗名・説明・住所・電話番号・メールアドレスの編集。曜日別の営業時間・定休日のフレキシブル設定 | 実装済 |
| **AIキャンセルリスク予測** | 予約作成時にルールベースエンジンで即時リスク判定（LOW/MEDIUM/HIGH）。管理画面からAI分析ボタンでClaude Haiku 4.5による自然言語の要因説明と推奨アクションを生成 | 実装済 |
| **多言語対応（日本語/英語）** | 管理画面・公開予約ページの全UIテキストを日英切替対応。サイドバーとヘッダーに言語トグル配置。公開予約ページではAccept-Languageヘッダーから自動言語検出 | 実装済 |
| **認証・認可** | メールアドレス/パスワードによるログイン。管理者（ADMIN）と顧客（CUSTOMER）のロール分離。管理画面へのアクセス制御 | 実装済 |
| **予約詳細・キャンセル** | 予約確定後の詳細表示ページ。顧客自身による予約キャンセル機能 | 実装済 |

---

## 技術スタック

| カテゴリ | 技術 | 用途 |
|:---|:---|:---|
| フレームワーク | Next.js 16.1.6 (App Router) | Server Components、API Routes、Middleware統合 |
| UI | React 19.2.3 | コンポーネントベースUI |
| 言語 | TypeScript 5 | 型安全な開発 |
| スタイリング | Tailwind CSS 4 | ユーティリティファーストCSS、CSS変数によるデザイントークン |
| データベース | PostgreSQL (Neon Serverless) | @prisma/adapter-pg経由のサーバーレス接続 |
| ORM | Prisma 7.4.1 | 型安全なDB操作、スキーマ駆動の自動型生成 |
| 認証 | NextAuth.js v5 (beta.30) | Credentials Provider + JWTセッション |
| パスワード | bcryptjs 3.0.3 | 12ラウンドソルトによるハッシュ化 |
| AI | Anthropic Claude Haiku 4.5 | リスク要因の自然言語分析・推奨アクション生成 |
| AI SDK | @anthropic-ai/sdk 0.78.0 | Anthropic APIクライアント |
| チャート | Recharts 3.7.0 | キャンセル率推移の折れ線グラフ |
| i18n | next-intl 4.8.3 | App Router対応の多言語管理。Cookie/Accept-Languageベース |
| デプロイ | Vercel | Edge Networkによる高速配信 |

---

## アーキテクチャ概要

```
┌──────────────────────────────────────────────────────────────────┐
│                       クライアント (ブラウザ)                       │
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  ランディング     │  │  公開予約フロー    │  │  管理画面        │  │
│  │  ページ (公開)    │  │  (公開)           │  │  (要認証)        │  │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘  │
└──────────────────────────────┬────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼────────────────────────────────────┐
│                     Next.js 16 (App Router)                       │
│                                                                   │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
│  │  Middleware   │  │  API Routes   │  │  Server Components     │  │
│  │  (認証ゲート)  │  │  (15エンド     │  │  (SSR / RSC)          │  │
│  │              │  │   ポイント)    │  │                        │  │
│  └──────┬───────┘  └──────┬────────┘  └────────────────────────┘  │
│         │                 │                                       │
│  ┌──────▼───────┐  ┌──────▼────────┐  ┌────────────────────────┐  │
│  │  NextAuth    │  │  Prisma ORM   │  │  キャンセルリスク        │  │
│  │  (JWT/RBAC)  │  │  (型安全)      │  │  エンジン               │  │
│  └──────────────┘  └──────┬────────┘  │  (ルールベース + AI)    │  │
│                           │           └──────────┬───────────────┘  │
│  ┌────────────────────────┼──────────────────────┼───────────────┐  │
│  │  next-intl (i18n)      │                      │               │  │
│  │  Cookie / Accept-Language ベースロケール解決    │               │  │
│  └────────────────────────┼──────────────────────┼───────────────┘  │
└───────────────────────────┼──────────────────────┼───────────────┘
                            │                      │
               ┌────────────▼───────┐   ┌──────────▼──────────┐
               │   PostgreSQL       │   │   Anthropic API     │
               │   (Neon Serverless)│   │   (Claude Haiku 4.5)│
               └────────────────────┘   └─────────────────────┘
```

---

## AIキャンセルリスク予測

### スコアリングアルゴリズム

予約作成時に4つの因子から即時にリスクスコアを算出する。合計スコアに基づき3段階のリスクレベルを判定する。

```
┌─────────────────────────────────────────────────────────────┐
│                   リスクスコアリングエンジン                    │
│                                                              │
│  因子                配点       条件                          │
│  ──────────────      ──────    ─────────────────────────      │
│  リードタイム        0〜40点   予約作成〜予約日時の差          │
│                                 < 2時間   → 40点              │
│                                 < 24時間  → 25点              │
│                                 < 72時間  → 10点              │
│                                                              │
│  過去キャンセル率    0〜35点   同一顧客の過去キャンセル率      │
│                                 > 30%     → 35点              │
│                                 > 15%     → 20点              │
│                                 > 0%      → 5点               │
│                                                              │
│  曜日               0〜10点   予約日の曜日                    │
│                                月曜 or 金曜 → 10点            │
│                                                              │
│  時間帯             0〜15点   予約開始時刻                    │
│                                10時前 or 17時以降 → 15点      │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  合計スコア:  ≧60 → HIGH  |  ≧30 → MEDIUM  |  それ以下 → LOW │
└─────────────────────────────────────────────────────────────┘
```

### リスクレベル判定

| レベル | スコア | 推奨アクション |
|:---|:---|:---|
| **HIGH** | 60点以上 | 予約24時間前のリマインド送信。過去キャンセル率30%超の場合はデポジット事前徴収を検討 |
| **MEDIUM** | 30〜59点 | 前日のリマインド送信と予約確認。当日予約の場合は来店意思の確認メッセージ |
| **LOW** | 29点以下 | 通常のリマインド対応で十分 |

### AI分析（Claude Haiku 4.5）

ルールベースエンジンの判定結果に対し、Claude Haiku 4.5が以下を生成する：

- **要因分析** — リスクスコアの根拠を2〜3文の自然言語で説明
- **推奨アクション** — 具体的な対応策を1〜2文で提案

APIキー未設定時はルールベースのテンプレート文で代替する（フォールバック設計）。AI分析は日本語/英語の両方に対応し、リクエストのlocaleパラメータに応じて応答言語が切り替わる。

---

## 主要機能の技術実装

### ダッシュボード（管理者）

管理者ログイン後のトップページ。4種の統計カード（本日予約数、今週予約数、週間売上、キャンセル率）を`/api/admin/stats`から取得・表示。本日の予約一覧と、HIGH/MEDIUMリスクの要注意予約をハイライト表示。過去4週間のキャンセル率推移をRechartsの折れ線グラフで可視化。

### カレンダー表示

週表示と日表示の切替に対応。`getWeekDates()`関数でロケールに応じた週始まり（日本語: 月曜始まり、英語: 日曜始まり）を算出。スタッフ別フィルタリング、営業時間外・定休日のグレーアウト表示、予約ステータスの色分けバッジを実装。

### オンライン予約フロー

4ステップのウィザード形式。Step 1でサービス選択（担当スタッフ表示付き）、Step 2で日時・スタッフ選択（`/api/timeslots`で空き枠を30分間隔で自動算出、既存予約との衝突検出）、Step 3で顧客情報入力、Step 4で確認・確定。予約確定時にルールベースエンジンがキャンセルリスクを即時算出してDBに記録。

### 多言語対応（i18n）

next-intl 4.8.3をNext.js App Routerに統合。URLパスにロケールを含めず、Cookieベースでロケールを管理。ロケール解決の優先順位は: (1) Cookieの`locale`値 → (2) Accept-Languageヘッダーの解析 → (3) デフォルトの`ja`。

言語切替はCookieとlocalStorageの両方に保存し、`router.refresh()`でページリロード不要の動的切替を実現。管理画面のサイドバーにはJP/ENトグルタブ、認証ページと公開予約ページにはグローブアイコンのトグルボタンを配置。

日付・時刻のフォーマットはロケールに連動：

| 項目 | 日本語 | 英語 |
|:---|:---|:---|
| 日付（完全形） | 2026年2月28日土曜日 | Sat, February 28, 2026 |
| 日付（短縮形） | 2月28日(土) | Sat, Feb 28 |
| 時刻 | 14:00 | 2:00 PM |
| 時間範囲 | 14:00〜15:00 | 2:00 PM – 3:00 PM |
| 所要時間 | 60分 / 1時間30分 | 60 min / 1 hr 30 min |
| カレンダー週始まり | 月曜日 | 日曜日 |

翻訳ファイルは`src/messages/ja.json`と`src/messages/en.json`に分離し、22のネームスペースで構造化（metadata, common, header, footer, home, auth, sidebar, dashboard, bookingList, status, risk, calendar, services, settings, booking, bookingDetail, ai, riskFactors, riskActions, riskExplanation, languageToggle）。

---

## データベース設計

### エンティティ関連図

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Business    │       │   Service    │       │    Staff    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id     (PK) │◄──┐   │ id     (PK)  │   ┌──►│ id    (PK)  │
│ name         │   │   │ businessId   │───┘   │ businessId  │
│ description  │   │   │ name         │       │ name        │
│ address      │   │   │ description  │       │ email       │
│ phone        │   │   │ duration     │       │ active      │
│ email        │   │   │ price        │       └──────┬──────┘
│ businessHours│   │   │ active       │              │
│   (Json)     │   │   └──────┬───────┘              │
└──────┬───────┘   │          │                      │
       │           │   ┌──────▼───────┐              │
       │           │   │ StaffService │              │
       │           │   ├──────────────┤              │
       │           │   │ staffId  (FK)│──────────────┘
       │           │   │ serviceId(FK)│
       │           │   │ @@unique     │
       │           │   └──────────────┘
       │           │
┌──────▼───────┐   │   ┌──────────────┐       ┌─────────────┐
│    User      │   │   │   Booking    │       │  TimeSlot   │
├──────────────┤   │   ├──────────────┤       ├─────────────┤
│ id     (PK)  │   ├───┤ businessId   │       │ id    (PK)  │
│ email (uniq) │   │   │ serviceId(FK)│       │ staffId(FK) │
│ password     │   │   │ staffId  (FK)│       │ date        │
│ name         │   │   │ customerId   │──►User│ startTime   │
│ phone        │   │   │ customerName │       │ endTime     │
│ role  (Enum) │   │   │ customerEmail│       │ isAvailable │
│ businessId   │───┘   │ date         │       └─────────────┘
└──────────────┘       │ startTime    │
                       │ endTime      │
                       │ status (Enum)│
                       │ cancelRisk   │
                       │   (Enum)     │
                       │ cancelReason │
                       │ notes        │
                       └──────────────┘
```

### Enum定義

| Enum | 値 |
|:---|:---|
| `Role` | `ADMIN` / `CUSTOMER` |
| `BookingStatus` | `PENDING` / `CONFIRMED` / `CANCELLED` / `COMPLETED` / `NO_SHOW` |
| `CancelRisk` | `LOW` / `MEDIUM` / `HIGH` |

### 予約ステータスフロー

```
 作成 → PENDING → CONFIRMED → COMPLETED
                      │
                      ├──→ CANCELLED（顧客または管理者が取消）
                      │
                      └──→ NO_SHOW（無断キャンセル）
```

※ 公開予約フローからの新規予約は`CONFIRMED`ステータスで直接作成される。

---

## シードデータ

テスト用に70件の予約データを含むシードスクリプト（`prisma/seed.mjs`）を用意。

### 店舗情報

| 項目 | 値 |
|:---|:---|
| 店舗名 | BLOOM Beauty Studio |
| 住所 | 東京都渋谷区神宮前3-15-8 |
| 電話 | 03-1234-5678 |
| 営業時間 | 月〜金 10:00-19:00（木金は20:00まで）、土 9:00-19:00、日曜定休 |

### サービス（5種）

| サービス | 所要時間 | 料金 |
|:---|:---|:---|
| カット | 60分 | ¥4,500 |
| カラー | 90分 | ¥8,000 |
| トリートメント | 45分 | ¥3,500 |
| パーマ | 120分 | ¥10,000 |
| ヘッドスパ | 60分 | ¥5,000 |

### スタッフ（3名）と担当サービス

| スタッフ | 担当サービス |
|:---|:---|
| 田中美咲 | 全サービス（カット, カラー, トリートメント, パーマ, ヘッドスパ） |
| 佐藤健太 | カット, カラー, パーマ |
| 鈴木花子 | カット, トリートメント, ヘッドスパ |

### リピーター顧客（5名）

| 顧客 | 予約数 | キャンセル数 | キャンセル率 | リスク傾向 |
|:---|:---|:---|:---|:---|
| 田中花子 | 6 | 0 | 0% | LOW（優良顧客） |
| 山田太郎 | 5 | 2 | 40% | HIGH |
| 佐々木優子 | 4 | 0 | 0% | LOW |
| 高橋健 | 4 | 2 | 50% | HIGH |
| 中村麻衣 | 3 | 0 | 0% | LOW |

### 一回限りの顧客

48件の予約を48名の一回限り顧客で生成（customerId無し）。

### 予約ステータス分布

| ステータス | 件数 |
|:---|:---|
| CONFIRMED | 28 |
| COMPLETED | 24 |
| CANCELLED | 11 |
| NO_SHOW | 7 |
| **合計** | **70** |

---

## プロジェクト構成

```
bookflow/
├── prisma/
│   ├── schema.prisma                 # データモデル定義（7モデル・3 Enum）
│   └── seed.mjs                      # テストデータ（70予約・5顧客・48一回限り顧客）
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # ルートレイアウト（NextIntlClientProvider統合）
│   │   ├── page.tsx                  # ランディングページ
│   │   ├── globals.css               # デザイントークン定義（Tailwind CSS変数）
│   │   │
│   │   ├── api/                      # REST API（15エンドポイント）
│   │   │   ├── auth/[...nextauth]/   #   NextAuth認証
│   │   │   ├── register/             #   新規ユーザー登録
│   │   │   ├── bookings/             #   予約 CRUD（一覧/作成/詳細/更新/キャンセル）
│   │   │   ├── services/             #   サービス一覧（公開）
│   │   │   ├── staff/                #   スタッフ一覧（公開）
│   │   │   ├── timeslots/            #   空き枠取得（公開）
│   │   │   ├── admin/                #   管理者専用API
│   │   │   │   ├── stats/            #     ダッシュボード統計
│   │   │   │   ├── cancel-trend/     #     キャンセル率推移
│   │   │   │   ├── services/         #     サービス管理（CRUD）
│   │   │   │   └── settings/         #     店舗設定（取得/更新）
│   │   │   └── ai/
│   │   │       └── cancel-risk/      #   AIリスク分析（日英対応）
│   │   │
│   │   ├── admin/                    # 管理画面（要認証）
│   │   │   ├── layout.tsx            #   サイドバー付きレイアウト
│   │   │   ├── page.tsx              #   ダッシュボード
│   │   │   ├── bookings/page.tsx     #   予約一覧
│   │   │   ├── calendar/page.tsx     #   カレンダー
│   │   │   ├── services/page.tsx     #   サービス管理
│   │   │   └── settings/page.tsx     #   店舗設定
│   │   │
│   │   ├── book/page.tsx             # 公開予約フロー（4ステップ）
│   │   ├── booking/[id]/page.tsx     # 予約詳細・キャンセル
│   │   ├── login/page.tsx            # ログイン
│   │   └── register/page.tsx         # 新規登録
│   │
│   ├── components/
│   │   ├── ui/                       # 汎用UIコンポーネント（6種）
│   │   │   ├── button.tsx            #   4バリアント（primary/secondary/outline/ghost）
│   │   │   ├── card.tsx              #   汎用カードコンテナ
│   │   │   ├── input.tsx             #   フォーム入力
│   │   │   ├── badge.tsx             #   ステータスバッジ
│   │   │   ├── modal.tsx             #   モーダルダイアログ
│   │   │   └── select.tsx            #   セレクトボックス
│   │   │
│   │   ├── admin/                    # 管理画面コンポーネント（9種）
│   │   │   ├── stats-cards.tsx       #   統計カード4種
│   │   │   ├── today-bookings.tsx    #   本日の予約一覧
│   │   │   ├── at-risk-bookings.tsx  #   要注意予約一覧
│   │   │   ├── cancel-rate-chart.tsx #   キャンセル率推移チャート
│   │   │   ├── booking-table.tsx     #   予約テーブル
│   │   │   ├── cancel-risk-badge.tsx #   リスクレベルバッジ
│   │   │   ├── calendar-view.tsx     #   カレンダービュー
│   │   │   ├── service-form.tsx      #   サービス編集フォーム
│   │   │   └── hours-form.tsx        #   営業時間設定フォーム
│   │   │
│   │   ├── booking/                  # 予約フローコンポーネント（5種）
│   │   │   ├── step-indicator.tsx    #   4ステップ進捗表示
│   │   │   ├── service-select.tsx    #   サービス選択
│   │   │   ├── datetime-select.tsx   #   日時・スタッフ選択
│   │   │   ├── customer-form.tsx     #   顧客情報入力
│   │   │   └── booking-confirm.tsx   #   予約確認
│   │   │
│   │   ├── ai/
│   │   │   └── risk-explanation.tsx  # AIリスク分析表示
│   │   │
│   │   └── layout/                   # レイアウトコンポーネント
│   │       ├── header.tsx            #   共通ヘッダー（ナビ・言語トグル）
│   │       ├── footer.tsx            #   共通フッター
│   │       ├── admin-sidebar.tsx     #   管理画面サイドバー（言語トグル）
│   │       ├── language-toggle.tsx   #   言語切替（sidebar/header 2バリアント）
│   │       └── session-provider.tsx  #   NextAuthセッションプロバイダー
│   │
│   ├── i18n/                         # 多言語対応
│   │   ├── config.ts                 #   ロケール定義（ja / en）
│   │   ├── request.ts                #   サーバーサイドロケール解決（Cookie → Accept-Language → デフォルト）
│   │   ├── locale-context.tsx        #   クライアントサイドロケール管理（Context API）
│   │   └── locale-sync.tsx           #   localStorage ↔ Cookie同期
│   │
│   ├── messages/                     # 翻訳ファイル
│   │   ├── ja.json                   #   日本語（282行）
│   │   └── en.json                   #   英語（282行）
│   │
│   ├── lib/                          # ユーティリティ
│   │   ├── auth.ts                   #   NextAuth設定（JWT + RBAC）
│   │   ├── prisma.ts                 #   Prismaクライアント（シングルトン）
│   │   ├── api-auth.ts               #   API認証ヘルパー（requireAuth / requireAdmin）
│   │   ├── cancel-risk.ts            #   リスクスコアリングエンジン（日英対応）
│   │   └── utils.ts                  #   日付・時刻フォーマット、ステータスラベル等
│   │
│   ├── types/index.ts                # TypeScript型定義
│   └── middleware.ts                 # ルート保護（/admin/* のADMINロール強制）
│
├── next.config.ts                    # セキュリティヘッダー + next-intl統合
├── package.json                      # 依存関係定義
├── tsconfig.json                     # TypeScript設定
└── .env.example                      # 環境変数テンプレート
```

---

## セットアップ

### 前提条件

- Node.js 18以上
- PostgreSQL（[Neon](https://neon.tech/) 無料枠推奨）
- Anthropic APIキー（任意 — AI分析機能を利用する場合のみ）

### 手順

```bash
# 1. クローン & インストール
git clone https://github.com/mer-prog/bookflow.git
cd bookflow
npm install

# 2. 環境変数の設定
cp .env.example .env
# .env を編集して各値を設定
```

必要な環境変数：

| 変数 | 必須 | 説明 |
|:---|:---|:---|
| `DATABASE_URL` | はい | PostgreSQL接続文字列（Neon推奨） |
| `DIRECT_URL` | はい | PostgreSQL直接接続文字列 |
| `NEXTAUTH_SECRET` | はい | JWTセッション署名鍵（`openssl rand -base64 32`で生成） |
| `NEXTAUTH_URL` | はい | アプリケーションURL（開発時: `http://localhost:3000`） |
| `ANTHROPIC_API_KEY` | いいえ | Anthropic APIキー（未設定時はルールベースのみで動作） |

```bash
# 3. データベースセットアップ
npx prisma db push        # スキーマをDBに反映
npm run db:seed            # 70件のテスト予約データを投入

# 4. 開発サーバー起動
npm run dev                # → http://localhost:3000
```

### その他のスクリプト

```bash
npm run build              # プロダクションビルド
npm run start              # プロダクションサーバー起動
npm run lint               # ESLint実行
npm run db:reset            # DBリセット + 再シード
```

---

## 設計判断の根拠

| 判断 | 根拠 |
|:---|:---|
| **Next.js 16 App Router** | Server ComponentsとAPI Routesの統合により、BFFレイヤーが不要。VercelへのゼロコンフィグデプロイでインフラコストをOSSで最小化 |
| **Prisma 7 ORM** | スキーマからTypeScript型を自動生成し、コンパイル時にDB操作の型安全性を担保。手書きSQL不要でSQLインジェクションを構造的に防止 |
| **NextAuth.js v5 (JWT)** | サーバーサイドのセッションストア不要で、Vercel等のサーバーレス環境と相性が良い。JWTにrole/businessIdを埋め込みRBACを実現 |
| **PostgreSQL (Neon)** | サーバーレスPostgreSQLによりコールドスタート150ms以下。スケーリングとバックアップが自動化され、運用コストが極めて低い |
| **Claude Haiku 4.5** | 高精度かつ低レイテンシ・低コスト。リスク要因の自然言語説明に必要十分な性能を、最小限のAPI料金で実現 |
| **ルールベース + AIハイブリッド** | 予約作成時のリスク判定はルールベースで即時実行（5ms以下）。AI分析は管理者のオンデマンド呼び出しとし、コストとレイテンシを制御 |
| **Tailwind CSS 4** | CSS変数によるデザイントークンの一元管理。ユーティリティクラスでスタイリングの一貫性を保証し、CSSファイルの肥大化を防止 |
| **next-intl (Cookieベース)** | URLパスにロケールを含めない設計。既存ルーティングを変更せずi18nを追加でき、SEO上もデフォルト言語のURLがクリーンに保たれる |
| **Accept-Language自動検出** | 公開予約ページの一般客はアプリ内の言語設定を変更しない前提。ブラウザ設定から自動推定することで最適なUXを提供 |
| **カレンダー週始まりのロケール連動** | 日本の商習慣では月曜始まり、英語圏では日曜始まりが一般的。予約カレンダーのUXに直結する差異をロケールで自動切替 |
| **Recharts** | React環境にネイティブ対応するSVGチャートライブラリ。SSR互換でバンドルサイズが軽量 |

---

## 運用コスト

| サービス | プラン | 月額 |
|:---|:---|:---|
| Vercel | Hobby (無料) | $0 |
| Neon PostgreSQL | Free Tier (0.5GB) | $0 |
| Anthropic API | 従量課金 (Claude Haiku 4.5) | 〜$1未満（低使用量の場合） |
| **合計** | | **$0〜1/月** |

---

## 作者

[@mer-prog](https://github.com/mer-prog)
