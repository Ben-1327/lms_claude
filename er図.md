```mermaid
%% ER図 (詳細)
erDiagram
  USERS {
    UUID id PK "ユーザーID"
    string name "氏名"
    string email "メールアドレス"
    enum role "システム管理者/講師/受講者"
    enum status "支払い待ち/受講中/卒業/解約"
    timestamp created_at "作成日時"
  }

  COURSES {
    UUID id PK
    string title
    text description
    string tags
    UUID created_by FK -> USERS.id
    timestamp created_at
    boolean published
  }

  CURRICULA {
    UUID id PK
    UUID course_id FK -> COURSES.id
    UUID parent_id FK -> CURRICULA.id
    string title
    enum content_type "text/pdf/slide"
    text content
    int order_index
  }

  ENROLLMENTS {
    UUID id PK
    UUID user_id FK -> USERS.id
    UUID course_id FK -> COURSES.id
    enum status
    date start_date
    date end_date
  }

  ASSIGNMENTS {
    UUID id PK
    UUID curriculum_id FK -> CURRICULA.id
    string title
    text description
    date due_date
  }

  SUBMISSIONS {
    UUID id PK
    UUID assignment_id FK -> ASSIGNMENTS.id
    UUID user_id FK -> USERS.id
    text content
    enum status "submitted/graded"
    float grade
    timestamp submitted_at
    timestamp reviewed_at
  }

  NOTIFICATION_TEMPLATES {
    UUID id PK
    enum event
    enum channel
    string subject
    text body
  }

  USERS ||--o{ ENROLLMENTS : "enrolls"
  USERS ||--o{ SUBMISSIONS : "submits"
  COURSES ||--o{ CURRICULA : "contains"
  COURSES ||--o{ ENROLLMENTS : "has"
  CURRICULA ||--o{ ASSIGNMENTS : "includes"
  ASSIGNMENTS ||--o{ SUBMISSIONS : "has"
  NOTIFICATION_TEMPLATES }o--|| COURSES : "defines"
```

