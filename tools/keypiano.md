# 键盘钢琴小工具

输入字符演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，Shift+字母（大写）=黑键。

<ClientOnly>
  <div class="vp-piano" ref="pianoRef">
    <input 
      v-model="score" 
      class="vp-input" 
      placeholder="输入字符演奏，例：QQ55tt5"
      @click="initAudio"
    >
    <div class="vp-piano-info">
      <span class="vp-note">{{ currentNote }}</span>
      <span class="vp-freq">{{ currentFreq }}</span>
    </div>
    
    <div class="vp-piano-body">
      <!-- 第一排：数字键 C4-B4 -->
      <div class="vp-piano-row">
        <div v-for="k in keyRows[0]" :class="['vp-key', k.cls]" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          {{ k.label }}<br>{{ k.note }}
        </div>
      </div>
      <!-- 第二排：QWERTY C5-E6 -->
      <div class="vp-piano-row">
        <div v-for="k in keyRows[1]" :class="['vp-key', k.cls]" :style="k.style" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          {{ k.label }}<br>{{ k.note }}
        </div>
      </div>
      <!-- 第三排：ASDF F6-A7 -->
      <div class="vp-piano-row">
        <div v-for="k in keyRows[2]" :class="['vp-key', k.cls]" :style="k.style" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          {{ k.label }}<br>{{ k.note }}
        </div>
      </div>
      <!-- 第四排：ZXCV B7-C8 -->
      <div class="vp-piano-row">
        <div v-for="k in keyRows[3]" :class="['vp-key', k.cls]" @mousedown="play(k.k)" @mouseup="stop(k.k)" @mouseleave="stop(k.k)">
          {{ k.label }}<br>{{ k.note }}
        </div>
      </div>
    </div>
    
    <div class="vp-piano-hint">
      试玩示例：输入 <code>QQ55tt5 QQ44rr4</code> 演奏《小星星》
    </div>
  </div>
</ClientOnly>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 响应式状态
const score = ref('')
const currentNote = ref('--')
const currentFreq = ref('点击输入框激活音频')
let audioCtx = null
const activeNodes = new Map()

