from __future__ import annotations

import argparse
import html
import json
import os
import random
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

LEVEL_COUNTS = {1: 1, 2: 3, 3: 6, 4: 10}

FONT = {
    " ": ("00000", "00000", "00000", "00000", "00000", "00000", "00000"),
    "A": ("01110", "10001", "10001", "11111", "10001", "10001", "10001"),
    "B": ("11110", "10001", "10001", "11110", "10001", "10001", "11110"),
    "C": ("01110", "10001", "10000", "10000", "10000", "10001", "01110"),
    "D": ("11110", "10001", "10001", "10001", "10001", "10001", "11110"),
    "E": ("11111", "10000", "10000", "11110", "10000", "10000", "11111"),
    "F": ("11111", "10000", "10000", "11110", "10000", "10000", "10000"),
    "G": ("01110", "10001", "10000", "10111", "10001", "10001", "01111"),
    "H": ("10001", "10001", "10001", "11111", "10001", "10001", "10001"),
    "I": ("01110", "00100", "00100", "00100", "00100", "00100", "01110"),
    "J": ("00111", "00010", "00010", "00010", "00010", "10010", "01100"),
    "K": ("10001", "10010", "10100", "11000", "10100", "10010", "10001"),
    "L": ("10000", "10000", "10000", "10000", "10000", "10000", "11111"),
    "M": ("10001", "11011", "10101", "10101", "10001", "10001", "10001"),
    "N": ("10001", "11001", "10101", "10011", "10001", "10001", "10001"),
    "O": ("01110", "10001", "10001", "10001", "10001", "10001", "01110"),
    "P": ("11110", "10001", "10001", "11110", "10000", "10000", "10000"),
    "Q": ("01110", "10001", "10001", "10001", "10101", "10010", "01101"),
    "R": ("11110", "10001", "10001", "11110", "10100", "10010", "10001"),
    "S": ("01111", "10000", "10000", "01110", "00001", "00001", "11110"),
    "T": ("11111", "00100", "00100", "00100", "00100", "00100", "00100"),
    "U": ("10001", "10001", "10001", "10001", "10001", "10001", "01110"),
    "V": ("10001", "10001", "10001", "10001", "10001", "01010", "00100"),
    "W": ("10001", "10001", "10001", "10101", "10101", "11011", "10001"),
    "X": ("10001", "10001", "01010", "00100", "01010", "10001", "10001"),
    "Y": ("10001", "10001", "01010", "00100", "00100", "00100", "00100"),
    "Z": ("11111", "00001", "00010", "00100", "01000", "10000", "11111"),
    "0": ("01110", "10001", "10011", "10101", "11001", "10001", "01110"),
    "1": ("00100", "01100", "00100", "00100", "00100", "00100", "01110"),
    "2": ("01110", "10001", "00001", "00010", "00100", "01000", "11111"),
    "3": ("11111", "00010", "00100", "00010", "00001", "10001", "01110"),
    "4": ("00010", "00110", "01010", "10010", "11111", "00010", "00010"),
    "5": ("11111", "10000", "11110", "00001", "00001", "10001", "01110"),
    "6": ("00110", "01000", "10000", "11110", "10001", "10001", "01110"),
    "7": ("11111", "00001", "00010", "00100", "01000", "01000", "01000"),
    "8": ("01110", "10001", "10001", "01110", "10001", "10001", "01110"),
    "9": ("01110", "10001", "10001", "01111", "00001", "00010", "01100"),
}


@dataclass
class Commit:
    when: datetime
    message: str


def parse_tz(tz_string: str) -> timezone:
    """Parse a timezone string into a Python timezone object."""
    spec = tz_string.strip()
    if spec.upper() in ("UTC", "Z", "GMT"):
        return timezone.utc

    match = re.fullmatch(r"([+-])(\d{1,2})(?::?(\d{2}))?", spec)
    if not match:
        raise SystemExit(f"Invalid --tz value: '{tz_string}'. Expected format like +07:00 or -05:00")

    sign = 1 if match.group(1) == "+" else -1
    hours = int(match.group(2))
    minutes = int(match.group(3) or 0)

    if hours > 14 or minutes > 59:
        raise SystemExit(f"Invalid timezone offset: '{tz_string}'")

    offset = timedelta(hours=hours, minutes=minutes)
    return timezone(sign * offset)


def get_sunday_before(target_date: date) -> date:
    """Find the Sunday on or immediately before the target date."""
    days_since_sunday = (target_date.weekday() + 1) % 7
    return target_date - timedelta(days=days_since_sunday)


def get_days_in_range(start_date: date, end_date: date) -> list[date]:
    """Return a list of all calendar dates from start_date to end_date (inclusive)."""
    days = []
    current = start_date
    while current <= end_date:
        days.append(current)
        current += timedelta(days=1)
    return days


def char_to_level(char: str) -> int:
    """Convert an art character into a shade level (0 to 4)."""
    if char.isdigit():
        return min(4, int(char))
    symbols = {"-": 1, "+": 2, "*": 3, "#": 4}
    return symbols.get(char, 0)


def count_to_shade_level(commit_count: int) -> int:
    """Map a commit count to a preview shade level from 0 to 4."""
    if commit_count <= 0:
        return 0
    elif commit_count == 1:
        return 1
    elif commit_count <= 3:
        return 2
    elif commit_count <= 7:
        return 3
    else:
        return 4


def parse_dates_spec(spec: str) -> dict[date, int]:
    """Parse comma or space separated dates like '2020-05-04:3, 2020-05-05'."""
    counts: dict[date, int] = {}
    tokens = re.split(r"[,\s]+", spec.strip())

    for token in tokens:
        if not token:
            continue

        if ":" in token:
            date_str, count_str = token.split(":", 1)
        else:
            date_str, count_str = token, "1"

        try:
            day = date.fromisoformat(date_str)
            count = int(count_str)
        except ValueError:
            raise SystemExit(f"Invalid entry '{token}' in --dates. Expected YYYY-MM-DD[:COUNT]")

        counts[day] = counts.get(day, 0) + max(0, count)

    return counts


