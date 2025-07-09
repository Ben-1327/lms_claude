import { Course, Curriculum, Enrollment, Progress, Assignment, Submission, CurriculumEnrollment } from '@/types'

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Python基礎プログラミング',
    description: 'Pythonの基本文法から始めて、データ構造、関数、クラスまでを学習します。プログラミング初心者でも安心して学べるコースです。',
    tags: ['Python', '基礎', 'プログラミング'],
    createdBy: '2',
    createdAt: new Date('2024-01-20'),
    published: true,
    enrollmentCount: 15
  },
  {
    id: '2',
    title: 'Web開発入門 (HTML/CSS/JavaScript)',
    description: 'HTML、CSS、JavaScriptを使って基本的なWebページを作成します。レスポンシブデザインやDOMの操作も学習します。',
    tags: ['Web開発', 'HTML', 'CSS', 'JavaScript'],
    createdBy: '2',
    createdAt: new Date('2024-01-25'),
    published: true,
    enrollmentCount: 20
  },
  {
    id: '3',
    title: 'React入門コース',
    description: 'モダンなWebアプリケーション開発のためのReactライブラリを学習します。コンポーネント、状態管理、Hooksなどを習得します。',
    tags: ['React', 'JavaScript', 'フロントエンド'],
    createdBy: '2',
    createdAt: new Date('2024-02-01'),
    published: true,
    enrollmentCount: 12
  },
  {
    id: '4',
    title: 'データベース基礎 (SQL)',
    description: 'データベースの基本概念とSQL文の書き方を学習します。SELECT、INSERT、UPDATE、DELETE文から始めて、JOINや集約関数まで習得します。',
    tags: ['データベース', 'SQL', '基礎'],
    createdBy: '2',
    createdAt: new Date('2024-02-05'),
    published: false,
    enrollmentCount: 0
  }
]

