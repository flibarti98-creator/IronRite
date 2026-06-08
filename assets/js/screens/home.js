export function showHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="home">
      <h2>Start aplikacji</h2>
      <p>Witaj w GymApp!</p>

      <button id="clearStorage">Wyczyść dane</button>
    </div>
  `;

  const btn = document.getElementById("clearStorage");

  btn.addEventListener("click", () => {
    localStorage.clear();
    alert("Dane zostały usunięte");
  });
}