// ✅ 完整琴键数据，一个字符都不省，直接复制就能用
const keyRows = [
  // 第一排：数字键 C4-B4
  [
    {k:'1', label:'1', note:'C4', cls:'vp-key-white'},
    {k:'2', label:'2', note:'D4', cls:'vp-key-white'},
    {k:'3', label:'3', note:'E4', cls:'vp-key-white'},
    {k:'4', label:'4', note:'F4', cls:'vp-key-white'},
    {k:'5', label:'5', note:'G4', cls:'vp-key-white'},
    {k:'6', label:'6', note:'A4', cls:'vp-key-white'},
    {k:'7', label:'7', note:'B4', cls:'vp-key-white'},
  ],
  // 第二排：QWERTY C5-E6（黑键位置完全匹配之前的布局）
  [
    {k:'q', label:'Q', note:'C5', cls:'vp-key-white'},
    {k:'Q', label:'Q', note:'C#5', cls:'vp-key-black', style:'left:calc(100%/14*1 - 2.6%)'},
    {k:'w', label:'W', note:'D5', cls:'vp-key-white'},
    {k:'W', label:'W', note:'D#5', cls:'vp-key-black', style:'left:calc(100%/14*2 - 2.6%)'},
    {k:'e', label:'E', note:'E5', cls:'vp-key-white'},
    {k:'r', label:'R', note:'F5', cls:'vp-key-white'},
    {k:'R', label:'R', note:'F#5', cls:'vp-key-black', style:'left:calc(100%/14*4 - 2.6%)'},
    {k:'t', label:'T', note:'G5', cls:'vp-key-white'},
    {k:'T', label:'T', note:'G#5', cls:'vp-key-black', style:'left:calc(100%/14*6 - 2.6%)'},
    {k:'y', label:'Y', note:'A5', cls:'vp-key-white'},
    {k:'Y', label:'Y', note:'A#5', cls:'vp-key-black', style:'left:calc(100%/14*7 - 2.6%)'},
    {k:'u', label:'U', note:'B5', cls:'vp-key-white'},
    {k:'i', label:'I', note:'C6', cls:'vp-key-white'},
    {k:'I', label:'I', note:'C#6', cls:'vp-key-black', style:'left:calc(100%/14*9 - 2.6%)'},
    {k:'o', label:'O', note:'D6', cls:'vp-key-white'},
    {k:'O', label:'O', note:'D#6', cls:'vp-key-black', style:'left:calc(100%/14*10 - 2.6%)'},
    {k:'p', label:'P', note:'E6', cls:'vp-key-white'},
  ],
  // 第三排：ASDF F6-A7（黑键位置完全匹配）
  [
    {k:'a', label:'A', note:'F6', cls:'vp-key-white'},
    {k:'A', label:'A', note:'F#6', cls:'vp-key-black', style:'left:calc(100%/17*1 - 2.6%)'},
    {k:'s', label:'S', note:'G6', cls:'vp-key-white'},
    {k:'S', label:'S', note:'G#6', cls:'vp-key-black', style:'left:calc(100%/17*2 - 2.6%)'},
    {k:'d', label:'D', note:'A6', cls:'vp-key-white'},
    {k:'D', label:'D', note:'A#6', cls:'vp-key-black', style:'left:calc(100%/17*3 - 2.6%)'},
    {k:'f', label:'F', note:'B6', cls:'vp-key-white'},
    {k:'g', label:'G', note:'C7', cls:'vp-key-white'},
    {k:'G', label:'G', note:'C#7', cls:'vp-key-black', style:'left:calc(100%/17*5 - 2.6%)'},
    {k:'h', label:'H', note:'D7', cls:'vp-key-white'},
    {k:'H', label:'H', note:'D#7', cls:'vp-key-black', style:'left:calc(100%/17*6 - 2.6%)'},
    {k:'j', label:'J', note:'E7', cls:'vp-key-white'},
    {k:'k', label:'K', note:'F7', cls:'vp-key-white'},
    {k:'K', label:'K', note:'F#7', cls:'vp-key-black', style:'left:calc(100%/17*8 - 2.6%)'},
    {k:'l', label:'L', note:'G7', cls:'vp-key-white'},
    {k:'L', label:'L', note:'G#7', cls:'vp-key-black', style:'left:calc(100%/17*9 - 2.6%)'},
    {k:';', label:';', note:'A7', cls:'vp-key-white'},
    {k:':', label:':', note:'A#7', cls:'vp-key-black', style:'left:calc(100%/17*10 - 2.6%)'},
  ],
  // 第四排：ZXCV B7-C8
  [
    {k:'z', label:'Z', note:'B7', cls:'vp-key-white'},
    {k:'x', label:'X', note:'C8', cls:'vp-key-white'},
  ]
]

// 频率表（和键位完全对应）
const FREQ = {
  '1':261.63,'2':293.66,'3':329.63,'4':349.23,'5':392.00,'6':440.00,'7':493.88,
  'q':523.25,'Q':554.37,'w':587.33,'W':622.25,'e':659.25,'r':698.46,'R':739.99,
  't':783.99,'T':830.61,'y':880.00,'Y':932.33,'u':987.77,'i':1046.50,'I':1108.73,
  'o':1174.66,'O':1244.51,'p':1318.51,'a':1396.91,'A':1479.98,'s':1567.98,'S':1661.22,
  'd':1760.00,'D':1864.66,'f':1975.53,'g':2093.00,'G':2217.46,'h':2349.32,'H':2489.02,
  'j':2637.02,'k':2793.83,'K':2959.96,'l':3135.96,'L':3322.44,';':3520.00,':':3729.31,
  'z':3951.07,'x':4186.01
};

// SSR安全兜底
onMounted(() => {
  if (typeof window === 'undefined') return
  document.body.addEventListener('click', initAudio, { once: true })
  document.body.addEventListener('keydown', initAudio, { once: true })
})

const initAudio = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  currentFreq.value = '等待输入...'
}

