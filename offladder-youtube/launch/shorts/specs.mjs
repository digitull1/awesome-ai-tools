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
};
