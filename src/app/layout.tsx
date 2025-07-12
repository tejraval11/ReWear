import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToasterProvider } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReWear - Community Clothing Exchange',
  description: 'Swap and redeem unused clothing through our sustainable fashion platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider>
            {children}
          </ToasterProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 