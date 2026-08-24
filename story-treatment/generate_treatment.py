#!/usr/bin/env python3
"""THEN I WILL — cinematic story treatment PDF for a film team."""

from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Flowable,
    HRFlowable,
)

PAGE_W, PAGE_H = letter
MARGIN_L = 0.78 * inch
MARGIN_R = 0.78 * inch
MARGIN_T = 0.95 * inch
MARGIN_B = 0.72 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# Palette
INK = HexColor("#1A1612")
INK_SOFT = HexColor("#3A342C")
MUTED = HexColor("#6B6358")
IVORY = HexColor("#F6F1E8")
IVORY_DEEP = HexColor("#EDE6D8")
NEAR_BLACK = HexColor("#0C0B0A")
CHARCOAL = HexColor("#161412")
GOLD = HexColor("#C4A35A")
GOLD_DIM = HexColor("#9A7B3C")
CRIMSON = HexColor("#7A1F1F")
CRIMSON_DEEP = HexColor("#5C1616")
SLATE = HexColor("#2C3338")
WARM_DARK = HexColor("#2A1C16")
BOX_MYSTERY_BG = HexColor("#F3E6DC")
BOX_REVEAL_BG = HexColor("#EFE4C8")
BOX_INSIGHT_BG = HexColor("#E7EEE8")
GREEN_INK = HexColor("#1F4A38")
RULE = HexColor("#D4CBB8")

FONT_DIR = "/System/Library/Fonts/Supplemental"


def register_fonts():
    pdfmetrics.registerFont(TTFont("Didot", f"{FONT_DIR}/Didot.ttc", subfontIndex=0))
    pdfmetrics.registerFont(TTFont("Didot-Bold", f"{FONT_DIR}/Didot.ttc", subfontIndex=1))
    pdfmetrics.registerFont(TTFont("Didot-Italic", f"{FONT_DIR}/Didot.ttc", subfontIndex=2))
    pdfmetrics.registerFont(TTFont("Georgia", f"{FONT_DIR}/Georgia.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", f"{FONT_DIR}/Georgia Bold.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", f"{FONT_DIR}/Georgia Italic.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-BoldItalic", f"{FONT_DIR}/Georgia Bold Italic.ttf"))
    pdfmetrics.registerFontFamily(
        "Georgia",
        normal="Georgia",
        bold="Georgia-Bold",
        italic="Georgia-Italic",
        boldItalic="Georgia-BoldItalic",
    )
    pdfmetrics.registerFontFamily(
        "Didot",
        normal="Didot",
        bold="Didot-Bold",
        italic="Didot-Italic",
        boldItalic="Didot-Bold",
    )
    # Standard Helvetica keeps small labels readable; TTC Helvetica Neue
    # often maps index 0/1 to UltraLight.
    return "Helvetica", "Helvetica-Bold"


SANS, SANS_BOLD = register_fonts()


def tracked_text(c, text, x_center, y, font, size, tracking, color):
    widths = [c.stringWidth(ch, font, size) for ch in text]
    total = sum(widths) + tracking * max(len(text) - 1, 0)
    x = x_center - total / 2.0
    c.setFillColor(color)
    c.setFont(font, size)
    for ch, w in zip(text, widths):
        c.drawString(x, y, ch)
        x += w + tracking


def draw_h_rule(c, x, y, w, color=GOLD, sw=0.6):
    c.setStrokeColor(color)
    c.setLineWidth(sw)
    c.line(x, y, x + w, y)


