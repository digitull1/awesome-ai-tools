"""Answer "Cooked or not?" comments in seconds: look up a job or a degree and print a reply to paste.

    python3 lookup.py job "graphic designer"
    python3 lookup.py major "psychology"

Jobs: Microsoft Research, "Working with AI: Measuring the Applicability of Generative AI to
Occupations" (arXiv 2507.07935 v6, Dec 2025), results files v1.1 (CC BY 4.0), copied to data/.
785 US occupations ranked by AI applicability score: how much of the job's work activities
overlap with what people successfully use AI (Bing Copilot) for. Not a forecast of job loss.

Majors: Federal Reserve Bank of New York, "The Labor Market for Recent College Graduates",
outcomes by major (2024 data, published Feb 2026), fetched live from newyorkfed.org.

Replies follow the series rules in ../../scripts/cooked-or-not.md: the source's own numbers,
the caveat every time, no verdict we can't back, and nothing about the commenter.
"""
import csv
import difflib
import io
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
JOBS_CSV = os.path.join(HERE, 'data', 'microsoft-ai-applicability-v1.1.csv')
MAJORS_URL = 'https://www.newyorkfed.org/medialibrary/research/interactives/data/college-labor-market/college-labor-outcomes-by-major-data.csv'

# What people type, mapped to the occupation title in the data.
ALIASES = {
    'software engineer': 'Software Developers', 'programmer': 'Computer Programmers', 'coder': 'Software Developers',
    'developer': 'Software Developers', 'web developer': 'Web Developers', 'data scientist': 'Data Scientists',
    'nurse': 'Registered Nurses', 'doctor': 'Family Medicine Physicians', 'gp': 'Family Medicine Physicians',
    'teacher': 'Elementary School Teachers, Except Special Education', 'primary teacher': 'Elementary School Teachers, Except Special Education',
    'high school teacher': 'Secondary School Teachers, Except Special and Career/Technical Education',
    'lecturer': 'Business Teachers, Postsecondary', 'lawyer': 'Lawyers', 'solicitor': 'Lawyers', 'paralegal': 'Paralegals and Legal Assistants',
    'accountant': 'Accountants and Auditors', 'bookkeeper': 'Bookkeeping, Accounting, and Auditing Clerks',
    'designer': 'Graphic Designers', 'graphic designer': 'Graphic Designers', 'ux designer': 'Web and Digital Interface Designers',
    'marketer': 'Market Research Analysts and Marketing Specialists', 'marketing': 'Market Research Analysts and Marketing Specialists',
    'writer': 'Writers and Authors', 'copywriter': 'Writers and Authors', 'journalist': 'News Analysts, Reporters, and Journalists',
    'translator': 'Interpreters and Translators', 'customer service': 'Customer Service Representatives',
    'call centre': 'Customer Service Representatives', 'call center': 'Customer Service Representatives',
    'sales': 'Sales Representatives of Services, Except Advertising, Insurance, Financial Services, and Travel',
    'hr': 'Human Resources Specialists', 'recruiter': 'Human Resources Specialists', 'project manager': 'Project Management Specialists',
    'electrician': 'Electricians', 'plumber': 'Plumbers, Pipefitters, and Steamfitters', 'mechanic': 'Automotive Service Technicians and Mechanics',
    'chef': 'Chefs and Head Cooks', 'cook': 'Cooks, Restaurant', 'pharmacist': 'Pharmacists', 'dentist': 'Dentists, General',
    'architect': 'Architects, Except Landscape and Naval', 'engineer': 'Mechanical Engineers', 'police': "Police and Sheriff's Patrol Officers",
    'cashier': 'Cashiers', 'receptionist': 'Receptionists and Information Clerks', 'admin': 'Secretaries and Administrative Assistants, Except Legal, Medical, and Executive',
    'photographer': 'Photographers', 'animator': 'Special Effects Artists and Animators', 'musician': 'Musicians and Singers',
    'psychologist': 'Clinical and Counseling Psychologists', 'social worker': 'Child, Family, and School Social Workers',
    'financial analyst': 'Financial and Investment Analysts', 'truck driver': 'Heavy and Tractor-Trailer Truck Drivers',
    'barista': 'Fast Food and Counter Workers', 'waiter': 'Waiters and Waitresses', 'waitress': 'Waiters and Waitresses',
}


