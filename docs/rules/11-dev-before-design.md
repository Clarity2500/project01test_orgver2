# 11-dev-before-design

## 目的
設計の前に、設計可能な境界と安全条件を固定し、設計逸脱を防ぐ。

## この工程での禁止事項
- 信頼境界が曖昧なまま設計しない
- 認証 / 認可 / 権限を後回しにしない
- ログ、外部通信、データ分類を未定義のまま進めない

## この工程での確認項目
- データ境界
- 権限境界
- 認証 / 認可の要否
- 外部通信の要否
- DB 変更の要否
- ログに出してよい情報
- 既存設計の再利用可否

## 高リスク変更時の追加読解先
- 認証: `40-risk-auth.md`
- 認可 / 権限: `41-risk-authorization.md`
- DB: `42-risk-db-schema.md`
- 外部通信: `43-risk-external-communication.md`
- 秘密情報 / 個人情報: `44-risk-secrets-pii.md`

## 次の工程で読む文書
- 実装前: `12-dev-before-implement.md`
