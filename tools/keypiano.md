# 键盘钢琴小工具

输入字符演奏，乐谱可复制粘贴传播。规则：小写字母/数字=白键，Shift+字母（大写）=黑键。

试玩示例：输入 `QQ55tt5 QQ44rr4` 演奏《小星星》

<ClientOnly>
  <div class="piano-shell">
    <div class="piano-input-wrap">
      <input type="text" class="piano-input" id="pnInput" placeholder="输入字符演奏，例：QQ55tt5" autocomplete="off" spellcheck="false">
    </div>
    <div class="piano-info">
      <span class="piano-note" id="pnNote">--</span>
      <span class="piano-freq" id="pnFreq">点击输入框激活音频</span>
    </div>
    <div class="piano-body">
      <div class="piano-row" id="pnRow1">
        <div class="pk pk-w" data-k="k1"><span>1<br>C4</span></div>
        <div class="pk pk-w" data-k="k2"><span>2<br>D4</span></div>
        <div class="pk pk-w" data-k="k3"><span>3<br>E4</span></div>
        <div class="pk pk-w" data-k="k4"><span>4<br>F4</span></div>
        <div class="pk pk-w" data-k="k5"><span>5<br>G4</span></div>
        <div class="pk pk-w" data-k="k6"><span>6<br>A4</span></div>
        <div class="pk pk-w" data-k="k7"><span>7<br>B4</span></div>
      </div>
      <div class="piano-row" id="pnRow2">
        <div class="pk pk-w" data-k="kq"><span>q<br>C5</span></div>
        <div class="pk pk-b" data-k="kQ"><span>Q<br>C#5</span></div>
        <div class="pk pk-w" data-k="kw"><span>w<br>D5</span></div>
        <div class="pk pk-b" data-k="kW"><span>W<br>D#5</span></div>
        <div class="pk pk-w" data-k="ke"><span>e<br>E5</span></div>
        <div class="pk pk-w" data-k="kr"><span>r<br>F5</span></div>
        <div class="pk pk-b" data-k="kR"><span>R<br>F#5</span></div>
        <div class="pk pk-w" data-k="kt"><span>t<br>G5</span></div>
        <div class="pk pk-b" data-k="kT"><span>T<br>G#5</span></div>
        <div class="pk pk-w" data-k="ky"><span>y<br>A5</span></div>
        <div class="pk pk-b" data-k="kY"><span>Y<br>A#5</span></div>
        <div class="pk pk-w" data-k="ku"><span>u<br>B5</span></div>
        <div class="pk pk-w" data-k="ki"><span>i<br>C6</span></div>
        <div class="pk pk-b" data-k="kI"><span>I<br>C#6</span></div>
        <div class="pk pk-w" data-k="ko"><span>o<br>D6</span></div>
        <div class="pk pk-b" data-k="kO"><span>O<br>D#6</span></div>
        <div class="pk pk-w" data-k="kp"><span>p<br>E6</span></div>
      </div>
      <div class="piano-row" id="pnRow3">
        <div class="pk pk-w" data-k="ka"><span>a<br>F6</span></div>
        <div class="pk pk-b" data-k="kA"><span>A<br>F#6</span></div>
        <div class="pk pk-w" data-k="ks"><span>s<br>G6</span></div>
        <div class="pk pk-b" data-k="kS"><span>S<br>G#6</span></div>
        <div class="pk pk-w" data-k="kd"><span>d<br>A6</span></div>
        <div class="pk pk-b" data-k="kD"><span>D<br>A#6</span></div>
        <div class="pk pk-w" data-k="kf"><span>f<br>B6</span></div>
        <div class="pk pk-w" data-k="kg"><span>g<br>C7</span></div>
        <div class="pk pk-b" data-k="kG"><span>G<br>C#7</span></div>
        <div class="pk pk-w" data-k="kh"><span>h<br>D7</span></div>
        <div class="pk pk-b" data-k="kH"><span>H<br>D#7</span></div>
        <div class="pk pk-w" data-k="kj"><span>j<br>E7</span></div>
        <div class="pk pk-w" data-k="kk"><span>k<br>F7</span></div>
        <div class="pk pk-b" data-k="kK"><span>K<br>F#7</span></div>
        <div class="pk pk-w" data-k="kl"><span>l<br>G7</span></div>
        <div class="pk pk-b" data-k="kL"><span>L<br>G#7</span></div>
        <div class="pk pk-w" data-k="ksemicolon"><span>;<br>A7</span></div>
        <div class="pk pk-b" data-k="kcolon"><span>:<br>A#7</span></div>
      </div>
      <div class="piano-row" id="pnRow4">
        <div class="pk pk-w" data-k="kz"><span>z<br>B7</span></div>
        <div class="pk pk-w" data-k="kx"><span>x<br>C8</span></div>
      </div>
    </div>
    <div class="piano-hint">
      💡 点击输入框激活音频 → 输入字符触发对应琴音 → 乐谱可直接复制分享
    </div>
  </div>
