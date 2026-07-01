import os
import re
import markdown

SRC_DIR = "src"

def preprocess_github_admonitions(md_content):
    """
    把 GitHub 风格 > [!TIP] 转成 pymdownx.admonition 认的 !!! tip 格式
    用逐行状态机，比正则吞块稳
    """
    lines = md_content.split('\n')
    result = []
    i = 0
    n = len(lines)
    
    while i < n:
        line = lines[i]
        # 匹配 > [!TYPE]
        m = re.match(r'^> \[!([A-Za-z]+)\]', line)
        if m and line.strip() == f'> [!{m.group(1)}]':
            admon_type = m.group(1).lower()
            i += 1
            # 收集后续 > 开头的行，转成缩进 4 格给 !!! 用
            body_lines = []
            while i < n and (lines[i].startswith('> ') or lines[i] == '>'):
                # 去掉开头的 '> ' 或 '>'
                stripped = lines[i][2:] if lines[i].startswith('> ') else lines[i][1:]
                body_lines.append('    ' + stripped)
                i += 1
            # 输出 !!! tip 格式（pymdownx.admonition 认）
            result.append(f'!!! {admon_type}')
            result.extend(body_lines)
            result.append('')  # 空行分隔
        else:
            result.append(line)
            i += 1
    
    return '\n'.join(result)


def compile_markdown():
    os.makedirs(SRC_DIR, exist_ok=True)
    
    for filename in os.listdir(SRC_DIR):
        if filename.endswith(".md"):
            md_path = os.path.join(SRC_DIR, filename)
            html_filename = filename.replace(".md", ".html")
            html_path = html_filename

            with open(md_path, "r", encoding="utf-8") as f:
                md_content = f.read()

            processed_md = preprocess_github_admonitions(md_content)

            html_body = markdown.markdown(
                processed_md,
                extensions=[
                    'markdown.extensions.tables',
                    'markdown.extensions.fenced_code',
                    'markdown.extensions.nl2br',
                    'markdown.extensions.sane_lists',
                    'pymdownx.admonition',      # ✅ 认 !!! tip 语法
                ]
            )

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
            --admonition-bg: rgba(128, 128, 128, 0.08);
        }}

        body {{
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                         Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
                         "Helvetica Neue", sans-serif;
            line-height: 1.6;
            background: var(--bg);
            color: var(--text);
            transition: background 0.2s, color 0.2s;
        }}

        :root[data-theme="browser"] {{
            --bg: Canvas;
            --text: CanvasText;
            --border: CanvasText;
            --admonition-bg: rgba(128, 128, 128, 0.08);
        }}

        :root[data-theme="system"] {{}}

        @media (prefers-color-scheme: dark) {{
            :root[data-theme="system"] {{
                --bg: #0d1117;
                --text: #e6edf3;
                --border: #e6edf3;
                --admonition-bg: rgba(230, 237, 243, 0.08);
            }}
        }}

        :root[data-theme="dark"] {{
            --bg: #000;
            --text: #e6edf3;
            --border: #e6edf3;
            --admonition-bg: rgba(230, 237, 243, 0.08);
        }}

        table {{
            border-collapse: collapse;
            margin: 1em 0;
        }}

        th, td {{
            border: 1px solid var(--border);
            padding: 6px 10px;
        }}

        pre, code {{
            background: rgba(128,128,128,0.15);
            padding: 2px 6px;
            border-radius: 4px;
        }}

        blockquote {{
            margin: 1em 0;
            padding: 10px 15px;
            border-left: 4px solid var(--border);
            background: var(--admonition-bg);
        }}

        blockquote p:first-child strong {{
            display: block;
            margin-bottom: 6px;
        }}

        /* ✅ pymdownx.admonition 生成的 class */
        .admonition {{
            border-left: 4px solid var(--border);
            padding: 10px 15px;
            margin: 1em 0;
            background: var(--admonition-bg);
        }}

        .admonition .admonition-title {{
            font-weight: bold;
            margin-bottom: 6px;
            color: var(--text);
        }}

        .admonition.tip {{ border-left-color: #238636; }}
        .admonition.warning {{ border-left-color: #9e6a03; }}
        .admonition.note {{ border-left-color: #0969da; }}

        .theme-switcher {{
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999;
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 4px 8px;
            font-size: 14px;
            cursor: pointer;
            color: var(--text);
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }}

        .theme-switcher option {{
            background: var(--bg);
            color: var(--text);
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
        const switcher = document.getElementById('themeSwitcher');
        const root = document.documentElement;

        function applyTheme(theme) {{
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            switcher.value = theme;
            switcher.style.display = 'none';
            switcher.offsetHeight;
            switcher.style.display = 'block';
        }}

        const saved = localStorage.getItem('theme');
        if (saved) {{
            applyTheme(saved);
        }} else {{
            applyTheme('system');
        }}

        switcher.addEventListener('change', e => {{ applyTheme(e.target.value); }});

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {{
            const current = localStorage.getItem('theme');
            if (!current || current === 'system') applyTheme('system');
        }});
    </script>
</body>
</html>
"""

            with open(html_path, "w", encoding="utf-8") as f:
                f.write(full_html)
            print(f"Compiled {md_path} -> {html_path}")

if __name__ == "__main__":
    compile_markdown()
