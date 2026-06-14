import { QUESTIONS } from "../data/questions.js";
import { loadCSS } from "../utils.js";

let selectedCard = null;

export function showQuiz(onFinish) {
  loadCSS("assets/css/quiz.css");  
  const app = document.getElementById("app");

  let currentIndex = 0;
  const answers = {};

  // Global card click handler
  app.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    selectedCard = card.dataset.value;

    app.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    clearError();
  });

  function render() {
    selectedCard = null;

    const q = QUESTIONS[currentIndex];
    const stepNum = currentIndex + 1;
    const total = QUESTIONS.length;
    const progress = (stepNum / total) * 100;

    app.innerHTML = `
      <div class="quiz-screen">
        <div class="quiz">

          <div class="quiz-progress-wrap">
            <div class="quiz-progress-track">
              <div class="quiz-progress-bar" id="progressBar" style="width: ${progress}%"></div>
            </div>
            <span class="quiz-step-label">${stepNum} / ${total}</span>
          </div>

          <h2>${q.title}</h2>
          ${q.desc ? `<p class="desc">${q.desc}</p>` : ""}

          <div id="content"></div>
          <p class="quiz-error" id="quizError"></p>

          <div class="actions">
            ${currentIndex > 0 ? `<button class="btn" id="back">Wstecz</button>` : ""}
            <button class="btn btn-primary" id="next">
              ${currentIndex === QUESTIONS.length - 1 ? "Gotowe" : "Dalej"}
            </button>
          </div>

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
        <input
          id="input"
          type="text"
          placeholder="${q.input.placeholder}"
          maxlength="${q.input.maxLength}"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
        />
      `;
      // autofocus po krótkim delay (iOS compatibility)
      setTimeout(() => {
        const inp = document.getElementById("input");
        if (inp) inp.focus();
      }, 100);
    }

    if (q.type === "slider") {
      const { min, max, step, default: def, unit } = q.slider;
      el.innerHTML = `
        <div class="slider-wrap">
          <div class="slider-top">
            <span class="slider-name">${q.title}</span>
            <span class="slider-val" id="sliderVal">${def} ${unit || ""}</span>
          </div>
          <input
            id="input"
            type="range"
            min="${min}"
            max="${max}"
            step="${step}"
            value="${def}"
          />
          <div class="slider-range">
            <span>${min}</span>
            <span>${max}</span>
          </div>
        </div>
      `;

      const input = document.getElementById("input");
      const valEl = document.getElementById("sliderVal");

      input.oninput = () => {
        valEl.textContent = `${input.value} ${unit || ""}`;
      };
    }

    if (q.type === "cards") {
      el.innerHTML = `
        <div class="cards-wrap">
          ${q.options.map(opt => `
            <button class="card" data-value="${opt.value}">
              <div class="card-dot"></div>
              <div class="card-body">
                <div class="label">${opt.label}</div>
                ${opt.sub ? `<div class="sub">${opt.sub}</div>` : ""}
              </div>
            </button>
          `).join("")}
        </div>
      `;
    }

    if (q.type === "lifts") {
      el.innerHTML = `
        <div class="lifts-wrap">
          ${q.fields.map(f => `
            <div class="lift">
              <label>${f.label}</label>
              <div class="lift-row">
                <input
                  type="number"
                  data-id="${f.id}"
                  placeholder="${f.placeholder}"
                  min="0"
                  max="999"
                  inputmode="decimal"
                />
                <span class="lift-unit">${f.unit || "kg"}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  function bindEvents(q) {
    const nextBtn = document.getElementById("next");

    nextBtn.onclick = () => {
      const value = readValue(q);
      const valid = q.validate ? q.validate(value) : true;

      if (valid !== true) {
        showError(valid);
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

    // Enter key na text input
    const input = document.getElementById("input");
    if (input && q.type === "text") {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") nextBtn.click();
      });
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

  function showError(msg) {
    const el = document.getElementById("quizError");
    if (el) {
      el.textContent = msg;
      el.style.opacity = "1";
    }
  }

  function clearError() {
    const el = document.getElementById("quizError");
    if (el) {
      el.textContent = "";
    }
  }

  render();
}