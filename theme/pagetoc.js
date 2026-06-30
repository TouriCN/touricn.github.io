/**
 * 自定义导航栏和页面目录脚本
 * 功能：
 * 1. 创建自定义顶部导航栏（无图标，仅文字标题）
 * 2. 动态计算根路径，确保导航栏标题链接在所有页面都能正确跳转
 * 3. 修复侧边栏外部链接路径问题
 * 4. 创建页面目录侧边栏
 */

(function() {
  'use strict';

  // ========== 全局状态 ==========
  let isSearchOpen = false;
  
  // ========== 工具函数 ==========
  
  /**
   * 检查搜索是否处于激活状态
   * 直接通过 body 的 search-active 类来判断，更可靠
   * @returns {boolean}
   */
  function isSearchActive() {
    return document.body.classList.contains('search-active');
  }
  
  /**
   * 清除 URL 中的 search 参数
   */
  function clearSearchUrlParam() {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('search')) {
        url.searchParams.delete('search');
        window.history.replaceState({}, document.title, url.pathname + url.hash);
      }
    } catch (e) {
      // 忽略错误
    }
  }
  
  /**
   * 计算从当前页面到网站根目录的相对路径
   * @returns {string} 根路径，如 './' 或 '../../'
   */
  function calculatePathToRoot() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    // 减去1是因为最后一部分是文件名
    const depth = Math.max(0, parts.length - 1);
    if (depth === 0) {
      return './';
    }
    return '../'.repeat(depth);
  }

  // ========== 导航栏创建 ==========
  
  /**
   * 创建自定义顶部导航栏
   * 这是最优先的功能，必须确保在所有页面都能正常显示
   */
  function createNavbar() {
    try {
      const pathToRoot = calculatePathToRoot();
      
      const navbar = document.createElement('nav');
      navbar.className = 'mdbook-navbar';
      navbar.innerHTML = `
        <div class="navbar-left">
          <a href="${pathToRoot}index.html" class="navbar-brand">
            <span class="brand-name">TouriCN</span>
          </a>
        </div>
        <div class="navbar-right">
          <button class="nav-btn" id="custom-theme-toggle" aria-label="切换主题">
            <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button class="nav-btn" id="custom-search-btn" aria-label="搜索">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <a class="nav-btn" href="https://github.com/TouriCN/TouriCN.github.io" target="_blank" aria-label="GitHub 仓库" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      `;
      
      // 插入到 body 的最前面
      if (document.body.firstChild) {
        document.body.insertBefore(navbar, document.body.firstChild);
      } else {
        document.body.appendChild(navbar);
      }
      
      return navbar;
    } catch (e) {
      console.error('创建导航栏失败:', e);
      return null;
    }
  }

  // ========== 导航栏按钮绑定 ==========
  
  /**
   * 绑定导航栏按钮功能
   * 直接触发原生按钮，确保所有 mdBook 内部状态同步
   */
  function bindNavbarButtons() {
    try {
      // 搜索按钮
      const searchBtn = document.getElementById('custom-search-btn');
      
      if (searchBtn) {
        // 避免重复绑定
        if (!searchBtn.dataset.bound) {
          searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 直接通过 search-active 类判断状态，toggle 搜索
            if (isSearchActive()) {
              closeSearch();
            } else {
              openSearch();
            }
          });
          searchBtn.dataset.bound = 'true';
        }
      }
    } catch (e) {
      console.error('绑定导航栏按钮失败:', e);
    }
  }

  // ========== 搜索功能管理 ==========
  
  /**
   * 检查搜索是否处于激活状态
   * @returns {boolean}
   */
  function isSearchActive() {
    return document.body.classList.contains('search-active');
  }
  
  /**
   * 清除 URL 中的 search 参数
   */
  function clearSearchUrlParam() {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('search')) {
        url.searchParams.delete('search');
        window.history.replaceState({}, document.title, url.pathname + url.hash);
      }
    } catch (e) {
      // 忽略错误
    }
  }
  
  /**
   * 获取原生搜索按钮
   * @returns {HTMLElement|null}
   */
  function getNativeSearchToggle() {
    return document.getElementById('search-toggle') || 
           document.querySelector('.search-toggle') ||
           document.querySelector('[aria-label="搜索"]') ||
           document.querySelector('[title="搜索"]');
  }
  
  /**
   * 获取搜索框元素
   * @returns {HTMLElement|null}
   */
  function getSearchbar() {
    return document.getElementById('searchbar') || 
           document.querySelector('.searchbar') || 
           document.querySelector('input[type="search"]');
  }
  
  /**
   * 获取搜索结果外层容器元素
   * 只返回外层容器，避免对内层列表设置定位样式
   * @returns {HTMLElement|null}
   */
  function getSearchResults() {
    // 优先返回我们添加了自定义类的外层容器
    const customResults = document.querySelector('.custom-search-results');
    if (customResults) return customResults;
    
    // 其次返回 mdBook 标准的外层容器
    const outerResults = document.getElementById('searchresults-outer') || 
                         document.querySelector('.searchresults-outer');
    if (outerResults) return outerResults;
    
    // 最后兜底：返回 .searchresults，但需要注意这可能是内层列表
    // 如果只有内层列表，说明结构不同，需要谨慎处理
    return document.querySelector('.searchresults') || 
           document.getElementById('searchresults');
  }
  
  /**
   * 应用搜索框样式
   */
  function applySearchStyles() {
    try {
      const searchbar = getSearchbar();
      const results = getSearchResults();
      const toolbar = document.querySelector('.toolbar');
      
      // 隐藏工具栏
      if (toolbar) {
        toolbar.style.display = 'none';
        toolbar.style.visibility = 'hidden';
        toolbar.style.opacity = '0';
        toolbar.style.position = 'absolute';
        toolbar.style.left = '-9999px';
      }
      
      // 应用搜索框样式
      if (searchbar) {
        // 确保搜索框可见（使用 setProperty 设置 !important 覆盖 CSS 规则）
        searchbar.style.setProperty('display', 'block', 'important');
        searchbar.style.setProperty('visibility', 'visible', 'important');
        searchbar.style.setProperty('opacity', '1', 'important');
        
        // 位置和尺寸
        searchbar.style.position = 'fixed';
        searchbar.style.top = '70px';
        searchbar.style.left = '50%';
        searchbar.style.transform = 'translateX(-50%)';
        searchbar.style.width = '80%';
        searchbar.style.maxWidth = '600px';
        searchbar.style.zIndex = '9998';
        searchbar.style.float = 'none';
        searchbar.style.height = 'auto';
        searchbar.style.lineHeight = 'normal';
        searchbar.style.margin = '0';
        searchbar.style.boxSizing = 'border-box';
        
        // 外观
        searchbar.style.padding = '10px 16px';
        searchbar.style.borderRadius = '8px';
        searchbar.style.border = '1px solid #e5e7eb';
        searchbar.style.background = '#ffffff';
        searchbar.style.color = '#111827';
        searchbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        searchbar.style.fontSize = '14px';
        searchbar.style.outline = 'none';
        
        // 暗色主题适配
        if (document.body.classList.contains('dark-theme') || 
            document.documentElement.classList.contains('dark-theme')) {
          searchbar.style.border = '1px solid #2d2d2d';
          searchbar.style.background = '#1e1e1e';
          searchbar.style.color = '#e5e7eb';
        }
      }
      
      // 应用搜索结果样式
      if (results) {
        results.style.position = 'fixed';
        results.style.top = '120px';
        results.style.left = '50%';
        results.style.transform = 'translateX(-50%)';
        results.style.width = '80%';
        results.style.maxWidth = '600px';
        results.style.maxHeight = 'calc(100vh - 140px)';
        results.style.overflowY = 'auto';
        results.style.zIndex = '9997';
        results.style.background = '#ffffff';
        results.style.border = '1px solid #e5e7eb';
        results.style.borderRadius = '8px';
        results.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        results.style.padding = '12px';
        
        // 暗色主题适配
        if (document.body.classList.contains('dark-theme') || 
            document.documentElement.classList.contains('dark-theme')) {
          results.style.border = '1px solid #2d2d2d';
          results.style.background = '#1e1e1e';
        }
      }
      
    } catch (e) {
      console.error('应用搜索样式失败:', e);
    }
  }
  
  /**
   * 打开搜索
   */
  function openSearch() {
    try {
      const nativeToggle = getNativeSearchToggle();
      const searchbar = getSearchbar();
      
      // 添加激活状态
      document.body.classList.add('search-active');
      
      // 触发原生搜索按钮
      if (nativeToggle) {
        const ariaExpanded = nativeToggle.getAttribute('aria-expanded');
        if (ariaExpanded !== 'true') {
          nativeToggle.click();
        }
      }
      
      // 应用样式（延迟一下，等原生搜索框显示后）
      setTimeout(function() {
        applySearchStyles();
        if (searchbar) {
          searchbar.focus();
        }
      }, 50);
      
      // 再延迟一下，确保样式应用
      setTimeout(function() {
        applySearchStyles();
      }, 200);
      
    } catch (e) {
      console.error('打开搜索失败:', e);
    }
  }
  
  /**
   * 关闭搜索
   */
  function closeSearch() {
    try {
      const nativeToggle = getNativeSearchToggle();
      const searchbar = getSearchbar();
      
      // 移除激活状态
      document.body.classList.remove('search-active');
      
      // 清空搜索框并隐藏
      if (searchbar) {
        searchbar.value = '';
        searchbar.blur();
        // 确保搜索框隐藏（使用 setProperty 设置 !important 覆盖内联样式）
        searchbar.style.setProperty('display', 'none', 'important');
        searchbar.style.setProperty('visibility', 'hidden', 'important');
        searchbar.style.setProperty('opacity', '0', 'important');
      }
      
      // 触发原生搜索按钮关闭
      if (nativeToggle) {
        const ariaExpanded = nativeToggle.getAttribute('aria-expanded');
        if (ariaExpanded === 'true') {
          nativeToggle.click();
        }
      }
      
      // 清除 URL 参数
      clearSearchUrlParam();
      
    } catch (e) {
      console.error('关闭搜索失败:', e);
    }
  }
  
  /**
   * 绑定搜索关闭事件
   */
  function bindSearchCloseEvents() {
    try {
      // 避免重复绑定
      if (document.body.dataset.searchCloseBound) return;
      document.body.dataset.searchCloseBound = 'true';
      
      // ESC 键关闭
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isSearchActive()) {
          closeSearch();
        }
      });
      
      // 点击外部关闭
      document.addEventListener('click', function(e) {
        if (!isSearchActive()) return;
        
        const searchBtn = document.getElementById('custom-search-btn');
        const searchbar = getSearchbar();
        const results = getSearchResults();
        const nativeToggle = getNativeSearchToggle();
        
        // 检查点击的是否是搜索相关元素
        const isSearchRelated = 
          (searchBtn && searchBtn.contains(e.target)) ||
          (searchbar && searchbar.contains(e.target)) ||
          (results && results.contains(e.target)) ||
          (nativeToggle && nativeToggle.contains(e.target));
        
        if (!isSearchRelated) {
          closeSearch();
        }
      });
      
      // 注意：不再需要监听搜索框显示状态来反向同步 search-active 类
      // 因为现在是我们完全控制搜索的打开和关闭，search-active 类是唯一数据源
      // 避免了 MutationObserver 时序问题导致的搜索框无法显示的 bug
      
    } catch (e) {
      console.error('绑定搜索关闭事件失败:', e);
    }
  }
  
    // ========== 主题切换功能 ==========
  
  /**
   * 获取当前主题
   * @returns {string} 'light' | 'dark' | 'auto'
   */
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'auto';
  }
  
  /**
   * 应用主题
   * @param {string} theme - 'light' | 'dark' | 'auto'
   */
  function applyTheme(theme) {
    const body = document.body;
    const html = document.documentElement;
    
    // 移除所有主题类
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'light') {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    } else if (theme === 'dark') {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    }
    // auto 模式不添加任何类，让 CSS 的 prefers-color-scheme 生效
    
    // 更新主题切换按钮图标
    updateThemeToggleIcon(theme);
    
    // 同步 Giscus 评论区主题
    syncGiscusTheme(theme);
    
    // 保存到 localStorage
    if (theme !== 'auto') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }
  
  /**
   * 更新主题切换按钮的图标
   * @param {string} theme - 当前主题
   */
  function updateThemeToggleIcon(theme) {
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline-block';
    } else {
      sunIcon.style.display = 'inline-block';
      moonIcon.style.display = 'none';
    }
  }
  
  /**
   * 切换主题（亮色 <-> 暗色）
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    let newTheme;
    
    if (currentTheme === 'dark') {
      newTheme = 'light';
    } else if (currentTheme === 'light') {
      newTheme = 'dark';
    } else {
      // auto 模式下，根据系统主题决定切换到什么
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newTheme = prefersDark ? 'light' : 'dark';
    }
    
    applyTheme(newTheme);
  }
  
  /**
   * 同步 Giscus 评论区主题
   * @param {string} theme - 当前主题
   */
  function syncGiscusTheme(theme) {
    try {
      const giscusFrame = document.querySelector('iframe.giscus-frame');
      if (!giscusFrame) return;
      
      let giscusTheme = 'light';
      if (theme === 'dark') {
        giscusTheme = 'dark';
      } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        giscusTheme = prefersDark ? 'dark' : 'light';
      }
      
      // 通过 postMessage 通知 Giscus 切换主题
      giscusFrame.contentWindow.postMessage({
        giscus: {
          setConfig: {
            theme: giscusTheme
          }
        }
      }, 'https://giscus.app');
    } catch (e) {
      console.error('同步 Giscus 主题失败:', e);
    }
  }
  
  /**
   * 绑定主题切换按钮
   */
  function bindThemeToggle() {
    try {
      const themeBtn = document.getElementById('custom-theme-toggle');
      if (!themeBtn) return;
      
      if (!themeBtn.dataset.bound) {
        themeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        });
        themeBtn.dataset.bound = 'true';
      }
      
      // 监听系统主题变化（仅在 auto 模式下）
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
          const currentTheme = getCurrentTheme();
          if (currentTheme === 'auto') {
            updateThemeToggleIcon('auto');
            syncGiscusTheme('auto');
          }
        });
      }
    } catch (e) {
      console.error('绑定主题切换按钮失败:', e);
    }
  }
  
  // ========== 侧边栏外部链接修复 ==========
  
  /**
   * 修复侧边栏外部链接路径问题
   * 确保外部链接在子目录页面也能正确打开
   */
  function fixSidebarExternalLinks() {
    try {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;

      const links = sidebar.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // 情况1：已经是正确的外部链接（以 http:// 或 https:// 开头）
        if (href.startsWith('http://') || href.startsWith('https://')) {
          // 确保外部链接在新标签页打开
          if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
          return;
        }

        // 情况2：被错误处理的外部链接（包含 http:// 或 https:// 但不是以它们开头）
        // 比如可能被加上了相对路径前缀
        if (href.includes('http://') || href.includes('https://')) {
          const urlMatch = href.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            link.href = urlMatch[0];
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            return;
          }
        }

        // 情况3：看起来像是外部链接但缺少协议
        // 比如以 www. 开头，或者包含常见域名后缀
        if (href.startsWith('www.') || 
            href.includes('.com/') || href.includes('.org/') || 
            href.includes('.cn/') || href.includes('.net/') ||
            href.endsWith('.com') || href.endsWith('.org') ||
            href.endsWith('.cn') || href.endsWith('.net')) {
          link.href = 'https://' + href;
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    } catch (e) {
      console.error('修复侧边栏外部链接失败:', e);
    }
  }

  // ========== 字数统计和阅读时间 ==========
  
  /**
   * 添加字数统计和阅读时间信息
   */
  function addWordCountInfo() {
    try {
      const content = document.querySelector('.content') || document.querySelector('#content');
      if (!content) return;
      
      // 获取页面标题（h1）
      const pageTitle = document.querySelector('.page-title') || 
                        document.querySelector('.content h1') ||
                        document.querySelector('#content h1');
      if (!pageTitle) return;
      
      // 计算字数
      const text = content.innerText || content.textContent;
      // 移除空白字符
      const cleanText = text.replace(/\s/g, '');
      const wordCount = cleanText.length;
      
      // 计算阅读时间（按 400 字/分钟计算）
      const readingTime = Math.ceil(wordCount / 400);
      
      // 创建信息条
      const infoBar = document.createElement('div');
      infoBar.className = 'word-count-info';
      infoBar.innerHTML = `
        <div class="info-item">
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>${wordCount} 字</span>
        </div>
        <div class="info-item">
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>约 ${readingTime} 分钟阅读</span>
        </div>
      `;
      
      // 插入到页面标题后面
      pageTitle.parentNode.insertBefore(infoBar, pageTitle.nextSibling);
      
    } catch (e) {
      console.error('添加字数统计失败:', e);
    }
  }
  
  // ========== 板块式内容布局 ==========
  
  /**
   * 给每个 h2 标题及其内容包裹独立的板块容器
   */
  function wrapContentSections() {
    try {
      const content = document.querySelector('.content') || document.querySelector('#content');
      if (!content) return;
      
      // 获取内容区域的直接父元素（main或content本身）
      // 找到所有标题所在的直接容器
      const allHeadings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const headings = allHeadings.filter(h => !h.classList.contains('page-title'));
      
      if (headings.length === 0) return;
      
      // 找到标题的直接父元素（所有标题应该在同一个父元素中）
      const container = headings[0].parentElement;
      if (!container) return;
      
      // 获取容器的所有直接子元素
      const children = Array.from(container.children);
      
      // 栈：保存当前活跃的板块 { section, levelNum }
      const stack = [];
      
      // 遍历所有子元素
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        
        // 检查是否是标题元素
        const isHeading = /^H[1-6]$/.test(el.tagName) && !el.classList.contains('page-title');
        
        if (isHeading) {
          const level = el.tagName.toLowerCase();
          const levelNum = parseInt(level.substring(1));
          
          // 弹出栈中所有层级 >= 当前标题层级的板块
          while (stack.length > 0 && stack[stack.length - 1].levelNum >= levelNum) {
            stack.pop();
          }
          
          // 创建新的板块容器
          const section = document.createElement('div');
          section.className = `content-section heading-section ${level}-section`;
          
          // 把新板块插入到标题的位置
          container.insertBefore(section, el);
          
          // 如果栈不为空，把新板块移到栈顶板块中
          if (stack.length > 0) {
            stack[stack.length - 1].section.appendChild(section);
          }
          
          // 把标题移到新板块中
          section.appendChild(el);
          
          // 把新板块压入栈
          stack.push({ section, levelNum });
          
        } else {
          // 普通内容元素
          // 如果栈不为空，把元素移到栈顶板块中
          if (stack.length > 0) {
            stack[stack.length - 1].section.appendChild(el);
          }
          // 如果栈为空，保留原位
        }
      
      }
      
    } catch (e) {
      console.error('包裹内容板块失败:', e);
    }
  }
  // ========== 页面目录功能 ==========
  
  /**
   * 创建页面目录悬浮按钮和弹窗
   */
  function createPageToc() {
    try {
      // 避免重复创建
      if (document.querySelector('.pagetoc-float-btn')) return;
      
      const content = document.querySelector('.content');
      if (!content) return;

      // 提取页面标题（h1, h2 和 h3）
      const headings = content.querySelectorAll('h1, h2, h3');
      if (headings.length === 0) return;

      // 创建目录悬浮按钮
      const tocButton = document.createElement('button');
      tocButton.className = 'pagetoc-float-btn';
      tocButton.setAttribute('aria-label', '页面目录');
      tocButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      `;
      document.body.appendChild(tocButton);

      // 创建目录弹窗
      const tocPopup = document.createElement('div');
      tocPopup.className = 'pagetoc-popup';
      tocPopup.innerHTML = `
        <div class="pagetoc-popup-header">
          <span class="pagetoc-popup-title">目录</span>
          <button class="pagetoc-popup-close" aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="pagetoc-popup-content">
          <ul class="pagetoc-list"></ul>
        </div>
      `;
      document.body.appendChild(tocPopup);

      const tocList = tocPopup.querySelector('.pagetoc-list');
      const tocPopupContent = tocPopup.querySelector('.pagetoc-popup-content');

      // 生成目录项
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = 'heading-' + index;
        const li = document.createElement('li');
        li.className = 'pagetoc-item ' + heading.tagName.toLowerCase();
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // 点击后关闭弹窗
          closeTocPopup();
        });
        li.appendChild(a);
        tocList.appendChild(li);
      });

      // 创建高亮指示器（一个连续的背景框）
      const highlightIndicator = document.createElement('div');
      highlightIndicator.className = 'pagetoc-highlight-indicator';
      tocList.insertBefore(highlightIndicator, tocList.firstChild);

      // 更新高亮指示器的位置和大小
      let updateRAF = null;
      function updateHighlightIndicator() {
        // 使用 requestAnimationFrame 确保平滑更新
        if (updateRAF) {
          cancelAnimationFrame(updateRAF);
        }
        updateRAF = requestAnimationFrame(function() {
          const activeItems = tocList.querySelectorAll('.pagetoc-item a.active');
          if (activeItems.length === 0) {
            highlightIndicator.style.opacity = '0';
            return;
          }

          // 获取第一个和最后一个 active 项
          const firstItem = activeItems[0];
          const lastItem = activeItems[activeItems.length - 1];
          
          // 使用 offsetTop/offsetHeight 计算，更准确且不受视口位置影响
          // 注意：offsetTop 是相对于 offsetParent 的，这里 offsetParent 是 tocList
          const firstTop = firstItem.offsetTop;
          const lastTop = lastItem.offsetTop;
          const lastHeight = lastItem.offsetHeight;
          
          const top = firstTop;
          const height = lastTop + lastHeight - firstTop;

          // 更新指示器位置和大小
          highlightIndicator.style.top = top + 'px';
          highlightIndicator.style.height = height + 'px';
          highlightIndicator.style.opacity = '1';
        });
      }

      // 弹窗显示/隐藏状态
      let isPopupOpen = false;
      // 保存弹窗内容滚动位置
      let savedScrollTop = 0;
      // 是否是第一次打开
      let isFirstOpen = true;

      // 打开弹窗
      function openTocPopup() {
        tocPopup.classList.add('open');
        isPopupOpen = true;
        // 恢复滚动位置
        if (!isFirstOpen) {
          tocPopupContent.scrollTop = savedScrollTop;
        }
        isFirstOpen = false;
        // 弹窗打开后更新高亮指示器位置
        setTimeout(updateHighlightIndicator, 50);
      }

      // 关闭弹窗
      function closeTocPopup() {
        // 保存滚动位置
        savedScrollTop = tocPopupContent.scrollTop;
        tocPopup.classList.remove('open');
        isPopupOpen = false;
      }

      // 切换弹窗
      function toggleTocPopup() {
        if (isPopupOpen) {
          closeTocPopup();
        } else {
          openTocPopup();
        }
      }

      // 绑定按钮点击事件
      tocButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTocPopup();
      });

      // 绑定关闭按钮
      const closeBtn = tocPopup.querySelector('.pagetoc-popup-close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTocPopup();
      });

      // 点击弹窗外部关闭
      document.addEventListener('click', (e) => {
        if (isPopupOpen && !tocPopup.contains(e.target) && !tocButton.contains(e.target)) {
          closeTocPopup();
        }
      });

      // 阻止弹窗内部点击冒泡
      tocPopup.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // 滚动时自动高亮当前标题（所有可见标题同时高亮）
      const tocItems = tocList.querySelectorAll('.pagetoc-item a');
      
      // 根据标题ID获取对应的目录项
      function getTocItemByHeadingId(headingId) {
        return tocList.querySelector(`a[href="#${headingId}"]`);
      }
      
      // 设置单个标题的高亮状态
      function setHeadingActive(headingId, isActive) {
        const item = getTocItemByHeadingId(headingId);
        if (item) {
          if (isActive) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }
        // 更新高亮指示器
        updateHighlightIndicator();
      }
      
      // 检查浏览器是否支持 IntersectionObserver
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            // 标题进入视口就高亮，离开就取消高亮
            setHeadingActive(entry.target.id, entry.isIntersecting);
          });
        }, { 
          rootMargin: '0px 0px 0px 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        headings.forEach(heading => observer.observe(heading));
        
        // 兜底：添加 scroll 事件监听，确保高亮始终正确
        let scrollTimeout;
        window.addEventListener('scroll', function() {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            headings.forEach(heading => {
              const rect = heading.getBoundingClientRect();
              // 判断标题是否在视口范围内（考虑一定的边距）
              const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
              setHeadingActive(heading.id, isVisible);
            });
          }, 50);
        }, { passive: true });
      }

      // 弹窗内容滚动时更新高亮指示器位置
      let contentScrollTimeout;
      tocPopupContent.addEventListener('scroll', function() {
        clearTimeout(contentScrollTimeout);
        contentScrollTimeout = setTimeout(function() {
          updateHighlightIndicator();
        }, 30);
      }, { passive: true });

      // 窗口大小变化时更新高亮指示器位置
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          updateHighlightIndicator();
        }, 100);
      });

      // 暴露关闭函数供外部使用
      window.__closeTocPopup = closeTocPopup;
    } catch (e) {
      console.error('创建页面目录失败:', e);
    }
  }

  // ========== 初始化 ==========
  
  /**
   * 主初始化函数
   * 按优先级执行：导航栏 > 按钮绑定 > 外部链接修复 > 页面目录
   */
  /**
   * 移动工具栏到 body 中，避免被 header 隐藏
   */
  function moveToolbarToBody() {
    try {
      const toolbar = document.querySelector('.toolbar');
      const searchbar = document.getElementById('searchbar');
      const searchresults = document.getElementById('searchresults-outer') || document.querySelector('.searchresults');
      
      // 如果工具栏存在，并且不在 body 的直接子元素中，就移动它
      if (toolbar && toolbar.parentElement !== document.body) {
        // 添加自定义类名
        toolbar.classList.add('custom-search-toolbar');
        // 移动到 body 中
        document.body.appendChild(toolbar);
      }
      
      // 同样处理搜索框（可能在 menu-bar 中被隐藏）
      if (searchbar && searchbar.parentElement !== document.body) {
        searchbar.classList.add('custom-searchbar');
        document.body.appendChild(searchbar);
      }
      
      // 同样处理搜索结果
      if (searchresults && searchresults.parentElement !== document.body) {
        searchresults.classList.add('custom-search-results');
        document.body.appendChild(searchresults);
      }
    } catch (e) {
      console.error('移动工具栏失败:', e);
    }
  }

  // ========== 顶栏遮挡修复 ==========
  
  /**
   * 修复顶栏遮挡侧边栏和内容的问题
   * 最简单可靠的方法：直接给 body 添加 padding-top，让所有内容整体下移
   */
  function fixTopbarOverlap() {
    try {
      const navbarHeight = 60; // 顶栏高度
      const spacing = 40; // 额外间距
      const totalOffset = navbarHeight + spacing; // 总偏移量 100px
      
      // 导航栏是 sticky 定位，本身会占据文档流空间，不需要额外的 padding-top
      // document.body.style.paddingTop = totalOffset + 'px';
      document.body.style.boxSizing = 'border-box';
      
      // 确保 html 和 body 的高度正确
      document.documentElement.style.height = '100%';
      document.body.style.minHeight = '100%';
      document.body.style.height = 'auto';
      
      // ========== 修复主内容区位置 ==========
      // 如果主内容区是 fixed/absolute 定位，它不会随 body padding 下移，需要单独设置 top
      const bookBody = document.querySelector('.book-body') ||
                       document.querySelector('.body-inner') ||
                       document.querySelector('.page-wrapper') ||
                       document.querySelector('.page-inner') ||
                       document.querySelector('.content');
      
      if (bookBody) {
        const bodyPosition = window.getComputedStyle(bookBody).position;
        if (bodyPosition === 'fixed' || bodyPosition === 'absolute') {
          // fixed/absolute 定位的主内容区需要单独设置 top，紧挨着顶栏底部
          bookBody.style.top = navbarHeight + 'px';
          // 调整高度，避免底部被截断
          bookBody.style.height = 'calc(100vh - ' + navbarHeight + 'px)';
          bookBody.style.maxHeight = 'calc(100vh - ' + navbarHeight + 'px)';
        }
        // 确保 box-sizing 正确
        bookBody.style.boxSizing = 'border-box';
      }
      
      // 给内容区域添加顶部内边距，避免文字太靠顶部
      const page = document.querySelector('.page') ||
                   document.querySelector('.page-inner');
      if (page) {
        page.style.paddingTop = spacing + 'px';
        page.style.boxSizing = 'border-box';
      }
      
      // ========== 修复侧边栏位置 ==========
      // 如果侧边栏是 fixed 定位，它不会随 body padding 下移，需要单独设置 top
      const sidebar = document.getElementById('sidebar') || 
                      document.querySelector('.sidebar') ||
                      document.querySelector('.book-summary') ||
                      document.querySelector('aside');
      
      if (sidebar) {
        const sidebarPosition = window.getComputedStyle(sidebar).position;
        if (sidebarPosition === 'fixed' || sidebarPosition === 'absolute') {
          // fixed/absolute 定位的侧边栏需要单独设置 top，紧挨着顶栏底部
          sidebar.style.top = navbarHeight + 'px';
          // 调整高度，避免底部被截断
          sidebar.style.height = 'calc(100vh - ' + navbarHeight + 'px)';
          sidebar.style.maxHeight = 'calc(100vh - ' + navbarHeight + 'px)';
        }
        // 确保 box-sizing 正确
        sidebar.style.boxSizing = 'border-box';
      }
      
      // 修复侧边栏内部滚动容器
      const scrollbox = document.querySelector('.sidebar-scrollbox');
      if (scrollbox) {
        scrollbox.style.height = '100%';
        scrollbox.style.maxHeight = '100%';
        scrollbox.style.boxSizing = 'border-box';
      }
      
      // ========== 锚点跳转偏移 ==========
      // 给所有标题添加 scroll-margin-top，确保锚点跳转时不会被顶栏挡住
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(function(heading) {
        heading.style.scrollMarginTop = totalOffset + 'px';
      });
      
      // ========== 移动端适配 ==========
      function applyMobileStyles() {
        if (window.innerWidth <= 768) {
          const mobileNavbarHeight = 50;
          const mobileSpacing = 25;
          const mobileTotalOffset = mobileNavbarHeight + mobileSpacing; // 75px
          
          // 导航栏是 sticky 定位，本身会占据文档流空间，不需要额外的 padding-top
          // document.body.style.paddingTop = mobileTotalOffset + 'px';
          
          if (bookBody) {
            const bodyPosition = window.getComputedStyle(bookBody).position;
            if (bodyPosition === 'fixed' || bodyPosition === 'absolute') {
              bookBody.style.top = mobileNavbarHeight + 'px';
              bookBody.style.height = 'calc(100vh - ' + mobileNavbarHeight + 'px)';
              bookBody.style.maxHeight = 'calc(100vh - ' + mobileNavbarHeight + 'px)';
            }
          }
          
          // 移动端内容区域顶部内边距
          if (page) {
            page.style.paddingTop = mobileSpacing + 'px';
          }
          
          if (sidebar) {
            const sidebarPosition = window.getComputedStyle(sidebar).position;
            if (sidebarPosition === 'fixed' || sidebarPosition === 'absolute') {
              sidebar.style.top = mobileNavbarHeight + 'px';
              sidebar.style.height = 'calc(100vh - ' + mobileNavbarHeight + 'px)';
              sidebar.style.maxHeight = 'calc(100vh - ' + mobileNavbarHeight + 'px)';
            }
          }
          
          headings.forEach(function(heading) {
            heading.style.scrollMarginTop = mobileTotalOffset + 'px';
          });
        } else {
          // 导航栏是 sticky 定位，本身会占据文档流空间，不需要额外的 padding-top
          // document.body.style.paddingTop = totalOffset + 'px';
          
          if (bookBody) {
            const bodyPosition = window.getComputedStyle(bookBody).position;
            if (bodyPosition === 'fixed' || bodyPosition === 'absolute') {
              bookBody.style.top = navbarHeight + 'px';
              bookBody.style.height = 'calc(100vh - ' + navbarHeight + 'px)';
              bookBody.style.maxHeight = 'calc(100vh - ' + navbarHeight + 'px)';
            }
          }
          
          // 桌面端内容区域顶部内边距
          if (page) {
            page.style.paddingTop = spacing + 'px';
          }
          
          if (sidebar) {
            const sidebarPosition = window.getComputedStyle(sidebar).position;
            if (sidebarPosition === 'fixed' || sidebarPosition === 'absolute') {
              sidebar.style.top = navbarHeight + 'px';
              sidebar.style.height = 'calc(100vh - ' + navbarHeight + 'px)';
              sidebar.style.maxHeight = 'calc(100vh - ' + navbarHeight + 'px)';
            }
          }
          
          headings.forEach(function(heading) {
            heading.style.scrollMarginTop = totalOffset + 'px';
          });
        }
      }
      
      // 初始应用
      applyMobileStyles();
      
      // 窗口大小变化时重新应用
      window.addEventListener('resize', applyMobileStyles);
      
    } catch (e) {
      console.error('修复顶栏遮挡失败:', e);
    }
  }

  function init() {
    // 防止重复执行
    if (window.__pagetocInited) return;
    window.__pagetocInited = true;
    // 0. 先移动工具栏，避免被 header 隐藏
    moveToolbarToBody();
    
    // 1. 首先创建导航栏（最优先）
    const navbar = createNavbar();
    
    // 2. 修复顶栏遮挡问题
    fixTopbarOverlap();
    
    // 3. 绑定导航栏按钮功能
    bindNavbarButtons();
    
    // 3. 绑定搜索关闭事件
    bindSearchCloseEvents();
    
    // 4. 绑定主题切换按钮
    bindThemeToggle();
    
    // 4. 应用保存的主题（必须在导航栏创建之后，因为需要更新图标）
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);
    
    // 5. 修复侧边栏外部链接
    fixSidebarExternalLinks();
    
    // 5.5 包裹内容板块（给每个 h2 标题及其内容添加独立的板块容器）
    wrapContentSections();
    
    // 5.6 添加字数统计和阅读时间
    addWordCountInfo();
    
    // 6. 创建页面目录
    createPageToc();
    
    // 7. 使用 MutationObserver 确保 mdBook 动态渲染后也能绑定成功
    try {
      const domObserver = new MutationObserver(function() {
        // 确保工具栏在 body 中
        moveToolbarToBody();
        bindNavbarButtons();
        bindSearchCloseEvents();
        bindThemeToggle();
        fixSidebarExternalLinks();
        // Giscus 可能是动态加载的，需要重新同步主题
        syncGiscusTheme(getCurrentTheme());
      });
      
      domObserver.observe(document.body, { childList: true, subtree: true });
      
      // 一段时间后停止观察，避免性能问题
      setTimeout(function() {
        domObserver.disconnect();
      }, 5000);
    } catch (e) {
      console.error('创建 MutationObserver 失败:', e);
    }
    
    // 8. 兜底：多次尝试，确保所有功能都能正常工作
    setTimeout(function() {
      moveToolbarToBody();
      fixTopbarOverlap();
      bindNavbarButtons();
      bindThemeToggle();
      fixSidebarExternalLinks();
      createPageToc();
      syncGiscusTheme(getCurrentTheme());
    }, 1000);
    
    setTimeout(function() {
      moveToolbarToBody();
      fixTopbarOverlap();
      bindNavbarButtons();
      bindThemeToggle();
      fixSidebarExternalLinks();
      syncGiscusTheme(getCurrentTheme());
    }, 3000);
    
    // Giscus 可能加载较慢，再延迟一段时间同步一次
    setTimeout(function() {
      syncGiscusTheme(getCurrentTheme());
    }, 5000);
    
  }

  // 确保在 DOMContentLoaded 之前或之后都能正确执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 如果 DOM 已经准备好，立即执行
    init();
  }
  
  // 额外保障：即使 DOMContentLoaded 已经触发，也再执行一次
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // 延迟一点执行，确保 body 可用
    if (document.body) {
      init();
    } else {
      setTimeout(init, 0);
    }
  }

})();