</ClientOnly>

<script>
(function() {
  // ========== 频率表 ==========
  var FREQ = {
    '1':261.63,'2':293.66,'3':329.63,'4':349.23,'5':392.00,'6':440.00,'7':493.88,
    'q':523.25,'Q':554.37,'w':587.33,'W':622.25,'e':659.25,'r':698.46,'R':739.99,
    't':783.99,'T':830.61,'y':880.00,'Y':932.33,'u':987.77,'i':1046.50,'I':1108.73,
    'o':1174.66,'O':1244.51,'p':1318.51,'a':1396.91,'A':1479.98,'s':1567.98,'S':1661.22,
    'd':1760.00,'D':1864.66,'f':1975.53,'g':2093.00,'G':2217.46,'h':2349.32,'H':2489.02,
    'j':2637.02,'k':2793.83,'K':2959.96,'l':3135.96,'L':3322.44,
    'z':3951.07,'x':4186.01
  };

  // data-k -> 字符 映射
  var DK_TO_CHAR = {
    'k1':'1','k2':'2','k3':'3','k4':'4','k5':'5','k6':'6','k7':'7',
    'kq':'q','kQ':'Q','kw':'w','kW':'W','ke':'e','kr':'r','kR':'R',
    'kt':'t','kT':'T','ky':'y','kY':'Y','ku':'u','ki':'i','kI':'I',
    'ko':'o','kO':'O','kp':'p','ka':'a','kA':'A','ks':'s','kS':'S',
    'kd':'d','kD':'D','kf':'f','kg':'g','kG':'G','kh':'h','kH':'H',
    'kj':'j','kk':'k','kK':'K','kl':'l','kL':'L',
    'kz':'z','kx':'x'
  };

  var audioCtx = null;
  var activeNodes = {};
  var lastVal = '';
  var composing = false;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var el = document.getElementById('pnFreq');
    if (el) el.textContent = '等待输入...';
  }

  function play(char) {
    if (!FREQ[char] || activeNodes[char]) return;
    initAudio();
    var now = audioCtx.currentTime;

    // ADSR包络
    var mg = audioCtx.createGain();
    mg.gain.setValueAtTime(0, now);
    mg.gain.linearRampToValueAtTime(0.3, now + 0.005);
    mg.gain.exponentialRampToValueAtTime(0.05, now + 0.2);
    mg.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // 基频 正弦波
    var o1 = audioCtx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = FREQ[char];

    // 2次谐波 三角波
    var o2 = audioCtx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = FREQ[char] * 2;
    var g2 = audioCtx.createGain();
    g2.gain.value = 0.25;

    // 3次谐波 方波
    var o3 = audioCtx.createOscillator();
    o3.type = 'square';
    o3.frequency.value = FREQ[char] * 3;
    var g3 = audioCtx.createGain();
    g3.gain.value = 0.15;

    // 低通滤波
    var lp = audioCtx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;
    lp.Q.value = 1;

    // 混响
    var rg = audioCtx.createGain();
    rg.gain.value = 0.12;
    var dly = audioCtx.createDelay();
    dly.delayTime.value = 0.02;
    var fb = audioCtx.createGain();
    fb.gain.value = 0.15;

    // 连接
    o1.connect(mg);
    o2.connect(g2).connect(mg);
    o3.connect(g3).connect(mg);
    mg.connect(lp);
    lp.connect(audioCtx.destination);
    lp.connect(dly).connect(fb).connect(dly);
    dly.connect(rg).connect(audioCtx.destination);

    o1.start(now);
    o2.start(now);
    o3.start(now);

    activeNodes[char] = { oscs: [o1,o2,o3], gain: mg };

    // UI更新
    var noteStr = char.toUpperCase();
    if (/[A-G]/.test(char) && char === char.toUpperCase() && char !== char.toLowerCase()) {
      noteStr += '#';
    }
    var noteEl = document.getElementById('pnNote');
    var freqEl = document.getElementById('pnFreq');
    if (noteEl) noteEl.textContent = noteStr;
    if (freqEl) freqEl.textContent = FREQ[char].toFixed(2) + ' Hz';

    // 高亮琴键
    for (var dk in DK_TO_CHAR) {
      if (DK_TO_CHAR[dk] === char) {
        var el = document.querySelector('.pk[data-k="' + dk + '"]');
        if (el) el.classList.add('active');
        break;
      }
    }

    setTimeout(function() { stop(char); }, 700);
  }

  function stop(char) {
    var n = activeNodes[char];
    if (!n) return;
    var now = audioCtx.currentTime;
    n.gain.gain.cancelScheduledValues(now);
    n.gain.gain.setValueAtTime(n.gain.gain.value, now);
    n.gain.gain.linearRampToValueAtTime(0, now + 0.03);
    n.oscs.forEach(function(o) { o.stop(now + 0.05); });
    delete activeNodes[char];
    for (var dk in DK_TO_CHAR) {
      if (DK_TO_CHAR[dk] === char) {
        var el = document.querySelector('.pk[data-k="' + dk + '"]');
        if (el) el.classList.remove('active');
        break;
      }
    }
  }

  function stopAll() {
    Object.keys(activeNodes).forEach(function(k) { stop(k); });
  }

  // ========== DOMContentLoaded后绑定事件 ==========
  function bindEvents() {
    var input = document.getElementById('pnInput');
    if (!input) return; // 元素不存在就跳过

    // 输入监听
    input.addEventListener('input', function(e) {
      if (composing) return;
      var v = input.value;
      if (v.length <= lastVal.length) { lastVal = v; return; }
      var added = v.substring(lastVal.length);
      for (var i = 0; i < added.length; i++) {
        var c = added[i];
        if (FREQ[c]) play(c);
      }
      lastVal = v;
    });

    input.addEventListener('compositionstart', function() { composing = true; });
    input.addEventListener('compositionend', function() { composing = false; });
    input.addEventListener('click', initAudio);

    // 物理键盘
    document.addEventListener('keydown', function(e) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (FREQ[e.key]) { e.preventDefault(); play(e.key); }
    });
    document.addEventListener('keyup', function(e) {
      if (FREQ[e.key]) stop(e.key);
    });

    // 鼠标点击琴键
    document.querySelectorAll('.pk').forEach(function(el) {
      var dk = el.getAttribute('data-k');
      var char = DK_TO_CHAR[dk];
      if (!char) return;
      el.addEventListener('mousedown', function() { play(char); });
      el.addEventListener('mouseup', function() { stop(char); });
      el.addEventListener('mouseleave', function() { stop(char); });
    });

    // 失焦停止
    window.addEventListener('blur', stopAll);
  }

  // 页面卸载清理
  window.addEventListener('beforeunload', function() {
    stopAll();
    if (audioCtx) audioCtx.close();
  });

  // 绑定事件
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }
})();
</script>

