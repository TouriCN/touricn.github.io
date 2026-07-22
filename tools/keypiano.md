# 键盘钢琴小工具

输入字符演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，Shift+字母（大写）=黑键。

<!-- 双保险：ClientOnly保证SSR不碰这段，v-pre保证Vue不解析复杂HTML，彻底避免渲染问题 -->
<ClientOnly>
  <div class="vp-piano" v-pre>
    <input 
      id="piano-input"
      class="vp-input" 
      placeholder="输入字符演奏，例：QQ55tt5"
    >
    <div class="vp-piano-info">
      <span id="piano-current-note" class="vp-note">--</span>
      <span id="piano-current-freq" class="vp-freq">点击输入框激活音频</span>
    </div>
    
    <!-- 第一排：数字键 C4-B4 -->
    <div class="vp-piano-row">
      <div class="vp-key vp-key-white" data-k="1"><span>1<br>C4</span></div>
      <div class="vp-key vp-key-white" data-k="2"><span>2<br>D4</span></div>
      <div class="vp-key vp-key-white" data-k="3"><span>3<br>E4</span></div>
      <div class="vp-key vp-key-white" data-k="4"><span>4<br>F4</span></div>
      <div class="vp-key vp-key-white" data-k="5"><span>5<br>G4</span></div>
      <div class="vp-key vp-key-white" data-k="6"><span>6<br>A4</span></div>
      <div class="vp-key vp-key-white" data-k="7"><span>7<br>B4</span></div>
    </div>
    
    <!-- 第二排：QWERTY C5-E6 -->
    <div class="vp-piano-row">
      <div class="vp-key vp-key-white" data-k="q"><span>Q<br>C5</span></div>
      <div class="vp-key vp-key-black" data-k="Q" style="left:calc(100%/14*1 - 2.6%)"><span>Q<br>C#5</span></div>
      <div class="vp-key vp-key-white" data-k="w"><span>W<br>D5</span></div>
      <div class="vp-key vp-key-black" data-k="W" style="left:calc(100%/14*2 - 2.6%)"><span>W<br>D#5</span></div>
      <div class="vp-key vp-key-white" data-k="e"><span>E<br>E5</span></div>
      <div class="vp-key vp-key-white" data-k="r"><span>R<br>F5</span></div>
      <div class="vp-key vp-key-black" data-k="R" style="left:calc(100%/14*4 - 2.6%)"><span>R<br>F#5</span></div>
      <div class="vp-key vp-key-white" data-k="t"><span>T<br>G5</span></div>
      <div class="vp-key vp-key-black" data-k="T" style="left:calc(100%/14*6 - 2.6%)"><span>T<br>G#5</span></div>
      <div class="vp-key vp-key-white" data-k="y"><span>Y<br>A5</span></div>
      <div class="vp-key vp-key-black" data-k="Y" style="left:calc(100%/14*7 - 2.6%)"><span>Y<br>A#5</span></div>
      <div class="vp-key vp-key-white" data-k="u"><span>U<br>B5</span></div>
      <div class="vp-key vp-key-white" data-k="i"><span>I<br>C6</span></div>
      <div class="vp-key vp-key-black" data-k="I" style="left:calc(100%/14*9 - 2.6%)"><span>I<br>C#6</span></div>
      <div class="vp-key vp-key-white" data-k="o"><span>O<br>D6</span></div>
      <div class="vp-key vp-key-black" data-k="O" style="left:calc(100%/14*10 - 2.6%)"><span>O<br>D#6</span></div>
      <div class="vp-key vp-key-white" data-k="p"><span>P<br>E6</span></div>
    </div>
    
    <!-- 第三排：ASDF F6-A7 -->
    <div class="vp-piano-row">
      <div class="vp-key vp-key-white" data-k="a"><span>A<br>F6</span></div>
      <div class="vp-key vp-key-black" data-k="A" style="left:calc(100%/17*1 - 2.6%)"><span>A<br>F#6</span></div>
      <div class="vp-key vp-key-white" data-k="s"><span>S<br>G6</span></div>
      <div class="vp-key vp-key-black" data-k="S" style="left:calc(100%/17*2 - 2.6%)"><span>S<br>G#6</span></div>
      <div class="vp-key vp-key-white" data-k="d"><span>D<br>A6</span></div>
      <div class="vp-key vp-key-black" data-k="D" style="left:calc(100%/17*3 - 2.6%)"><span>D<br>A#6</span></div>
      <div class="vp-key vp-key-white" data-k="f"><span>F<br>B6</span></div>
      <div class="vp-key vp-key-white" data-k="g"><span>G<br>C7</span></div>
      <div class="vp-key vp-key-black" data-k="G" style="left:calc(100%/17*5 - 2.6%)"><span>G<br>C#7</span></div>
      <div class="vp-key vp-key-white" data-k="h"><span>H<br>D7</span></div>
      <div class="vp-key vp-key-black" data-k="H" style="left:calc(100%/17*6 - 2.6%)"><span>H<br>D#7</span></div>
      <div class="vp-key vp-key-white" data-k="j"><span>J<br>E7</span></div>
      <div class="vp-key vp-key-white" data-k="k"><span>K<br>F7</span></div>
      <div class="vp-key vp-key-black" data-k="K" style="left:calc(100%/17*8 - 2.6%)"><span>K<br>F#7</span></div>
      <div class="vp-key vp-key-white" data-k="l"><span>L<br>G7</span></div>
      <div class="vp-key vp-key-black" data-k="L" style="left:calc(100%/17*9 - 2.6%)"><span>L<br>G#7</span></div>
      <div class="vp-key vp-key-white" data-k=";"><span>;<br>A7</span></div>
      <div class="vp-key vp-key-black" data-k=":" style="left:calc(100%/17*10 - 2.6%)"><span>:<br>A#7</span></div>
    </div>
    
    <!-- 第四排：ZXCV B7-C8 -->
    <div class="vp-piano-row">
      <div class="vp-key vp-key-white" data-k="z"><span>Z<br>B7</span></div>
      <div class="vp-key vp-key-white" data-k="x"><span>X<br>C8</span></div>
    </div>
    
    <div class="vp-piano-hint">
      试玩示例：输入 <code>QQ55tt5 QQ44rr4</code> 演奏《小星星》
    </div>
  </div>
