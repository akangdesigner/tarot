'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { TOPICS, SPREADS, DRAWABLE_CARDS, cardImage, type Topic, type Spread, type TarotCard } from '@/lib/tarot'

type Drawn = { card: TarotCard; reversed: boolean; position: string }

function randomInt(max: number) {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const PANEL = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
const ACTIVE = { background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(167,139,250,0.55)' }

function CardBack({ className = '' }: { className?: string }) {
  return (
    <div
      className={`aspect-[7/12] rounded-md sm:rounded-lg flex items-center justify-center ${className}`}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.35), transparent 60%), linear-gradient(160deg,#1e1b4b,#312e81 55%,#0f172a)',
        border: '1px solid rgba(196,181,253,0.35)',
      }}
    >
      <span className="text-violet-200/70 text-xs sm:text-base">✦</span>
    </div>
  )
}

export default function TarotReader() {
  const topRef = useRef<HTMLDivElement>(null)
  const content = useContent()
  const step = content.step
  // 換步驟時把畫面捲回工具頂端，不然手機按完「洗牌」會停在頁面下方看不到牌堆
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])
  return <div ref={topRef} className="scroll-mt-24">{content.node}</div>
}

function useContent(): { step: string; node: React.ReactNode } {
  const [topic, setTopic] = useState<Topic | null>(null)
  const [spread, setSpread] = useState<Spread | null>(null)
  const [question, setQuestion] = useState('')
  const [deck, setDeck] = useState<TarotCard[] | null>(null)
  const [picked, setPicked] = useState<number[]>([])
  const [result, setResult] = useState<Drawn[] | null>(null)
  const [revealed, setRevealed] = useState(0)

  const need = spread?.positions.length ?? 0
  const topicInfo = TOPICS.find((t) => t.id === topic)

  function startShuffle() {
    setDeck(shuffle(DRAWABLE_CARDS))
    setPicked([])
    setResult(null)
    setRevealed(0)
  }

  function pick(index: number) {
    if (!deck || !spread || picked.includes(index) || picked.length >= need) return
    const next = [...picked, index]
    setPicked(next)
    if (next.length === need) {
      setResult(
        next.map((i, n) => ({ card: deck[i], reversed: randomInt(2) === 1, position: spread.positions[n] })),
      )
    }
  }

  function reset() {
    setDeck(null)
    setPicked([])
    setResult(null)
    setRevealed(0)
  }

  // 結果
  if (result && topic) {
    const allShown = revealed >= result.length
    return { step: 'result', node: (
      <section aria-live="polite">
        <div className="rounded-2xl p-5 sm:p-6 mb-6" style={PANEL}>
          <p className="text-sm text-slate-400">
            {topicInfo?.icon} {topicInfo?.label}・{spread?.name}
          </p>
          {question && <p className="text-white mt-1">「{question}」</p>}
        </div>

        <div
          className={`grid gap-3 sm:gap-4 mb-8 ${
            result.length === 1 ? 'grid-cols-1 max-w-[180px] mx-auto' : result.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-5'
          }`}
        >
          {result.map((d, i) => (
            <button
              key={d.card.id}
              type="button"
              onClick={() => i === revealed && setRevealed(revealed + 1)}
              className="text-center"
              disabled={i !== revealed}
              aria-label={i < revealed ? `${d.position}：${d.card.name}` : `翻開第 ${i + 1} 張牌`}
            >
              <p className="text-xs text-violet-300 mb-2">{d.position}</p>
              {i < revealed ? (
                <Image
                  src={cardImage(d.card.id)}
                  alt={`塔羅牌${d.card.name}（${d.card.nameEn}）${d.reversed ? '逆位' : '正位'}`}
                  width={300}
                  height={520}
                  className={`w-full aspect-[7/12] object-cover rounded-md sm:rounded-lg ${d.reversed ? 'rotate-180' : ''}`}
                />
              ) : (
                <CardBack className={i === revealed ? 'animate-pulse cursor-pointer' : 'opacity-50'} />
              )}
              {i < revealed && (
                <p className="text-sm text-white mt-2">
                  {d.card.name}
                  <span className={d.reversed ? 'text-rose-300' : 'text-emerald-300'}>・{d.reversed ? '逆位' : '正位'}</span>
                </p>
              )}
            </button>
          ))}
        </div>

        {!allShown && (
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm mb-3">點發亮的牌，一張一張翻開</p>
            <button
              type="button"
              onClick={() => setRevealed(result.length)}
              className="text-sm text-violet-300 hover:text-violet-200 underline underline-offset-4"
            >
              全部翻開
            </button>
          </div>
        )}

        {revealed > 0 && (
          <div className="space-y-4">
            {result.slice(0, revealed).map((d) => {
              const reading = d.card.meanings![topic]
              return (
                <article key={d.card.id} className="rounded-2xl p-5 sm:p-6" style={PANEL}>
                  <p className="text-xs text-violet-300 mb-1">{d.position}</p>
                  <h3 className="text-white font-semibold mb-1">
                    {d.card.name} {d.reversed ? '逆位' : '正位'}
                    <span className="text-slate-500 text-sm font-normal ml-2">{d.card.nameEn}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{d.reversed ? d.card.keywords?.rev : d.card.keywords?.up}</p>
                  <p className="text-slate-300 leading-relaxed">{d.reversed ? reading.rev : reading.up}</p>
                </article>
              )
            })}
          </div>
        )}

        {allShown && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button type="button" onClick={startShuffle} className="rounded-xl px-5 py-3 text-white font-medium" style={ACTIVE}>
              同一個問題再抽一次
            </button>
            <button
              type="button"
              onClick={() => { reset(); setSpread(null); setQuestion('') }}
              className="rounded-xl px-5 py-3 text-slate-300"
              style={PANEL}
            >
              換一個問題
            </button>
          </div>
        )}
      </section>
    ) }
  }

  // 選牌
  if (deck && spread) {
    return { step: `pick-${deck.map((c) => c.id).join()}`, node: (
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white">
            請憑直覺選 <span className="text-violet-300 font-semibold">{need}</span> 張牌
            <span className="text-slate-500 text-sm ml-2">（已選 {picked.length}／{need}）</span>
          </p>
          <button type="button" onClick={reset} className="text-sm text-slate-400 hover:text-slate-200">
            ← 返回
          </button>
        </div>
        {picked.length > 0 && (
          <p className="text-sm text-slate-400 mb-4">
            {spread.positions.slice(0, picked.length).map((p, i) => `${i + 1}. ${p}`).join('　')}
          </p>
        )}
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2">
          {deck.map((card, i) => {
            const order = picked.indexOf(i)
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => pick(i)}
                aria-label={order >= 0 ? `已選第 ${order + 1} 張` : `選這張牌`}
                className={`relative transition-transform duration-200 ${order >= 0 ? '-translate-y-2 opacity-40' : 'hover:-translate-y-1'}`}
              >
                <CardBack />
                {order >= 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">{order + 1}</span>
                )}
              </button>
            )
          })}
        </div>
      </section>
    ) }
  }

  // 設定問題
  return { step: 'setup', node: (
    <section className="space-y-8">
      <div>
        <h2 className="text-white font-semibold mb-3">1. 想問哪一方面？</h2>
        <div className="grid grid-cols-3 gap-3">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className="rounded-xl py-4 text-white transition-colors"
              style={topic === t.id ? ACTIVE : PANEL}
              aria-pressed={topic === t.id}
            >
              <span className="block text-2xl mb-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-white font-semibold mb-3">2. 選一個牌陣</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPREADS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpread(s)}
              className="rounded-xl p-4 text-left transition-colors"
              style={spread?.id === s.id ? ACTIVE : PANEL}
              aria-pressed={spread?.id === s.id}
            >
              <span className="text-white font-medium">{s.name}</span>
              <span className="text-slate-500 text-sm ml-2">{s.positions.length} 張</span>
              <span className="block text-sm text-slate-400 mt-1">{s.hint}</span>
              <span className="block text-xs text-violet-300/80 mt-2">{s.positions.join(' → ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="tarot-question" className="block text-white font-semibold mb-3">
          3. 在心裡想好你的問題<span className="text-slate-500 text-sm font-normal ml-2">（可以不寫）</span>
        </label>
        <input
          id="tarot-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={60}
          placeholder={topicInfo ? `例如：${topicInfo.example}` : '例如：這份工作還值得待下去嗎？'}
          className="w-full rounded-xl px-4 py-3 bg-transparent text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
          style={PANEL}
        />
      </div>

      <button
        type="button"
        onClick={startShuffle}
        disabled={!topic || !spread}
        className="w-full rounded-xl py-4 text-white font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(90deg,#7c3aed,#4f46e5)' }}
      >
        {!topic ? '先選想問的方面' : !spread ? '再選一個牌陣' : '洗牌，開始抽牌'}
      </button>
    </section>
  ) }
}
