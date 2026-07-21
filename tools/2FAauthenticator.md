# 2FA验证码密钥工具
<style>
/* ============================================================
   VitePress 2FA 认证器 · 完整单文件版
   - 卡片式 UI，自动跟随 VP 亮/暗主题
   - 不校验密钥合法性
   - 兼容 VitePress SSR + GitHub Pages
   - 工具按钮使用 addEventListener（不会变源码）
   ============================================================ */

.vp2fa-root {
  margin: 1.5rem 0;
  font-family: var(--vp-font-family-base);
}
.vp2fa-root * {
  box-sizing: border-box;
}

/* ===== 账号卡片 ===== */
.vp2fa-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 10px;
  background-color: var(--vp-c-bg-soft, #f6f8fa);
  border: 1px solid var(--vp-c-divider, #d0d7de);
  border-radius: 12px;
  transition: border-color 0.2s ease;
}
.dark .vp2fa-card {
  background-color: var(--vp-c-bg-soft, #161b22);
  border-color: var(--vp-c-divider, #30363d);
}
.vp2fa-card:hover {
  border-color: var(--vp-c-brand-1, #58a6ff);
}

/* ===== 账号信息 ===== */
.vp2fa-info {
  min-width: 0;
  flex: 1;
}
.vp2fa-label {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-2, #57606a);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .vp2fa-label {
  color: var(--vp-c-text-2, #8b949e);
}
.vp2fa-code {
  display: block;
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--vp-c-text-1, #1f2328);
}
.dark .vp2fa-code {
  color: var(--vp-c-text-1, #e6edf3);
}

/* ===== 操作区 ===== */
.vp2fa-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

/* ===== 倒计时圆环 ===== */
.vp2fa-timer {
  position: relative;
  width: 40px;
  height: 40px;
}
.vp2fa-timer svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.vp2fa-timer .bg {
  fill: none;
  stroke: var(--vp-c-divider, #d0d7de);
  stroke-width: 3;
}
.dark .vp2fa-timer .bg {
  stroke: var(--vp-c-divider, #30363d);
}
.vp2fa-timer .progress {
  fill: none;
  stroke: var(--vp-c-brand-1, #58a6ff);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s linear;
}
.vp2fa-timer.warn .progress {
  stroke: var(--vp-c-yellow-1, #d29922);
}
.vp2fa-timer.expired .progress {
  stroke: var(--vp-c-red-1, #f85149);
}
.vp2fa-timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1, #1f2328);
}
.dark .vp2fa-timer-text {
  color: var(--vp-c-text-1, #e6edf3);
}

/* ===== 图标按钮 ===== */
.vp2fa-btn {
  padding: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2, #57606a);
  cursor: pointer;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.vp2fa-btn:hover {
  color: var(--vp-c-brand-1, #58a6ff);
  background-color: rgba(88, 166, 255, 0.1);
}
.dark .vp2fa-btn {
  color: var(--vp-c-text-2, #8b949e);
}
.vp2fa-btn.delete:hover {
  color: var(--vp-c-red-1, #f85149);
  background-color: rgba(248, 81, 73, 0.1);
}
.vp2fa-btn svg {
  width: 18px;
  height: 18px;
}

/* ===== 添加表单 ===== */
.vp2fa-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed var(--vp-c-divider, #d0d7de);
}
.dark .vp2fa-form {
  border-color: var(--vp-c-divider, #30363d);
}
.vp2fa-input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}
.vp2fa-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--vp-c-divider, #d0d7de);
  border-radius: 6px;
  background-color: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1, #1f2328);
  box-sizing: border-box;
}
.dark .vp2fa-input {
  background-color: var(--vp-c-bg, #0d1117);
  border-color: var(--vp-c-divider, #30363d);
  color: var(--vp-c-text-1, #e6edf3);
}
.vp2fa-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1, #58a6ff);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
}
.vp2fa-add-btn {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  border: 1px dashed var(--vp-c-divider, #d0d7de);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2, #57606a);
  cursor: pointer;
  transition: all 0.2s ease;
}
.vp2fa-add-btn:hover {
  border-color: var(--vp-c-brand-1, #58a6ff);
  color: var(--vp-c-brand-1, #58a6ff);
}
.dark .vp2fa-add-btn {
  border-color: var(--vp-c-divider, #30363d);
  color: var(--vp-c-text-2, #8b949e);
}
.dark .vp2fa-add-btn:hover {
  border-color: var(--vp-c-brand-1, #58a6ff);
  color: var(--vp-c-brand-1, #58a6ff);
}

/* ===== 工具按钮区 ===== */
.vp2fa-tools {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.vp2fa-tool-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider, #d0d7de);
  background: var(--vp-c-bg-soft, #f6f8fa);
  color: var(--vp-c-text-2, #57606a);
  cursor: pointer;
  transition: all 0.2s ease;
}
.vp2fa-tool-btn:hover {
  border-color: var(--vp-c-brand-1, #58a6ff);
  color: var(--vp-c-brand-1, #58a6ff);
}
.dark .vp2fa-tool-btn {
  background: var(--vp-c-bg-soft, #161b22);
  border-color: var(--vp-c-divider, #30363d);
  color: var(--vp-c-text-2, #8b949e);
}
.dark .vp2fa-tool-btn:hover {
  border-color: var(--vp-c-brand-1, #58a6ff);
  color: var(--vp-c-brand-1, #58a6ff);
}
.vp2fa-tool-btn.danger:hover {
  border-color: var(--vp-c-red-1, #f85149);
  color: var(--vp-c-red-1, #f85149);
}

/* ===== 空状态 ===== */
.vp2fa-empty {
  text-align: center;
  padding: 32px 16px;
  border: 1px dashed var(--vp-c-divider, #d0d7de);
  border-radius: 12px;
  color: var(--vp-c-text-3, #8b949e);
  font-size: 14px;
}

/* ===== Toast 提示 ===== */
.vp2fa-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1, #58a6ff);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s, transform 0.25s;
}
.vp2fa-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.vp2fa-toast.error {
  background: var(--vp-c-red-1, #f85149);
}
.vp2fa-toast.success {
  background: var(--vp-c-green-1, #2ea043);
}

/* ===== 导入弹窗 ===== */
.vp2fa-modal-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.vp2fa-modal-overlay.active {
  display: flex;
}
.vp2fa-modal {
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #d0d7de);
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 420px;
  width: 90%;
  box-shadow: var(--vp-shadow-3, 0 12px 40px rgba(0,0,0,0.2));
}
.dark .vp2fa-modal {
  background: var(--vp-c-bg-soft, #161b22);
  border-color: var(--vp-c-divider, #30363d);
}
.vp2fa-modal h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--vp-c-text-1, #1f2328);
}
.dark .vp2fa-modal h3 {
  color: var(--vp-c-text-1, #e6edf3);
}
.vp2fa-modal p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: var(--vp-c-text-2, #57606a);
}
.dark .vp2fa-modal p {
  color: var(--vp-c-text-2, #8b949e);
}
.vp2fa-modal textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  border: 1px solid var(--vp-c-divider, #d0d7de);
  border-radius: 6px;
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1, #1f2328);
  box-sizing: border-box;
  resize: vertical;
  margin-bottom: 12px;
}
.dark .vp2fa-modal textarea {
  background: var(--vp-c-bg, #0d1117);
  border-color: var(--vp-c-divider, #30363d);
  color: var(--vp-c-text-1, #e6edf3);
}
.vp2fa-modal-actions {
  display: flex;
  gap: 8px;
}
.vp2fa-btn-confirm {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--vp-c-brand-1, #58a6ff);
  background: var(--vp-c-brand-1, #58a6ff);
  color: #fff;
}
.vp2fa-btn-confirm:hover {
  opacity: 0.9;
}
.vp2fa-btn-cancel {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--vp-c-divider, #d0d7de);
  background: transparent;
  color: var(--vp-c-text-2, #57606a);
}
.vp2fa-btn-cancel:hover {
  background: var(--vp-c-bg-soft, #f6f8fa);
}
.dark .vp2fa-btn-cancel {
  border-color: var(--vp-c-divider, #30363d);
  color: var(--vp-c-text-2, #8b949e);
}
.dark .vp2fa-btn-cancel:hover {
  background: var(--vp-c-bg-mute, #21262d);
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .vp2fa-input-group {
    grid-template-columns: 1fr;
  }
  .vp2fa-tools {
    flex-direction: column;
  }
  .vp2fa-code {
    font-size: 20px;
  }
}
</style>

<!-- ============================================================
     HTML 结构（无 onclick，避免 VitePress MD 渲染为源码）
     ============================================================ -->
<div class="vp2fa-root">
  <!-- 账号列表容器 -->
  <div id="vp2faList"></div>

  <!-- 添加账号表单 -->
  <div class="vp2fa-form">
    <div class="vp2fa-input-group">
      <input id="vp2faLabel" class="vp2fa-input" placeholder="账号名（如：GitHub）">
      <input id="vp2faSecret" class="vp2fa-input" placeholder="密钥（任意字符均可）">
    </div>
    <button class="vp2fa-add-btn" id="vp2faAddBtn">+ 添加账号</button>

    <!-- 工具按钮（使用 addEventListener 绑定，不会变源码） -->
    <div class="vp2fa-tools">
      <button class="vp2fa-tool-btn" id="vp2faExportBtn">📤 导出配置</button>
      <button class="vp2fa-tool-btn" id="vp2faImportBtn">📥 导入配置</button>
      <button class="vp2fa-tool-btn danger" id="vp2faClearBtn">🗑️ 清空全部</button>
    </div>
  </div>
</div>

<!-- 导入弹窗 -->
<div class="vp2fa-modal-overlay" id="vp2faImportModal">
  <div class="vp2fa-modal">
    <h3>📥 导入配置</h3>
    <p>粘贴之前导出的 JSON 配置：</p>
    <textarea id="vp2faImportData" placeholder='[{"label":"GitHub","secret":"JBSWY3DPEHPK3PXP"}]'></textarea>
    <div class="vp2fa-modal-actions">
      <button class="vp2fa-btn-confirm" id="vp2faImportConfirm">确认导入</button>
      <button class="vp2fa-btn-cancel" id="vp2faImportCancel">取消</button>
    </div>
  </div>
</div>

<!-- ============================================================
     JavaScript（全部用 addEventListener，兼容 VP SSR + GH Pages）
     ============================================================ -->
<script>
if (typeof window !== 'undefined') {
  const VP2FA_KEY = 'vp2fa_accounts';
  const PERIOD = 30;
  const CIRCLE_RADIUS = 16; // 对应 40x40 svg
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 100.53

  /* ---------- Base32 解码（容错：跳过非法字符） ---------- */
  function base32Decode(str) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    str = str.replace(/=+$/, '').toUpperCase().replace(/\s/g, '');
    let bits = '', bytes = [];
    for (let i = 0; i < str.length; i++) {
      const val = alphabet.indexOf(str[i]);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i < bits.length - 7; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
  }

  /* ---------- HMAC-SHA1 ---------- */
  async function hmacSha1(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
    );
    return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, data));
  }

  /* ---------- 生成 TOTP ---------- */
  async function generateTotp(secretStr) {
    const key = base32Decode(secretStr);
    const counter = Math.floor(Date.now() / 1000 / PERIOD);
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setUint32(4, counter, false);
    const hs = await hmacSha1(key, buffer);
    const offset = hs[hs.length - 1] & 0x0F;
    const code = (
      ((hs[offset] & 0x7F) << 24) |
      ((hs[offset + 1] & 0xFF) << 16) |
      ((hs[offset + 2] & 0xFF) << 8) |
      (hs[offset + 3] & 0xFF)
    ) % 1000000;
    return code.toString().padStart(6, '0');
  }

  /* ---------- 解析 otpauth:// 链接 ---------- */
  function parseOtpAuth(uri) {
    try {
      const url = new URL(uri);
      if (url.protocol !== 'otpauth:') return null;
      const params = new URLSearchParams(url.search);
      return {
        label: decodeURIComponent(url.pathname.split('/')[1] || '未命名账号'),
        secret: params.get('secret')
      };
    } catch {
      return null;
    }
  }

  /* ---------- HTML 转义（防 XSS） ---------- */
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ---------- Toast 提示 ---------- */
  function showToast(msg, type) {
    let t = document.querySelector('.vp2fa-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'vp2fa-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'vp2fa-toast show ' + (type || '');
    setTimeout(() => { t.className = 'vp2fa-toast'; }, 2000);
  }

  /* ---------- 渲染账号列表 ---------- */
  async function renderList() {
    const list = document.getElementById('vp2faList');
    if (!list) return;
    const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    list.innerHTML = '';

    if (accounts.length === 0) {
      list.innerHTML = '<div class="vp2fa-empty">暂无账号，请在下方添加</div>';
      return;
    }

    const remaining = PERIOD - Math.floor(Date.now() / 1000) % PERIOD;
    const offset = CIRCUMFERENCE * (remaining / PERIOD);
    const warnClass = remaining <= 5 ? 'warn' : '';
    const expClass = remaining <= 0 ? 'expired' : '';

    for (const acc of accounts) {
      const code = await generateTotp(acc.secret);
      const card = document.createElement('div');
      card.className = 'vp2fa-card';
      card.innerHTML = `
        <div class="vp2fa-info">
          <span class="vp2fa-label">${esc(acc.label)}</span>
          <span class="vp2fa-code">${code.slice(0, 3)} ${code.slice(3)}</span>
        </div>
        <div class="vp2fa-actions">
          <div class="vp2fa-timer ${warnClass} ${expClass}">
            <svg viewBox="0 0 40 40">
              <circle class="bg" cx="20" cy="20" r="${CIRCLE_RADIUS}"></circle>
              <circle class="progress" cx="20" cy="20" r="${CIRCLE_RADIUS}"
                stroke-dasharray="${CIRCUMFERENCE}"
                stroke-dashoffset="${offset}">
              </circle>
            </svg>
            <span class="vp2fa-timer-text">${remaining}</span>
          </div>
          <button class="vp2fa-btn" data-action="copy" data-code="${code}" title="复制">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <button class="vp2fa-btn delete" data-action="delete" data-id="${acc.id}" title="删除">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;
      list.appendChild(card);
    }
  }

  /* ---------- 添加账号 ---------- */
  function addAccount() {
    const labelInput = document.getElementById('vp2faLabel');
    const secretInput = document.getElementById('vp2faSecret');
    let label = labelInput.value.trim();
    const input = secretInput.value.trim();

    if (!input) { showToast('请输入密钥', 'error'); return; }

    const parsed = parseOtpAuth(input);
    const secret = parsed ? parsed.secret : input;
    if (!parsed) label = label || '未命名账号';

    const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    accounts.push({
      id: Date.now().toString(36),
      label: parsed?.label || label,
      secret: secret
    });
    localStorage.setItem(VP2FA_KEY, JSON.stringify(accounts));

    labelInput.value = '';
    secretInput.value = '';
    renderList();
    showToast('已添加：' + label, 'success');
  }

  /* ---------- 删除账号 ---------- */
  function deleteAccount(id) {
    const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    const target = accounts.find(a => a.id === id);
    localStorage.setItem(VP2FA_KEY, JSON.stringify(accounts.filter(a => a.id !== id)));
    renderList();
    if (target) showToast('已删除：' + target.label);
  }

  /* ---------- 复制验证码 ---------- */
  function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('已复制：' + code, 'success');
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('已复制：' + code, 'success');
    });
  }

  /* ---------- 导出配置 ---------- */
  function exportConfig() {
    const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    if (accounts.length === 0) { showToast('没有可导出的账号', 'error'); return; }
    const data = JSON.stringify(accounts.map(a => ({ label: a.label, secret: a.secret })), null, 2);
    navigator.clipboard.writeText(data).then(() => {
      showToast('配置已复制到剪贴板', 'success');
    }).catch(() => {
      // fallback：下载文件
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '2fa-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('配置已下载', 'success');
    });
  }

  /* ---------- 导入弹窗控制 ---------- */
  function showImportModal() {
    document.getElementById('vp2faImportModal').classList.add('active');
  }
  function hideImportModal() {
    document.getElementById('vp2faImportModal').classList.remove('active');
    document.getElementById('vp2faImportData').value = '';
  }

  /* ---------- 导入配置 ---------- */
  function importConfig() {
    const raw = document.getElementById('vp2faImportData').value.trim();
    if (!raw) { showToast('请粘贴配置数据', 'error'); return; }
    try {
      const imported = JSON.parse(raw);
      if (!Array.isArray(imported)) throw new Error('格式错误');
      const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
      let count = 0;
      for (const item of imported) {
        if (!item.secret) continue;
        accounts.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
          label: item.label || '未命名账号',
          secret: item.secret.replace(/\s/g, '')
        });
        count++;
      }
      localStorage.setItem(VP2FA_KEY, JSON.stringify(accounts));
      renderList();
      hideImportModal();
      showToast('成功导入 ' + count + ' 个账号', 'success');
    } catch (e) {
      showToast('导入失败：JSON 格式错误', 'error');
    }
  }

  /* ---------- 清空全部 ---------- */
  function clearAll() {
    const accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    if (accounts.length === 0) { showToast('没有账号可清除', 'error'); return; }
    if (confirm('确定删除全部 ' + accounts.length + ' 个账号？此操作不可恢复！')) {
      localStorage.removeItem(VP2FA_KEY);
      renderList();
      showToast('已全部清除', 'success');
    }
  }

  /* ===== DOM 事件绑定（不用 onclick，避免 MD 渲染为源码）===== */

  // 委托列表区域的按钮点击（复制 / 删除）
  document.getElementById('vp2faList').addEventListener('click', function(e) {
    const btn = e.target.closest('.vp2fa-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'copy') copyCode(btn.dataset.code);
    if (action === 'delete') deleteAccount(btn.dataset.id);
  });

  // 添加按钮
  document.getElementById('vp2faAddBtn').addEventListener('click', addAccount);

  // 工具按钮
  document.getElementById('vp2faExportBtn').addEventListener('click', exportConfig);
  document.getElementById('vp2faImportBtn').addEventListener('click', showImportModal);
  document.getElementById('vp2faClearBtn').addEventListener('click', clearAll);

  // 导入弹窗按钮
  document.getElementById('vp2faImportConfirm').addEventListener('click', importConfig);
  document.getElementById('vp2faImportCancel').addEventListener('click', hideImportModal);

  // 支持回车提交
  document.getElementById('vp2faSecret').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addAccount();
  });

  /* ===== 初始化 ===== */
  requestAnimationFrame(() => {
    renderList();
    setInterval(renderList, 1000);
  });
}
</script>
## 该工具有什么用处？
仅使用网页端，方便快捷使用；只需要输入账号名和需要使用的账户2FA密钥，即可生成对应的2FA验证码密钥，来方便有需时候使用，避免了有时候找不到2FA验证器应用的时候，无法登录自己的账户。
## 注意
使用该工具极有可能会导致你的账户被盗！请尽量避免该网页被露出，以免账号被盗。