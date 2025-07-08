# LMS Claude

AI/プログラミング研修のための学習管理システム

## 概要

LMS Claudeは、企業向けAI/プログラミング研修の市場拡大に伴い、学習管理を効率化・可視化するLearning Management System（LMS）です。

## 主な機能

### 実装済み機能

- **認証・権限管理**: JWT認証、ロールベースアクセス制御（管理者、講師、受講者）
- **ダッシュボード**: 学習進捗の可視化、統計情報の表示
- **コース管理**: コース一覧、詳細表示、進捗管理
- **カリキュラム表示**: 階層構造のカリキュラム、マークダウン対応
- **学習進捗管理**: 既読マーク、進捗率の表示
- **ユーザー管理**: ユーザー一覧、検索、フィルタリング（管理者限定）
- **レポート機能**: 学習統計、コース別分析（管理者限定）
- **設定画面**: プロフィール設定、通知設定、セキュリティ設定

### 実装予定機能

- **課題提出・レビュー**: 課題の提出と講師によるレビュー
- **通知・リマインド**: メール/Web通知/Slack連携
- **外部連携**: Salesforce、Google サービス連携
- **バックエンドAPI**: NestJS実装

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: NestJS（予定）
- **データベース**: PostgreSQL（予定）
- **認証**: JWT + Passport（予定）
- **コンテナ**: Docker, Docker Compose

## テストアカウント

システムには以下のテストアカウントが用意されています：

### 管理者アカウント
- **メール**: admin@example.com
- **パスワード**: password
- **権限**: 全機能アクセス可能

### 講師アカウント
- **メール**: yamada@example.com
- **パスワード**: password
- **権限**: コース管理、受講者管理

### 受講者アカウント
- **メール**: sato@example.com
- **パスワード**: password
- **権限**: 学習機能のみ

### その他の受講者
- **メール**: tanaka@example.com / password
- **メール**: suzuki@example.com / password

## テストデータ

### コース
1. **Python基礎プログラミング**
   - 基本文法、変数・データ型、条件分岐
   - 受講者: 15名

2. **Web開発入門 (HTML/CSS/JavaScript)**
   - HTML基本、CSS基本
   - 受講者: 20名

3. **React入門コース**
   - React基本概念
   - 受講者: 12名

4. **データベース基礎 (SQL)**
   - 下書き状態

### 学習進捗データ
- 各受講者の学習進捗と完了状況
- カリキュラム別の進捗管理
- 完了日時の記録

## 開発環境セットアップ

### 必要な環境
- Node.js 18+
- Docker & Docker Compose
- Git

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/Ben-1327/lms_claude.git
cd lms_claude
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. Dockerを使用する場合
```bash
docker-compose up -d
```

アプリケーションは http://localhost:3000 でアクセス可能です。

## 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバーを起動
- `npm run lint`: ESLintでコードをチェック

## プロジェクト構成

```
lms_claude/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/         # ダッシュボード
│   │   ├── courses/           # コース管理
│   │   ├── users/             # ユーザー管理
│   │   ├── reports/           # レポート
│   │   ├── settings/          # 設定
│   │   └── login/             # ログイン
│   ├── components/            # 再利用可能コンポーネント
│   │   ├── Layout.tsx         # レイアウト
│   │   └── ui/                # UIコンポーネント
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx    # 認証管理
│   ├── lib/                   # ユーティリティ
│   │   ├── auth.ts            # 認証ロジック
│   │   ├── mockData.ts        # テストデータ
│   │   └── utils.ts           # 共通関数
│   └── types/                 # TypeScript型定義
├── public/                    # 静的ファイル
├── docker-compose.yml         # Docker設定
├── Dockerfile                 # フロントエンド用
└── README.md
```

## 画面機能

### ダッシュボード
- 学習統計の表示
- 最近のコース一覧
- 進捗状況の可視化

### コース管理
- コース一覧表示
- 検索・フィルタリング
- コース詳細とカリキュラム表示
- 学習進捗の管理

### ユーザー管理（管理者限定）
- ユーザー一覧表示
- ロール別フィルタリング
- 受講状況の確認

### レポート（管理者限定）
- システム全体の統計
- コース別分析
- 学習活動の履歴

### 設定
- プロフィール編集
- 通知設定
- セキュリティ設定

## 今後の開発計画

1. **バックエンドAPI実装**
   - NestJS + PostgreSQL
   - JWT認証の実装

2. **課題管理システム**
   - 課題提出機能
   - レビュー・採点機能

3. **通知システム**
   - メール通知
   - Slack連携

4. **外部API連携**
   - Salesforce連携
   - Google Workspace連携

5. **デプロイメント**
   - Vercel/AWS/GCP対応
   - CI/CD パイプライン

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。