import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Multi-Translator',
  description: 'Modern AI-powered translation tool supporting 200+ languages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-indigo-50`}>
        <div className="min-h-screen bg-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}
