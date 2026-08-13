#!/usr/bin/env python3
"""Generate SHALOM LLC FZ — Digital Services Company Profile PDF."""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "Shalom_LLC_FZ_Digital_Services_Company_Profile.pdf"
LOGO = ROOT / "logo_light.png"
HERO = ROOT / "digital_hero.png"

PAGE_W, PAGE_H = A4

# Brand palette (from flyer + site)
NAVY = HexColor("#0B1B3A")
NAVY_DEEP = HexColor("#061228")
NAVY_MID = HexColor("#132A52")
GOLD = HexColor("#C9A227")
GOLD_LIGHT = HexColor("#E0C35A")
SLATE = HexColor("#4A5568")
LIGHT_BG = HexColor("#F5F7FB")
CARD_BORDER = HexColor("#D6DEEB")
TEAL = HexColor("#0D9488")
BLUE = HexColor("#1D4ED8")
INDIGO = HexColor("#4338CA")
ORANGE = HexColor("#EA580C")
GREEN = HexColor("#059669")

SERVICE_ACCENTS = [GREEN, TEAL, BLUE, INDIGO, ORANGE]


def draw_rect(c, x, y, w, h, fill=None, stroke=None, sw=0.5):
    c.saveState()
    if fill:
        c.setFillColor(fill)
        c.rect(x, y, w, h, fill=1, stroke=0)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
        c.rect(x, y, w, h, fill=0, stroke=1)
    c.restoreState()


def draw_round_rect(c, x, y, w, h, r=8, fill=None, stroke=None, sw=1):
    c.saveState()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r, fill=1 if fill else 0, stroke=1 if stroke else 0)
    c.restoreState()


def draw_circle(c, cx, cy, r, fill=None, stroke=None, sw=1):
    c.saveState()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    c.circle(cx, cy, r, fill=1 if fill else 0, stroke=1 if stroke else 0)
    c.restoreState()


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if c.stringWidth(trial, font, size) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_paragraph(c, text, x, y, max_width, font="Helvetica", size=10, color=SLATE, leading=14, align="left"):
    lines = wrap_text(c, text, font, size, max_width)
    c.setFont(font, size)
    c.setFillColor(color)
    yy = y
    for line in lines:
        if align == "center":
            c.drawCentredString(x + max_width / 2, yy, line)
        else:
            c.drawString(x, yy, line)
        yy -= leading
    return yy


def header_bar(c, page_title=""):
    """Persistent header: logo + email."""
    draw_rect(c, 0, PAGE_H - 22 * mm, PAGE_W, 22 * mm, fill=NAVY)
    # gold accent line
    draw_rect(c, 0, PAGE_H - 22 * mm, PAGE_W, 1.2 * mm, fill=GOLD)

    if LOGO.exists():
        c.drawImage(
            str(LOGO),
            14 * mm,
            PAGE_H - 19.5 * mm,
            width=14 * mm,
            height=14 * mm,
            mask="auto",
            preserveAspectRatio=True,
            anchor="c",
        )

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(32 * mm, PAGE_H - 10 * mm, "SHALOM LLC FZ")
    c.setFont("Helvetica", 7.5)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(32 * mm, PAGE_H - 15 * mm, "Digital Development Services")

    c.setFillColor(white)
    c.setFont("Helvetica", 8.5)
    c.drawRightString(PAGE_W - 14 * mm, PAGE_H - 10 * mm, "info@shalomllcfz.com")
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica", 7.5)
    c.drawRightString(PAGE_W - 14 * mm, PAGE_H - 15 * mm, "www.shalomllcfz.com")

    if page_title:
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(PAGE_W / 2, PAGE_H - 28 * mm, page_title.upper())


def footer_bar(c, page_num, total):
    draw_rect(c, 0, 0, PAGE_W, 14 * mm, fill=NAVY)
    draw_rect(c, 0, 14 * mm, PAGE_W, 0.8 * mm, fill=GOLD)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica", 7)
    c.drawString(14 * mm, 6 * mm, "Sharjah Media City, Sharjah, UAE")
    c.drawCentredString(PAGE_W / 2, 6 * mm, "+971 55 226 8127")
    c.setFillColor(white)
    c.drawRightString(PAGE_W - 14 * mm, 6 * mm, f"Page {page_num} of {total}")


