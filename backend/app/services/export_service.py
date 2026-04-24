def generate_html(sections: list, theme: dict) -> str:
    primary_color = theme.get("primaryColor", "#3b82f6")
    font_family = theme.get("fontFamily", "system-ui, sans-serif")

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary: {primary_color};
        }}
        body {{
            font-family: {font_family};
        }}
        .bg-primary {{ background-color: var(--primary); }}
        .text-primary {{ color: var(--primary); }}
        .border-primary {{ border-color: var(--primary); }}
    </style>
</head>
<body class="bg-white text-slate-900">
"""

    for section in sections:
        s_type = section.get("type")
        props = section.get("props", {})

        if s_type == "hero":
            html_content += f"""
    <section class="py-20 px-6 text-center bg-slate-50">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-5xl font-bold mb-6">{props.get('title', '')}</h1>
            <p class="text-xl text-slate-600 mb-10">{props.get('subtitle', '')}</p>
            <a href="{props.get('ctaLink', '#')}" class="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                {props.get('cta', 'Bắt đầu ngay')}
            </a>
        </div>
    </section>
"""
        elif s_type == "features":
            items_html = ""
            for item in props.get("items", []):
                items_html += f"""
            <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                     <span class="text-primary font-bold">✓</span>
                </div>
                <h3 class="text-xl font-semibold mb-2">{item.get('title', '')}</h3>
                <p class="text-slate-600">{item.get('description', '')}</p>
            </div>
"""
            html_content += f"""
    <section class="py-20 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items_html}
            </div>
        </div>
    </section>
"""
        elif s_type == "testimonials":
            items_html = ""
            for item in props.get("items", []):
                items_html += f"""
            <div class="p-6 bg-slate-50 rounded-xl">
                <p class="text-slate-600 mb-4 italic">"{item.get('content', '')}"</p>
                <div class="flex items-center gap-3">
                    <div class="font-semibold">{item.get('name', '')}</div>
                    <div class="text-yellow-400">{'★' * int(item.get('rating', 5))}</div>
                </div>
            </div>
"""
            html_content += f"""
    <section class="py-20 px-6 bg-white">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Khách hàng nói gì</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items_html}
            </div>
        </div>
    </section>
"""
        elif s_type == "pricing":
            plans_html = ""
            for plan in props.get("plans", []):
                highlight_cls = "border-primary ring-2 ring-primary/20 scale-105" if plan.get('highlight') else "border-slate-200"
                plans_html += f"""
            <div class="p-8 bg-white rounded-2xl border {highlight_cls} flex flex-col">
                <h3 class="text-xl font-bold mb-2">{plan.get('name', '')}</h3>
                <div class="text-4xl font-bold mb-6">{plan.get('price', '')}</div>
                <ul class="space-y-4 mb-8 flex-1">
                    {''.join([f'<li class="flex items-center gap-2"><span class="text-primary">✓</span> {f}</li>' for f in plan.get('features', [])])}
                </ul>
                <button class="w-full py-3 rounded-lg font-semibold {'bg-primary text-white' if plan.get('highlight') else 'bg-slate-100 text-slate-900'} hover:opacity-90 transition-opacity">
                    {plan.get('cta', 'Chọn gói')}
                </button>
            </div>
"""
            html_content += f"""
    <section class="py-20 px-6 bg-slate-50">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {plans_html}
            </div>
        </div>
    </section>
"""
        elif s_type == "cta":
            html_content += f"""
    <section class="py-20 px-6 text-center bg-primary text-white">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold mb-6">{props.get('title', '')}</h2>
            <p class="text-xl opacity-90 mb-10">{props.get('description', '')}</p>
            <button class="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                {props.get('buttonText', 'Tham gia ngay')}
            </button>
        </div>
    </section>
"""
        elif s_type == "footer":
            links_html = "".join([f'<li><a href="{l.get("href", "#")}" class="hover:text-primary">{l.get("label", "")}</a></li>' for l in props.get("links", [])])
            html_content += f"""
    <footer class="py-12 px-6 bg-white border-t border-slate-200">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="font-bold text-xl">AI Landing Page</div>
            <ul class="flex gap-8 text-slate-600">
                {links_html}
            </ul>
            <div class="text-slate-400 text-sm">© 2026 AI Landing Page. All rights reserved.</div>
        </div>
    </footer>
"""

    html_content += """
</body>
</html>
"""
    return html_content