export const mockCurricula: Curriculum[] = [
  // Python基礎プログラミングのカリキュラム
  {
    id: '1',
    courseId: '1',
    title: '第1章: Pythonの基本',
    contentType: 'text',
    content: `# Pythonの基本

## 1.1 Pythonとは
Pythonは、シンプルで読みやすいプログラミング言語です。

## 1.2 開発環境の準備
1. Python公式サイトからダウンロード
2. IDEの選択（VSCode、PyCharm等）
3. 仮想環境の作成

## 1.3 Hello World
\`\`\`python
print("Hello, World!")
\`\`\`

## 演習
1. Pythonをインストールしてください
2. Hello Worldプログラムを実行してください`,
    orderIndex: 1
  },
  {
    id: '2',
    courseId: '1',
    title: '第2章: 変数とデータ型',
    contentType: 'text',
    content: `# 変数とデータ型

## 2.1 変数の宣言
\`\`\`python
name = "田中"
age = 25
height = 170.5
is_student = True
\`\`\`

## 2.2 基本的なデータ型
- 文字列 (str)
- 整数 (int)
- 浮動小数点数 (float)
- 真偽値 (bool)

## 2.3 型変換
\`\`\`python
str_num = "123"
int_num = int(str_num)
print(int_num + 100)  # 223
\`\`\`

## 演習
1. 自分の名前、年齢、身長を変数に格納してください
2. 型変換を使って計算してください`,
    orderIndex: 2
  },
  {
    id: '3',
    courseId: '1',
    title: '第3章: 条件分岐',
    contentType: 'text',
    content: `# 条件分岐

## 3.1 if文の基本
\`\`\`python
score = 85

if score >= 90:
    print("優秀")
elif score >= 70:
    print("良好")
else:
    print("要努力")
\`\`\`

## 3.2 比較演算子
- == (等しい)
- != (等しくない)
- > (より大きい)
- < (より小さい)
- >= (以上)
- <= (以下)

## 演習
1. 年齢を入力して、成人かどうかを判定するプログラムを作成してください
2. 点数に応じて成績を表示するプログラムを作成してください`,
    orderIndex: 3
  },

  // Web開発入門のカリキュラム
  {
    id: '4',
    courseId: '2',
    title: '第1章: HTMLの基本',
    contentType: 'text',
    content: `# HTMLの基本

## 1.1 HTMLとは
HyperText Markup Languageの略で、Webページの構造を記述するための言語です。

## 1.2 基本的なHTML構造
\`\`\`html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ページタイトル</title>
</head>
<body>
    <h1>見出し</h1>
    <p>段落</p>
</body>
</html>
\`\`\`

## 1.3 主要なタグ
- \`<h1>〜<h6>\`: 見出し
- \`<p>\`: 段落
- \`<a>\`: リンク
- \`<img>\`: 画像
- \`<div>\`: ブロック要素
- \`<span>\`: インライン要素

## 演習
1. 自己紹介ページを作成してください
2. 画像とリンクを含むページを作成してください`,
    orderIndex: 1
  },
  {
    id: '5',
    courseId: '2',
    title: '第2章: CSSの基本',
    contentType: 'text',
    content: `# CSSの基本

## 2.1 CSSとは
Cascading Style Sheetsの略で、HTMLの見た目を装飾するための言語です。

## 2.2 CSSの書き方
\`\`\`css
/* セレクタ { プロパティ: 値; } */
h1 {
    color: blue;
    font-size: 24px;
}

.class-name {
    background-color: #f0f0f0;
}

#id-name {
    margin: 10px;
}
\`\`\`

## 2.3 主要なプロパティ
- color: 文字色
- background-color: 背景色
- font-size: 文字サイズ
- margin: 外側の余白
- padding: 内側の余白
- border: 境界線

## 演習
1. HTMLページにCSSを適用してください
2. レスポンシブデザインを実装してください`,
    orderIndex: 2
  },

  // React入門のカリキュラム
  {
    id: '6',
    courseId: '3',
    title: '第1章: Reactの基本概念',
    contentType: 'text',
    content: `# Reactの基本概念

## 1.1 Reactとは
UIを構築するためのJavaScriptライブラリです。

## 1.2 コンポーネント
\`\`\`jsx
function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}

// 使用例
<Welcome name="田中" />
\`\`\`

## 1.3 JSX
JavaScriptの中でHTML的な記述ができる構文です。

## 1.4 Props
コンポーネントに渡すデータです。

## 演習
1. 簡単なコンポーネントを作成してください
2. propsを使ってデータを渡してください`,
    orderIndex: 1
  }
]

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    userId: '3',
    courseId: '1',
    status: 'active',
    startDate: new Date('2024-02-01'),
    progress: 67
  },
  {
    id: '2',
    userId: '3',
    courseId: '2',
    status: 'completed',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-20'),
    progress: 100
  },
  {
    id: '3',
    userId: '4',
    courseId: '1',
    status: 'active',
    startDate: new Date('2024-02-10'),
    progress: 33
  },
  {
    id: '4',
    userId: '4',
    courseId: '3',
    status: 'active',
    startDate: new Date('2024-02-15'),
    progress: 25
  },
  {
    id: '5',
    userId: '5',
    courseId: '1',
    status: 'active',
    startDate: new Date('2024-02-15'),
    progress: 33
  }
]

