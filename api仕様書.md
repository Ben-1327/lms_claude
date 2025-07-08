```markdown
# API仕様書

## 認証
| メソッド | パス             | 説明       | 認証   |
|--------|------------------|-----------|-------|
| POST   | /api/auth/login  | ログイン   | No    |
| POST   | /api/auth/logout | ログアウト | Yes   |

## ユーザー
| メソッド | パス            | 説明           | 認証 |
|--------|-----------------|---------------|------|
| GET    | /api/users      | ユーザー一覧取得 | Yes  |
| POST   | /api/users      | ユーザー作成     | Yes  |
| GET    | /api/users/:id  | ユーザー詳細取得 | Yes  |
| PUT    | /api/users/:id  | ユーザー更新     | Yes  |
| DELETE | /api/users/:id  | ユーザー削除     | Yes  |

## コース
| メソッド | パス                       | 説明           | 認証 |
|--------|----------------------------|---------------|------|
| GET    | /api/courses               | コース一覧取得 | Yes  |
| POST   | /api/courses               | コース作成     | Yes  |
| GET    | /api/courses/:id           | コース詳細取得 | Yes  |
| PUT    | /api/courses/:id           | コース更新     | Yes  |
| DELETE | /api/courses/:id           | コース削除     | Yes  |
| GET    | /api/courses/:id/curricula | カリキュラム一覧取得 | Yes |

## カリキュラム
| メソッド | パス                    | 説明           | 認証 |
|--------|-------------------------|---------------|------|
| POST   | /api/curricula          | カリキュラム作成 | Yes  |
| PUT    | /api/curricula/:id      | カリキュラム更新 | Yes  |
| DELETE | /api/curricula/:id      | カリキュラム削除 | Yes  |

## 受講登録 (Enrollment)
| メソッド | パス              | 説明       | 認証 |
|--------|-------------------|-----------|------|
| POST   | /api/enrollments  | 受講登録   | Yes  |
| GET    | /api/enrollments  | 自身の登録状況取得 | Yes |
| DELETE | /api/enrollments/:id | 受講解除 | Yes  |

## 課題提出
| メソッド | パス                         | 説明         | 認証 |
|--------|------------------------------|-------------|------|
| GET    | /api/assignments/:id/submissions | 提出一覧取得 | Yes |
| POST   | /api/submissions             | 課題提出     | Yes |
| PUT    | /api/submissions/:id         | 提出内容更新 | Yes |

## Webhooks
| メソッド | パス            | 説明           | 認証 |
|--------|-----------------|---------------|------|
| POST   | /api/webhooks   | イベント受信    | Yes  |
```

