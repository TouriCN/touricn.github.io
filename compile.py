import os
import re
import markdown

SRC_DIR = "src"

def preprocess_github_admonitions(md_content):
    """将 GitHub 风格的 > [!TIP] 转换为自定义 HTML 结构"""
    pattern = r'^> \[!([A-Z]+)\]\n(.*?)(?=\n\n|\Z)'
    
    def replace_match(match):
        admonition_type = match.group(1).lower()
        content = match.group(2)
        
        lines = content.split('\n')
        cleaned_lines = []
        for line in lines:
            if line.startswith('> '):
                cleaned_lines.append(line[2:])
            elif line.startswith('>'):
                cleaned_lines.append(line[1:])
            else:
                cleaned_lines.append(line)
        
        clean_content = '\n'.join(cleaned_lines)
        
        return f'<div class="admonition {admonition_type}">\n<div class="admonition-title">{admonition_type.upper()}</div>\n{clean_content}\n</div>'

    result = re.sub(pattern, replace_match, md_content, flags=re.MULTILINE | re.DOTALL)
    return result

def compile_markdown():
    os.makedirs(SRC_DIR, exist_ok=True)
    
    for filename in os.listdir(SRC_DIR):
        if filename.endswith(".md"
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
            
            /* ✅ 定义主题变量 */
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

        :root[data-theme="system"] {{
            /* 跟随系统，不覆盖变量 */
        }}

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
            border: 1px solid var(--border);  /* ✅ 使用主题变量 */
            padding: 6px 10px;
        }}

        pre, code {{
            background: rgba(128, 128, 128, 0.15);
            padding: 2px 6px;
            border-radius: 4px;
        }}

        /* ✅ 引用框使用主题变量 */
        blockquote {{
            margin: 1em 0;
            padding: 10px 15px;
            border-left: 4px solid var(--border);
            background: var(--admonition-bg);
        }}

        blockquote p:first-child strong {{
            display: block;
            margin-bottom: 6px;
            color: var(--text);
        }}

        /* ✅ 提示框使用主题变量 */
        .admonition {{
            border-left: 4px solid var(--border);
            padding: 10px 15px;
            margin: 1em 0;
            background: var(--admonition-bg);
        }}

        .admonition-title {{
            font-weight: bold;
            margin-bottom: 6px;
            color: var(--text);
        }}

        .admonition.tip {{
            border-left-color: #238636;
        }}

        .admonition.warning {{
            border-left-color: #9e6a03;
        }}

        .admonition.note {{
            border-left-color: #0969da;
        }}

        /* ✅ 主题按钮使用主题变量 */
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
            color: var(--text);  /* ✅ 按钮文字颜色 */
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
            
            // ✅ 强制触发重绘，确保按钮样式更新
            switcher.style.display = 'none';
            switcher.offsetHeight; // 触发重排
            switcher.style.display = 'block';
        }}

        // 初始化
        const saved = localStorage.getItem('theme');
        if (saved) {{
            applyTheme(saved);
        }} else {{
            applyTheme('system');
        }}

        switcher.addEventListener('change', e => {{
            applyTheme(e.target.value);
        }});
        
        // ✅ 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {{
            const currentTheme = localStorage.getItem('theme');
            if (!currentTheme || currentTheme === 'system') {{
                applyTheme('system');
            }}
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