<style>
/* 跟随VitePress主题 */
.piano-shell { margin: 1.5rem 0; font-family: var(--vp-font-family-base); }

.piano-input-wrap { margin-bottom: 12px; }
.piano-input {
  width: 100%; padding: 10px 14px; font-size: 15px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider); border-radius: 6px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.piano-input:focus { border-color: var(--vp-c-brand); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.piano-input::placeholder { color: var(--vp-c-text-3); font-size: 13px; }

.piano-info {
  display: flex; align-items: baseline; gap: 12px;
  padding: 10px 14px; background: var(--vp-c-bg-soft);
  border-radius: 6px; box-shadow: var(--vp-shadow-1); margin-bottom: 14px;
}
.piano-note { font-size: 24px; font-weight: 700; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.piano-freq { font-size: 13px; color: var(--vp-c-text-2); }

.piano-body {
  background: #c0c6cc; padding: 8px; border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), var(--vp-shadow-2);
}
.piano-row { position: relative; display: flex; height: 110px; margin-bottom: 3px; }
.piano-row:last-child { margin-bottom: 0; }

.pk {
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 8px; font-size: 9px; font-weight: 600;
  cursor: pointer; border-radius: 0 0 5px 5px; user-select: none;
  transition: transform 0.05s, box-shadow 0.05s, background 0.05s;
}
.pk span { pointer-events: none; line-height: 1.3; }

.pk-w {
  flex: 1; margin: 0 1px; background: #fff; color: #57606a;
  border: 1px solid #b0b6bc; box-shadow: 0 3px 0 #b0b6bc; z-index: 1;
}
.pk-w.active { transform: translateY(2px); background: var(--vp-c-brand); color: #fff; box-shadow: 0 1px 0 var(--vp-c-brand-dark); }

.pk-b {
  position: absolute; top: 0; width: 5.2%; height: 62%;
  background: #1f2328; color: #e6edf3; z-index: 2;
  border: 1px solid #000; box-shadow: 0 2px 0 #000;
}
.pk-b.active { background: var(--vp-c-brand-dark); box-shadow: 0 1px 0 var(--vp-c-brand-darker); }

/* 黑键定位 - 第2排 */
#pnRow2 .pk-b[data-k="kQ"] { left: calc(100%/14*1 - 2.6%); }
#pnRow2 .pk-b[data-k="kW"] { left: calc(100%/14*2 - 2.6%); }
#pnRow2 .pk-b[data-k="kR"] { left: calc(100%/14*4 - 2.6%); }
#pnRow2 .pk-b[data-k="kT"] { left: calc(100%/14*6 - 2.6%); }
#pnRow2 .pk-b[data-k="kY"] { left: calc(100%/14*7 - 2.6%); }
#pnRow2 .pk-b[data-k="kI"] { left: calc(100%/14*9 - 2.6%); }
#pnRow2 .pk-b[data-k="kO"] { left: calc(100%/14*10 - 2.6%); }
/* 黑键定位 - 第3排 */
#pnRow3 .pk-b[data-k="kA"] { left: calc(100%/17*1 - 2.6%); }
#pnRow3 .pk-b[data-k="kS"] { left: calc(100%/17*2 - 2.6%); }
#pnRow3 .pk-b[data-k="kD"] { left: calc(100%/17*3 - 2.6%); }
#pnRow3 .pk-b[data-k="kG"] { left: calc(100%/17*5 - 2.6%); }
#pnRow3 .pk-b[data-k="kH"] { left: calc(100%/17*6 - 2.6%); }
#pnRow3 .pk-b[data-k="kK"] { left: calc(100%/17*8 - 2.6%); }
#pnRow3 .pk-b[data-k="kL"] { left: calc(100%/17*9 - 2.6%); }
#pnRow3 .pk-b[data-k="kcolon"] { left: calc(100%/17*10 - 2.6%); }

.piano-hint {
  margin-top: 10px; padding: 10px 14px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 12px; color: var(--vp-c-text-2); line-height: 1.7;
}

/* 暗色模式 */
:root.dark .piano-body { background: #30363d; }
:root.dark .pk-w { background: #21262d; color: #8b949e; border-color: #444c56; box-shadow: 0 3px 0 #444c56; }
:root.dark .pk-b { background: #010409; border-color: #222; }
:root.dark .pk-w.active { background: var(--vp-c-brand); color: #fff; }
:root.dark .pk-b.active { background: var(--vp-c-brand-dark); }

/* 移动端 */
@media (max-width: 768px) {
  .pk { font-size: 8px; padding-bottom: 6px; }
  .piano-row { height: 100px; }
  .piano-info { flex-direction: column; gap: 6px; }
  .piano-input { font-size: 14px; padding: 10px; }
}
</style>
