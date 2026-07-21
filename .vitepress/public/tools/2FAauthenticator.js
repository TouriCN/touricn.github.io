/* ============================================================
   2FA Authenticator - 纯浏览器脚本
   不依赖任何外部库，零顶层 window 引用
   ============================================================ */

(function () {
  'use strict';

  // ---- 环境检测 ----
  if (typeof window === 'undefined') return;
  if (typeof document === 'undefined') return;
  if (!window.crypto || !window.crypto.subtle) {
    console.warn('[2FA] Web Crypto API not available');
    return;
  }

  // ---- 常量 ----
  var STORAGE_KEY = 'vp2fa_accounts';
  var PERIOD = 30;
  var RADIUS = 16;
  var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // ---- Base32 解码 ----
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

  // ---- HMAC-SHA1 ----
  function hmacSha1(key, data) {
    return crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
    ).then(function (cryptoKey) {
      return crypto.subtle.sign('HMAC', cryptoKey, data);
    }).then(function (sig) {
      return new Uint8Array(sig);
    });
  }

  // ---- 生成 TOTP ----
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

  // ---- 解析 otpauth:// ----
  function parseOtpAuth(uri) {
    try {
      var url = new URL(uri);
      if (url.protocol !== 'otpauth:') return null;
      var params = new URLSearchParams(url.search);
      return {
        label: decodeURIComponent((url.pathname.split('/')[1]) || '未命名账号'),
        secret: params.get('secret')
      };
    } catch (e) {
      return null;
    }
  }

  // ---- HTML 转义 ----
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ---- Toast ----
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

  // ---- 读取账号列表 ----
  function getAccounts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  // ---- 保存账号列表 ----
  function saveAccounts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ---- 渲染列表 ----
  function renderList() {
    var list = document.getElementById('vp2faList');
    if (!list) {
      console.warn('[2FA] #vp2faList not found');
      return;
    }

    var accounts = getAccounts();
    list.innerHTML = '';

    if (accounts.length === 0) {
      list.innerHTML = '<div class="vp2fa-empty">暂无账号，请在下方添加</div>';
      return;
    }

    var remaining = PERIOD - Math.floor(Date.now() / 1000) % PERIOD;
    var offset = CIRCUMFERENCE * (remaining / PERIOD);
    var warnClass = remaining <= 5 ? 'warn' : '';
    var expClass = remaining <= 0 ? 'expired' : '';

    // 串行生成，保证顺序
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
                  '<circle class="bg" cx="20" cy="20" r="' + RADIUS + '"></circle>' +
                  '<circle class="progress" cx="20" cy="20" r="' + RADIUS + '" stroke-dasharray="' + CIRCUMFERENCE + '" stroke-dashoffset="' + offset + '"></circle>' +
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

  // ---- 添加账号 ----
  function addAccount() {
    var labelInput = document.getElementById('vp2faLabel');
    var secretInput = document.getElementById('vp2faSecret');
    if (!labelInput || !secretInput) return;

    var label = labelInput.value.trim();
    var input = secretInput.value.trim();

    if (!input) { showToast('请输入密钥', 'error'); return; }

    var parsed = parseOtpAuth(input);
    var secret = parsed ? parsed.secret : input;
    if (!parsed) label = label || '未命名账号';

    var accounts = getAccounts();
    accounts.push({
      id: Date.now().toString(36),
      label: parsed && parsed.label ? parsed.label : label,
      secret: secret
    });
    saveAccounts(accounts);

    labelInput.value = '';
    secretInput.value = '';
    renderList();
    showToast('已添加：' + label, 'success');
  }

  // ---- 删除账号 ----
  function deleteAccount(id) {
    var accounts = getAccounts().filter(function (a) { return a.id !== id; });
    saveAccounts(accounts);
    renderList();
  }

  // ---- 复制验证码 ----
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

  // ---- 导出 ----
  function exportConfig() {
    var accounts = getAccounts();
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

  // ---- 导入弹窗 ----
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

  function importConfig() {
    var ta = document.getElementById('vp2faImportData');
    if (!ta) return;
    var raw = ta.value.trim();
    if (!raw) { showToast('请粘贴配置数据', 'error'); return; }

    try {
      var imported = JSON.parse(raw);
      if (!Array.isArray(imported)) throw new Error('格式错误');
      var accounts = getAccounts();
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
      saveAccounts(accounts);
      renderList();
      hideImportModal();
      showToast('成功导入 ' + count + ' 个账号', 'success');
    } catch (e) {
      showToast('导入失败：JSON 格式错误', 'error');
    }
  }

  // ---- 清空全部 ----
  function clearAll() {
    var accounts = getAccounts();
    if (accounts.length === 0) { showToast('没有账号可清除', 'error'); return; }
    if (confirm('确定删除全部 ' + accounts.length + ' 个账号？此操作不可恢复！')) {
      localStorage.removeItem(STORAGE_KEY);
      renderList();
      showToast('已全部清除', 'success');
    }
  }

  // ---- 事件绑定 ----
  function bindEvents() {
    // 列表委托
    var list = document.getElementById('vp2faList');
    if (list) {
      list.addEventListener('click', function (e) {
        var btn = e.target.closest('.vp2fa-btn');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        if (action === 'copy') copyCode(btn.getAttribute('data-code'));
        if (action === 'delete') deleteAccount(btn.getAttribute('data-id'));
      });
    }

    var addBtn = document.getElementById('vp2faAddBtn');
    if (addBtn) addBtn.addEventListener('click', addAccount);

    var expBtn = document.getElementById('vp2faExportBtn');
    if (expBtn) expBtn.addEventListener('click', exportConfig);

    var impBtn = document.getElementById('vp2faImportBtn');
    if (impBtn) impBtn.addEventListener('click', showImportModal);

    var clrBtn = document.getElementById('vp2faClearBtn');
    if (clrBtn) clrBtn.addEventListener('click', clearAll);

    var impConf = document.getElementById('vp2faImportConfirm');
    if (impConf) impConf.addEventListener('click', importConfig);

    var impCanc = document.getElementById('vp2faImportCancel');
    if (impCanc) impCanc.addEventListener('click', hideImportModal);

    var secInput = document.getElementById('vp2faSecret');
    if (secInput) {
      secInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addAccount();
      });
    }
  }

  // ---- 初始化 ----
  function init() {
    console.log('[2FA] Initializing...');
    bindEvents();
    renderList();
    setInterval(renderList, 1000);
    console.log('[2FA] Ready');
  }

  // 暴露给全局（调试用）
  window.__initVP2FA = init;

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
