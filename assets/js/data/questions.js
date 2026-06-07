export const QUESTIONS = [
  {
    id: "name",
    type: "text",
    title: "Jak masz na imię?",
    desc: "Użyjemy tego w aplikacji.",
    input: {
      placeholder: "Twoje imię...",
      maxLength: 40,
    },
    validate: (v) => {
      if (!v || v.trim().length < 2) return "Wpisz co najmniej 2 znaki";
      return true;
    },
  },

  {
    id: "age",
    type: "slider",
    title: "Ile masz lat?",
    desc: "Dopasujemy trening do Twojego wieku.",
    slider: {
      min: 15,
      max: 70,
      step: 1,
      default: 25,
      unit: "lat",
    },
    validate: (v) => {
      const n = Number(v);
      if (n < 15 || n > 70) return "Wiek poza zakresem";
      return true;
    },
  },

  {
    id: "goal",
    type: "cards",
    title: "Twój cel",
    desc: "Wybierz jeden — możesz zmienić później.",
    options: [
      {
        value: "strength",
        label: "Siła",
        sub: "Maksymalne ciężary i pobijanie rekordów",
      },
      {
        value: "mass",
        label: "Masa",
        sub: "Budowanie mięśni i objętości",
      },
      {
        value: "cut",
        label: "Redukcja",
        sub: "Spalanie tłuszczu przy zachowaniu mięśni",
      },
    ],
    validate: (v) => {
      if (!v) return "Wybierz jeden cel";
      return true;
    },
  },

  {
    id: "experience",
    type: "cards",
    title: "Doświadczenie",
    desc: "Twój poziom zaawansowania.",
    options: [
      {
        value: "beginner",
        label: "Początkujący",
        sub: "Trenuję krócej niż rok",
      },
      {
        value: "intermediate",
        label: "Średni",
        sub: "1–3 lata regularnego treningu",
      },
      {
        value: "advanced",
        label: "Zaawansowany",
        sub: "Ponad 3 lata, znam swoje ciało",
      },
    ],
    validate: (v) => {
      if (!v) return "Wybierz poziom";
      return true;
    },
  },

  {
    id: "frequency",
    type: "slider",
    title: "Ile dni trenujesz?",
    desc: "Tygodniowo — bądź realistyczny.",
    slider: {
      min: 1,
      max: 7,
      step: 1,
      default: 3,
      unit: "dni / tydzień",
    },
    validate: (v) => {
      const n = Number(v);
      if (n < 1 || n > 7) return "Wybierz od 1 do 7 dni";
      return true;
    },
  },

  {
    id: "lifts",
    type: "lifts",
    title: "Rekordy osobiste",
    desc: "Opcjonalne — wpisz 0 jeśli nie wiesz.",
    fields: [
      { id: "bench", label: "Wyciskanie leżąc", placeholder: "0", unit: "kg" },
      { id: "squat", label: "Przysiad ze sztangą", placeholder: "0", unit: "kg" },
      { id: "deadlift", label: "Martwy ciąg", placeholder: "0", unit: "kg" },
    ],
    validate: () => true,
  },
];