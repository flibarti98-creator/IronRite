import { QUESTIONS } from "../data/questions.js";

let selectedCard = null;

export function showQuiz(onFinish) {
  const app = document.getElementById("app");

  let currentIndex = 0;
  const answers = {};

  // 🔥 CARDS CLICK (GLOBAL)
  app.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    selectedCard = card.dataset.value;

    app.querySelectorAll(".card").forEach(c =>
      c.classList.remove("active")
    );

    card.classList.add("active");
  });

  function render() {
    selectedCard = null;

    const q = QUESTIONS[currentIndex];

    app.innerHTML = `
      <div class="quiz">
        <h2>${q.title}</h2>
        <p>${q.desc || ""}</p>

        <div id="content"></div>

        <div class="actions">
          ${currentIndex > 0 ? `<button id="back">Wstecz</button>` : ""}
          <button id="next">Dalej</button>
        </div>
      </div>
    `;

    renderQuestion(q);
    bindEvents(q);
  }

  function renderQuestion(q) {
    const el = document.getElementById("content");

    if (q.type === "text") {
      el.innerHTML = `
        <input id="input"
          placeholder="${q.input.placeholder}"
          maxlength="${q.input.maxLength}"
        />
      `;
    }

    if (q.type === "slider") {
      el.innerHTML = `
        <input id="input" type="range"
          min="${q.slider.min}"
          max="${q.slider.max}"
          step="${q.slider.step}"
          value="${q.slider.default}"
        />

        <div id="value">${q.slider.default}</div>
      `;

      const input = document.getElementById("input");
      const value = document.getElementById("value");

      input.oninput = () => {
        value.textContent = input.value;
      };
    }

    if (q.type === "cards") {
      el.innerHTML = q.options.map(opt => `
        <button class="card" data-value="${opt.value}">
          <div class="label">${opt.label}</div>
          ${opt.sub ? `<div class="sub">${opt.sub}</div>` : ""}
        </button>
      `).join("");
    }

    if (q.type === "lifts") {
      el.innerHTML = q.fields.map(f => `
        <div class="lift">
          <label>${f.label}</label>
          <input data-id="${f.id}" placeholder="${f.placeholder}" />
        </div>
      `).join("");
    }
  }

  function bindEvents(q) {
    const nextBtn = document.getElementById("next");

    nextBtn.onclick = () => {
      const value = readValue(q);

      const valid = q.validate ? q.validate(value) : true;

      if (valid !== true) {
        alert(valid);
        return;
      }

      answers[q.id] = value;

      if (currentIndex === QUESTIONS.length - 1) {
        onFinish(answers);
      } else {
        currentIndex++;
        render();
      }
    };

    if (currentIndex > 0) {
      document.getElementById("back").onclick = () => {
        currentIndex--;
        render();
      };
    }
  }

  function readValue(q) {
    if (q.type === "text" || q.type === "slider") {
      return document.getElementById("input").value;
    }

    if (q.type === "cards") {
      return selectedCard;
    }

    if (q.type === "lifts") {
      const data = {};

      q.fields.forEach(f => {
        data[f.id] = app.querySelector(`[data-id="${f.id}"]`).value;
      });

      return data;
    }
  }

  render(); // 🔥 MUSI BYĆ NA KOŃCU
}