class SceneHeader(Flowable):
    def __init__(self, number, title, duration, mode, extra_badge=None):
        super().__init__()
        self.number = f"{int(number):02d}"
        self.title = title.upper()
        self.duration = duration
        self.mode = mode
        self.extra_badge = extra_badge
        self._w = CONTENT_W
        self._h = 78

    def wrap(self, availWidth, availHeight):
        self._w = availWidth
        return self._w, self._h + 6

    def draw(self):
        c = self.canv
        w, h = self._w, self._h
        y = 6
        bg = WARM_DARK if self.mode == "FLASHBACK" else CHARCOAL
        c.setFillColor(bg)
        c.roundRect(0, y, w, h, 5, fill=1, stroke=0)
        c.setFillColor(GOLD if self.mode != "FLASHBACK" else HexColor("#D4B06A"))
        c.rect(0, y, 5, h, fill=1, stroke=0)

        c.setFillColor(GOLD)
        c.setFont(SANS_BOLD, 7.5)
        c.drawString(18, y + h - 18, "SCENE")
        c.setFillColor(white)
        c.setFont("Didot", 22)
        c.drawString(62, y + h - 24, self.number)

        # Time-frame badge
        badge = self.mode
        bw = c.stringWidth(badge, SANS_BOLD, 7) + 16
        bx = w - 16 - bw
        by = y + h - 26
        badge_bg = HexColor("#8A4B22") if self.mode == "FLASHBACK" else SLATE
        c.setFillColor(badge_bg)
        c.roundRect(bx, by, bw, 16, 3, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(SANS_BOLD, 7)
        c.drawString(bx + 8, by + 4.5, badge)

        if self.extra_badge:
            eb = self.extra_badge
            ew = c.stringWidth(eb, SANS_BOLD, 7) + 16
            ex = bx - 8 - ew
            c.setFillColor(CRIMSON)
            c.roundRect(ex, by, ew, 16, 3, fill=1, stroke=0)
            c.setFillColor(GOLD)
            c.setFont(SANS_BOLD, 7)
            c.drawString(ex + 8, by + 4.5, eb)

        c.setFillColor(white)
        c.setFont("Didot", 13)
        title = self.title
        max_tw = w - 36
        while c.stringWidth(title, "Didot", 13) > max_tw and len(title) > 4:
            title = title[:-1]
        c.drawString(18, y + 28, title)

        c.setFillColor(GOLD)
        c.setFont(SANS, 8)
        c.drawString(18, y + 12, f"Approximate duration  ·  {self.duration}")


class Callout(Flowable):
    def __init__(self, kind, title, body_paras):
        super().__init__()
        self.kind = kind
        self.title = title
        self.body_paras = body_paras
        self._w = CONTENT_W
        self._inner = None
        self._h = 40

    def wrap(self, availWidth, availHeight):
        self._w = availWidth
        inner_w = availWidth - 28
        styles = make_styles()
        body_style = {
            "mystery": styles["callout_mystery"],
            "reveal": styles["callout_reveal"],
            "insight": styles["callout_insight"],
            "quote": styles["callout_quote"],
        }[self.kind]
        flows = [Paragraph(self.title, styles["callout_label"])]
        for b in self.body_paras:
            flows.append(Paragraph(b, body_style))
        data = [["", flows]]
        bar = 4
        t = Table(data, colWidths=[bar, inner_w])
        bg = {
            "mystery": BOX_MYSTERY_BG,
            "reveal": BOX_REVEAL_BG,
            "insight": BOX_INSIGHT_BG,
            "quote": HexColor("#F1EBE0"),
        }[self.kind]
        bar_c = {
            "mystery": CRIMSON,
            "reveal": GOLD_DIM,
            "insight": HexColor("#2E6B50"),
            "quote": GOLD_DIM,
        }[self.kind]
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, 0), bar_c),
                    ("BACKGROUND", (1, 0), (1, 0), bg),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (0, 0), 0),
                    ("RIGHTPADDING", (0, 0), (0, 0), 0),
                    ("LEFTPADDING", (1, 0), (1, 0), 12),
                    ("RIGHTPADDING", (1, 0), (1, 0), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        self._inner = t
        iw, ih = t.wrap(availWidth, availHeight)
        self._h = ih
        return availWidth, ih + 8

    def draw(self):
        if self._inner:
            self._inner.drawOn(self.canv, 0, 8)


class CinematicSlug(Flowable):
    def __init__(self, text):
        super().__init__()
        self.text = text
        self._w = CONTENT_W
        self._h = 28

    def wrap(self, availWidth, availHeight):
        self._w = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        tracked_text(c, self.text, self._w / 2.0, 10, SANS_BOLD, 8.5, 1.6, CRIMSON)


class SectionRule(Flowable):
    def __init__(self, label=""):
        super().__init__()
        self.label = label
        self._w = CONTENT_W
        self._h = 22 if label else 14

    def wrap(self, availWidth, availHeight):
        self._w = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        y = 8
        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(0, y, self._w, y)
        if self.label:
            c.setFillColor(MUTED)
            c.setFont(SANS_BOLD, 7)
            c.drawString(0, y + 6, self.label.upper())


def make_styles():
    return {
        "kicker": ParagraphStyle(
            "kicker",
            fontName=SANS_BOLD,
            fontSize=8,
            leading=11,
            textColor=GOLD_DIM,
            alignment=TA_LEFT,
            tracking=1.2,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="Didot",
            fontSize=26,
            leading=30,
            textColor=INK,
            spaceAfter=10,
            spaceBefore=0,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="Didot",
            fontSize=16,
            leading=20,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=8,
        ),
        "logline_label": ParagraphStyle(
            "logline_label",
            fontName=SANS_BOLD,
            fontSize=7.5,
            leading=10,
            textColor=CRIMSON,
            spaceBefore=4,
            spaceAfter=4,
        ),
        "logline": ParagraphStyle(
            "logline",
            fontName="Georgia-Italic",
            fontSize=12,
            leading=18,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Georgia",
            fontSize=10.4,
            leading=15.8,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=9,
        ),
        "body_left": ParagraphStyle(
            "body_left",
            fontName="Georgia",
            fontSize=10.4,
            leading=15.8,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "small": ParagraphStyle(
            "small",
            fontName="Georgia",
            fontSize=9.4,
            leading=13.8,
            textColor=INK_SOFT,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontName=SANS,
            fontSize=8.5,
            leading=13,
            textColor=INK_SOFT,
            alignment=TA_LEFT,
        ),
        "meta_b": ParagraphStyle(
            "meta_b",
            fontName=SANS_BOLD,
            fontSize=8,
            leading=12,
            textColor=CRIMSON,
        ),
        "witness_h": ParagraphStyle(
            "witness_h",
            fontName=SANS_BOLD,
            fontSize=8,
            leading=11,
            textColor=CRIMSON,
            spaceAfter=3,
        ),
        "witness_b": ParagraphStyle(
            "witness_b",
            fontName="Georgia",
            fontSize=9.2,
            leading=13.2,
            textColor=INK,
        ),
        "tl_num": ParagraphStyle(
            "tl_num",
            fontName="Didot",
            fontSize=14,
            leading=16,
            textColor=GOLD_DIM,
            alignment=TA_CENTER,
        ),
        "tl_arrow": ParagraphStyle(
            "tl_arrow",
            fontName="Georgia",
            fontSize=11,
            leading=13,
            textColor=GOLD_DIM,
            alignment=TA_CENTER,
        ),
        "tl_label": ParagraphStyle(
            "tl_label",
            fontName=SANS_BOLD,
            fontSize=7.5,
            leading=10,
            textColor=CRIMSON,
        ),
        "tl_body": ParagraphStyle(
            "tl_body",
            fontName="Georgia",
            fontSize=9.5,
            leading=13.5,
            textColor=INK,
        ),
        "callout_label": ParagraphStyle(
            "callout_label",
            fontName=SANS_BOLD,
            fontSize=7.2,
            leading=10,
            textColor=CRIMSON,
            spaceAfter=4,
        ),
        "callout_mystery": ParagraphStyle(
            "callout_mystery",
            fontName="Georgia",
            fontSize=9.6,
            leading=14,
            textColor=INK,
            spaceAfter=3,
        ),
        "callout_reveal": ParagraphStyle(
            "callout_reveal",
            fontName="Georgia",
            fontSize=9.8,
            leading=14.4,
            textColor=INK,
            spaceAfter=3,
        ),
        "callout_insight": ParagraphStyle(
            "callout_insight",
            fontName="Georgia",
            fontSize=9.6,
            leading=14,
            textColor=INK,
            spaceAfter=3,
        ),
        "callout_quote": ParagraphStyle(
            "callout_quote",
            fontName="Georgia-Italic",
            fontSize=11.5,
            leading=17,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=2,
        ),
        "theme_body": ParagraphStyle(
            "theme_body",
            fontName="Georgia",
            fontSize=11.2,
            leading=17.5,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=11,
        ),
        "theme_q": ParagraphStyle(
            "theme_q",
            fontName="Didot-Italic",
            fontSize=16,
            leading=22,
            textColor=CRIMSON_DEEP,
            alignment=TA_CENTER,
            spaceBefore=8,
            spaceAfter=8,
        ),
        "footer_note": ParagraphStyle(
            "footer_note",
            fontName="Georgia-Italic",
            fontSize=9.5,
            leading=14,
            textColor=INK_SOFT,
            alignment=TA_CENTER,
        ),
        "index_cell": ParagraphStyle(
            "index_cell",
            fontName="Georgia",
            fontSize=8.4,
            leading=11.5,
            textColor=INK,
        ),
        "index_num": ParagraphStyle(
            "index_num",
            fontName=SANS_BOLD,
            fontSize=8,
            leading=11,
            textColor=CRIMSON,
            alignment=TA_CENTER,
        ),
        "index_mode": ParagraphStyle(
            "index_mode",
            fontName=SANS,
            fontSize=7,
            leading=10,
            textColor=MUTED,
        ),
        "list_item": ParagraphStyle(
            "list_item",
            fontName="Georgia",
            fontSize=10.4,
            leading=15.4,
            textColor=INK,
        ),
        "caption": ParagraphStyle(
            "caption",
            fontName=SANS,
            fontSize=7.5,
            leading=10,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceBefore=2,
            spaceAfter=8,
        ),
    }


def on_title(c, doc):
    c.saveState()
    c.setFillColor(NEAR_BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Fine frame
    c.setStrokeColor(HexColor("#2A241C"))
    c.setLineWidth(0.8)
    c.rect(28, 28, PAGE_W - 56, PAGE_H - 56, fill=0, stroke=1)
    c.setStrokeColor(GOLD_DIM)
    c.setLineWidth(0.35)
    c.rect(34, 34, PAGE_W - 68, PAGE_H - 68, fill=0, stroke=1)

    cx = PAGE_W / 2.0
    tracked_text(c, "STORY TREATMENT", cx, PAGE_H - 92, SANS_BOLD, 8, 3.2, GOLD)
    draw_h_rule(c, cx - 70, PAGE_H - 108, 140, GOLD, 0.5)

    tracked_text(c, "THEN I WILL", cx, PAGE_H / 2 + 46, "Didot", 42, 3.4, white)
    draw_h_rule(c, cx - 90, PAGE_H / 2 + 28, 180, GOLD, 0.6)
    tracked_text(
        c,
        "A THIRTY-MINUTE MYSTERY THRILLER",
        cx,
        PAGE_H / 2 + 10,
        SANS,
        8.5,
        1.8,
        GOLD,
    )

    # Epigraph
    c.setFillColor(HexColor("#C9BEAE"))
    c.setFont("Didot-Italic", 12)
    epigraph = '"But what if nobody punishes them?"'
    c.drawCentredString(cx, PAGE_H / 2 - 48, epigraph)
    c.setFillColor(MUTED)
    c.setFont(SANS, 7.5)
    c.drawCentredString(cx, PAGE_H / 2 - 66, "THE QUESTION AT THE HEART OF THE FILM")

    # Bottom meta
    draw_h_rule(c, cx - 110, 118, 220, HexColor("#3A3228"), 0.4)
    c.setFillColor(GOLD)
    c.setFont(SANS_BOLD, 7.5)
    c.drawCentredString(cx, 92, "RUNTIME  ·  APPROXIMATELY 30 MINUTES")
    c.setFillColor(HexColor("#A89B88"))
    c.setFont(SANS, 7.5)
    c.drawCentredString(cx, 76, "GENRE  ·  MYSTERY THRILLER")
    c.drawCentredString(cx, 60, "FORM  ·  DETAILED STORY TREATMENT  ·  NOT A SHOOTING SCRIPT")
    c.setFillColor(GOLD_DIM)
    c.setFont(SANS, 7)
    c.drawCentredString(cx, 42, "CONFIDENTIAL  —  FOR FILM TEAM USE")
    c.restoreState()


def on_interior(c, doc):
    c.saveState()
    c.setFillColor(IVORY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Left accent
    c.setFillColor(CRIMSON_DEEP)
    c.rect(0, 0, 6, PAGE_H, fill=1, stroke=0)

    # Header
    c.setFillColor(INK)
    c.setFont("Didot", 9)
    c.drawString(MARGIN_L, PAGE_H - 36, "THEN I WILL")
    c.setFillColor(MUTED)
    c.setFont(SANS, 7)
    c.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 36, "STORY TREATMENT")
    draw_h_rule(c, MARGIN_L, PAGE_H - 44, CONTENT_W, RULE, 0.45)

    # Footer
    display = doc.page - 1
    draw_h_rule(c, MARGIN_L, 42, CONTENT_W, RULE, 0.45)
    c.setFillColor(MUTED)
    c.setFont(SANS, 7)
    c.drawString(MARGIN_L, 28, "CONFIDENTIAL  ·  FILM TEAM")
    c.setFillColor(CRIMSON)
    c.setFont("Didot", 10)
    c.drawCentredString(PAGE_W / 2.0, 27, str(display) if display > 0 else "")
    c.setFillColor(MUTED)
    c.setFont(SANS, 7)
    c.drawRightString(PAGE_W - MARGIN_R, 28, "APPROX. 30 MINUTES")
    c.restoreState()


def on_theme(c, doc):
    on_interior(c, doc)


def P(text, style="body"):
    styles = make_styles()
    return Paragraph(text, styles[style])


def scene_keep(*flowables):
    return KeepTogether(list(flowables))


def witness_table():
    styles = make_styles()
    cards = [
        (
            "WITNESS 1",
            "Saw the murderer with a gun and heard the gunshot.",
        ),
        (
            "WITNESS 2",
            "Saw the murderer with a knife.",
        ),
        (
            "WITNESS 3",
            "Did not see the killing clearly, but saw someone running away.",
        ),
        (
            "WITNESS 4",
            "Saw the victim shortly before the attack, and saw the murderer approaching.",
        ),
    ]
    cells = []
    for title, body in cards:
        inner = [
            Paragraph(title, styles["witness_h"]),
            Paragraph(body, styles["witness_b"]),
        ]
        cells.append(inner)
    data = [[cells[0], cells[1]], [cells[2], cells[3]]]
    col = (CONTENT_W - 8) / 2.0
    t = Table(data, colWidths=[col, col], hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), white),
                ("BOX", (0, 0), (0, 0), 0.4, RULE),
                ("BOX", (1, 0), (1, 0), 0.4, RULE),
                ("BOX", (0, 1), (0, 1), 0.4, RULE),
                ("BOX", (1, 1), (1, 1), 0.4, RULE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("RIGHTPADDING", (0, 0), (0, -1), 14),
                ("LEFTPADDING", (1, 0), (1, -1), 14),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("TOPPADDING", (0, 1), (-1, 1), 12),
            ]
        )
    )
    return t


