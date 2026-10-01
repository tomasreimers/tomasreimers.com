import './globals.scss'
import type { Metadata, Viewport } from 'next'
import { Lora } from 'next/font/google'
import Script from 'next/script'

const font = Lora({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#020617',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tomasreimers.com'),
  title: 'Tomas Reimers',
  description: 'Founder. Software developer.',
  openGraph: {
    title: 'Tomas Reimers',
    description: 'Founder. Software developer.',
    url: 'https://tomasreimers.com',
    siteName: 'Tomas Reimers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tomas Reimers',
    description: 'Founder. Software developer.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
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
