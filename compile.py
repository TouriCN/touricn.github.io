import os
import re
import markdown

SRC_DIR = "src"

def preprocess_github_admonitions(md_content):
    """
    将 GitHub 风格的 > [!TIP] 转换为 pymdownx.admonition 支持的 !!! tip 格式
    专门处理 Markdown + HTML 混合内容，避免误判 HTML 中的 >
    """
    lines = md_content.split('\n')
    result = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()
        
        # 严格匹配 GitHub 风格的提示框: > [!TIP]
        if stripped.startswith('> [!') and stripped.endswith(']'):
            # 提取提示框类型 (TIP, WARNING, NOTE 等)
            match = re.search(r'\[!([A-Z]+)\]', stripped)
            if match:
                admon_type = match.group(1).lower()
                i += 1
                
                # 收集提示框内容（所有以 > 开头的行）
                body_lines = []
                while i < n and lines[i].strip().startswith('>'):
                    # 去掉开头的 '> ' 或 '>'，添加 4 个空格缩进
                    content_line = lines[i].strip()
                    if content_line.startswith('> '):
                        content_line = content_line[2:]
                    elif content_line.startswith('>'):
                        content_line = content_line[1:]
                    body_lines.append('    ' + content_line)
                    i += 1
                
                # 添加转换后的提示框
                result.append(f'!!! {admon_type}')
                if body_lines:
                    result.extend(body_lines)
                else:
                    # 如果没有内容，添加一个空行避免语法错误
                    result.append('    ')
                result.append('')  # 空行分隔
            else:
                # 不匹配的格式，保持原样
                result.append(line)
                i += 1
        else:
            # 普通行，保持原样
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

            # 预处理 GitHub 风格提示框
            processed_md = preprocess_github_admonitions(md_content)

            # 使用标准 Markdown 扩展 + pymdownx.admonition
            html_body = markdown.markdown(
                processed_md,
                extensions=[
                    'markdown.extensions.tables',        # 表格支持
                    'markdown.extensions.fenced_code',   # 代码块支持
                    'markdown.extensions.nl2br',        # 换行转 <br>
                    'markdown.extensions.sane_lists',    # 更好的列表支持
                    'pymdownx.admonition',               # 提示框支持 (!!! tip)
                ]
            )

            # 完整 HTML 模板（包含主题切换功能）
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
            border: 1px solid var(--border);
            padding: 6px 10px;
        }}

        pre, code {{
            background: rgba(128, 128, 128, 0.15);
            padding: 2px 6px;
            border-radius: 4px;
        }}

        blockquote {{
            margin: 1em 0;
            padding: 10px 15px;
            border-left: 4px solid var(--border);
            background: var(--admonition-bg);
        }}

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

        .admonition.tip {{
            border-left-color: #238636;
        }}

        .admonition.warning {{
            border-left-color: #9e6a03;
        }}

        .admonition.note {{
            border-left-color: #0969da;
        }}

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
            
            // 强制重绘，确保按钮样式更新
            switcher.style.display = 'none';
            switcher.offsetHeight;
            switcher.style.display = 'block';
        }}

        // 初始化主题
        const saved = localStorage.getItem('theme');
        if (saved) {{
            applyTheme(saved);
        }} else {{
            applyTheme('system');
        }}

        // 监听主题切换
        switcher.addEventListener('change', e => {{
            applyTheme(e.target.value);
        }});

        // 监听系统主题变化
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
            print(f"✅ Compiled {md_path} -> {html_path}")

        except Exception as e:
            print(f"❌ FAILED {md_path}: {e}")
            raise

if __name__ == "__main__":
    compile_markdown()
