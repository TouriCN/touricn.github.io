# 🎹 在线乐谱钢琴

输入字符自动演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，`Shift+字母`（大写）=黑键。

<ClientOnly>
  <div class="vp-piano">
    <!-- 乐谱输入框 -->
    <div class="vp-piano-input">
      <input
        v-model="score"
        type="text"
        class="vp-input"
        placeholder="输入乐谱自动演奏，例：QQ55tt5（《小星星》）"
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
        <div v-for="key in whiteKeys.slice(0,7)" :key="key.key" class="vp-key vp-key-white" :data-key="key.key" @mousedown="play(key.key)" @mouseup="stop(key.key)" @mouseleave="stop(key.key)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
      <!-- QWERTY排 C5-E6 -->
      <div class="vp-piano-row">
        <div v-for="key in qwertyKeys" :key="key.key" class="vp-key" :class="key.class" :style="key.style" @mousedown="play(key.key)" @mouseup="stop(key.key)" @mouseleave="stop(key.key)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
      <!-- ASDF排 F6-A7 -->
      <div class="vp-piano-row">
        <div v-for="key in asdfKeys" :key="key.key" class="vp-key" :class="key.class" :style="key.style" @mousedown="play(key.key)" @mouseup="stop(key.key)" @mouseleave="stop(key.key)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
      <!-- ZXCV排 B7-C8 -->
      <div class="vp-piano-row">
        <div v-for="key in whiteKeys.slice(29,31)" :key="key.key" class="vp-key vp-key-white" :data-key="key.key" @mousedown="play(key.key)" @mouseup="stop(key.key)" @mouseleave="stop(key.key)">
          <span>{{ key.label }}<br>{{ key.note }}</span>
        </div>
      </div>
    </div>

    <!-- 使用提示 -->
    <div class="vp-piano-hint">
      💡 <strong>使用说明</strong>：点击输入框激活音频 → 输入字符立即演奏 → 乐谱可复制粘贴传播<br>
      试玩示例：输入 <code>QQ55tt5 QQ44rr4</code> 演奏完整版《小星星》
    </div>
  </div>
</ClientOnly>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// ===== 频率表（A4=440Hz，和键盘布局一一对应）=====
const FREQ = {
  '1':261.63,'2':293.66,'3':329.63,'4':349.23,'5':392.00,'6':440.00,'7':493.88,
  'q':523.25,'Q':554.37,'w':587.33,'W':622.25,'e':659.25,'r':698.46,'R':739.99,
  't':783.99,'T':830.61,'y':880.00,'Y':932.33,'u':987.77,'i':1046.50,'I':1108.73,
  'o':1174.66,'O':1244.51,'p':1318.51,'a':1396.91,'A':1479.98,'s':1567.98,'S':1661.22,
  'd':1760.00,'D':1864.66,'f':1975.53,'g':2093.00,'G':2217.46,'h':2349.32,'H':2489.02,
  'j':2637.02,'k':2793.83,'K':2959.96,'l':3135.96,'L':3322.44,';':3520.00,':':3729.31,
  'z':3951.07,'x':4186.01
}

