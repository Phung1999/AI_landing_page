import asyncio
import uuid
import re
from urllib.parse import urlparse
from playwright.async_api import async_playwright, Browser, Page


def get_domain_name(url: str) -> str:
    parsed = urlparse(url)
    domain = parsed.netloc or parsed.path.split("/")[0]
    domain = re.sub(r"^www\.", "", domain)
    domain = re.sub(r"\..*", "", domain)
    return domain or "landing"


def detect_landing_type(title: str, content: str, url: str) -> str:
    text = (title + " " + content).lower()
    url_lower = url.lower()

    if any(word in text or word in url_lower for word in ["course", "học", "khóa", "learn", "training", "edu", "khoa-hoc"]):
        return "course"
    elif any(word in text or word in url_lower for word in ["shop", "mua", "product", "store", "ecommerce", "bán", "shopify"]):
        return "product"
    elif any(word in text or word in url_lower for word in ["saas", "app", "software", "tool", "pricing", "startup"]):
        return "saas"
    return "saas"


def normalize_image_url(img_src: str, base_url: str) -> str | None:
    if not img_src:
        return None
    img_src = img_src.strip()
    
    if img_src.startswith("data:"):
        return None
    
    if img_src.startswith("//"):
        parsed = urlparse(base_url)
        return f"{parsed.scheme}:{img_src}"
    elif img_src.startswith("/"):
        parsed = urlparse(base_url)
        return f"{parsed.scheme}://{parsed.netloc}{img_src}"
    elif not img_src.startswith("http"):
        parsed = urlparse(base_url)
        if img_src.startswith("/"):
            return f"{parsed.scheme}://{parsed.netloc}{img_src}"
        else:
            return f"{parsed.scheme}://{parsed.netloc}/{img_src}"
    return img_src


async def extract_colors_and_fonts(page: Page) -> dict:
    colors = set()
    fonts = set()
    
    try:
        color_values = await page.evaluate('''() => {
            const colors = new Set();
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;
                const color = style.color;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') colors.add(bg);
                if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') colors.add(color);
            });
            return Array.from(colors);
        }''')
        colors.update(color_values[:10])
    except:
        pass
    
    try:
        font_values = await page.evaluate('''() => {
            const fonts = new Set();
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                const font = style.fontFamily;
                if (font) fonts.add(font);
            });
            return Array.from(fonts);
        }''')
        fonts.update(font_values[:5])
    except:
        pass
    
    primary_color = "#3b82f6"
    for color in colors:
        if color and color != "rgba(0, 0, 0, 0)" and color != "transparent":
            if "rgb" in color:
                primary_color = color
                break
    
    font_family = "system-ui, sans-serif"
    if fonts:
        font_family = list(fonts)[0]
    
    return {
        "primaryColor": primary_color,
        "fontFamily": font_family,
        "allColors": list(colors)[:10],
        "allFonts": list(fonts)[:5]
    }


async def extract_all_images(page: Page, base_url: str) -> list[str]:
    images = []
    try:
        img_elements = await page.query_selector_all("img")
        for img in img_elements:
            try:
                src = await img.get_attribute("src")
                if src:
                    normalized = normalize_image_url(src, base_url)
                    if normalized and normalized not in images:
                        images.append(normalized)
            except:
                pass
        
        bg_elements = await page.evaluate('''() => {
            const elements = document.querySelectorAll('*');
            const bgs = [];
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                const bg = style.backgroundImage;
                if (bg && bg !== 'none' && bg !== 'url()') {
                    const match = bg.match(/url\\(["']*)(.*?)\\1\\)/);
                    if (match) bgs.push(match[2]);
                }
            });
            return bgs;
        }''')
        for bg in bg_elements[:10]:
            if bg and bg != "none":
                normalized = normalize_image_url(bg, base_url)
                if normalized and normalized not in images:
                    images.append(normalized)
    except:
        pass
    
    return images[:20]


