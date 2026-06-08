#!/usr/bin/env python3
"""
Promote the [Unreleased] section in CHANGELOG.md to a named release.

Usage:
    python3 promote-changelog.py <tag> <date> [changelog_path]

Example:
    python3 tools/promote-changelog.py app-v2026.06.08.22 2026-06-08
    python3 tools/promote-changelog.py api-v23 2026-06-08 CHANGELOG.md
"""

import re
import sys

REPO_URL = "https://github.com/RMCampos/tasknote"


def promote(tag: str, date: str, path: str = "CHANGELOG.md") -> bool:
    """
    Promote [Unreleased] content to a versioned release entry.

    Returns True if the changelog was updated, False if skipped (empty section).
    Exits with code 1 if the [Unreleased] section cannot be found.
    """
    with open(path, "r") as f:
        content = f.read()

    # Match from "## [Unreleased]\n" through the first "\n---\n" separator
    pattern = r"(## \[Unreleased\]\n)(.*?)(\n---\n)"
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        print("ERROR: [Unreleased] section not found in changelog", file=sys.stderr)
        sys.exit(1)

    body = match.group(2).strip()

    if not body:
        print("INFO: [Unreleased] is empty — nothing to promote, skipping")
        return False

    version_header = f"## [{tag}]({REPO_URL}/releases/tag/{tag}) - {date}"
    replacement = (
        f"## [Unreleased]\n\n---\n\n"
        f"{version_header}\n\n{body}\n\n---\n"
    )

    new_content = content[: match.start()] + replacement + content[match.end():]

    with open(path, "w") as f:
        f.write(new_content)

    print(f"SUCCESS: Promoted [Unreleased] to [{tag}]")
    return True


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: promote-changelog.py <tag> <date> [changelog_path]")
        sys.exit(1)

    changelog_path = sys.argv[3] if len(sys.argv) > 3 else "CHANGELOG.md"
    promote(sys.argv[1], sys.argv[2], changelog_path)
