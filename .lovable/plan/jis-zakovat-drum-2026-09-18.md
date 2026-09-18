# JIS Zakovat Drum

## What I’ll build
- Replace the blank page with a polished Uzbek random-number drum designed for projector use and responsive on smaller screens.
- Add a prominent JIS-inspired emblem, an immersive school-entrance backdrop, and deep-red/gold glass styling.
- Build a large animated drum with small numbered balls, a dramatic center draw sequence, final result, restrained confetti, and optional sound off by default.
- Add no-repeat draws, recent-number history, pool reset, and editable drum size presets.
- Add an independent manual timer with minute/second entry, Start, Pause/Resume, and Reset controls.

## Interaction details
- Nothing starts on page load.
- “Aylantirish” chooses exactly one unused number from 1 to N, cycles candidates, eases to the result, then shows “Omad yor bo’lsin”.
- Changing N resets the draw pool; “Qayta boshlash” clears selected history.
- Timer controls never affect the draw, and the draw never starts the timer.
- All controls remain keyboard operable with visible focus treatment and reduced-motion support.

## Technical details
- Use React state and browser timers only; no account or database is needed.
- Use semantic design tokens in the global stylesheet, shared button/input components, and generated/local visual assets.
- Add route-specific page metadata and verify desktop and mobile layouts in the live preview.