def norm(s):
    return re.sub(r'[^a-z0-9 ]+', ' ', s.lower()).strip()


def best(query, names, aliases=None):
    q = norm(query).rstrip('s')
    if aliases:
        for k, v in aliases.items():
            if norm(k) == q or norm(k) + 's' == norm(query):
                return [v]
    exact = [n for n in names if norm(n).rstrip('s') == q]
    if exact:
        return exact
    words = [w for w in q.split() if len(w) > 2]
    hits = [n for n in names if words and all(w in norm(n) for w in words)]
    if hits:
        return sorted(hits, key=len)[:3]
    return difflib.get_close_matches(query, names, n=3, cutoff=0.6)


def pretty(title):
    # "Dentists, General" -> "Dentists"; "Teachers, Except Special Education" -> "Teachers"
    return re.sub(r', (Except|All Other|General)\b.*$', '', title)


def job(query):
    rows = list(csv.DictReader(open(JOBS_CSV, encoding='utf-8')))
    rows.sort(key=lambda r: -float(r['ai_applicability_score']))
    rank = {r['title']: i + 1 for i, r in enumerate(rows)}
    found = best(query, list(rank), ALIASES)
    if not found:
        print(f'No match for "{query}". Try another word for the job (the data uses US job titles).')
        return
    n = len(rows)
    for title in found:
        k = rank[title]
        where = 'top 10' if k <= 10 else 'top 40' if k <= 40 else f'top {max(1, round(100 * k / n))}%' if k <= n / 2 else f'bottom {max(1, round(100 * (n - k + 1) / n))}%'
        print(f'\n{title}: #{k} of {n} ({where})\n')
        print(f'Reply: {pretty(title)} rank #{k} of {n} in Microsoft\'s data ({where}). The higher up, the more of the job\'s '
              f'tasks overlap with what people already use AI for. It measures overlap, not job loss: the researchers say '
              f'reading it as job loss "would be a mistake". The tasks change first, so it\'s worth testing what\'s next to '
              f'yours: offladder.com')
    print('\nSource: Microsoft Research, Working with AI (2025), data v1.1.')


def major(query):
    with urllib.request.urlopen(urllib.request.Request(MAJORS_URL, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as r:
        rows = list(csv.DictReader(io.StringIO(r.read().decode('utf-8'))))
    by = {r['Major']: r for r in rows}
    allg = by.pop('Overall')
    ranked = sorted(by, key=lambda m: -float(by[m]['Unemployment Rate']))
    found = best(query, list(by))
    if not found:
        print(f'No match for "{query}". The NY Fed lists {len(by)} majors.')
        return
    for m in found:
        r = by[m]
        u, ue = float(r['Unemployment Rate']), float(r['Underemployment Rate'])
        k = ranked.index(m) + 1
        print(f'\n{m}: unemployment {u:.1f}% (#{k} highest of {len(by)}), underemployment {ue:.0f}%\n')
        print(f'Reply: Recent {m.lower()} grads (ages 22-27): {u:.1f}% unemployed, vs {float(allg["Unemployment Rate"]):.1f}% for all '
              f'recent grads. {ue:.0f}% work in jobs that don\'t need a degree (all grads: {float(allg["Underemployment Rate"]):.0f}%). '
              f'NY Fed, 2024 data. A degree is one bet; testing the work next to it is a cheaper one: offladder.com')


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('job', 'major'):
        print(__doc__)
        sys.exit(1)
    (job if sys.argv[1] == 'job' else major)(' '.join(sys.argv[2:]))
