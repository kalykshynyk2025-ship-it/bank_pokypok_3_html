const questScenario = {
  title: "Банк покупок",
  brand: "Калык шынык",
  levels: [
    {
      level: 1,
      name: "Дух входа",
      description: "Главный вход ТЦ",
      task: "Найди 3 предмета светло-зелёного цвета.",
      proof: "Фото"
    },
    {
      level: 2,
      name: "Код предков",
      description: "Декор на любом этаже",
      task: "Найди узор, похожий на марийский орнамент, и ответь на вопрос.",
      proof: "Фото + ответ"
    },
    {
      level: 3,
      name: "Живое пространство",
      description: "Партнёрский магазин",
      task: "Запиши видео до 10 секунд с фразой «Я в Банке покупок».",
      proof: "Видео"
    },
    {
      level: 4,
      name: "Связь людей",
      description: "Любая зона ТЦ",
      task: "Сделай совместное фото с другим участником или гостем.",
      proof: "Фото"
    },
    {
      level: 5,
      name: "Испытание знания",
      description: "Финальная зона",
      task: "Ответь: что означает бренд «Калык шынык»?",
      proof: "Ответ"
    }
  ],
  reward: ["Сумка", "Игрушка", "Украшение", "Открытка"]
};

const translations = {
  ru: {
    nav: { home: "Главная", shop: "Каталог", quest: "Квест", profile: "Профиль" },
    subtitle: "Квест и покупки от бренда «Калык шынык»",
    home: {
      title: "Добро пожаловать в «Банк покупок»",
      text: "Купи товар сразу или получи награду бесплатно через квест.",
      buy: "Купить товар",
      startQuest: "Пройти квест"
    },
    shop: {
      title: "Каталог",
      freeHint: "или получи бесплатно через квест",
      buy: "Купить",
      payTitle: "Оплата",
      payDesc: "Если не хочешь проходить квест, выбери способ оплаты.",
      sber: "Оплатить через SberPay",
      vtb: "Оплатить через VTB Pay"
    },
    quest: {
      title: "Квест",
      scan: "Сканировать QR",
      stopScan: "Остановить сканер",
      upload: "Загрузить фото/видео",
      complete: "Отметить уровень пройденным",
      question: "Что символизирует этот знак?",
      option1: "Защита семьи",
      option2: "Путь и движение",
      option3: "Солнце и тепло"
    },
    profile: {
      title: "Профиль",
      lang: "Язык",
      progress: "Прогресс",
      reward: "Награда"
    }
  },
  en: {
    nav: { home: "Home", shop: "Shop", quest: "Quest", profile: "Profile" },
    subtitle: "Quest and shopping by “Kalyk shynyk”",
    home: {
      title: "Welcome to the Shopping Bank",
      text: "Buy now or complete the quest to get rewards for free.",
      buy: "Buy product",
      startQuest: "Start quest"
    },
    shop: {
      title: "Catalog",
      freeHint: "or get it free via quest",
      buy: "Buy",
      payTitle: "Payment",
      payDesc: "If you skip the quest, choose a payment provider.",
      sber: "Pay with SberPay",
      vtb: "Pay with VTB Pay"
    },
    quest: {
      title: "Quest",
      scan: "Scan QR",
      stopScan: "Stop scanner",
      upload: "Upload photo/video",
      complete: "Mark level complete",
      question: "What does this sign symbolize?",
      option1: "Family protection",
      option2: "Path and movement",
      option3: "Sun and warmth"
    },
    profile: {
      title: "Profile",
      lang: "Language",
      progress: "Progress",
      reward: "Reward"
    }
  },
  mar: {
    nav: { home: "Тӱшка", shop: "Каталог", quest: "Квест", profile: "Профиль" },
    subtitle: "«Калык шынык» марте кевыт дене квест",
    home: {
      title: "«Банк покупок» лийже",
      text: "Товарым налы, але квестым эртен налме пӱлем ончык.",
      buy: "Товарым налы",
      startQuest: "Квестым тӱҥал"
    },
    shop: {
      title: "Каталог",
      freeHint: "але квест гоч акысыз налаш лиеш",
      buy: "Налаш",
      payTitle: "Тӱлым",
      payDesc: "Квестым ок эртен гын, тӱлым сервисым ойыр.",
      sber: "SberPay дене тӱлаш",
      vtb: "VTB Pay дене тӱлаш"
    },
    quest: {
      title: "Квест",
      scan: "QR сканироватлаш",
      stopScan: "Сканерым чарнаш",
      upload: "Фото/видеом колташ",
      complete: "Этап эртен манаш",
      question: "Тиде тамга могай ойлым ончыктыш?",
      option1: "Еш аралымаш",
      option2: "Корно да кыймыл",
      option3: "Кече да шокшо"
    },
    profile: {
      title: "Профиль",
      lang: "Йылме",
      progress: "Прогресс",
      reward: "Награда"
    }
  }
};

