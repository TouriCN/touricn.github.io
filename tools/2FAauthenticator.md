# 2FA验证码密钥工具

<div class="vp2fa-root">
  <div id="vp2faList"></div>

  <div class="vp2fa-form">
    <div class="vp2fa-input-grid">
      <input id="vp2faLabel" class="vp2fa-input" placeholder="账号名（如：GitHub）">
      <input id="vp2faSecret" class="vp2fa-input" placeholder="密钥 / otpauth://链接 / 扫码导入">
    </div>
    <div class="vp2fa-add-row">
      <button id="vp2faAddBtn" class="vp2fa-add-btn">+ 添加账号</button>
      <button id="vp2faScanBtn" class="vp2fa-scan-btn">📷 扫描二维码</button>
    </div>
    <div class="vp2fa-tools">
      <button id="vp2faExportBtn" class="vp2fa-tool-btn">📤 导出配置</button>
      <button id="vp2faImportBtn" class="vp2fa-tool-btn">📥 导入配置</button>
      <button id="vp2faClearBtn" class="vp2fa-tool-btn danger">🗑️ 清空全部</button>
    </div>
  </div>
</div>

<!-- 二维码扫描弹窗 -->
<div id="vp2faScanModal" class="vp2fa-scan-modal" style="display:none;">
  <div class="vp2fa-scan-modal-content">
    <div class="vp2fa-scan-header">
      <span>扫描2FA二维码</span>
      <button id="vp2faScanClose" class="vp2fa-scan-close">✕</button>
    </div>
    <input type="file" id="vp2faImageInput" accept="image/*" style="display:none;">
    <div id="vp2faScanRegion" class="vp2fa-scan-region">
      <div class="vp2fa-scan-placeholder">
        <div class="vp2fa-scan-icon">📷</div>
        <p>正在启动摄像头...</p>
        <p class="vp2fa-scan-hint">请将二维码对准摄像头，或点「选择图片」从相册导入</p>
      </div>
    </div>
    <div id="vp2faFileScanRegion" style="display:none;"></div>
    <div id="vp2faScanResult" class="vp2fa-scan-result" style="display:none;"></div>
    <div class="vp2fa-scan-footer">
      <button id="vp2faScanStop" class="vp2fa-tool-btn danger">停止扫描</button>
      <button id="vp2faPickImage" class="vp2fa-tool-btn">🖼️ 选择图片</button>
      <button id="vp2faScanConfirm" class="vp2fa-tool-btn" style="display:none;">确认添加</button>
    </div>
  </div>
</div>

## 该工具有什么用处？
仅使用网页端，方便快捷使用；支持Base32/Hex/纯数字等多种密钥格式，自动识别无需转换。<br>
支持摄像头实时扫描、从相册读取二维码、直接粘贴otpauth://标准链接三种方式添加账号，粘贴链接时会自动识别为「平台 - 账户名」。<br>
临时测试时随便输入字母即可生成模拟验证码，刷新页面后因不符合密钥规范自动失效，非常适合体验功能。

## 注意
请尽量避免页面内容被他人看到，不要在不安全的设备上使用，否则你的账户可能会被盗取。(该网页仅提供2FA验证码输出，不会使用你的账户密钥做任何其他的事情。)

