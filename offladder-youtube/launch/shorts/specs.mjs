// The six launch Shorts, adapted from scripts/shorts.md to a text-led format
// (no host on camera yet). Times are in seconds. Block types and animations
// are rendered by engine.html; sfx cues are synthesised by audio.py.
//
// Facts on screen were checked on 27 September 2026:
// - show caller: live-event role that calls every cue (MeyerPro, Precon Events)
// - precision fermentation technician: live job listings (Indeed, ZipRecruiter)
// - community health navigator: established role (NASW careers, CDC patient navigator template)

const hobbyEnd = (start, len = 4.2) => ({
  in: start, out: start + len, blocks: [
    { type: 'h1', text: 'What’s your hobby?', in: start, anim: 'up' },
    { type: 'body', text: 'Comment it. Some become future videos ↓', in: start + 0.6, anim: 'up' },
    { type: 'cta', in: start + 0.6, anim: 'up' },
  ],
});

const hobbyVerb = ({ lead, hook, sub, verb, verbRest, listLabel, jobs, outroA, outroB, outroC, duration }) => {
  const t3 = 6.8;
  const scenes = [
    { in: 0, out: 2.8, blocks: [
      { type: 'h1', text: lead, in: 0, anim: 'none' },
      { type: 'mark', text: hook, in: 0, anim: 'none' },
      { type: 'small', text: sub, in: 1.0, anim: 'up' },
    ] },
    { in: 2.8, out: t3, blocks: [
      { type: 'label', text: 'The verb underneath it', in: 2.8, anim: 'none' },
      { type: 'mark', text: verb, in: 3.1, anim: 'pop', sfx: 'pop' },
      { type: 'body', text: verbRest, in: 3.7, anim: 'up' },
    ] },
    { in: t3, out: 19.4, blocks: [
      { type: 'label', text: listLabel, in: t3, anim: 'none' },
      ...jobs.map((j, i) => ({ type: 'card', num: String(i + 1), title: j[0], desc: j[1], in: t3 + 0.1 + i * 3.9, anim: 'pop', sfx: 'pop' })),
    ] },
  ];
  const outro = { in: 19.4, out: 23.0 + (outroC ? 0.8 : 0), blocks: [
    { type: 'h1', text: outroA, in: 19.4, anim: 'up' },
    { type: 'mark', text: outroB, in: 19.9, anim: 'pop', sfx: 'pop' },
  ] };
  if (outroC) outro.blocks.push({ type: 'body', text: outroC, in: 20.9, anim: 'up' });
  scenes.push(outro);
  scenes.push(hobbyEnd(outro.out, duration - outro.out));
  return scenes;
};

