export function showLoading(next) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="loading-screen">

      <div class="loading-bg-glow"></div>

      <div class="logo-wrapper">
        <img src="assets/img/logo4.png" class="logo-img" alt="IronRite logo" />
        <p class="loading-tagline">Low cortisol. High testosterone.</p>
      </div>

      <div class="loading-bottom">
        <div class="loader-container">
          <div class="loader-bar" id="loaderBar"></div>
        </div>
        <p class="loader-label">Loading...</p>
      </div>

    </div>
  `;

  const DURATION = 300000;
  const bar = document.getElementById("loaderBar");
  const start = performance.now();

  function animateBar(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    bar.style.width = `${eased * 100}%`;
    if (progress < 1) {
      requestAnimationFrame(animateBar);
    }
  }

  requestAnimationFrame(animateBar);

  setTimeout(() => {
    const screen = app.querySelector(".loading-screen");
    if (screen) {
      screen.classList.add("loading-screen--fade-out");
      setTimeout(() => next(), 500);
    } else {
      next();
    }
  }, DURATION + 300);
}