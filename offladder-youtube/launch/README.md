# Launch log

*Started 27 September 2026, following [09-launch-plan.md](../09-launch-plan.md).*

The channel is [@offladder](https://www.youtube.com/@offladder). Posting runs through Metricool (brand *OffLadder*, with YouTube, Instagram and TikTok connected). This log records what has been made, what is scheduled, and what still needs a person.

---

## On YouTube: the AI-and-work series, then Cooked or not?

On 28 September the slate changed. The first six launch Shorts weren't strong enough, so the schedule now leads with **The ladder is breaking**, a series built on the anxiety most viewers share about AI and work. Each episode opens on a verbatim quote or a sourced figure, turns it into an approach, and shows OffLadder's adaptive loop as the answer. Scripts, rules and the claims register are in [scripts/ai-series.md](../scripts/ai-series.md).

From episode 6 the Shorts become **Cooked or not?**, built to spread: each one puts a single job or degree on trial with public data, swings a verdict needle with every number, and ends *"Comment your job. We'll look it up."* The strategy, rules, slate and claims are in [scripts/cooked-or-not.md](../scripts/cooked-or-not.md).

| Goes live (UK) | Episode | Title | Metricool |
|---|---|---|---|
| **Mon 28 Sep, 05:46** | 1 · Musk and Altman, the WEF grid | Elon Musk: "Probably none of us will have a job." Here's what to do instead | [live on YouTube](https://www.youtube.com/shorts/c62_PVxUDCo) |
| **Tue 29 Sep, 18:00** | 2 · The departures board | The jobs employers expect to shrink by 2030 (and what to do instead) | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6275145739427529921) |
| **Thu 1 Oct, 18:00** | 3 · 39% of your skills | 39% of your skills will change by 2030. So what should you learn? | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6847026069562738771) |
| **Sat 3 Oct, 18:00** | 4 · The people building AI can't agree | AI CEOs can't agree what happens to jobs. Here's what to do anyway | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=1182546707768233435) |
| **Tue 6 Oct, 18:00** | 5 · The 80% test | Nvidia's CEO: you won't lose your job to AI. You'll lose it to this | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-6355916932022384116) |
| **Thu 8 Oct, 18:00** | 6 · Cooked or not? The 785-job heat map | Microsoft ranked 785 jobs by AI overlap. Is yours top 10? | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=7184454675539837540) |
| **Sat 10 Oct, 18:00** | 7 · Cooked or not? Computer science | Is a computer science degree cooked? (NY Fed data) | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-3496651101519591838) |
| **Mon 12 Oct, 18:00** | Social cut · POV: telling your mum | POV: telling your mum you want to study computer science | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-916658662858406949) |
| **Tue 13 Oct, 18:00** | Social cut · AI tier list | AI tier list: 15 jobs ranked by Microsoft's data. Where's yours? | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-6603483595876775985) |
| **Wed 14 Oct, 18:00** | Social cut · Pick one | Pick one. It shows jobs you'd never have thought of | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=3862560102615172819) |
| From Thu 15 Oct, daily | 8 onwards · Cooked or not? | Customer service, writers, graphic design, then whatever the comments ask for | [slate](../scripts/cooked-or-not.md#cadence-and-slate) |

All posts are public YouTube Shorts in *Education*, **not made for kids**, and not flagged as synthetic content (they're typographic motion design with no realistic generated people or voices). The people quoted appear as text only, with no photos, and nothing implies they endorse OffLadder. Each post's description lists its sources, and its first comment asks the episode's question. The videos are in [motion/videos/](motion/videos/) and the post copy is in [motion/posts.json](motion/posts.json).

**Why 18:00 UK.** Metricool's suggested best times are generic figures in the brand's Singapore time zone. OffLadder's audience is mostly UK and US, so the slot is UK evening and US lunchtime. Keep it consistent, then let [08-analytics.md](../08-analytics.md) decide whether to move it. UK clocks go back on 25 October: keep the UK time.

**To change or cancel anything,** open the post in Metricool (links above) before its time. Every post publishes automatically unless it's edited or deleted there.

### How the Shorts are made

They're motion-designed with the engine in [motion/](motion/): a paused GSAP timeline per episode, rendered frame by frame in Chromium with adaptive motion blur (up to 16 samples on fast moves), and a soundtrack synthesised from the same timeline, so every hit lands on its frame. Audio is normalised to -14 LUFS. Nothing is licensed and nothing is generated by an AI image or voice model.

```sh
cd offladder-youtube/launch/shorts && ./fetch-fonts.sh   # brand fonts (SIL Open Font License)
cd ../motion
pip install numpy scipy imageio-ffmpeg
FONTS_DIR=../shorts/fonts node render.cjs ai01-none-of-us --sheet     # contact sheet, every 0.5 s
FONTS_DIR=../shorts/fonts node render.cjs ai01-none-of-us             # full 1080x1920 MP4 in ./out
```

The renderer warns when any text leaves the Shorts safe area (clear of the right-hand buttons and the caption), and `--strip=a,b` draws a filmstrip for checking a transition. Cooked or not? pieces (`co*`) load the shared components of both series with an `@shared ai co` line.

### The first six (replaced)

The original text-led Shorts (S22, S05, S04, S06, S07, S15) are still in [shorts/](shorts/) for reference. Their slots now carry the AI series.

---

## On Instagram and TikTok: the social batch

From 28 September every short is built once for TikTok, Reels and Shorts to the standard in [10-viral-standard.md](../10-viral-standard.md). The first five go out on Instagram and TikTok at 18:00 UK on alternate days. From 2 October TikTok also gets the AI series, re-cut for its screen, on the days in between, so it has a post every day until 9 October. On Instagram they sit between the posts already in the calendar (those belong to a separate content stream and are untouched), as regular Reels rather than trial reels, so the new account's grid fills with its best work. Captions for every platform are in [motion/social-posts.json](motion/social-posts.json).

| Goes live (UK) | Video | Job it gives the viewer | Instagram | TikTok |
|---|---|---|---|---|
| **Tue 29 Sep, 18:00** | POV: telling your mum what you want to study | Recognise the chat, laugh at the ending, send it to your mum | [Reel](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-3637511346048515290) | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-4645280073303307001) |
| **Thu 1 Oct, 18:00** | AI tier list | Argue with where 15 jobs land, by Microsoft's data | [Reel](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6934987345918445199) | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=3461737090190167689) |
| **Fri 2 Oct, 18:00** | AI series 1 · "Probably none of us will have a job." (TikTok cut) | Musk, then the WEF grid: nobody knows which jobs will last, so test before you bet | – | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-307420315476538636) |
| **Sat 3 Oct, 18:00** | Pick one | Pick one; each pick shows two directions you'd never have thought of | [Reel](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6825747789232098301) | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-7626377329309956475) |
| **Sun 4 Oct, 18:00** | AI series 2 · The departures board (TikTok cut) | Check if your job is on the shrinking list, then meet work that has no name yet | – | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=3476066403812461864) |
| **Mon 5 Oct, 18:00** | Guess #1 | Guess the top job of 785, then comment yours | [Reel](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-195366417915820977) | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-8138143163272183355) |
| **Tue 6 Oct, 18:00** | AI series 3 · 39% of your skills (TikTok cut) | Try an hour of the real work before paying for a course | – | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-8020581443332324037) |
| **Wed 7 Oct, 18:00** | Are writers cooked? | Watch the needle, then comment your job for its rank out of 785 | [Reel](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-6561201692308781502) | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6047845993072249081) |
| **Thu 8 Oct, 18:00** | AI series 4 · The people building AI can't agree (TikTok cut) | Audit one week and see which tasks are getting cheap | – | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-1781004212144094931) |
| **Fri 9 Oct, 18:00** | AI series 5 · The 80% test (TikTok cut) | Give AI your most repetitive task and list what you had to fix | – | [TikTok](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=979116686603929764) |

