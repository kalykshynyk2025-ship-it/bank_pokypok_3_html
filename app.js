const questScenario = {
  title: "Банк покупок",
  levels: [
    {
      level: 1,
      name: "Уровень 1: Зелёный объект",
      task: "Сделай фото зелёного объекта.",
      proof: "Фото"
    },
    {
      level: 2,
      name: "Уровень 2: Орнамент",
      task: "Сделай фото орнамента и ответь на вопрос.",
      proof: "Фото + ответ",
      question: "Что символизирует орнамент?",
      options: ["Защиту", "Путь", "Солнце"]
    },
    {
      level: 3,
      name: "Уровень 3: Видео в магазине",
      task: "Сними короткое видео в магазине.",
      proof: "Видео"
    },
    {
      level: 4,
      name: "Уровень 4: Фото с человеком",
      task: "Сделай фото с другим человеком.",
      proof: "Фото"
    },
    {
      level: 5,
      name: "Уровень 5: Финальный вопрос",
      task: "Ответь на финальный вопрос.",
      proof: "Ответ",
      question: "Что означает бренд «Калык шынык»?",
      options: ["Народная сила", "Путь народа", "Общая энергия"]
    }
  ]
};

const translations = {
  ru: {
    nav: { home: "Главная", quest: "Квест", profile: "Профиль" },
    subtitle: "Пошаговый квест на 5 уровней",
    home: { title: "Начни квест", cta: "Перейти в квест" },
    quest: {
      title: "Квест",
      progress: "Прогресс",
      prev: "Назад",
      next: "Следующий уровень",
      upload: "Загрузить файл",
      answer: "Ответ",
      complete: "Завершить уровень",
      completed: "Уровень пройден"
    },
    profile: { title: "Профиль", status: "Статус", done: "Пройдено" }
  },
  en: {
    nav: { home: "Home", quest: "Quest", profile: "Profile" },
    subtitle: "Step-by-step 5-level quest",
    home: { title: "Start the quest", cta: "Open quest" },
    quest: {
      title: "Quest",
      progress: "Progress",
      prev: "Previous",
      next: "Next level",
      upload: "Upload file",
      answer: "Answer",
      complete: "Complete level",
      completed: "Level completed"
    },
    profile: { title: "Profile", status: "Status", done: "Completed" }
  },
  mar: {
    nav: { home: "Тӱшка", quest: "Квест", profile: "Профиль" },
    subtitle: "5 тӱшкаан квест",
    home: { title: "Квестым тӱҥал", cta: "Квестыш куснаш" },
    quest: {
      title: "Квест",
      progress: "Прогресс",
      prev: "Ончыч",
      next: "Укеже тӱшка",
      upload: "Файлым колташ",
      answer: "Вашмут",
      complete: "Тӱшкам пытарыш",
      completed: "Тӱшка эртен"
    },
    profile: { title: "Профиль", status: "Шагал", done: "Эртен" }
  }
};

const state = {
  lang: localStorage.getItem("lang") || "ru",
  page: "home",
  userId: localStorage.getItem("userId") || `user_${Math.random().toString(36).slice(2, 10)}`,
  currentLevel: 1,
  completedLevels: [],
  submissions: {}
};

localStorage.setItem("userId", state.userId);

const pageContent = document.getElementById("pageContent");
const navButtons = Array.from(document.querySelectorAll(".nav button"));
const langButtons = Array.from(document.querySelectorAll(".lang-switch button"));

function tr() {
  return translations[state.lang];
}

