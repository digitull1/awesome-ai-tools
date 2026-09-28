# Comment lookup

Every **Cooked or not?** Short ends with *"Comment your job. We'll look it up."* This answers those comments in seconds.

```sh
python3 lookup.py job "graphic designer"    # rank of 785 in Microsoft's AI applicability data, and a reply to paste
python3 lookup.py major "psychology"        # NY Fed recent-grad unemployment and underemployment, and a reply
```

- **Jobs** come from Microsoft Research's *Working with AI* results (v1.1, CC BY 4.0), copied to [data/](data/). The tool maps everyday words ("nurse", "coder", "barista") to the US job titles in the data, and prints up to three matches when it isn't sure. Check the match before you paste.
- **Majors** are fetched live from the New York Fed's *Labor Market for Recent College Graduates* (2024 data).
- Replies say what the number measures and what it doesn't, name the source, and never mention the person. Log each request in [requests.md](requests.md).

Rules and sources: [scripts/cooked-or-not.md](../../scripts/cooked-or-not.md).