def evidence_list():
    styles = make_styles()
    items = [
        "A gun / bullet",
        "A knife",
        "A partial footprint",
        "A small personal item",
        "Other physical clues",
    ]
    return ListFlowable(
        [ListItem(Paragraph(i, styles["list_item"]), leftIndent=8, bulletColor=CRIMSON) for i in items],
        bulletType="bullet",
        start="•",
        leftIndent=16,
        bulletFontName=SANS_BOLD,
        bulletFontSize=9,
        spaceBefore=2,
        spaceAfter=8,
    )


def timeline_table():
    styles = make_styles()
    rows_src = [
        ("04", "WITNESS 4", "Sees the victim shortly before the attack, and sees the murderer approaching."),
        ("01", "WITNESS 1", "Sees the murderer with a gun and hears the gunshot."),
        ("02", "WITNESS 2", "Sees the murderer with a knife during the struggle."),
        ("03", "WITNESS 3", "Sees someone running away. The killer escapes."),
    ]
    data = []
    for i, (num, label, body) in enumerate(rows_src):
        data.append(
            [
                Paragraph(num, styles["tl_num"]),
                [Paragraph(label, styles["tl_label"]), Paragraph(body, styles["tl_body"])],
            ]
        )
        if i < len(rows_src) - 1:
            data.append(
                [
                    Paragraph("|", styles["tl_arrow"]),
                    Paragraph("The same crime continues. A different moment. A different place.", styles["caption"]),
                ]
            )
    t = Table(data, colWidths=[36, CONTENT_W - 36], hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (-1, 0), HexColor("#EFE8DC")),
                ("BACKGROUND", (0, 2), (-1, 2), HexColor("#EFE8DC")),
                ("BACKGROUND", (0, 4), (-1, 4), HexColor("#EFE8DC")),
                ("BACKGROUND", (0, 6), (-1, 6), HexColor("#EFE8DC")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("BOX", (0, 0), (-1, -1), 0.4, RULE),
                ("LINEBELOW", (0, 0), (-1, -2), 0.3, RULE),
            ]
        )
    )
    return t


