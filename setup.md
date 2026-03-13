# 環境構築手順書（Windows 11 / Cursor / GitHub / Docker / DBあり）

## 0. この手順書で採用する構成

* Webアプリ: Next.js
* 言語: TypeScript
* パッケージ管理: npm
* DB: PostgreSQL
* DB起動方法: Docker Compose
* ORM / マイグレーション: Prisma
* lint: ESLint
* typecheck: TypeScript (`tsc --noEmit`)
* 単体テスト: Vitest
* E2Eテスト: Playwright
* secret scan: Gitleaks
* dependency scan: Dependabot + `npm audit`
* CI: GitHub Actions
* ブランチ運用: `main` 保護 + `feature/*` ブランチ
* レビュー運用: 人間承認必須

---

## 1. 最初に決めること

この手順では、以下の名前で進めます。必要なら読み替えてください。

* GitHub リポジトリ名: `project01test`
* ローカル作業フォルダ: `C:\dev\project01test`
* DB名: `appdb`
* DBユーザー名: `appuser`

---

## 2. PC側の事前セットアップ

---

### 2-1. Git の確認

**コマンドを打つ場所**
どこでもOK
（例: PowerShell を開いた直後のホームディレクトリ）

```powershell
git --version
```

バージョンが表示されればOKです。

#### Git の名前とメールアドレスを設定

**コマンドを打つ場所**
どこでもOK

```powershell
git config --global user.name "あなたの名前"
git config --global user.email "あなたのGitHubメールアドレス"
```

確認:

**コマンドを打つ場所**
どこでもOK

```powershell
git config --global --list
```

---

### 2-2. Node.js の確認

**コマンドを打つ場所**
どこでもOK

```powershell
node -v
npm -v
```

表示されない場合は、Node.js の LTS版をインストールしてください。

---

### 2-3. Docker Desktop + WSL2 のセットアップ

まず WSL が入っていない場合は、PowerShell を**管理者で**開いて実行します。

**コマンドを打つ場所**
どこでもOK

```powershell
wsl --install
```

PC再起動後、Ubuntu などの初期設定を済ませます。

その後、Docker Desktop をインストールして起動します。
Docker Desktop の設定で **Use WSL 2 based engine** を有効にします。

確認:

**コマンドを打つ場所**
どこでもOK

```powershell
docker --version
docker compose version
wsl -l -v
```

---

## 3. GitHub にリポジトリを作る

### 3-1. GitHubで新規リポジトリ作成

GitHub の画面で新しい repository を作成します。

推奨設定:

* Repository name: `project01test`
* Visibility: `Private`
* Add README: オフ
* Add .gitignore: オフ
* Choose a license: オフ

### 3-2. コラボレーターを追加

リポジトリ作成後、チーム3人を collaborator として追加します。

---

## 4. ローカルにプロジェクトを作る

### 4-1. 作業フォルダを作る

**コマンドを打つ場所**
どこでもOK

```powershell
mkdir C:\dev
```

### 4-2. `C:\dev` に移動する

**コマンドを打つ場所**
どこでもOK
**移動先** `C:\dev`

```powershell
cd C:\dev
```

### 4-3. Next.js プロジェクトを作る

**コマンドを打つ場所**
`C:\dev`

```powershell
npx create-next-app@latest project01test
```

質問が出たら、以下で回答します。

* Would you like to use TypeScript? → `Yes`
* Would you like to use ESLint? → `Yes`
* Would you like to use Tailwind CSS? → `Yes`
* Would you like your code inside a `src/` directory? → `No`
* Would you like to use App Router? → `Yes`
* Would you like to use Turbopack? → `Yes`
* Would you like to customize the import alias? → `No`

### 4-4. プロジェクトフォルダに移動する

**コマンドを打つ場所**
`C:\dev`
**移動先** `C:\dev\project01test`

```powershell
cd C:\dev\project01test
```

### 4-5. Git リポジトリか確認する

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git status
```

もしエラーが出たら、以下を実行します。

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git init
```

---

## 5. Cursor 用ルール置き場を整える

### 5-1. 人間向けルールはそのまま残す

既存ルールはこのまま残します。

```text
docs/rules/
```