const state = {
  page: "home",
  lang: localStorage.getItem("lang") || "ru",
  completedLevels: JSON.parse(localStorage.getItem("completedLevels") || "[]"),
  uploads: JSON.parse(localStorage.getItem("uploads") || "{}"),
  qrResult: localStorage.getItem("qrResult") || "",
  paymentProvider: localStorage.getItem("paymentProvider") || ""
};

const products = [
  { id: 1, name: "Сумка Калык", price: 1290 },
  { id: 2, name: "Игрушка-оберег", price: 790 },
  { id: 3, name: "Украшение орнамент", price: 1490 }
];

const pageContent = document.getElementById("pageContent");
const navButtons = Array.from(document.querySelectorAll(".nav button"));
const langButtons = Array.from(document.querySelectorAll(".lang-switch button"));

let qrScanner;

function t() {
  return translations[state.lang];
}

function persist() {
  localStorage.setItem("lang", state.lang);
  localStorage.setItem("completedLevels", JSON.stringify(state.completedLevels));
  localStorage.setItem("uploads", JSON.stringify(state.uploads));
  localStorage.setItem("qrResult", state.qrResult);
  localStorage.setItem("paymentProvider", state.paymentProvider);
}

function setPage(page) {
  state.page = page;
  render();
}

function toggleComplete(level) {
  const index = state.completedLevels.indexOf(level);
  if (index >= 0) {
    state.completedLevels.splice(index, 1);
  } else {
    state.completedLevels.push(level);
  }
  persist();
  render();
}

function setPayment(provider) {
  state.paymentProvider = provider;
  persist();
  alert(`${provider} выбран. Здесь подключается API оплаты.`);
}

function calculateReward() {
  const done = state.completedLevels.length;
  if (done === 5) return questScenario.reward[Math.floor(Math.random() * 2)];
  if (done >= 3) return questScenario.reward[2];
  return questScenario.reward[3];
}

function renderHome() {
  const tr = t();
  return `
    <section class="card hero">
      <h2>${tr.home.title}</h2>
      <p>${tr.home.text}</p>
      <div class="hero-buttons">
        <button data-go-shop>${tr.home.buy}</button>
        <button class="secondary" data-go-quest>${tr.home.startQuest}</button>
      </div>
    </section>
  `;
}

function renderShop() {
  const tr = t();
  const items = products
    .map(
      (p) => `
      <article class="product">
        <h3>${p.name}</h3>
        <p>${p.price} ₽</p>
        <span class="badge">${tr.shop.freeHint}</span>
        <div style="margin-top:10px"><button data-buy="${p.id}">${tr.shop.buy}</button></div>
      </article>`
    )
    .join("");

  return `
    <section class="card">
      <h2>${tr.shop.title}</h2>
      <div class="products">${items}</div>
    </section>

    <section class="card">
      <h3>${tr.shop.payTitle}</h3>
      <p>${tr.shop.payDesc}</p>
      <div class="inline">
        <button data-pay="SberPay">${tr.shop.sber}</button>
        <button class="secondary" data-pay="VTB Pay">${tr.shop.vtb}</button>
      </div>
      ${state.paymentProvider ? `<p class="upload-preview">Выбрано: ${state.paymentProvider}</p>` : ""}
    </section>
  `;
}