def meaning_table():
    styles = make_styles()
    child = ParagraphStyle(
        "mean_h",
        fontName=SANS_BOLD,
        fontSize=7.5,
        leading=10,
        textColor=CRIMSON,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    q = ParagraphStyle(
        "mean_q",
        fontName="Georgia-Italic",
        fontSize=10.5,
        leading=15,
        textColor=INK,
        alignment=TA_CENTER,
    )
    data = [
        [
            [Paragraph("AS A CHILD", child), Paragraph('"What if nobody punishes them?"', q)],
            [Paragraph("AS AN ADULT", child), Paragraph('"Then I will."', q)],
        ]
    ]
    t = Table(data, colWidths=[CONTENT_W / 2.0, CONTENT_W / 2.0], hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), BOX_MYSTERY_BG),
                ("BACKGROUND", (1, 0), (1, 0), BOX_REVEAL_BG),
                ("BOX", (0, 0), (0, 0), 0.4, RULE),
                ("BOX", (1, 0), (1, 0), 0.4, RULE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 14),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ]
        )
    )
    return t


def index_table():
    styles = make_styles()
    rows = [
        ("01", "The Pension &amp; The Father's Murder", "4 min", "Present Day"),
        ("02", "The Family Flashback", "2 min", "Flashback"),
        ("03", "The Victim Is Killed", "4 min", "Present Day"),
        ("04", "Detective Arrives", "3 min", "Present Day"),
        ("05", "The Four Witnesses", "5 min", "Present Day"),
        ("06", "Investigation &amp; The Victim's Dark Past", "2 min", "Present Day"),
        ("07", "The Detective Gives Up", "2 min", "Present Day"),
        ("08", "The Breakthrough", "2 min", "Present Day"),
        ("09", "The Final Flashback: David &amp; Saul", "3 min", "Flashback"),
        ("10", "The Murderer Revealed", "2 min", "Present Day  ·  Reveal"),
        ("11", "Detective Confronts the Son", "2 min", "Present Day"),
        ("12", "Ending", "1–2 min", "Present Day"),
    ]
    header = [
        Paragraph("NO.", styles["index_num"]),
        Paragraph("SCENE", styles["meta_b"]),
        Paragraph("TIME", styles["meta_b"]),
        Paragraph("TIME FRAME", styles["meta_b"]),
    ]
    data = [header]
    for n, title, dur, mode in rows:
        data.append(
            [
                Paragraph(n, styles["index_num"]),
                Paragraph(title, styles["index_cell"]),
                Paragraph(dur, styles["index_cell"]),
                Paragraph(mode, styles["index_mode"]),
            ]
        )
    t = Table(data, colWidths=[32, CONTENT_W - 32 - 58 - 92, 58, 92], hAlign="LEFT")
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HexColor("#E8DFD0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -2), 0.3, RULE),
        ("BOX", (0, 0), (-1, -1), 0.4, RULE),
    ]
    for i in range(1, 13):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), white))
        else:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), HexColor("#FBF7F0")))
    t.setStyle(TableStyle(style_cmds))
    return t


