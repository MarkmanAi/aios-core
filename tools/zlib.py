#!/usr/bin/env python3
"""
Z-Library CLI Downloader — AIOS Knowledge Library Tool

Usage:
    python tools/zlib.py                    # interactive mode
    python tools/zlib.py "book title"       # direct search
    python tools/zlib.py --limits           # show account download limits
    python tools/zlib.py --history          # show download history
"""

import asyncio
import os
import sys
import json
import argparse
from pathlib import Path
from urllib.parse import quote

# Fix Windows console UTF-8
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

try:
    import aiohttp
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"ERROR: missing dependency — {e}")
    print("Run: pip install zlibrary aiohttp beautifulsoup4 lxml")
    sys.exit(1)

EMAIL     = os.getenv("ZLIB_EMAIL", "")
PASSWORD  = os.getenv("ZLIB_PASSWORD", "")
BOOKS_DIR = Path(__file__).parent.parent / "books"

BASE      = "https://z-lib.fm"
LOGIN_URL = f"{BASE}/rpc.php"

HEAD = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": f"{BASE}/",
}

TIMEOUT = aiohttp.ClientTimeout(total=60, sock_connect=15, sock_read=45)


# ──────────────────────────────────────────────
# Session
# ──────────────────────────────────────────────

def make_session(jar=None):
    resolver  = aiohttp.ThreadedResolver()
    connector = aiohttp.TCPConnector(resolver=resolver)
    return aiohttp.ClientSession(
        headers=HEAD,
        connector=connector,
        cookie_jar=jar or aiohttp.CookieJar(unsafe=True),
        timeout=TIMEOUT,
    )


# ──────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────

async def login() -> aiohttp.ClientSession:
    email    = EMAIL    or input("Email Z-Library: ").strip()
    password = PASSWORD or input("Senha          : ").strip()

    if not email or not password:
        print("Credenciais vazias. Configure ZLIB_EMAIL e ZLIB_PASSWORD no .env")
        sys.exit(1)

    jar  = aiohttp.CookieJar(unsafe=True)
    sess = make_session(jar)

    data = {
        "isModal":     "true",
        "email":       email,
        "password":    password,
        "site_mode":   "books",
        "action":      "login",
        "isSingleLogin": "1",
        "redirectUrl": "",
        "gg_json_mode": "1",
    }

    async with sess.post(LOGIN_URL, data=data) as r:
        body = await r.text()

    try:
        resp = json.loads(body)["response"]
    except Exception:
        print(f"ERRO no login: resposta inesperada — {body[:200]}")
        await sess.close()
        sys.exit(1)

    if resp.get("validationError"):
        print(f"ERRO no login: {resp.get('message', 'credenciais inválidas')}")
        await sess.close()
        sys.exit(1)

    # Follow redirect to activate session
    redir = resp.get("forceRedirection") or resp.get("priorityRedirectUrl", "/")
    async with sess.get(f"{BASE}{redir}") as r:
        pass

    print("Login OK!\n")
    return sess


# ──────────────────────────────────────────────
# Parsing
# ──────────────────────────────────────────────

