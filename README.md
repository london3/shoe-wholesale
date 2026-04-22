# 👟 靴卸売 販売在庫管理システム

靴の卸売業向けの販売在庫管理Webアプリケーションです。

**使用技術**: Next.js + Turso（データベース）+ Vercel（ホスティング）

---

## 🚀 セットアップ手順（初心者向け）

### 前提条件

以下のアカウントを事前に作成してください（すべて無料プランでOK）。

- **GitHub** アカウント → https://github.com
- **Vercel** アカウント → https://vercel.com （GitHubアカウントで登録できます）
- **Turso** アカウント → https://turso.tech （GitHubアカウントで登録できます）
- **Node.js** がPCにインストール済み → https://nodejs.org （LTS版を推奨）

---

### ステップ1: Turso データベースを作る

1. Turso CLI をインストール

```bash
# Mac の場合
brew install tursodatabase/tap/turso

# Windows の場合（PowerShell で実行）
irm https://get.tur.so/install.ps1 | iex
```

2. Turso にログイン

```bash
turso auth login
```

ブラウザが開くので、GitHubアカウントでログインします。

3. データベースを作成

```bash
turso db create shoe-wholesale
```

4. 接続情報を取得（この2つをメモしておく）

```bash
# データベースURL を取得
turso db show shoe-wholesale --url

# 認証トークン を取得
turso db tokens create shoe-wholesale
```

---

### ステップ2: GitHubにコードをアップロード

1. GitHub で新しいリポジトリを作成
   - https://github.com/new にアクセス
   - Repository name に `shoe-wholesale` と入力
   - 「Create repository」をクリック

2. ターミナルでこのフォルダに移動し、以下を実行

```bash
cd shoe-wholesale
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/shoe-wholesale.git
git push -u origin main
```

---

### ステップ3: Vercel にデプロイ

1. https://vercel.com/new にアクセス
2. 「Import Git Repository」から `shoe-wholesale` を選択
3. **Environment Variables（環境変数）** を設定：

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | ステップ1でメモしたデータベースURL |
| `TURSO_AUTH_TOKEN` | ステップ1でメモした認証トークン |

4. 「Deploy」をクリック

デプロイが完了すると、URLが発行されます（例: `https://shoe-wholesale.vercel.app`）。

---

### ステップ4: 初期データを投入

1. デプロイされたサイトにアクセス
2. ダッシュボードの「データベースを初期設定する」ボタンをクリック
3. テーブルの作成とサンプルデータの投入が自動で行われます

---

## 📱 アプリの機能

| アプリ | 機能 |
|--------|------|
| **ダッシュボード** | 全体サマリー、在庫アラート、売上合計 |
| **仕入先管理** | 仕入先の登録・編集・削除 |
| **商品管理** | 商品情報の登録・検索・ステータス管理 |
| **在庫管理** | サイズ×カラー別の在庫数管理、要発注アラート |
| **販売管理** | 受注の登録、注文ごとのグループ表示、売上計算 |

---

## 🔧 ローカルで開発する場合

```bash
# パッケージをインストール
npm install

# .env ファイルを作成
cp .env.example .env
# .env を編集して TURSO_DATABASE_URL と TURSO_AUTH_TOKEN を設定

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

---

## 📁 ファイル構成

```
shoe-wholesale/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← ダッシュボード
│   │   ├── layout.tsx        ← 共通レイアウト（サイドバー）
│   │   ├── suppliers/        ← 仕入先管理ページ
│   │   ├── products/         ← 商品管理ページ
│   │   ├── inventory/        ← 在庫管理ページ
│   │   ├── sales/            ← 販売管理ページ
│   │   └── api/              ← APIルート（データベース操作）
│   │       ├── seed/         ← 初期データ投入
│   │       ├── suppliers/    ← 仕入先CRUD
│   │       ├── products/     ← 商品CRUD
│   │       ├── inventory/    ← 在庫CRUD
│   │       └── sales/        ← 販売CRUD
│   └── lib/
│       └── db.ts             ← Turso接続設定
├── package.json
├── .env.example
└── README.md
```

---

## 💰 料金について

- **Turso**: 無料プランで 9GB ストレージ、月間10億行の読み込みまで無料
- **Vercel**: 無料プランで個人利用は無料
- **GitHub**: 無料

個人利用や小規模ビジネスであれば、**完全無料** で運用できます。