def parse_range_spec(spec: str) -> tuple[date, date]:
    """Parse a date range string like '2020-01-01..2020-12-31' into (start_date, end_date)."""
    if ".." not in spec:
        raise SystemExit("--range must look like 2020-01-01..2020-12-31")

    start_str, end_str = spec.split("..", 1)
    try:
        start_date = date.fromisoformat(start_str.strip())
        end_date = date.fromisoformat(end_str.strip())
    except ValueError:
        raise SystemExit("--range must look like 2020-01-01..2020-12-31")

    if end_date < start_date:
        start_date, end_date = end_date, start_date

    return start_date, end_date


def parse_spread_spec(spec: str) -> list[tuple[date, date, int]]:
    """Parse spread entries like '2024-06-01..2024-12-31:40, 2025-01-01..2025-12-31:80'."""
    windows: list[tuple[date, date, int]] = []
    items = re.split(r"[,;]", spec)

    for item in items:
        item = item.strip()
        if not item:
            continue

        if ":" not in item:
            raise SystemExit(
                f"Bad --spread entry '{item}'. Expected START..END:COUNT like 2024-06-01..2024-12-31:40"
            )

        range_part, count_part = item.rsplit(":", 1)
        if not count_part.strip().isdigit():
            raise SystemExit(
                f"Bad --spread entry '{item}'. Expected START..END:COUNT like 2024-06-01..2024-12-31:40"
            )

        start_date, end_date = parse_range_spec(range_part)
        windows.append((start_date, end_date, int(count_part.strip())))

    if not windows:
        raise SystemExit("--spread needs at least one START..END:COUNT entry")

    return windows


def read_pattern_file(path: Path) -> list[str]:
    """Read a text file containing up to 7 rows of pattern characters."""
    if not path.exists():
        raise SystemExit(f"Pattern file not found: {path}")

    lines = path.read_text(encoding="utf-8").splitlines()

    while lines and not lines[-1].strip():
        lines.pop()

    if not lines:
        raise SystemExit(f"Pattern file is empty: {path}")
    if len(lines) > 7:
        raise SystemExit("A pattern can have at most 7 rows (Sunday to Saturday)")

    return lines


def render_text_banner(text: str) -> list[str]:
    """Render a text string into 7 rows of font characters."""
    glyphs = [FONT.get(char, FONT[" "]) for char in text.upper()]
    if not glyphs:
        return ["0"] * 7

    rows = []
    for row_idx in range(7):
        row_str = "0".join(glyph[row_idx] for glyph in glyphs)
        rows.append(row_str.replace("1", "3"))

    return rows


def map_pattern_to_dates(
    rows: list[str],
    start_date: date | None,
    scale: float = 1.0,
) -> dict[date, int]:
    """Map a 7-row pattern matrix to calendar dates, one column per week."""
    rows = list(rows[:7]) + [""] * max(0, 7 - len(rows))
    width = max((len(r) for r in rows), default=0)
    if width == 0:
        return {}

    today = date.today()
    if start_date is None:
        start_date = get_sunday_before(today) - timedelta(days=7 * (width - 1))
        while start_date + timedelta(days=7 * width - 1) > today:
            start_date -= timedelta(days=7)

    start_date = get_sunday_before(start_date)

    counts: dict[date, int] = {}
    for day_of_week, row_line in enumerate(rows):
        for week_col, char in enumerate(row_line):
            level = char_to_level(char)
            if level > 0:
                base_count = LEVEL_COUNTS.get(level, 1)
                num_commits = max(1, round(base_count * scale))
                target_date = start_date + timedelta(days=7 * week_col + day_of_week)
                counts[target_date] = num_commits

    return counts


def pick_weighted_days(days: list[date], count_to_pick: int, rng: random.Random) -> list[date]:
    """Pick distinct days without replacement, giving weekdays slightly more weight than weekends."""
    if count_to_pick >= len(days):
        return list(days)

    scored_days = []
    for day in days:
        is_weekend = day.weekday() >= 5
        weight = 0.55 if is_weekend else 1.0
        random_value = rng.random() or 1e-12
        score = random_value ** (1.0 / weight)
        scored_days.append((score, day))

    scored_days.sort(key=lambda item: item[0], reverse=True)
    return [day for _, day in scored_days[:count_to_pick]]


def generate_spread_counts(
    windows: list[tuple[date, date, int]],
    rng: random.Random,
    per_day_avg: float,
    blocked_dates: set[date] | frozenset[date] = frozenset(),
    skip_weekends: bool = False,
) -> dict[date, int]:
    """Distribute commits randomly across days within the specified windows."""
    today = date.today()
    day_counts: dict[date, int] = {}
    avg = max(1.0, per_day_avg)

    for start_date, end_date, total_commits in windows:
        if total_commits <= 0:
            continue

        candidates = []
        for day in get_days_in_range(start_date, end_date):
            if day > today:
                continue
            if day in blocked_dates:
                continue
            if skip_weekends and day.weekday() >= 5:
                continue
            candidates.append(day)

        if not candidates:
            continue

        active_days_count = min(len(candidates), max(1, round(total_commits / avg)), total_commits)
        chosen_days = sorted(pick_weighted_days(candidates, active_days_count, rng))

        commits_per_day = {day: 1 for day in chosen_days}
        remaining_commits = total_commits - active_days_count

        safety_limit = 0
        while remaining_commits > 0 and safety_limit < 100_000:
            safety_limit += 1
            day = rng.choice(chosen_days)
            if commits_per_day[day] < 8:
                commits_per_day[day] += 1
                remaining_commits -= 1

        day_counts.update(commits_per_day)

    return day_counts


def build_counts_from_dates(dates_spec: str) -> dict[date, int]:
    """Generate day counts from --dates argument."""
    return parse_dates_spec(dates_spec)