</ClientOnly>

<!-- 单文件唯一script块，所有逻辑都在这里 -->
<script setup>
import { onMounted } from 'vue'

// 频率表是纯常量，服务端执行完全没问题，不涉及任何浏览器API
const FREQ = {
  '1':261.63,'2':293.66,'3':329.63,'4':349.23,'5':392.00,'6':440.00,'7':493.88,
  'q':523.25,'Q':554.37,'w':587.33,'W':622.25,'e':659.25,'r':698.46,'R':739.99,
  't':783.99,'T':830.61,'y':880.00,'Y':932.33,'u':987.77,'i':1046.50,'I':1108.73,
  'o':1174.66,'O':1244.51,'p':1318.51,'a':1396.91,'A':1479.98,'s':1567.98,'S':1661.22,
  'd':1760.00,'D':1864.66,'f':1975.53,'g':2093.00,'G':2217.46,'h':2349.32,'H':2489.02,
  'j':2637.02,'k':2793.83,'K':2959.96,'l':3135.96,'L':3322.44,';':3520.00,':':3729.31,
  'z':3951.07,'x':4186.01
};

// onMounted的回调只会在客户端执行，服务端绝对不会碰里面的代码，完美规避所有SSR报错
onMounted(() => {
  // 所有浏览器API操作都锁死在这个回调里，100%安全
  const input = document.getElementById('piano-input');
  const currentNoteEl = document.getElementById('piano-current-note');
  const currentFreqEl = document.getElementById('piano-current-freq');
  const keys = document.querySelectorAll('.vp-key[data-k]');

  let audioCtx = null;
  const activeNodes = {};
  let isComposing = false;

  const initAudio = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    currentFreqEl.textContent = '等待输入...';
  };

  const play = (keyChar) => {
    if (!FREQ[keyChar] || activeNodes[keyChar]) return;
    initAudio();
    const now = audioCtx.currentTime;

    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
    mainGain.gain.exponentialRampToValueAtTime(0.05, now + 0.2);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    const oscFundamental = audioCtx.createOscillator();
    oscFundamental.type = 'sine';
    oscFundamental.frequency.value = FREQ[keyChar];

    const oscHarmonic2 = audioCtx.createOscillator();
    oscHarmonic2.type = 'triangle';
    oscHarmonic2.frequency.value = FREQ[keyChar] * 2;
    const gainHarmonic2 = audioCtx.createGain();
    gainHarmonic2.gain.value = 0.25;

    const oscHarmonic3 = audioCtx.createOscillator();
    oscHarmonic3.type = 'square';
    oscHarmonic3.frequency.value = FREQ[keyChar] * 3;
    const gainHarmonic3 = audioCtx.createGain();
    gainHarmonic3.gain.value = 0.15;

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 4000;
    lowpass.Q.value = 1;

    const reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.12;
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.02;
    const feedback = audioCtx.createGain();
    feedback.gain.value = 0.15;

    oscFundamental.connect(mainGain);
    oscHarmonic2.connect(gainHarmonic2).connect(mainGain);
    oscHarmonic3.connect(gainHarmonic3).connect(mainGain);
    mainGain.connect(lowpass);
    lowpass.connect(audioCtx.destination);
    lowpass.connect(delay).connect(feedback).connect(delay);
    delay.connect(reverbGain).connect(audioCtx.destination);

    oscFundamental.start(now);
    oscHarmonic2.start(now);
    oscHarmonic3.start(now);

    activeNodes[keyChar] = { oscillators: [oscFundamental, oscHarmonic2, oscHarmonic3], mainGain };
    currentNoteEl.textContent = keyChar.length === 1 ? keyChar.toUpperCase() + (/[A-G]/.test(keyChar) && keyChar === keyChar.toUpperCase() ? '#' : '') : '--';
    currentFreqEl.textContent = `${FREQ[keyChar].toFixed(2)} Hz`;
    document.querySelector(`.vp-key[data-k="${keyChar}"]`)?.classList.add('active');

    setTimeout(() => stop(keyChar), 700);
  };

  const stop = (keyChar) => {
    const nodes = activeNodes[keyChar];
    if (!nodes) return;
    const now = audioCtx.currentTime;
    nodes.mainGain.gain.cancelScheduledValues(now);
    nodes.mainGain.gain.setValueAtTime(nodes.mainGain.gain.value, now);
    nodes.mainGain.gain.linearRampToValueAtTime(0, now + 0.03);
    nodes.oscillators.forEach(osc => osc.stop(now + 0.05));
    delete activeNodes[keyChar];
    document.querySelector(`.vp-key[data-k="${keyChar}"]`)?.classList.remove('active');
  };

  const stopAll = () => Object.keys(activeNodes).forEach(keyChar => stop(keyChar));

  // 事件绑定全在onMounted里，服务端不会执行
  input.addEventListener('click', initAudio);
  input.addEventListener('input', (e) => {
    if (isComposing) return;
    const addedChars = e.target.value.slice(-1);
    if (FREQ[addedChars]) play(addedChars);
  });
  input.addEventListener('compositionstart', () => { isComposing = true; });
  input.addEventListener('compositionend', () => { isComposing = false; });

  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (FREQ[e.key]) { e.preventDefault(); play(e.key); }
  });
  document.addEventListener('keyup', (e) => { if (FREQ[e.key]) stop(e.key); });

  keys.forEach(keyEl => {
    keyEl.addEventListener('mousedown', () => play(keyEl.dataset.k));
    keyEl.addEventListener('mouseup', () => stop(keyEl.dataset.k));
    keyEl.addEventListener('mouseleave', () => stop(keyEl.dataset.k));
  });

  window.addEventListener('blur', stopAll);
  document.body.addEventListener('click', initAudio, { once: true });
  document.body.addEventListener('keydown', initAudio, { once: true });
});
</script>