def section_label(c, text, x, y, color=GOLD):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x, y, text.upper())
    # underline accent
    tw = c.stringWidth(text.upper(), "Helvetica-Bold", 8)
    c.setStrokeColor(color)
    c.setLineWidth(1.5)
    c.line(x, y - 2, x + min(tw, 40), y - 2)


def draw_icon_globe(c, cx, cy, color, scale=1.0):
    r = 7 * scale
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(1.4)
    c.circle(cx, cy, r, fill=0, stroke=1)
    c.ellipse(cx - r * 0.45, cy - r, r * 0.9, r * 2, fill=0, stroke=1)
    c.line(cx - r, cy, cx + r, cy)
    c.line(cx, cy - r, cx, cy + r)
    c.restoreState()


def draw_icon_phone(c, cx, cy, color, scale=1.0):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1.4)
    w, h = 8 * scale, 13 * scale
    c.roundRect(cx - w / 2, cy - h / 2, w, h, 1.5, fill=0, stroke=1)
    c.setLineWidth(2)
    c.line(cx - 2 * scale, cy - h / 2 + 2, cx + 2 * scale, cy - h / 2 + 2)
    c.restoreState()


def draw_icon_monitor(c, cx, cy, color, scale=1.0):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(1.4)
    w, h = 16 * scale, 10 * scale
    c.roundRect(cx - w / 2, cy - h / 2 + 1.5, w, h, 1.2, fill=0, stroke=1)
    c.line(cx - 3 * scale, cy - h / 2 + 1.5, cx + 3 * scale, cy - h / 2 + 1.5)
    c.line(cx, cy - h / 2 + 1.5, cx, cy - h / 2 - 1.5)
    c.line(cx - 5 * scale, cy - h / 2 - 1.5, cx + 5 * scale, cy - h / 2 - 1.5)
    c.restoreState()


def draw_icon_code(c, cx, cy, color, scale=1.0):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(1.6)
    s = 5 * scale
    # <
    c.line(cx - 1, cy + s, cx - s - 1, cy)
    c.line(cx - s - 1, cy, cx - 1, cy - s)
    # >
    c.line(cx + 1, cy + s, cx + s + 1, cy)
    c.line(cx + s + 1, cy, cx + 1, cy - s)
    c.restoreState()


def draw_icon_brush(c, cx, cy, color, scale=1.0):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1.5)
    # angled handle
    c.setLineWidth(2.2)
    c.line(cx + 5 * scale, cy + 5.5 * scale, cx - 0.5 * scale, cy - 1.5 * scale)
    # ferrule
    c.setLineWidth(1.2)
    c.line(cx - 1.5 * scale, cy - 0.2 * scale, cx + 1.2 * scale, cy - 2.8 * scale)
    # bristles
    path = c.beginPath()
    path.moveTo(cx - 1.8 * scale, cy - 1.2 * scale)
    path.lineTo(cx - 6.5 * scale, cy - 6.2 * scale)
    path.lineTo(cx - 0.2 * scale, cy - 4.2 * scale)
    path.close()
    c.drawPath(path, fill=1, stroke=0)
    c.restoreState()


ICON_DRAWER = [draw_icon_globe, draw_icon_phone, draw_icon_monitor, draw_icon_code, draw_icon_brush]


def service_card(c, x, y, w, h, num, title, desc, accent, icon_fn):
    draw_round_rect(c, x, y, w, h, r=10, fill=white, stroke=accent, sw=1.2)
    # bottom accent bar
    c.setFillColor(accent)
    c.roundRect(x + 10, y + 8, w - 20, 3.5, 1.5, fill=1, stroke=0)

    # number badge
    badge_r = 9
    draw_circle(c, x + w / 2, y + h - 2, badge_r, fill=accent)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + w / 2, y + h - 5, f"{num:02d}")

    # icon circle
    draw_circle(c, x + w / 2, y + h - 28, 14, fill=LIGHT_BG, stroke=None)
    icon_fn(c, x + w / 2, y + h - 28, accent, scale=1.05)

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    # wrap title if needed
    title_lines = wrap_text(c, title, "Helvetica-Bold", 9, w - 16)
    ty = y + h - 50
    for tl in title_lines:
        c.drawCentredString(x + w / 2, ty, tl)
        ty -= 11

    draw_paragraph(
        c,
        desc,
        x + 8,
        ty - 4,
        w - 16,
        font="Helvetica",
        size=7.2,
        color=SLATE,
        leading=9.5,
        align="center",
    )