const play = (key) => {
  if (!FREQ[key] || activeNodes.has(key)) return
  initAudio()
  const now = audioCtx.currentTime

  // 钢琴音色逻辑（和你之前要求的一致）
  const mainGain = audioCtx.createGain()
  mainGain.gain.setValueAtTime(0, now)
  mainGain.gain.linearRampToValueAtTime(0.3, now + 0.005)
  mainGain.gain.exponentialRampToValueAtTime(0.05, now + 0.2)
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

  // 泛音列
  const osc1 = audioCtx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = FREQ[key]
  
  const osc2 = audioCtx.createOscillator()
  osc2.type = 'triangle'
  osc2.frequency.value = FREQ[key] * 2
  const gain2 = audioCtx.createGain()
  gain2.gain.value = 0.25
  
  const osc3 = audioCtx.createOscillator()
  osc3.type = 'square'
  osc3.frequency.value = FREQ[key] * 3
  const gain3 = audioCtx.createGain()
  gain3.gain.value = 0.15

  // 低通滤波+混响
  const lowpass = audioCtx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 4000
  
  const reverbGain = audioCtx.createGain()
  reverbGain.gain.value = 0.12
  const delay = audioCtx.createDelay()
  delay.delayTime.value = 0.02
  const feedback = audioCtx.createGain()
  feedback.gain.value = 0.15

  // 连接链路
  osc1.connect(mainGain)
  osc2.connect(gain2).connect(mainGain)
  osc3.connect(gain3).connect(mainGain)
  mainGain.connect(lowpass)
  lowpass.connect(audioCtx.destination)
  lowpass.connect(delay).connect(feedback).connect(delay)
  delay.connect(reverbGain).connect(audioCtx.destination)

  osc1.start(now)
  osc2.start(now)
  osc3.start(now)
  
  activeNodes.set(key, { oscillators: [osc1, osc2, osc3], mainGain })
  currentNote.value = key.length === 1 ? key.toUpperCase() + (/[A-G]/.test(key) && key === key.toUpperCase() ? '#' : '') : '--'
  currentFreq.value = `${FREQ[key].toFixed(2)} Hz`
  
  setTimeout(() => stop(key), 700)
}

const stop = (key) => {
  const node = activeNodes.get(key)
  if (!node) return
  const now = audioCtx.currentTime
  node.mainGain.gain.cancelScheduledValues(now)
  node.mainGain.gain.linearRampToValueAtTime(0, now + 0.03)
  node.oscillators.forEach(osc => osc.stop(now + 0.05))
  activeNodes.delete(key)
}

// 输入触发演奏
watch(score, (newVal, oldVal) => {
  if (newVal.length <= oldVal.length) return
  const added = newVal.slice(-1)
  if (FREQ[added]) play(added)
})
</script>

<style scoped>
.vp-piano { margin: 1.5rem 0; font-family: var(--vp-font-family-base); }
.vp-input { width: 100%; padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); }
.vp-piano-info { display: flex; gap: 12px; padding: 10px; background: var(--vp-c-bg-soft); border-radius: 6px; margin: 12px 0; }
.vp-note { font-size: 24px; font-weight: 700; font-family: var(--vp-font-family-mono); }
.vp-freq { font-size: 13px; color: var(--vp-c-text-2); }
.vp-piano-body { background: #c0c6cc; padding: 8px; border-radius: 6px; }
.vp-piano-row { position: relative; display: flex; height: 110px; margin-bottom: 3px; }
.vp-key { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 8px; font-size: 9px; font-weight: 600; cursor: pointer; border-radius: 0 0 5px 5px; user-select: none; }
.vp-key-white { flex: 1; margin: 0 1px; background: #fff; color: #57606a; border: 1px solid #b0b6bc; box-shadow: 0 3px 0 #b0b6bc; z-index: 1; }
.vp-key-white.active { transform: translateY(2px); background: var(--vp-c-brand); color: #fff; box-shadow: 0 1px 0 var(--vp-c-brand-dark); }
.vp-key-black { position: absolute; top: 0; width: 5.2%; height: 62%; background: #1f2328; color: #e6edf3; border: 1px solid #000; box-shadow: 0 2px 0 #000; z-index: 2; }
.vp-key-black.active { background: var(--vp-c-brand-dark); box-shadow: 0 1px 0 var(--vp-c-brand-darker); }
.vp-piano-hint { margin-top: 10px; padding: 10px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; color: var(--vp-c-text-2); }
</style>