<style scoped>
.vp-piano { margin: 1.5rem 0; font-family: var(--vp-font-family-base); }
.vp-input { width: 100%; padding: 10px 14px; font-size: 15px; font-family: var(--vp-font-family-mono); border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.vp-input:focus { border-color: var(--vp-c-brand); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.vp-piano-info { display: flex; align-items: baseline; gap: 12px; padding: 10px 14px; background: var(--vp-c-bg-soft); border-radius: 6px; box-shadow: var(--vp-shadow-1); margin-bottom: 14px; }
.vp-note { font-size: 24px; font-weight: 700; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.vp-freq { font-size: 13px; color: var(--vp-c-text-2); }
.vp-piano-body { background: #c0c6cc; padding: 8px; border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), var(--vp-shadow-2); }
.vp-piano-row { position: relative; display: flex; height: 110px; margin-bottom: 3px; }
.vp-piano-row:last-child { margin-bottom: 0; }
.vp-key { display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; font-size: 9px; font-weight: 600; cursor: pointer; transition: transform 0.05s, box-shadow 0.05s, background 0.05s; border-radius: 0 0 5px 5px; user-select: none; }
.vp-key span { pointer-events: none; line-height: 1.3; }
.vp-key-white { flex: 1; margin: 0 1px; background: #fff; color: #57606a; border: 1px solid #b0b6bc; box-shadow: 0 3px 0 #b0b6bc; z-index: 1; }
.vp-key-white.active { transform: translateY(2px); background: var(--vp-c-brand); color: #fff; box-shadow: 0 1px 0 var(--vp-c-brand-dark); }
.vp-key-black { position: absolute; top: 0; width: 5.2%; height: 62%; background: #1f2328; color: #e6edf3; z-index: 2; border: 1px solid #000; box-shadow: 0 2px 0 #000; }
.vp-key-black.active { background: var(--vp-c-brand-dark); box-shadow: 0 1px 0 var(--vp-c-brand-darker); }
.vp-piano-hint { margin-top: 10px; padding: 10px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 12px; color: var(--vp-c-text-2); line-height: 1.7; }
.vp-piano-hint code { background: var(--vp-c-bg-mute); padding: 2px 6px; border-radius: 4px; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1); }
:root.dark .vp-piano-body { background: #30363d; }
:root.dark .vp-key-white { background: #21262d; color: #8b949e; border-color: #444c56; box-shadow: 0 3px 0 #444c56; }
:root.dark .vp-key-black { background: #010409; border-color: #222; }
:root.dark .vp-key-white.active { background: var(--vp-c-brand); color: #fff; }
:root.dark .vp-key-black.active { background: var(--vp-c-brand-dark); }
@media (max-width: 768px) { .vp-key { font-size: 8px; padding-bottom: 6px; } .vp-piano-row { height: 100px; } .vp-piano-info { flex-direction: column; gap: 6px; } .vp-input { font-size: 14px; padding: 10px; } }
</style>
