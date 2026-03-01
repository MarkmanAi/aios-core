---
name: aios-knowledge-library
description: This skill should be used when the user wants to search and download books from Z-Library, list their local library, get book recommendations, or organize their book collection. Triggers on requests like "baixar livro", "buscar livro", "minha biblioteca", "recomendar leitura", "organizar livros", "download book", "find book".
---

# AIOS Knowledge Library

Personal knowledge library management system powered by Z-Library CLI.

## Overview

The AIOS Knowledge Library is a local book management system that:
- Searches and downloads books from Z-Library via `tools/zlib.py`
- Lists and organizes books in `books/` directory
- Recommends books based on topics or learning goals
- Maintains a reading catalog with categories

**Key paths:**
- Downloader script: `tools/zlib.py`
- Local library: `books/`
- Credentials: `.env` (`ZLIB_EMAIL`, `ZLIB_PASSWORD`)

## Workflows

### 1. Search and Download a Book

To download a book, run the CLI in interactive mode:

```bash
python tools/zlib.py
```

Or with direct search term:

```bash
python tools/zlib.py "title or author"
```

**Navigation inside the CLI:**
- Type a number to select a book
- `n` — next page, `p` — previous page, `q` — quit
- Filter by format (PDF/EPUB/MOBI) and language (English/Português/Español)
- Confirm download with `s`

Books are saved to `books/` automatically with the original filename.

### 2. List Local Library

To list all books currently downloaded, run:

```bash
python tools/zlib.py --list
```

Or use the `list_library.py` script for a formatted catalog view:

```bash
python tools/list_library.py
```

### 3. Check Download Limits

```bash
python tools/zlib.py --limits
```

Shows daily downloads used/remaining and reset time.

### 4. View Download History

```bash
python tools/zlib.py --history
```

### 5. Recommend Books

To recommend books, use the references/reading-lists.md file for curated lists by topic. Match the user's goal or interest to the closest category and suggest 3-5 titles. Then offer to download immediately using the CLI.

Example flow:
1. User asks: "quero aprender sobre product management"
2. Consult references/reading-lists.md for PM books
3. Present top 3-5 recommendations with author and brief description
4. Ask: "Quer que eu baixe algum agora?"
5. If yes, run `python tools/zlib.py "book title"`

### 6. Organize Library

To generate a catalog of existing books:

```bash
python tools/list_library.py --catalog
```

This scans `books/` and groups files by detected category based on filename keywords.

## Setup Requirements

- Python 3.9+
- `pip install zlibrary aiohttp beautifulsoup4 lxml python-dotenv`
- `.env` file at project root with `ZLIB_EMAIL` and `ZLIB_PASSWORD`

## Tips

- Prefer EPUB format for reading apps; PDF for technical books with diagrams
- Filter by `Português` language for PT-BR editions
- Use exact author name for best results: `"Robert C. Martin"`
- Daily download limit is 10 books (free account)
