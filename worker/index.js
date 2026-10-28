// 夜讀塔羅的 AI 結論後端：收到問題與翻開的牌，請 Claude Haiku 寫一段簡短結論。
// 金鑰放在 Worker secret OPENROUTER_API_KEY，前端看不到。
const ALLOW = ['https://akangdesigner.github.io', 'http://localhost:3300']
const MODEL = 'anthropic/claude-haiku-5.5'
const TOPIC = { career: '事業', love: '愛情', study: '學業' }

const SYSTEM = `你是塔羅占卜網站的解牌者，用繁體中文、台灣口語，替使用者這次抽的牌寫「總評」。網頁上已經有每張牌的單獨解釋，不用逐張重講牌義。
要做到：
- 把牌放回使用者的問題和他描述的情況裡講，說出每個牌位的牌在他這件事上對應到什麼。例如他說「她不見面」，就講是哪張牌對到這件事、代表什麼。
- 問題裡有幾個小問題，就逐一直接回答，給明確的傾向，例如「有機會，但前提是……」。不要只說「牌沒有給答案」。
- 最後一段寫「你現在可以做的」：兩到三件具體的事，要能從牌推得出來。
- 只用使用者寫出來的情況，不要編他沒說的細節。
- 正位不一定是好事，逆位也不一定是壞事，照牌本身的意思判斷。
格式：純文字，三到四段，每段開頭是「小標：」，小標依問題而定，例如「接下來的發展：」「能不能復合：」「你現在可以做的：」。段落之間空一行。總長 250 到 400 字。
語氣平實，像朋友講話。不要用「能量」「宇宙」「旅程」「療癒」這類詞，不要用「不是……而是……」句型，不要用破折號，不要用 Markdown 符號，不要開場白和客套結尾。
不保證結果，不給醫療、法律、投資建議；問題跟這些有關時，提醒對方以實際情況或專業意見為準。`

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOW.includes(origin) ? origin : ALLOW[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || ''
    const h = cors(origin)
    if (req.method === 'OPTIONS') return new Response(null, { headers: h })
    if (req.method !== 'POST' || !ALLOW.includes(origin)) return new Response('Forbidden', { status: 403, headers: h })

    let body
    try { body = await req.json() } catch { return new Response('Bad Request', { status: 400, headers: h }) }
    const { topic, spread, question, cards } = body || {}
    if (!TOPIC[topic] || typeof question !== 'string' || !question.trim() || question.length > 200
      || !Array.isArray(cards) || !cards.length || cards.length > 5) {
      return new Response('Bad Request', { status: 400, headers: h })
    }

    const lines = cards.map((c, i) => `${i + 1}. 牌位「${String(c.label).slice(0, 20)}」（${String(c.posNote).slice(0, 40)}）：${String(c.name).slice(0, 20)}${c.rev ? '逆位' : '正位'}，關鍵字：${String(c.keywords).slice(0, 40)}；意思：${String(c.meaning).slice(0, 80)}`)
    const user = `主題：${TOPIC[topic]}\n牌陣：${String(spread).slice(0, 10)}\n問題：${question.trim()}\n\n翻開的牌：\n${lines.join('\n')}`

    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1500, reasoning: { enabled: false }, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }] }),
    })
    if (!r.ok) { console.log('openrouter', r.status, (await r.text()).slice(0, 300)); return new Response('Upstream Error', { status: 502, headers: h }) }
    const data = await r.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) return new Response('Upstream Error', { status: 502, headers: h })
    return new Response(JSON.stringify({ text }), { headers: { ...h, 'Content-Type': 'application/json' } })
  },
}