export const mockProgress: Progress[] = [
  { userId: '3', curriculumId: '1', completed: true, completedAt: new Date('2024-02-05') },
  { userId: '3', curriculumId: '2', completed: true, completedAt: new Date('2024-02-10') },
  { userId: '3', curriculumId: '3', completed: false },
  { userId: '3', curriculumId: '4', completed: true, completedAt: new Date('2024-02-01') },
  { userId: '3', curriculumId: '5', completed: true, completedAt: new Date('2024-02-15') },
  { userId: '4', curriculumId: '1', completed: true, completedAt: new Date('2024-02-12') },
  { userId: '4', curriculumId: '2', completed: false },
  { userId: '4', curriculumId: '6', completed: true, completedAt: new Date('2024-02-16') },
  { userId: '5', curriculumId: '1', completed: true, completedAt: new Date('2024-02-16') }
]

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    curriculumIds: ['1', '2'],
    title: 'Python基礎課題1',
    description: '変数とデータ型を使用した簡単なプログラムを作成してください。\n\n**要件:**\n- 自分の名前、年齢、身長を変数に格納\n- 型変換を使って計算を行う\n- 結果を出力する',
    dueDate: new Date('2024-02-20'),
    maxScore: 100,
    createdAt: new Date('2024-02-01'),
    type: 'essay',
    isRequired: true,
    orderIndex: 1
  },
  {
    id: '2',
    curriculumIds: ['3'],
    title: 'Python基礎課題2',
    description: '条件分岐を使用したプログラムを作成してください。\n\n**要件:**\n- ユーザーから点数を入力\n- 点数に応じて成績を表示\n- エラーハンドリングを含める',
    dueDate: new Date('2024-02-25'),
    maxScore: 100,
    createdAt: new Date('2024-02-05'),
    type: 'project',
    isRequired: true,
    orderIndex: 2
  },
  {
    id: '3',
    curriculumIds: ['4', '5'],
    title: 'HTML基礎課題',
    description: '基本的なHTMLページを作成してください。\n\n**要件:**\n- 自己紹介ページ\n- 画像とリンクを含める\n- 適切なセマンティックタグを使用',
    dueDate: new Date('2024-02-28'),
    maxScore: 100,
    createdAt: new Date('2024-02-10'),
    type: 'project',
    isRequired: true,
    orderIndex: 1
  },
  {
    id: '4',
    curriculumIds: ['6'],
    title: 'React基礎課題',
    description: 'Reactコンポーネントを作成してください。\n\n**要件:**\n- 関数コンポーネントを使用\n- propsを活用\n- 適切なJSXを記述',
    dueDate: new Date('2024-03-05'),
    maxScore: 100,
    createdAt: new Date('2024-02-20'),
    type: 'project',
    isRequired: false,
    orderIndex: 1
  }
]

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    userId: '3',
    content: `# Python基礎課題1の解答

\`\`\`python
# 変数の宣言
name = "佐藤花子"
age = 25
height = 165.5

# 型変換と計算
age_str = str(age)
height_cm = int(height)

# 結果の出力
print(f"名前: {name}")
print(f"年齢: {age_str}歳")
print(f"身長: {height_cm}cm")
print(f"BMI計算用身長: {height/100}m")
\`\`\``,
    status: 'graded',
    score: 95,
    feedback: 'とても良い解答です。型変換の使い方が適切で、コードも読みやすいです。BMIの計算例も追加されていて素晴らしいです。',
    submittedAt: new Date('2024-02-08'),
    reviewedAt: new Date('2024-02-09'),
    reviewedBy: '2',
    attemptNumber: 1
  },
  {
    id: '2',
    assignmentId: '2',
    userId: '3',
    content: `# Python基礎課題2の解答

\`\`\`python
try:
    score = int(input("点数を入力してください: "))
    
    if score >= 90:
        grade = "優秀"
    elif score >= 70:
        grade = "良好"
    elif score >= 60:
        grade = "可"
    else:
        grade = "不可"
    
    print(f"あなたの成績は{grade}です")
    
except ValueError:
    print("エラー: 数値を入力してください")
except Exception as e:
    print(f"予期しないエラーが発生しました: {e}")
\`\`\``,
    status: 'submitted',
    submittedAt: new Date('2024-02-15'),
    attemptNumber: 1
  },
  {
    id: '3',
    assignmentId: '1',
    userId: '4',
    content: `# Python基礎課題1の解答

\`\`\`python
name = "田中次郎"
age = 28
height = 175.0

print("名前:", name)
print("年齢:", age)
print("身長:", height)
\`\`\``,
    status: 'graded',
    score: 70,
    feedback: '基本的な要件は満たしていますが、型変換の使用例が少ないです。もう少し様々な型変換を試してみてください。',
    submittedAt: new Date('2024-02-12'),
    reviewedAt: new Date('2024-02-13'),
    reviewedBy: '2',
    attemptNumber: 1
  }
]

export const mockCurriculumEnrollments: CurriculumEnrollment[] = [
  {
    id: '1',
    userId: '3',
    curriculumId: '1',
    enrollmentId: '1',
    status: 'completed',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-05'),
    progress: 100,
    assignedBy: '2',
    assignedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    userId: '3',
    curriculumId: '2',
    enrollmentId: '1',
    status: 'completed',
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-10'),
    progress: 100,
    assignedBy: '2',
    assignedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    userId: '3',
    curriculumId: '3',
    enrollmentId: '1',
    status: 'active',
    startDate: new Date('2024-02-10'),
    progress: 50,
    assignedBy: '2',
    assignedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    userId: '4',
    curriculumId: '1',
    enrollmentId: '3',
    status: 'completed',
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-02-12'),
    progress: 100,
    assignedBy: '2',
    assignedAt: new Date('2024-02-10')
  },
  {
    id: '5',
    userId: '4',
    curriculumId: '2',
    enrollmentId: '3',
    status: 'active',
    startDate: new Date('2024-02-12'),
    progress: 0,
    assignedBy: '2',
    assignedAt: new Date('2024-02-10')
  },
  {
    id: '6',
    userId: '4',
    curriculumId: '6',
    enrollmentId: '4',
    status: 'completed',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-16'),
    progress: 100,
    assignedBy: '2',
    assignedAt: new Date('2024-02-15')
  }
]