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
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="#00AEEC"/><line x1="8" y1="11" x2="11" y2="14" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="11" x2="13" y2="14" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="3.5" x2="10" y2="6" stroke="#00AEEC" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="3.5" x2="14" y2="6" stroke="#00AEEC" stroke-width="2.5" stroke-linecap="round"/></svg>'
        },
        link: 'https://space.bilibili.com/3546574053443664',
        ariaLabel: 'Bilibili Space'
      },
      {
        icon: 'mail',
        link: 'mailto:linyaovo20141128@qq.com',
        ariaLabel: 'Email'
      },
    ],
  },
})