### 5-2. Cursor が自動で読むルール置き場を作る

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
New-Item -ItemType Directory -Force .cursor\rules
```

### 5-3. 既存ルールをコピーする

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
Copy-Item docs\rules\* .cursor\rules\ -Force
```

**運用ルール:**

* `docs/rules/`
  → 人間向けの正本
* `.cursor/rules/`
  → AIが毎回読むべきルールだけを置く

---

## 6. GitHub とローカルを接続する

### 6-1. remote を追加する

GitHub で作ったリポジトリURLを確認し、以下を実行します。

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git remote add origin https://github.com/あなたのユーザー名/project01test.git
git branch -M main
git remote -v
```

### 6-2. 最初のコミットを作る

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git add .
git commit -m "chore: initialize Next.js project"
```

### 6-3. 最初の push をする

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git push -u origin main
```

初回 push 時にブラウザ認証が出たら、そのまま GitHub でログインして許可します。

---

## 7. DB を Docker で立ち上げる

### 7-1. `.env.example` を作る

**作成場所**
`C:\dev\project01test\.env.example`

中身:

```env
POSTGRES_USER=appuser
POSTGRES_PASSWORD=change-me
POSTGRES_DB=appdb
DATABASE_URL=postgresql://appuser:change-me@localhost:5432/appdb?schema=public
```

### 7-2. `.env` を作る

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
Copy-Item .env.example .env
```

`.env` は Git 管理に入れないでください。

### 7-3. `compose.yaml` を作る

**作成場所**
`C:\dev\project01test\compose.yaml`

```yaml
services:
  db:
    image: postgres:16
    container_name: project01test-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 7-4. DB を起動する

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
docker compose up -d
docker compose ps
```

### 7-5. DB ログを確認する

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
docker compose logs -f db
```

止めるときは `Ctrl + C` を押します。

---

## 8. Prisma を入れて DB 接続を整える

### 8-1. Prisma をインストール

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npm install @prisma/client
npm install -D prisma
```

### 8-2. Prisma を初期化

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npx prisma init
```

### 8-3. `prisma/schema.prisma` を修正する

**編集する場所**
`C:\dev\project01test\prisma\schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 8-4. 最初のモデルを追加する

**編集する場所**
`C:\dev\project01test\prisma\schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### 8-5. マイグレーションを実行する

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npx prisma migrate dev --name init
```

### 8-6. Prisma Studio を開く

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npx prisma studio
```

---

## 9. lint / typecheck / test を入れる

### 9-1. Vitest をインストール

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npm install -D vitest jsdom @vitejs/plugin-react vite-tsconfig-paths
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 9-2. `vitest.config.mts` を作る

**作成場所**
`C:\dev\project01test\vitest.config.mts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

### 9-3. `vitest.setup.ts` を作る

**作成場所**
`C:\dev\project01test\vitest.setup.ts`

```ts
import "@testing-library/jest-dom";
```

### 9-4. Playwright をインストール

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npm init playwright@latest
```

質問が出たら、以下で回答します。

* TypeScript or JavaScript? → `TypeScript`
* Tests folder → `e2e`
* Add a GitHub Actions workflow? → `No`
* Install Playwright browsers? → `Yes`

### 9-5. `package.json` の scripts を整理する

**編集する場所**
`C:\dev\project01test\package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
    "db:logs": "docker compose logs -f db",
    "db:reset": "docker compose down -v",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "dep:scan": "npm audit --audit-level=high"
  }
}
```

### 9-6. 動作確認をする

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

---

## 10. secret scan を入れる

今回は個人 private repo なので、GitHub secret scanning ではなく、**Gitleaks を CI で必須実行** にします。

### 10-1. `.gitleaksignore` は必要になってから追加

最初は作らなくてOKです。
誤検知が出たらあとで追加します。

---

## 11. GitHub Actions を入れる

### 11-1. ワークフロー置き場を作る

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
New-Item -ItemType Directory -Force .github\workflows
```

### 11-2. `ci.yml` を作る

**作成場所**
`C:\dev\project01test\.github\workflows\ci.yml`

```yaml
name: ci

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Unit test
        run: npm run test

      - name: Build
        run: npm run build

      - name: Dependency scan
        run: npm run dep:scan

  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E
        run: npm run test:e2e

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

---

## 12. Dependabot を入れる

### 12-1. `dependabot.yml` を作る

**作成場所**
`C:\dev\project01test\.github\dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