# ───────────────────────── Pages ─────────────────────────

def page_cover(c):
    draw_rect(c, 0, 0, PAGE_W, PAGE_H, fill=NAVY_DEEP)

    # subtle decorative band
    draw_rect(c, 0, PAGE_H * 0.38, PAGE_W, PAGE_H * 0.22, fill=NAVY)
    draw_rect(c, 0, PAGE_H * 0.38, PAGE_W, 1.5 * mm, fill=GOLD)
    draw_rect(c, 0, PAGE_H * 0.38 + PAGE_H * 0.22, PAGE_W, 1.5 * mm, fill=GOLD)

    if LOGO.exists():
        c.drawImage(
            str(LOGO),
            PAGE_W / 2 - 28 * mm,
            PAGE_H - 78 * mm,
            width=56 * mm,
            height=56 * mm,
            mask="auto",
            preserveAspectRatio=True,
        )

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 88 * mm, "COMPANY PROFILE")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 26)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.52 + 8, "SHALOM LLC FZ")

    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica", 12)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.52 - 10, "Digital Development Services")

    c.setFillColor(HexColor("#A8B4C8"))
    c.setFont("Helvetica", 9.5)
    tagline = "Website, Mobile & Desktop Application Development"
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.52 - 28, tagline)

    # contact strip
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(PAGE_W / 2, 42 * mm, "info@shalomllcfz.com")
    c.setFont("Helvetica", 8)
    c.setFillColor(GOLD_LIGHT)
    c.drawCentredString(PAGE_W / 2, 35 * mm, "www.shalomllcfz.com  |  +971 55 226 8127")
    c.setFillColor(HexColor("#8A97AD"))
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(PAGE_W / 2, 28 * mm, "Sharjah Media City, Sharjah, UAE")

    c.setFillColor(GOLD)
    c.setFont("Helvetica", 7)
    c.drawCentredString(PAGE_W / 2, 16 * mm, "Confidential — For Clients & Partners")


def page_about(c, page_num, total):
    header_bar(c)
    footer_bar(c, page_num, total)

    y = PAGE_H - 36 * mm
    section_label(c, "01  About Us", 16 * mm, y)
    y -= 10 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(16 * mm, y, "Building digital products")
    y -= 7 * mm
    c.drawString(16 * mm, y, "that help businesses grow.")
    y -= 12 * mm

    about = (
        "SHALOM LLC FZ is a UAE-based company delivering modern digital solutions from "
        "Sharjah Media City. We design and build corporate websites, iOS & Android mobile apps, "
        "desktop software, and custom digital products that help organisations grow online and offline."
    )
    y = draw_paragraph(c, about, 16 * mm, y, PAGE_W - 32 * mm, size=10, leading=14.5, color=SLATE)
    y -= 6 * mm

    about2 = (
        "Our digital practice focuses on performance, clarity, and conversion — with secure "
        "architecture, mobile-responsive experiences, and post-launch support so every product "
        "remains reliable as your business scales."
    )
    y = draw_paragraph(c, about2, 16 * mm, y, PAGE_W - 32 * mm, size=10, leading=14.5, color=SLATE)
    y -= 12 * mm

    # Snapshot cards
    cards = [
        ("Location", "Sharjah Media City\nSharjah, UAE"),
        ("Focus", "Digital Development\nWeb • Mobile • Desktop"),
        ("Contact", "info@shalomllcfz.com\n+971 55 226 8127"),
    ]
    card_w = (PAGE_W - 32 * mm - 10 * mm) / 3
    cx = 16 * mm
    for title, body in cards:
        draw_round_rect(c, cx, y - 32 * mm, card_w, 34 * mm, r=8, fill=LIGHT_BG, stroke=CARD_BORDER, sw=0.8)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(cx + 4 * mm, y - 6 * mm, title.upper())
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 8.5)
        by = y - 13 * mm
        for line in body.split("\n"):
            c.drawString(cx + 4 * mm, by, line)
            by -= 11
        cx += card_w + 5 * mm

    y -= 46 * mm
    section_label(c, "What We Stand For", 16 * mm, y)
    y -= 8 * mm

    values = [
        ("Hard Work", "Builds strong foundations through real, practical delivery experience."),
        ("Smart Work", "Accelerates effort and turns experience into lasting digital success."),
        ("Together", "Dedication and strategy combined help clients succeed sooner — and smarter."),
    ]
    for title, desc in values:
        draw_circle(c, 20 * mm, y + 2, 3.2, fill=GOLD)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(26 * mm, y, title)
        draw_paragraph(c, desc, 26 * mm, y - 12, PAGE_W - 48 * mm, size=9, leading=12, color=SLATE)
        y -= 22 * mm


