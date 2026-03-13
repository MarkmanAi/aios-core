"""
Knowledge-ETL CLI — Typer-based entry point for the book-to-intelligence pipeline.

Usage:
    python -m knowledge_etl process "path/to/book.pdf" --author "Author" --domain domain-name
    python -m knowledge_etl extract "path/to/book.pdf"
    python -m knowledge_etl transform "book-slug" --level l1|l2|l3
    python -m knowledge_etl validate "book-slug"
    python -m knowledge_etl load "book-slug" --domain domain-name
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Optional

import typer
import yaml
from rich.console import Console

from knowledge_etl.config import STAGING
from knowledge_etl.extract.marker_extract import slugify

app = typer.Typer(
    name="knowledge-etl",
    help="Book-to-intelligence pipeline for AIOS/Neo knowledge base.",
    no_args_is_help=True,
)
console = Console()


def _load_metadata(book_slug: str) -> dict:
    """Load metadata.yaml from staging directory."""
    meta_path = STAGING / book_slug / "metadata.yaml"
    if not meta_path.exists():
        console.print(f"[red]Error:[/red] No metadata found at {meta_path}")
        console.print("Run 'extract' first to generate metadata.")
        raise typer.Exit(code=1)
    return yaml.safe_load(meta_path.read_text(encoding="utf-8"))


def _get_chapter_paths(book_slug: str) -> list[Path]:
    """Get sorted chapter paths from staging."""
    chapters_dir = STAGING / book_slug / "chapters"
    if not chapters_dir.exists():
        return []
    return sorted(chapters_dir.glob("*.md"))


def _get_full_text_path(book_slug: str) -> Path:
    """Get full_text.md path from staging."""
    return STAGING / book_slug / "full_text.md"


@app.command()
def process(
    book_path: str = typer.Argument(..., help="Path to the PDF or EPUB file"),
    author: Optional[str] = typer.Option(None, "--author", "-a", help="Author name (overrides detected)"),
    domain: str = typer.Option("general", "--domain", "-d", help="Knowledge domain (e.g., software-engineering)"),
    advisor: bool = typer.Option(False, "--advisor", help="Extract L3 DNA sources for Governance Advisor pipeline (writing style + reasoning + contradictions)"),
    book_slug_override: Optional[str] = typer.Option(None, "--slug", help="Override auto-generated book slug"),
) -> None:
    """
    Run the full ETL pipeline on a book.

    Phases: Extract -> Assess -> Transform (L1+L2, optionally L3) -> Validate -> Load
    """
    from knowledge_etl.extract.marker_extract import extract
    from knowledge_etl.extract.metadata import extract_metadata
    from knowledge_etl.load.l1_merge import merge_l1
    from knowledge_etl.load.l2_merge import merge_l2
    from knowledge_etl.load.l3_place import place_l3
    from knowledge_etl.transform.assess import assess
    from knowledge_etl.transform.l1_principles import extract_l1
    from knowledge_etl.transform.l2_frameworks import extract_l2
    from knowledge_etl.transform.l3_authorial import extract_l3
    from knowledge_etl.utils.cost import CostTracker
    from knowledge_etl.utils.git_ops import git_add_and_commit
    from knowledge_etl.utils.llm import LLMClient
    from knowledge_etl.validate.faithfulness import validate_faithfulness

    input_path = Path(book_path).resolve()
    if not input_path.exists():
        console.print(f"[red]Error:[/red] File not found: {input_path}")
        raise typer.Exit(code=1)

    # Derive slug
    metadata_raw = extract_metadata(input_path, author_override=author)
    book_title = metadata_raw.get("title") or input_path.stem
    slug = book_slug_override or slugify(book_title)

    console.print(f"\n[bold]Pipeline Start:[/bold] {book_title}")
    console.print(f"[dim]Slug: {slug} | Domain: {domain} | Advisor: {advisor}[/dim]\n")

    llm = LLMClient()
    cost_tracker = CostTracker()

    # PHASE 1: EXTRACT
    console.rule("Phase 1: Extract")
    result = extract(
        book_path=input_path,
        staging_dir=STAGING,
        book_slug=slug,
    )
    full_text_path = result["full_text"]
    chapter_paths = result["chapters"]

    # Update metadata with extracted info
    staging_meta_path = STAGING / slug / "metadata.yaml"
    if staging_meta_path.exists():
        metadata = yaml.safe_load(staging_meta_path.read_text(encoding="utf-8"))
    else:
        metadata = metadata_raw
    if author:
        metadata["author"] = author

    # Save enriched metadata
    staging_meta_path.write_text(
        yaml.dump(metadata, allow_unicode=True, default_flow_style=False),
        encoding="utf-8",
    )

    # PHASE 2: ASSESS
    console.rule("Phase 2: Assess")
    assessment = assess(full_text_path, llm)
    strategy = assessment["strategy"]

    # PHASE 3: TRANSFORM
    console.rule("Phase 3: Transform")

    # L1: Principles (Sonnet)
    console.print("\n[bold]L1: Principles[/bold]")
    l1_results = extract_l1(
        book_slug=slug,
        full_text_path=full_text_path,
        chapter_paths=chapter_paths,
        metadata=metadata,
        strategy=strategy,
        llm=llm,
        cost_tracker=cost_tracker,
    )

    # L2: Frameworks (Sonnet)
    console.print("\n[bold]L2: Frameworks[/bold]")
    time.sleep(10)
    l2_results = extract_l2(
        book_slug=slug,
        full_text_path=full_text_path,
        chapter_paths=chapter_paths,
        metadata=metadata,
        strategy=strategy,
        llm=llm,
        cost_tracker=cost_tracker,
    )

    # L3: Authorial DNA (Opus) — optional, only with --advisor flag
    l3_results = None
    if advisor:
        console.print("\n[bold]L3: Authorial DNA[/bold]")
        time.sleep(10)
        l3_results = extract_l3(
            book_slug=slug,
            full_text_path=full_text_path,
            chapter_paths=chapter_paths,
            metadata=metadata,
            llm=llm,
            cost_tracker=cost_tracker,
            strategy=strategy,
        )

    # PHASE 4: VALIDATE
    console.rule("Phase 4: Validate")
    validation = validate_faithfulness(
        book_slug=slug,
        full_text_path=full_text_path,
        l1_results=l1_results,
        l2_results=l2_results,
        l3_results=l3_results,
        llm=llm,
        cost_tracker=cost_tracker,
    )

    # PHASE 5: LOAD
    console.rule("Phase 5: Load")
    time.sleep(5)
    committed_paths: list[Path] = []

    # L1 -> strategic-principles.md
    l1_target = merge_l1(
        principles=l1_results,
        metadata=metadata,
        book_slug=slug,
        llm=llm,
        cost_tracker=cost_tracker,
    )
    committed_paths.append(l1_target)

    # L2 -> .neo/kb/strategic/{domain}.md
    l2_target = merge_l2(
        frameworks=l2_results,
        metadata=metadata,
        book_slug=slug,
        domain=domain,
        llm=llm,
        cost_tracker=cost_tracker,
    )
    committed_paths.append(l2_target)

    # L3 -> Person Knowledge Base
    if l3_results:
        l3_target = place_l3(
            l3_results=l3_results,
            metadata=metadata,
            book_slug=slug,
        )
        # Add all files in the L3 target directory
        for f in l3_target.iterdir():
            committed_paths.append(f)

        # Update PKB metadata and readiness gate
        from knowledge_etl.kb.person_metadata import create_or_update
        from knowledge_etl.kb.person_readiness import update_readiness
        from datetime import date as _date

        person_slug = slugify(metadata.get("author") or "Unknown")
        create_or_update(
            slug=person_slug,
            name=metadata.get("author") or "Unknown",
            source_info={
                "slug": slug,
                "type": "book",
                "title": metadata.get("title", ""),
                "etl_processed": True,
                "processed_at": _date.today().isoformat(),
            },
        )
        update_readiness(person_slug)

        from knowledge_etl.kb.gap_detector import detect_and_write
        detect_and_write(person_slug)

    # Git commit
    try:
        git_add_and_commit(
            paths=committed_paths,
            message=f"knowledge-etl: process '{book_title}' by {metadata.get('author', 'Unknown')} [{domain}]",
        )
        console.print("[green]Git commit created.[/green]")
    except Exception as exc:
        console.print(f"[yellow]Git commit skipped:[/yellow] {exc}")

    # Summary
    console.rule("Summary")
    console.print(cost_tracker.summary())
    console.print(f"\n[bold green]Pipeline complete for '{book_title}'[/bold green]")
    console.print(f"  L1 principles: {len(l1_results)}")
    framework_count = len(l2_results.get("unified_frameworks", l2_results.get("core_frameworks", [])))
    console.print(f"  L2 frameworks: {framework_count}")
    if l3_results:
        console.print("  L3 DNA: voice + thinking + contradictions")
    console.print(f"  Faithfulness: {validation['overall_score']:.1%}")


@app.command()
def extract(
    book_path: str = typer.Argument(..., help="Path to the PDF or EPUB file"),
    slug: Optional[str] = typer.Option(None, "--slug", help="Override auto-generated book slug"),
    author: Optional[str] = typer.Option(None, "--author", "-a", help="Author name override"),
) -> None:
    """Extract text and metadata from a PDF or EPUB file."""
    from knowledge_etl.extract.marker_extract import extract as do_extract
    from knowledge_etl.extract.metadata import extract_metadata

    input_path = Path(book_path).resolve()
    if not input_path.exists():
        console.print(f"[red]Error:[/red] File not found: {input_path}")
        raise typer.Exit(code=1)

    metadata = extract_metadata(input_path, author_override=author)
    book_title = metadata.get("title") or input_path.stem
    book_slug = slug or slugify(book_title)

    result = do_extract(
        book_path=input_path,
        staging_dir=STAGING,
        book_slug=book_slug,
    )

    # Save enriched metadata
    meta_path = STAGING / book_slug / "metadata.yaml"
    import yaml as _yaml
    meta_path.write_text(
        _yaml.dump(metadata, allow_unicode=True, default_flow_style=False),
        encoding="utf-8",
    )

    console.print(f"\n[green]Extract complete:[/green] {len(result['chapters'])} chapters")
    console.print(f"  Staging: {STAGING / book_slug}")


@app.command()
def transform(
    book_slug: str = typer.Argument(..., help="Book slug (from staging directory)"),
    level: str = typer.Option("l1", "--level", "-l", help="Extraction level: l1, l2, or l3"),
) -> None:
    """Run transform phase on already-extracted book."""
    from knowledge_etl.utils.cost import CostTracker
    from knowledge_etl.utils.llm import LLMClient

    full_text_path = _get_full_text_path(book_slug)
    if not full_text_path.exists():
        console.print(f"[red]Error:[/red] No extracted text found for '{book_slug}'")
        console.print("Run 'extract' first.")
        raise typer.Exit(code=1)

    metadata = _load_metadata(book_slug)
    chapter_paths = _get_chapter_paths(book_slug)
    llm = LLMClient()
    cost_tracker = CostTracker()

    # Determine strategy
    from knowledge_etl.transform.assess import assess
    assessment = assess(full_text_path, llm)
    strategy = assessment["strategy"]

    if level == "l1":
        from knowledge_etl.transform.l1_principles import extract_l1
        results = extract_l1(
            book_slug=book_slug,
            full_text_path=full_text_path,
            chapter_paths=chapter_paths,
            metadata=metadata,
            strategy=strategy,
            llm=llm,
            cost_tracker=cost_tracker,
        )
        console.print(f"\n[green]L1 complete:[/green] {len(results)} principles")

    elif level == "l2":
        from knowledge_etl.transform.l2_frameworks import extract_l2
        results = extract_l2(
            book_slug=book_slug,
            full_text_path=full_text_path,
            chapter_paths=chapter_paths,
            metadata=metadata,
            strategy=strategy,
            llm=llm,
            cost_tracker=cost_tracker,
        )
        framework_count = len(results.get("unified_frameworks", results.get("core_frameworks", [])))
        console.print(f"\n[green]L2 complete:[/green] {framework_count} frameworks")

    elif level == "l3":
        from knowledge_etl.transform.l3_authorial import extract_l3
        results = extract_l3(
            book_slug=book_slug,
            full_text_path=full_text_path,
            chapter_paths=chapter_paths,
            metadata=metadata,
            llm=llm,
            cost_tracker=cost_tracker,
            strategy=strategy,
        )
        console.print("\n[green]L3 complete:[/green] voice + thinking + contradictions")

    else:
        console.print(f"[red]Error:[/red] Unknown level '{level}'. Use l1, l2, or l3.")
        raise typer.Exit(code=1)

    console.print(cost_tracker.summary())


@app.command()
def validate(
    book_slug: str = typer.Argument(..., help="Book slug (from staging directory)"),
) -> None:
    """Run faithfulness validation on extracted knowledge."""
    import json

    from knowledge_etl.utils.cost import CostTracker
    from knowledge_etl.utils.llm import LLMClient
    from knowledge_etl.validate.faithfulness import validate_faithfulness

    full_text_path = _get_full_text_path(book_slug)
    if not full_text_path.exists():
        console.print(f"[red]Error:[/red] No extracted text found for '{book_slug}'")
        raise typer.Exit(code=1)

    # Load L1 results
    l1_path = STAGING / book_slug / "l1" / "final_principles.json"
    l1_results: list[dict] = []
    if l1_path.exists():
        data = json.loads(l1_path.read_text(encoding="utf-8"))
        l1_results = data.get("principles", [])

    # Load L2 results
    l2_path = STAGING / book_slug / "l2" / "final_frameworks.json"
    l2_results: dict = {}
    if l2_path.exists():
        l2_results = json.loads(l2_path.read_text(encoding="utf-8"))

    # Load L3 results if they exist
    l3_results: dict | None = None
    l3_dir = STAGING / book_slug / "l3"
    if l3_dir.exists():
        l3_results = {}
        for name in ("voice_dna", "thinking_dna", "contradictions"):
            fpath = l3_dir / f"{name}.json"
            if fpath.exists():
                l3_results[name] = json.loads(fpath.read_text(encoding="utf-8"))

    llm = LLMClient()
    cost_tracker = CostTracker()

    result = validate_faithfulness(
        book_slug=book_slug,
        full_text_path=full_text_path,
        l1_results=l1_results,
        l2_results=l2_results,
        l3_results=l3_results,
        llm=llm,
        cost_tracker=cost_tracker,
    )

    console.print(f"\n[bold]Overall faithfulness:[/bold] {result['overall_score']:.1%}")
    console.print(cost_tracker.summary())


@app.command()
def load(
    book_slug: str = typer.Argument(..., help="Book slug (from staging directory)"),
    domain: str = typer.Option("general", "--domain", "-d", help="Knowledge domain"),
    author: Optional[str] = typer.Option(None, "--author", "-a", help="Author name override"),
) -> None:
    """Load extracted knowledge into Neo KB and MMOS minds."""
    import json

    from knowledge_etl.load.l1_merge import merge_l1
    from knowledge_etl.load.l2_merge import merge_l2
    from knowledge_etl.load.l3_place import place_l3
    from knowledge_etl.utils.cost import CostTracker
    from knowledge_etl.utils.git_ops import git_add_and_commit
    from knowledge_etl.utils.llm import LLMClient

    metadata = _load_metadata(book_slug)
    if author:
        metadata["author"] = author

    llm = LLMClient()
    cost_tracker = CostTracker()
    committed_paths: list[Path] = []

    # L1
    l1_path = STAGING / book_slug / "l1" / "final_principles.json"
    if l1_path.exists():
        data = json.loads(l1_path.read_text(encoding="utf-8"))
        principles = data.get("principles", [])
        target = merge_l1(
            principles=principles,
            metadata=metadata,
            book_slug=book_slug,
            llm=llm,
            cost_tracker=cost_tracker,
        )
        committed_paths.append(target)

    # L2
    l2_path = STAGING / book_slug / "l2" / "final_frameworks.json"
    if l2_path.exists():
        frameworks = json.loads(l2_path.read_text(encoding="utf-8"))
        target = merge_l2(
            frameworks=frameworks,
            metadata=metadata,
            book_slug=book_slug,
            domain=domain,
            llm=llm,
            cost_tracker=cost_tracker,
        )
        committed_paths.append(target)

    # L3
    l3_dir = STAGING / book_slug / "l3"
    if l3_dir.exists():
        l3_results: dict = {}
        for name in ("voice_dna", "thinking_dna", "contradictions"):
            fpath = l3_dir / f"{name}.json"
            if fpath.exists():
                l3_results[name] = json.loads(fpath.read_text(encoding="utf-8"))

        if l3_results:
            l3_target = place_l3(
                l3_results=l3_results,
                metadata=metadata,
                book_slug=book_slug,
            )
            for f in l3_target.iterdir():
                committed_paths.append(f)

            # Update PKB metadata and readiness gate
            from knowledge_etl.kb.person_metadata import create_or_update
            from knowledge_etl.kb.person_readiness import update_readiness
            from datetime import date as _date

            person_slug = slugify(metadata.get("author") or "Unknown")
            create_or_update(
                slug=person_slug,
                name=metadata.get("author") or "Unknown",
                source_info={
                    "slug": book_slug,
                    "type": "book",
                    "title": metadata.get("title", ""),
                    "etl_processed": True,
                    "processed_at": _date.today().isoformat(),
                },
            )
            update_readiness(person_slug)

            from knowledge_etl.kb.gap_detector import detect_and_write
            detect_and_write(person_slug)

    # Git commit
    if committed_paths:
        try:
            git_add_and_commit(
                paths=committed_paths,
                message=f"knowledge-etl: load '{book_slug}' into {domain}",
            )
            console.print("[green]Git commit created.[/green]")
        except Exception as exc:
            console.print(f"[yellow]Git commit skipped:[/yellow] {exc}")

    console.print(f"\n[green]Load complete for '{book_slug}'[/green]")


@app.command()
def aggregate(
    slug: str = typer.Argument(..., help="Person slug (e.g. donella-h-meadows)"),
) -> None:
    """Compile profile/ for a person from all processed sources."""
    from knowledge_etl.kb.profile_aggregator import aggregate as do_aggregate

    try:
        do_aggregate(slug)
        typer.echo(f"✓ Profile aggregated for '{slug}'")
    except ValueError as e:
        typer.echo(f"✗ {e}", err=True)
        raise typer.Exit(1)


if __name__ == "__main__":
    app()
