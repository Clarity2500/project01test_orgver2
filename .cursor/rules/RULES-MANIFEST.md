# ルールディレクトリ マニフェスト

## 改修後構造（推奨）

| ファイル | 役割 | 適用モード | 依存 |
|----------|------|------------|------|
| `00_bootstrap.mdc` | 最上位契約・優先順位・非交渉事項・停止条件 | **Always Apply** | なし |
| `01_human_approval_gates.mdc` | 人間承認フロー・事前/マージ前/例外承認・停止条件 | **Always Apply** | 00 |
| `02_rule_change_dod.mdc` | ルール変更の Definition of Done | **Always Apply** | 00, 01 |
| `10_core_security_invariants.mdc` | セキュリティ不変条件・禁止対象・REVIEW-REQUIRED・外部通信・依存 | **Always Apply** | 00 |
| `20_architecture_and_trust_boundaries.mdc` | 責務・信頼境界・レイヤ分離 | Auto Attached (globs 一致時)、alwaysApply: false | 00, 10 |
| `20_secure_input_output_logging.mdc` | 入出力・エラー・CSRF・暗号・ログ | Auto Attached、alwaysApply: false | 00, 10 |
| `20_secrets_external_third_party.mdc` | 秘密情報・外部連携・サプライチェーン | Auto Attached、alwaysApply: false | 00, 10 |
| `40_authentication_session_lifecycle.mdc` | 認証・セッション・パスワード・MFA・OAuth | Agent Requested / Auto Attached、alwaysApply: false | 00, 10, 20_* |
| `40_data_persistence_migrations.mdc` | 永続化・マイグレーション | Agent Requested / Auto Attached、alwaysApply: false | 00, 10, 20_* |
| `40_testing_ci_cd_review.mdc` | テスト・CI・レビュー・サプライチェーン | Agent Requested / Auto Attached、alwaysApply: false | 00, 10 |
| `90_exceptions_and_waivers.mdc` | 例外・暫定運用の条件 | Auto Attached (glob **/*)、alwaysApply: false | 00, 01 |
| `90_manual_checklist_security.mdc` | 手動セキュリティチェックリスト | **Manual**（人間参照用）、alwaysApply: false | - |

**常時適用の範囲**: 00_bootstrap の BOOT-17 により、Always Apply とするルールは上記 4 つのみとし、それ以外は glob 一致時の Auto Attached または Agent Requested とする。Always Apply に新規追加してはならない。

## 適用モードの意味

- **Always Apply**: 常時読み込み。最小限に絞る（00, 01, 02, 10）。
- **Auto Attached**: glob 一致時に自動付与。レイヤ・機能別ルール。
- **Agent Requested**: エージェントがタスクに応じて参照。詳細・深いルール。
- **Manual**: 人間がマージ前・リリース前に実施。AI は参照のみで完了判定しない。

## 優先順位（競合時）

1. 安全・法令・禁止事項（00, 10）
2. 人間承認フロー（01）
3. Rule Change Definition of Done（02）
4. 例外承認ルール（90_exceptions）
5. セキュリティ共通基盤（10, 20_*）
6. より具体的なスコープのルール（40_*）
7. より一般的なルール（20_*）
8. 任意のスタイル・好み

## 旧ファイル（番号付き）との対応

| 旧ファイル | 対応する新ファイル |
|-------------|----------------------|
| 000-governance-and-decision-order.mdc | 00_bootstrap.mdc（要約統合） |
| 050-change-safety-and-approval-gates.mdc | 10_core_security_invariants.mdc + 01_human_approval_gates.mdc |
| 100-architecture-and-trust-boundaries.mdc | 20_architecture_and_trust_boundaries.mdc |
| 200-secure-input-output-errors-and-logging.mdc | 20_secure_input_output_logging.mdc |
| 250-secrets-external-communication-and-third-party.mdc | 20_secrets_external_third_party.mdc |
| 300-authentication-session-and-account-lifecycle.mdc | 40_authentication_session_lifecycle.mdc |
| 350-data-persistence-and-migrations.mdc | 40_data_persistence_migrations.mdc |
| 400-testing-ci-cd-and-review.mdc | 40_testing_ci_cd_review.mdc |
| 900-exceptions-and-waivers.mdc | 90_exceptions_and_waivers.mdc |

旧ファイルは参照用に残してもよい。新構造を採用する場合は上記の新ファイル群を優先し、Always Apply は 00, 01, 02, 10 のみとする。
