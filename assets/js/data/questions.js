export const QUESTIONS = [
  {
    id: "name",
    type: "text",
    required: true,
    title: "Jak mam się do Ciebie zwracać?",
    input: { placeholder: "Twoje imię...", maxLength: 30 },
    validate: (v) => typeof v === "string" && v.trim().length >= 2,
  },

  {
    id: "age",
    type: "slider",
    required: true,
    title: "Wiek",
    slider: { min: 14, max: 75, step: 1, default: 25, unit: "lat" },
    validate: (v) => Number(v) >= 14,
  },

  {
    id: "gender",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Płeć",
    options: [
      { value: "male", label: "Mężczyzna" },
      { value: "female", label: "Kobieta" },
    ],
    validate: (v) => ["male", "female"].includes(v),
  },

  /* =========================
     BODY (bardziej realne widełki)
     ========================= */

  {
    id: "height",
    type: "number",
    required: true,
    title: "Wzrost",
    input: { placeholder: "np. 180", unit: "cm" },
    validate: (v) => {
      const n = Number(v);
      return n >= 130 && n <= 220;
    },
  },

  {
    id: "weight",
    type: "number",
    required: true,
    title: "Waga",
    input: { placeholder: "np. 75", unit: "kg" },
    validate: (v) => {
      const n = Number(v);
      return n >= 35 && n <= 220;
    },
  },

  /* =========================
     ACTIVITY FLOW (ważne do kalorii)
     ========================= */

  {
    id: "training_days",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Trening siłowy w tygodniu",
    options: [
      { value: "0-1", label: "0–1 dni" },
      { value: "2-3", label: "2–3 dni" },
      { value: "4-5", label: "4–5 dni" },
      { value: "6-7", label: "6–7 dni" },
    ],
    validate: (v) => !!v,
  },

  {
    id: "activity",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Aktywność poza treningiem",
    options: [
      { value: "low", label: "Siedzący tryb (mało ruchu)" },
      { value: "medium", label: "Umiarkowana (spacery, szkoła/praca)" },
      { value: "high", label: "Bardzo aktywny (praca fizyczna)" },
    ],
    validate: (v) => !!v,
  },

  /* =========================
     GOAL (bardziej “fit app style”)
     ========================= */

  {
    id: "goal",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Cel",
    options: [
      { value: "mass", label: "Masa mięśniowa" },
      { value: "strength", label: "Siła" },
      { value: "cut", label: "Redukcja tkanki tłuszczowej" },
      { value: "recomp", label: "Rekompozycja ciała" },
    ],
    validate: (v) => !!v,
  },

  {
    id: "experience",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Doświadczenie treningowe",
    options: [
      { value: "beginner", label: "Początkujący (0–1 rok)" },
      { value: "intermediate", label: "Średniozaawansowany (1–3 lata)" },
      { value: "advanced", label: "Zaawansowany (3+ lata)" },
    ],
    validate: (v) => !!v,
  },

  /* =========================
     RECOVERY (ważne dla planu)
     ========================= */

  {
    id: "sleep",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Sen",
    options: [
      { value: "lt6", label: "Mniej niż 6h" },
      { value: "6-7", label: "6–7h" },
      { value: "7-8", label: "7–8h" },
      { value: "8-9", label: "8–9h" },
      { value: "gt9", label: "Powyżej 9h" },
    ],
    validate: (v) => !!v,
  },

  {
    id: "stress",
    type: "cards",
    required: true,
    autoNext: true,
    title: "Stres",
    options: [
      { value: "low", label: "Niski" },
      { value: "medium", label: "Średni" },
      { value: "high", label: "Wysoki" },
      { value: "very_high", label: "Bardzo wysoki" },
    ],
    validate: (v) => !!v,
  },

  /* =========================
     OPTIONAL STRENGTH
     ========================= */

  {
    id: "strength",
    type: "lifts",
    required: false,
    title: "Siła (opcjonalnie)",
    fields: [
      { id: "bench", label: "Wyciskanie leżąc", unit: "kg" },
      { id: "squat", label: "Przysiad", unit: "kg" },
      { id: "deadlift", label: "Martwy ciąg", unit: "kg" },
    ],
  },

  /* =========================
     SUPPLEMENTS (bardziej realne)
     ========================= */

  {
    id: "supplements",
    type: "cards",
    required: false,
    multi: true,
    title: "Suplementacja",
    options: [
      { value: "none", label: "Brak suplementów" },
      { value: "protein", label: "Białko (WPC/WPI)" },
      { value: "creatine", label: "Kreatyna" },
      { value: "d3", label: "Witamina D3" },
      { value: "omega3", label: "Omega-3" },
      { value: "magnesium", label: "Magnez" },
      { value: "electrolytes", label: "Elektrolity" },
      { value: "preworkout", label: "Pre-workout" },
      { value: "ashwagandha", label: "Ashwagandha" },
    ],
    validate: () => true,
  },
];