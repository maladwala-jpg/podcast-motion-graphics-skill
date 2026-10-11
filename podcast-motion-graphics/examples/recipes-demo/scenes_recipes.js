scene('R1', sd => rTitle({ kicker: 'Chapter two', title: 'Your field mission', sub: 'Beginner-safe and offline', icon: 'compass', at: 0.6 }));
scene('R2', sd => rSteps({ heading: 'Three simple steps', items: [
  { icon: 'download', label: 'Download a dataset', sub: 'public and non-sensitive', at: 0.8 },
  { icon: 'table-2', label: 'Compare two groups', sub: 'work out the rates', at: 1.8 },
  { icon: 'file-text', label: 'Write a one-page brief', sub: 'state what you found', at: 2.8 }], goal: { label: 'A portfolio piece', icon: 'award', at: 4.0 } }));
scene('R3', sd => rFlow({ heading: 'How a decision moves', nodes: [
  { icon: 'file-text', label: 'Applications', at: 0.8 }, { icon: 'cog', label: 'Scoring tool', at: 1.6 }, { icon: 'users', label: 'Decisions', at: 2.4 }, { icon: 'scale', label: 'Human review', at: 3.2 }] }));
scene('R4', sd => rGrid({ heading: 'Where it shows up', items: [
  { icon: 'landmark', label: 'Banking', at: 0.8 }, { icon: 'building-2', label: 'Public services', at: 1.4 }, { icon: 'briefcase-business', label: 'Hiring', at: 2.0 },
  { icon: 'graduation-cap', label: 'Education', at: 2.6 }, { icon: 'heart', label: 'Healthcare', at: 3.2 }, { icon: 'house', label: 'Housing', at: 3.8 }] }));
scene('R5', sd => rCompare({ heading: 'Approval rates', left: { label: 'Group A', icon: 'users', value: 80, at: 0.8 }, right: { label: 'Group B', icon: 'users', value: 50, at: 2.0 }, unit: '%' }));
scene('R6', sd => rBars({ title: 'Approval rate by region', max: 100, unit: '%', bars: [
  { label: 'North', value: 78, at: 0.8 }, { label: 'East', value: 74, at: 1.2 }, { label: 'South', value: 46, at: 1.6, flag: true }, { label: 'West', value: 76, at: 2.0 }, { label: 'Central', value: 43, at: 2.4, flag: true }],
  ref: { value: 70, label: 'expected', at: 3.4 } }));
scene('R7', sd => rChecklist({ title: 'Before you start', items: [
  { label: 'Pick a public dataset', at: 0.8 }, { label: 'Remove personal details', at: 1.6 }, { label: 'Work offline', at: 2.4 }, { label: 'Keep notes as you go', at: 3.2 }] }));
scene('R8', sd => rStat({ value: 262, unit: ' s', label: 'of brand-new motion graphics', icon: 'sparkles', at: 0.7 }));
scene('R9', sd => rMythFact({ myth: { label: 'AI safety is only theory', at: 0.8, stampAt: 2.0 }, fact: { label: 'Real teams need practical checks', at: 3.2 } }));
