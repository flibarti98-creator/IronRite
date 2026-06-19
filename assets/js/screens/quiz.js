import { QUESTIONS } from "../data/questions.js";
import { loadCSS } from "../utils.js";

let selectedCard = null;       // single-select
let selectedMulti = new Set(); // multi-select
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

    const q = QUESTIONS[currentIndex];
    const value = card.dataset.value;

    if (q.multi) {
      handleMultiClick(q, card, value);
    } else {
      selectedCard = value;
      app.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }

    clearError();

    if (q?.autoNext) {
      setTimeout(() => {
        goNext();
      }, 180);
    }
  });

  function handleMultiClick(q, card, value) {
    const exclusive = q.exclusiveValue; // np. "none"

    if (exclusive && value === exclusive) {
      if (selectedMulti.has(value)) {
        selectedMulti.delete(value);
        card.classList.remove("active");
      } else {
        selectedMulti.clear();
        selectedMulti.add(value);
        app.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      }
      return;
    }

    if (exclusive && selectedMulti.has(exclusive)) {
      selectedMulti.delete(exclusive);
      const exclusiveCard = app.querySelector(`.card[data-value="${exclusive}"]`);
      exclusiveCard?.classList.remove("active");
    }

    if (selectedMulti.has(value)) {
      selectedMulti.delete(value);
      card.classList.remove("active");
    } else {
      selectedMulti.add(value);
      card.classList.add("active");
    }
  }

  /* ====== RENDER Z ANIMOWANYM PRZEJŚCIEM ====== */

  function render(direction = "next") {
    const oldQuiz = app.querySelector(".quiz");

    if (!oldQuiz) {
      doRender(direction);
      return;
    }

    oldQuiz.classList.add(direction === "back" ? "quiz-exit-back" : "quiz-exit-next");

    setTimeout(() => {
      doRender(direction);
    }, 150);
  }

  function doRender(direction) {
    selectedCard = null;
    selectedMulti = new Set();
    sliderValue = null;

    const q = QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    const enterClass = direction === "back" ? "quiz-enter-back" : "quiz-enter-next";

    app.innerHTML = `
      <div class="quiz-screen">
        <div class="quiz ${enterClass}">

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
            ${currentIndex > 0 ? `<button type="button" class="btn" id="back">Wstecz</button>` : ""}
            <button type="button" class="btn btn-primary" id="next">Dalej</button>
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
          ${q.input?.maxLength ? `maxlength="${q.input.maxLength}"` : ""}
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

          <div class="slider-range">
            <span>${s.min}</span>
            <span>${s.max}</span>
          </div>
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
            <button type="button" class="card" data-value="${o.value}">
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

      const value = readValue(q);

      const isEmpty =
        value === null || value === "" || value === undefined ||
        (Array.isArray(value) && value.length === 0);

      if (q.required && isEmpty) {
        showError("To pole jest wymagane");
        return;
      }

      const valid = q.validate ? q.validate(value) : true;

      if (!valid) {
        showError("Podaj poprawną wartość");
        return;
      }

      answers[q.id] = value;
      goNext();
    };

    document.getElementById("back")?.addEventListener("click", () => {
      if (!canClick) return;
      canClick = false;
      currentIndex--;
      render("back");
      setTimeout(() => { canClick = true; }, 350);
    });
  }

  function goNext() {
    canClick = false;

    if (currentIndex === QUESTIONS.length - 1) {
      onFinish(answers);
      return;
    }

    currentIndex++;
    render("next");
    setTimeout(() => { canClick = true; }, 350);
  }

  function readValue(q) {
    if (q.type === "text") {
      return document.getElementById("input").value.trim();
    }

    if (q.type === "number") {
      return Number(document.getElementById("input").value);
    }

    if (q.type === "slider") {
      return Number(sliderValue ?? q.slider.default);
    }

    if (q.type === "cards") {
      return q.multi ? Array.from(selectedMulti) : selectedCard;
    }

    if (q.type === "lifts") {
      const data = {};
      q.fields.forEach(f => {
        data[f.id] = Number(document.querySelector(`[data-id="${f.id}"]`)?.value || 0);
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

  doRender("next");
}