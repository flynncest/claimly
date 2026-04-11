import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "DutchClaim — Find what you're owed in the Netherlands",
  description:
    'DutchClaim checks every Dutch government benefit program against your profile and tells you exactly what you qualify for — in English, in under 2 minutes.',
  keywords: 'benefits Netherlands toeslagen zorgtoeslag huurtoeslag international worker student dutchclaim',
  openGraph: {
    title: "DutchClaim — Find what you're owed in the Netherlands",
    description:
      'Expats and students in the Netherlands miss €3,200+ per year in benefits they\'re entitled to. DutchClaim finds yours in 2 minutes, in English.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-white text-navy font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
