import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar'

export default defineConfig({
  title: 'TouriCN',
  description: '神秘的站点。',
  lang: 'zh-CN',
  base: '/',
  srcDir: '.',
  outDir: '.vitepress/dist',
  i18n: {
    locales: {
      'zh-CN': {
        label: '简体中文',
        title: 'TouriCN',
        description: '神秘的站点。',
        search: {
          button: { buttonText: '搜索', placeholder: '搜索文档...' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '重置搜索',
            noResultsText: '没有找到相关结果。',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  },
  search: {
    provider: 'local',
    options: {
      placeholder: '搜索文档...'
    }
  },
  vite: {
    plugins: [
      AutoSidebar({
        titleFromFile: true,
        path: '.',
        ignoreList: [
          'README.md',
          '.vitepress/',
          '.github/',
          'node_modules/',
          '*.html'
        ],
        collapsed: true
      })
    ]
  },
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '文章', link: '/posts' },
      { text: '工具', link: '/tools' } 
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TouriCN/touricn.github.io' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="#FB7299" stroke-width="1.8"/><line x1="8.5" y1="3" x2="9.5" y2="6" stroke="#FB7299" stroke-width="2" stroke-linecap="round"/><line x1="15.5" y1="3" x2="14.5" y2="6" stroke="#FB7299" stroke-width="2" stroke-linecap="round"/><line x1="7.5" y1="11.5" x2="10" y2="10.5" stroke="#FB7299" stroke-width="1.5" stroke-linecap="round"/><line x1="14" y1="10.5" x2="16.5" y2="11.5" stroke="#FB7299" stroke-width="1.5" stroke-linecap="round"/><path d="M10 14.2 L11 15 L12 14.2 L13 15 L14 14.2" stroke="#FB7299" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
        },
        link: 'https://space.bilibili.com/3546574053443664',
        ariaLabel: 'Bilibili Space'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>'
        },
        link: 'mailto:linyaovo20141128@qq.com',
        ariaLabel: 'Email'
      }
    ],
    editLink: {
      pattern: 'https://github.com/TouriCN/touricn.github.io/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },
    darkModeSwitchLabel: '外观',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    externalLinkIcon: true,
    lastUpdatedText: '最后更新',
    outlineTitle: '页面导航'
  }
  sitemap: {
    hostname: "https://touricn.github.io",
  },
})
