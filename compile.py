import os
import re
import markdown

SRC_DIR = "src"

def preprocess_github_admonitions(md_content):
    """
    把 GitHub 的 > [!TIP] 直接转成纯 HTML
    不依赖任何第三方扩展
    """
    lines = md_content.split('\n')
    result = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # 匹配 > [!TIP] 这种格式
        if stripped.startswith('> [!') and stripped.endswith(']'):
            match = re.search(r'\[!([A-Z]+)\]', stripped)
            if match:
                admon_type = match.group(1).lower()
                title = match.group(1)
                i += 1

                # 收集内容
                body_parts = []
                while i < n and lines[i].strip().startswith('>'):
                    content = lines[i].strip()
                    if content.startswith('> '):
                        content = content[2:]
                    elif content.startswith('>'):
                        content = content[1:]
                    if content:  # 忽略空行
                        body_parts.append(content)
                    i += 1

                body = ' '.join(body_parts)
                # 直接输出 HTML
                result.append(f'<div class="admonition {admon_type}">')
                result.append(f'  <div class="admonition-title">{title}</div>')
                result.append(f'  <div>{body}</div>')
                result.append('</div>')
                result.append('')  # 空行
            else:
                result.append(line)
                i += 1
        else:
            result.append(line)
            i += 1

    return '\n'.join(result)

def compile_markdown():
    os.makedirs(SRC_DIR, exist_ok=True)
    
    for filename in os.listdir(SRC_DIR):
        if not filename.endswith(".md"):
            continue
            
        md_path = os.path.join(SRC_DIR, filename)
        html_filename = filename.replace(".md", ".html")
        html_path = html_filename

        try:
            with open(md_path, "r", encoding="utf-8") as f:
                md_content = f.read()

            # 预处理提示框
            processed_md = preprocess_github_admonitions(md_content)

            # 只用最基础的 Markdown 扩展，不碰 pymdownx
            html_body = markdown.markdown(
                processed_md,
                extensions=[
                    'markdown.extensions.tables',
                    'markdown.extensions.fenced_code',
                    'markdown.extensions.nl2br',
                    'markdown.extensions.sane_lists',
                ]
            )

            # 完整 HTML 模板
            full_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{filename.replace('.md', '')}</title>
    <style>
        :root {{
            color-scheme: light dark;
            --bg: Canvas;
            --text: CanvasText;
            --border: CanvasText;
        }}
        body {{
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            background: var(--bg);
            color: var(--text);
        }}
        table {{ border-collapse: collapse; margin: 1em 0; }}
        th, td {{ border: 1px solid var(--border); padding: 6px 10px; }}
        pre, code {{ background: rgba(128,128,128,0.15); padding: 2px 6px; border-radius: 4px; }}
        blockquote {{ margin: 1em 0; padding: 10px 15px; border-left: 4px solid var(--border); background: rgba(128,128,128,0.08); }}
        .admonition {{ border-left: 4px solid var(--border); padding: 10px 15px; margin: 1em 0; background: rgba(128,128,128,0.08); }}
        .admonition-title {{ font-weight: bold; margin-bottom: 6px; }}
        .theme-switcher {{
            position: fixed; top: 10px; right: 10px; z-index: 999;
            background: var(--bg); border: 1px solid var(--border);
            padding: 4px 8px; font-size: 14px; cursor: pointer; color: var(--text);
        }}
    </style>
</head>
<body>
    <select class="theme-switcher" id="themeSwitcher">
        <option value="system">跟随系统</option>
        <option value="browser">浏览器默认</option>
        <option value="dark">黑色</option>
    </select>
    {html_body}
    <script>
        const s = document.getElementById('themeSwitcher'), r = document.documentElement;
        function setTheme(t) {{ r.setAttribute('data-theme', t); localStorage.setItem('theme', t); s.value = t; }}
        setTheme(localStorage.getItem('theme') || 'system');
        s.onchange = e => setTheme(e.target.value);
    </script>
</body>
</html>"""

            with open(html_path, "w", encoding="utf-8") as f:
                f.write(full_html)
            print(f"✅ Compiled {md_path}")

        except Exception as e:
            print(f"❌ FAILED {md_path}: {e}")
            raise

if __name__ == "__main__":
    compile_markdown()
