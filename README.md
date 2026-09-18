# JIS Lucky Spin

Build a polished responsive web app for a Zakovat-style random number drum/lottery for JIS International School. The UI language should be Uzbek.

Core behavior:
- Let the user enter how many numbers are in the drum, for example 10, 20, 30, 50, 100. Generate numbers from 1 to N.
- Main centerpiece is a large circular transparent/glass drum with many small number balls around the inside. The numbers should look small compared with the drum.
- In the center, animate one highlighted ball moving/spinning dramatically while the selection is running. The drum and balls should feel lively, with smooth physics-like motion, easing, blur, glow, and depth.
- A large primary button labeled “Aylantirish” starts the random selection. Randomly choose exactly one number from 1..N. While spinning, rapidly cycle candidate numbers, then slow down and land on the final number.
- When it lands, show the selected number very large in the center and display this exact text underneath: “Omad yor bo’lsin”. Add a tasteful success animation/confetti that is not childish.
- Do not auto-start anything on page load.

Timer:
- Include a manual timer section. User can enter/set their own time (minutes and/or seconds).
- Timer must NEVER start automatically. It only starts when the user explicitly presses “Start”.
- Include Start, Pause/Resume, and Reset controls.
- Timer should be independent from the drum spin; spinning the drum must not automatically start the timer.

Design:
- JIS visual identity: deep red, warm yellow/gold, white, with subtle dark overlays.
- Large JIS emblem/logo at the top. IMPORTANT: use only the emblem/mark, not the words “International school” below it. Make the emblem large and prominent.
- Fullscreen school-campus background image with strong blur + dark red translucent overlay so controls stay readable. The intended background is the JIS International School entrance/building photo with the big INTERNATIONAL SCHOOL gate sign.
- Use a premium modern glassmorphism style rather than a childish game aesthetic. Rounded glass panels, soft highlights, clean typography, subtle shadows, elegant animations.
- Desktop-first for use on a projector/large screen, but fully responsive on mobile/tablet.
- Keep the drum very large on desktop; number balls are intentionally small.
- Add a small history area showing recently selected numbers. Do not repeat a selected number until all numbers have been used, with a “Qayta boshlash” button to clear history/reset the pool.
- Add sound toggle UI but keep sound off by default.
- Accessibility: keyboard operable buttons and visible focus states.

Important visual references from the user: the JIS logo is a red rounded-square/circularized mark containing large white J and S with a yellow vertical I/book-like shape in the center; the school background is a bright blue-sky photo of the school front gate/building. If those exact image assets are not available inside the project, create a clean logo mark inspired by this description and a background treatment that can be easily replaced later, but do not include the text “International school” in the logo area.

Make the app fully functional, not a static mockup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zakovat.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7c93c02d-3a69-4aa3-9228-5df380a611ef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