def parse_books(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    box  = soup.find("div", {"id": "searchResultBox"})
    if not box:
        return []

    if soup.find("div", {"class": "notFound"}):
        return []

    books = []
    for item in box.find_all("div", {"class": "book-item"}):
        card = item.find("z-bookcard")
        if not card:
            continue
        book = {
            "id":          card.get("id", ""),
            "name":        "",
            "authors":     "",
            "extension":   card.get("extension", ""),
            "size":        card.get("filesize", ""),
            "year":        card.get("year", ""),
            "language":    card.get("language", ""),
            "publisher":   card.get("publisher", ""),
            "rating":      card.get("rating", ""),
            "url":         BASE + card.get("href", ""),
            "download_url": BASE + card.get("download", ""),
        }

        title_tag = card.find("div", {"slot": "title"})
        if title_tag:
            book["name"] = title_tag.text.strip()
        else:
            book["name"] = card.get("title", "Unknown")

        author_tag = card.find("div", {"slot": "author"})
        if author_tag:
            book["authors"] = author_tag.text.strip()

        books.append(book)

    return books


def parse_total_pages(html: str) -> int:
    soup = BeautifulSoup(html, "lxml")
    for script in soup.find_all("script"):
        if "pagesTotal" in (script.string or ""):
            txt = script.string
            idx = txt.find("pagesTotal:")
            if idx != -1:
                val = txt[idx + len("pagesTotal:"):].split(",")[0].strip()
                try:
                    return int(val)
                except ValueError:
                    pass
    return 1


# ──────────────────────────────────────────────
# UI
# ──────────────────────────────────────────────

def banner():
    print("\n" + "=" * 58)
    print("   AIOS Knowledge Library — Z-Library CLI")
    print("=" * 58)


def print_results(books: list[dict]):
    if not books:
        print("  (nenhum resultado)")
        return
    print(f"\n{'#':<4} {'Título':<38} {'Autor':<22} {'Ext':<6} {'Tamanho'}")
    print("-" * 90)
    for i, b in enumerate(books):
        title  = b["name"][:36]
        author = b["authors"][:20]
        ext    = b["extension"].upper()
        size   = b["size"]
        print(f"[{i:<2}] {title:<38} {author:<22} {ext:<6} {size}")


EXTENSIONS = {"1": "PDF", "2": "EPUB", "3": "MOBI", "4": "FB2", "5": "DJVU"}
LANGUAGES  = {"1": "English", "2": "Portuguese", "3": "Spanish"}


def ask_filters() -> tuple[str, str]:
    print("Formato (Enter=todos): 1=PDF  2=EPUB  3=MOBI  4=FB2  5=DJVU")
    ext_in  = input("  Formato: ").strip()
    print("Idioma  (Enter=todos): 1=English  2=Português  3=Español")
    lang_in = input("  Idioma : ").strip()
    return EXTENSIONS.get(ext_in, ""), LANGUAGES.get(lang_in, "")


def build_url(query: str, page: int = 1, ext: str = "", lang: str = "") -> str:
    url = f"{BASE}/s/{quote(query)}?"
    if ext:
        url += f"&extensions[]={ext}"
    if lang:
        url += f"&languages[]={lang}"
    if page > 1:
        url += f"&page={page}"
    return url


# ──────────────────────────────────────────────
# Download
# ──────────────────────────────────────────────

async def download_file(sess: aiohttp.ClientSession, url: str, filename: str) -> Path:
    BOOKS_DIR.mkdir(parents=True, exist_ok=True)
    filepath = BOOKS_DIR / filename

    dl_timeout = aiohttp.ClientTimeout(total=600, sock_connect=15, sock_read=600)
    async with sess.get(url, timeout=dl_timeout) as r:
        if r.status != 200:
            raise RuntimeError(f"HTTP {r.status}")

        cd = r.headers.get("Content-Disposition", "")
        if "filename=" in cd:
            # Parse: attachment; filename="foo.epub"; filename*=UTF-8''...
            import re
            # Prefer filename* (RFC 5987 encoded)
            m = re.search(r"filename\*=UTF-8''([^;]+)", cd, re.IGNORECASE)
            if m:
                from urllib.parse import unquote
                raw_fname = unquote(m.group(1).strip())
            else:
                m = re.search(r'filename="?([^";]+)"?', cd)
                raw_fname = m.group(1).strip() if m else ""
            # Sanitize for Windows
            if raw_fname:
                safe_fname = re.sub(r'[<>:"/\\|?*]', "_", raw_fname)
                filepath = BOOKS_DIR / safe_fname

        total = int(r.headers.get("Content-Length", 0))
        done  = 0
        with open(filepath, "wb") as f:
            async for chunk in r.content.iter_chunked(65536):
                f.write(chunk)
                done += len(chunk)
                if total:
                    pct = done / total * 100
                    kb  = done // 1024
                    print(f"\r  {pct:5.1f}%  {kb} KB", end="", flush=True)
        print()

    return filepath


# ──────────────────────────────────────────────
# Features
# ──────────────────────────────────────────────

async def show_limits(sess: aiohttp.ClientSession):
    async with sess.get(f"{BASE}/users/downloads") as r:
        html = await r.text()
    soup = BeautifulSoup(html, "lxml")

    d = soup.find("div", {"class": "dstats-info"})
    if not d:
        print("Não foi possível obter os limites.")
        return

    count_el = d.find("div", {"class": "d-count"})
    reset_el = d.find("div", {"class": "d-reset"})

    if count_el:
        parts = count_el.text.strip().split("/")
        used    = parts[0].strip() if len(parts) > 0 else "?"
        allowed = parts[1].strip() if len(parts) > 1 else "?"
        print(f"\nDownloads usados : {used} / {allowed}")
        try:
            print(f"Restam hoje      : {int(allowed) - int(used)}")
        except ValueError:
            pass
    if reset_el:
        print(f"Reset em         : {reset_el.text.strip()}")


async def show_history(sess: aiohttp.ClientSession):
    async with sess.get(f"{BASE}/users/dstats.php") as r:
        html = await r.text()
    soup = BeautifulSoup(html, "lxml")

    rows = soup.select("table tr")[1:21]
    if not rows:
        print("Histórico vazio ou estrutura não reconhecida.")
        return

    print(f"\n{'#':<4} {'Título':<50} {'Data'}")
    print("-" * 75)
    for i, row in enumerate(rows):
        cols = row.find_all("td")
        if len(cols) >= 2:
            title = cols[0].text.strip()[:48]
            date  = cols[-1].text.strip()
            print(f"[{i:<2}] {title:<50} {date}")


async def search_and_download(sess: aiohttp.ClientSession, query: str = ""):
    if not query:
        query = input("Buscar livro: ").strip()
    if not query:
        print("Nenhum termo fornecido.")
        return

    ext, lang = ask_filters()
    page = 1

    while True:
        url = build_url(query, page, ext, lang)
        print(f"\nBuscando '{query}' (pág. {page})...")

        async with sess.get(url) as r:
            html = await r.text()

        books = parse_books(html)
        total = parse_total_pages(html)

        if not books:
            print("Nenhum resultado encontrado.")
            nova = input("\nNova busca? (Enter p/ sair): ").strip()
            if not nova:
                return
            query = nova
            ext, lang = ask_filters()
            page = 1
            continue

        print_results(books)
        print(f"\nPágina {page}/{total}  |  n=próxima  p=anterior  q=sair")
        choice = input("Escolha número ou ação: ").strip().lower()

        if choice == "q":
            return

        if choice == "n":
            if page < total:
                page += 1
            else:
                print("Última página.")
            continue

        if choice == "p":
            if page > 1:
                page -= 1
            else:
                print("Primeira página.")
            continue

        if choice.isdigit() and 0 <= int(choice) < len(books):
            book = books[int(choice)]

            print(f"\n{'-'*50}")
            print(f"Título   : {book['name']}")
            print(f"Autor    : {book['authors']}")
            print(f"Formato  : {book['extension'].upper()}")
            print(f"Tamanho  : {book['size']}")
            print(f"Ano      : {book['year']}")
            print(f"Idioma   : {book['language']}")
            print(f"DL URL   : {book['download_url']}")

            if not book["download_url"] or book["download_url"] == BASE:
                print("Download indisponível.")
                input("Enter para continuar...")
                continue

            confirm = input("\nBaixar? [s/n]: ").strip().lower()
            if confirm != "s":
                continue

            safe  = "".join(c for c in book["name"] if c.isalnum() or c in " _-")[:60].strip()
            fname = f"{safe}.{book['extension']}" if book["extension"] else safe

            print(f"\nBaixando '{fname}'...")
            try:
                path = await download_file(sess, book["download_url"], fname)
                print(f"Salvo em: {path}")
            except Exception as e:
                print(f"Erro no download: {e}")

            again = input("\nBuscar outro livro? [s/n]: ").strip().lower()
            if again != "s":
                return
            query = input("Nova busca: ").strip()
            if not query:
                return
            ext, lang = ask_filters()
            page = 1
            continue

        print("Opção inválida.")


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

async def main():
    parser = argparse.ArgumentParser(description="AIOS Z-Library CLI")
    parser.add_argument("query",     nargs="?", help="Termo de busca")
    parser.add_argument("--limits",  action="store_true", help="Ver limites de download")
    parser.add_argument("--history", action="store_true", help="Ver histórico de downloads")
    args = parser.parse_args()

    banner()
    sess = await login()

    try:
        if args.limits:
            await show_limits(sess)
        elif args.history:
            await show_history(sess)
        else:
            await search_and_download(sess, args.query or "")
    finally:
        await sess.close()

    print("\nAté logo!\n")


if __name__ == "__main__":
    asyncio.run(main())
