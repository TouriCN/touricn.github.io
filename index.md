# TouriCN
欢迎来到TouriCN！
<br><br>
该站点会发布一些好东西。<br>
试图打开右上角的三条杠来查看这里的一切。
# 留言板
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