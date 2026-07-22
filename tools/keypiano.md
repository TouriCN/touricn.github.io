# 键盘钢琴小工具

输入字符演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，Shift+字母（大写）=黑键。

<ClientOnly>
  <div class="vp-piano">
    <!-- 输入框 -->
    <div class="vp-piano-input">
      <input
        v-model="score"
        type="text"
        class="vp-input"
        placeholder="输入字符演奏，例：QQ55tt5"
        @click="initAudio"
      />
    </div>

    <!-- 当前播放信息 -->
    <div class="vp-piano-info">
      <span class="vp-note">{{ currentNote }}</span>
      <span class="vp-freq">{{ currentFreq }}</span>
    </div>

    <!-- 钢琴键盘 -->
    <div class="vp-piano-body">
      <!-- 数字排 C4-B4 -->
      <div class="vp-piano-row">
        <div v-for="key in whiteKeys.slice(0,7)" :key="key.k" class="vp-key vp-key-white" :data-key="key.k" @mousedown="play(key.k)" @mouseup="stop(key.k)" @mouseleave="stop(key.k)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
      <!-- QWERTY排 C5-E6 -->
      <div class="vp-piano-row">
        <div v-for="k in qwertyKeys" :key="k.k" class="vp-key" :class="k.cls" :data-key="k.k" :style="k.style" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          <span>{{ k.label }}<br>{{ k.note }}</span>
        </div>
      </div>
      <!-- ASDF排 F6-A7 -->
      <div class="vp-piano-row">
        <div v-for="k in asdfKeys" :key="k.k" class="vp-key" :class="k.cls" :data-key="k.k" :style="k.style" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          <span>{{ k.label }}<br>{{ k.note }}</span>
        </div>
      </div>
      <!-- ZXCV排 B7-C8 -->
      <div class="vp-piano-row">
        <div v-for="key in whiteKeys.slice(29,31)" :key="key.k" class="vp-key vp-key-white" :data-key="key.k" @mousedown="play(key.k)" @mouseup="stop(key.k)" @mouseleave="stop(key.k)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
    </div>

    <!-- 提示区 -->
    <div class="vp-piano-hint">
      💡 <strong>键盘钢琴小工具</strong><br>
      输入字符演奏，乐谱可复制粘贴传播。<br>
      规则：小写字母/数字=白键，Shift+字母（大写）=黑键。<br>
      试玩示例：输入 <code>QQ55tt5 QQ44rr4</code> 演奏《小星星》
    </div>
  </div>
</ClientOnly>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// ===== 频率表（A4=440Hz）=====
const FREQ = {
  '1':261.63,'2':293.66,'3':329.63,'4':349.23,'5':392.00,'6':440.00,'7':493.88,
  'q':523.25,'Q':554.37,'w':587.33,'W':622.25,'e':659.25,'r':698.46,'R':739.99,
  't':783.99,'T':830.61,'y':880.00,'Y':932.33,'u':987.77,'i':1046.50,'I':1108.73,
  'o':1174.66,'O':1244.51,'p':1318.51,'a':1396.91,'A':1479.98,'s':1567.98,'S':1661.22,
  'd':1760.00,'D':1864.66,'f':1975.53,'g':2093.00,'G':2217.46,'h':2349.32,'H':2489.02,
  'j':2637.02,'k':2793.83,'K':2959.96,'l':3135.96,'L':3322.44,';':3520.00,
  'z':3951.07,'x':4186.01
}

