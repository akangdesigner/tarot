// 塔羅牌線上占卜的牌組、牌陣與牌義資料。
// 牌圖：1909 年 Rider-Waite-Smith 初版（Pamela Colman Smith 繪），公有領域，取自 Wikimedia Commons，放在 public/tarot。
// 牌義先寫完 22 張大牌；小牌只有牌名，meanings 補齊前不會被抽到（見 DRAWABLE_CARDS）。

export type Topic = 'career' | 'love' | 'study'
export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'

type Reading = { up: string; rev: string }

export type TarotCard = {
  id: string
  name: string
  nameEn: string
  suit: Suit
  /** 正位／逆位關鍵字，結果卡上的小標 */
  keywords?: { up: string; rev: string }
  meanings?: Record<Topic, Reading>
}

export type Spread = {
  id: string
  name: string
  /** 一句話說明適合問什麼 */
  hint: string
  positions: string[]
}

export const TOPICS: { id: Topic; label: string; icon: string; example: string }[] = [
  { id: 'career', label: '事業', icon: '💼', example: '這份工作還值得待下去嗎？' },
  { id: 'love', label: '愛情', icon: '💗', example: '我跟他接下來會怎麼發展？' },
  { id: 'study', label: '學業', icon: '📚', example: '這次考試準備得夠嗎？' },
]

export const SPREADS: Spread[] = [
  { id: 'single', name: '單張牌', hint: '只想要一個方向或今天的提醒', positions: ['給你的提示'] },
  { id: 'time-flow', name: '時間之流', hint: '想知道事情會怎麼發展', positions: ['過去', '現在', '未來'] },
  { id: 'holy-triangle', name: '聖三角', hint: '想弄懂事情為什麼會變成這樣', positions: ['原因', '現況', '結果'] },
  {
    id: 'either-or',
    name: '二擇一',
    hint: '卡在兩個選項之間',
    positions: ['你現在的狀態', '選 A 的過程', '選 B 的過程', '選 A 的結果', '選 B 的結果'],
  },
  { id: 'core', name: '直指核心', hint: '一直卡關，想知道問題出在哪', positions: ['問題核心', '障礙', '對策', '你的優勢'] },
]

const SUIT_NAMES: Record<Exclude<Suit, 'major'>, { zh: string; en: string }> = {
  wands: { zh: '權杖', en: 'Wands' },
  cups: { zh: '聖杯', en: 'Cups' },
  swords: { zh: '寶劍', en: 'Swords' },
  pentacles: { zh: '錢幣', en: 'Pentacles' },
}

const RANKS: { zh: string; en: string }[] = [
  { zh: '一', en: 'Ace' },
  { zh: '二', en: 'Two' },
  { zh: '三', en: 'Three' },
  { zh: '四', en: 'Four' },
  { zh: '五', en: 'Five' },
  { zh: '六', en: 'Six' },
  { zh: '七', en: 'Seven' },
  { zh: '八', en: 'Eight' },
  { zh: '九', en: 'Nine' },
  { zh: '十', en: 'Ten' },
  { zh: '侍者', en: 'Page' },
  { zh: '騎士', en: 'Knight' },
  { zh: '皇后', en: 'Queen' },
  { zh: '國王', en: 'King' },
]

