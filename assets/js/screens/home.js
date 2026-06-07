export function showHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="home">
      <h2>Start aplikacji</h2>
      <p>Witaj w GymApp!</p>
    </div>
  `;
}