// ===== 键盘布局数据（黑键精确定位，和真实钢琴缝隙对齐）=====
const whiteKeys = [
  {key:'1',label:'1',note:'C4'},{key:'2',label:'2',note:'D4'},{key:'3',label:'3',note:'E4'},
  {key:'4',label:'4',note:'F4'},{key:'5',label:'5',note:'G4'},{key:'6',label:'6',note:'A4'},
  {key:'7',label:'7',note:'B4'},{key:'q',label:'Q',note:'C5'},{key:'w',label:'W',note:'D5'},
  {key:'e',label:'E',note:'E5'},{key:'r',label:'R',note:'F5'},{key:'t',label:'T',note:'G5'},
  {key:'y',label:'Y',note:'A5'},{key:'u',label:'U',note:'B5'},{key:'i',label:'I',note:'C6'},
  {key:'o',label:'O',note:'D6'},{key:'p',label:'P',note:'E6'},{key:'a',label:'A',note:'F6'},
  {key:'s',label:'S',note:'G6'},{key:'d',label:'D',note:'A6'},{key:'f',label:'F',note:'B6'},
  {key:'g',label:'G',note:'C7'},{key:'h',label:'H',note:'D7'},{key:'j',label:'J',note:'E7'},
  {key:'k',label:'K',note:'F7'},{key:'l',label:'L',note:'G7'},{key:';',label:';',note:'A7'},
  {key:'z',label:'Z',note:'B7'},{key:'x',label:'X',note:'C8'}
]
const qwertyKeys = [
  {key:'q',label:'Q',note:'C5',class:'vp-key-white'},
  {key:'Q',label:'Q',note:'C#5',class:'vp-key-black',style:'left:calc(100%/14*1 - 2.6%)'},
  {key:'w',label:'W',note:'D5',class:'vp-key-white'},
  {key:'W',label:'W',note:'D#5',class:'vp-key-black',style:'left:calc(100%/14*2 - 2.6%)'},
  {key:'e',label:'E',note:'E5',class:'vp-key-white'},
  {key:'r',label:'R',note:'F5',class:'vp-key-white'},
  {key:'R',label:'R',note:'F#5',class:'vp-key-black',style:'left:calc(100%/14*4 - 2.6%)'},
  {key:'t',label:'T',note:'G5',class:'vp-key-white'},
  {key:'T',label:'T',note:'G#5',class:'vp-key-black',style:'left:calc(100%/14*6 - 2.6%)'},
  {key:'y',label:'Y',note:'A5',class:'vp-key-white'},
  {key:'Y',label:'Y',note:'A#5',class:'vp-key-black',style:'left:calc(100%/14*7 - 2.6%)'},
  {key:'u',label:'U',note:'B5',class:'vp-key-white'},
  {key:'i',label:'I',note:'C6',class:'vp-key-white'},
  {key:'I',label:'I',note:'C#6',class:'vp-key-black',style:'left:calc(100%/14*9 - 2.6%)'},
  {key:'o',label:'O',note:'D6',class:'vp-key-white'},
  {key:'O',label:'O',note:'D#6',class:'vp-key-black',style:'left:calc(100%/14*10 - 2.6%)'},
  {key:'p',label:'P',note:'E6',class:'vp-key-white'}
]
const asdfKeys = [
  {key:'a',label:'A',note:'F6',class:'vp-key-white'},
  {key:'A',label:'A',note:'F#6',class:'vp-key-black',style:'left:calc(100%/17*1 - 2.6%)'},
  {key:'s',label:'S',note:'G6',class:'vp-key-white'},
  {key:'S',label:'S',note:'G#6',class:'vp-key-black',style:'left:calc(100%/17*2 - 2.6%)'},
  {key:'d',label:'D',note:'A6',class:'vp-key-white'},
  {key:'D',label:'D',note:'A#6',class:'vp-key-black',style:'left:calc(100%/17*3 - 2.6%)'},
  {key:'f',label:'F',note:'B6',class:'vp-key-white'},
  {key:'g',label:'G',note:'C7',class:'vp-key-white'},
  {key:'G',label:'G',note:'C#7',class:'vp-key-black',style:'left:calc(100%/17*5 - 2.6%)'},
  {key:'h',label:'H',note:'D7',class:'vp-key-white'},
  {key:'H',label:'H',note:'D#7',class:'vp-key-black',style:'left:calc(100%/17*6 - 2.6%)'},
  {key:'j',label:'J',note:'E7',class:'vp-key-white'},
  {key:'k',label:'K',note:'F7',class:'vp-key-white'},
  {key:'K',label:'K',note:'F#7',class:'vp-key-black',style:'left:calc(100%/17*8 - 2.6%)'},
  {key:'l',label:'L',note:'G7',class:'vp-key-white'},
  {key:'L',label:'L',note:'G#7',class:'vp-key-black',style:'left:calc(100%/17*9 - 2.6%)'},
  {key:';',label:';',note:'A7',class:'vp-key-white'},
  {key:':',label:':',note:'A#7',class:'vp-key-black',style:'left:calc(100%/17*10 - 2.6%)'}
]

// ===== 响应式状态 =====
const score = ref('')
const currentNote = ref('--')
const currentFreq = ref('点击输入框激活音频')
const lastScore = ref('')
let audioCtx = null
let isComposing = false
const activeNodes = new Map()