// ===== 键盘布局数据 =====
const whiteKeys = [
  {k:'1',label:'1',note:'C4'},{k:'2',label:'2',note:'D4'},{k:'3',label:'3',note:'E4'},
  {k:'4',label:'4',note:'F4'},{k:'5',label:'5',note:'G4'},{k:'6',label:'6',note:'A4'},
  {k:'7',label:'7',note:'B4'},{k:'q',label:'Q',note:'C5'},{k:'w',label:'W',note:'D5'},
  {k:'e',label:'E',note:'E5'},{k:'r',label:'R',note:'F5'},{k:'t',label:'T',note:'G5'},
  {k:'y',label:'Y',note:'A5'},{k:'u',label:'U',note:'B5'},{k:'i',label:'I',note:'C6'},
  {k:'o',label:'O',note:'D6'},{k:'p',label:'P',note:'E6'},{k:'a',label:'A',note:'F6'},
  {k:'s',label:'S',note:'G6'},{k:'d',label:'D',note:'A6'},{k:'f',label:'F',note:'B6'},
  {k:'g',label:'G',note:'C7'},{k:'h',label:'H',note:'D7'},{k:'j',label:'J',note:'E7'},
  {k:'k',label:'K',note:'F7'},{k:'l',label:'L',note:'G7'},{k:';',label:';',note:'A7'},
  {k:'z',label:'Z',note:'B7'},{k:'x',label:'X',note:'C8'}
]

const qwertyKeys = [
  {k:'q',label:'Q',note:'C5',cls:'vp-key-white'},
  {k:'Q',label:'Q',note:'C#5',cls:'vp-key-black',style:'left:calc(100%/14*1 - 2.6%)'},
  {k:'w',label:'W',note:'D5',cls:'vp-key-white'},
  {k:'W',label:'W',note:'D#5',cls:'vp-key-black',style:'left:calc(100%/14*2 - 2.6%)'},
  {k:'e',label:'E',note:'E5',cls:'vp-key-white'},
  {k:'r',label:'R',note:'F5',cls:'vp-key-white'},
  {k:'R',label:'R',note:'F#5',cls:'vp-key-black',style:'left:calc(100%/14*4 - 2.6%)'},
  {k:'t',label:'T',note:'G5',cls:'vp-key-white'},
  {k:'T',label:'T',note:'G#5',cls:'vp-key-black',style:'left:calc(100%/14*6 - 2.6%)'},
  {k:'y',label:'Y',note:'A5',cls:'vp-key-white'},
  {k:'Y',label:'Y',note:'A#5',cls:'vp-key-black',style:'left:calc(100%/14*7 - 2.6%)'},
  {k:'u',label:'U',note:'B5',cls:'vp-key-white'},
  {k:'i',label:'I',note:'C6',cls:'vp-key-white'},
  {k:'I',label:'I',note:'C#6',cls:'vp-key-black',style:'left:calc(100%/14*9 - 2.6%)'},
  {k:'o',label:'O',note:'D6',cls:'vp-key-white'},
  {k:'O',label:'O',note:'D#6',cls:'vp-key-black',style:'left:calc(100%/14*10 - 2.6%)'},
  {k:'p',label:'P',note:'E6',cls:'vp-key-white'}
]

const asdfKeys = [
  {k:'a',label:'A',note:'F6',cls:'vp-key-white'},
  {k:'A',label:'A',note:'F#6',cls:'vp-key-black',style:'left:calc(100%/17*1 - 2.6%)'},
  {k:'s',label:'S',note:'G6',cls:'vp-key-white'},
  {k:'S',label:'S',note:'G#6',cls:'vp-key-black',style:'left:calc(100%/17*2 - 2.6%)'},
  {k:'d',label:'D',note:'A6',cls:'vp-key-white'},
  {k:'D',label:'D',note:'A#6',cls:'vp-key-black',style:'left:calc(100%/17*3 - 2.6%)'},
  {k:'f',label:'F',note:'B6',cls:'vp-key-white'},
  {k:'g',label:'G',note:'C7',cls:'vp-key-white'},
  {k:'G',label:'G',note:'C#7',cls:'vp-key-black',style:'left:calc(100%/17*5 - 2.6%)'},
  {k:'h',label:'H',note:'D7',cls:'vp-key-white'},
  {k:'H',label:'H',note:'D#7',cls:'vp-key-black',style:'left:calc(100%/17*6 - 2.6%)'},
  {k:'j',label:'J',note:'E7',cls:'vp-key-white'},
  {k:'k',label:'K',note:'F7',cls:'vp-key-white'},
  {k:'K',label:'K',note:'F#7',cls:'vp-key-black',style:'left:calc(100%/17*8 - 2.6%)'},
  {k:'l',label:'L',note:'G7',cls:'vp-key-white'},
  {k:'L',label:'L',note:'G#7',cls:'vp-key-black',style:'left:calc(100%/17*9 - 2.6%)'},
  {k:';',label:';',note:'A7',cls:'vp-key-white'}
]