def page_mission(c, page_num, total):
    header_bar(c)
    footer_bar(c, page_num, total)

    y = PAGE_H - 36 * mm
    section_label(c, "02  Purpose", 16 * mm, y)
    y -= 10 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(16 * mm, y, "Mission & Vision")
    y -= 8 * mm
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9.5)
    c.drawString(16 * mm, y, "The principles that guide how we serve digital clients and grow as a trusted partner.")
    y -= 14 * mm

    # Mission box
    box_h = 48 * mm
    draw_round_rect(c, 16 * mm, y - box_h, PAGE_W - 32 * mm, box_h, r=10, fill=NAVY)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(24 * mm, y - 8 * mm, "OUR MISSION")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(24 * mm, y - 16 * mm, "Reliable digital products that perform.")
    mission = (
        "To design and deliver high-quality websites, mobile apps, desktop software, and custom "
        "digital solutions that ensure clarity, performance, and long-term value — through continuous "
        "improvement and professional expertise."
    )
    draw_paragraph(c, mission, 24 * mm, y - 26 * mm, PAGE_W - 48 * mm, size=9.5, leading=13, color=HexColor("#D5DCEC"))

    y -= box_h + 10 * mm

    # Vision box
    draw_round_rect(c, 16 * mm, y - box_h, PAGE_W - 32 * mm, box_h, r=10, fill=LIGHT_BG, stroke=GOLD, sw=1.2)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(24 * mm, y - 8 * mm, "OUR VISION")
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(24 * mm, y - 16 * mm, "A trusted digital partner for growth.")
    vision = (
        "To become a trusted leader in digital development by delivering quality craftsmanship, "
        "reliable solutions, and continuous improvement for long-term client satisfaction across "
        "web, mobile, and software projects."
    )
    draw_paragraph(c, vision, 24 * mm, y - 26 * mm, PAGE_W - 48 * mm, size=9.5, leading=13, color=SLATE)

    y -= box_h + 14 * mm
    section_label(c, "Why Clients Choose Us", 16 * mm, y)
    y -= 12 * mm

    reasons = [
        ("Modern & Responsive", "Fast, mobile-first experiences built for clarity and conversion."),
        ("Secure Architecture", "Robust systems with secure payments and dependable backends."),
        ("Scalable Delivery", "Clean codebases with post-launch support as you grow."),
    ]
    rw = (PAGE_W - 32 * mm - 10 * mm) / 3
    rx = 16 * mm
    for title, desc in reasons:
        draw_round_rect(c, rx, y - 38 * mm, rw, 40 * mm, r=8, fill=white, stroke=CARD_BORDER, sw=0.9)
        draw_rect(c, rx, y - 38 * mm + 40 * mm - 3, rw, 3, fill=GOLD)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.5)
        lines = wrap_text(c, title, "Helvetica-Bold", 8.5, rw - 10)
        ty = y - 10 * mm
        for ln in lines:
            c.drawString(rx + 4 * mm, ty, ln)
            ty -= 11
        draw_paragraph(c, desc, rx + 4 * mm, ty - 2, rw - 8 * mm, size=7.8, leading=10.5, color=SLATE)
        rx += rw + 5 * mm


