/* ============================================================
   VitePress Safe 2FA Authenticator
   Path: .vitepress/public/tool/2FAauthenticator.js
   ✅ 零顶层 window 引用（不会被 Node.js 执行）
   ✅ 零模块副作用
   ✅ 纯 CSR，SSR 完全跳过
   ✅ TOTP RFC 6238 兼容
   ============================================================ */

(function () {
  // 第一道防线：确认在浏览器环境
  if (typeof window === 'undefined') return;
  if (typeof document === 'undefined') return;
  if (!window.crypto || !window.crypto.subtle) return;

  // ===== 配置常量 =====
  var VP2FA_KEY = 'vp2fa_accounts';
  var PERIOD = 30;
  var CR = 16; // 圆环半径
  var CC = 2 * Math.PI * CR; // 周长 ≈ 100.53

  // ===== Base32 解码（容错：跳过非法字符）=====
  function base32Decode(str) {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    str = str.replace(/=+$/, '').toUpperCase().replace(/\s/g, '');
    var bits = '';
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      var val = alphabet.indexOf(str[i]);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    for (var j = 0; j < bits.length - 7; j += 8) {
      bytes.push(parseInt(bits.substr(j, 8), 2));
    }
    return new Uint8Array(bytes);
  }

  // ===== HMAC-SHA1 =====
  function hmacSha1(key, data) {
    return crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
    ).then(function (cryptoKey) {
      return crypto.subtle.sign('HMAC', cryptoKey, data);
    }).then(function (sig) {
      return new Uint8Array(sig);
    });
  }

  // ===== 生成 TOTP =====
  function generateTotp(secretStr) {
    var key = base32Decode(secretStr);
    var counter = Math.floor(Date.now() / 1000 / PERIOD);
    var buffer = new ArrayBuffer(8);
    new DataView(buffer).setUint32(4, counter, false);
    return hmacSha1(key, buffer).then(function (hs) {
      var offset = hs[hs.length - 1] & 0x0F;
      var code = (
        ((hs[offset] & 0x7F) << 24) |
        ((hs[offset + 1] & 0xFF) << 16) |
        ((hs[offset + 2] & 0xFF) << 8) |
        (hs[offset + 3] & 0xFF)
      ) % 1000000;
      return code.toString().padStart(6, '0');
    });
  }

  // ===== 解析 otpauth:// 链接 =====
  function parseOtpAuth(uri) {
    try {
      var url = new URL(uri);
      if (url.protocol !== 'otpauth:') return null;
      var params = new URLSearchParams(url.search);
      return {
        label: decodeURIComponent(url.pathname.split('/')[1] || '未命名账号'),
        secret: params.get('secret')
      };
    } catch (e) {
      return null;
    }
  }

  // ===== HTML 转义（防 XSS）=====
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ===== Toast 提示 =====
  function showToast(msg, type) {
    var t = document.querySelector('.vp2fa-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'vp2fa-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'vp2fa-toast show ' + (type || '');
    setTimeout(function () { t.className = 'vp2fa-toast'; }, 2000);
  }

  // ===== 渲染账号列表 =====
  function renderList() {
    var list = document.getElementById('vp2faList');
    if (!list) return;

    var accounts;
    try {
      accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    } catch (e) {
      accounts = [];
    }

    list.innerHTML = '';

    if (accounts.length === 0) {
      list.innerHTML = '<div class="vp2fa-empty">暂无账号，请在下方添加</div>';
      return;
    }

    var remaining = PERIOD - Math.floor(Date.now() / 1000) % PERIOD;
    var offset = CC * (remaining / PERIOD);
    var warnClass = remaining <= 5 ? 'warn' : '';
    var expClass = remaining <= 0 ? 'expired' : '';

    // 串行生成，避免并发渲染错乱
    var chain = Promise.resolve();
    accounts.forEach(function (acc) {
      chain = chain.then(function () {
        return generateTotp(acc.secret).then(function (code) {
          var card = document.createElement('div');
          card.className = 'vp2fa-card';
          card.innerHTML =
            '<div class="vp2fa-info">' +
              '<span class="vp2fa-label">' + esc(acc.label) + '</span>' +
              '<span class="vp2fa-code">' + code.slice(0, 3) + ' ' + code.slice(3) + '</span>' +
            '</div>' +
            '<div class="vp2fa-actions">' +
              '<div class="vp2fa-timer ' + warnClass + ' ' + expClass + '">' +
                '<svg viewBox="0 0 40 40">' +
                  '<circle class="bg" cx="20" cy="20" r="' + CR + '"></circle>' +
                  '<circle class="progress" cx="20" cy="20" r="' + CR + '" stroke-dasharray="' + CC + '" stroke-dashoffset="' + offset + '"></circle>' +
                '</svg>' +
                '<span class="vp2fa-timer-text">' + remaining + '</span>' +
              '</div>' +
              '<button class="vp2fa-btn" data-action="copy" data-code="' + code + '" title="复制">' +
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>' +
              '</button>' +
              '<button class="vp2fa-btn delete" data-action="delete" data-id="' + esc(acc.id) + '" title="删除">' +
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>' +
              '</button>' +
            '</div>';
          list.appendChild(card);
        });
      });
    });
  }

  // ===== 添加账号 =====
  function addAccount() {
    var labelInput = document.getElementById('vp2faLabel');
    var secretInput = document.getElementById('vp2faSecret');
    var label = labelInput.value.trim();
    var input = secretInput.value.trim();

    if (!input) { showToast('请输入密钥', 'error'); return; }

    var parsed = parseOtpAuth(input);
    var secret = parsed ? parsed.secret : input;
    if (!parsed) label = label || '未命名账号';

    var accounts;
    try {
      accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    } catch (e) {
      accounts = [];
    }
    accounts.push({
      id: Date.now().toString(36),
      label: parsed && parsed.label ? parsed.label : label,
      secret: secret
    });
    localStorage.setItem(VP2FA_KEY, JSON.stringify(accounts));

    labelInput.value = '';
    secretInput.value = '';
    renderList();
    showToast('已添加：' + label, 'success');
  }

  // ===== 删除账号 =====
  function deleteAccount(id) {
    var accounts;
    try {
      accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    } catch (e) {
      accounts = [];
    }
    var target = null;
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].id === id) { target = accounts[i]; break; }
    }
    var filtered = [];
    for (var j = 0; j < accounts.length; j++) {
      if (accounts[j].id !== id) filtered.push(accounts[j]);
    }
    localStorage.setItem(VP2FA_KEY, JSON.stringify(filtered));
    renderList();
    if (target) showToast('已删除：' + target.label);
  }

  // ===== 复制验证码 =====
  function copyCode(code) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () {
        showToast('已复制：' + code, 'success');
      }).catch(function () { fallbackCopy(code); });
    } else {
      fallbackCopy(code);
    }
  }
  function fallbackCopy(code) {
    var ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    showToast('已复制：' + code, 'success');
  }

  // ===== 导出配置 =====
  function exportConfig() {
    var accounts;
    try {
      accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    } catch (e) {
      accounts = [];
    }
    if (accounts.length === 0) { showToast('没有可导出的账号', 'error'); return; }
    var data = JSON.stringify(accounts.map(function (a) {
      return { label: a.label, secret: a.secret };
    }), null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data).then(function () {
        showToast('配置已复制到剪贴板', 'success');
      }).catch(function () { downloadBackup(data); });
    } else {
      downloadBackup(data);
    }
  }
  function downloadBackup(data) {
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('配置已下载', 'success');
  }

  // ===== 导入弹窗控制 =====
  function showImportModal() {
    var m = document.getElementById('vp2faImportModal');
    if (m) m.classList.add('active');
  }
  function hideImportModal() {
    var m = document.getElementById('vp2faImportModal');
    var ta = document.getElementById('vp2faImportData');
    if (m) m.classList.remove('active');
    if (ta) ta.value = '';
  }

  // ===== 导入配置 =====
  function importConfig() {
    var ta = document.getElementById('vp2faImportData');
    if (!ta) return;
    var raw = ta.value.trim();
    if (!raw) { showToast('请粘贴配置数据', 'error'); return; }
    try {
      var imported = JSON.parse(raw);
      if (!Array.isArray(imported)) throw new Error('格式错误');
      var accounts;
      try {
        accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
      } catch (e) {
        accounts = [];
      }
      var count = 0;
      for (var i = 0; i < imported.length; i++) {
        var item = imported[i];
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

  // ===== 清空全部 =====
  function clearAll() {
    var accounts;
    try {
      accounts = JSON.parse(localStorage.getItem(VP2FA_KEY) || '[]');
    } catch (e) {
      accounts = [];
    }
    if (accounts.length === 0) { showToast('没有账号可清除', 'error'); return; }
    if (confirm('确定删除全部 ' + accounts.length + ' 个账号？此操作不可恢复！')) {
      localStorage.removeItem(VP2FA_KEY);
      renderList();
      showToast('已全部清除', 'success');
    }
  }

  // ===== 绑定事件 =====
  function bindEvents() {
    // 列表按钮委托
    var listEl = document.getElementById('vp2faList');
    if (listEl) {
      listEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.vp2fa-btn');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        if (action === 'copy') copyCode(btn.getAttribute('data-code'));
        if (action === 'delete') deleteAccount(btn.getAttribute('data-id'));
      });
    }

    // 添加按钮
    var addBtn = document.getElementById('vp2faAddBtn');
    if (addBtn) addBtn.addEventListener('click', addAccount);

    // 工具按钮
    var expBtn = document.getElementById('vp2faExportBtn');
    if (expBtn) expBtn.addEventListener('click', exportConfig);

    var impBtn = document.getElementById('vp2faImportBtn');
    if (impBtn) impBtn.addEventListener('click', showImportModal);

    var clrBtn = document.getElementById('vp2faClearBtn');
    if (clrBtn) clrBtn.addEventListener('click', clearAll);

    // 导入弹窗按钮
    var impConf = document.getElementById('vp2faImportConfirm');
    if (impConf) impConf.addEventListener('click', importConfig);

    var impCanc = document.getElementById('vp2faImportCancel');
    if (impCanc) impCanc.addEventListener('click', hideImportModal);

    // 回车提交
    var secInput = document.getElementById('vp2faSecret');
    if (secInput) {
      secInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addAccount();
      });
    }
  }

  // ===== 初始化 =====
  function init() {
    bindEvents();
    renderList();
    setInterval(renderList, 1000);
  }

  // 暴露到全局，供 MD 里的 <script> 手动调用（双保险）
  window.__initVP2FA = init;

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
