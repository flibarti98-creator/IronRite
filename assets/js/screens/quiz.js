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
  const answers = {}; // Tutaj lądują wszystkie wyniki

  // Główny nasłuchiwacz kliknięć w karty
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

    // POPRAWKA: autoNext musi zapisać wartość przed przejściem dalej!
    if (q?.autoNext && !q.multi) { 
      const val = readValue(q);
      const valid = q.validate ? q.validate(val) : true;
      
      if (valid) {
        answers[q.id] = val;
        setTimeout(() => {
          goNext();
        }, 180);
      } else {
        showError("Podaj poprawną wartość");
      }
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
    const q = QUESTIONS[currentIndex];
    
    // POPRAWKA: Zamiast resetować stan do null, przywracamy zapisane wcześniej odpowiedzi (UX "Wstecz")
    const existingAnswer = answers[q.id];
    
    selectedCard = (q.type === "cards" && !q.multi) ? (existingAnswer || null) : null;
    selectedMulti = (q.type === "cards" && q.multi) ? new Set(existingAnswer || []) : new Set();
    sliderValue = q.type === "slider" ? (existingAnswer ?? q.slider.default) : null;

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

    renderQuestion(q, existingAnswer); // Przekazujemy zapisaną odpowiedź do renderera
    bindEvents(q);
  }

  function renderQuestion(q, existingAnswer) {
    const el = document.getElementById("content");

    /* ================= TEXT / NUMBER ================= */
    if (q.type === "text" || q.type === "number") {
      const val = existingAnswer !== undefined ? existingAnswer : "";
      el.innerHTML = `
        <input id="input"
          type="${q.type === "number" ? "number" : "text"}"
          placeholder="${q.input?.placeholder || ""}"
          value="${val}"
          ${q.input?.maxLength ? `maxlength="${q.input.maxLength}"` : ""}
        />
      `;

      setTimeout(() => document.getElementById("input")?.focus(), 70);
    }

    /* ================= SLIDER ================= */
    if (q.type === "slider") {
      const s = q.slider;
      const currentVal = existingAnswer ?? s.default;

      el.innerHTML = `
        <div class="slider-wrap">
          <div class="slider-top">
            <span>${q.title}</span>
            <span id="sliderVal">${currentVal} ${s.unit}</span>
          </div>

          <input id="input"
            type="range"
            min="${s.min}"
            max="${s.max}"
            step="${s.step}"
            value="${currentVal}"
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
          ${q.options.map(o => {
            // Sprawdzamy czy karta była wcześniej zaznaczona
            let isActive = false;
            if (q.multi) {
              isActive = selectedMulti.has(o.value);
            } else {
              isActive = selectedCard === o.value;
            }
            return `
              <button type="button" class="card ${isActive ? 'active' : ''}" data-value="${o.value}">
                ${o.label}
              </button>
            `;
          }).join("")}
        </div>
      `;
    }

    /* ================= LIFTS ================= */
    if (q.type === "lifts") {
      el.innerHTML = `
        <div class="lifts-wrap">
          ${q.fields.map(f => {
            const val = existingAnswer && existingAnswer[f.id] ? existingAnswer[f.id] : "";
            return `
              <div class="lift">
                <label>${f.label}</label>
                <input type="number" data-id="${f.id}" placeholder="${f.unit}" value="${val}" />
              </div>
            `;
          }).join("")}
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

      answers[q.id] = value; // Zapis do głównego obiektu
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
      onFinish(answers); // Po ostatnim pytaniu przekazujemy cały obiekt "answers" wyżej
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
      const val = document.getElementById("input").value;
      return val === "" ? null : Number(val);
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
        const val = document.querySelector(`[data-id="${f.id}"]`)?.value;
        data[f.id] = val ? Number(val) : 0;
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
    if (el) el.textContent = "";
  }

  doRender("next");
}