// === DOM REFERENCES ===
const trailblazeContent = document.getElementById("trailblaze-content");
const titleEl = document.getElementById("scene-title");
const imageEl = document.getElementById("scene-image");
const textBox = document.getElementById("scene-text");

const trailblazeButton = document.getElementById("trailblaze");
const interactButton = document.getElementById("interacted");
const restButton = document.getElementById("rested");

// === GAME STATE VARIABLES ===
let currentLevel = 0;
let currentEvent = null;
let rose1Found = false;
let rose2Found = false;
let gameOver = false;
let levelStarted = false;
let lastEventId = null;

// === LEVEL INTRO SCENES ===
const levelIntros = {
  1: {
    name: "The Timeless Station",
    text: "Lush wildlife taken over what once was a bustling crossroads.",
    image: "images/gameimages/station.png"
  },
  2: {
    name: "A Crossroads",
    text: "Silence grows, as a nexus to many paths lies before you.",
    image: "images/gameimages/intersetion.png"
  },
  3: {
    name: "Twilight Crossing",
    text: "Shadows stretch, and strange shapes move betwixt the stars.",
    image: "images/gameimages/path.png"
  },
  4: {
    name: "The Forgotten",
    text: "You descend into mist and memories... Are they yours?",
    image: "images/gameimages/train.png"
  },
  5: {
    name: "The Lost Gate",
    text: "All paths seem to lead here... What's so special about this place?",
    image: "images/gameimages/lost.png"
  }
};

// === RANDOM EVENTS ===
const earlyEvents = [
  { id: 1, name: "Rosenclad Clearing", text: "A quiet clearing holds a soft glow, with a single red rose come into focus.", image: "images/gameimages/rose1.png", originalHasRose: true, hasRose: true, isBadEnd: false },
  { id: 2, name: "Bookish Sidepath", text: "A door opens to a homey, inviting staircase.", image: "images/gameimages/bookstair.png", originalHasRose: false, hasRose: false, isBadEnd: false },
  { id: 3, name: "Static Meadow", text: "A cracked screen greets you before static absolves you, this dream ending.", image: "images/gameimages/borken.png", originalHasRose: false, hasRose: false, isBadEnd: true },
  { id: 4, name: "???", text: "Are you Lost?", image: "images/gameimages/lost.png", originalHasRose: false, hasRose: false, isBadEnd: false }
];

const midEvents = [
  { id: 5, name: "Moonlit Roses", text: "Stone faces watch you as a rose glimmers in the moonlight.", image: "images/gameimages/rose2.png", originalHasRose: true, hasRose: true, isBadEnd: false },
  { id: 6, name: "Cursed Lake", text: "You see your reflection vanish, and become one with the murky depths.", image: "images/gameimages/seawater.png", originalHasRose: false, hasRose: false, isBadEnd: true },
  { id: 7, name: "Woodland Trainyard", text: "You walk the train-tracks, long powered down vessels await.", image: "images/gameimages/traincar.png", originalHasRose: false, hasRose: false, isBadEnd: false },
  { id: 8, name: "Blue Screen Wilds", text: "More screens await you, with a low hum filling your ears.", image: "images/gameimages/screens.png", originalHasRose: false, hasRose: false, isBadEnd: false }
];

// === RENDERING ===
function renderScene(title, text, imagePath) {
  fadeTransition(() => {
    titleEl.textContent = title;
    imageEl.src = imagePath;
    imageEl.alt = title;
    typeWriter(text, textBox);
  });
}

// === GET RANDOM EVENT (avoiding immediate repeat) ===
function getRandomEvent() {
  const pool = (currentLevel <= 2) ? earlyEvents : midEvents;
  let event;
  let attempts = 0;

  do {
    event = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  } while (event.id === lastEventId && attempts < 10); // retry max 10 times

  lastEventId = event.id;
  return event;
}

// === GAME FUNCTIONS ===
function showLevelIntro() {
  const intro = levelIntros[currentLevel];
  fadeTransition(() => {
    titleEl.textContent = intro.name;
    imageEl.src = intro.image;
    imageEl.alt = intro.name;

    const combinedText = `${intro.text}\n\n(You’ve reached a new area. Try getting some rest to explore!)`;

    // Typewriter will run first, THEN we mark the level as started
    typeWriter(combinedText, textBox, 30, () => {
      levelStarted = true;
    });
  });
}

