# 08 · Analytics and iteration

> Every video is a test. The system only improves if each result changes what we do next.

---

## 1. The scoreboard

Six questions, asked in order for every long-form video. Each has one main metric in YouTube Studio's analytics. Diagnose in this order, because a fault early in the chain distorts every number after it.

| # | Question | Main metric | Supporting metrics |
|---|---|---|---|
| 1 | **Did they click?** | Impressions click-through rate, **by traffic source** | Impressions; Test & Compare result |
| 2 | **Did the opening keep the promise?** | Share still watching at 0:30 (the "Intro" key moment) | Retention curve for the first minute |
| 3 | **Did the story hold?** | Average percentage viewed | Average view duration; top moments, spikes and dips |
| 4 | **Were they satisfied?** | Subscribers gained per 1,000 views | Likes and comments per 1,000 views; shares; returning viewers |
| 5 | **Did they want more?** | End-screen element click rate | Views of the next video coming from this one |
| 6 | **Did they act?** | UTM sessions → three-question starts on offladder.com | Account creations from YouTube-tagged sessions (site analytics) |

**Shorts are measured differently.** Since 31 March 2025, YouTube counts a Shorts view every time a Short starts or replays, and keeps the older measure as **engaged views** ([YouTube announcement](https://support.google.com/youtube/thread/333869549/a-change-to-how-we-count-views-on-shorts)). For Shorts, judge:
- **Viewed vs swiped away:** did the first frame work?
- **Average percentage viewed:** did the loop work?
- **Engaged views,** rather than views, when comparing Shorts over time.
- **Comments per 1,000 engaged views:** did the prompt work?
- **Related-video clicks and subscribers gained:** did the Short feed the long-form library?

---

## 2. Benchmarks: use your own

Internet "good CTR" figures mix channels, niches and traffic sources that have nothing to do with ours. We benchmark against ourselves:

- Keep a **rolling median of the last 10 long-form videos** for every metric in §1, and a separate one per series once a series has five episodes.
- Label each new video **above** or **below** median on each metric. The pattern of labels is the diagnosis.
- **The one external reference worth knowing:** YouTube says half of all channels and videos have an impressions CTR between 2% and 10%. New videos and small channels vary more, and CTR naturally falls when impressions come from the Home page ([YouTube Help](https://support.google.com/youtube/answer/7628154)).
- **Compare like with like.** CTR from Search and CTR from Browse aren't comparable, and neither are the retention curves of a 20-minute documentary and an 8-minute answer.

---

## 3. The diagnosis matrix

Place every video after 7 days:

|  | **Retention above median** | **Retention below median** |
|---|---|---|
| **CTR above median** | ✅ **Double down.** Make a sequel or follow-up, and reuse the packaging archetype and story structure. | ⚠️ **Promise problem.** The packaging over-promised, or the opening was slow. Check the first 30 seconds against the thumbnail; check the title is true of the footage. |
| **CTR below median** | 🎯 **Packaging problem.** The video is good but invisible. Change the thumbnail first (a different archetype, not a tweak), then the title. | 🧪 **Idea problem.** Don't rescue it. Write down what we believed, what happened, and never make that idea shape again. |

---

## 4. Reading traffic sources

| If most views come from… | It means | Do this |
|---|---|---|
| **Search** | The title matches how people phrase the question | Make more Honest Answers on neighbouring questions (use autocomplete); keep the title stable |
| **Browse (Home)** | The packaging works on cold audiences | Record the archetype and hook in the Packaging Log; use them again |
| **Suggested videos** | YouTube sees us as a good next video after certain others | Look at *which* videos we're suggested next to (in Studio's traffic source detail) and make content that belongs beside them |
| **Channel pages and subscriptions** | The audience is loyal, but the video isn't reaching beyond it | Revisit the packaging for cold viewers; check CTR from Browse specifically |
| **The Shorts feed** (for long-form, via related-video links) | Shorts are feeding the library | Make more Shorts that point at this video |

---

## 5. Review cadence

| When | Who | What |
|---|---|---|
| **First 2 hours** | Host and Research lead | Sanity check: links, captions, pinned comment, end screen. Reply to early comments. |
| **48 hours** | Research lead | CTR by traffic source against the median, and 0:30 retention. Decide whether to change the thumbnail (§6). |
| **7 days** | Research lead + Editor | The retention curve in detail: dips, spikes, top moments. Place the video in the diagnosis matrix. Check the Shorts cut from it. |
| **28 days** | Whole team, 30 minutes | Post-mortem ([templates/post-mortem.md](templates/post-mortem.md)). Update the Packaging Log and the idea bank. |
| **Monthly** | Whole team, 60 minutes | Series review: does each series earn its slot? Look at the funnel numbers by series. |
| **Quarterly** | Whole team plus OffLadder leadership | Strategy review: the slate for next quarter, the cadence, and the "house rules" that replace guidance in this playbook where our data disagrees with it. |

---

## 6. Decision rules

Written in advance, so we don't make emotional decisions about videos we worked hard on.

| Situation | Rule |
|---|---|
| **The thumbnail isn't working** | After 48–72 hours, if Browse CTR is well below median with meaningful impressions, swap to a different thumbnail archetype. Leave the title alone if Search is a significant source. |
| **The opening is leaking** | If the 0:30 intro retention is well below median, re-watch the first 30 seconds against the thumbnail. Trim a slow start in the Studio editor. Carry the lesson into the next script. |
| **A spike appears** | Cut it into a Short within the week, and note what made that moment work in the post-mortem. |
| **A video is clearly above median on CTR and retention** | Commission a sequel, or a same-structure episode, into the next packaging meeting. |
| **A series is below median on both CTR and retention for four consecutive episodes** | Retool it: new hook archetype, new structure, or a new host angle. If the next two episodes are also below median, retire the series and give its slot to the best performer. |
| **A series drives views but few three-question starts** | Keep it for reach, but strengthen its Your Version → product bridge, and don't judge it on conversion alone. |

---

## 7. Measuring the funnel

- **UTM parameters on every link** ([05-ctas.md](05-ctas.md#9-tracking-links)) let offladder.com's analytics report sessions and three-question starts by series and by video.
- **Report monthly:** YouTube-tagged sessions → three-question starts → completions → accounts, split by series.
- **Watch for the halo.** Many viewers will type the URL instead of clicking. Track direct and branded-search traffic to offladder.com alongside upload dates, and treat changes as a signal, not proof.
- **Optional, low-friction attribution:** an optional "Where did you hear about us?" question *after* account creation, never inside the three-question start. It must not add friction to the free first read.

---

## 8. The learning loop

Three living documents turn results into rules:

1. **The Packaging Log** ([templates/packaging-log.md](templates/packaging-log.md)): every title and thumbnail variant, every test result, and one lesson per test.
2. **The Hook Log:** a line in each post-mortem recording the hook archetype used and the 0:30 retention it achieved. After about ten videos, rank the archetypes by series.
3. **House rules:** at each quarterly review, rewrite any part of this playbook our own data contradicts. This playbook is a starting position, not scripture.

---

## 9. Channel experiment backlog

Tests to run *across* videos, one variable at a time, alongside Test & Compare:

| # | Question | How to test |
|---|---|---|
| 1 | Does revealing the verdict in the thumbnail beat hiding it? | Test & Compare on two 90 Minutes As… episodes: **OFF THE TABLE** stamp against a covered stamp |
| 2 | Face or artefact for The Job Nobody Told You About? | Test & Compare: archetype A against archetype C |
| 3 | Do chapters help or hurt experiment episodes? | Alternate episodes with and without chapters; compare average percentage viewed and the shape of the curve near the verdict |
| 4 | Where should Your Version sit? | Two Honest Answers: at the end against straight after the method |
| 5 | Host to camera or voiceover-led openings? | Compare 0:30 retention across the first eight episodes |
| 6 | Short Shorts or longer Shorts? | Paired Delete One Part Shorts at about 25 s and about 45 s; compare viewed vs swiped away and average percentage viewed |
| 7 | Does a spoken URL in Shorts cost retention? | Pairs of comparable Shorts with and without the spoken line |