// ===== 初始化音频（解决浏览器自动播放限制）=====
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  currentFreq.value = '等待输入...'
}

// ===== 拟真钢琴音色核心（无电子感）=====
const play = (key) => {
  if (!FREQ[key] || activeNodes.has(key)) return
  initAudio()
  const now = audioCtx.currentTime

  // 1. 主增益（ADSR钢琴包络：快起音+快速衰减+自然释音）
  const mainGain = audioCtx.createGain()
  mainGain.gain.setValueAtTime(0, now)
  mainGain.gain.linearRampToValueAtTime(0.3, now + 0.005) // 琴槌敲击起音
  mainGain.gain.exponentialRampToValueAtTime(0.05, now + 0.2) // 快速衰减
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7) // 自然释音

  // 2. 泛音列模拟（基频+2次谐波+3次谐波，符合钢琴物理特性）
  const oscillators = []
  // 基频（正弦波，占比60%）
  const oscFundamental = audioCtx.createOscillator()
  oscFundamental.type = 'sine'
  oscFundamental.frequency.value = FREQ[key]
  oscillators.push(oscFundamental)

  // 2次谐波（2倍频，占比25%，三角波增加厚度）
  const oscHarmonic2 = audioCtx.createOscillator()
  oscHarmonic2.type = 'triangle'
  oscHarmonic2.frequency.value = FREQ[key] * 2
  const gainHarmonic2 = audioCtx.createGain()
  gainHarmonic2.gain.value = 0.25
  oscillators.push({osc:oscHarmonic2, gain:gainHarmonic2})

  // 3次谐波（3倍频，占比15%，方波增加亮度）
  const oscHarmonic3 = audioCtx.createOscillator()
  oscHarmonic3.type = 'square'
  oscHarmonic3.frequency.value = FREQ[key] * 3
  const gainHarmonic3 = audioCtx.createGain()
  gainHarmonic3.gain.value = 0.15
  oscillators.push({osc:oscHarmonic3, gain:gainHarmonic3})

  // 3. 低通滤波（滚降4kHz以上高频，消除电子感）
  const lowpass = audioCtx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 4000
  lowpass.Q.value = 1

  // 4. 轻度混响（模拟琴房声学环境）
  const reverbGain = audioCtx.createGain()
  reverbGain.gain.value = 0.12
  const delay = audioCtx.createDelay()
  delay.delayTime.value = 0.02
  const feedback = audioCtx.createGain()
  feedback.gain.value = 0.15

  // 5. 连接链路
  oscFundamental.connect(mainGain)
  oscHarmonic2.connect(gainHarmonic2).connect(mainGain)
  oscHarmonic3.connect(gainHarmonic3).connect(mainGain)
  mainGain.connect(lowpass)
  lowpass.connect(audioCtx.destination)
  lowpass.connect(delay).connect(feedback).connect(delay)
  delay.connect(reverbGain).connect(audioCtx.destination)

  // 启动振荡器
  oscFundamental.start(now)
  oscHarmonic2.start(now)
  oscHarmonic3.start(now)

  activeNodes.set(key, { oscillators: [oscFundamental, oscHarmonic2, oscHarmonic3], mainGain })
  
  // UI更新
  currentNote.value = key.length === 1 ? key.toUpperCase() + (/[A-G]/.test(key) && key === key.toUpperCase() ? '#' : '') : '--'
  currentFreq.value = `${FREQ[key].toFixed(2)} Hz`
  document.querySelector(`.vp-key[data-key="${key}"]`)?.classList.add('active')

  setTimeout(() => stop(key), 700)
}

// ===== 停止播放 =====
const stop = (key) => {
  const nodes = activeNodes.get(key)
  if (!nodes) return
  const now = audioCtx.currentTime
  
  nodes.mainGain.gain.cancelScheduledValues(now)
  nodes.mainGain.gain.setValueAtTime(nodes.mainGain.gain.value, now)
  nodes.mainGain.gain.linearRampToValueAtTime(0, now + 0.03)
  
  nodes.oscillators.forEach(osc => {
    if (osc.stop) osc.stop(now + 0.05)
    else { osc.osc.stop(now + 0.05) }
  })
  
  activeNodes.delete(key)
  document.querySelector(`.vp-key[data-key="${key}"]`)?.classList.remove('active')
}

