export const QUESTIONS = [
  {
    id: 'name',
    type: 'text',
    title: 'Jak masz na imię?',
    desc: 'Użyjemy tego w aplikacji.',
    input: {
      placeholder: 'Twoje imię...',
      maxLength: 40,
    },
    validate: (v) => v.trim().length >= 2 || 'Za krótkie imię',
  },

  {
    id: 'age',
    type: 'slider',
    title: 'Ile masz lat?',
    desc: 'Dopasujemy trening.',
    slider: {
      min: 15,
      max: 70,
      step: 1,
      default: 25,
      unit: 'lat',
    },
    validate: (v) => (v >= 15 && v <= 70) || 'Wiek poza zakresem',
  },

  {
    id: 'goal',
    type: 'cards',
    title: 'Twój cel',
    desc: 'Wybierz jeden.',
    options: [
      { value: 'strength', label: 'Siła' },
      { value: 'mass', label: 'Masa' },
      { value: 'cut', label: 'Redukcja' },
    ],
     validate: (v) => {
  if (!v) return 'Wybierz cel';
  return true;
}
  },

  {
    id: 'experience',
    type: 'cards',
    title: 'Doświadczenie',
    desc: 'Twój poziom.',
    options: [
      { value: 'beginner', label: 'Początkujący' },
      { value: 'intermediate', label: 'Średni' },
      { value: 'advanced', label: 'Zaawansowany' },
    ],
    validate: (v) => {
      if (!v) return 'Wybierz poziom';
      return true;
    }
  },

  {
    id: 'frequency',
    type: 'slider',
    title: 'Ile dni trenujesz?',
    desc: 'Tygodniowo.',
    slider: {
      min: 1,
      max: 7,
      step: 1,
      default: 3,
      unit: 'dni',
    },
    validate: (v) => {
      if (v < 1 || v > 7) return 'Wybierz 1–7 dni';
      return true;
    }
  },

  {
    id: 'lifts',
    type: 'lifts',
    title: 'Rekordy (opcjonalne)',
    desc: 'Możesz pominąć.',
    fields: [
      { id: 'bench', label: 'Wyciskanie', placeholder: '0', unit: 'kg' },
      { id: 'squat', label: 'Przysiad', placeholder: '0', unit: 'kg' },
      { id: 'deadlift', label: 'Martwy ciąg', placeholder: '0', unit: 'kg' },
    ],
    validate: () => true,   

  },
];