async def extract_hero(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(10)
    
    hero = {}
    
    try:
        h1 = await page.query_selector("h1")
        if h1:
            hero["title"] = await h1.inner_text()
        else:
            title_el = await page.query_selector("h1, h2, .hero-title, .hero h1, [class*='hero'] h1, [class*='banner'] h1")
            if title_el:
                hero["title"] = await title_el.inner_text()
        
        subtitle_selectors = [".subtitle", ".description", ".hero-subtitle", ".hero-description", "p.hero-title + p", "[class*='hero'] p"]
        for sel in subtitle_selectors:
            el = await page.query_selector(sel)
            if el:
                hero["subtitle"] = await el.inner_text()
                break
        
        cta_selectors = [".cta-button", ".btn-cta", ".hero-cta a", ".hero .button", "[class*='cta'] a", "[class*='hero'] button", ".btn-primary a", ".btn"]
        for sel in cta_selectors:
            el = await page.query_selector(sel)
            if el:
                hero["cta"] = await el.inner_text()
                href = await el.get_attribute("href")
                if href:
                    hero["ctaLink"] = href
                break
        
        img = await page.query_selector(".hero img, .hero-image img, [class*='hero'] img, header img, .banner img")
        if img:
            src = await img.get_attribute("src")
            if src:
                hero["image"] = normalize_image_url(src, base_url)
        
        if not hero.get("title"):
            title = await page.title()
            hero["title"] = title or "Landing Page"
    except:
        pass
    
    return hero if hero else None


async def extract_features(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(25)
    
    features = []
    
    feature_selectors = [
        ".features", ".benefits", ".why-choose", ".advantages",
        "[class*='feature']", "[class*='benefit']", "[class*='advantage']",
        ".services", ".service-list"
    ]
    
    for selector in feature_selectors:
        elements = await page.query_selector_all(f"{selector} .item, {selector} .card, {selector} > div")
        for el in elements[:6]:
            try:
                title_el = await el.query_selector("h3, h4, .title, .feature-title")
                desc_el = await el.query_selector("p, .description, .desc")
                icon_el = await el.query_selector("i, .icon, img")
                
                item = {}
                if title_el:
                    item["title"] = await title_el.inner_text()
                if desc_el:
                    item["description"] = await desc_el.inner_text()
                if icon_el:
                    icon_class = await icon_el.get_attribute("class")
                    if icon_class:
                        item["icon"] = icon_class.split()[-1]
                    else:
                        src = await icon_el.get_attribute("src")
                        if src:
                            item["iconImage"] = normalize_image_url(src, base_url)
                
                if item.get("title"):
                    if "description" not in item:
                        item["description"] = "Tính năng nổi bật"
                    if "icon" not in item and "iconImage" not in item:
                        item["icon"] = "Star"
                    features.append(item)
            except:
                pass
    
    return {"items": features} if features else None


async def extract_testimonials(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(40)
    
    testimonials = []
    
    testi_selectors = [
        ".testimonials", ".reviews", ".testimonial", ".review",
        "[class*='testimonial']", "[class*='review']", "[class*='feedback']"
    ]
    
    for selector in testi_selectors:
        elements = await page.query_selector_all(f"{selector} .item, {selector} .card, {selector} > div, {selector} .review-item")
        for el in elements[:5]:
            try:
                name_el = await el.query_selector(".name, .author, h4, h5")
                content_el = await el.query_selector("p, .content, .text, .review-text")
                avatar_el = await el.query_selector("img, .avatar")
                rating_el = await el.query_selector(".rating, .stars")
                
                item = {}
                if name_el:
                    item["name"] = await name_el.inner_text()
                if content_el:
                    item["content"] = await content_el.inner_text()
                if avatar_el:
                    src = await avatar_el.get_attribute("src")
                    if src:
                        item["avatar"] = normalize_image_url(src, base_url)
                if rating_el:
                    stars = await rating_el.inner_text()
                    item["rating"] = len([c for c in stars if c == "★"])
                
                if item.get("content"):
                    if "name" not in item:
                        item["name"] = "Khách hàng"
                    if "rating" not in item:
                        item["rating"] = 5
                    testimonials.append(item)
            except:
                pass
    
    return {"items": testimonials} if testimonials else None


async def extract_pricing(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(55)
    
    plans = []
    
    pricing_selectors = [
        ".pricing", ".price", ".plans", ".pricing-table",
        "[class*='price']", "[class*='pricing']", "[class*='plan']"
    ]
    
    for selector in pricing_selectors:
        elements = await page.query_selector_all(f"{selector} .card, {selector} .plan, {selector} > div, {selector} .pricing-card")
        for el in elements[:4]:
            try:
                name_el = await el.query_selector("h3, h4, .name, .plan-name")
                price_el = await el.query_selector(".price, .amount, .plan-price")
                features_el = await el.query_selector_all("li, .feature, .benefits li")
                cta_el = await el.query_selector("a, .button, .btn")
                
                plan = {}
                if name_el:
                    plan["name"] = await name_el.inner_text()
                if price_el:
                    plan["price"] = await price_el.inner_text()
                else:
                    plan["price"] = "Liên hệ"
                
                features = []
                for f in features_el[:6]:
                    text = await f.inner_text()
                    if text and text.strip():
                        features.append(text.strip())
                if features:
                    plan["features"] = features
                else:
                    plan["features"] = ["Tính năng cơ bản"]
                
                if cta_el:
                    plan["cta"] = await cta_el.inner_text()
                else:
                    plan["cta"] = "Đăng ký"
                
                if plan.get("name") or plan.get("price"):
                    plans.append(plan)
            except:
                pass
    
    return {"plans": plans} if plans else None


async def extract_gallery(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(70)
    
    images = []
    
    gallery_selectors = [
        ".gallery", ".portfolio", ".images", ".gallery-grid",
        "[class*='gallery']", "[class*='portfolio']"
    ]
    
    for selector in gallery_selectors:
        elements = await page.query_selector_all(f"{selector} img, {selector} .item img")
        for el in elements[:9]:
            try:
                src = await el.get_attribute("src")
                if src:
                    img_url = normalize_image_url(src, base_url)
                    if img_url and img_url not in images:
                        images.append(img_url)
            except:
                pass
    
    return {"images": images} if images else None


async def extract_cta(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(80)
    
    cta = {}
    
    cta_selectors = [
        ".cta-section",
        ".cta",
        ".call-to-action",
        ".contact-section",
        "[class*='cta']",
        "[class*='call-to-action']",
        "[class*='contact']"
    ]
    
    for selector in cta_selectors:
        el = await page.query_selector(selector)
        if el:
            title_el = await el.query_selector("h2, h3, .title")
            desc_el = await el.query_selector("p, .description")
            btn_el = await el.query_selector("a, button")
            
            if title_el:
                cta["title"] = await title_el.inner_text()
            if desc_el:
                cta["description"] = await desc_el.inner_text()
            if btn_el:
                cta["buttonText"] = await btn_el.inner_text()
            break
    
    if not cta:
        cta_el = await page.query_selector(".cta a, .contact a, [class*='cta'] a")
        if cta_el:
            cta["title"] = "Liên hệ với chúng tôi"
            cta["description"] = "Hãy liên hệ ngay để được tư vấn"
            cta["buttonText"] = await cta_el.inner_text()
    
    return cta if cta else None


async def extract_footer(page: Page, base_url: str, progress_callback=None) -> dict | None:
    if progress_callback:
        await progress_callback(90)
    
    links = []
    social = []
    
    try:
        footer_links = await page.query_selector_all("footer a, .footer a")
        for link in footer_links[:10]:
            try:
                href = await link.get_attribute("href")
                label = await link.inner_text()
                if href and label:
                    full_href = normalize_image_url(href, base_url)
                    links.append({"label": label.strip()[:30], "href": full_href})
            except:
                pass
        
        social_platforms = ["facebook", "twitter", "instagram", "youtube", "linkedin", "tiktok"]
        for link in footer_links[:10]:
            try:
                href = await link.get_attribute("href") or ""
                for platform in social_platforms:
                    if platform in href.lower():
                        social.append({"platform": platform, "href": href})
            except:
                pass
    except:
        pass
    
    return {"links": links, "social": social} if links or social else None


async def clone_with_playwright(url: str, progress_callback=None) -> dict:
    result = {
        "sections": [],
        "theme": {},
        "name": "",
        "landing_type": "saas",
        "url": url,
        "all_images": []
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            if progress_callback:
                await progress_callback(0)
            
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await asyncio.sleep(2)
            
            if progress_callback:
                await progress_callback(5)
            
            title = await page.title()
            content = await page.content()
            
            domain_name = get_domain_name(url)
            landing_type = detect_landing_type(title, content, url)
            result["name"] = f"landing-{domain_name}"
            result["landing_type"] = landing_type
            
            theme = await extract_colors_and_fonts(page)
            result["theme"] = {
                "primaryColor": theme["primaryColor"],
                "fontFamily": theme["fontFamily"]
            }
            
            if progress_callback:
                await progress_callback(8)
            
            all_imgs = await extract_all_images(page, url)
            result["all_images"] = all_imgs
            
            hero_data = await extract_hero(page, url, progress_callback)
            if hero_data:
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "hero",
                    "props": hero_data
                })
            
            features_data = await extract_features(page, url, progress_callback)
            if features_data and features_data.get("items"):
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "features",
                    "props": features_data
                })
            
            testi_data = await extract_testimonials(page, url, progress_callback)
            if testi_data and testi_data.get("items"):
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "testimonials",
                    "props": testi_data
                })
            
            pricing_data = await extract_pricing(page, url, progress_callback)
            if pricing_data and pricing_data.get("plans"):
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "pricing",
                    "props": pricing_data
                })
            
            gallery_data = await extract_gallery(page, url, progress_callback)
            if gallery_data and gallery_data.get("images"):
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "gallery",
                    "props": gallery_data
                })
            
            cta_data = await extract_cta(page, url, progress_callback)
            if cta_data:
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "cta",
                    "props": cta_data
                })
            
            footer_data = await extract_footer(page, url, progress_callback)
            if footer_data:
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "footer",
                    "props": footer_data
                })
            
            if len(result["sections"]) < 2:
                result["sections"].append({
                    "id": str(uuid.uuid4()),
                    "type": "features",
                    "props": {
                        "items": [
                            {"icon": "Star", "title": "Chất lượng cao", "description": "Sản ph��m chất lượng"},
                            {"icon": "Clock", "title": "Nhanh chóng", "description": "Giao hàng nhanh"},
                            {"icon": "Shield", "title": "An toàn", "description": "Bảo hành dài hạn"}
                        ]
                    }
                })
            
            if progress_callback:
                await progress_callback(100)
                
        except Exception as e:
            raise e
        finally:
            await browser.close()
    
    return result


async def clone_landing_page(url: str) -> dict:
    return await clone_with_playwright(url)


async def analyze_url(url: str) -> dict:
    try:
        result = await clone_landing_page(url)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}