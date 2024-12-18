// public/script.js

// Переключение темы
const themeToggleBtn = document.getElementById('theme-toggle');

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function toggleTheme() {
  if (document.body.classList.contains('dark-theme')) {
    setTheme('light');
    localStorage.setItem('theme', 'light');
  } else {
    setTheme('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Установка темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Инициализация формы, если на странице есть контейнер формы
  const formContainer = document.getElementById('form-container');
  if (formContainer) {
    renderStep();
    const generateBtn = document.getElementById('generate-perfect-prompt');
    if (generateBtn) {
      generateBtn.addEventListener('click', generatePerfectPrompt);
    }
  }
});

// Функции для формы создания промпта
const steps = [
    {
      question: "Цель",
      type: "text",
      placeholder: "Например, получить информацию, создать историю"
    },
    {
      question: "Тема",
      type: "text",
      placeholder: "Например, технологии, здоровье"
    },
    {
      question: "Аудитория",
      type: "text",
      placeholder: "Например, дети, профессионалы"
    },
    {
      question: "Стиль",
      type: "select",
      options: ["Формальный", "Неформальный"]
    },
    {
      question: "Формат",
      type: "select",
      options: ["Список", "Эссе", "Код", "Другое"]
    },
    {
      question: "Детализация",
      type: "select",
      options: ["Краткий", "Подробный"]
    },
    {
      question: "Тон",
      type: "select",
      options: ["Дружелюбный", "Нейтральный", "Профессиональный"]
    },
    {
      question: "Язык",
      type: "select",
      options: ["Русский", "Английский", "Другой"]
    },
    {
      question: "Примеры",
      type: "select",
      options: ["Да", "Нет"]
    },
    {
      question: "Ключевые слова",
      type: "text",
      placeholder: "Например, AI, машинное обучение"
    },
    {
      question: "Ограничения",
      type: "text",
      placeholder: "Например, не более 200 слов"
    },
    {
      question: "Цитаты",
      type: "select",
      options: ["Да", "Нет"]
    },
    {
      question: "Визуальные Элементы",
      type: "select",
      options: ["Да", "Нет"]
    },
    {
      question: "Ссылки",
      type: "select",
      options: ["Да", "Нет"]
    },
    {
      question: "Дополнительные Инструкции",
      type: "text",
      placeholder: "Любые дополнительные пожелания"
    }
  ];

let currentStep = 0;
const answers = {};

function renderStep() {
  const container = document.getElementById('form-container');
  container.innerHTML = '';

  if (currentStep >= steps.length) {
    showResult();
    return;
  }

  const step = steps[currentStep];

  // Обновление прогресс-бара
  const progress = ((currentStep) / steps.length) * 100;
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
  }

  // Карточка вопроса
  const card = document.createElement('div');
  card.className = 'mb-4';

  const questionEl = document.createElement('h5');
  questionEl.textContent = step.question;
  card.appendChild(questionEl);

  let inputEl;
  if (step.type === 'text') {
    inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'form-control';
    inputEl.placeholder = step.placeholder || '';
  } else if (step.type === 'select') {
    inputEl = document.createElement('select');
    inputEl.className = 'form-select';
    step.options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      inputEl.appendChild(opt);
    });
  }
  inputEl.id = 'answer';
  card.appendChild(inputEl);

  // Кнопки
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'd-flex justify-content-between mt-3';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary';
  nextBtn.textContent = 'Далее';
  nextBtn.type = 'button';
  nextBtn.onclick = () => {
    const answer = document.getElementById('answer').value;
    if (answer) {
      answers[step.question] = answer;
    }
    currentStep++;
    renderStep();
  };
  buttonsDiv.appendChild(nextBtn);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'btn btn-outline-secondary';
  skipBtn.textContent = 'Пропустить';
  skipBtn.type = 'button';
  skipBtn.onclick = () => {
    currentStep++;
    renderStep();
  };
  buttonsDiv.appendChild(skipBtn);

  card.appendChild(buttonsDiv);
  container.appendChild(card);
}

function showResult() {
  const formContainer = document.getElementById('form-container');
  if (formContainer) {
    formContainer.classList.add('hidden');
  }

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `100%`;
    progressBar.setAttribute('aria-valuenow', 100);
  }

  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    let prompt = '';
    for (const [question, answer] of Object.entries(answers)) {
      prompt += `${question}: ${answer}\n`;
    }
    const finalPrompt = document.getElementById('final-prompt');
    if (finalPrompt) {
      finalPrompt.value = prompt.trim();
    }
    resultDiv.classList.remove('hidden');
  }
}

function copyPrompt() {
  const prompt = document.getElementById('final-prompt');
  if (prompt) {
    prompt.select();
    prompt.setSelectionRange(0, 99999); // Для мобильных устройств
    document.execCommand('copy');
    alert('Промпт скопирован!');
  }
}

function restart() {
  currentStep = 0;
  for (let key in answers) delete answers[key];
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.classList.add('hidden');
  }
  const perfectPromptResult = document.getElementById('perfect-prompt-result');
  if (perfectPromptResult) {
    perfectPromptResult.classList.add('hidden');
  }
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `0%`;
    progressBar.setAttribute('aria-valuenow', 0);
  }
  const formContainer = document.getElementById('form-container');
  if (formContainer) {
    formContainer.classList.remove('hidden');
    renderStep();
  }
}

async function generatePerfectPrompt() {
  const generateBtn = document.getElementById('generate-perfect-prompt');
  if (!generateBtn) return;

  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';

  try {
    const response = await fetch('http://localhost:5000/generate-prompt', { // Убедитесь, что используете localhost
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answers)
    });

    console.log('Ответ сервера:', response);

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Некорректный формат ответа:', text);
      throw new TypeError("Ожидался ответ в формате JSON");
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка от сервера:', errorData);
      throw new Error(errorData.error || 'Ошибка при генерации промпта');
    }

    const data = await response.json();
    console.log('Сгенерированный промпт:', data.prompt);
    const perfectPrompt = document.getElementById('perfect-prompt');
    if (perfectPrompt) {
      perfectPrompt.value = data.prompt;
    }
    const perfectPromptResult = document.getElementById('perfect-prompt-result');
    if (perfectPromptResult) {
      perfectPromptResult.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Сгенерировать Идеальный Промпт';
  }
}

function copyPerfectPrompt() {
  const prompt = document.getElementById('perfect-prompt');
  if (prompt) {
    prompt.select();
    prompt.setSelectionRange(0, 99999); // Для мобильных устройств
    document.execCommand('copy');
    alert('Идеальный промпт скопирован!');
  }
}

function hidePerfectPrompt() {
  const perfectPromptResult = document.getElementById('perfect-prompt-result');
  if (perfectPromptResult) {
    perfectPromptResult.classList.add('hidden');
  }
}