export default {
  's22-ten-jobs': {
    duration: 25.0,
    chip: 'Quick test',
    scenes: [
      { in: 0, out: 2.4, blocks: [
        { type: 'h1', size: 'xl', text: 'Name 10 jobs.', in: 0, anim: 'none' },
        { type: 'mark', text: '10 seconds.', nowrap: true, in: 0, anim: 'none' },
        { type: 'h1', size: 'xl', text: 'Go.', in: 1.25, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 2.4, out: 12.4, blocks: [
        { type: 'label', text: 'Out loud. Start now.', in: 2.4, anim: 'none' },
        { type: 'timer', from: 10, in: 2.4, anim: 'none', ticks: true },
        { type: 'label', text: 'Your 10', in: 2.4, anim: 'none' },
        { type: 'tally', n: 10, in: 2.4, anim: 'none' },
      ] },
      { in: 12.4, out: 13.8, blocks: [
        { type: 'stamp', text: 'Time.', in: 12.4, anim: 'stamp', sfx: 'thud' },
      ] },
      { in: 13.8, out: 17.8, blocks: [
        { type: 'body', text: 'Now: how many of those have you actually watched someone do,', in: 13.8, anim: 'up' },
        { type: 'mark', text: 'up close?', in: 14.9, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 17.8, out: 21.2, blocks: [
        { type: 'h1', text: 'That’s the list you’re choosing your future from.', in: 17.8, anim: 'up' },
      ] },
      { in: 21.2, out: 24.0, blocks: [
        { type: 'h1', text: 'Make it bigger', in: 21.2, anim: 'up' },
        { type: 'mark', text: 'before you choose.', in: 21.55, anim: 'pop', sfx: 'pop' },
        { type: 'small', text: 'How many did you get? Comment it ↓', in: 21.9, anim: 'up' },
        { type: 'cta', in: 21.9, anim: 'up' },
      ] },
      { in: 24.0, out: 25.0, blocks: [
        { type: 'h1', size: 'xl', text: 'Go again?', in: 24.0, anim: 'pop', sfx: 'pop' },
      ] },
    ],
  },

  's05-football-tactics': {
    duration: 27.2,
    chip: 'Hobby → Verb',
    scenes: hobbyVerb({
      lead: 'You argue about', hook: 'football tactics?', sub: 'Your hobby is hiding three jobs.',
      verb: 'Finding the pattern', verbRest: 'that explains why something works.',
      listLabel: 'Finding the pattern →',
      jobs: [
        ['Sports analyst', 'Turns matches into evidence.'],
        ['Epidemiologist', 'Works out how an illness spreads.'],
        ['Fraud analyst', 'Spots the money that doesn’t fit.'],
      ],
      outroA: 'Same brain.', outroB: 'Three different jobs.', duration: 27.2,
    }),
  },

  's06-editing-videos': {
    duration: 27.2,
    chip: 'Hobby → Verb',
    scenes: hobbyVerb({
      lead: 'You lose hours', hook: 'editing videos?', sub: 'Your hobby is hiding three jobs.',
      verb: 'Arranging things', verbRest: 'until the timing feels right.',
      listLabel: 'Getting the timing right →',
      jobs: [
        ['Trailer editor', 'Two minutes to sell a whole film.'],
        ['Show caller', 'Calls every cue at a live event.'],
        ['Level designer', 'Decides when a game hits you next.'],
      ],
      outroA: 'Same instinct.', outroB: 'You’ve been practising for free.', duration: 27.2,
    }),
  },

  's07-friends-drama': {
    duration: 28.0,
    chip: 'Hobby → Verb',
    scenes: hobbyVerb({
      lead: 'Everyone calls you', hook: 'when there’s drama?', sub: 'That’s hiding three jobs.',
      verb: 'Hearing the real problem', verbRest: 'under the one they said.',
      listLabel: 'Hearing the real problem →',
      jobs: [
        ['Mediator', 'Helps two sides who can’t hear each other.'],
        ['User researcher', 'Finds what people need, not what they say.'],
        ['Community health navigator', 'Guides people through the health system.'],
      ],
      outroA: 'You thought you were', outroB: 'just a good friend.', outroC: 'You were also practising.', duration: 28.0,
    }),
  },

  's04-delete-question': {
    duration: 25.6,
    chip: 'One question',
    scenes: [
      { in: 0, out: 2.8, blocks: [
        { type: 'h1', text: 'The best question to ask anyone', in: 0, anim: 'none' },
        { type: 'mark', text: 'about their job:', in: 0, anim: 'none' },
      ] },
      { in: 2.8, out: 7.4, blocks: [
        { type: 'mark', text: 'Which part of your job would you delete if you could?', in: 2.8, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 7.4, out: 10.8, blocks: [
        { type: 'small', text: 'Ask what they love, and you get', in: 7.4, anim: 'up' },
        { type: 'h1', text: 'the job advert.', in: 7.9, anim: 'up' },
      ] },
      { in: 10.8, out: 14.8, blocks: [
        { type: 'small', text: 'Ask what they’d delete, and you get', in: 10.8, anim: 'up' },
        { type: 'mark', text: 'what the hours are really like.', in: 11.3, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 14.8, out: 20.4, blocks: [
        { type: 'body', text: 'If you can live with the part they’d delete, the job might be for you.', in: 14.8, anim: 'up' },
        { type: 'mark', text: 'If you can’t, you’ve just saved yourself years.', in: 17.0, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 20.4, out: 25.6, blocks: [
        { type: 'h1', text: 'So. Which part of your job would you delete?', in: 20.4, anim: 'up' },
        { type: 'small', text: 'Comment yours ↓', in: 21.4, anim: 'up' },
        { type: 'cta', in: 21.4, anim: 'up' },
      ] },
    ],
  },

  's15-real-or-made-up': {
    duration: 29.6,
    chip: 'Real or made up?',
    scenes: [
      { in: 0, out: 2.6, blocks: [
        { type: 'h1', size: 'xl', text: 'Real job', in: 0, anim: 'none' },
        { type: 'mark', size: 'xl', text: 'or made up?', in: 0, anim: 'none' },
        { type: 'small', text: 'Guess each one before the reveal.', in: 0.9, anim: 'up' },
      ] },
      ...[
        ['1 of 3', 'Precision fermentation technician', 2.6],
        ['2 of 3', 'Show caller', 6.4],
        ['3 of 3', 'Digital accessibility engineer', 10.2],
      ].map(([k, title, t]) => ({ in: t, out: t + 3.8, blocks: [
        { type: 'label', text: k, in: t, anim: 'none' },
        { type: 'bigcard', title, in: t, anim: 'pop', sfx: 'pop' },
        { type: 'label', text: 'Real or made up?', in: t, anim: 'none' },
        { type: 'timer', small: true, from: 3, in: t + 0.5, anim: 'none', ticks: true },
      ] })),
      { in: 14.0, out: 24.2, align: 'top', blocks: [
        { type: 'label', text: 'The answers', in: 14.0, anim: 'none' },
        { type: 'card', compact: true, num: '1', title: 'Precision fermentation technician', desc: 'Runs the tanks where microbes make proteins and fats.', stamp: { text: 'Real', in: 14.6 }, in: 14.0, anim: 'pop', sfx: 'pop' },
        { type: 'card', compact: true, num: '2', title: 'Show caller', desc: 'Calls every light and sound cue at a live event.', stamp: { text: 'Real', in: 17.6 }, in: 17.0, anim: 'pop', sfx: 'pop' },
        { type: 'card', compact: true, num: '3', title: 'Digital accessibility engineer', desc: 'Makes websites work by keyboard, voice or screen reader.', stamp: { text: 'Real', in: 20.6 }, in: 20.0, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 24.2, out: 29.6, blocks: [
        { type: 'h1', size: 'xl', text: 'All three', in: 24.2, anim: 'up' },
        { type: 'mark', size: 'xl', text: 'are real.', in: 24.55, anim: 'pop', sfx: 'thud' },
        { type: 'body', text: 'Which would you actually try? Comment 1, 2 or 3 ↓', in: 25.4, anim: 'up' },
        { type: 'cta', in: 25.4, anim: 'up' },
      ] },
    ],
  },

  // ---- Batch 2 (weeks 3-4). Facts checked 28 September 2026 against the
  // U.S. Bureau of Labor Statistics Occupational Outlook Handbook: logisticians
  // "analyze and coordinate an organization's supply chain"; emergency management
  // directors "prepare plans and procedures for responding to natural disasters
  // and other emergencies"; operations research analysts "use mathematics and
  // logic to help organizations make informed decisions and solve problems".

  's12-test-said-accountant': {
    duration: 26.0,
    chip: 'Career tests',
    scenes: [
      { in: 0, out: 2.8, blocks: [
        { type: 'label', text: 'Your career test result:', in: 0, anim: 'none' },
        { type: 'bigcard', title: 'Accountant', in: 0, anim: 'none' },
        { type: 'small', text: '(A made-up result. Stay with us.)', in: 0.9, anim: 'up' },
      ] },
      { in: 2.8, out: 5.6, blocks: [
        { type: 'h1', text: 'And your stomach', in: 2.8, anim: 'up' },
        { type: 'mark', text: 'dropped.', in: 3.2, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 5.6, out: 9.2, blocks: [
        { type: 'h1', text: 'That’s not a failure.', in: 5.6, anim: 'up' },
        { type: 'mark', text: 'It’s data.', in: 6.3, anim: 'pop', sfx: 'thud' },
      ] },
      { in: 9.2, out: 13.6, blocks: [
        { type: 'body', text: 'A test can only reflect what you told it. That drop is new information about you.', in: 9.2, anim: 'up' },
      ] },
      { in: 13.6, out: 20.4, blocks: [
        { type: 'label', text: 'So do this', in: 13.6, anim: 'none' },
        { type: 'card', plain: true, num: '1', title: 'Note the reaction.', in: 13.7, anim: 'pop', sfx: 'pop' },
        { type: 'card', plain: true, num: '2', title: 'Write down what you wish it had said.', in: 15.4, anim: 'pop', sfx: 'pop' },
        { type: 'card', plain: true, num: '3', title: 'Test that, with one small real task this week.', in: 17.1, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 20.4, out: 22.6, blocks: [
        { type: 'body', text: 'Accountants: we love you. This is about fit.', in: 20.4, anim: 'up' },
      ] },
      { in: 22.6, out: 26.0, blocks: [
        { type: 'h1', text: 'What did yours say?', in: 22.6, anim: 'up' },
        { type: 'small', text: 'Comment it ↓', in: 23.1, anim: 'up' },
        { type: 'cta', in: 23.1, anim: 'up' },
      ] },
    ],
  },

  's17-dont-ask-ai-this': {
    duration: 24.4,
    chip: 'Ask it better',
    scenes: [
      { in: 0, out: 2.8, blocks: [
        { type: 'label', text: 'Don’t ask AI this:', in: 0, anim: 'none' },
        { type: 'bigcard', title: '“What career should I do?”', in: 0, anim: 'none' },
        { type: 'stamp', text: 'Nope.', in: 1.3, anim: 'stamp', sfx: 'thud' },
      ] },
      { in: 2.8, out: 6.8, blocks: [
        { type: 'body', text: 'It only knows what you tell it, so you get a guess back.', in: 2.8, anim: 'up' },
        { type: 'mark', text: 'Ask this instead ↓', in: 4.2, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 6.8, out: 13.6, blocks: [
        { type: 'prompt', text: 'Describe a normal Tuesday for a [job]. Include the repetitive and unglamorous parts, not just the interesting ones.', in: 6.8, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 13.6, out: 18.0, blocks: [
        { type: 'h1', text: 'Now you know what the job is.', in: 13.6, anim: 'up' },
        { type: 'mark', text: 'Not what it sounds like.', in: 14.4, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 18.0, out: 24.4, blocks: [
        { type: 'small', text: 'Screenshot the prompt. Try it tonight.', in: 18.0, anim: 'up' },
        { type: 'h1', text: 'Which job will you ask about?', in: 18.6, anim: 'up' },
        { type: 'small', text: 'Comment it ↓', in: 19.4, anim: 'up' },
        { type: 'cta', in: 19.4, anim: 'up' },
      ] },
    ],
  },

  's09-strategy-games': {
    duration: 28.0,
    chip: 'Hobby → Verb',
    scenes: hobbyVerb({
      lead: 'You play', hook: 'strategy games?', sub: 'Your hobby is hiding three jobs.',
      verb: 'Planning with limited resources', verbRest: 'when you can’t see the whole map.',
      listLabel: 'Planning with limited resources →',
      jobs: [
        ['Logistics planner', 'Coordinates how goods get where they’re needed.'],
        ['Emergency planner', 'Plans who does what before a disaster hits.'],
        ['Operations research analyst', 'Uses maths to find the best plan for complicated problems.'],
      ],
      outroA: 'You’ve been', outroB: 'training for years.', outroC: 'Just without the payslip.', duration: 28.0,
    }),
  },

  's21-worst-week': {
    duration: 26.4,
    chip: 'The method',
    scenes: [
      { in: 0, out: 2.8, blocks: [
        { type: 'h1', text: 'Before you choose a job,', in: 0, anim: 'none' },
        { type: 'mark', text: 'ask about its worst week.', in: 0, anim: 'none' },
      ] },
      { in: 2.8, out: 7.2, blocks: [
        { type: 'body', text: 'Anyone can handle the best week of a job.', in: 2.8, anim: 'up' },
        { type: 'mark', text: 'Fit is often decided by the worst one.', in: 4.0, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 7.2, out: 14.4, blocks: [
        { type: 'label', text: 'Ask someone who does it:', in: 7.2, anim: 'none' },
        { type: 'card', plain: true, num: '1', title: 'What does your worst week of the year look like?', in: 7.3, anim: 'pop', sfx: 'pop' },
        { type: 'card', plain: true, num: '2', title: 'How often does it happen?', in: 9.6, anim: 'pop', sfx: 'pop' },
        { type: 'card', plain: true, num: '3', title: 'What gets you through it?', in: 11.4, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 14.4, out: 18.8, blocks: [
        { type: 'h1', text: 'If you could live through their worst week,', in: 14.4, anim: 'up' },
        { type: 'mark', text: 'it might be your job.', in: 15.6, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 18.8, out: 21.8, blocks: [
        { type: 'body', text: 'Under 16? Ask an adult you trust to introduce you to someone who does the work.', in: 18.8, anim: 'up' },
      ] },
      { in: 21.8, out: 26.4, blocks: [
        { type: 'h1', text: 'What’s the worst week in your job?', in: 21.8, anim: 'up' },
        { type: 'small', text: 'Comment it ↓', in: 22.5, anim: 'up' },
        { type: 'cta', in: 22.5, anim: 'up' },
      ] },
    ],
  },

  's11-the-pause': {
    duration: 25.2,
    chip: 'The pause',
    scenes: [
      { in: 0, out: 2.4, blocks: [
        { type: 'label', text: 'Every family gathering:', in: 0, anim: 'none' },
        { type: 'bubble', text: 'So! What do you want to be?', in: 0, anim: 'none' },
      ] },
      { in: 2.4, out: 6.0, blocks: [
        { type: 'bubble', text: 'So! What do you want to be?', in: 2.4, anim: 'none' },
        { type: 'label', text: 'The pause', in: 2.4, anim: 'none' },
        { type: 'dots', n: 3, every: 1.0, in: 2.6, anim: 'none' },
      ] },
      { in: 6.0, out: 10.4, blocks: [
        { type: 'h1', text: 'Everyone’s had it.', in: 6.0, anim: 'up' },
        { type: 'body', text: 'Nobody sensible expects a 15-year-old to pick one job for the next forty years.', in: 6.7, anim: 'up' },
      ] },
      { in: 10.4, out: 14.8, blocks: [
        { type: 'label', text: 'Next time, say this:', in: 10.4, anim: 'none' },
        { type: 'mark', text: '“I’m testing a couple of directions.”', in: 10.8, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 14.8, out: 19.0, blocks: [
        { type: 'body', text: 'Then make it true: try one small, real piece of a job this week.', in: 14.8, anim: 'up' },
      ] },
      { in: 19.0, out: 21.4, blocks: [
        { type: 'label', text: 'Next family gathering:', in: 19.0, anim: 'none' },
        { type: 'bubble', reply: true, text: 'Ooh. Which ones?', in: 19.2, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 21.4, out: 25.2, blocks: [
        { type: 'h1', text: 'What do you usually say?', in: 21.4, anim: 'up' },
        { type: 'small', text: 'Comment it ↓', in: 22.0, anim: 'up' },
        { type: 'cta', in: 22.0, anim: 'up' },
      ] },
    ],
  },

  's20-novelty-lies': {
    duration: 24.8,
    chip: 'The method',
    scenes: [
      { in: 0, out: 2.4, blocks: [
        { type: 'h1', text: 'Everything’s fun', in: 0, anim: 'none' },
        { type: 'mark', text: 'the first time.', in: 0, anim: 'none' },
      ] },
      { in: 2.4, out: 5.2, blocks: [
        { type: 'body', text: 'New job, new hobby, new course.', in: 2.4, anim: 'up' },
        { type: 'h1', text: 'Novelty flatters everything once.', in: 3.2, anim: 'up' },
      ] },
      { in: 5.2, out: 9.6, blocks: [
        { type: 'label', text: 'The repeat test', in: 5.2, anim: 'none' },
        { type: 'mark', text: 'Do it twice.', in: 5.5, anim: 'pop', sfx: 'pop' },
        { type: 'body', text: 'Same task. A different day.', in: 6.4, anim: 'up' },
      ] },
      { in: 9.6, out: 14.6, blocks: [
        { type: 'body', text: 'The second time, the shine’s gone. What’s left is what the work actually feels like.', in: 9.6, anim: 'up' },
      ] },
      { in: 14.6, out: 19.8, blocks: [
        { type: 'label', text: 'Then ask:', in: 14.6, anim: 'none' },
        { type: 'mark', text: 'Would I do it again next week, unasked?', in: 14.9, anim: 'pop', sfx: 'pop' },
      ] },
      { in: 19.8, out: 24.8, blocks: [
        { type: 'h1', text: 'What have you only tried once?', in: 19.8, anim: 'up' },
        { type: 'small', text: 'Comment it ↓', in: 20.5, anim: 'up' },
        { type: 'cta', in: 20.5, anim: 'up' },
      ] },
    ],
  },
};
