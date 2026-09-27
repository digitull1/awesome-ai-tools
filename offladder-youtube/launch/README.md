# Launch log

*Started 27 September 2026, following [09-launch-plan.md](../09-launch-plan.md).*

The channel is [@offladder](https://www.youtube.com/@offladder). Posting runs through Metricool (brand *OffLadder*, YouTube and Instagram connected). This log records what has been made, what is scheduled, and what still needs a person.

---

## Scheduled on YouTube

Six Shorts from the plan's Shorts slate, queued in Metricool as **public YouTube Shorts**. Each is set to category *Education*, **not made for kids**, and not flagged as synthetic content (they're typographic animations, with nothing realistic generated). Each has a first comment that asks the Short's question.

| Goes live (UK) | New York | Singapore | Short | Title | Metricool |
|---|---|---|---|---|---|
| **Tue 29 Sep, 18:00** | 13:00 | Wed 30 Sep, 01:00 | S22 · 10 jobs, 10 seconds | Name 10 jobs in 10 seconds | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=3524237111787144982) |
| **Thu 1 Oct, 18:00** | 13:00 | Fri 2 Oct, 01:00 | S05 · Hobby → Verb | 3 jobs for people who argue about football tactics | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=6847026069562738771) |
| **Sat 3 Oct, 18:00** | 13:00 | Sun 4 Oct, 01:00 | S04 · The delete question | The best question to ask anyone about their job | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=1182546707768233435) |
| **Tue 6 Oct, 18:00** | 13:00 | Wed 7 Oct, 01:00 | S06 · Hobby → Verb | 3 jobs for people who love editing videos | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-6355916932022384116) |
| **Thu 8 Oct, 18:00** | 13:00 | Fri 9 Oct, 01:00 | S07 · Hobby → Verb | 3 jobs for the friend everyone calls when there's drama | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=7184454675539837540) |
| **Sat 10 Oct, 18:00** | 13:00 | Sun 11 Oct, 01:00 | S15 · Real or made up? | Real job or made up? Guess before the reveal | [open](https://app.metricool.com/planner/calendar?blogId=7116319&openWithPostUuid=-3496651101519591838) |

**Why 18:00 UK.** Metricool's suggested best times are generic figures in the brand's Singapore time zone (weekday peaks around 16:00 there, which is 9 am in the UK and 4 am in New York). OffLadder's audience is mostly UK and US, so the slot is UK evening and US lunchtime. Keep it consistent, then let [08-analytics.md](../08-analytics.md) decide whether to move it. UK clocks go back on 25 October: keep the UK time and update the other columns.

**To change or cancel anything,** open the post in Metricool (links above) before its time. Every post publishes automatically unless it's edited or deleted there.

The files are in [shorts/videos/](shorts/videos/). Titles, descriptions, tags and first comments are in [shorts/posts.json](shorts/posts.json).

### How these Shorts differ from the plan

The plan's Shorts assume a host on camera. Until host shoots begin, these six are **text-led adaptations** of scripts S22, S05, S06, S07, S04 and S15 ([scripts/shorts.md](../scripts/shorts.md)). They keep the hook, loop and comment prompt, and use no human presenter, no synthetic voice and no invented people.

- **S15 changed on purpose.** The script invented a fake job ("robot mood coach"), but real research exists on robots that coach people's moods, so the "made up" reveal wouldn't have been clean. The rendered version shows three **real** jobs and reveals that all three are real. It's more surprising and entirely true.
- **Facts on screen were checked on 27 September 2026:** show caller (a live-events role that calls every cue), precision fermentation technician (live job listings), community health navigator (an established patient-navigation role).
- **Sound** is synthesised from scratch (a soft chord pad, plus pop, tick and stamp effects), so there's no music licensing to worry about. To use a track from YouTube's audio library instead, swap it in the Shorts editor after publishing.

---

## Made, but needs a person in YouTube Studio

Metricool publishes posts; it can't change channel settings. These take about 15 minutes in **YouTube Studio**:

- [ ] **Banner:** upload [channel-art/banner-2560x1440.png](channel-art/banner-2560x1440.png) under *Customisation → Branding*. Everything that must survive on a phone sits inside YouTube's 1546×423 safe area (checked automatically when rendering).
- [ ] **Profile picture:** upload [channel-art/profile-800x800.png](channel-art/profile-800x800.png). It's the logo mark from offladder.com, on the site's paper colour.
- [ ] **Links:** add `https://offladder.com/start?utm_source=youtube&utm_medium=channel&utm_campaign=channel&utm_content=profile` as the first channel link. Links in Shorts aren't clickable, so this is where Shorts viewers can click through.
- [ ] **About text:** paste the About copy from [09-launch-plan.md](../09-launch-plan.md#channel-copy).
- [ ] **Comments:** turn on *hold potentially inappropriate comments for review*, and add the blocked-words list ([07-production-workflow.md](../07-production-workflow.md#5-safety-consent-and-safeguarding)).
- [ ] **Pin** each Short's first comment once it's live (Metricool posts it, but pinning is manual).
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

Everything here is reproducible. To render a new Short:

```sh
cd offladder-youtube/launch/shorts
./fetch-fonts.sh                       # brand fonts (SIL Open Font License)
pip install numpy imageio-ffmpeg       # audio synthesis and a static ffmpeg
node render.cjs --stills s05-football-tactics   # check one frame per scene first
node render.cjs s05-football-tactics            # full 1080x1920 MP4 in ./out
```

- Add a Short by adding an entry to [shorts/specs.mjs](shorts/specs.mjs). Scenes list their blocks (`h1`, `mark`, `body`, `small`, `label`, `card`, `bigcard`, `timer`, `tally`, `stamp`, `cta`) with start times, animations (`none`, `up`, `pop`, `stamp`) and sound cues (`pop`, `tick`, `thud`).
- The renderer refuses to output a scene that overflows the Shorts safe area (clear of the right-hand buttons and bottom caption zone).
- Audio is normalised to -14 LUFS, YouTube's loudness reference, so every Short plays at the same volume.
- Every line on screen must pass the playbook's claims rules ([templates/claims-register.md](../templates/claims-register.md)).
