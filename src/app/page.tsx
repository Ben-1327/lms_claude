import Link from 'next/link'
import { BookOpen, Users, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LMS Claude
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI/プログラミング研修のための学習管理システム
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">学習管理</h3>
            <p className="text-gray-600">
              効率的な学習進捗管理と豊富なコンテンツ
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">受講者管理</h3>
            <p className="text-gray-600">
              簡単な受講者登録と学習状況の可視化
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">進捗レポート</h3>
            <p className="text-gray-600">
              詳細な学習分析と成果の可視化
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ログイン
          </Link>
        </div>
      </div>
    </main>
  )
}