def build_counts_from_range(range_spec: str, per_day: int, skip_weekends: bool) -> dict[date, int]:
    """Generate day counts from --range argument."""
    start_date, end_date = parse_range_spec(range_spec)
    counts: dict[date, int] = {}
    for day in get_days_in_range(start_date, end_date):
        if not (skip_weekends and day.weekday() >= 5):
            counts[day] = max(0, per_day)
    return counts


def build_counts_from_year(year: int, per_day: int, skip_weekends: bool) -> dict[date, int]:
    """Generate day counts from --year argument."""
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    counts: dict[date, int] = {}
    for day in get_days_in_range(start_date, end_date):
        if not (skip_weekends and day.weekday() >= 5):
            counts[day] = max(0, per_day)
    return counts


def build_counts_from_text(text: str, start_date: date | None, scale: float) -> dict[date, int]:
    """Generate day counts from --text argument."""
    rows = render_text_banner(text)
    return map_pattern_to_dates(rows, start_date, scale)


def build_counts_from_pattern(file_path: str, start_date: date | None, scale: float) -> dict[date, int]:
    """Generate day counts from --pattern file argument."""
    rows = read_pattern_file(Path(file_path))
    return map_pattern_to_dates(rows, start_date, scale)


def build_all_day_counts(
    args: argparse.Namespace,
    blocked_dates: set[date] | frozenset[date] = frozenset(),
) -> dict[date, int]:
    """Build commit counts per day based on the chosen input source."""
    if args.dates:
        counts = build_counts_from_dates(args.dates)
    elif args.date_range:
        counts = build_counts_from_range(args.date_range, args.per_day, args.skip_weekends)
    elif args.year:
        counts = build_counts_from_year(args.year, args.per_day, args.skip_weekends)
    elif args.spread:
        rng = random.Random(args.seed)
        windows = parse_spread_spec(args.spread)
        return generate_spread_counts(
            windows=windows,
            rng=rng,
            per_day_avg=args.per_day_avg,
            blocked_dates=blocked_dates,
            skip_weekends=args.skip_weekends,
        )
    elif args.text:
        counts = build_counts_from_text(args.text, args.start, args.scale)
    elif args.pattern:
        counts = build_counts_from_pattern(args.pattern, args.start, args.scale)
    else:
        return {}

    if blocked_dates:
        counts = {day: count for day, count in counts.items() if day not in blocked_dates}

    return counts


def plan_commits(
    day_counts: dict[date, int],
    hour: int,
    jitter_minutes: int,
    tz: timezone,
    message_template: str,
    rng: random.Random,
) -> list[Commit]:
    """Convert target day counts into individual back-dated Commit objects."""
    commits: list[Commit] = []
    today = date.today()
    future_skipped = 0

    for day in sorted(day_counts.keys()):
        count = day_counts[day]
        if count <= 0:
            continue
        if day > today:
            future_skipped += 1
            continue

        for seq in range(count):
            jitter = rng.randint(-jitter_minutes, jitter_minutes) if jitter_minutes > 0 else 0
            commit_time = datetime(day.year, day.month, day.day, hour, 0, tzinfo=tz)
            commit_time += timedelta(minutes=jitter, seconds=seq)

            msg = (
                message_template
                .replace("{date}", day.isoformat())
                .replace("{seq}", str(seq + 1))
                .replace("{n}", str(count))
            )
            commits.append(Commit(when=commit_time, message=msg))

    if future_skipped > 0:
        print(f"note: ignored {future_skipped} date(s) in the future\n")

    commits.sort(key=lambda c: c.when)
    return commits


def print_grid_preview(day_counts: dict[date, int], label: str = "") -> None:
    """Print an ASCII/Unicode heatmap preview of the scheduled commits."""
    active_days = sorted(d for d, count in day_counts.items() if count > 0)
    if not active_days:
        print("(nothing to draw)")
        return

    first_sunday = get_sunday_before(active_days[0])
    weeks_count = (active_days[-1] - first_sunday).days // 7 + 1

    grid = [[0] * 7 for _ in range(weeks_count)]
    for day, count in day_counts.items():
        if count > 0:
            week_idx = (day - first_sunday).days // 7
            day_idx = (day - first_sunday).days % 7
            grid[week_idx][day_idx] = count_to_shade_level(count)

    shades = "\u00b7\u2591\u2592\u2593\u2588"
    day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    if label:
        print(label)
    for day_idx, name in enumerate(day_names):
        row_cells = "".join(shades[grid[w][day_idx]] for w in range(weeks_count))
        print(f"  {name} {row_cells}")

    plural = "week" if weeks_count == 1 else "weeks"
    print(f"        {weeks_count} {plural}, starting {first_sunday.isoformat()}\n")


def print_plan_summary(
    day_counts: dict[date, int],
    commits: list[Commit],
    args: argparse.Namespace,
) -> None:
    """Print summary statistics and terminal preview for the planned commits."""
    active_days = [d for d, count in day_counts.items() if count > 0 and d <= date.today()]
    source_description = (
        args.dates or args.date_range or args.year or args.spread or args.text or args.pattern
    )
    print()
    print(f"  commits : {len(commits)}")
    print(f"  days    : {len(active_days)}")
    print(f"  range   : {commits[0].when.date()} .. {commits[-1].when.date()}")
    print(f"  source  : {source_description}")
    print()

    active_counts = {d: day_counts[d] for d in active_days}
    print_grid_preview(active_counts, label="  preview:")


def run_git_command(
    repo_path: Path,
    git_args: list[str],
    env_vars: dict | None = None,
) -> subprocess.CompletedProcess:
    """Run a git CLI command in the specified repository folder."""
    return subprocess.run(
        ["git", "-C", str(repo_path), *git_args],
        capture_output=True,
        text=True,
        env=env_vars,
    )


