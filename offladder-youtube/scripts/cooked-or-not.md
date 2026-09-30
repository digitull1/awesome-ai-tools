# Cooked or not? The viral strategy for Shorts 6 onwards

*Added 28 September 2026. Episodes 1 to 5 of [The ladder is breaking](ai-series.md) stay as scheduled. From episode 6, the Shorts become a verdict series.*

## The shift in one line

Episodes 1 to 5 tell people what the experts say about AI and work. From episode 6, every Short answers the question people actually type: **is *my* job, or *my* degree, cooked?** Each gets a verdict built from public data, a needle that moves with every piece of evidence, and one thing to do this week. The episode then hands the comments a job: **"Comment your job. We'll look it up."**

## Why this format can trend when 1 to 5 won't on their own

Episodes 1 to 5 are credible and well made, but they're about *the future of work*: general anxiety that people nod at and scroll past. Shorts that spread in this niche do three things the first five don't.

1. **They name the viewer.** A job or degree in the title and on the first frame makes everyone who has it (or is choosing it) stop, and send it to the people they know who have it. Identity is one of the strongest reasons people share: *"send this to your CS friend."*
2. **They withhold a verdict.** The needle swings with every number, towards COOKED and back again, and the verdict lands at about 16 seconds. People stay to see where it stops. That's retention you don't have to beg for.
3. **They give the comments a job.** "Comment your job. We'll look it up." works because we can answer everyone: we hold the numbers for 785 jobs and 73 majors ([the lookup tool](../launch/lookup/lookup.py)). Every reply is a second comment, brings the commenter back, and tells us which episode to make next.

It also speaks the audience's language. People don't search "occupational exposure to generative AI"; they type *"is computer science cooked"*, *"will AI replace writers"*, *"is a psychology degree worth it"*. The titles use their words.

And it can run **daily**. Each episode is new data in a fixed format, not a new idea, so a verified episode takes hours to build, not days. A recognisable format posted every day is how a new channel collects enough at-bats for one to break out.

## What stays true