// ===== 监听输入框变化（输入即演奏）=====
watch(score, (newVal, oldVal) => {
  if (isComposing || newVal.length <= oldVal.length) return
  const addedChars = newVal.slice(oldVal.length)
  for (const char of addedChars) {
    if (FREQ[char]) play(char)
  }
  lastScore.value = newVal
})

// ===== 事件绑定 =====
onMounted(() => {
  document.body.addEventListener('keydown', initAudio, { once: true })
  
  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
    if (FREQ[e.key]) {
      e.preventDefault()
      play(e.key)
    }
  })
  document.addEventListener('keyup', (e) => {
    if (FREQ[e.key]) stop(e.key)
  })

  document.querySelector('.vp-input')?.addEventListener('compositionstart', () => {
    isComposing = true
  })
  document.querySelector('.vp-input')?.addEventListener('compositionend', () => {
    isComposing = false
  })

  window.addEventListener('blur', () => {
    activeNodes.forEach((_, key) => stop(key))
  })
})

onUnmounted(() => {
  activeNodes.forEach((_, key) => stop(key))
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
})
</script>

<style scoped>
/* 跟随VitePress主题变量，自动适配亮/暗色模式 */
.vp-piano { margin: 1.5rem 0; font-family: var(--vp-font-family-base); }

/* 输入框 */
.vp-piano-input { margin-bottom: 12px; }
.vp-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.vp-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}
.vp-input::placeholder { color: var(--vp-c-text-3); font-size: 13px; }

/* 播放信息 */
.vp-piano-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  box-shadow: var(--vp-shadow-1);
  margin-bottom: 14px;
}
.vp-note {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}
.vp-freq { font-size: 13px; color: var(--vp-c-text-2); }

/* 钢琴主体 */
.vp-piano-body {
  background: #c0c6cc;
  padding: 8px;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), var(--vp-shadow-2);
}
.vp-piano-row {
  position: relative;
  display: flex;
  height: 110px;
  margin-bottom: 3px;
}
.vp-piano-row:last-child { margin-bottom: 0; }

/* 琴键通用样式 */
.vp-key {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.05s, box-shadow 0.05s, background 0.05s;
  border-radius: 0 0 5px 5px;
  user-select: none;
}
.vp-key span { pointer-events: none; line-height: 1.3; }

/* 白键 */
.vp-key-white {
  flex: 1;
  margin: 0 1px;
  background: #fff;
  color: #57606a;
  border: 1px solid #b0b6bc;
  box-shadow: 0 3px 0 #b0b6bc;
  z-index: 1;
}
.vp-key-white.active {
  transform: translateY(2px);
  background: var(--vp-c-brand);
  color: #fff;
  box-shadow: 0 1px 0 var(--vp-c-brand-dark);
}

/* 黑键 */
.vp-key-black {
  position: absolute;
  top: 0;
  width: 5.2%;
  height: 62%;
  background: #1f2328;
  color: #e6edf3;
  z-index: 2;
  border: 1px solid #000;
  box-shadow: 0 2px 0 #000;
}
.vp-key-black.active {
  background: var(--vp-c-brand-dark);
  box-shadow: 0 1px 0 var(--vp-c-brand-darker);
}

/* 提示区 */
.vp-piano-hint {
  margin-top: 10px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
.vp-piano-hint code {
  background: var(--vp-c-bg-mute);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

/* 暗色模式适配 */
:root.dark .vp-piano-body { background: #30363d; }
:root.dark .vp-key-white {
  background: #21262d;
  color: #8b949e;
  border-color: #444c56;
  box-shadow: 0 3px 0 #444c56;
}
:root.dark .vp-key-black { background: #010409; border-color: #222; }
:root.dark .vp-key-white.active { background: var(--vp-c-brand); color: #fff; }
:root.dark .vp-key-black.active { background: var(--vp-c-brand-dark); }

/* 移动端适配 */
@media (max-width: 768px) {
  .vp-key { font-size: 8px; padding-bottom: 6px; }
  .vp-piano-row { height: 100px; }
  .vp-piano-info { flex-direction: column; gap: 6px; }
  .vp-input { font-size: 14px; padding: 10px; }
}
</style>
