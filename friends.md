---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
titleTemplate: 友谊链接

hero:
  name: "友谊链接"
  text: "这里是一些我的友人。"
  tagline: 你们可以去看看他们。的网站。<br>可以在评论区分享自己的网站。我看到了会去看一下。如果你在友谊链接处加了我的网站的话，我会考虑交朋友。并且把你的网站也加在这里。


features:
  - title: 正仪芷汐
    details: 念及于此，正仪芷汐
    link: https://www.zyzhixi.com
    linkText: 点击进入
    icon: <img src="https://vip.123pan.cn/1813719654/yk6baz03t0l000dcjlwaksxm7yto9jfrDIYPDwUPBIQyAcxyAwJx.jpg">
  - title: Realite and Lord
    details: 真实与正主
    link: https://realityandlord.net
    linkText: 点击进入
    icon: <img src="https://realityandlord.net/wp-content/uploads/2026/03/cropped-TRUTH.png">
  - title: BlackArea
    details: 黑域
    link: https://wiki.yddns.top/mediawiki/index.php?title=Main_Page
    linkText: 点击进入
    icon: <img src="https://wiki.yddns.top/mediawiki/resources/assets/Black Area.jpg">
---
## 评论区

<div class="giscus-container"></div>

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

onMounted(() => {
  // 动态插脚本，确保只在 client 侧执行，避开 SSR 静默失败
  const s = document.createElement('script')
  s.src = 'https://giscus.app/client.js'
  s.setAttribute('data-repo', 'TouriCN/touricn.github.io')
  s.setAttribute('data-repo-id', 'R_kgDOTckHqw')
  s.setAttribute('data-category', 'Announcements')
  s.setAttribute('data-category-id', 'DIC_kwDOTckHq84DBhgW')
  s.setAttribute('data-mapping', 'pathname')
  s.setAttribute('data-strict', '0')
  s.setAttribute('data-reactions-enabled', '1')
  s.setAttribute('data-emit-metadata', '0')
  s.setAttribute('data-input-position', 'top')
  s.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  s.setAttribute('data-lang', 'zh-CN')
  s.setAttribute('crossorigin', 'anonymous')
  s.async = true
  document.querySelector('.giscus-container').appendChild(s)

  // 监听 VitPress 主题切换，同步给 giscus
  watch(isDark, (dark) => {
    const iframe = document.querySelector('.giscus-frame')
    if (!iframe) return
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: dark ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  })
})
</script>

<style scoped>
.giscus-container {
  margin-top: 40px;
}
:global(.giscus-frame) {
  width: 100% !important;
  border: none;
}
</style>