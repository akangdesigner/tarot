import './globals.css'

export const metadata = {
  title: '夜讀塔羅｜免費線上塔羅占卜 · 1909 偉特塔羅 78 張',
  description: '免費塔羅牌線上占卜，使用 1909 年偉特塔羅原版 78 張。事業、愛情、學業三大主題，五種常用牌陣，親手抽牌，翻牌前可自己決定正逆位。',
  // 給同學測試中，先不讓搜尋引擎收錄
  robots: { index: false, follow: false },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0a12' }

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lora:ital,wght@0,500;1,400;1,500&family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+Symbols:wght@400&family=Noto+Sans+Symbols+2&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
