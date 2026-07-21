---
title: 2FA 验证码密钥工具
head:
  - - link
    - rel: stylesheet
      href: /tool/2FAauthenticator.css
  - - script
    - src: /tool/2FAauthenticator.js
---

# 2FA验证码密钥工具

<ClientOnly>
<div class="vp2fa-root">
  <div id="vp2faList"></div>
  <div class="vp2fa-form">
    <div class="vp2fa-input-group">
      <input id="vp2faLabel" class="vp2fa-input" placeholder="账号名（如：GitHub）">
      <input id="vp2faSecret" class="vp2fa-input" placeholder="密钥（任意字符均可）">
    </div>
    <button id="vp2faAddBtn" class="vp2fa-add-btn">+ 添加账号</button>
    <div class="vp2fa-tools">
      <button id="vp2faExportBtn" class="vp2fa-tool-btn">📤 导出配置</button>
      <button id="vp2faImportBtn" class="vp2fa-tool-btn">📥 导入配置</button>
      <button id="vp2faClearBtn" class="vp2fa-tool-btn danger">🗑️ 清空全部</button>
    </div>
  </div>
</div>

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
</ClientOnly>

## 该工具有什么用处？

仅使用网页端，方便快捷使用；只需要输入账号名和需要使用的账户2FA密钥，即可生成对应的2FA验证码密钥，来方便有需时候使用，避免了有时候找不到2FA验证器应用的时候，无法登录自己的账户。

## 注意

使用该工具极有可能会导致你的账户被盗！请尽量避免该网页被露出，以免账号被盗。