async function api(path, method = "GET", body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

async function loadProgress() {
  try {
    const data = await api(`/api/progress/${state.userId}`);
    state.currentLevel = data.currentLevel || 1;
    state.completedLevels = data.completedLevels || [];
    state.submissions = data.submissions || {};
  } catch (e) {
    console.warn("Не удалось загрузить прогресс", e);
  }
}

async function saveProgress() {
  try {
    await api(`/api/progress/${state.userId}`, "POST", {
      currentLevel: state.currentLevel,
      completedLevels: state.completedLevels,
      submissions: state.submissions
    });
  } catch (e) {
    console.warn("Не удалось сохранить прогресс", e);
  }
}

function setPage(page) {
  state.page = page;
  render();
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem("lang", lang);
  render();
}

function renderHome() {
  return `
    <section class="card hero">
      <h2>${tr().home.title}</h2>
      <button data-open-quest>${tr().home.cta}</button>
    </section>
  `;
}

function renderQuest() {
  const level = questScenario.levels[state.currentLevel - 1];
  const progressText = `${state.completedLevels.length}/5`;
  const progressPercent = (state.completedLevels.length / 5) * 100;
  const existing = state.submissions[level.level] || {};

  return `
    <section class="card">
      <h2>${tr().quest.title}</h2>
      <p><strong>${tr().quest.progress}:</strong> ${progressText}</p>
      <div class="progress-wrap"><div class="progress" style="width:${progressPercent}%"></div></div>
    </section>

    <section class="card level-card">
      <span class="badge">${level.level}/5</span>
      <h3>${level.name}</h3>
      <p>${level.task}</p>
      <p><strong>Подтверждение:</strong> ${level.proof}</p>

      <label>${tr().quest.upload}
        <input type="file" data-upload="${level.level}" ${level.level === 3 ? 'accept="video/*"' : 'accept="image/*"'}>
      </label>
      ${existing.fileName ? `<p class="upload-preview">Файл: ${existing.fileName}</p>` : ""}

      ${level.question ? `
      <label>${level.question}
        <select data-answer>
          ${level.options.map((o) => `<option ${existing.answer === o ? "selected" : ""}>${o}</option>`).join("")}
        </select>
      </label>
      ` : ""}

      <div class="inline" style="margin-top: 10px;">
        <button class="secondary" data-prev ${state.currentLevel === 1 ? "disabled" : ""}>${tr().quest.prev}</button>
        <button data-complete>${tr().quest.complete}</button>
        <button data-next ${state.currentLevel === 5 ? "disabled" : ""}>${tr().quest.next}</button>
      </div>
      ${state.completedLevels.includes(level.level) ? `<p class="upload-preview">✅ ${tr().quest.completed}</p>` : ""}
    </section>
  `;
}

function renderProfile() {
  return `
    <section class="card">
      <h2>${tr().profile.title}</h2>
      <p>ID: <strong>${state.userId}</strong></p>
      <p>${tr().profile.done}: <strong>${state.completedLevels.length}/5</strong></p>
      <p>${tr().profile.status}: <strong>${state.completedLevels.length === 5 ? "Финиш" : "В процессе"}</strong></p>
    </section>
  `;
}

function bindEvents() {
  document.querySelector("[data-open-quest]")?.addEventListener("click", () => setPage("quest"));

  document.querySelector("[data-upload]")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    const level = state.currentLevel;
    if (!file) return;
    state.submissions[level] = { ...(state.submissions[level] || {}), fileName: file.name };
    await saveProgress();
    render();
  });

  document.querySelector("[data-answer]")?.addEventListener("change", async (e) => {
    const level = state.currentLevel;
    state.submissions[level] = { ...(state.submissions[level] || {}), answer: e.target.value };
    await saveProgress();
  });

  document.querySelector("[data-complete]")?.addEventListener("click", async () => {
    const level = state.currentLevel;
    if (!state.completedLevels.includes(level)) state.completedLevels.push(level);
    if (level < 5) state.currentLevel = level + 1;
    await saveProgress();
    render();
  });

  document.querySelector("[data-prev]")?.addEventListener("click", async () => {
    if (state.currentLevel > 1) state.currentLevel -= 1;
    await saveProgress();
    render();
  });

  document.querySelector("[data-next]")?.addEventListener("click", async () => {
    if (state.currentLevel < 5) state.currentLevel += 1;
    await saveProgress();
    render();
  });
}

function render() {
  const dict = tr();
  document.getElementById("brandTitle").textContent = questScenario.title;
  document.getElementById("brandSubtitle").textContent = dict.subtitle;

  navButtons.forEach((button) => {
    const page = button.getAttribute("data-page");
    button.textContent = dict.nav[page] || page;
    button.classList.toggle("secondary", page !== state.page);
    button.onclick = () => setPage(page);
  });

  langButtons.forEach((button) => {
    const lang = button.getAttribute("data-lang");
    button.classList.toggle("secondary", lang !== state.lang);
    button.onclick = () => setLang(lang);
  });

  const pages = { home: renderHome, quest: renderQuest, profile: renderProfile };
  pageContent.innerHTML = pages[state.page]();
  bindEvents();
}

(async function init() {
  await loadProgress();
  render();
})();
