import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tomas Reimers',
  description: 'Founder. Software developer.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script strategy='afterInteractive' src="https://www.googletagmanager.com/gtag/js?id=G-1713H2NT6Y" />
        <Script strategy='afterInteractive' dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-1713H2NT6Y');        
          `}} />
      </body>
    </html>
  )
}