function triggerEvent() {
  if (gameOver || !levelStarted) return;

  currentEvent = getRandomEvent();

  fadeTransition(() => {
    titleEl.textContent = currentEvent.name;
    imageEl.src = currentEvent.image;
    imageEl.alt = currentEvent.name;

    // First type the main event text
    typeWriter(currentEvent.text, textBox, 30, () => {
      // After typewriter finishes, check for bad end and append message
      if (currentEvent.isBadEnd) {
        gameOver = true;
        textBox.innerHTML += `<p>\n\nA perilous end... Would you like to try again? :) \n(Press any button to restart.)</p>`;
      }
    });
  });
}

function advanceLevel() {
  currentLevel++;
  levelStarted = false;
  currentEvent = null;

  if (currentLevel > 5) {
    if (rose1Found && rose2Found) {
      showFinalEnding();
    } else {
      showBadEnding();
    }
    return;
  }

  showLevelIntro(); // Just intro — no random event
}

function interact() {
  if (!currentEvent || gameOver) return;

  let message = "";

  if (currentEvent.hasRose) {
    if (currentLevel <= 2) rose1Found = true;
    else if (currentLevel <= 4) rose2Found = true;

    message = "(You gently pick up the rose!)";
    currentEvent.hasRose = false;
    updateRoseIcons();
  } else {
    message = "(There’s nothing special here...)";
  }

  typeWriter(message, textBox);
}

function rest() {
  if (gameOver || currentLevel === 0 || !levelStarted) return;

  triggerEvent(); // Triggers random event at the current level
}

function showBadEnding() {
  renderScene("A Dead End...", "You wander aimlessly, empty-handed. Harrowed by your journey, you rest one more time as time absolves you. There are no more options. . .\n G A M E O V E R \n\n(Press any button to restart.)", "images/gameimages/bad_end.png");
  gameOver = true;
}

function showFinalEnding() {
  renderScene("The Secret Garden That is Time", "With both roses in hand, time unravels before you. It's beautiful. Your hunt is over, and you find solace in a journey now ended. \n\n(Press any button to restart.)", "images/gameimages/ending.png");
  gameOver = true;
}

function resetGame() {
  currentLevel = 0;
  rose1Found = false;
  rose2Found = false;
  gameOver = false;
  levelStarted = false;
  currentEvent = null;
  lastEventId = null;
  resetRoseEvents();
  updateRoseIcons();
  renderScene("Welcome to Trailblazer", "Click Trailblaze to begin your journey, dreamer.", "images/gameimages/sky.png");
}

// === FUNCTIONALITY FUNCTIONS ===
function disableButtons() {
  trailblazeButton.disabled = true;
  interactButton.disabled = true;
  restButton.disabled = true;
}

function enableButtons() {
  trailblazeButton.disabled = false;
  interactButton.disabled = false;
  restButton.disabled = false;
}

function typeWriter(text, container, speed = 30, callback = () => {}) {
  container.innerHTML = "";
  disableButtons();
  let i = 0;

  function type() {
    if (i < text.length) {
      let char = text.charAt(i);
      if (char === "\n") {
        container.innerHTML += "<br>";
      } else {
        container.innerHTML += char;
      }
      i++;
      setTimeout(type, speed);
    } else {
      enableButtons();
      callback();
    }
  }

  type();
}


function fadeTransition(callback) {
  const container = document.getElementById("trailblaze-content");
  container.classList.add("fade-out");

  setTimeout(() => {
    callback();
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
  }, 500); // fade duration
}

function updateRoseIcons() {
  const rose1 = document.getElementById("rose1-icon");
  const rose2 = document.getElementById("rose2-icon");

  // Rose 1: redrose.png if collected, fadedrose.png if not
  rose1.src = rose1Found ? "images/gameimages/redrose.png" : "images/gameimages/fadedrose.png";

  // Rose 2: bluerose.png if collected, fadedrose.png if not
  rose2.src = rose2Found ? "images/gameimages/bluerose.png" : "images/gameimages/fadedrose.png";
}

function resetRoseEvents() {
  earlyEvents.forEach(event => {
    if (event.hasOwnProperty("originalHasRose")) {
      event.hasRose = event.originalHasRose;
    }
  });

  midEvents.forEach(event => {
    if (event.hasOwnProperty("originalHasRose")) {
      event.hasRose = event.originalHasRose;
    }
  });
}

// === BUTTON EVENT LISTENERS ===
trailblazeButton.addEventListener("click", () => {
  if (gameOver) return resetGame();
  levelStarted = false;
  advanceLevel();
});

interactButton.addEventListener("click", () => {
  if (gameOver) return resetGame();
  interact();
});

restButton.addEventListener("click", () => {
  if (gameOver) return resetGame();
  rest();
});

// === INITIALIZE GAME ===
resetGame();