<style>
.vp2fa-root { margin: 1.5rem 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.vp2fa-card { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; margin-bottom: 10px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 12px; transition: border-color 0.2s; }
.vp2fa-card:hover { border-color: #58a6ff; }
.vp2fa-card.test-mode { border-color: #d29922; background: #fff8e6; }
.vp2fa-card.error { border-color: #f85149; background: #fff0f0; }
.vp2fa-label { display: block; font-size: 13px; color: #57606a; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vp2fa-code { display: block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 24px; font-weight: 600; letter-spacing: 2px; color: #1f2328; }
.vp2fa-format-tag { font-size: 11px; color: #8b949e; background: #f0f2f5; padding: 1px 6px; border-radius: 4px; margin-left: 8px; }
.vp2fa-test-tag { font-size: 11px; color: #d29922; background: #fff3cd; padding: 1px 6px; border-radius: 4px; margin-left: 8px; }
.vp2fa-error-text { color: #f85149; font-size: 12px; margin-top: 4px; }
.vp2fa-test-hint { font-size: 11px; color: #8b949e; margin-top: 2px; }
.vp2fa-actions { display: flex; gap: 8px; margin-left: 16px; }
.vp2fa-timer { position: relative; width: 40px; height: 40px; }
.vp2fa-timer svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.vp2fa-timer .bg { fill: none; stroke: #d0d7de; stroke-width: 3; }
.vp2fa-timer .progress { fill: none; stroke: #58a6ff; stroke-width: 3; stroke-linecap: round; transition: stroke-dashoffset 0.5s linear; }
.vp2fa-timer.warn .progress { stroke: #d29922; }
.vp2fa-timer.expired .progress { stroke: #f85149; }
.vp2fa-timer-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600; color: #1f2328; }
.vp2fa-btn { padding: 6px; border: none; background: transparent; color: #57606a; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
.vp2fa-btn:hover { color: #58a6ff; background: rgba(88, 166, 255, 0.1); }
.vp2fa-btn.delete:hover { color: #f85149; background: rgba(248, 81, 73, 0.1); }
.vp2fa-form { margin-top: 20px; padding-top: 20px; border-top: 1px dashed #d0d7de; }
.vp2fa-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.vp2fa-input { width: 100%; padding: 10px 12px; font-size: 14px; border: 1px solid #d0d7de; border-radius: 6px; background: #fff; color: #1f2328; box-sizing: border-box; }
.vp2fa-input:focus { outline: none; border-color: #58a6ff; box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2); }

.vp2fa-add-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 12px; }
.vp2fa-add-btn { width: 100%; padding: 10px; font-size: 14px; font-weight: 500; border: 1px dashed #d0d7de; border-radius: 6px; background: transparent; color: #57606a; cursor: pointer; transition: all 0.2s; }
.vp2fa-add-btn:hover { border-color: #58a6ff; color: #58a6ff; }
.vp2fa-scan-btn { padding: 10px 16px; font-size: 14px; font-weight: 500; border: 1px solid #d0d7de; border-radius: 6px; background: #f6f8fa; color: #1f2328; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.vp2fa-scan-btn:hover { border-color: #58a6ff; color: #58a6ff; background: rgba(88, 166, 255, 0.05); }

.vp2fa-tools { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.vp2fa-tool-btn { padding: 6px 12px; font-size: 12px; border-radius: 6px; border: 1px solid #d0d7de; background: #f6f8fa; color: #57606a; cursor: pointer; transition: all 0.2s; }
.vp2fa-tool-btn:hover { border-color: #58a6ff; color: #58a6ff; }
.vp2fa-tool-btn.danger:hover { border-color: #f85149; color: #f85149; }

.vp2fa-empty { color: #8b949e; font-size: 14px; padding: 32px 0; text-align: center; border-radius: 12px; background: #f6f8fa; border: 1px dashed #d0d7de; }

.vp2fa-scan-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; }
.vp2fa-scan-modal-content { background: #fff; border-radius: 12px; overflow: hidden; width: 90%; max-width: 480px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.vp2fa-scan-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f6f8fa; border-bottom: 1px solid #d0d7de; font-weight: 600; font-size: 15px; color: #1f2328; }
.vp2fa-scan-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #57606a; padding: 4px 8px; border-radius: 4px; }
.vp2fa-scan-close:hover { background: #eaeef2; }
.vp2fa-scan-region { position: relative; width: 100%; aspect-ratio: 1; background: #000; display: flex; align-items: center; justify-content: center; }
.vp2fa-scan-placeholder { text-align: center; color: #fff; }
.vp2fa-scan-placeholder p { margin: 8px 0; font-size: 14px; }
.vp2fa-scan-icon { font-size: 48px; margin-bottom: 12px; }
.vp2fa-scan-hint { font-size: 12px; color: #aaa; }
.vp2fa-scan-result { padding: 12px 16px; background: #e6fffa; border-top: 1px solid #80d4c8; font-size: 13px; color: #1a7a6c; word-break: break-all; }
.vp2fa-scan-footer { display: flex; gap: 8px; padding: 12px 16px; justify-content: flex-end; border-top: 1px solid #d0d7de; flex-wrap: wrap; }
.vp2fa-scan-region video { width: 100%; height: 100%; object-fit: cover; }
.vp2fa-scan-region .scan-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70%; height: 70%; border: 2px solid #58a6ff; border-radius: 12px; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); }

@media (prefers-color-scheme: dark) {
  .vp2fa-card { background: #161b22; border-color: #30363d; }
  .vp2fa-card.test-mode { background: #261f0e; border-color: #d29922; }
  .vp2fa-card.error { background: #2d161b; border-color: #f85149; }
  .vp2fa-label { color: #8b949e; }
  .vp2fa-code { color: #e6edf3; }
  .vp2fa-format-tag { background: #21262d; color: #8b949e; }
  .vp2fa-test-tag { background: #332701; color: #d29922; }
  .vp2fa-timer .bg { stroke: #30363d; }
  .vp2fa-timer-text { color: #e6edf3; }
  .vp2fa-btn { color: #8b949e; }
  .vp2fa-form { border-color: #30363d; }
  .vp2fa-input { background: #0d1117; border-color: #30363d; color: #e6edf3; }
  .vp2fa-add-btn { border-color: #30363d; color: #8b949e; }
  .vp2fa-add-btn:hover { border-color: #58a6ff; color: #58a6ff; }
  .vp2fa-scan-btn { background: #161b22; border-color: #30363d; color: #e6edf3; }
  .vp2fa-scan-btn:hover { border-color: #58a6ff; color: #58a6ff; }
  .vp2fa-tool-btn { background: #161b22; border-color: #30363d; color: #8b949e; }
  .vp2fa-tool-btn:hover { border-color: #58a6ff; color: #58a6ff; }
  .vp2fa-empty { color: #6e7681; background: #161b22; border-color: #30363d; }
  .vp2fa-scan-modal-content { background: #161b22; }
  .vp2fa-scan-header { background: #0d1117; border-color: #30363d; color: #e6edf3; }
  .vp2fa-scan-result { background: #0d2b27; border-color: #1a7a6c; color: #56d4c4; }
  .vp2fa-scan-footer { border-color: #30363d; }
  .vp2fa-scan-close:hover { background: #21262d; }
}
@media (max-width: 640px) {
  .vp2fa-input-grid { grid-template-columns: 1fr; }
  .vp2fa-add-row { grid-template-columns: 1fr; }
  .vp2fa-code { font-size: 20px; }
  .vp2fa-actions { gap: 4px; margin-left: 8px; }
  .vp2fa-scan-footer { justify-content: center; }
}
</style>

<script setup>
import { onMounted, nextTick } from 'vue'

const STORAGE_KEY = 'vp2fa_accounts'
const PERIOD = 30
const CIRCLE_RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS
const MIN_SECRET_BYTES = 10

const decodeSecret = (str) => {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  if (!cleaned) return null

  const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let isBase32 = true
  for (const c of cleaned) {
    if (!base32Alphabet.includes(c)) { isBase32 = false; break }
  }
  if (isBase32 && cleaned.length >= 16) {
    let bits = ''
    for (const c of cleaned) bits += base32Alphabet.indexOf(c).toString(2).padStart(5, '0')
    if (bits.length >= 80) {
      const bytes = []
      for (let i = 0; i < bits.length - 7; i += 8) bytes.push(parseInt(bits.substr(i, 8), 2))
      return { key: new Uint8Array(bytes), format: 'Base32', isTestMode: false }
    }
  }

  if (/^[0-9A-F]+$/i.test(cleaned)) {
    const hexStr = cleaned.length % 2 === 0 ? cleaned : cleaned + '0'
    const bytes = []
    for (let i = 0; i < hexStr.length; i += 2) bytes.push(parseInt(hexStr.substr(i, 2), 16))
    if (bytes.length >= MIN_SECRET_BYTES) return { key: new Uint8Array(bytes), format: 'Hex', isTestMode: false }
  }

  if (/^\d+$/.test(cleaned)) {
    const num = BigInt(cleaned)
    const bytes = []
    let temp = num
    while (temp > 0n) { bytes.unshift(Number(temp % 256n)); temp = temp / 256n }
    while (bytes.length < MIN_SECRET_BYTES) bytes.unshift(0)
    if (bytes.length >= MIN_SECRET_BYTES) return { key: new Uint8Array(bytes), format: '数字', isTestMode: false }
  }

  let bits = ''
  for (const c of cleaned) bits += c.charCodeAt(0).toString(2).padStart(8, '0')
  while (bits.length < 80) bits += '0'.repeat(8)
  const bytes = []
  for (let i = 0; i < 80; i += 8) bytes.push(parseInt(bits.substr(i, 8), 2))
  return { key: new Uint8Array(bytes), format: '测试', isTestMode: true }
}

const createHmacSigner = async (key) => {
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  return (data) => crypto.subtle.sign('HMAC', cryptoKey, data)
}

const generateTotp = async (secret) => {
  const decoded = decodeSecret(secret)
  if (!decoded || decoded.key.length < MIN_SECRET_BYTES) throw new Error('密钥长度不足')
  const sign = await createHmacSigner(decoded.key)
  const counter = Math.floor(Date.now() / 1000 / PERIOD)
  const buffer = new ArrayBuffer(8)
  new DataView(buffer).setUint32(4, counter, false)
  const hs = new Uint8Array(await sign(buffer))
  const offset = hs[hs.length - 1] & 0x0F
  const code = (((hs[offset] & 0x7F) << 24) | ((hs[offset+1] & 0xFF) << 16) | ((hs[offset+2] & 0xFF) << 8) | (hs[offset+3] & 0xFF)) % 1000000
  return { code: code.toString().padStart(6, '0'), format: decoded.format, isTestMode: decoded.isTestMode }
}

const parseOtpAuth = (uri) => {
  try {
    const url = new URL(uri.trim())
    if (url.protocol !== 'otpauth:') return null
    const params = new URLSearchParams(url.search)
    const secret = params.get('secret')
    if (!secret) return null
    
    const labelRaw = decodeURIComponent(url.pathname.split('/')[1] || '')
    let issuerFromLabel = '', account = labelRaw
    if (labelRaw.includes(':')) {
      const idx = labelRaw.indexOf(':')
      issuerFromLabel = labelRaw.substring(0, idx)
      account = labelRaw.substring(idx + 1)
    }
    
    const issuerParam = params.get('issuer') || issuerFromLabel
    const friendlyName = issuerParam 
      ? (account ? `${issuerParam} - ${account}` : issuerParam)
      : (account || '未命名账号')
    
    return { label: friendlyName, secret: secret }
  } catch { return null }
}

const isValidPersistentSecret = (secret) => {
  const decoded = decodeSecret(secret)
  return decoded && !decoded.isTestMode
}

let renderErrorCache = new Set()

const renderList = async () => {
  const list = document.getElementById('vp2faList')
  if (!list) return
  const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const remaining = PERIOD - Math.floor(Date.now() / 1000) % PERIOD
  const offset = CIRCUMFERENCE * (remaining / PERIOD)

  if (accounts.length === 0) {
    list.innerHTML = `<div class="vp2fa-empty">暂无账号，点击下方按钮添加你的第一个2FA验证码</div>`
    renderErrorCache.clear()
    return
  }

  const cardPromises = accounts.map(async (acc) => {
    if (renderErrorCache.has(acc.id)) {
      return `<div class="vp2fa-card error"><div class="vp2fa-info"><span class="vp2fa-label">${acc.label}（密钥无效）</span><span class="vp2fa-code">------</span><div class="vp2fa-error-text">密钥不符合规范，请删除后重新添加</div></div><div class="vp2fa-actions"><button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button></div></div>`
    }
    try {
      const { code, format, isTestMode } = await generateTotp(acc.secret)
      return `
        <div class="vp2fa-card ${isTestMode ? 'test-mode' : ''}">
          <div class="vp2fa-info">
            <div style="display:flex;align-items:center;">
              <span class="vp2fa-label">${acc.label}</span>
              <span class="vp2fa-format-tag">${format}</span>
              ${isTestMode ? '<span class="vp2fa-test-tag">测试模式</span>' : ''}
            </div>
            <span class="vp2fa-code">${code.slice(0,3)} ${code.slice(3)}</span>
            ${isTestMode ? '<div class="vp2fa-test-hint">此为临时测试验证码，刷新页面后失效</div>' : ''}
          </div>
          <div class="vp2fa-actions">
            <div class="vp2fa-timer ${remaining<=5?'warn':''} ${remaining<=0?'expired':''}">
              <svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="${CIRCLE_RADIUS}"/><circle class="progress" cx="20" cy="20" r="${CIRCLE_RADIUS}" stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="${offset}"/></svg>
              <span class="vp2fa-timer-text">${remaining}</span>
            </div>
            <button class="vp2fa-btn" data-action="copy" data-code="${code}">📋</button>
            <button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button>
          </div>
        </div>`
    } catch (err) {
      renderErrorCache.add(acc.id)
      return `<div class="vp2fa-card error"><div class="vp2fa-info"><span class="vp2fa-label">${acc.label}（密钥无效）</span><span class="vp2fa-code">------</span><div class="vp2fa-error-text">密钥不符合规范，请删除后重新添加</div></div><div class="vp2fa-actions"><button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button></div></div>`
    }
  })
  const cardsHtml = await Promise.all(cardPromises)
  list.innerHTML = cardsHtml.join('')
}

const showToast = (msg) => {
  const toast = document.createElement('div')
  toast.textContent = msg
  toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2328;color:#fff;padding:8px 16px;border-radius:6px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);`
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 1500)
}

let cameraScanner = null
let scannedOtpAuth = null

const loadHtml5Qrcode = () => {
  return new Promise((resolve, reject) => {
    if (window.Html5Qrcode) return resolve(window.Html5Qrcode)
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/dist/html5-qrcode.min.js'
    script.onload = () => { console.log('[2FA] 二维码库加载成功'); resolve(window.Html5Qrcode); }
    script.onerror = () => { console.error('[2FA] 二维码库加载失败'); reject(new Error('二维码库加载失败')); }
    document.head.appendChild(script)
  })
}

const stopCameraScan = async () => {
  if (cameraScanner) {
    try { await cameraScanner.stop() } catch {}
    try { await cameraScanner.clear() } catch {}
    cameraScanner = null
    console.log('[2FA] 摄像头扫描已清理')
  }
}

const openScanModal = async () => {
  const modal = document.getElementById('vp2faScanModal')
  const resultDiv = document.getElementById('vp2faScanResult')
  const confirmBtn = document.getElementById('vp2faScanConfirm')
  const region = document.getElementById('vp2faScanRegion')
  const placeholder = region.querySelector('.vp2fa-scan-placeholder')
  
  modal.style.display = 'flex'
  resultDiv.style.display = 'none'
  confirmBtn.style.display = 'none'
  scannedOtpAuth = null
  placeholder.style.display = 'block'
  region.querySelectorAll('.scan-overlay').forEach(el => el.remove())

  const overlay = document.createElement('div')
  overlay.className = 'scan-overlay'
  region.appendChild(overlay)

  try {
    const Html5Qrcode = await loadHtml5Qrcode()
    cameraScanner = new Html5Qrcode('vp2faScanRegion')
    const config = { fps: 10, qrbox: { width: 250, height: 250 } }
    
    await cameraScanner.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => handleScanSuccess(decodedText),
      () => {}
    )
    console.log('[2FA] 摄像头扫描已启动')
  } catch (err) {
    placeholder.innerHTML = `❌ 无法启动摄像头：${err.message}<br><small>请确认已授予摄像头权限，或使用HTTPS访问。也可直接点「选择图片」</small>`
    console.error('[2FA] 摄像头启动失败：', err)
  }
}

const handleScanSuccess = (decodedText) => {
  const parsed = parseOtpAuth(decodedText)
  const resultDiv = document.getElementById('vp2faScanResult')
  const confirmBtn = document.getElementById('vp2faScanConfirm')
  
  if (parsed && parsed.secret) {
    scannedOtpAuth = parsed
    resultDiv.innerHTML = `✅ 识别成功！<br>账号：<b>${parsed.label}</b><br>密钥：<code>${parsed.secret}</code>`
    resultDiv.style.display = 'block'
    confirmBtn.style.display = 'inline-block'
    showToast('二维码识别成功')
    stopCameraScan()
  } else {
    resultDiv.innerHTML = `⚠️ 识别到的内容不是有效的2FA二维码<br><small>${decodedText.substring(0, 80)}...</small>`
    resultDiv.style.display = 'block'
  }
}

const closeScanModal = async () => {
  const modal = document.getElementById('vp2faScanModal')
  modal.style.display = 'none'
  await stopCameraScan()
}

onMounted(async () => {
  await nextTick()

  document.getElementById('vp2faList').addEventListener('click', (e) => {
    const btn = e.target.closest('.vp2fa-btn')
    if (!btn) return
    if (btn.dataset.action === 'copy') {
      navigator.clipboard.writeText(btn.dataset.code)
      showToast('验证码已复制')
    }
    if (btn.dataset.action === 'delete') {
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.filter(a => a.id !== btn.dataset.id)))
      renderErrorCache.delete(btn.dataset.id)
      renderList()
    }
  })

  document.getElementById('vp2faAddBtn').addEventListener('click', () => {
    const labelInput = document.getElementById('vp2faLabel')
    const secretInput = document.getElementById('vp2faSecret')
    const label = labelInput.value.trim()
    const input = secretInput.value.trim()
    if (!input) { alert('请输入2FA密钥或otpauth://链接'); return }

    const parsed = parseOtpAuth(input)
    const secret = parsed ? parsed.secret : input
    const decoded = decodeSecret(secret)
    if (!decoded || decoded.key.length < MIN_SECRET_BYTES) {
      alert('密钥格式无效！<br><br>✅ 支持的格式：<br>1. Base32（如JBSWY3DPEHPK3PXP）<br>2. Hex（如DEADBEEF12345678）<br>3. 数字串<br>4. otpauth://标准链接')
      return
    }

    const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    accounts.push({ 
      id: Date.now().toString(36), 
      label: parsed?.label || label || '未命名账号', 
      secret 
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    labelInput.value = ''; secretInput.value = ''
    renderList()
    showToast(decoded.isTestMode ? '测试账号添加成功（刷新后失效）' : '账号添加成功')
  })

  document.getElementById('vp2faScanBtn').addEventListener('click', openScanModal)
  document.getElementById('vp2faScanClose').addEventListener('click', closeScanModal)
  document.getElementById('vp2faScanStop').addEventListener('click', closeScanModal)
  
  document.getElementById('vp2faScanConfirm').addEventListener('click', () => {
    if (!scannedOtpAuth) return
    const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    accounts.push({
      id: Date.now().toString(36),
      label: scannedOtpAuth.label,
      secret: scannedOtpAuth.secret
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    closeScanModal()
    renderList()
    showToast('账号添加成功')
  })

  const imageInput = document.getElementById('vp2faImageInput')
  document.getElementById('vp2faPickImage').addEventListener('click', async () => {
    await stopCameraScan()
    imageInput.click()
  })

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const resultDiv = document.getElementById('vp2faScanResult')
    showToast('正在解析图片...')
    
    try {
      const Html5Qrcode = await loadHtml5Qrcode()
      if (!Html5Qrcode) throw new Error('二维码库未加载')
      
      const fileScanner = new Html5Qrcode('vp2faFileScanRegion')
      const result = await fileScanner.scanFile(file, true)
      await fileScanner.clear()
      
      console.log('[2FA] 图片解析结果：', result)
      handleScanSuccess(result)
    } catch (err) {
      console.error('[2FA] 图片解析失败：', err)
      resultDiv.innerHTML = `❌ 未检测到二维码<br><small>请尝试：1) 用系统截图代替手机拍照 2) 确保二维码完整居中 3) 刷新页面后重试</small>`
      resultDiv.style.display = 'block'
      showToast('图片解析失败')
    } finally {
      e.target.value = ''
    }
  })

  document.getElementById('vp2faExportBtn').addEventListener('click', () => {
    const data = JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY) || []), null, 2)
    navigator.clipboard.writeText(data)
    showToast('配置已复制到剪贴板')
  })

  document.getElementById('vp2faImportBtn').addEventListener('click', () => {
    const raw = prompt('请粘贴之前导出的 JSON 配置：')
    if (!raw) return
    try {
      const imported = JSON.parse(raw)
      if (!Array.isArray(imported)) throw new Error()
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      let added = 0, filtered = 0
      imported.forEach(item => {
        if (item.label && item.secret && isValidPersistentSecret(item.secret)) {
          accounts.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), label: item.label, secret: item.secret })
          added++
        } else { filtered++ }
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
      renderList()
      alert(`导入完成：<br>✅ 成功添加 ${added} 个有效账号<br>🧪 过滤 ${filtered} 个测试模式账号`)
    } catch { alert('JSON 格式错误，导入失败') }
  })

  document.getElementById('vp2faClearBtn').addEventListener('click', () => {
    if (confirm('确定要清空所有账号吗？此操作不可恢复。')) {
      localStorage.removeItem(STORAGE_KEY)
      renderErrorCache.clear()
      renderList()
    }
  })

  renderList()
  setInterval(renderList, 1000)
})
</script>
