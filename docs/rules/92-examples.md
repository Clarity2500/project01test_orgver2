# 92-examples

## 例1: 通常変更
### 内容
一覧画面の文言修正。

### 読む文書
- `00-entry.md`
- `10-dev-before-requirements.md`
- `12-dev-before-implement.md`

### 理由
認証、権限、DB、外部通信、依存追加に該当しないため通常変更。

---

## 例2: 高リスク変更（認証）
### 内容
ログイン処理の失敗時メッセージ変更とセッション更新条件の修正。

### 読む文書
- `00-entry.md`
- `10-dev-before-requirements.md`
- `40-risk-auth.md`
- `11-dev-before-design.md`
- `12-dev-before-implement.md`
- `13-dev-before-test.md`

### 理由
認証とセッション管理を含むため高リスク変更。

---

## 例3: 高リスク変更（DB）
### 内容
users テーブルに新しい列を追加する。

### 読む文書
- `00-entry.md`
- `10-dev-before-requirements.md`
- `42-risk-db-schema.md`
- `11-dev-before-design.md`
- `12-dev-before-implement.md`
- `13-dev-before-test.md`

### 理由
DB スキーマ変更を含むため高リスク変更。

---

## 例4: レビュー担当
### 内容
外部 API 追加を含む PR のレビュー。

### 読む文書
- `00-entry.md`
- `20-reviewer-before-review.md`
- `43-risk-external-communication.md`

### 理由
レビュー担当は、自分の役割に必要な L1 と該当 L2 だけ読めばよい。

---

## 例5: 承認者
### 内容
依存追加を含む PR の承認。

### 読む文書
- `00-entry.md`
- `30-approver-before-approve.md`
- `45-risk-dependency.md`
- `31-approver-before-merge.md`

### 理由
承認者は、追加依存の理由と影響範囲、承認条件が揃っているかを見る。