def meta_grid():
    styles = make_styles()
    pairs = [
        ("GENRE", "Mystery Thriller"),
        ("RUNTIME", "Approximately 30 minutes"),
        ("FORM", "Detailed story treatment — not a dialogue screenplay"),
        ("STRUCTURE", "Present-day investigation with two childhood flashbacks"),
        ("MYSTERY ENGINE", "Four unrelated witnesses. One crime. Incomplete sight."),
        ("THEMATIC CORE", "David and Saul  ·  “Vengeance is mine; I will repay.”"),
    ]
    data = []
    for k, v in pairs:
        data.append([Paragraph(k, styles["meta_b"]), Paragraph(v, styles["meta"])])
    t = Table(data, colWidths=[118, CONTENT_W - 118], hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LINEBELOW", (0, 0), (-1, -2), 0.25, RULE),
            ]
        )
    )
    return t


def build_story():
    S = make_styles()
    story = []
    story.append(NextPageTemplate("interior"))
    story.append(PageBreak())

    # ----- PREMISE -----
    story.append(Paragraph("STORY PREMISE", S["kicker"]))
    story.append(Paragraph("THEN I WILL", S["h1"]))
    story.append(Paragraph("LOGLINE", S["logline_label"]))
    story.append(
        Paragraph(
            "A feared man who stole pensions is murdered in a confusing attack. "
            "Four witnesses describe four different crimes. A detective must assemble "
            "the fragments of a single truth — while a childhood question about justice "
            "waits in the dark.",
            S["logline"],
        )
    )
    story.append(Paragraph("PREMISE", S["logline_label"]))
    story.append(
        P(
            "For years, a powerful and influential man has run a pension scam against poor "
            "and vulnerable people. When a dying father goes to him to claim the money he needs "
            "for cancer treatment, he is refused, humiliated, and later killed. The father never "
            "returns home. His son discovers the truth — and learns that his father was not the only victim."
        )
    )
    story.append(
        P(
            "Soon after, the powerful man is killed. The attack is chaotic and incomplete "
            "in the eyes of those who see it: a gun, a gunshot, a knife, a struggle, an escape. "
            "No one sees the whole crime. A detective arrives to a scene that does not make "
            "sense, and to four unrelated witnesses whose stories appear to contradict one another."
        )
    )
    story.append(
        P(
            "The investigation leads into the victim’s dark past and toward a grieving family. "
            "But the truth of the murder is not only a matter of evidence. It is a matter of belief — "
            "of a Bible story about David and Saul, of a father’s warning to leave vengeance to God, "
            "and of a child’s question that no one could answer."
        )
    )
    story.append(
        Callout(
            "quote",
            "THE QUESTION",
            ['<font color="#7A1F1F"><i>“But what if nobody punishes them?”</i></font>'],
        )
    )
    story.append(Spacer(1, 8))
    story.append(Paragraph("PRODUCTION NOTES", S["logline_label"]))
    story.append(meta_grid())
    story.append(Spacer(1, 8))
    story.append(
        P(
            "This treatment is written in story order and preserves the audience’s delayed "
            "understanding of the killer’s identity. Present-day scenes and flashbacks are "
            "clearly marked. Mystery boxes flag unanswered questions. The audience should "
            "only fully understand the truth of the murder near the final reveal.",
            "small",
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        KeepTogether(
            [
                Paragraph("SCENE BREAKDOWN", S["logline_label"]),
                Paragraph(
                    "Twelve scenes. Present-day investigation, two childhood flashbacks, and a delayed reveal.",
                    S["small"],
                ),
                index_table(),
                Paragraph(
                    "Total running time approximately 30 minutes. Scene 12 is designed to play at 1–2 minutes.",
                    S["caption"],
                ),
            ]
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        KeepTogether(
            [
                Paragraph("HOW TO READ THIS TREATMENT", S["logline_label"]),
                P(
                    "<b>Present Day</b> scenes carry the investigation. <b>Flashback</b> scenes return to the son’s childhood. "
                    "The first flashback is emotional only. The second flashback reveals the David and Saul teaching and the childhood question."
                ),
                P(
                    "<b>Mystery</b> boxes mark questions the audience should still be holding. "
                    "<b>Insight</b> boxes mark the detective’s turning points. "
                    "The <b>Reveal</b> badge appears only in Scene 10, when the audience is finally allowed to see the complete murder and understand what the childhood question has become."
                ),
                P(
                    "Until that reveal, protect the attacker’s face, keep the four-witness contradiction intact, "
                    "and do not let the childhood question become the adult answer too soon.",
                    "small",
                ),
            ]
        )
    )

    # ----- SCENE 1 -----
    story.append(PageBreak())
    story.append(
        scene_keep(
            SceneHeader(1, "The Pension & The Father's Murder", "4 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P(
                "The victim is a powerful and influential man who has been running a pension scam "
                "for years. He takes advantage of poor and vulnerable people who depend on their "
                "pension money."
            ),
            P(
                "A father is suffering from cancer. He urgently needs his pension money for his "
                "treatment and for the family’s expenses."
            ),
            P(
                "The father goes to the powerful man and asks for the pension amount that belongs to him. "
                "The powerful man refuses to give him the money. He humiliates him and tells him to leave."
            ),
            P("The father returns home disappointed."),
            P(
                "Later, the father goes back to the powerful man’s place one final time, hoping to "
                "convince him to release the pension money. The powerful man becomes angry and kills the father."
            ),
            P("The father never returns home. The family is devastated."),
            P(
                "The son eventually discovers that his father was killed by the powerful man. "
                "As he investigates what happened, he also discovers that his father was not the only victim. "
                "The powerful man has been running the same scam against many people. Several families have "
                "lost their pension money, and some people have suffered badly because of him."
            ),
            P(
                "Because of his wealth, influence, and connections, everyone is afraid to stand against him."
            ),
            P(
                "The murder of the son’s father becomes the reason a desire for revenge begins to take shape. "
                "The scene ends with the son standing at a distance, looking at the powerful man, now knowing the truth."
            ),
            Spacer(1, 4),
            Callout(
                "mystery",
                "STORY NOTE  ·  DO NOT SHOW THE SON’S DECISION TO KILL",
                [
                    "Do not show the son deciding to kill. End the scene with the son discovering the truth "
                    "about his father’s death, then looking at the powerful man from a distance. "
                    "The audience should wonder what he will do next."
                ],
            ),
        )
    )

    # ----- SCENE 2 -----
    story.append(Spacer(1, 16))
    story.append(
        scene_keep(
            SceneHeader(2, "The Family Flashback", "2 minutes", "FLASHBACK"),
            Spacer(1, 10),
            P(
                "We leave the present and return to a happier time from the son’s childhood."
            ),
            P(
                "The son, the father, and the mother are together at home. The father is already "
                "struggling with health problems, but the family still spends time together. "
                "The father is loving and protective toward his son. The scene establishes their "
                "close relationship."
            ),
            P(
                "We also see that the family has always struggled financially. Even so, the son "
                "deeply respects his father."
            ),
            P(
                "This scene is mainly emotional. It is about love, memory, and the bond that will "
                "later make the father’s death unbearable."
            ),
            Callout(
                "mystery",
                "WITHHOLD",
                [
                    "Do not reveal the Bible story yet. David and Saul are saved for the final flashback. "
                    "After the emotion of this scene, cut back to the present."
                ],
            ),
        )
    )

    # ----- SCENE 3 -----
    story.append(PageBreak())
    story.append(
        scene_keep(
            SceneHeader(3, "The Victim Is Killed", "4 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P(
                "Someone goes to the powerful man’s location. This is not a visit to ask for a pension. "
                "There is no argument. This visit is not a negotiation. It is connected to the father’s murder."
            ),
            P("The powerful man is unaware of what is about to happen."),
            P("He is attacked."),
            P(
                "The murder is shown mainly from the victim’s perspective and from surrounding "
                "perspectives. The attacker’s face is never clearly revealed."
            ),
            P("The sequence contains confusing elements. The audience sees pieces, not the whole:"),
        )
    )
    story.append(
        P(
            "The victim sees a gun.<br/>"
            "A gunshot is heard.<br/>"
            "The victim struggles.<br/>"
            "A knife appears.<br/>"
            "The victim falls.<br/>"
            "The killer escapes.",
            "body_left",
        )
    )
    story.append(
        P(
            "The audience does not see the complete sequence. The crime is broken, incomplete, "
            "and difficult to hold in one picture."
        )
    )
    story.append(
        Callout(
            "mystery",
            "MYSTERY  ·  THE CRIME REMAINS UNFINISHED IN THE MIND",
            [
                "<b>Who was the killer?</b>",
                "<b>How exactly did the victim die?</b>",
                "These questions remain unanswered. Protect the attacker’s face. Do not let the "
                "audience assemble the full murder yet.",
            ],
        )
    )

    # ----- SCENE 4 -----
    story.append(Spacer(1, 16))
    story.append(
        scene_keep(
            SceneHeader(4, "Detective Arrives", "3 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P(
                "The detective arrives at the crime scene. He examines the body and the surroundings."
            ),
            P("He finds:"),
            evidence_list(),
            P(
                "The evidence does not immediately make sense. A gun and a knife. A partial footprint. "
                "A small personal item whose meaning is not yet clear. The detective begins investigating."
            ),
            Callout(
                "mystery",
                "MYSTERY  ·  THE PHYSICAL CLUES",
                [
                    "The scene should feel like a puzzle with extra pieces. Nothing here should "
                    "solve the case. The small personal item is important — but not yet named."
                ],
            ),
        )
    )

    # ----- SCENE 5 -----
    story.append(PageBreak())
    story.append(SceneHeader(5, "The Four Witnesses", "5 minutes", "PRESENT DAY"))
    story.append(Spacer(1, 10))
    story.append(
        P(
            "The detective discovers that four unrelated people witnessed different parts of the murder. "
            "None of them knows that the others were there."
        )
    )
    story.append(witness_table())
    story.append(Spacer(1, 8))
    story.append(
        P(
            "The detective interviews them separately. Their stories appear to contradict one another."
        )
    )
    story.append(
        P(
            "One says: gun.<br/>"
            "Another says: knife.<br/>"
            "Another gives a different escape direction.",
            "body_left",
        )
    )
    story.append(
        P(
            "The detective starts wondering: was there more than one person?"
        )
    )
    story.append(
        Callout(
            "mystery",
            "MYSTERY  ·  KEEP THE FOUR-WITNESS PROBLEM INTACT",
            [
                "Four people. Four versions. One crime. The contradiction must feel real. "
                "Do not explain the geography yet. Let the detective — and the audience — "
                "believe the stories may not belong to the same act."
            ],
        )
    )

    # ----- SCENE 6 -----
    story.append(Spacer(1, 16))
    story.append(
        scene_keep(
            SceneHeader(6, "Investigation & The Victim's Dark Past", "2 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P(
                "The detective investigates the victim. He discovers that the victim had been "
                "exploiting people for years. He had withheld pension money from several people. "
                "Many people were afraid of him because of his influence."
            ),
            P(
                "The detective finds several people who had reasons to hate him. The list of possible "
                "enemies is long enough to keep the case open."
            ),
            P(
                "Then he discovers the connection between the victim and one family. The son’s father "
                "had gone to this man for pension money, and had been killed. The son had been looking "
                "into what happened."
            ),
            P(
                "Now the son becomes a possible suspect. But there is still not enough evidence to "
                "prove that he is the murderer."
            ),
            Callout(
                "mystery",
                "SUSPICION  ·  NOT CONFIRMATION",
                [
                    "The son enters the case as one name among others, then as a strong possible suspect. "
                    "He is not proven. The audience may begin to wonder. They should not yet fully understand."
                ],
            ),
        )
    )

    # ----- SCENE 7 -----
    story.append(PageBreak())
    story.append(
        scene_keep(
            SceneHeader(7, "The Detective Gives Up", "2 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P("The detective becomes frustrated."),
            P(
                "The four witnesses are giving different versions. The physical evidence seems contradictory. "
                "He cannot understand how four people can see the same murder but describe completely "
                "different things."
            ),
            P("He feels that he has failed."),
            P(
                "He goes to church and attends Mass. During the priest’s speech, he hears an idea about "
                "how people can see different pieces of the same truth without seeing the whole picture."
            ),
            P(
                "This triggers something in his mind. He thinks about the four witnesses."
            ),
            Callout(
                "insight",
                "TURNING POINT  ·  FRAGMENTS OF THE SAME TRUTH",
                [
                    "The church does not solve the case. It changes how the detective looks at testimony. "
                    "Four people may be telling the truth — and still not be describing the same moment."
                ],
            ),
        )
    )

    # ----- SCENE 8 -----
    story.append(
        KeepTogether(
            [
                Spacer(1, 16),
                SceneHeader(8, "The Breakthrough", "2 minutes", "PRESENT DAY"),
                Spacer(1, 10),
                P(
                    "The detective suddenly realizes: the witnesses are not contradicting each other. "
                    "They were standing in different places. Each person saw only a different moment of "
                    "the same murder."
                ),
                Paragraph("RECONSTRUCTED TIMELINE", S["logline_label"]),
                timeline_table(),
                Spacer(1, 8),
            ]
        )
    )
    story.append(
        P(
            "Now everything begins to fit. The detective realizes there was only one murderer."
        )
    )
    story.append(
        P(
            "He connects the physical evidence to the son’s movements. The small personal item "
            "found at the crime scene belongs to the son."
        )
    )
    story.append(
        P(
            "The detective now knows who he must confront. He believes he has identified the person "
            "responsible. But he still does not fully understand why it was done."
        )
    )
    story.append(
        Callout(
            "insight",
            "BREAKTHROUGH  ·  ONE MURDERER  ·  FOUR ANGLES",
            [
                "Solve the witness puzzle here. Let the detective connect the personal item and the "
                "son’s movements. Do not yet show the complete murder. Do not yet give the audience "
                "the full meaning. The why is still missing. The face of the act is still incomplete."
            ],
        )
    )

    # ----- SCENE 9 -----
    story.append(PageBreak())
    story.append(
        scene_keep(
            SceneHeader(9, "The Final Flashback: David & Saul", "3 minutes", "FLASHBACK"),
            Spacer(1, 10),
            P(
                "Now we finally reveal the son’s deeper psychological connection. We return to his childhood."
            ),
            P(
                "The father is sitting with the young son and reading the story of David and Saul from the Bible. "
                "The father explains that Saul had wronged David and wanted to kill him. David had opportunities "
                "to kill Saul and take revenge. But David refused."
            ),
        )
    )
    story.append(
        Callout(
            "quote",
            "THE FATHER’S TEACHING",
            [
                '“Vengeance is mine; I will repay, saith the Lord.”',
            ],
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        P(
            "The father teaches his son: when someone harms you, do not become violent in return. "
            "God sees everything, and everyone will eventually face the consequences of their actions."
        )
    )
    story.append(P("The young son listens carefully."))
    story.append(P("Then he asks:"))
    story.append(
        Callout(
            "quote",
            "THE CHILDHOOD QUESTION",
            [
                '“But what if nobody punishes them?”',
            ],
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        P(
            "The father becomes silent. He does not have a perfect answer. He tells his son to trust God "
            "and never become like the person who does wrong."
        )
    )
    story.append(P("The scene ends."))
    story.append(CinematicSlug("CUT TO BLACK"))

    # ----- SCENE 10 -----
    story.append(
        KeepTogether(
            [
                Spacer(1, 10),
                SceneHeader(
                    10,
                    "The Murderer Revealed",
                    "2 minutes",
                    "PRESENT DAY",
                    extra_badge="REVEAL",
                ),
                Spacer(1, 10),
                P(
                    "Immediately after the childhood question, we cut to the adult son. "
                    "This is the first time the audience is allowed to see the complete murder."
                ),
                CinematicSlug("CUT TO THE ADULT SON"),
            ]
        )
    )
    story.append(
        P(
            "The son comes to the victim. There is no argument about the pension. There is no negotiation. "
            "He has already decided. He is there because of his father’s murder."
        )
    )
    story.append(
        P(
            "We now see the missing parts of the murder that the audience did not see earlier. "
            "The gunshot. The struggle. The knife. The victim’s death. The son escapes."
        )
    )
    story.append(
        Callout(
            "reveal",
            "REVEAL  ·  THE AUDIENCE UNDERSTANDS AT LAST",
            [
                "The son was the murderer.",
                "Hold this until now. The four witnesses were each telling the truth. The earlier "
                "fragments were one act, seen from four places. Only here should the audience fully "
                "understand who committed the crime — and what the childhood question has become.",
            ],
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        P(
            "The childhood question suddenly has a completely different meaning."
        )
    )
    story.append(meaning_table())

    # ----- SCENE 11 -----
    story.append(PageBreak())
    story.append(
        scene_keep(
            SceneHeader(11, "Detective Confronts the Son", "2 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P("The detective finds the son. He explains how he solved the case."),
            P(
                "The four witnesses were each telling the truth. They had simply seen different parts "
                "of the murder. The physical evidence connected the son to the crime. The pension scam "
                "and the father’s killing provided the background."
            ),
            P("The detective confronts him with everything."),
            P(
                "The son finally admits that he killed the victim. He was not there for the pension money. "
                "He wanted revenge for his father. He believed the victim had killed his father, destroyed "
                "his family’s life, and escaped justice."
            ),
            P("His belief was simple:"),
        )
    )
    story.append(
        Callout(
            "quote",
            "THE SON’S ANSWER",
            [
                '“If nobody was going to punish him, I had to.”',
            ],
        )
    )

    # ----- SCENE 12 -----
    story.append(Spacer(1, 16))
    story.append(
        scene_keep(
            SceneHeader(12, "Ending", "1–2 minutes", "PRESENT DAY"),
            Spacer(1, 10),
            P("The son is arrested."),
            P(
                "The detective looks through the victim’s records and sees the names of many people "
                "who had suffered because of him. The detective understands that the victim was not innocent. "
                "But the son also crossed a line. He wanted to stop someone who caused violence, but he chose "
                "violence himself."
            ),
            P(
                "The final image can be the Bible that belonged to his father."
            ),
            P("The detective closes the case file."),
            Callout(
                "insight",
                "FINAL IMAGE",
                [
                    "The father’s Bible remains in the room after the case is closed. The teaching is still there. "
                    "The son is not. The question is what remains."
                ],
            ),
        )
    )

    # ----- THEME -----
    story.append(NextPageTemplate("theme"))
    story.append(PageBreak())
    story.append(Paragraph("FINAL THEME", S["kicker"]))
    story.append(Paragraph("The Tragedy of the Answer", S["h1"]))
    story.append(
        Paragraph(
            "He was taught to leave vengeance to God. But when he saw that nobody was punishing "
            "the man who destroyed his family, he decided to become the punishment himself.",
            S["theme_body"],
        )
    )
    story.append(
        Paragraph(
            "The childhood question remains the heart of the movie:",
            S["theme_body"],
        )
    )
    story.append(
        Paragraph(
            "“But what if nobody punishes them?”",
            S["theme_q"],
        )
    )
    story.append(
        Paragraph(
            "The tragedy is that the son eventually became the answer.",
            S["theme_body"],
        )
    )
    story.append(Spacer(1, 8))
    story.append(SectionRule())
    story.append(Spacer(1, 10))
    story.append(Paragraph("WHAT THE FILM IS SAYING", S["logline_label"]))
    story.append(
        Paragraph(
            "The father taught David’s restraint: Saul had wronged David, and David still refused revenge. "
            "<i>Vengeance is mine; I will repay, saith the Lord.</i> The son learned the words. He did not "
            "learn how to live with the silence that follows them.",
            S["theme_body"],
        )
    )
    story.append(
        Paragraph(
            "The victim was not innocent. He had stolen pensions, harmed the weak, and shown no remorse. "
            "The detective sees the names of many people who suffered because of him. Justice had failed "
            "those people. That failure is real.",
            S["theme_body"],
        )
    )
    story.append(
        Paragraph(
            "The son’s crime is also real. He wanted to stop a man who caused harm, and he chose harm. "
            "He believed that if nobody was going to punish the man, he had to. In answering his own "
            "childhood question, he became the thing his father warned him never to become.",
            S["theme_body"],
        )
    )
    story.append(
        Callout(
            "quote",
            "END ON THE QUESTION  ·  NOT ON TRIUMPH",
            [
                "The film should not celebrate the murder. It should leave the audience with the father’s "
                "silence, the son’s answer, and the cost of becoming punishment itself.",
            ],
        )
    )
    story.append(Spacer(1, 18))
    story.append(
        Paragraph(
            "THEN I WILL  ·  A THIRTY-MINUTE MYSTERY THRILLER  ·  STORY TREATMENT",
            S["footer_note"],
        )
    )
    story.append(
        Paragraph(
            "End of treatment.",
            S["caption"],
        )
    )
    return story


def main():
    out = "/Users/ind040100446/Documents/GitHub/pms-dms/story-treatment/THEN_I_WILL_Story_Treatment.pdf"
    doc = BaseDocTemplate(
        out,
        pagesize=letter,
        title="THEN I WILL — Story Treatment",
        author="Story Treatment",
        subject="A 30-Minute Mystery Thriller",
        creator="THEN I WILL Story Treatment",
    )
    title_frame = Frame(0, 0, PAGE_W, PAGE_H, id="title", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    interior_frame = Frame(
        MARGIN_L,
        MARGIN_B,
        CONTENT_W,
        PAGE_H - MARGIN_T - MARGIN_B,
        id="interior",
        showBoundary=0,
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="title", frames=title_frame, onPage=on_title),
            PageTemplate(id="interior", frames=interior_frame, onPage=on_interior),
            PageTemplate(id="theme", frames=interior_frame, onPage=on_theme),
        ]
    )
    doc.build(build_story())
    print(out)


if __name__ == "__main__":
    main()
