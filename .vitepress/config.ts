import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TouriCN',
  description: '神秘的站点。',
  base: '/',           
  outDir: '.vitepress/dist',

  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
    ],
    sidebar: [
      { text: '主页', link: '/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TouriCN/touricn.github.io' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="#FF8EB3" d="M512 138.667c-205.866 0-373.333 167.467-373.333 373.333s167.467 373.333 373.333 373.333 373.333-167.467 373.333-373.333-167.467-373.333-373.333-373.333zM384 469.333c-23.466 0-42.667 19.2-42.667 42.667s19.2 42.667 42.667 42.667 42.667-19.2 42.667-42.667-19.2-42.667-42.667-42.667zM640 469.333c-23.466 0-42.667 19.2-42.667 42.667s19.2 42.667 42.667 42.667 42.667-19.2 42.667-42.667-19.2-42.667-42.667-42.667zM512 768c-70.4 0-131.2-44.8-153.6-106.667h307.2C643.2 723.2 582.4 768 512 768z"/></svg>'
        },
        link: 'https://space.bilibili.com/3546574053443664',
        ariaLabel: 'Bilibili Space'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
        },
        link: 'mailto:linyaovo20141128@qq.com',
        ariaLabel: 'Email'
      },
    ],
  },
})
