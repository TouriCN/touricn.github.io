# 2FA验证码密钥工具
<ClientOnly>
<style>
/* ============================================================
   VitePress 2FA 认证器 · 样式
   - 自动跟随 VP 亮/暗主题
   - 卡片 UI
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
     HTML 结构（无 onclick，全部 addEventListener）
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

    <!-- 工具按钮 -->
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
     ✅ 关键：用 src 引入，Vite 构建时完全跳过此文件
     ✅ 路径对应 .vitepress/public/tool/2FAauthenticator.js
     ============================================================ -->
<script src="/tool/2FAauthenticator.js"></script>
</ClientOnly>
## 该工具有什么用处？
仅使用网页端，方便快捷使用；只需要输入账号名和需要使用的账户2FA密钥，即可生成对应的2FA验证码密钥，来方便有需时候使用，避免了有时候找不到2FA验证器应用的时候，无法登录自己的账户。
## 注意
使用该工具极有可能会导致你的账户被盗！请尽量避免该网页被露出，以免账号被盗。