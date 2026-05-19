import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '500', '600', '700', '800'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300', '400', '500'] })

export const metadata: Metadata = {
  title: 'inspo.find — AI-powered web inspiration',
  description: 'Encuentra inspiración web, plantillas y herramientas con IA. Describe el sitio que buscas y obtén resultados curados al instante.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
