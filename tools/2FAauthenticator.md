# 2FA验证码密钥工具

<div class="vp2fa-root">
  <div id="vp2faList"></div>

  <div class="vp2fa-form">
    <div class="vp2fa-input-grid">
      <input id="vp2faLabel" class="vp2fa-input" placeholder="账号名（如：GitHub）">
      <input id="vp2faSecret" class="vp2fa-input" placeholder="密钥（Base32格式，至少16位，如JBSWY3DPEHPK3PXP）">
    </div>
    <button id="vp2faAddBtn" class="vp2fa-add-btn">+ 添加账号</button>
    <div class="vp2fa-tools">
      <button id="vp2faExportBtn" class="vp2fa-tool-btn">📤 导出配置</button>
      <button id="vp2faImportBtn" class="vp2fa-tool-btn">📥 导入配置</button>
      <button id="vp2faClearBtn" class="vp2fa-tool-btn danger">🗑️ 清空全部</button>
    </div>
  </div>
</div>

## 该工具有什么用处？
仅使用网页端，方便快捷使用；只需要输入账号名和需要使用的账户2FA密钥，即可生成对应的2FA验证码，避免找不到验证器应用时无法登录账户。

## 注意
使用该工具极有可能会导致你的账户被盗！请尽量避免页面内容被他人看到，不要在不安全的设备上使用。

