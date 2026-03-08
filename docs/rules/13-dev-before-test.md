# 13-dev-before-test

## 目的
テストの前に、最低限必要な確認と高リスク変更特有の観点を固定し、テスト漏れを防ぐ。

## この工程での禁止事項
- 正常系だけで完了にしない
- 高リスク変更で異常系を省略しない
- 手動確認しかしていないのに十分と判断しない

## この工程での確認項目
- 正常系
- 異常系
- 回帰確認
- 権限漏れ
- 失敗時挙動
- ログ / 監査の確認
- 手動確認が必要な場合の明示

## 高リスク変更時の追加読解先
- 認証: `40-risk-auth.md`
- 認可 / 権限: `41-risk-authorization.md`
- DB: `42-risk-db-schema.md`
- 外部通信: `43-risk-external-communication.md`
- 秘密情報 / 個人情報 / ログ: `44-risk-secrets-pii.md`

## 次の工程で読む文書
- レビュー依頼前: `14-dev-before-review-request.md`
