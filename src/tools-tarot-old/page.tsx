import { buildMetadata } from '@/lib/metadata'
import { PERSON_REF, jsonLdScript } from '@/lib/jsonld'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { SPREADS } from '@/lib/tarot'
import TarotReader from './TarotReader'

export const metadata = buildMetadata({
  title: '塔羅牌線上占卜｜免費抽牌：事業、愛情、學業',
  description:
    '免費塔羅牌線上占卜，不用註冊也不用下載。先選事業、愛情或學業，再挑時間之流、聖三角、二擇一等牌陣，親手洗牌抽牌，每張牌都有正位與逆位解讀。',
  keywords: ['塔羅牌線上占卜', '線上塔羅 免費', '塔羅牌陣', '愛情塔羅', '事業塔羅', '塔羅正位逆位'],
  path: '/tools/tarot',
})

const FAQ = [
  {
    q: '線上塔羅牌占卜準嗎？',
    a: '塔羅是幫你整理想法的工具，不是預言。抽到的牌會給你一個切入角度，讓你重新看自己的處境；真正的決定還是要看實際狀況。重大的醫療、法律、財務問題，請找專業人士。',
  },
  {
    q: '正位跟逆位差在哪？',
    a: '牌面朝上是正位，倒過來是逆位。正位通常是這張牌能量順利發揮的樣子，逆位則代表能量受阻、過頭或還沒到位，不一定是壞事。例如月亮逆位，反而是迷霧散去、開始看清。',
  },
  {
    q: '不知道該選哪個牌陣怎麼辦？',
    a: '只想要一個提醒就用單張牌；想知道事情怎麼發展用時間之流；想弄懂原因用聖三角；卡在兩個選項之間用二擇一；一直卡關找不到原因用直指核心。',
  },
  {
    q: '同一個問題可以一直重抽嗎？',
    a: '可以，但連續重抽通常只是想抽到想要的答案。比較好的做法是抽一次，認真看完解讀，隔幾天狀況有變化再問。',
  },
  {
    q: '這裡用的是哪一套塔羅牌？',
    a: '牌面是 1909 年初版的偉特塔羅（Rider-Waite-Smith），由 Pamela Colman Smith 繪製，也是現在最多人學的版本。這套圖已經是公有領域，牌圖取自 Wikimedia Commons。',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '塔羅牌線上占卜',
    description: '選事業、愛情或學業，挑一個牌陣親手抽牌，看每張牌的正位與逆位解讀。免費使用，不需要註冊。',
    url: 'https://aiqkangber.com/tools/tarot',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    inLanguage: 'zh-TW',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
    author: PERSON_REF,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function TarotPage() {
  return (
    <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.10), transparent 60%)' }}
      />

      <Breadcrumbs crumbs={[{ label: '首頁', href: '/' }, { label: '工具站', href: '/tools' }, { label: '塔羅牌線上占卜' }]} />

      <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] mb-4">塔羅牌線上占卜</h1>
      <p className="text-slate-400 leading-relaxed mb-10">
        選你想問的事業、愛情或學業，挑一個牌陣，親手從洗好的牌裡抽牌。每張牌都會告訴你它在這個位置的意思，正位和逆位的解讀也不一樣。免費使用，不用註冊。
      </p>

      <TarotReader />

      <section className="mt-20">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-6">常用的塔羅牌陣</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          牌陣決定要抽幾張牌、每張牌放在哪個位置代表什麼。同一張牌放在「過去」跟放在「障礙」，讀法就不一樣。
        </p>
        <div className="space-y-3">
          {SPREADS.map((s) => (
            <div key={s.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-white font-medium">
                {s.name}
                <span className="text-slate-500 text-sm font-normal ml-2">{s.positions.length} 張</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">適合：{s.hint}</p>
              <p className="text-sm text-violet-300/80 mt-1">{s.positions.join(' → ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-6">常見問題</h2>
        <div className="space-y-6">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-white font-medium mb-2">{q}</h3>
              <p className="text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-16 text-xs text-slate-600 leading-relaxed">
        牌圖：Rider-Waite-Smith Tarot（1909），Pamela Colman Smith 繪，公有領域，來源 Wikimedia Commons。占卜結果僅供參考與娛樂。
      </p>
    </main>
  )
}