def validate_local_git_repo(path_string: str | None, target_branch: str | None) -> tuple[Path, str]:
    """Validate that the specified directory is a git repository and return (path, branch)."""
    if shutil.which("git") is None:
        raise SystemExit("git is not installed or not on PATH")

    repo_path = Path(path_string or ".").expanduser().resolve()
    if not repo_path.is_dir():
        raise SystemExit(f"no such directory: {repo_path}")

    check = run_git_command(repo_path, ["rev-parse", "--is-inside-work-tree"])
    if check.returncode != 0:
        raise SystemExit(f"not a git repository: {repo_path}")

    current_branch = run_git_command(repo_path, ["rev-parse", "--abbrev-ref", "HEAD"]).stdout.strip()
    if current_branch in ("", "HEAD"):
        raise SystemExit(f"{repo_path} has no checked-out branch")

    if target_branch and target_branch != current_branch:
        raise SystemExit(
            f"checked-out branch is {current_branch!r}, but --branch is {target_branch!r}.\n"
            f"Check out that branch in {repo_path} first (or drop --branch)."
        )

    return repo_path, current_branch


def get_git_author_info(repo_path: Path, name_arg: str | None, email_arg: str | None) -> tuple[str, str]:
    """Retrieve author name and email from arguments or git config."""
    name = name_arg or run_git_command(repo_path, ["config", "user.name"]).stdout.strip()
    email = email_arg or run_git_command(repo_path, ["config", "user.email"]).stdout.strip()
    if not name or not email:
        raise SystemExit("Set --name and --email (or git config user.name / user.email).")
    return name, email


def create_local_git_commits(
    repo_path: Path,
    commits: list[Commit],
    author_name: str,
    author_email: str,
) -> None:
    """Create empty back-dated git commits in the local repository."""
    total = len(commits)
    for i, commit in enumerate(commits, 1):
        timestamp = commit.when.isoformat()
        env = dict(
            os.environ,
            GIT_AUTHOR_NAME=author_name,
            GIT_AUTHOR_EMAIL=author_email,
            GIT_AUTHOR_DATE=timestamp,
            GIT_COMMITTER_NAME=author_name,
            GIT_COMMITTER_EMAIL=author_email,
            GIT_COMMITTER_DATE=timestamp,
        )
        result = run_git_command(
            repo_path,
            ["commit", "--allow-empty", "--no-verify", "--no-gpg-sign", "-q", "-m", commit.message],
            env_vars=env,
        )
        if result.returncode != 0:
            raise SystemExit(f"\ngit commit failed:\n{result.stderr}")

        if i % 25 == 0 or i == total:
            print(f"\r  created {i}/{total} commits", end="", flush=True)
    print()


def execute_git_backend(args: argparse.Namespace, commits: list[Commit]) -> int:
    """Execute commit creation and push via local git CLI."""
    repo_path, branch = validate_local_git_repo(args.path, args.branch)
    author_name, author_email = get_git_author_info(repo_path, args.name, args.email)

    print(f"  author  : {author_name} <{author_email}>")
    print(f"  repo    : {repo_path} (local git)")

    if not args.yes and not confirm("\nCommit and push? [y/N] "):
        print("aborted.")
        return 1

    print(f"  committing on {branch} in {repo_path} ...")
    create_local_git_commits(repo_path, commits, author_name, author_email)

    print("  pushing ...")
    push_result = run_git_command(repo_path, ["push", "origin", f"HEAD:{branch}"])
    if push_result.returncode != 0:
        raise SystemExit(f"git push failed:\n{push_result.stderr}")

    print(f"done: {len(commits)} commits pushed from {repo_path} ({branch})")
    return 0


class GitHubAPI:
    """Simple wrapper for GitHub REST and GraphQL API calls."""

    def __init__(self, token: str):
        self.token = token
        self.base_url = os.environ.get("GHGRAPH_API_URL", "https://api.github.com").rstrip("/")

    def request(self, method: str, path: str, payload: dict | None = None) -> dict:
        """Send an HTTP request to GitHub REST API."""
        url = self.base_url + path
        data_bytes = json.dumps(payload).encode() if payload is not None else None

        req = urllib.request.Request(url, data=data_bytes, method=method)
        req.add_header("Authorization", f"Bearer {self.token}")
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", "ghgraph")
        if data_bytes is not None:
            req.add_header("Content-Type", "application/json")

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = resp.read()
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")
            if exc.code in (403, 429) and "rate limit" in detail.lower():
                raise SystemExit(
                    "GitHub rate limit hit. Wait a bit, or run with fewer commits at a time.\n"
                    + detail[:400]
                )
            raise SystemExit(f"{method} {path} -> HTTP {exc.code}\n{detail[:800]}")
        except urllib.error.URLError as exc:
            raise SystemExit(f"network error talking to GitHub: {exc.reason}")

    def graphql(self, query: str, variables: dict) -> dict:
        """Send a GraphQL query to GitHub."""
        response = self.request("POST", "/graphql", {"query": query, "variables": variables})
        if response.get("errors"):
            raise SystemExit("GitHub GraphQL error: " + json.dumps(response["errors"])[:600])
        return response.get("data") or {}


CONTRIBUTION_QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}
"""


def fetch_occupied_days(api: GitHubAPI, login: str, years: list[int]) -> set[date]:
    """Fetch calendar days that already have at least one contribution."""
    occupied: set[date] = set()
    now = datetime.now(timezone.utc)

    for year in years:
        from_time = datetime(year, 1, 1, tzinfo=timezone.utc)
        if from_time > now:
            continue
        to_time = min(datetime(year, 12, 31, 23, 59, 59, tzinfo=timezone.utc), now)

        result = api.graphql(
            CONTRIBUTION_QUERY,
            {
                "login": login,
                "from": from_time.isoformat().replace("+00:00", "Z"),
                "to": to_time.isoformat().replace("+00:00", "Z"),
            },
        )
        user = result.get("user")
        if not user:
            raise SystemExit(f"could not read the contribution calendar of {login!r}")

        weeks = user["contributionsCollection"]["contributionCalendar"]["weeks"]
        for week in weeks:
            for day in week["contributionDays"]:
                if day["contributionCount"] > 0:
                    occupied.add(date.fromisoformat(day["date"]))

    return occupied


CARD_CONTRIBUTION_QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
"""

