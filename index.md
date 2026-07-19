# TouriCN
欢迎来到TouriCN！
<br><br>
该站点会发布一些好东西。
# 站点信息

<script setup>
// 读取全局注入的站点信息
const siteInfo = __SITE_INFO__
</script>

| 构建时间 | 提交者 | 提交信息 | 提交哈希 | 文件数 | 总字数 | 每文件平均字数 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| {{ siteInfo.buildTime }} | {{ siteInfo.author }} | {{ siteInfo.msg }} | {{ siteInfo.hash }} | {{ siteInfo.files }} | {{ siteInfo.totalWords }} | {{ siteInfo.avgWords }} |
 