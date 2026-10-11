/* Starter scene — replace with your own. TIP: most scenes need no custom code — try a recipe, e.g.  scene('A1', sd => rSteps({ items: [{icon:'download', label:'Step one', at:'word'}, ...] }));
   (rTitle rSteps rFlow rGrid rCompare rBars rChecklist rStat rMythFact — see references/engine-api.md and examples/recipes-demo/).
   Custom example below: Every scene is: scene('<id>', sd => { ...build elements, schedule tweens on `tl`... });
   Helpers (all global): add, put, T, card, chip, tag, ico, pop, gone, reveal, hero, at, endAt, drawOn, arrow, road, counter, dots, stamp, slam ...
   Docs: references/engine-api.md. Real examples: examples/ai-bias-auditor/. Times are seconds from the scene start; at('word') returns the
   moment that word is spoken (it throws if the word is not in this scene — that is the typo check). */
scene('A1', sd => {
  const L = svgLayer();                                           // SVG layer for lines/arrows (under anything added later)
  const w3 = sd.words[3] ? sd.words[3].s : 2.5;                      // time of the 4th spoken word (use at('word') in real scenes)
  const h = hero('Say it *simply*', { move: w3 - 0.3 });             // big centred headline that glides to the top
  reveal(h, 0, { times: [0.6, 1.0, 1.4] });
  const c = add(card(520, 300, { r: 36 }), SW / 2, SH * 0.5);       // a card, centred
  add(chip('sparkles', { size: 110, bg: 'var(--primary)' }), 260, 110, c);
  pop(c, sd.words[2] ? sd.words[2].s : 1.0);                         // pop in when the third word is spoken
});
