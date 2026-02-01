import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">TravelPro Builder</h1>
        <p className="text-xl mb-8">Professional travel package management SaaS</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            התחברות
          </Link>
          <Link
            href="/signup"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
          >
            הרשמה
          </Link>
        </div>
      </div>
    </main>
  )
}
