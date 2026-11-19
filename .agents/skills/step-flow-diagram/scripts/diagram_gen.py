#!/usr/bin/env python3
"""단계형 다이어그램 생성기 (슬레이트 + 레드 강조 통일)

JSON 입력 -> 내용 양에 맞춰 두 레이아웃 중 하나로 자동 배치해 SVG(+PNG)로 저장합니다.
  - groups : 단계 묶음(박스) 세로 나열형   (묶음 4개 이하, 묶음당 6단계 이하일 때)
  - table  : 표 + 타임라인형              (그 외 내용이 많을 때, 단계 수 제한 없음)

사용법:
  python3 diagram_gen.py input.json [출력폴더] [--layout auto|groups|table|both] [--name 파일이름] [--no-png]

입력 형식은 sample.json 참고.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

FONT = "'Malgun Gothic','Pretendard','Noto Sans CJK KR','Noto Sans KR',sans-serif"

# 색상 (강조색은 레드 하나로 고정)
INK, MUTE = "#0F172A", "#475569"
PANEL, RULE, ROW = "#F1F5F9", "#CBD5E1", "#E2E8F0"
HI_FILL, HI_STROKE, HI_INK, HI_MUTE, HI_ROW = "#FEE2E2", "#B91C1C", "#7F1D1D", "#B91C1C", "#FEF2F2"
EXT = "#334155"


# ------------------------------------------------------------------ helpers
def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def cw(c, size):
    o = ord(c)
    if (0xAC00 <= o <= 0xD7A3 or 0x3130 <= o <= 0x318F or 0x4E00 <= o <= 0x9FFF
            or 0x3000 <= o <= 0x303F or 0xFF00 <= o <= 0xFFEF):
        return size * 1.0
    if c == " ":
        return size * 0.32
    if c in "·.,:;'|!il()[]-/":
        return size * 0.38
    if c.isupper() or c in "MW":
        return size * 0.68
    if c.isdigit():
        return size * 0.58
    return size * 0.56


def tw(s, size, bold=False):
    return sum(cw(c, size) for c in s) * (1.06 if bold else 1.0)


def fit(s, size, maxw, min_size, bold, warns):
    """글자가 maxw를 넘으면 min_size까지 줄이고, 그래도 넘으면 말줄임."""
    sz = size
    while tw(s, sz, bold) > maxw and sz > min_size:
        sz -= 0.5
    if tw(s, sz, bold) <= maxw:
        return s, sz
    warns.append(f"글자가 길어 말줄임 처리: {s}")
    t = s
    while t and tw(t + "…", sz, bold) > maxw:
        t = t[:-1]
    return t + "…", sz


def txt(x, y, s, size=12, weight="400", fill=INK, anchor="start"):
    return (f'<text x="{x:g}" y="{y:g}" font-size="{size:g}" font-weight="{weight}" '
            f'text-anchor="{anchor}" fill="{fill}">{esc(s)}</text>')


def line(x1, y1, x2, y2, col, sw=1.5, dash=None, marker=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#{marker})"' if marker else ""
    return f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{col}" stroke-width="{sw}"{d}{m}/>'


def rect(x, y, w, h, fill, stroke, rx=3, sw=1.5, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')


def head(w, h):
    markers = "".join(
        f'<marker id="{i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
        f'<path d="M0 1 L9 5 L0 9 z" fill="{c}"/></marker>' for i, c in (("a", MUTE), ("r", HI_STROKE)))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
            f'font-family="{FONT}"><defs>{markers}</defs><rect width="{w:g}" height="{h:g}" fill="#FFFFFF"/>')


def title_block(o, title, w):
    o.append(txt(60, 52, title, 20, "700", INK))
    o.append(line(60, 66, w - 60, 66, RULE, 1))


def legend(o, x, y, has_hi, has_ext, circle=False):
    """범례. y는 항목 중심선."""
    items = []
    if has_hi:
        items.append(("hi", "차단 우선순위"))
    items.append(("base", "일반 단계"))
    if has_ext:
        items.append(("ext", "외부 대상"))
    for kind, label in items:
        if circle:
            if kind == "hi":
                o.append(f'<circle cx="{x + 9:g}" cy="{y:g}" r="6" fill="{HI_STROKE}"/>')
            elif kind == "base":
                o.append(f'<circle cx="{x + 9:g}" cy="{y:g}" r="4" fill="#FFFFFF" stroke="{MUTE}" stroke-width="1.5"/>')
            else:
                o.append(rect(x, y - 6, 18, 12, "none", EXT, 0, 1.5, "4 3"))
        else:
            if kind == "hi":
                o.append(rect(x, y - 6, 18, 12, HI_FILL, HI_STROKE, 2))
            elif kind == "base":
                o.append(rect(x, y - 6, 18, 12, PANEL, MUTE, 2))
            else:
                o.append(rect(x, y - 6, 18, 12, "#FFFFFF", EXT, 2, 1.5, "4 3"))
        o.append(txt(x + 26, y + 4, label, 12, "400", "#334155"))
        x += 26 + tw(label, 12) + 28


def norm(d):
    phases = d.get("phases") or []
    if not phases:
        raise SystemExit("입력에 phases가 없습니다.")
    for p in phases:
        p.setdefault("name", "")
        p["steps"] = [dict(name=s, desc="", hl=False) if isinstance(s, str) else
                      dict(name=s["name"], desc=s.get("desc", ""), hl=bool(s.get("hl"))) for s in p.get("steps", [])]
    return d


def any_hl(d):
    return any(s["hl"] for p in d["phases"] for s in p["steps"])


# ------------------------------------------------------------------ layout 1: groups
def layout_groups(d, warns):
    P = d["phases"]
    n = len(P)
    M = max(len(p["steps"]) for p in P)
    colw = min(340, int((1080 - (n - 1) * 30) / n))
    if n >= 3:
        W = 1200
        gap = (1080 - n * colw) / (n - 1)
    else:
        gap = 30
        W = int(120 + n * colw + (n - 1) * gap)
    ctop, hh = 100, 36
    ch = 50 + 76 * M
    ext = d.get("external")
    bottom = ctop + ch + (36 + 50 if ext else 0)
    leg_y = bottom + 22
    H = leg_y + 34
    o = [head(W, H)]
    title_block(o, d.get("title", ""), W)
    bw = colw - 40
    for gi, p in enumerate(P):
        gx = 60 + gi * (colw + gap)
        o.append(rect(gx, ctop, colw, ch, "#FFFFFF", RULE))
        o.append(rect(gx, ctop, colw, hh, PANEL, RULE))
        hname, hsz = fit(p["name"], 14, colw - 40, 11, True, warns)
        o.append(txt(gx + 20, ctop + 24, hname, hsz, "700", INK))
        for si, s in enumerate(p["steps"]):
            by = ctop + hh + 14 + si * 76
            hi = s["hl"]
            o.append(rect(gx + 20, by, bw, 62, HI_FILL if hi else PANEL, HI_STROKE if hi else MUTE, 3, 2 if hi else 1.5))
            nm, nsz = fit(s["name"], 15, bw - 32, 12, True, warns)
            ny = by + (27 if s["desc"] else 36)
            o.append(txt(gx + 36, ny, nm, nsz, "700", HI_INK if hi else INK))
            if s["desc"]:
                ds, dsz = fit(s["desc"], 12, bw - 32, 10, False, warns)
                o.append(txt(gx + 36, by + 47, ds, dsz, "400", HI_MUTE if hi else MUTE))
            if si > 0:
                o.append(line(gx + colw / 2, by - 14, gx + colw / 2, by - 1, HI_STROKE if hi else MUTE, 1.5,
                              marker="r" if hi else "a"))
        if gi < n - 1:
            o.append(line(gx + colw, ctop + ch / 2, gx + colw + gap - 2, ctop + ch / 2, MUTE, 1.5, marker="a"))
    if ext:
        gx = 60 + (n - 1) * (colw + gap)
        ey = ctop + ch + 36
        o.append(rect(gx + 20, ey, bw, 50, "#FFFFFF", EXT, 3, 1.5, "6 4"))
        o.append(line(gx + colw / 2, ctop + ch, gx + colw / 2, ey - 2, MUTE, 1.5, "6 4", "a"))
        en, esz = fit(ext.get("name", "외부 대상"), 15, bw - 32, 12, True, warns)
        o.append(txt(gx + 36, ey + 21, en, esz, "700", INK))
        if ext.get("desc"):
            ed, edsz = fit(ext["desc"], 12, bw - 32, 10, False, warns)
            o.append(txt(gx + 36, ey + 39, ed, edsz, "400", MUTE))
    legend(o, 60, leg_y + 6, any_hl(d), bool(ext))
    o.append("</svg>")
    return "\n".join(o)


# ------------------------------------------------------------------ layout 2: table
def layout_table(d, warns):
    P = d["phases"]
    W = 1200
    ext = d.get("external")
    rows, seps = [], []
    cur = 112
    for gi, p in enumerate(P):
        for si, s in enumerate(p["steps"]):
            s["_last"] = (si == len(p["steps"]) - 1) and (gi < len(P) - 1 or bool(ext))
            rows.append((cur, p["name"] if si == 0 else "", s))
            cur += 40
        if gi < len(P) - 1 or ext:
            seps.append(cur + 6)
        cur += 12
    ext_y = cur if ext else None
    last_c = (ext_y + 20) if ext else rows[-1][0] + 20
    bottom = (ext_y + 40) if ext else rows[-1][0] + 40
    leg_y = bottom + 30
    H = leg_y + 28
    o = [head(W, H)]
    title_block(o, d.get("title", ""), W)
    o.append(txt(72, 92, "구분", 12, "400", "#64748B"))
    o.append(txt(240, 92, "동작", 12, "400", "#64748B"))
    o.append(txt(460, 92, "상세", 12, "400", "#64748B"))
    o.append(line(60, 100, W - 60, 100, "#94A3B8", 1.5))
    # 1) 배경과 구분선
    for y, ph, s in rows:
        if s["hl"]:
            o.append(f'<rect x="60" y="{y + 2}" width="{W - 120}" height="36" fill="{HI_ROW}"/>'
                     f'<rect x="60" y="{y + 2}" width="4" height="36" fill="{HI_STROKE}"/>')
        elif not s["_last"]:
            o.append(line(60, y + 40, W - 60, y + 40, ROW, 1))
    for y in seps:
        o.append(line(60, y, W - 60, y, "#94A3B8", 1.5))
    # 2) 타임라인
    o.append(line(215, rows[0][0] + 20, 215, last_c, "#CBD5E1", 1.5))
    # 3) 점과 글자
    for y, ph, s in rows:
        hi = s["hl"]
        o.append(f'<circle cx="215" cy="{y + 20}" r="{7 if hi else 4}" fill="{HI_STROKE if hi else "#FFFFFF"}" '
                 f'stroke="{HI_STROKE if hi else MUTE}" stroke-width="1.5"/>')
        if ph:
            pn, psz = fit(ph, 13, 128, 11, True, warns)
            o.append(txt(72, y + 25, pn, psz, "700", INK))
        nm, nsz = fit(s["name"], 15, 205, 12, True, warns)
        o.append(txt(240, y + 25, nm, nsz, "700", HI_INK if hi else INK))
        if s["desc"]:
            ds, dsz = fit(s["desc"], 13, 670, 11, False, warns)
            o.append(txt(460, y + 25, ds, dsz, "400", HI_MUTE if hi else MUTE))
    if ext:
        o.append(rect(60, ext_y, W - 120, 40, "none", EXT, 0, 1.5, "6 4"))
        o.append(f'<circle cx="215" cy="{ext_y + 20}" r="4" fill="#FFFFFF" stroke="{EXT}" stroke-width="1.5" stroke-dasharray="2 2"/>')
        o.append(txt(72, ext_y + 25, "외부", 13, "700", INK))
        en, esz = fit(ext.get("name", "외부 대상"), 15, 205, 12, True, warns)
        o.append(txt(240, ext_y + 25, en, esz, "700", INK))
        if ext.get("desc"):
            ed, edsz = fit(ext["desc"], 13, 670, 11, False, warns)
            o.append(txt(460, ext_y + 25, ed, edsz, "400", MUTE))
    legend(o, 60, leg_y, any_hl(d), bool(ext), circle=True)
    o.append("</svg>")
    return "\n".join(o)


# ------------------------------------------------------------------ driver
def choose(d):
    P = d["phases"]
    M = max(len(p["steps"]) for p in P)
    if len(P) > 4:
        return "table", f"묶음 {len(P)}개 (>4)"
    if M > 6:
        return "table", f"묶음당 최대 {M}단계 (>6)"
    w = []
    layout_groups(d, w)
    if w:
        return "table", "묶음형에서 글자가 넘침"
    return "groups", f"묶음 {len(P)}개, 묶음당 최대 {M}단계"


def render_png(svg_path, png_path, width):
    exe = shutil.which("rsvg-convert")
    if not exe:
        print("rsvg-convert가 없어 PNG는 건너뜁니다 (SVG를 브라우저/위키에서 PNG로 내보내세요).", file=sys.stderr)
        return False
    subprocess.run([exe, "-w", str(width * 2), svg_path, "-o", png_path], check=True)
    return True


def main():
    ap = argparse.ArgumentParser(description="단계형 다이어그램 자동 배치 생성기")
    ap.add_argument("input")
    ap.add_argument("outdir", nargs="?", default=".")
    ap.add_argument("--layout", choices=["auto", "groups", "table", "both"], default="auto")
    ap.add_argument("--name")
    ap.add_argument("--no-png", action="store_true")
    a = ap.parse_args()
    with open(a.input, encoding="utf-8") as f:
        d = norm(json.load(f))
    os.makedirs(a.outdir, exist_ok=True)
    base = a.name or os.path.splitext(os.path.basename(a.input))[0]
    layouts = ["groups", "table"] if a.layout == "both" else [a.layout]
    if a.layout == "auto":
        lay, why = choose(d)
        print(f"auto 선택: {lay} ({why})")
        layouts = [lay]
    for lay in layouts:
        warns = []
        svg = layout_groups(d, warns) if lay == "groups" else layout_table(d, warns)
        sp = os.path.join(a.outdir, f"{base}_{lay}.svg")
        with open(sp, "w", encoding="utf-8") as f:
            f.write(svg)
        wv = int(svg.split('viewBox="0 0 ')[1].split(" ")[0])
        msg = sp
        if not a.no_png:
            pp = sp[:-4] + ".png"
            if render_png(sp, pp, wv):
                msg += f" , {pp}"
        print(msg)
        for w in sorted(set(warns)):
            print("  주의:", w, file=sys.stderr)


if __name__ == "__main__":
    main()