---

## 13. 人間承認を仕組みに入れる

### 13-1. `.github` フォルダを作る

※ すでに存在するなら不要です。

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
New-Item -ItemType Directory -Force .github
```

### 13-2. `CODEOWNERS` を作る

**作成場所**
`C:\dev\project01test\.github\CODEOWNERS`

```text
* @github-id-1 @github-id-2 @github-id-3
```

※ `@github-id-*` は実際の GitHub ユーザー名に置き換えてください。

### 13-3. PR テンプレートを作る

**作成場所**
`C:\dev\project01test\.github\pull_request_template.md`

```md
## 目的
- このPRで何をするか

## 変更内容
- 何を追加 / 修正したか

## AI利用
- Cursor AI Agent を使った / 使っていない
- どのルールを読ませたか
- 人間がレビューすべきポイント

## 動作確認
- [ ] lint
- [ ] typecheck
- [ ] unit test
- [ ] e2e test
- [ ] build
- [ ] dependency scan
- [ ] secret scan

## 影響範囲
- UI
- API
- DB
- 環境変数
- 依存関係

## 承認
- [ ] 人間レビュー承認済み
```

---

## 14. `main` 保護を設定する

### 14-1. GitHub Pro 以上がある場合

GitHub の画面で `Settings` → `Branches` または `Rules` から `main` に対して以下を設定します。

推奨:

* Require a pull request before merging
* Require approvals
* Require status checks to pass before merging
* Require branches to be up to date before merging
* Do not allow force pushes
* Do not allow deletions
* Require review from Code Owners

必須チェックには、少なくとも以下を入れます。

* `quality`
* `e2e`
* `secret-scan`

### 14-2. GitHub Free の個人 private repo の場合

GitHub側で完全強制しにくいので、暫定で以下の運用ルールにします。

* `main` へ直接 push しない
* `feature/*` ブランチだけ使う
* PR が green でも、人間承認が入るまで merge しない
* merge はリポジトリ責任者1人だけが行う

---

## 15. 最初の設定ファイルを push する

### 15-1. feature ブランチを切る

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git checkout -b feature/setup-project-environment
```

### 15-2. 変更を追加してコミットする

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git add .
git commit -m "chore: setup project environment"
```

### 15-3. GitHub に push する

**コマンドを打つ場所**
`C:\dev\project01test`

```powershell
git push -u origin feature/setup-project-environment
```

その後 GitHub で PR を作成します。

PR タイトル例:

```text
chore: setup project environment
```

---

## 16. ここまでで最低限そろうもの

この手順が終わると、以下が使える状態になります。

* Cursor で AI 用ルールを自動読込できる
* Next.js + TypeScript 開発を始められる
* Docker 上で PostgreSQL を起動できる
* Prisma で migration 管理できる
* lint / typecheck / unit test / e2e test が動く
* GitHub Actions で PR 時に自動チェックできる
* Gitleaks で secret scan が走る
* Dependabot で依存関係の脆弱性監視ができる
* 人間承認前提の PR 運用を始められる

---

## 17. 作業完了チェックリスト

* [ ] Git の名前・メール設定が完了した
* [ ] Node.js LTS が入った
* [ ] Docker Desktop + WSL2 が動いた
* [ ] GitHub の private repo を作成した
* [ ] ローカルに Next.js プロジェクトを作成した
* [ ] `docs/rules/` と `.cursor/rules/` を整理した
* [ ] `.env.example` と `.env` を作成した
* [ ] Docker で PostgreSQL が起動した
* [ ] Prisma migration が通った
* [ ] `npm run lint` が通った
* [ ] `npm run typecheck` が通った
* [ ] `npm run test` が通った
* [ ] `npm run build` が通った
* [ ] `ci.yml` を push して GitHub Actions が動いた
* [ ] Dependabot を有効化した
* [ ] PR ベースの開発フローで 1 本目の PR を作成した

---

次は、この内容をそのまま **`.md`ファイルとしてコピペしやすい形** で、冒頭から末尾までコードブロック1つにまとめて出せます。
