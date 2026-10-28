// 整組牌的簡短結論：依正逆位比例、大牌數量、最多的花色、牌陣關鍵牌位，加上主題（事業／愛情／學業）的說法組出幾句話（規則寫死，不接 AI）。
import { TAROT } from './tarot-data'
const SUIT_NOTE = {
  wands: '權杖最多，行動和衝勁是重點。',
  cups: '聖杯最多，人際和情緒是重點。',
  swords: '寶劍最多，想法和溝通是重點，也可能帶點壓力。',
  pents: '錢幣最多，錢和實際的安排是重點。',
}

// slots：依牌位順序的 { label, card, rev }
export function summarize(spreadKey, slots, topic) {
  const n = slots.length
  const r = slots.filter((s) => s.rev).length
  const out = []

  const at = (label) => slots.find((s) => s.label === label)
  const bad = (side) => slots.filter((s) => s.label.includes(`選擇 ${side}`) && s.rev).length
  // 回答問題的關鍵牌位：單張就是那張；時間之流看未來、聖三角看結果、直指核心看對策、二擇一看比較順那邊的結果
  const key = spreadKey === 'single' ? slots[0] : spreadKey === 'time' ? at('未來') : spreadKey === 'triangle' ? at('結果')
    : spreadKey === 'core' ? at('對策') : at(bad('B') < bad('A') ? '選擇 B 的結果' : '選擇 A 的結果')
  const topicLine = TAROT.TOPIC[key.card.group][topic][key.rev ? 1 : 0]

  if (spreadKey === 'single') {
    out.push(slots[0].rev ? '抽到逆位，這件事現在有點卡，先停下來想一想再動。' : '抽到正位，方向沒有錯，可以照著做。')
    out.push(topicLine)
    return out
  }

  if (r === 0) out.push('這次全是正位，事情整體走得算順。')
  else if (r === n) out.push('這次全是逆位，事情現在卡得比較多，先別急著推進。')
  else if (r * 2 > n) out.push('逆位比正位多，有幾個地方卡住了，要花點力氣調整。')
  else if (r * 2 < n) out.push('大部分是正位，整體算順，只有一兩個地方要留意。')
  else out.push('正位和逆位各半，有順的地方，也有卡住的地方。')

  const majors = slots.filter((s) => s.card.group === 'major').length
  if (majors * 2 >= n) out.push('大牌佔了一半以上，這件事對你的影響比你想的大。')
  else if (majors === 0) out.push('全是小牌，比較是日常層面的事，自己調整就能改變。')

  const count = {}
  slots.forEach((s) => { if (s.card.group !== 'major') count[s.card.group] = (count[s.card.group] || 0) + 1 })
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])
  if (top.length && top[0][1] >= 2 && (top.length === 1 || top[0][1] > top[1][1])) out.push(SUIT_NOTE[top[0][0]])

  const head = `「${key.label}」抽到${key.card.name}${key.rev ? '逆位' : ''}，`
  if (spreadKey === 'time' || spreadKey === 'triangle') {
    const first = spreadKey === 'time' ? '過去' : '原因'
    out.push(key.rev
      ? `${head}照現在這樣走下去會不太順。${topicLine}可以回頭看「${first}」那張，找要調整的地方。`
      : `${head}照現在的方向走下去，結果不差。${topicLine}`)
  } else if (spreadKey === 'choice') {
    const a = bad('A'), b = bad('B')
    out.push(a === b ? '兩個選項順不順差不多，看你比較在乎哪一邊的過程。'
      : a < b ? '兩個選項比起來，選 A 那一側卡的地方比較少。' : '兩個選項比起來，選 B 那一側卡的地方比較少。')
    out.push(`${head}${topicLine}`)
  } else if (spreadKey === 'core') {
    out.push(`${head}${key.rev ? '原本想的做法可能要換一個。' : '想到的做法可以放心去試。'}${topicLine}`)
  }
  return out
}