def page_services(c, page_num, total):
    header_bar(c)
    footer_bar(c, page_num, total)

    y = PAGE_H - 36 * mm
    section_label(c, "03  Our Services", 16 * mm, y)
    y -= 9 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(16 * mm, y, "Digital Development Services")
    y -= 6 * mm
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawString(
        16 * mm,
        y,
        "Website, mobile, desktop, and custom logo solutions — modern, reliable, and built to perform.",
    )
    y -= 12 * mm

    services = [
        (
            "Website Development",
            "Modern, responsive corporate websites built for performance, clarity, and conversion — designed to represent your brand with confidence.",
        ),
        (
            "Mobile App Development",
            "Native and cross-platform mobile applications that deliver smooth experiences on iOS and Android for customers on the go.",
        ),
        (
            "Desktop Applications",
            "Reliable desktop software tailored to your workflows — productive tools that run efficiently on Windows and macOS.",
        ),
        (
            "Custom Software Solutions",
            "End-to-end digital products and integrations shaped around your business needs — from concept and UI to launch and support.",
        ),
        (
            "Custom Logo Design",
            "We create custom logos tailored to your brand identity and requirements — distinctive marks that make your business stand out.",
        ),
    ]

    # Row of 3 then 2
    gap = 5 * mm
    card_w = (PAGE_W - 32 * mm - 2 * gap) / 3
    card_h = 58 * mm
    row_y = y - card_h

    for i in range(3):
        x = 16 * mm + i * (card_w + gap)
        service_card(
            c,
            x,
            row_y,
            card_w,
            card_h,
            i + 1,
            services[i][0],
            services[i][1],
            SERVICE_ACCENTS[i],
            ICON_DRAWER[i],
        )

    card_w2 = (PAGE_W - 32 * mm - gap) / 2
    row_y2 = row_y - card_h - 10 * mm
    # center the two cards
    start_x = 16 * mm + (PAGE_W - 32 * mm - 2 * card_w2 - gap) / 2
    for i in range(2):
        idx = i + 3
        x = start_x + i * (card_w2 + gap)
        service_card(
            c,
            x,
            row_y2,
            card_w2,
            card_h,
            idx + 1,
            services[idx][0],
            services[idx][1],
            SERVICE_ACCENTS[idx],
            ICON_DRAWER[idx],
        )


def page_packages(c, page_num, total):
    header_bar(c)
    footer_bar(c, page_num, total)

    y = PAGE_H - 36 * mm
    section_label(c, "04  Solutions & Packages", 16 * mm, y)
    y -= 9 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(16 * mm, y, "Website & Application Packages")
    y -= 7 * mm
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawString(16 * mm, y, "Clear offerings designed to match your stage of growth.")
    y -= 12 * mm

    packages = [
        (
            "01",
            "Static Business Website",
            "Professional company website built to showcase your brand with clarity and credibility.",
            GOLD,
        ),
        (
            "02",
            "Single-Page E-commerce",
            "High-converting quick-sell storefront with secure checkout for focused product launches.",
            TEAL,
        ),
        (
            "03",
            "Full-Scale E-commerce",
            "Complete online store with catalog, payments, and an admin portal for ongoing operations.",
            BLUE,
        ),
        (
            "04",
            "Custom Mobile Apps",
            "Premium iOS & Android applications with backend integration and polished user experience.",
            INDIGO,
        ),
    ]

    for num, title, desc, accent in packages:
        draw_round_rect(c, 16 * mm, y - 28 * mm, PAGE_W - 32 * mm, 26 * mm, r=8, fill=white, stroke=CARD_BORDER, sw=0.9)
        draw_rect(c, 16 * mm, y - 28 * mm, 3.5 * mm, 26 * mm, fill=accent)
        draw_circle(c, 30 * mm, y - 15 * mm, 7, fill=accent)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(30 * mm, y - 17 * mm, num)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(40 * mm, y - 10 * mm, title)
        draw_paragraph(c, desc, 40 * mm, y - 18 * mm, PAGE_W - 62 * mm, size=8.5, leading=11.5, color=SLATE)
        y -= 32 * mm

    y -= 4 * mm
    section_label(c, "How We Work", 16 * mm, y)
    y -= 10 * mm

    steps = [
        ("Discover", "Understand goals, users, and scope."),
        ("Design", "Craft UI/UX aligned to your brand."),
        ("Build", "Develop secure, scalable products."),
        ("Launch", "Deploy, support, and iterate."),
    ]
    sw = (PAGE_W - 32 * mm - 15 * mm) / 4
    sx = 16 * mm
    for i, (title, desc) in enumerate(steps):
        draw_round_rect(c, sx, y - 30 * mm, sw, 32 * mm, r=8, fill=NAVY)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(sx + sw / 2, y - 8 * mm, f"STEP {i + 1}")
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(sx + sw / 2, y - 15 * mm, title)
        c.setFillColor(HexColor("#B8C4DA"))
        c.setFont("Helvetica", 7)
        lines = wrap_text(c, desc, "Helvetica", 7, sw - 8)
        ly = y - 22 * mm
        for ln in lines:
            c.drawCentredString(sx + sw / 2, ly, ln)
            ly -= 9
        sx += sw + 5 * mm


