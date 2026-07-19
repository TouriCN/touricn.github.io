import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TouriCN',
  description: '神秘的站点。',
  lang: 'zh-CN',
  base: '/',
  outDir: '.vitepress/dist',

  // 核心：把Workflow统计的环境变量注入为全局常量，供主页调用
  define: {
    __SITE_INFO__: {
      hash: process.env.SITE_HASH || 'N/A',
      author: process.env.SITE_AUTHOR || 'N/A',
      msg: process.env.SITE_MSG || 'N/A',
      buildTime: process.env.SITE_BUILD_TIME || 'N/A',
      files: Number(process.env.SITE_FILES) || 0,
      totalWords: Number(process.env.SITE_TOTAL_WORDS) || 0,
      avgWords: Number(process.env.SITE_AVG_WORDS) || 0,
    },
  },

  search: {
    provider: 'local',
    options: {
      translations: {
        button: { buttonText: '搜索', placeholder: '搜索文档...' },
        modal: {
          displayDetails: '显示详情',
          resetButtonTitle: '重置搜索',
          noResultsText: '没有找到相关结果。',
          footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
        },
      },
    },
  },

  themeConfig: {
    nav: [{ text: '主页', link: '/' }],
    sidebar: [{ text: '主页', link: '/' }],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TouriCN/touricn.github.io' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="#00AEEC" stroke-width="1.8"/><line x1="9" y1="3.5" x2="10" y2="6" stroke="#00AEEC" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="3.5" x2="14" y2="6" stroke="#00AEEC" stroke-width="2" stroke-linecap="round"/><line x1="7.5" y1="13" x2="10" y2="11" stroke="#00AEEC" stroke-width="1.5" stroke-linecap="round"/><line x1="16.5" y1="13" x2="14" y2="11" stroke="#00AEEC" stroke-width="1.5" stroke-linecap="round"/></svg>'
        },
        link: 'https://space.bilibili.com/3546574053443664',
        ariaLabel: 'Bilibili Space',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>'
        },
        link: 'mailto:linyaovo20141128@qq.com',
        ariaLabel: 'Email',
      },
    ],
  },
})
