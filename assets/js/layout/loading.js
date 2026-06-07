const LOGO_SVG = `
<svg class="logo-svg" viewBox="0 0 466 337" xmlns="http://www.w3.org/2000/svg" aria-label="IronRite">
  <g class="logo-icon" transform="translate(0,337) scale(0.1,-0.1)">
    <path d="M2782 2910 c-118 -32 -223 -92 -310 -180 -85 -84 -131 -152 -444
-660 -110 -179 -285 -462 -390 -629 -104 -167 -187 -305 -185 -307 2 -2 367
-3 810 -2 l807 3 -63 90 c-35 50 -159 228 -277 398 -117 169 -216 307 -219
307 -3 0 -48 -65 -99 -144 l-93 -144 56 -87 c31 -48 59 -93 62 -101 4 -12 -27
-14 -191 -14 -108 0 -196 3 -196 8 0 4 101 169 224 367 432 693 441 706 553
758 41 19 65 22 163 22 134 0 178 -15 255 -86 75 -69 90 -106 90 -224 0 -97
-1 -103 -35 -159 -39 -63 -76 -96 -148 -129 -40 -18 -72 -22 -210 -27 l-163
-5 163 -231 c90 -127 222 -314 293 -417 l130 -186 198 -1 c228 0 214 -13 121
115 -128 178 -345 488 -342 490 2 1 28 15 58 31 133 70 244 232 276 404 30
156 -7 330 -98 466 -81 121 -195 203 -363 260 -69 23 -100 28 -220 31 -116 3
-153 0 -213 -17z"/>
    <path d="M1753 2773 c-425 -701 -877 -1446 -930 -1531 -34 -56 -63 -105 -63
-107 0 -3 89 -4 198 -3 l197 3 350 582 c193 320 353 583 357 583 4 0 23 -27
44 -61 30 -50 39 -58 49 -47 17 17 165 276 165 287 0 11 -246 410 -264 429
-11 11 -29 -13 -103 -135z"/>
  </g>
  <g class="logo-text" transform="translate(0,337) scale(0.1,-0.1)">
    <path d="M1484 831 c-118 -31 -184 -122 -184 -255 0 -167 84 -263 240 -274
123 -8 213 38 256 133 67 146 24 310 -97 372 -50 26 -161 38 -215 24z m162
-100 c46 -28 69 -83 68 -166 0 -118 -51 -179 -148 -179 -59 -1 -92 16 -130 67
-22 29 -33 122 -22 181 8 39 48 93 80 106 39 16 119 11 152 -9z"/>
    <path d="M550 570 l0 -260 55 0 55 0 0 260 0 260 -55 0 -55 0 0 -260z"/>
    <path d="M760 571 l0 -261 55 0 54 0 3 98 3 97 64 0 64 0 60 -97 60 -98 58 0
c33 0 59 2 59 5 0 2 -30 50 -66 105 -36 56 -64 103 -62 104 2 1 19 12 39 24
92 55 91 203 -1 257 -31 18 -56 20 -212 23 l-178 4 0 -261z m329 155 c30 -27
28 -80 -4 -111 -22 -23 -32 -25 -120 -25 l-95 0 0 81 0 81 99 -4 c80 -3 104
-7 120 -22z"/>
    <path d="M1910 570 l0 -260 50 0 51 0 -3 194 c-2 107 0 192 3 190 4 -2 55 -89
114 -194 l107 -190 64 0 64 0 0 260 0 260 -45 0 -45 0 0 -202 0 -203 -116 203
-115 202 -65 0 -64 0 0 -260z"/>
    <path d="M2480 570 l0 -260 35 0 35 0 0 105 0 105 84 0 84 0 64 -102 c63 -103
64 -103 106 -106 l43 -3 -70 105 c-39 58 -71 109 -71 113 0 4 18 15 39 24 50
21 74 58 78 122 5 66 -21 111 -80 137 -35 17 -66 20 -194 20 l-153 0 0 -260z
m283 199 c49 -13 77 -44 77 -87 0 -80 -40 -102 -185 -102 l-105 0 0 100 0 100
88 0 c48 0 104 -5 125 -11z"/>
    <path d="M3040 570 l0 -260 35 0 35 0 0 260 0 260 -35 0 -35 0 0 -260z"/>
    <path d="M3200 800 l0 -30 90 0 90 0 0 -230 0 -230 35 0 35 0 0 230 0 230 90
0 90 0 0 30 0 30 -215 0 -215 0 0 -30z"/>
    <path d="M3710 570 l0 -260 210 0 210 0 0 25 0 25 -172 2 -173 3 -3 93 -3 92
156 0 155 0 0 25 0 24 -152 3 -153 3 -3 83 -3 82 166 0 165 0 0 30 0 30 -200
0 -200 0 0 -260z"/>
  </g>
</svg>
`;

export function showLoading(next) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="loading-screen">

      <div class="loading-glow"></div>

      <div class="logo-wrapper">
        ${LOGO_SVG}
        <p class="loading-tagline">low cortisol • high testosterone</p>
      </div>

      <div class="loading-bottom">
        <div class="loader-track">
          <div class="loader-bar" id="loaderBar"></div>
        </div>
        <p class="loader-label">Loading</p>
      </div>

    </div>
  `;

  const DURATION = 2;
  const bar = document.getElementById("loaderBar");
  const start = performance.now();

  function animateBar(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    bar.style.width = `${eased * 100}%`;
    if (progress < 1) requestAnimationFrame(animateBar);
  }

  requestAnimationFrame(animateBar);

  setTimeout(() => {
    const screen = app.querySelector(".loading-screen");
    if (screen) {
      screen.classList.add("loading-screen--out");
      setTimeout(() => next(), 600);
    } else {
      next();
    }
  }, DURATION + 200);
}