<style>
.vp2fa-root { margin: 1.5rem 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.vp2fa-card { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; margin-bottom: 10px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 12px; transition: border-color 0.2s; }
.vp2fa-card:hover { border-color: #58a6ff; }
.vp2fa-card.error { border-color: #f85149; background: #fff0f0; }
.vp2fa-label { display: block; font-size: 13px; color: #57606a; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vp2fa-code { display: block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 24px; font-weight: 600; letter-spacing: 2px; color: #1f2328; }
.vp2fa-error-text { color: #f85149; font-size: 12px; margin-top: 4px; }
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
.vp2fa-add-btn { width: 100%; padding: 10px; font-size: 14px; font-weight: 500; border: 1px dashed #d0d7de; border-radius: 6px; background: transparent; color: #57606a; cursor: pointer; transition: all 0.2s; }
.vp2fa-add-btn:hover { border-color: #58a6ff; color: #58a6ff; }
.vp2fa-tools { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.vp2fa-tool-btn { padding: 6px 12px; font-size: 12px; border-radius: 6px; border: 1px solid #d0d7de; background: #f6f8fa; color: #57606a; cursor: pointer; transition: all 0.2s; }
.vp2fa-tool-btn:hover { border-color: #58a6ff; color: #58a6ff; }
.vp2fa-tool-btn.danger:hover { border-color: #f85149; color: #f85149; }

.vp2fa-empty {
  color: #8b949e; font-size: 14px; padding: 32px 0;
  text-align: center; border-radius: 12px; background: #f6f8fa;
  border: 1px dashed #d0d7de;
}

@media (prefers-color-scheme: dark) {
  .vp2fa-card { background: #161b22; border-color: #30363d; }
  .vp2fa-card.error { background: #2d161b; border-color: #f85149; }
  .vp2fa-label { color: #8b949e; }
  .vp2fa-code { color: #e6edf3; }
  .vp2fa-timer .bg { stroke: #30363d; }
  .vp2fa-timer-text { color: #e6edf3; }
  .vp2fa-btn { color: #8b949e; }
  .vp2fa-form { border-color: #30363d; }
  .vp2fa-input { background: #0d1117; border-color: #30363d; color: #e6edf3; }
  .vp2fa-add-btn { border-color: #30363d; color: #8b949e; }
  .vp2fa-add-btn:hover { border-color: #58a6ff; color: #58a6ff; }
  .vp2fa-tool-btn { background: #161b22; border-color: #30363d; color: #8b949e; }
  .vp2fa-tool-btn:hover { border-color: #58a6ff; color: #58a6ff; }
  .vp2fa-empty { color: #6e7681; background: #161b22; border-color: #30363d; }
}

@media (max-width: 640px) {
  .vp2fa-input-grid { grid-template-columns: 1fr; }
  .vp2fa-code { font-size: 20px; }
  .vp2fa-actions { gap: 4px; margin-left: 8px; }
}
</style>

<script setup>
import { onMounted, nextTick } from 'vue'

const STORAGE_KEY = 'vp2fa_accounts'
const PERIOD = 30
const CIRCLE_RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS
const MIN_SECRET_BYTES = 10 // TOTP最低要求：80位（10字节）

// ===== 严格Base32解码（返回null表示无效）=====
const base32Decode = (str) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  // 过滤填充符、空格，转大写
  str = str.replace(/=+$/, '').toUpperCase().replace(/\s/g, '')
  // 空字符串直接返回无效
  if (!str) return null
  
  let bits = '', bytes = []
  for (let i = 0; i < str.length; i++) {
    const val = alphabet.indexOf(str[i])
    // 遇到非Base32字符直接返回无效
    if (val === -1) return null
    bits += val.toString(2).padStart(5, '0')
  }
  
  // 至少要有8位二进制才能解码出1个字节
  if (bits.length < 8) return null
  for (let i = 0; i < bits.length - 7; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2))
  }
  
  const result = new Uint8Array(bytes)
  // 校验长度是否满足TOTP最低要求
  return result.length >= MIN_SECRET_BYTES ? result : null
}

// ===== HMAC-SHA1 =====
const createHmacSigner = async (key) => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  )
  return (data) => crypto.subtle.sign('HMAC', cryptoKey, data)
}

// ===== 生成TOTP =====
const generateTotp = async (secret) => {
  const key = base32Decode(secret)
  if (!key) throw new Error('无效密钥')
  
  const sign = await createHmacSigner(key)
  const counter = Math.floor(Date.now() / 1000 / PERIOD)
  const buffer = new ArrayBuffer(8)
  new DataView(buffer).setUint32(4, counter, false)
  const hs = new Uint8Array(await sign(buffer))
  const offset = hs[hs.length - 1] & 0x0F
  const code = (
    ((hs[offset] & 0x7F) << 24) |
    ((hs[offset + 1] & 0xFF) << 16) |
    ((hs[offset + 2] & 0xFF) << 8) |
    (hs[offset + 3] & 0xFF)
  ) % 1000000
  return code.toString().padStart(6, '0')
}

// ===== 解析 otpauth:// 链接 =====
const parseOtpAuth = (uri) => {
  try {
    const url = new URL(uri)
    if (url.protocol !== 'otpauth:') return null
    const params = new URLSearchParams(url.search)
    return {
      label: decodeURIComponent(url.pathname.split('/')[1] || '未命名账号'),
      secret: params.get('secret')
    }
  } catch { return null }
}

// ===== 严格校验密钥（添加/导入时调用）=====
const isValidSecret = (secret) => {
  const decoded = base32Decode(secret)
  return decoded !== null
}

// ===== 渲染列表（错误隔离，不刷屏）=====
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
    // 已报过错的账号直接显示错误卡片，不再重复执行逻辑
    if (renderErrorCache.has(acc.id)) {
      return `
        <div class="vp2fa-card error">
          <div class="vp2fa-info">
            <span class="vp2fa-label">${acc.label}（密钥无效）</span>
            <span class="vp2fa-code">------</span>
            <div class="vp2fa-error-text">密钥不符合TOTP规范，请删除后重新添加</div>
          </div>
          <div class="vp2fa-actions">
            <button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button>
          </div>
        </div>
      `
    }

    try {
      const code = await generateTotp(acc.secret)
      return `
        <div class="vp2fa-card">
          <div class="vp2fa-info">
            <span class="vp2fa-label">${acc.label}</span>
            <span class="vp2fa-code">${code.slice(0,3)} ${code.slice(3)}</span>
          </div>
          <div class="vp2fa-actions">
            <div class="vp2fa-timer ${remaining <=5 ? 'warn' : ''} ${remaining <=0 ? 'expired' : ''}">
              <svg viewBox="0 0 40 40">
                <circle class="bg" cx="20" cy="20" r="${CIRCLE_RADIUS}"/>
                <circle class="progress" cx="20" cy="20" r="${CIRCLE_RADIUS}"
                  stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="${offset}"/>
              </svg>
              <span class="vp2fa-timer-text">${remaining}</span>
            </div>
            <button class="vp2fa-btn" data-action="copy" data-code="${code}">📋</button>
            <button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button>
          </div>
        </div>
      `
    } catch (err) {
      renderErrorCache.add(acc.id)
      console.warn(`[2FA] 账号「${acc.label}」密钥无效`)
      return `
        <div class="vp2fa-card error">
          <div class="vp2fa-info">
            <span class="vp2fa-label">${acc.label}（密钥无效）</span>
            <span class="vp2fa-code">------</span>
            <div class="vp2fa-error-text">密钥不符合TOTP规范，请删除后重新添加</div>
          </div>
          <div class="vp2fa-actions">
            <button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}">🗑️</button>
          </div>
        </div>
      `
    }
  })

  const cardsHtml = await Promise.all(cardPromises)
  list.innerHTML = cardsHtml.join('')
}

// ===== Toast 提示 =====
const showToast = (msg) => {
  const toast = document.createElement('div')
  toast.textContent = msg
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #1f2328; color: #fff; padding: 8px 16px;
    border-radius: 6px; z-index: 9999; font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 1500)
}

// ===== 事件绑定 =====
onMounted(async () => {
  await nextTick()

  // 列表点击委托
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

  // 添加账号（严格校验）
  document.getElementById('vp2faAddBtn').addEventListener('click', () => {
    const labelInput = document.getElementById('vp2faLabel')
    const secretInput = document.getElementById('vp2faSecret')
    const label = labelInput.value.trim()
    const input = secretInput.value.trim()
    
    if (!input) {
      alert('请输入2FA密钥')
      return
    }

    // 解析otpauth链接
    const parsed = parseOtpAuth(input)
    const secret = parsed ? parsed.secret : input

    // 严格校验密钥
    if (!isValidSecret(secret)) {
      alert(`密钥格式无效！
      
✅ 正确要求：
1. 仅包含Base32合法字符（A-Z、2-7，不区分大小写）
2. 长度至少16位
3. 可从服务商获取的二维码/密钥文本复制

❌ 常见错误：
- 包含1、8、9、0等非法字符
- 长度不足16位
- 误输入中文或特殊符号

示例：JBSWY3DPEHPK3PXP`)
      secretInput.focus()
      return
    }

    const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    accounts.push({
      id: Date.now().toString(36),
      label: parsed?.label || label || '未命名账号',
      secret
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))

    labelInput.value = ''
    secretInput.value = ''
    renderList()
    showToast('账号添加成功')
  })

  // 导出配置
  document.getElementById('vp2faExportBtn').addEventListener('click', () => {
    const data = JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY) || []), null, 2)
    navigator.clipboard.writeText(data)
    showToast('配置已复制到剪贴板')
  })

  // 导入配置（严格校验）
  document.getElementById('vp2faImportBtn').addEventListener('click', () => {
    const raw = prompt('请粘贴之前导出的 JSON 配置：')
    if (!raw) return
    try {
      const imported = JSON.parse(raw)
      if (!Array.isArray(imported)) throw new Error()
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      let added = 0, invalid = 0
      imported.forEach(item => {
        if (item.label && item.secret) {
          if (isValidSecret(item.secret)) {
            accounts.push({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              label: item.label,
              secret: item.secret
            })
            added++
          } else {
            invalid++
          }
        }
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
      renderList()
      alert(`导入完成：
✅ 成功添加 ${added} 个有效账号
❌ 过滤 ${invalid} 个无效密钥`)
    } catch {
      alert('JSON 格式错误，导入失败')
    }
  })

  // 清空全部
  document.getElementById('vp2faClearBtn').addEventListener('click', () => {
    if (confirm('确定要清空所有账号吗？此操作不可恢复。')) {
      localStorage.removeItem(STORAGE_KEY)
      renderErrorCache.clear()
      renderList()
    }
  })

  // 初始化 + 每秒刷新
  renderList()
  setInterval(renderList, 1000)
})
</script>