def page_leadership_contact(c, page_num, total):
    header_bar(c)
    footer_bar(c, page_num, total)

    y = PAGE_H - 36 * mm
    section_label(c, "05  Leadership", 16 * mm, y)
    y -= 9 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(16 * mm, y, "A note from our CEO")
    y -= 12 * mm

    box_h = 52 * mm
    draw_round_rect(c, 16 * mm, y - box_h, PAGE_W - 32 * mm, box_h, r=10, fill=LIGHT_BG, stroke=CARD_BORDER)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(24 * mm, y - 10 * mm, '"')
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Oblique", 11)
    quote1 = "Hard work builds the foundation. Smart work builds the future."
    c.drawString(28 * mm, y - 12 * mm, quote1)
    quote2 = (
        "When dedication meets strategy, we don't just work harder — we succeed sooner, and smarter. "
        "Let's stay committed, think intelligently, and grow together."
    )
    draw_paragraph(c, quote2, 28 * mm, y - 22 * mm, PAGE_W - 56 * mm, size=9.5, leading=13, color=SLATE)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(28 * mm, y - 40 * mm, "Chief Executive Officer")
    c.setFillColor(GOLD)
    c.setFont("Helvetica", 8)
    c.drawString(28 * mm, y - 46 * mm, "SHALOM LLC FZ")

    y -= box_h + 14 * mm
    section_label(c, "06  Contact", 16 * mm, y)
    y -= 9 * mm

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(16 * mm, y, "Let's build something great")
    y -= 8 * mm
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9.5)
    c.drawString(16 * mm, y, "Ready to discuss your website, app, or custom digital project?")
    y -= 12 * mm

    # Contact panel
    draw_round_rect(c, 16 * mm, y - 62 * mm, PAGE_W - 32 * mm, 62 * mm, r=10, fill=NAVY)
    draw_rect(c, 16 * mm, y - 62 * mm + 62 * mm - 3, PAGE_W - 32 * mm, 3, fill=GOLD)

    if LOGO.exists():
        c.drawImage(
            str(LOGO),
            24 * mm,
            y - 28 * mm,
            width=22 * mm,
            height=22 * mm,
            mask="auto",
            preserveAspectRatio=True,
        )

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(52 * mm, y - 10 * mm, "SHALOM LLC FZ")
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica", 9)
    c.drawString(52 * mm, y - 16 * mm, "Digital Development Services")

    contacts = [
        ("Email", "info@shalomllcfz.com"),
        ("Phone", "+971 55 226 8127"),
        ("Website", "www.shalomllcfz.com"),
        ("Address", "Sharjah Media City, Sharjah, UAE"),
    ]
    cy = y - 30 * mm
    for label, value in contacts:
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(24 * mm, cy, label.upper())
        c.setFillColor(white)
        c.setFont("Helvetica", 9.5)
        c.drawString(48 * mm, cy, value)
        cy -= 7 * mm

    y -= 74 * mm
    c.setFillColor(SLATE)
    c.setFont("Helvetica-Oblique", 8)
    c.drawCentredString(
        PAGE_W / 2,
        y,
        "Thank you for considering SHALOM LLC FZ as your digital development partner.",
    )


def main():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("SHALOM LLC FZ — Digital Services Company Profile")
    c.setAuthor("SHALOM LLC FZ")
    c.setSubject("Company Profile — Digital Development Services")

    total = 6

    page_cover(c)
    c.showPage()

    page_about(c, 2, total)
    c.showPage()

    page_mission(c, 3, total)
    c.showPage()

    page_services(c, 4, total)
    c.showPage()

    page_packages(c, 5, total)
    c.showPage()

    page_leadership_contact(c, 6, total)
    c.showPage()

    c.save()
    print(f"Created: {OUT}")


if __name__ == "__main__":
    main()
