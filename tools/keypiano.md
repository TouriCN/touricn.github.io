# 键盘钢琴小工具

输入字符演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，Shift+字母（大写）=黑键。

<!-- Vue模板直接写MD里，v-for自动生成琴键，再也不会有标签闭合报错 -->
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
    
    <!-- 琴键用v-for遍历，改键位直接改数组，比写几十个div爽10倍 -->
    <div class="vp-piano-body">
      <div v-for="row in keyRows" class="vp-piano-row">
        <div 
          v-for="k in row"
          :class="['vp-key', k.cls]"
          :style="k.style"
          @mousedown="play(k.k)"
          @mouseup="stop(k.k)"
          @mouseleave="stop(k.k)"
        >
          {{ k.label }}<br>{{ k.note }}
        </div>
      </div>
    </div>
    
    <div class="vp-piano-hint">
      试玩示例：输入 <code>QQ55tt5 QQ44rr4</code> 演奏《小星星》
    </div>
  </div>
</ClientOnly>

<!-- Vue逻辑全塞这里，不用拆文件，所有代码一个MD里搞定 -->
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态，改值自动更新页面，不用自己操作DOM
const score = ref('')
const currentNote = ref('--')
const currentFreq = ref('点击输入框激活音频')
let audioCtx = null
const activeNodes = new Map()

// 琴键数据，改键位、调黑键位置直接改这里，比原生HTML好维护100倍
const keyRows = [
  // 数字排C4-B4
  [
    {k:'1', label:'1', note:'C4', cls:'vp-key-white'},
    {k:'2', label:'2', note:'D4', cls:'vp-key-white'},
    {k:'3', label:'3', note:'E4', cls:'vp-key-white'},
    {k:'4', label:'4', note:'F4', cls:'vp-key-white'},
    {k:'5', label:'5', note:'G4', cls:'vp-key-white'},
    {k:'6', label:'6', note:'A4', cls:'vp-key-white'},
    {k:'7', label:'7', note:'B4', cls:'vp-key-white'},
  ],
  // QWERTY排C5-E6（含黑键，style直接写在这里）
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
  // 剩下的排你直接补就行，逻辑完全一样
]

// 所有浏览器操作全放onMounted里，SSR阶段绝对不执行，不会报document错误
onMounted(() => {
  // 兜底判断，双保险
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
  // 之前的发声逻辑照搬，用ref更新状态就行，不用操作DOM
  const FREQ = { /* 你的频率表 */ }
  if (!FREQ[key] || activeNodes.has(key)) return
  initAudio()
  // ... 之前的发声逻辑，最后更新状态：
  currentNote.value = key.toUpperCase()
  currentFreq.value = `${FREQ[key]} Hz`
}

const stop = (key) => { /* 之前的停止逻辑 */ }

// 监听输入，自动触发演奏
watch(score, (newVal, oldVal) => {
  if (newVal.length <= oldVal.length) return
  const added = newVal.slice(-1)
  if (FREQ[added]) play(added)
})
</script>

<style scoped>
/* 样式直接写这里，scoped自动隔离，不用额外文件 */
.vp-piano { margin: 1.5rem 0; }
.vp-input { width: 100%; padding: 10px; border-radius: 6px; }
/* 剩下的样式和你之前的完全一致，不用改 */
</style>
