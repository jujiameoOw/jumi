const themes = {
  pink: {
    bg: "#fff0f5",
    card: "#f3b6ce",
    accent: "#df83aa",
    text: "#a64d79"
  },
  mint: {
    bg: "#effaf5",
    card: "#a8d8c8",
    accent: "#60ad95",
    text: "#397c68"
  },
  blue: {
    bg: "#eff4ff",
    card: "#b8c9f5",
    accent: "#809ce8",
    text: "#526cb2"
  },
  purple: {
    bg: "#f7f0ff",
    card: "#d0b5f0",
    accent: "#aa83dc",
    text: "#8058ae"
  },
  yellow: {
    bg: "#fff8e8",
    card: "#f2c77c",
    accent: "#d9a33f",
    text: "#9a7027"
  }
};

const animals = [
  "🐰", "🐱", "🦌", "🐻", "🐸", "🐼",
  "🦊", "🐧", "🐹", "🐨", "🐯", "🐮",
  "🐷", "🐵", "🐣", "🦋", "🐙", "🐢"
];

let selectedTheme = "pink";
let selectedLevel = "easy";
let totalPairs = 8;

let firstCard = null;
let secondCard = null;
let moves = 0;
let matched = 0;
let seconds = 0;
let locked = false;
let started = false;
let timer = null;
let gameId = 0;

function showPage(pageId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");

  if (pageId !== "gameScreen") {
    clearInterval(timer);
    gameId++;
  }
}

function setTheme(name) {
  selectedTheme = name;
  const theme = themes[name];

  for (const key in theme) {
    document.documentElement.style.setProperty(
      "--" + key, theme[key]
    );
  }

  document.querySelectorAll(".swatch").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.theme === name
    );
  });

  document.getElementById("colorName").textContent =
    name.charAt(0).toUpperCase() + name.slice(1) + " theme ♡";
}

document.querySelectorAll(".swatch").forEach(button => {
  button.addEventListener("click", () => {
    setTheme(button.dataset.theme);
  });
});

document.querySelectorAll(".difficulty-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedLevel = button.dataset.level;

    document.querySelectorAll(".difficulty-option")
      .forEach(option => {
        option.classList.toggle(
          "selected",
          option === button
        );
      });
  });
});

function startGame() {
  clearInterval(timer);
  gameId++;

  const thisGame = gameId;

  totalPairs = {
    easy: 8,
    normal: 12,
    hard: 18
  }[selectedLevel];

  firstCard = null;
  secondCard = null;
  moves = 0;
  matched = 0;
  seconds = 0;
  locked = false;
  started = false;

  document.getElementById("moves").textContent = "0";
  document.getElementById("time").textContent = "0";
  document.getElementById("message").textContent = "";

  const game = document.getElementById("game");
  game.innerHTML = "";

  const chosenAnimals = animals.slice(0, totalPairs);
  const deck = [...chosenAnimals, ...chosenAnimals];

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const columns = totalPairs === 8 ? 4 : 6;

  game.style.gridTemplateColumns =
    `repeat(${columns}, minmax(0, 1fr))`;

  deck.forEach(emoji => {
    const card = document.createElement("button");

    card.className = "card";
    card.textContent = "?";
    card.dataset.emoji = emoji;
    card.setAttribute("aria-label", "Hidden card");

    card.addEventListener("click", () => {
      flipCard(card, thisGame);
    });

    game.appendChild(card);
  });

  showPage("gameScreen");
}

function flipCard(card, thisGame) {
  if (
    thisGame !== gameId ||
    locked ||
    card.classList.contains("open") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  if (!started) {
    started = true;

    timer = setInterval(() => {
      seconds++;
      document.getElementById("time").textContent = seconds;
    }, 1000);
  }

  card.textContent = card.dataset.emoji;
  card.classList.add("open");

  if (firstCard === null) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  document.getElementById("moves").textContent = moves;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.disabled = true;
    secondCard.disabled = true;

    matched += 2;
    firstCard = null;
    secondCard = null;

    if (matched === totalPairs * 2) {
      clearInterval(timer);

      document.getElementById("message").textContent =
        `You win! ♡ ${moves} moves · ${seconds} seconds!`;
    }
  } else {
    locked = true;

    const oldFirst = firstCard;
    const oldSecond = secondCard;

    setTimeout(() => {
      if (thisGame !== gameId) return;

      oldFirst.textContent = "?";
      oldSecond.textContent = "?";

      oldFirst.classList.remove("open");
      oldSecond.classList.remove("open");

      firstCard = null;
      secondCard = null;
      locked = false;
    }, 800);
  }
}

setTheme("pink");