const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'major-00', name: '愚者', nameEn: 'The Fool', suit: 'major',
    keywords: { up: '新的開始・冒險・單純', rev: '衝動・沒想清楚・逃避責任' },
    meanings: {
      career: { up: '適合踏出第一步，換跑道、接新案子或自己做都可以試。還沒準備到完美也沒關係，邊做邊學。', rev: '想法很多但還沒落地。先算清楚錢跟時間再跳，別因為一時煩躁就裸辭。' },
      love: { up: '一段輕鬆、沒有包袱的感情正在靠近，單身的人容易有新的邂逅。先享受相處，不用急著定義關係。', rev: '這段關係可能太隨性，雙方對未來的想像不一樣。別只顧著好玩，該講清楚的要講。' },
      study: { up: '對新科目或新領域充滿好奇，是開始學一樣新東西的好時機。', rev: '容易三分鐘熱度、東學一點西學一點。先挑一個主題，把基礎打穩。' },
    },
  },
  {
    id: 'major-01', name: '魔術師', nameEn: 'The Magician', suit: 'major',
    keywords: { up: '行動力・資源到位・自信', rev: '空有想法・話術・能力用錯地方' },
    meanings: {
      career: { up: '需要的資源和能力你都有了，現在就是動手的時候。提案、面試、談合作都容易成功。', rev: '有點眼高手低，或計畫一直停在口頭上。也要小心對方話講得很漂亮，實際做不到。' },
      love: { up: '你很有魅力，主動出擊容易有好結果。有對象的話，關係會因為你的用心而升溫。', rev: '對方的甜言蜜語聽聽就好，觀察他做了什麼比較準。你自己也別用手段經營感情。' },
      study: { up: '理解力和表達力都很好，適合報告、口試、做專題。', rev: '會的東西很多但不夠深。考前別再開新範圍，把已經會的練熟。' },
    },
  },
  {
    id: 'major-02', name: '女祭司', nameEn: 'The High Priestess', suit: 'major',
    keywords: { up: '直覺・沉靜・暗中觀察', rev: '想太多・情緒壓抑・資訊不透明' },
    meanings: {
      career: { up: '先別急著表態，多觀察、多收集資訊。你的直覺會告訴你誰值得信任。', rev: '有些事情你還不知道，或有人沒把話講明白。做決定前先問清楚。' },
      love: { up: '關係偏向細水長流，兩人的默契大過熱情。暗戀的人會想再觀察一下。', rev: '把感受悶在心裡太久了，對方猜不到你在想什麼。找個時間好好說出來。' },
      study: { up: '適合自己安靜讀書、做研究，獨自念書的效率會比參加讀書會好。', rev: '讀書時容易分心，或想太多導致遲遲不開始。先從最小的一章動手。' },
    },
  },
  {
    id: 'major-03', name: '皇后', nameEn: 'The Empress', suit: 'major',
    keywords: { up: '豐盛・滋養・創造力', rev: '過度付出・停滯・依賴' },
    meanings: {
      career: { up: '努力開始有收穫，收入或成果會成長。跟創意、設計、照顧人有關的工作特別順。', rev: '付出很多卻沒被看見，或做事太舒適沒有進展。檢查一下是不是一直在幫別人收爛攤子。' },
      love: { up: '感情甜蜜穩定，彼此照顧得很好，也是適合談結婚、同居的時機。', rev: '你給太多了，對方可能已經習慣被照顧。愛別人之前，記得也照顧自己。' },
      study: { up: '學習環境舒服，進度穩定。藝術、語言、需要感受力的科目表現好。', rev: '有點太安逸，讀書計畫一直往後拖。給自己設一個看得到的期限。' },
    },
  },
  {
    id: 'major-04', name: '皇帝', nameEn: 'The Emperor', suit: 'major',
    keywords: { up: '穩定・規則・掌控', rev: '固執・控制欲・權威壓力' },
    meanings: {
      career: { up: '照規矩一步步來會有好結果，適合談升遷、爭取主管職，或把團隊流程建起來。', rev: '跟上司或制度起衝突，或你自己太強勢讓人不敢靠近。試著放一點空間給別人。' },
      love: { up: '關係穩定可靠，對方是會負責任的人。適合一起規劃未來，例如買房、存錢。', rev: '有一方管太多，相處變得像上下級。愛不是控制，雙方都需要喘息的空間。' },
      study: { up: '用固定的作息和計畫讀書最有效，自律會帶來好成績。', rev: '計畫排得太死反而讀不下去，或被家人、老師的期待壓得很累。' },
    },
  },
  {
    id: 'major-05', name: '教皇', nameEn: 'The Hierophant', suit: 'major',
    keywords: { up: '傳統・前輩指引・學習', rev: '不想照規矩・價值觀不合・盲從' },
    meanings: {
      career: { up: '找有經驗的前輩或主管請教會很有幫助，大公司、制度完整的地方適合你。', rev: '你對公司文化或既有做法越來越不認同。想打破框架前，先想好替代方案。' },
      love: { up: '關係走傳統、穩重的路線，可能會見家長、談婚事，或透過朋友介紹認識對象。', rev: '兩人對感情或家庭的觀念不一樣，或你為了符合別人的期待勉強自己。' },
      study: { up: '好好跟著老師、課本學就對了，報名課程、找家教都很適合。', rev: '老師教的方法不適合你，可以試試看自學或換一種讀法。' },
    },
  },
  {
    id: 'major-06', name: '戀人', nameEn: 'The Lovers', suit: 'major',
    keywords: { up: '吸引・選擇・合作', rev: '猶豫不決・價值觀衝突・關係失衡' },
    meanings: {
      career: { up: '遇到很合拍的合作夥伴，或面臨一個重要選擇。選讓你真心想投入的那個。', rev: '團隊合作出現摩擦，或在兩個機會中搖擺太久，錯過了時機。' },
      love: { up: '戀愛運很強，兩人彼此吸引、心意相通。單身的人容易遇到讓你心動的人。', rev: '感情出現第三方、溝通不良，或你在兩個人之間猶豫。先問自己真正想要什麼。' },
      study: { up: '跟同學一起讀書效果好，也可能面臨選系、選組，跟著興趣選比較不會後悔。', rev: '在科系或方向之間拿不定主意，或因為感情分心影響課業。' },
    },
  },
  {
    id: 'major-07', name: '戰車', nameEn: 'The Chariot', suit: 'major',
    keywords: { up: '前進・意志力・勝利', rev: '失控・方向混亂・衝太快' },
    meanings: {
      career: { up: '幹勁十足，只要專心衝刺就會贏。適合爭取業績、搶下專案、出差開拓。', rev: '同時想做太多事，力氣被拉向不同方向。先決定最重要的一件。' },
      love: { up: '主動追求會成功，關係也會往前推進一大步。遠距離的感情可以撐過去。', rev: '兩人步調不一致，一個想衝一個想慢，或吵架時都不肯讓步。' },
      study: { up: '考前衝刺效果非常好，目標明確、讀書很有動力。', rev: '讀書有一搭沒一搭，或太拚把自己累壞。調整一下節奏。' },
    },
  },
  {
    id: 'major-08', name: '力量', nameEn: 'Strength', suit: 'major',
    keywords: { up: '耐心・溫柔的堅定・勇氣', rev: '沒自信・情緒失控・硬撐' },
    meanings: {
      career: { up: '用耐心和好脾氣處理難搞的人事物，會比硬碰硬有效。你比自己想的更有能力。', rev: '壓力大到快撐不住，或開始懷疑自己。可以求助，不用一個人扛。' },
      love: { up: '用包容和溫柔經營關係，能化解很多問題。這段感情經得起考驗。', rev: '容易為小事爆炸，或太委屈自己。界線要畫出來，溫柔不等於忍耐。' },
      study: { up: '面對困難的科目也能慢慢啃下來，穩定的努力會被看見。', rev: '對自己的能力沒信心，還沒考就先放棄。先把一題做對，信心會回來。' },
    },
  },
  {
    id: 'major-09', name: '隱者', nameEn: 'The Hermit', suit: 'major',
    keywords: { up: '獨處・反思・找答案', rev: '孤立・封閉・逃避人群' },
    meanings: {
      career: { up: '適合退一步想清楚自己要什麼，專業深耕、研究型的工作會有進展。', rev: '把自己關起來不跟人交流，錯過了資訊和機會。該出去看看了。' },
      love: { up: '現在比較需要自己的時間，感情暫時放慢也沒關係。單身的人先好好認識自己。', rev: '一方太冷淡、不願意溝通，讓另一方覺得被推開。' },
      study: { up: '一個人專心讀書效率最高，適合準備大考或寫論文。', rev: '讀到鑽牛角尖，卡住也不問人。找老師或同學聊一聊會快很多。' },
    },
  },
  {
    id: 'major-10', name: '命運之輪', nameEn: 'Wheel of Fortune', suit: 'major',
    keywords: { up: '轉機・好運・順勢而為', rev: '運氣低潮・時機不對・反覆' },
    meanings: {
      career: { up: '局勢正在往好的方向轉，可能有意外的機會或貴人出現，抓住它。', rev: '目前運勢在低點，事情容易卡住或變卦。先穩住，等時機回來。' },
      love: { up: '緣分到了，可能突然遇到對的人，或關係出現好的轉折。', rev: '感情忽冷忽熱、分分合合。看清楚這是不是你想要的循環。' },
      study: { up: '考運不錯，有時候剛好讀到的就是考題。但運氣只是加分，努力不能停。', rev: '狀況起伏大，可能遇到臨時改考試範圍之類的變動。保持彈性。' },
    },
  },
  {
    id: 'major-11', name: '正義', nameEn: 'Justice', suit: 'major',
    keywords: { up: '公平・理性判斷・承擔', rev: '不公平・偏見・逃避後果' },
    meanings: {
      career: { up: '付出會得到相對應的回報。適合處理合約、法律、談條件，照規則來就對了。', rev: '覺得被不公平對待，或合約、文件有疏漏。白紙黑字的東西要再看一次。' },
      love: { up: '兩人關係平等、互相尊重。要做感情上的決定時，理性想清楚會比較好。', rev: '付出不對等，一方給太多一方給太少。要談就要攤開來談。' },
      study: { up: '努力多少就收穫多少，成績會反映你真正的實力。', rev: '覺得評分不公平，或讀書方法有偏差。先檢查自己哪裡可以調整。' },
    },
  },
  {
    id: 'major-12', name: '吊人', nameEn: 'The Hanged Man', suit: 'major',
    keywords: { up: '暫停・換個角度・犧牲', rev: '白白犧牲・拖延・卡住不動' },
    meanings: {
      career: { up: '事情暫時卡住，但這段等待有意義。換個角度看，可能會發現新做法。', rev: '一直在等、一直在忍，卻沒換來任何東西。是時候做決定了。' },
      love: { up: '感情進入停滯期，先別急著逼對方給答案，給彼此一點時間。', rev: '為這段關係犧牲太多，卻看不到改變。問問自己還要等多久。' },
      study: { up: '進度變慢沒關係，換一種讀法或從不同科目切入，會豁然開朗。', rev: '一直拖著不讀，或用錯方法硬讀。停下來想想問題出在哪。' },
    },
  },
  {
    id: 'major-13', name: '死神', nameEn: 'Death', suit: 'major',
    keywords: { up: '結束・轉變・重新開始', rev: '不肯放手・害怕改變・拖延結束' },
    meanings: {
      career: { up: '一個階段要結束了，可能是換工作、專案收尾或部門調整。結束之後才有新的開始。', rev: '明知道該離開或該改變，卻一直捨不得。拖越久越耗損自己。' },
      love: { up: '舊的相處模式要結束，可能是分手，也可能是關係脫胎換骨。不一定是壞事。', rev: '放不下過去的人或過去的傷，新的感情進不來。' },
      study: { up: '適合放下沒用的讀書方法，或結束一個方向、轉換跑道。', rev: '明知道這個科系或方法不適合，卻因為已經投入很多而不敢換。' },
    },
  },
  {
    id: 'major-14', name: '節制', nameEn: 'Temperance', suit: 'major',
    keywords: { up: '平衡・調和・慢慢來', rev: '失衡・極端・急躁' },
    meanings: {
      career: { up: '工作和生活取得平衡，跨部門協調、溝通的事會很順利。穩穩做就好。', rev: '工作量失衡，不是忙爆就是太閒。也可能跟同事之間合不來。' },
      love: { up: '兩人相處和諧，懂得互相配合、各退一步，是很健康的關係。', rev: '一方付出太多或要求太多，關係開始失去平衡。' },
      study: { up: '各科平均分配時間，規律讀書效果最好。', rev: '偏科嚴重，或一下狂讀一下完全不讀。把節奏調回來。' },
    },
  },
  {
    id: 'major-15', name: '惡魔', nameEn: 'The Devil', suit: 'major',
    keywords: { up: '束縛・誘惑・執著', rev: '掙脫・看清・擺脫壞習慣' },
    meanings: {
      career: { up: '被高薪、壓力或習慣綁住，明知道不開心卻走不了。也要小心誘人但有風險的機會。', rev: '開始看清讓你困住的是什麼，準備脫離不健康的工作環境。' },
      love: { up: '關係裡有強烈的吸引力，但也可能是占有欲、依賴，或明知不對還放不下。', rev: '準備從一段消耗你的關係中走出來，或戒掉不好的相處模式。' },
      study: { up: '被手機、遊戲或其他誘惑分心，讀書時間一直被吃掉。', rev: '意識到自己的壞習慣，開始想辦法改。是好的轉折。' },
    },
  },
  {
    id: 'major-16', name: '高塔', nameEn: 'The Tower', suit: 'major',
    keywords: { up: '突發變化・崩解・真相揭露', rev: '躲過一劫・害怕改變・慢性崩壞' },
    meanings: {
      career: { up: '可能有突然的變動，例如組織調整、專案取消。打掉重來雖然痛，但會讓你看清狀況。', rev: '危機還在醞釀，或你一直在逃避該面對的問題。提早處理比較好。' },
      love: { up: '關係可能因為一件事突然起衝突，或某個真相浮上檯面。', rev: '問題一直存在只是沒爆開，硬撐不會讓它消失。' },
      study: { up: '計畫被打亂，像是考試範圍突然改變。調整心情，重新安排就好。', rev: '知道自己進度落後卻不敢面對。現在調整還來得及。' },
    },
  },
  {
    id: 'major-17', name: '星星', nameEn: 'The Star', suit: 'major',
    keywords: { up: '希望・療癒・願望實現', rev: '失望・沒信心・期待落空' },
    meanings: {
      career: { up: '前景看好，你的才華會被看見。適合許下目標、投履歷、經營個人品牌。', rev: '對工作失去熱情，或覺得努力沒有希望。先找回一件讓你開心的小事。' },
      love: { up: '感情帶來療癒和希望，受過傷的人會遇到溫柔的對象。', rev: '對感情有點灰心，或把對方想得太完美，期待落空。' },
      study: { up: '對未來有清楚的目標，讀書很有動力，考試、申請學校都有好消息。', rev: '覺得目標太遠、看不到盡頭。把大目標切成小目標會比較有感覺。' },
    },
  },
  {
    id: 'major-18', name: '月亮', nameEn: 'The Moon', suit: 'major',
    keywords: { up: '不安・迷霧・看不清', rev: '真相浮現・恐懼散去・慢慢看清' },
    meanings: {
      career: { up: '狀況還不明朗，資訊不完整，也可能有人沒說實話。重要決定先緩一緩。', rev: '原本看不清的事情漸漸明朗，困擾你的疑慮會慢慢解開。' },
      love: { up: '對這段感情充滿不安，容易胡思亂想或猜忌。別只靠腦補，直接問比較好。', rev: '誤會解開了，或你終於看清對方是怎樣的人。' },
      study: { up: '方向還很模糊，對考試或未來感到焦慮。先把眼前能做的做好。', rev: '焦慮慢慢減輕，開始知道自己要往哪裡走。' },
    },
  },
  {
    id: 'major-19', name: '太陽', nameEn: 'The Sun', suit: 'major',
    keywords: { up: '成功・快樂・充滿活力', rev: '小挫折・過度樂觀・延遲' },
    meanings: {
      career: { up: '工作運非常好，努力會得到肯定，升遷、加薪、成交的機會很大。', rev: '整體還是順的，只是成果來得比預期慢，或你太樂觀漏了細節。' },
      love: { up: '感情開心、坦率，兩人在一起很快樂，適合公開戀情或一起出遊。', rev: '關係不錯但有點小摩擦，或熱戀期過了需要重新找新鮮感。' },
      study: { up: '考運大好，成績、申請結果都會讓你滿意。', rev: '整體不差，但可能因為粗心或太有自信而失分。' },
    },
  },
  {
    id: 'major-20', name: '審判', nameEn: 'Judgement', suit: 'major',
    keywords: { up: '覺醒・重生・重要決定', rev: '自我懷疑・不願面對・錯過召喚' },
    meanings: {
      career: { up: '過去的努力要開花結果了，也可能有老朋友、前公司帶來新機會。', rev: '一直在自我懷疑，不敢做決定。過去的失敗不代表這次也會失敗。' },
      love: { up: '舊情人可能回來，或兩人一起把關係提升到下一個階段。', rev: '對過去的感情還沒釋懷，或不願意面對關係裡的問題。' },
      study: { up: '考試、面試、成績公布都有好消息，適合補考或重新挑戰。', rev: '對結果很擔心，或一直重複犯同樣的錯。先檢討，再出發。' },
    },
  },
  {
    id: 'major-21', name: '世界', nameEn: 'The World', suit: 'major',
    keywords: { up: '完成・圓滿・新階段', rev: '差一步・未完成・停滯' },
    meanings: {
      career: { up: '專案順利收尾、目標達成，也可能有海外或更大的舞台在等你。', rev: '只差最後一步，卻遲遲收不了尾。把剩下的細節補完。' },
      love: { up: '感情圓滿，適合訂婚、結婚或一起邁向下一個人生階段。', rev: '關係停在某個點上，有些事還沒說開，所以走不下去。' },
      study: { up: '學業順利完成一個階段，畢業、考取證照、出國念書都有好結果。', rev: '快要完成了但缺臨門一腳，例如論文、最後一科。撐住別放棄。' },
    },
  },
]

const MINOR_ARCANA: TarotCard[] = (Object.keys(SUIT_NAMES) as Exclude<Suit, 'major'>[]).flatMap((suit) =>
  RANKS.map((rank, i) => ({
    id: `${suit}-${String(i + 1).padStart(2, '0')}`,
    name: `${SUIT_NAMES[suit].zh}${rank.zh}`,
    nameEn: `${rank.en} of ${SUIT_NAMES[suit].en}`,
    suit,
  })),
)

export const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA]

/** 有牌義的牌才放進牌堆 */
export const DRAWABLE_CARDS = ALL_CARDS.filter((c) => c.meanings)

export const cardImage = (id: string) => `/tarot/${id}.jpg`