Nothing here loosens the rules in [ai-series.md](ai-series.md#rules-for-this-series) or [01-strategy.md](../01-strategy.md). "Cooked" names the fear in the audience's own word; the video's job is to answer it honestly.

1. **We never stamp a job COOKED.** The needle can visit COOKED while the evidence is bad, but the verdict is always *NOT COOKED* or *HEATING UP*, plus a line saying what is actually changing. Overlap scores, projections and unemployment rates can't show that a job is finished, and a prediction isn't a fact.
2. **The gauge says whose it is.** It's labelled *Our read of the data*, on screen, every time.
3. **Every number carries its source and date on screen,** and a link in the description. Microsoft's scores are *overlap*, never *risk* or *replacement*. BLS figures are *projected*. NY Fed rates are *recent grads (22 to 27)* with the data year.
4. **Always show the counter-evidence.** Every episode has a BUT. If the data is one-sided, it isn't an episode.
5. **Comments:** reply about the job or degree, never about the person. Never show a username in a video. Say "you asked" only when people did, and "most requested" only when it's true.
6. **Assume a 13-year-old is watching.** Every "move" is safe, free and doable in an evening. No salary figures in titles or thumbnails.

## The format (30 seconds, 120 bpm, a cut on every bar)

| Beat | Time | What happens | Why it's there |
|---|---|---|---|
| **Hook** | 0–2 s | *Is a [degree] cooked?* in the biggest type, over the gauge (or the heat map). The first frame is the thumbnail | The viewer's identity plus the question they already type |
| **Evidence against** | 2–10 s | The scariest true number, sourced on screen. The needle swings towards COOKED, then creeps further with each comparison | Tension, and honesty about the bad news |
| **BUT.** | ~10 s | A hard cut, one word | Re-hooks the mid-video dip |
| **Evidence for** | 10–15 s | The counter-evidence. The needle swings back | The twist: hot isn't cooked |
| **Verdict** | 15–18 s | A stamp and one line | The screenshot moment |
| **The move** | 18–21 s | What to do this week, as a checklist | Agency, not doom |
| **OffLadder** | 21–24 s | Directions next to that job, from offladder.com/directions; 3 questions; it adapts to what you try | The product as the obvious next step |
| **End** | 24–30 s | *Comment your job. We'll look it up.* offladder.com. Ladder wipe back to the first frame | Comments, and a loop that replays |

**Episode types:**
- **Job checks:** Microsoft's rank for the job, the BLS projection, and a verbatim quote where one exists.
- **Degree checks:** NY Fed unemployment and underemployment for the major, and the BLS projection for the job it leads to.
- **Lists:** a ranked top 10 from one source. Lists get saved and argued with, and each one seeds ten checks.
- **Reply episodes:** only once real comments ask. *"You asked: nurses."*

## The signature devices

Recognition is what turns one viral Short into a channel. Every episode reuses:

- **The chip:** COOKED OR NOT?, top left, next to the wordmark.
- **The heat map:** all 785 jobs, one tile each, ranked and coloured by AI overlap. Hot means most overlap.
- **The gauge:** FINE · HEATING UP · COOKED, labelled *Our read of the data*.
- **The line:** *Hot isn't cooked.*
- **The end card:** *Don't pick your future. Test it.* offladder.com. *Comment your job. We'll look it up.*

All of it is built in [launch/motion/pieces/co-shared.js](../launch/motion/pieces/co-shared.js), so a new episode is mostly data.

## The comment engine

This is the growth loop, and it needs a person for about 20 minutes a day.

1. **Reply to every comment in the first two hours** after an episode goes live, while its first viewers are still around. Paste the reply the lookup tool prints:
   ```sh
   python3 launch/lookup/lookup.py job "graphic designer"
   python3 launch/lookup/lookup.py major "psychology"
   ```
   Every reply carries the source and the caveat, and ends at offladder.com.
2. **Pin the first comment** in YouTube Studio (Metricool posts it; pinning is manual).
3. **Tally the requests** in [launch/lookup/requests.md](../launch/lookup/requests.md). The most requested job becomes the next job check, and only then does the video say "you asked".

## Packaging

- **Titles** put the job or degree first and stay under about 60 characters: *Is a computer science degree cooked? (NY Fed data)*. For lists: *Microsoft ranked 785 jobs by AI overlap. Is yours top 10?*
- **First frame:** the title's words in the biggest type, with the gauge or the map, legible at thumbnail size.
- **Description:** the numbers in plain words, the verdict and its caveat, the comment offer, offladder.com, then every source with a link. Three hashtags.
- **First comment:** the lookup offer.

## Cadence and slate

- **Now:** episodes 6 and 7 take the Thu 8 and Sat 10 October slots (18:00 UK).
- **From Monday 12 October:** daily at 18:00 UK for three weeks, then let [08-analytics.md](../08-analytics.md) decide.
- **After 48 hours,** read each episode in YouTube Studio: *viewed vs swiped away*, average percentage viewed, comments per 1,000 views, shares. Make a part two of the best of the week within 48 hours: the next most similar job. If five job checks in a row sit below the channel's median *viewed vs swiped away*, change the first frame before you change the format.
- **Cross-post** the same files as Reels and TikToks once the format proves itself. The captions stay the same; only the hashtags change.

| # | Episode | The tension | Data (verified unless marked) |
|---|---|---|---|
| 6 | **Microsoft ranked 785 jobs by AI overlap. Is yours top 10?** | A countdown to #1, then: software developers are only #120, and the researchers say reading it as job loss "would be a mistake" | K1–K6 |
| 7 | **Is a computer science degree cooked? (NY Fed data)** | 4th-highest unemployment of 73 majors, higher than art history, *but* only 19% underemployed, and jobs projected +10% | K7–K10 |
| 8 | Are customer service jobs cooked? | #7 of 785 and 2.9 million US workers; BLS projects −5% by 2035, yet about 289,500 openings a year. The one honest *HEATING UP* | Microsoft K1; BLS (Aug 2026): "projected to decline 5 percent from 2025 to 2035", "about 289,500 openings … each year". Altman's customer-support line (C3) only after checking the video |
| 9 | **Are writers cooked?** (made: the 7 October social cut, below) | Six writing jobs in the top 20 of 785, but BLS projects "little or no change" for writers to 2035 and 11,900 openings a year | K4, K6, K12–K15 |
| 10 | Is graphic design cooked? | #196 of 785 (less overlap than people think), BLS −2% to 2035, grads 5.7% unemployed | Microsoft K1; BLS (Aug 2026); NY Fed (2024 data) |
| 11 | Is journalism cooked? | Reporters are #11 of 785 for AI overlap, yet journalism grads have one of the *lowest* unemployment rates (2.3%) | Microsoft K1; NY Fed (2024 data); BLS projection *to verify* |
| 12 | Is nursing cooked? | #460 of 785 and 2.1% grad unemployment: low overlap isn't the same as safe, so what *is* changing? | Microsoft K1; NY Fed (2024 data); BLS *to verify* |
| 13 | Are teachers cooked? | Elementary teachers #267; elementary education grads 1.2% unemployed | Microsoft K1; NY Fed (2024 data); BLS *to verify* |
| 14 | Is a psychology degree cooked? | 5.0% unemployed, 48% in jobs that don't need the degree | NY Fed (2024 data); BLS *to verify* |
| 15 | The 10 majors with the highest unemployment (list) | Anthropology, computer engineering and fine arts top it | NY Fed (2024 data) |

After episode 8, the tally decides the order.

## Claims register

K1–K11 checked 28 September 2026; K12–K15 checked 30 September 2026.

| # | On screen | Exact figure or wording | Source |
|---|---|---|---|
| K1 | Microsoft ranked 785 jobs; 200,000 real AI chats | 785 occupations (SOC codes) scored by "AI applicability"; "a dataset of 200k anonymized conversations with Microsoft Bing Copilot" | Tomlinson, Jaffe, Wang, Counts and Suri, [*Working with AI: Measuring the Applicability of Generative AI to Occupations*](https://arxiv.org/abs/2507.07935), Microsoft Research, v6, 22 Dec 2025; [results files v1.1](https://github.com/microsoft/working-with-ai) (CC BY 4.0) |
| K2 | The top 10 and their worker counts | 1 Interpreters and translators (51,560); 2 Historians (3,040); 3 Writers and authors (49,450); 4 Sales representatives of services (1,142,020); 5 CNC tool programmers (28,030); 6 Broadcast announcers and radio DJs (25,070); 7 Customer service representatives (2,858,710); 8 Telemarketers (81,580); 9 Political scientists (5,580); 10 Mathematicians (2,220) | K1, Table S3 (worker counts are BLS OEWS 2023, as reported in the paper). Earlier versions of the paper ranked passenger attendants third; this is the current data |
| K3 | Software developers: #120 | Score 0.278, rank 120 of 785 | K1 data, `ai_applicability_scores.csv` |
| K4 | "This would be a mistake." | "It is tempting to conclude that occupations that have high AI action applicability score will be automated and thus experience job or wage loss, and that occupations with high user goal applicability score will be augmented and raise wages. This would be a mistake, as downstream consequences of new technologies are very hard to predict and often counterintuitive" (quoted to the comma) | K1, p. 7 |
| K5 | Translators +2% (average +3%) | "Employment of interpreters and translators is projected to grow 2 percent from 2025 to 2035, slower than the average for all occupations." Total, all occupations: 3% | [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/media-and-communication/interpreters-and-translators.htm), last modified 27 Aug 2026 |
| K6 | "Tasks change before titles do." | offladder.com's AI guide | Our own copy |
| K7 | CS: 7.0%, 4th highest of 73; all recent grads 4.2% | Computer science unemployment 6.992%, computer engineering 7.783%; overall 4.211%. Recent graduates are ages 22 to 27 | [NY Fed, *The Labor Market for Recent College Graduates*](https://www.newyorkfed.org/research/college-labor-market), outcomes by major, published 4 Feb 2026 from 2024 American Community Survey data |
| K8 | Higher than art history, English, philosophy | Art history 6.688%, English language 6.14%, philosophy 5.123% | K7 |
| K9 | 19% vs 39% | Underemployment (working in a job that typically doesn't need a degree): computer science 19.127%, all recent grads 39.35% | K7 |
| K10 | Software developer jobs +10% (average +3%) | Software developers: 10%; "Overall employment of software developers, quality assurance analysts, and testers is projected to grow 10 percent from 2025 to 2035, much faster than the average for all occupations." Total, all occupations: 3% | [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm), last modified 27 Aug 2026 |
| K11 | Directions next to CS | Model evaluation writer, AI workflow designer, agentic systems operator | [offladder.com/directions](https://offladder.com/directions) (C12) |
| K12 | Six writing jobs, all in the top 20 | #3 Writers and authors (score 0.454); #11 News analysts, reporters, and journalists (0.383); #13 Technical writers (0.373); #15 Proofreaders and copy markers (0.369); #16 Editors (0.368); #18 Public relations specialists (0.365). On screen: REPORTERS, PR SPECIALISTS | K1 data, `ai_applicability_scores.csv`, ranked by score (checked 30 Sep 2026) |
| K13 | Technical writers +1%, writers little or no change, editors −1%, reporters −6% (average +3%) | "Employment of technical writers is projected to grow 1 percent from 2025 to 2035, slower than the average for all occupations." "Employment of writers and authors is projected to show little or no change from 2025 to 2035." "Employment of editors is projected to decline 1 percent from 2025 to 2035." "Employment of news analysts, reporters, and journalists is projected to decline 6 percent from 2025 to 2035." Total, all occupations: 3% | BLS Occupational Outlook Handbook: [technical writers](https://www.bls.gov/ooh/media-and-communication/technical-writers.htm), [writers and authors](https://www.bls.gov/ooh/media-and-communication/writers-and-authors.htm), [editors](https://www.bls.gov/ooh/media-and-communication/editors.htm), [reporters](https://www.bls.gov/ooh/media-and-communication/reporters-correspondents-and-broadcast-news-analysts.htm), all last modified 27 Aug 2026 |
| K14 | 11,900 openings a year; "People retire, move and switch. The seats refill." | "About 11,900 openings for writers and authors are projected each year, on average, over the decade." "Most of those openings are expected to result from the need to replace workers who transfer to different occupations or exit the labor force, such as to retire." The on-screen line is our paraphrase of the second sentence | [BLS, writers and authors](https://www.bls.gov/ooh/media-and-communication/writers-and-authors.htm), last modified 27 Aug 2026 |
| K15 | Directions next to writing | Model evaluation writer, provenance and authenticity analyst, AI tutor designer | [offladder.com/directions](https://offladder.com/directions) (C12; all three checked on the page 30 Sep 2026) |

---

## Episode 6 · Microsoft ranked 785 jobs by AI overlap

**File:** [launch/motion/pieces/co01-785-jobs.js](../launch/motion/pieces/co01-785-jobs.js) · **Title:** Microsoft ranked 785 jobs by AI overlap. Is yours top 10? · **First comment:** Comment your job title and we'll reply with where it ranks out of 785, and what that does and doesn't mean.

| Time | On screen |
|---|---|
| 0.0 | 200,000 REAL AI CHATS · 2025. **MICROSOFT RANKED 785 JOBS** *by how much their work overlaps with AI.* **IS YOURS TOP 10?** Under it, the heat map: one tile per job, hottest first (K1) |
| 2.0 | The countdown, #10 to #1, a line icon and the US worker count for each, its tile ringed on the map (K2). #1 lands on the drop: the map flares and heat bursts from the top tile |
| 14.0 | **SOFTWARE DEVELOPERS?** The slot rolls to **#120**. *Not even top 100*: the top 100 is outlined on the map, with #120 just outside it (K3) |
| 16.0 | **SO ARE THESE JOBS COOKED?** The map heats up |
| 17.0 | THE RESEARCHERS WHO MADE THE LIST, ON READING IT AS JOB LOSS: *"This would be a mistake."* The map cools (K4) |
| 18.6 | THE #1 JOB, TRANSLATORS: **+2%** *projected US job growth, 2025 to 2035 (the average job: +3%)* (K5) |
| 20.0 | **HOT ISN'T COOKED.** *Tasks change before titles do.* (K6) |
| 22.0 | Ladder wipe to paper. HOW OFFLADDER HELPS: **3 QUESTIONS.** *Directions you'd never have thought of. Then it adapts to what you try.* |
| 24.0 | End card. *Comment your job. We'll look it up.* |

## Episode 7 · Is a computer science degree cooked?

**File:** [launch/motion/pieces/co02-cs-degree.js](../launch/motion/pieces/co02-cs-degree.js) · **Title:** Is a computer science degree cooked? (NY Fed data) · **First comment:** Comment your degree and we'll reply with its numbers from the NY Fed.

| Time | On screen |
|---|---|
| 0.0 | NEW YORK FED DATA · RECENT GRADS. **IS A COMPUTER SCIENCE DEGREE COOKED?** over the gauge, its needle trembling at HEATING UP. It flinches towards COOKED |
| 2.0 | The gauge shrinks to the bottom. 73 bars, one per major, sorted by recent-grad unemployment. **7.0%**, COMPUTER SCIENCE, *4th highest of 73 majors*; dashed line: all recent grads 4.2% (K7). The needle swings to COOKED |
| 6.0 | **CS IS HIGHER THAN:** art history 6.7%, English 6.1%, philosophy 5.1%, each bar lighting up as it's named; the needle creeps further (K8) |
| 10.0 | Glitch. **BUT.** |
| 10.6 | WORKING IN A JOB THAT DOESN'T NEED A DEGREE: CS grads **19%**, all recent grads **39%**. *CS grads who work mostly land jobs that need the degree.* The needle swings back (K9) |
| 13.0 | SOFTWARE DEVELOPER JOBS: **+10%** *projected US growth, 2025 to 2035 (the average job: +3%)* (K10). Back again |
| 15.6 | The gauge returns, full size. The needle settles in HEATING UP. Stamp: **NOT COOKED.** *But it's harder to get into.* |
| 18.0 | Ladder wipe to paper. IF YOU'RE STUDYING IT: **DON'T JUST COLLECT THE DEGREE. BUILD PROOF:** ship one real project a month; get good at checking AI's code; test a direction next to yours |
| 21.4 | DIRECTIONS NEXT TO CS, from offladder.com/directions: model evaluation writer, AI workflow designer, agentic systems operator (K11). *OffLadder finds yours in 3 questions, then adapts to what you try.* |
| 24.0 | End card. *Comment your degree. We'll look it up.* |

## Episode 9 · Are writers cooked? (social cut)

**File:** [launch/motion/pieces/sx06-writers.js](../launch/motion/pieces/sx06-writers.js), built to [10-viral-standard.md](../10-viral-standard.md) in the social safe box · **Posted:** Instagram and TikTok, Wed 7 October, 18:00 UK, in the slot that had a second CS cut · **First comment:** Comment your job and we'll reply with its rank out of 785, and what that does and doesn't mean.

| Time | On screen |
|---|---|
| 0.0 | MICROSOFT AI DATA · BLS PROJECTIONS. **ARE WRITERS COOKED?** over the gauge, the needle flinching towards COOKED |
| 2.0 | MICROSOFT RANKED 785 JOBS BY AI OVERLAP. **SIX WRITING JOBS. ALL IN THE TOP 20.** #3 writers and authors, #11 reporters, #13 technical writers, #15 proofreaders, #16 editors, #18 PR specialists; a 785-long strip with all six ticks at its start (K12) |
| 6.5 | THE RESEARCHERS WHO MADE THE LIST, ON READING IT AS JOB LOSS: *"This would be a mistake."* (K4) |
| 8.6 | PROJECTED US JOBS, 2025 TO 2035: technical writers **+1%**, writers and authors *little or no change*, editors **−1%**, reporters **−6%**; a dashed line at *Average job: +3%* (K13) |
| 12.0 | Glitch. **BUT.** |
| 12.6 | PROJECTED EVERY YEAR TO 2035: **11,900** *openings for writers and authors. People retire, move and switch. The seats refill.* (K14) |
| 15.5 | The gauge returns. Stamp: **HEATING UP.** *Tasks change before titles do.* (K6) |
| 18.0 | Ladder wipe to paper. IF YOU WRITE FOR A LIVING: **THE FIRST DRAFT GOT CHEAP. SO:** own a subject, not just the words; get good at editing AI drafts; test a direction next to yours |
| 21.4 | DIRECTIONS NEXT TO WRITING, from offladder.com/directions: model evaluation writer, provenance and authenticity analyst, AI tutor designer (K15). *OffLadder finds yours in 3 questions, then adapts to what you try.* |
| 24.0 | End card. **COMMENT YOUR JOB.** *We'll reply with its rank out of 785.* Note: *Overlap with AI, not job loss. Data: Microsoft, BLS.* |