function renderQuest() {
  const tr = t();
  const progress = Math.round((state.completedLevels.length / questScenario.levels.length) * 100);
  const levels = questScenario.levels
    .map((level) => {
      const checked = state.completedLevels.includes(level.level);
      const uploadName = state.uploads[level.level] || "";
      const questionBlock =
        level.level === 2
          ? `
      <label>${tr.quest.question}
        <select data-answer="${level.level}">
          <option>${tr.quest.option1}</option>
          <option>${tr.quest.option2}</option>
          <option>${tr.quest.option3}</option>
        </select>
      </label>`
          : "";

      return `
      <article class="level-card">
        <h3>${level.level}. ${level.name}</h3>
        <p><strong>${level.description}</strong></p>
        <p>${level.task}</p>
        <p>Подтверждение: ${level.proof}</p>
        ${questionBlock}
        <div class="inline">
          <label>
            ${tr.quest.upload}
            <input type="file" data-upload="${level.level}" ${level.level === 3 ? 'accept="video/*"' : 'accept="image/*,video/*"'}>
          </label>
          <button data-complete="${level.level}">${tr.quest.complete}</button>
        </div>
        ${uploadName ? `<p class="upload-preview">Файл: ${uploadName}</p>` : ""}
        <p class="upload-preview">${checked ? "✅ Уровень отмечен как пройденный" : "⏳ Уровень в процессе"}</p>
      </article>`;
    })
    .join("");

  return `
    <section class="card">
      <h2>${tr.quest.title}</h2>
      <p>Прогресс: ${state.completedLevels.length}/${questScenario.levels.length}</p>
      <div class="progress-wrap"><div class="progress" style="width:${progress}%"></div></div>
      <div class="inline" style="margin-top: 10px">
        <button data-start-qr>${tr.quest.scan}</button>
        <button class="secondary" data-stop-qr>${tr.quest.stopScan}</button>
      </div>
      <div id="reader"></div>
      ${state.qrResult ? `<p class="upload-preview">QR: ${state.qrResult}</p>` : ""}
    </section>
    ${levels}
  `;
}

function renderProfile() {
  const tr = t();
  const reward = calculateReward();
  return `
    <section class="card">
      <h2>${tr.profile.title}</h2>
      <p>${tr.profile.lang}: <strong>${state.lang.toUpperCase()}</strong></p>
      <p>${tr.profile.progress}: <strong>${state.completedLevels.length}/5</strong></p>
      <p>${tr.profile.reward}: <strong>${reward}</strong></p>
    </section>
  `;
}

function bindEvents() {
  document.querySelector("[data-go-shop]")?.addEventListener("click", () => setPage("shop"));
  document.querySelector("[data-go-quest]")?.addEventListener("click", () => setPage("quest"));

  document.querySelectorAll("[data-pay]").forEach((el) => {
    el.addEventListener("click", () => setPayment(el.getAttribute("data-pay")));
  });

  document.querySelectorAll("[data-upload]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const level = e.target.getAttribute("data-upload");
      const file = e.target.files?.[0];
      if (file) {
        state.uploads[level] = file.name;
        persist();
        render();
      }
    });
  });

  document.querySelectorAll("[data-complete]").forEach((btn) => {
    btn.addEventListener("click", () => toggleComplete(Number(btn.getAttribute("data-complete"))));
  });

  document.querySelector("[data-start-qr]")?.addEventListener("click", startQr);
  document.querySelector("[data-stop-qr]")?.addEventListener("click", stopQr);
}

function startQr() {
  if (!window.Html5Qrcode) {
    alert("Библиотека QR недоступна. Проверь подключение к интернету.");
    return;
  }

  if (!qrScanner) {
    qrScanner = new Html5Qrcode("reader");
  }

  qrScanner
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 220 },
      (decodedText) => {
        state.qrResult = decodedText;
        persist();
        render();
        stopQr();
      },
      () => {}
    )
    .catch(() => {
      alert("Не удалось запустить камеру.");
    });
}

function stopQr() {
  if (qrScanner?.isScanning) {
    qrScanner.stop().catch(() => {});
  }
}

function render() {
  const tr = t();
  document.getElementById("brandTitle").textContent = questScenario.title;
  document.getElementById("brandSubtitle").textContent = tr.subtitle;

  navButtons.forEach((button) => {
    const page = button.getAttribute("data-page");
    button.textContent = tr.nav[page];
    button.classList.toggle("secondary", page !== state.page);
    button.onclick = () => setPage(page);
  });

  langButtons.forEach((button) => {
    button.classList.toggle("secondary", button.getAttribute("data-lang") !== state.lang);
    button.onclick = () => {
      state.lang = button.getAttribute("data-lang");
      persist();
      render();
    };
  });

  const pages = {
    home: renderHome,
    shop: renderShop,
    quest: renderQuest,
    profile: renderProfile
  };

  pageContent.innerHTML = pages[state.page]();
  bindEvents();
}

render();