// ===== 响应式状态 =====
const score = ref('')
const currentNote = ref('--')
const currentFreq = ref('点击输入框激活音频')
let audioCtx = null
let isComposing = false
const activeNodes = new Map()

// ===== 音频初始化（仅用户交互后执行）=====
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  currentFreq.value = '等待输入...'
}

// ===== 核心：播放单个音符 =====
const play = (key) => {
  if (!FREQ[key] || activeNodes.has(key)) return
  initAudio()
  const now = audioCtx.currentTime

  // ADSR 包络：模拟钢琴敲击衰减
  const mainGain = audioCtx.createGain()
  mainGain.gain.setValueAtTime(0, now)
  mainGain.gain.linearRampToValueAtTime(0.3, now + 0.005)
  mainGain.gain.exponentialRampToValueAtTime(0.05, now + 0.2)
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

  // 泛音列：基频 + 2次谐波 + 3次谐波
  const oscs = []
  const o1 = audioCtx.createOscillator()
  o1.type = 'sine'; o1.frequency.value = FREQ[key]
  oscs.push(o1)

  const o2 = audioCtx.createOscillator()
  o2.type = 'triangle'; o2.frequency.value = FREQ[key] * 2
  const g2 = audioCtx.createGain(); g2.gain.value = 0.25
  oscs.push({osc:o2, gain:g2})

  const o3 = audioCtx.createOscillator()
  o3.type = 'square'; o3.frequency.value = FREQ[key] * 3
  const g3 = audioCtx.createGain(); g3.gain.value = 0.15
  oscs.push({osc:o3, gain:g3})

  // 低通滤波：消除电子感
  const lp = audioCtx.createBiquadFilter()
  lp.type = 'lowpass'; lp.frequency.value = 4000; lp.Q.value = 1

  // 轻度混响
  const rg = audioCtx.createGain(); rg.gain.value = 0.12
  const dl = audioCtx.createDelay(); dl.delayTime.value = 0.02
  const fb = audioCtx.createGain(); fb.gain.value = 0.15

  // 连接
  o1.connect(mainGain)
  o2.connect(g2).connect(mainGain)
  o3.connect(g3).connect(mainGain)
  mainGain.connect(lp)
  lp.connect(audioCtx.destination)
  lp.connect(dl).connect(fb).connect(dl)
  dl.connect(rg).connect(audioCtx.destination)

  o1.start(now); o2.start(now); o3.start(now)

  activeNodes.set(key, { oscs: [o1, o2, o3], mainGain })

  // UI
  const isSharp = /[A-G]/.test(key) && key === key.toUpperCase()
  currentNote.value = key.length === 1 ? key.toUpperCase() + (isSharp ? '#' : '') : '--'
  currentFreq.value = FREQ[key].toFixed(2) + ' Hz'
  const el = document.querySelector('.vp-key[data-key="' + key + '"]')
  el?.classList.add('active')

  setTimeout(() => stop(key), 700)
}

// ===== 停止音符 =====
const stop = (key) => {
  const nodes = activeNodes.get(key)
  if (!nodes) return
  const now = audioCtx.currentTime
  nodes.mainGain.gain.cancelScheduledValues(now)
  nodes.mainGain.gain.setValueAtTime(nodes.mainGain.gain.value, now)
  nodes.mainGain.gain.linearRampToValueAtTime(0, now + 0.03)
  nodes.oscs.forEach(o => {
    if (o.stop) o.stop(now + 0.05)
    else o.osc.stop(now + 0.05)
  })
  activeNodes.delete(key)
  const el = document.querySelector('.vp-key[data-key="' + key + '"]')
  el?.classList.remove('active')
}

const stopAll = () => {
  activeNodes.forEach((_, key) => stop(key))
}

// ===== 输入监听 =====
watch(score, (newVal, oldVal) => {
  if (isComposing || newVal.length <= oldVal.length) return
  const added = newVal.slice(oldVal.length)
  for (const c of added) {
    if (FREQ[c]) play(c)
  }
})