The chat, the tier list and *Pick one* also go to YouTube Shorts on 12 to 14 October (table above). *Guess #1* and the writers episode stay off YouTube for now: episode 6 covers the same ranking, and writers is on the YouTube slate from 15 October.

**Changed on 30 September.** The 7 October slot was going to carry a second computer-science cut. Computer science had already gone out twice (a Reel posted directly on 28 September, and the POV chat's key figure) and YouTube episode 7 covers it on 10 October, so the slot now tests a new job: *Are writers cooked?* ([claims K12–K15](../scripts/cooked-or-not.md#claims-register)). The same Metricool posts were updated, so the links above still work.

**On TikTok** each post is marked *Your brand* in the content disclosure setting, because it ends on offladder.com. TikTok requires disclosure for content that promotes a brand, product or service, and undisclosed commercial content "may not be eligible for distribution in the For You feed" ([TikTok Business Help Center](https://ads.tiktok.com/help/article/about-the-commercial-content-disclosure-setting-for-advertisers)). The label TikTok shows is *Promotional content*. Business accounts can only use TikTok's Commercial Music Library, so keep the original score: it's ours and cleared everywhere.

What these need from a person, in the Instagram and TikTok apps:

- [ ] **Pin** each post's first comment once it's live. Metricool posts it; pinning is manual. On TikTok, check it appeared, and post it yourself if it didn't.
- [ ] **Seed the accounts this week** with the [seed kit](seed-kit.md): the team follows, watches, answers and shares, with ready-to-send messages and copy for offladder.com and the app. No bought followers.
- [ ] **Ask two or three creators to co-author Reels** with the [collab kit](collab-kit.md). Their handles go on the scheduled Reels as collaborators (the kit shows how).
- [ ] **Answer comments for the first two hours** after each post goes live. For "my job is…" or "my degree is…", paste the reply [lookup/lookup.py](lookup/) prints. Early replies keep the thread going, and comments are one of the interactions both apps rank on.

## Reviews

Two reviews are booked, at 09:00 UK on **Mon 5 October** (day 7) and **Mon 12 October** (day 14). Each one reads Metricool's data, records the results here and ends with a plan for the next week. On 30 September the accounts had 0 followers on Instagram and TikTok and one YouTube subscriber, so the first job is to get posts seen ([seed kit](seed-kit.md), [collab kit](collab-kit.md)).

For every post, on each platform: reach or views, average watch time, shares, saves, comments and follows. Then:

- **Part two:** a post 50% or more above its platform's median gets a follow-up within 48 hours, on the next most similar job or topic.
- **Drop:** a format that comes last at both reviews stops.
- **Audience (your call):** Instagram carries two streams for two audiences, students and recent graduates, and people changing career in their late 20s and 30s. A new account's first engagers teach the app who it's for, so on 5 October we compare the two and you choose one for October.
- **Seed and collab:** followers against the target of 100 real followers each on Instagram and TikTok by 12 October, and collab Reels' reach against the account's average.

---

---

## Made, but needs a person in YouTube Studio

Metricool publishes posts; it can't change channel settings. These take about 15 minutes in **YouTube Studio**:

- [ ] **Banner:** upload [channel-art/banner-2560x1440.png](channel-art/banner-2560x1440.png) under *Customisation → Branding*. Everything that must survive on a phone sits inside YouTube's 1546×423 safe area (checked automatically when rendering).
- [ ] **Profile picture:** upload [channel-art/profile-800x800.png](channel-art/profile-800x800.png). It's the logo mark from offladder.com, on the site's paper colour.
- [ ] **Links:** add `https://offladder.com/start?utm_source=youtube&utm_medium=channel&utm_campaign=channel&utm_content=profile` as the first channel link. Links in Shorts aren't clickable, so this is where Shorts viewers can click through.
- [ ] **About text:** paste the About copy from [09-launch-plan.md](../09-launch-plan.md#channel-copy).
- [ ] **Comments:** turn on *hold potentially inappropriate comments for review*, and add the blocked-words list ([07-production-workflow.md](../07-production-workflow.md#5-safety-consent-and-safeguarding)).
- [ ] **Pin** each Short's first comment once it's live (Metricool posts it, but pinning is manual).
- [ ] **Answer the comments on Cooked or not?** For the first two hours after each episode goes live, reply to every "my job is…" comment with the reply [lookup/lookup.py](lookup/) prints, and log the request in [lookup/requests.md](lookup/requests.md). About 20 minutes a day; it's the series' growth loop.
- [ ] **Reply** to hobby comments on the Hobby → Verb Shorts. The strongest ones feed video 17 (*Your Hobby Is a Verb*).
- [ ] **Related video:** once the first long-form videos exist, set each Short's related video (Shorts slate, last column).

---

## Blocked on people: the long-form launch

The long-form series need a real host, and for experiments, practitioners. Nothing in this repo fakes that. To launch long-form on the plan's terms (two videos together, then weekly):

1. **This week:** the host takes OffLadder's three questions on camera. The result decides whether script 02 (live events) is the right pilot.
2. **Within two weeks:** shoot videos 01 and 03 (one Honest Answers day) and 02 (one experiment day). Book the practitioner for 02 now.
3. **Launch long-form the week of 12 October,** as the six Shorts above finish. Link each Short's related video to 01 or 02 at that point.
4. **Start Change One Thing casting now:** the six-week test, the epilogue and the edit add up to about three months from casting to publishing.

The research sprint's title changes are already applied to the slate: [research/autocomplete-findings.md](research/autocomplete-findings.md).

---

## Making more Shorts

New **Cooked or not?** episodes follow [scripts/cooked-or-not.md](../scripts/cooked-or-not.md): verify every number at its primary source, add it to the claims register, then build the piece in [motion/pieces/](motion/pieces/) from the shared heat map, gauge and icons in `co-shared.js`. Check the contact sheet and the safe-area warnings, render, add the post to [motion/posts.json](motion/posts.json), and schedule it in Metricool with its sources in the description and the lookup offer as the first comment.
