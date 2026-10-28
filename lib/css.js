// 把設計稿的 inline style 字串（"a:b;c:d"）轉成 React style 物件，讓版面照設計稿原樣重現。
import { createElement, useState } from 'react'

const cache = new Map()

function splitDecl(str) {
  const out = []
  let depth = 0, cur = ''
  for (const ch of str) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ';' && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  out.push(cur)
  return out
}

const camel = (p) => {
  if (p.startsWith('--')) return p
  const c = p.replace(/-([a-z])/g, (_, x) => x.toUpperCase())
  return p.startsWith('-webkit-') ? 'Webkit' + c.slice(7) : c
}

export function css(str) {
  if (!str) return undefined
  let o = cache.get(str)
  if (o) return o
  o = {}
  for (const decl of splitDecl(str)) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim(), v = decl.slice(i + 1).trim()
    if (k && v) o[camel(k)] = v
  }
  cache.set(str, o)
  return o
}

// 設計稿裡的 style-hover／style-focus：滑過或聚焦時疊上一組樣式
export function Hv({ as = 'a', style, hover, focus, ...rest }) {
  const [on, setOn] = useState(false)
  const [foc, setFoc] = useState(false)
  const s = { ...css(style), ...(on && hover ? css(hover) : null), ...(foc && focus ? css(focus) : null) }
  return createElement(as, {
    ...rest,
    style: s,
    onMouseEnter: (e) => { setOn(true); rest.onMouseEnter && rest.onMouseEnter(e) },
    onMouseLeave: (e) => { setOn(false); rest.onMouseLeave && rest.onMouseLeave(e) },
    ...(focus ? { onFocus: () => setFoc(true), onBlur: () => setFoc(false) } : null),
  })
}
