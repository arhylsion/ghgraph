# ghgraph

Paint back-dated commits onto your GitHub profile contribution graph.

Pure Python 3.8+ standard library tool. Zero third-party dependencies, no clone required.

```text
  Sun ·▓▓▓··▓···▓
  Mon ▓···▓·▓··▓·
  Tue ▓···▓·▓·▓··
  Wed ▓···▓·▓▓···
  Thu ▓···▓·▓·▓··
  Fri ▓···▓·▓··▓·
  Sat ·▓▓▓··▓···▓
```

---

## Installation

Download the atomic script directly:

```bash
curl -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py
```

---

## Setup

1. Create a repository on GitHub (e.g. `username/activity`) initialized with a `README.md`.
2. Generate a Personal Access Token (Classic with `repo` scope, or Fine-grained with **Contents: Read and write** permissions on the target repository).
3. Set your token environment variable:

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

---

## Quick Start

Always preview your schedule with `--dry-run` first before writing commits:

```bash
python ghgraph.py --repo username/activity --dates "2024-05-04:5, 2024-05-06:2" --dry-run
python ghgraph.py --repo username/activity --spread "2024-06-01..2024-12-31:40, 2025-01-01..2025-12-31:80"
python ghgraph.py --repo username/activity --spread "2025-01-01..2025-12-31:80" --only-empty
python ghgraph.py --repo username/activity --year 2024 --per-day 2 --skip-weekends
python ghgraph.py --repo username/activity --text "HELLO" --start 2024-03-03
python ghgraph.py --backend git --path C:\code\activity --dates "2024-05-04:3"
```

---

## CLI Options

| Option | Default | Description |
| :--- | :--- | :--- |
| `--repo OWNER/NAME` | — | Target GitHub repository (for API backend). |
| `--token TOKEN` | `$GITHUB_TOKEN` | GitHub Personal Access Token. |
| `--dates "D:N,..."` | — | Explicit dates and commit counts (`YYYY-MM-DD:COUNT`). |
| `--range START..END` | — | Span of days; combine with `--per-day` and `--skip-weekends`. |
| `--year YYYY` | — | Shorthand for an entire calendar year. |
| `--spread "S..E:N,..."` | — | Organically distribute N commits at random within range. |
| `--only-empty` | `false` | Skip dates that already have contributions via GraphQL query. |
| `--per-day N` | `1` | Commits per day when using `--range` or `--year`. |
| `--per-day-avg N` | `1.15` | Average commits per active day for `--spread`. |
| `--skip-weekends` | `false` | Exclude Saturdays and Sundays. |
| `--text "STRING"` | — | Render 5×7 pixel text banner (A–Z, 0–9). |
| `--pattern FILE` | — | 7-row pattern text file (Sunday to Saturday). |
| `--start YYYY-MM-DD` | Current week | Start Sunday for `--text` or `--pattern`. |
| `--scale N` | `1.0` | Multiplier for commits per painted cell. |
| `--hour N` | `12` | Base commit hour (0–23). |
| `--jitter N` | `30` | Random time variance in minutes around `--hour`. |
| `--tz OFFSET` | `+00:00` | Timezone offset for commit timestamps (e.g. `+07:00`). |
| `--backend api\|git` | `api` | Direct GitHub Git Database API execution, or local git CLI. |
| `--path DIR` | — | Working directory when `--backend git` is selected. |
| `--branch NAME` | Default branch | Target branch for API backend. |
| `--dry-run` | `false` | Preview scheduled commits in terminal without sending data. |
| `-y, --yes` | `false` | Skip interactive confirmation prompt. |

---

## Important Rules

- **Additive only:** Commits are appended to branch history. Existing history is never deleted or overwritten.
- **Last 365 days:** The profile contribution graph displays the rolling past 365 days. Commits from earlier years appear under *Contribution activity* on your profile for that calendar year.
- **Default branch:** Commits only count toward GitHub heatmap stats if they reside on the repository's default branch.
- **Author email:** The commit author email must match a verified email on your GitHub account.

---

## License

MIT License. Open source and free to use.