GRAPHQL_LEVEL_MAP = {
    "NONE": 0,
    "FIRST_QUARTILE": 1,
    "SECOND_QUARTILE": 2,
    "THIRD_QUARTILE": 3,
    "FOURTH_QUARTILE": 4,
}

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def fetch_calendar_via_graphql(api: GitHubAPI, login: str) -> tuple[list[list[int]], list[tuple[str, int]], int, int]:
    """Fetch the rolling 52-week contribution calendar using GitHub GraphQL API."""
    now = datetime.now(timezone.utc)
    from_time = now - timedelta(days=364)

    result = api.graphql(
        CARD_CONTRIBUTION_QUERY,
        {
            "login": login,
            "from": from_time.isoformat().replace("+00:00", "Z"),
            "to": now.isoformat().replace("+00:00", "Z"),
        },
    )
    user = result.get("user")
    if not user:
        raise SystemExit(f"could not read the contribution calendar of {login!r}")

    cal = user["contributionsCollection"]["contributionCalendar"]
    total_contributions = int(cal.get("totalContributions", 0))
    raw_weeks = cal.get("weeks", [])[-52:]

    grid: list[list[int]] = [[0] * 7 for _ in range(52)]
    month_labels: list[tuple[str, int]] = []
    seen_months: set[tuple[int, int]] = set()
    active_days = 0

    col_offset = max(0, 52 - len(raw_weeks))
    for w_idx, week in enumerate(raw_weeks):
        col = col_offset + w_idx
        if col >= 52:
            break
        days = week.get("contributionDays", [])
        for d_idx, day in enumerate(days[:7]):
            cnt = int(day.get("contributionCount", 0))
            lvl = GRAPHQL_LEVEL_MAP.get(day.get("contributionLevel", "NONE"), count_to_shade_level(cnt))
            grid[col][d_idx] = lvl
            if cnt > 0:
                active_days += 1
            if d_idx == 0:
                d_obj = date.fromisoformat(day["date"])
                key = (d_obj.year, d_obj.month)
                if key not in seen_months:
                    seen_months.add(key)
                    if not month_labels or col - month_labels[-1][1] >= 3:
                        month_labels.append((MONTH_NAMES[d_obj.month - 1], col))

    return grid, month_labels, total_contributions, active_days


