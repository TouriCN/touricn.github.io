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
          svg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSI0IiB5PSI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMEFFRUMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI4IiB5MT0iMTEiIHgyPSIxMSIgeTI9IjE0IiBzdHJva2U9IiMwMEFFRUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjE2IiB5MT0iMTEiIHgyPSIxMyIgeTI9IjE0IiBzdHJva2U9IiMwMEFFRUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjkiIHkxPSIzLjUiIHgyPSIxMCIgeTI9IjYiIHN0cm9rZT0iIzAwQUVFQyIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxNSIgeTE9IjMuNSIgeDI9IjE0IiB5Mj0iNiIgc3Ryb2tlPSIjMDBBRUVDIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+'
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
