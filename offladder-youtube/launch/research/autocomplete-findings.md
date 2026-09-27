# Research sprint, step 1: YouTube search language

*Run 27 September 2026, following [09-launch-plan.md](../../09-launch-plan.md#week--4-research-sprint).*

**Method.** 30 seed phrases were sent to YouTube's search-suggestion endpoint (`ds=yt`) for Great Britain, and 12 key seeds again for the United States. Suggestions reflect what people type, not how many people type it: they show the *language* to use, not search volume. Raw data: [autocomplete-gb-2026-09-27.json](autocomplete-gb-2026-09-27.json) and [autocomplete-us-2026-09-27.json](autocomplete-us-2026-09-27.json).

UK and US suggestions were almost identical for career phrases, so one title can serve both markets.

---

## What the data confirms

| Slate video | Search language found | Verdict |
|---|---|---|
| 01 *I Don't Know What Career I Want* | "i don't know what career i want", "…to pursue", "…to choose", "i don't know which career is right for me" | ✅ The title matches the top suggestion word for word. Keep it. |
| 03 *Stop Asking Which Jobs AI Can't Replace* | "jobs ai can't replace", "jobs ai will never replace", "ai proof jobs", "ai future proof jobs" | ✅ Title A contains the exact phrase. Keep it. |
| 15 *Is 30 Too Late to Change Careers?* | "career change at 30" (and 25, 28, 35, 36, 40, 45, 50, 55, 60), "career switch at 30", "is it too late to start over at 30" | ⚠️ Lead with the phrase people type. See the recommendation below. |
| 06 *Changing careers at 41* | "career change at 40", "career change at 40 uk", "how to change careers in your 40s" | ✅ Use "career change at [age]" in the title once the subject is cast. |
| 09 / 13 *Before You Become a…* | "before you become a nurse", "…a pilot", "…a firefighter", "…an electrician", "…a police officer" | ✅ The formula has real demand. A nurse episode belongs on the slate. |
| 22 *Vet nurse, Last Tuesday* | "vet nurse day in the life", "vet nurse day in the life uk" | ⚠️ Searchers say "day in the life", not "last Tuesday". See below. |
| 13 *Paramedic, Last Tuesday* | "what does a paramedic do", "what does a paramedic do uk" | ⚠️ Use "what does a paramedic do" in the title or the first description line. |
| 04 *I Asked ChatGPT to Choose My Career* | "chatgpt career advice", "chatgpt career coach", "chatgpt prompts for career" | ✅ Put "ChatGPT career advice" in the description, and consider title C as the Test & Compare variant. |
| 17 *Your Hobby Is a Verb* and Hobby → Verb Shorts | "jobs for people who like math", "…art", "…animals", "…nature", "…music" | ✅ Use "jobs for people who like [X]" in Hobby → Verb titles. |
| The Job Nobody Told You About | "weird jobs that actually exist", "weird jobs you can actually get", "jobs that don't exist yet", "jobs no one talks about" | ✅ Use this language in descriptions and Shorts titles. |
| 07 *What to Say When Someone Asks What You Want to Be* | "what do you want to be when you grow up" (plus song and meme results) | ✅ Put the exact question in the description. Expect competition from songs and memes for the phrase itself. |

## What to avoid

- **"Will AI take my job"** is dominated by a Channel 4 *Dispatches* documentary of that name. Drop title C of video 03, which starts with those words.
- **"How to find your passion"** is a large query, but it contradicts the method (test, don't find). Use it in descriptions at most.

## Recommended title changes

| Video | Current launch title | Recommended launch title | Why |
|---|---|---|---|
| 15 | Is 30 Too Late to Change Careers? Try This 2-Week Test First | **Career Change at 30: Is It Too Late? (Try This 2-Week Test)** | Front-loads the phrase people type |
| 22 | What a Vet Nurse Actually Did Last Tuesday (Hour by Hour) | **Vet Nurse Day in the Life (The Honest Version)** | Matches "vet nurse day in the life"; "honest" carries the series promise |
| 13 | What a Paramedic Actually Did Last Tuesday (Hour by Hour) | **What Does a Paramedic Actually Do? (Hour by Hour)** | Matches "what does a paramedic do" |
| 03 | Title C: *Will AI Take My Job? Run This 20-Minute Test on Your Week* | **Drop title C.** Keep A and B for Test & Compare | Avoids competing with a documentary title |

## New ideas the data surfaced (for the idea bank)

1. **"I Hate My Job but Don't Know What Else to Do"**: the exact phrase appears in suggestions ("i hate my job but don't know what else to do", "i hate my career but don't know what else to do"). It's the adult twin of video 01, for the Quietly Stuck. It needs a CLICK score before production.
2. **"Before You Become a Nurse, Watch Their Worst Week"**: the formula has demand, and nursing appears in both markets.
3. **"How to Choose a Career in a Post-AI World"**: a US suggestion that is almost a description of OffLadder.
4. **"Career Change at 40 UK"**: a UK-specific variant exists. Worth one line in the description of video 06 if the subject is in the UK.