def fetch_calendar_via_public_html(login: str) -> tuple[list[list[int]], list[tuple[str, int]], int, int]:
    """Fallback to GitHub public contributions endpoint when no token is provided."""
    url = f"https://github.com/users/{login}/contributions"
    req = urllib.request.Request(url, headers={"User-Agent": "ghgraph"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8", "replace")
    except (urllib.error.HTTPError, urllib.error.URLError) as exc:
        raise SystemExit(f"Failed to fetch public contributions for {login!r}: {exc}")

    day_entries = re.findall(r'data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"', body)
    if not day_entries:
        day_entries = re.findall(r'data-level="([0-4])"[^>]*data-date="(\d{4}-\d{2}-\d{2})"', body)
        day_entries = [(d, l) for l, d in day_entries]

    if not day_entries:
        raise SystemExit(f"No contribution calendar cells found for {login!r}")

    day_map: dict[date, int] = {}
    for d_str, lvl_str in day_entries:
        day_map[date.fromisoformat(d_str)] = int(lvl_str)

    sorted_dates = sorted(day_map.keys())
    end_date = sorted_dates[-1]
    start_sunday = get_sunday_before(end_date) - timedelta(days=7 * 51)

    grid: list[list[int]] = [[0] * 7 for _ in range(52)]
    month_labels: list[tuple[str, int]] = []
    seen_months: set[tuple[int, int]] = set()
    active_days = 0

    for c in range(52):
        for r in range(7):
            d_obj = start_sunday + timedelta(days=c * 7 + r)
            lvl = day_map.get(d_obj, 0)
            grid[c][r] = lvl
            if lvl > 0:
                active_days += 1
            if r == 0:
                key = (d_obj.year, d_obj.month)
                if key not in seen_months:
                    seen_months.add(key)
                    if not month_labels or c - month_labels[-1][1] >= 3:
                        month_labels.append((MONTH_NAMES[d_obj.month - 1], c))

    total_match = re.search(r"([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year", body, re.IGNORECASE)
    if total_match:
        total_contributions = int(total_match.group(1).replace(",", ""))
    else:
        total_contributions = sum(LEVEL_COUNTS.get(grid[c][r], 0) for c in range(52) for r in range(7))

    return grid, month_labels, total_contributions, active_days


def render_svg_card(
    username: str,
    grid: list[list[int]],
    month_labels: list[tuple[str, int]],
    total_commits: int,
    active_days: int,
    theme: str = "dark",
    show_stats: bool = True,
) -> str:
    """Render an animated M3 Expressive pastel SVG contribution heatmap card."""
    clean_user = html.escape((username or "").strip() or "username")
    is_dark = theme == "dark"
    h = 204 if show_stats else 166

    bg = "#1a181c" if is_dark else "#ffffff"
    border = "rgba(206, 196, 207, 0.12)" if is_dark else "rgba(78, 68, 82, 0.14)"
    text = "#ebe4eb" if is_dark else "#1d1a20"
    text_dim = "#9a919c" if is_dark else "#7d7281"
    accent = "#d9b9ff" if is_dark else "#6e4d8e"
    accent_container = "#533571" if is_dark else "#efddff"
    on_accent_container = "#efddff" if is_dark else "#270747"
    cell_border = "rgba(255, 255, 255, 0.05)" if is_dark else "rgba(0, 0, 0, 0.05)"

    cell_colors = (
        {0: "#211e23", 1: "#1c382b", 2: "#2d6248", 3: "#50b57e", 4: "#8af2b3"}
        if is_dark
        else {0: "#ede7f0", 1: "#a8e6be", 2: "#60ce8a", 3: "#37ad66", 4: "#1d7e44"}
    )

    start_x = 56.0
    start_y = 66.0
    step = 14.5
    cell_size = 11

    cells_parts: list[str] = []
    for c in range(52):
        fade_delay = f"{c * 0.018:.3f}s"
        shimmer_delay = f"{1.2 + c * 0.055:.3f}s"
        for r in range(7):
            lvl = grid[c][r]
            x = f"{start_x + c * step:.1f}"
            y = f"{start_y + r * step:.1f}"
            color = cell_colors.get(lvl, cell_colors[0])
            if lvl > 0:
                cls = "cell-active"
                delay_style = f"animation-delay:{fade_delay},{shimmer_delay};"
            else:
                cls = "cell"
                delay_style = f"animation-delay:{fade_delay};"
            cells_parts.append(
                f'<rect class="{cls}" x="{x}" y="{y}" width="{cell_size}" height="{cell_size}" '
                f'rx="2.5" fill="{color}" stroke="{cell_border}" stroke-width="0.7" style="{delay_style}"/>'
            )

    months_parts: list[str] = []
    for name, col in month_labels:
        x = f"{start_x + col * step:.1f}"
        months_parts.append(
            f'<text x="{x}" y="52" font-family="\'Outfit\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif" '
            f'font-size="10" font-weight="500" fill="{text_dim}">{name}</text>'
        )

    weekdays_parts: list[str] = []
    for name, row in (("Mon", 1), ("Wed", 3), ("Fri", 5)):
        y = f"{start_y + row * step + 9:.1f}"
        weekdays_parts.append(
            f'<text x="28" y="{y}" font-family="\'Outfit\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif" '
            f'font-size="10" font-weight="500" fill="{text_dim}">{name}</text>'
        )

    legend_y = 186 if show_stats else 150
    stats_text = (
        f'<text x="28" y="0" font-family="\'JetBrains Mono\', monospace" font-size="11" font-weight="500" '
        f'fill="{accent}">{total_commits} contributions \u00b7 {active_days} active days</text>'
        if show_stats
        else ""
    )

    footer_svg = f"""  <g transform="translate(0, {legend_y})">
    {stats_text}
    <text x="696" y="0" text-anchor="end" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="{text_dim}">Less</text>
    <rect x="704" y="-9" width="9" height="9" rx="2" fill="{cell_colors[0]}" stroke="{cell_border}" stroke-width="0.5"/>
    <rect x="716" y="-9" width="9" height="9" rx="2" fill="{cell_colors[1]}" stroke="{cell_border}" stroke-width="0.5"/>
    <rect x="728" y="-9" width="9" height="9" rx="2" fill="{cell_colors[2]}" stroke="{cell_border}" stroke-width="0.5"/>
    <rect x="740" y="-9" width="9" height="9" rx="2" fill="{cell_colors[3]}" stroke="{cell_border}" stroke-width="0.5"/>
    <rect x="752" y="-9" width="9" height="9" rx="2" fill="{cell_colors[4]}" stroke="{cell_border}" stroke-width="0.5"/>
    <text x="768" y="0" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="{text_dim}">More</text>
  </g>"""

    style_block = """  <style>
    .ghgraph-badge-link { cursor: pointer; text-decoration: none; }
    .ghgraph-badge-link:hover rect { opacity: 0.85; }
    .cell { opacity: 0; transform-box: fill-box; transform-origin: center; animation: cellFadeIn 0.45s cubic-bezier(0.2, 0, 0, 1) forwards; }
    .cell-active { opacity: 0; transform-box: fill-box; transform-origin: center; animation: cellFadeIn 0.45s cubic-bezier(0.2, 0, 0, 1) forwards, shimmerWave 6s ease-in-out infinite; }
    @keyframes cellFadeIn { from { opacity: 0; transform: scale(0.84); } to { opacity: 1; transform: scale(1); } }
    @keyframes shimmerWave { 0%, 82%, 100% { filter: brightness(1); } 90% { filter: brightness(1.38); } }
  </style>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 {h}" width="820" height="{h}" fill="none">
{style_block}
  <rect width="820" height="{h}" rx="14" fill="{bg}" stroke="{border}" stroke-width="1"/>
  <text x="28" y="33" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" font-weight="600" fill="{text}">@{clean_user}</text>
  <a href="https://github.com/arhylsion/ghgraph" target="_blank" rel="noopener noreferrer" class="ghgraph-badge-link">
    <g transform="translate(726, 17)">
      <rect width="66" height="22" rx="11" fill="{accent_container}"/>
      <text x="33" y="15" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="{on_accent_container}">ghgraph</text>
    </g>
  </a>
  {''.join(months_parts)}
  {''.join(weekdays_parts)}
  <g>{''.join(cells_parts)}</g>
{footer_svg}
</svg>
"""


def execute_card_generation(args: argparse.Namespace, token: str | None) -> int:
    """Fetch contribution calendar and write animated SVG card(s) to disk."""
    username = args.username
    if not username and args.repo and "/" in args.repo:
        username = args.repo.split("/", 1)[0]

    api: GitHubAPI | None = None
    if token:
        api = GitHubAPI(token)
        if not username:
            try:
                username = api.request("GET", "/user")["login"]
            except SystemExit:
                username = None

    if not username:
        print("Provide --username USER (or --repo USER/REPO) when using --card.", file=sys.stderr)
        return 2

    if api is not None:
        try:
            grid, month_labels, total_commits, active_days = fetch_calendar_via_graphql(api, username)
        except SystemExit:
            grid, month_labels, total_commits, active_days = fetch_calendar_via_public_html(username)
    else:
        grid, month_labels, total_commits, active_days = fetch_calendar_via_public_html(username)

    show_stats = not args.no_stats
    out_path = Path(args.output or "assets")
    themes = ["dark", "light"] if args.theme == "both" else [args.theme]

    if len(themes) == 1 and out_path.suffix.lower() == ".svg":
        out_path.parent.mkdir(parents=True, exist_ok=True)
        svg_text = render_svg_card(username, grid, month_labels, total_commits, active_days, themes[0], show_stats)
        out_path.write_text(svg_text, encoding="utf-8")
        print(f"generated {out_path} ({total_commits} contributions, {active_days} active days)")
    else:
        out_path.mkdir(parents=True, exist_ok=True)
        for t in themes:
            target = out_path / f"ghgraph-{t}.svg"
            svg_text = render_svg_card(username, grid, month_labels, total_commits, active_days, t, show_stats)
            target.write_text(svg_text, encoding="utf-8")
            print(f"generated {target} ({total_commits} contributions, {active_days} active days)")

    return 0


def resolve_author_identity(
    api: GitHubAPI,
    name_arg: str | None,
    email_arg: str | None,
) -> tuple[str, str, str]:
    """Resolve GitHub username, author name, and author email."""
    user = api.request("GET", "/user")
    login = user["login"]
    name = name_arg or user.get("name") or login
    email = email_arg or f'{user["id"]}+{login}@users.noreply.github.com'
    return login, name, email


def check_repo_warnings(repo_info: dict, repo_owner: str, user_login: str) -> list[str]:
    """Check potential issues that might prevent contributions from appearing on GitHub."""
    warnings = []
    if repo_owner.lower() != user_login.lower():
        warnings.append(
            f"the repo is owned by {repo_owner!r}, not you - commits there will NOT count "
            "towards your graph unless you have push access and the repo is not a fork"
        )
    if repo_info.get("fork"):
        warnings.append("the repo is a fork - contributions to forks are not counted")
    if repo_info.get("private"):
        warnings.append(
            "the repo is private - make sure 'Include private contributions on my profile' "
            "is enabled in your profile settings"
        )
    return warnings


def push_commits_via_api(
    api: GitHubAPI,
    repo_name: str,
    branch: str,
    commits: list[Commit],
    author_name: str,
    author_email: str,
) -> None:
    """Create Git commit objects directly using GitHub Git Database API and update the branch."""
    ref_data = api.request("GET", f"/repos/{repo_name}/git/ref/heads/{branch}")
    head_sha = ref_data["object"]["sha"]

    base_commit = api.request("GET", f"/repos/{repo_name}/git/commits/{head_sha}")
    tree_sha = base_commit["tree"]["sha"]

    total = len(commits)
    parent_sha = head_sha
    print(f"  pushing to {repo_name}@{branch} ...")

    for i, commit in enumerate(commits, 1):
        timestamp = commit.when.isoformat()
        payload = {
            "message": commit.message,
            "tree": tree_sha,
            "parents": [parent_sha],
            "author": {"name": author_name, "email": author_email, "date": timestamp},
            "committer": {"name": author_name, "email": author_email, "date": timestamp},
        }
        commit_res = api.request("POST", f"/repos/{repo_name}/git/commits", payload)
        parent_sha = commit_res["sha"]

        if i % 25 == 0 or i == total:
            print(f"\r  created {i}/{total} commits", end="", flush=True)
    print()

    api.request(
        "PATCH",
        f"/repos/{repo_name}/git/refs/heads/{branch}",
        {"sha": parent_sha, "force": False},
    )
    print(f"done: {total} commits -> {repo_name}@{branch} ({parent_sha[:7]})")


def execute_api_backend(args: argparse.Namespace, commits: list[Commit], token: str | None) -> int:
    """Execute commit creation directly using GitHub REST API."""
    if not args.repo or "/" not in args.repo:
        print("--repo OWNER/NAME is required for the api backend.", file=sys.stderr)
        return 2

    if not token:
        print(
            "No token. Set GITHUB_TOKEN (classic PAT with 'repo' scope, or a fine-grained\n"
            "token with 'Contents: read and write' on the target repo).",
            file=sys.stderr,
        )
        return 2

    api = GitHubAPI(token)
    login, author_name, author_email = resolve_author_identity(api, args.name, args.email)
    repo_info = api.request("GET", f"/repos/{args.repo}")
    branch = args.branch or repo_info["default_branch"]

    print(f"  author  : {author_name} <{author_email}>")
    print(f"  repo    : {args.repo} (default branch: {repo_info['default_branch']})")
    print(f"  account : {login}")

    repo_owner = args.repo.split("/")[0]
    warnings = check_repo_warnings(repo_info, repo_owner, login)
    if warnings:
        print()
        for warning in warnings:
            print(f"  warning: {warning}")

    print()
    if not args.yes and not confirm("Push these commits? [y/N] "):
        print("aborted.")
        return 1

    push_commits_via_api(api, args.repo, branch, commits, author_name, author_email)
    return 0


def confirm(prompt_message: str) -> bool:
    """Prompt the user for a yes/no confirmation."""
    try:
        reply = input(prompt_message).strip().lower()
        return reply in ("y", "yes")
    except (EOFError, KeyboardInterrupt):
        return False


def validate_arguments(args: argparse.Namespace) -> None:
    """Validate argument bounds."""
    if not (0 <= args.hour <= 23):
        raise SystemExit("--hour must be between 0 and 23.")


EPILOG = """\
examples:
  ghgraph.py --repo me/activity --spread "2024-06-01..2024-12-31:40,2025-01-01..2025-12-31:80"
  ghgraph.py --repo me/activity --year 2025 --only-empty
  ghgraph.py --repo me/activity --year 2020 --per-day 2 --skip-weekends
  ghgraph.py --repo me/activity --dates "2020-05-04:5,2020-05-06:2"
  ghgraph.py --repo me/activity --text "HELLO" --start 2020-03-01
  ghgraph.py --repo me/activity --pattern art.txt --start 2020-06-01
  ghgraph.py --repo me/activity --spread "2024-06-01..2024-12-31:40" --dry-run

pattern files: 7 lines (Sunday..Saturday), each character is a shade:
  0 or space/dot = empty, 1..4 = light..dark, also -, +, *, #
"""


def build_parser() -> argparse.ArgumentParser:
    """Build the command-line argument parser."""
    p = argparse.ArgumentParser(
        prog="ghgraph",
        description="Paint back-dated commits onto a GitHub contribution graph.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=EPILOG,
    )
    p.add_argument("--repo", metavar="OWNER/NAME", help="target repository")
    p.add_argument("--token", help="GitHub token (default: $GITHUB_TOKEN or $GH_TOKEN)")
    p.add_argument("--branch", help="branch to write to (default: repo default branch)")
    p.add_argument("--name", help="author name (default: your GitHub name)")
    p.add_argument("--email", help="author email (default: your GitHub noreply address)")
    p.add_argument("--backend", choices=["api", "git"], default="api",
                   help="api (default, no clone needed) or git (local clone)")
    p.add_argument("--path", help="local clone path, for --backend git (default: .)")

    p.add_argument("--hour", type=int, default=12, help="hour of day (default 12)")
    p.add_argument("--jitter", type=int, default=30, help="+/- minutes, default 30")
    p.add_argument("--tz", default="+00:00", help="timezone offset, default +00:00")
    p.add_argument("--message", default="Update {date}",
                   help="commit message template; {date}, {seq}, {n} are filled in")
    p.add_argument("--scale", type=float, default=1.0,
                   help="multiply commit counts from patterns/text (default 1.0)")
    p.add_argument("--seed", type=int, help="random seed, for repeatable jitter")

    src = p.add_mutually_exclusive_group()
    src.add_argument("--dates", help='YYYY-MM-DD[:COUNT], comma/space separated')
    src.add_argument("--range", dest="date_range", metavar="START..END")
    src.add_argument("--year", type=int, help="fill a whole calendar year, e.g. 2020")
    src.add_argument("--spread", metavar='"START..END:COUNT,..."',
                     help="hand out COUNT commits at random inside each range")
    src.add_argument("--text", help="text banner, A-Z 0-9")
    src.add_argument("--pattern", help="path to a 7-row pattern file")

    p.add_argument("--per-day", type=int, default=1, help="commits per day for --range/--year")
    p.add_argument("--skip-weekends", action="store_true", help="for --range/--year/--spread")
    p.add_argument("--per-day-avg", type=float, default=1.15, metavar="N",
                   help="for --spread: commits per active day, default 1.15 "
                        "(lower = more days, each with ~1 commit)")
    p.add_argument("--only-empty", action="store_true",
                   help="skip days that already have contributions (needs a token)")
    p.add_argument("--start", type=date.fromisoformat, metavar="YYYY-MM-DD",
                   help="first column of --text/--pattern, snapped to Sunday")

    p.add_argument("--card", action="store_true",
                   help="generate animated M3 SVG contribution card(s) for Profile README")
    p.add_argument("--username", help="GitHub username for --card (default: inferred from --repo or token)")
    p.add_argument("--theme", choices=["dark", "light", "both"], default="both",
                   help="card theme for --card (default: both)")
    p.add_argument("--output", default="assets",
                   help="output directory or .svg file path for --card (default: assets)")
    p.add_argument("--no-stats", action="store_true",
                   help="hide summary stats bar on generated --card SVG")

    p.add_argument("--dry-run", action="store_true", help="print the plan, touch nothing")
    p.add_argument("-y", "--yes", action="store_true", help="skip the confirmation prompt")
    return p


def main(argv: list[str] | None = None) -> int:
    """Main program entrypoint."""
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    parser = build_parser()
    args = parser.parse_args(argv)
    validate_arguments(args)

    tz = parse_tz(args.tz)
    rng = random.Random(args.seed)
    token = args.token or os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")

    if args.card:
        return execute_card_generation(args, token)

    blocked_dates: set[date] = set()
    if args.only_empty:
        if not token:
            print("--only-empty needs a token to read your contribution calendar.", file=sys.stderr)
            return 2
        api = GitHubAPI(token)
        login = api.request("GET", "/user")["login"]
        target_counts = build_all_day_counts(args)
        years = sorted({day.year for day in target_counts.keys()})
        if years:
            blocked_dates = fetch_occupied_days(api, login, years)
            print(
                f"\n  --only-empty: {len(blocked_dates)} day(s) in {years[0]}-{years[-1]} already "
                "have contributions, leaving them alone"
            )

    day_counts = build_all_day_counts(args, blocked_dates)
    if not day_counts:
        print(
            "Nothing to do. Pick a source:\n"
            '  --dates "2020-05-04:3"  |  --year 2020  |  --range 2020-01-01..2020-12-31\n'
            '  --spread "2024-06-01..2024-12-31:40"  |  --text "HELLO"  |  --pattern art.txt\n'
            "See --help for details.",
            file=sys.stderr,
        )
        return 2

    commits = plan_commits(
        day_counts=day_counts,
        hour=args.hour,
        jitter_minutes=abs(args.jitter),
        tz=tz,
        message_template=args.message,
        rng=rng,
    )
    if not commits:
        print("Nothing to commit (all dates were skipped).", file=sys.stderr)
        return 2

    print_plan_summary(day_counts, commits, args)

    if args.dry_run:
        print("  dry run: nothing was sent to GitHub.")
        return 0

    if args.backend == "git":
        return execute_git_backend(args, commits)
    else:
        return execute_api_backend(args, commits, token)


if __name__ == "__main__":
    raise SystemExit(main())
