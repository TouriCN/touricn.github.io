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
      { text: '主页', link: '/' }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TouriCN/touricn.github.io' },
    ],
  },
})