// ===== onMounted：所有 DOM/window 操作都在这里 =====
onMounted(() => {
  // 首次交互解锁音频
  document.body.addEventListener('click', initAudio, { once: true })
  document.body.addEventListener('keydown', initAudio, { once: true })

  // 物理键盘
  const onKeyDown = (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
    if (FREQ[e.key]) { e.preventDefault(); play(e.key) }
  }
  const onKeyUp = (e) => { if (FREQ[e.key]) stop(e.key) }

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  // 中文输入法
  const input = document.querySelector('.vp-input')
  input?.addEventListener('compositionstart', () => { isComposing = true })
  input?.addEventListener('compositionend', () => { isComposing = false })

  // 失焦保护
  window.addEventListener('blur', stopAll)

  // 卸载清理
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', stopAll)
    stopAll()
    if (audioCtx) { audioCtx.close(); audioCtx = null }
  })
})
</script>

<style scoped>
.vp-piano { margin: 1.5rem 0; font-family: var(--vp-font-family-base); }

.vp-piano-input { margin-bottom: 12px; }
.vp-input {
  width: 100%; padding: 10px 14px; font-size: 15px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider); border-radius: 6px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.vp-input:focus { border-color: var(--vp-c-brand); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.vp-input::placeholder { color: var(--vp-c-text-3); font-size: 13px; }

.vp-piano-info {
  display: flex; align-items: baseline; gap: 12px;
  padding: 10px 14px; background: var(--vp-c-bg-soft);
  border-radius: 6px; box-shadow: var(--vp-shadow-1); margin-bottom: 14px;
}
.vp-note { font-size: 24px; font-weight: 700; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.vp-freq { font-size: 13px; color: var(--vp-c-text-2); }

.vp-piano-body {
  background: #c0c6cc; padding: 8px; border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), var(--vp-shadow-2);
}
.vp-piano-row { position: relative; display: flex; height: 110px; margin-bottom: 3px; }
.vp-piano-row:last-child { margin-bottom: 0; }

.vp-key {
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 8px; font-size: 9px; font-weight: 600;
  cursor: pointer; transition: transform 0.05s, box-shadow 0.05s, background 0.05s;
  border-radius: 0 0 5px 5px; user-select: none;
}
.vp-key span { pointer-events: none; line-height: 1.3; }

.vp-key-white {
  flex: 1; margin: 0 1px; background: #fff; color: #57606a;
  border: 1px solid #b0b6bc; box-shadow: 0 3px 0 #b0b6bc; z-index: 1;
}
.vp-key-white.active {
  transform: translateY(2px); background: var(--vp-c-brand);
  color: #fff; box-shadow: 0 1px 0 var(--vp-c-brand-dark);
}

.vp-key-black {
  position: absolute; top: 0; width: 5.2%; height: 62%;
  background: #1f2328; color: #e6edf3; z-index: 2;
  border: 1px solid #000; box-shadow: 0 2px 0 #000;
}
.vp-key-black.active { background: var(--vp-c-brand-dark); box-shadow: 0 1px 0 var(--vp-c-brand-darker); }

.vp-piano-hint {
  margin-top: 10px; padding: 10px 14px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 12px; color: var(--vp-c-text-2); line-height: 1.7;
}
.vp-piano-hint code {
  background: var(--vp-c-bg-mute); padding: 2px 6px; border-radius: 4px;
  font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1);
}

:root.dark .vp-piano-body { background: #30363d; }
:root.dark .vp-key-white { background: #21262d; color: #8b949e; border-color: #444c56; box-shadow: 0 3px 0 #444c56; }
:root.dark .vp-key-black { background: #010409; border-color: #222; }
:root.dark .vp-key-white.active { background: var(--vp-c-brand); color: #fff; }
:root.dark .vp-key-black.active { background: var(--vp-c-brand-dark); }

@media (max-width: 768px) {
  .vp-key { font-size: 8px; padding-bottom: 6px; }
  .vp-piano-row { height: 100px; }
  .vp-piano-info { flex-direction: column; gap: 6px; }
  .vp-input { font-size: 14px; padding: 10px; }
}
</style>
