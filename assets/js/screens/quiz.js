import { QUESTIONS } from "../data/questions.js";
import { loadCSS } from "../utils.js";

let selectedCard = null;
let sliderValue = null;
let canClick = true;

export function showQuiz(onFinish) {
  loadCSS("assets/css/quiz.css");

  const app = document.getElementById("app");

  let currentIndex = 0;
  const answers = {};

  app.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    selectedCard = card.dataset.value;

    app.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    clearError();

    const q = QUESTIONS[currentIndex];
    if (q?.autoNext) {
      setTimeout(() => {
        document.getElementById("next")?.click();
      }, 180);
    }
  });

  function render() {
    selectedCard = null;
    sliderValue = null;

    const q = QUESTIONS[currentIndex];

    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    app.innerHTML = `
      <div class="quiz-screen">
        <div class="quiz">

          <div class="quiz-progress-wrap">
            <div class="quiz-progress-track">
              <div class="quiz-progress-bar" style="width:${progress}%"></div>
            </div>
            <span class="quiz-step-label">
              ${currentIndex + 1} / ${QUESTIONS.length}
            </span>
          </div>

          <h2>${q.title}</h2>

          <div id="content"></div>
          <p class="quiz-error" id="quizError"></p>

          <div class="actions">
            ${currentIndex > 0 ? `<button class="btn" id="back">Wstecz</button>` : ""}
            <button class="btn btn-primary" id="next">Dalej</button>
          </div>

        </div>
      </div>
    `;

    renderQuestion(q);
    bindEvents(q);
  }

  function renderQuestion(q) {
    const el = document.getElementById("content");

    /* ================= TEXT / NUMBER ================= */
    if (q.type === "text" || q.type === "number") {
      el.innerHTML = `
        <input id="input"
          type="${q.type === "number" ? "number" : "text"}"
          placeholder="${q.input?.placeholder || ""}"
        />
      `;

      setTimeout(() => document.getElementById("input")?.focus(), 70);
    }

    /* ================= SLIDER ================= */
    if (q.type === "slider") {
      const s = q.slider;

      sliderValue = s.default;

      el.innerHTML = `
        <div class="slider-wrap">
          <div class="slider-top">
            <span>${q.title}</span>
            <span id="sliderVal">${s.default} ${s.unit}</span>
          </div>

          <input id="input"
            type="range"
            min="${s.min}"
            max="${s.max}"
            step="${s.step}"
            value="${s.default}"
          />
        </div>
      `;

      const input = document.getElementById("input");
      const val = document.getElementById("sliderVal");

      input.addEventListener("input", () => {
        sliderValue = Number(input.value);
        val.textContent = `${input.value} ${s.unit}`;
      });
    }

    /* ================= CARDS ================= */
    if (q.type === "cards") {
      el.innerHTML = `
        <div class="cards-wrap">
          ${q.options.map(o => `
            <button class="card" data-value="${o.value}">
              ${o.label}
            </button>
          `).join("")}
        </div>
      `;
    }

    /* ================= LIFTS ================= */
    if (q.type === "lifts") {
      el.innerHTML = `
        <div class="lifts-wrap">
          ${q.fields.map(f => `
            <div class="lift">
              <label>${f.label}</label>
              <input type="number" data-id="${f.id}" placeholder="${f.unit}" />
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  function bindEvents(q) {
    const nextBtn = document.getElementById("next");

    nextBtn.onclick = () => {
      if (!canClick) return;
      canClick = false;

      const value = readValue(q);

      if (q.required && (value === null || value === "" || value === undefined)) {
        showError("To pole jest wymagane");
        canClick = true;
        return;
      }

      const valid = q.validate ? q.validate(value) : true;

      if (!valid) {
        showError("Podaj poprawną wartość");
        canClick = true;
        return;
      }

      answers[q.id] = value;

      setTimeout(() => {
        canClick = true;

        if (currentIndex === QUESTIONS.length - 1) {
          onFinish(answers);
        } else {
          currentIndex++;
          render();
        }
      }, 250);
    };

    document.getElementById("back")?.addEventListener("click", () => {
      currentIndex--;
      render();
    });
  }

  function readValue(q) {
    if (q.type === "text") {
      return document.getElementById("input").value.trim();
    }

    if (q.type === "number") {
      return Number(document.getElementById("input").value);
    }

    if (q.type === "slider") {
      return Number(sliderValue);
    }

    if (q.type === "cards") {
      return selectedCard;
    }

    if (q.type === "lifts") {
      const data = {};
      q.fields.forEach(f => {
        data[f.id] = Number(document.querySelector(`[data-id="${f.id}"]`).value || 0);
      });
      return data;
    }
  }

  function showError(msg) {
    const el = document.getElementById("quizError");
    el.textContent = msg;
    el.style.opacity = "1";
  }

  function clearError() {
    const el = document.getElementById("quizError");
    if (el) el.textContent = "";
  }

  render();
}