import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TouriCN',
  description: '神秘的站点。',
  base: '/',
  outDir: '.vitepress/dist',
  themeConfig: {
    nav: [{ text: '主页', link: '/' }],
    sidebar: [{ text: '主页', link: '/' }],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TouriCN/touricn.github.io' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="#00AEEC" stroke-width="2"/><line x1="8" y1="11" x2="11" y2="14" stroke="#00AEEC" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="11" x2="13" y2="14" stroke="#00AEEC" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="3.5" x2="10" y2="6" stroke="#00AEEC" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="3.5" x2="14" y2="6" stroke="#00AEEC" stroke-width="2.5" stroke-linecap="round"/></svg>'
        },
        link: 'https://space.bilibili.com/3546574053443664',
        ariaLabel: 'Bilibili Space'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>'
        },
        link: 'mailto:linyaovo20141128@qq.com',
        ariaLabel: 'Email'
      },
    ],
  },
})
