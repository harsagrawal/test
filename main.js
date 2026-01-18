/* ======================================================
   CONFIGURATION
====================================================== */

const CONFIG = {
  gravity: 0.6,
  floorY: 250,
  rotationSpeed: 0.4,
  drag: 0.99,

  words: {
    "CREATIVE": {
      color: "#E11D48",
      url: "branding.html"
    },
    "BRAND IDENTITY": {
      color: "#0284C7",
      url: "logo.html"
    },
    "PRINT & PACKAGING": {
      color: "#D97706",
      url: "branding.html"
    }
    
  }
};


/* ======================================================
   STATE
====================================================== */

const state = {
  mode: "BUILD",          // BUILD | BREAK | REBUILD
  word: "CREATIVE",
  rotationY: 0,
  particles: [],
  rebuildStart: 0
};


/* ======================================================
   DOM CACHE
====================================================== */

const els = {
  sceneRoot: document.getElementById("scene-root"),
  mainWord: document.getElementById("main-word"),
  particleSystem: document.getElementById("particle-system"),

  btnBreak: document.getElementById("btn-break"),
  rebuildMenu: document.getElementById("rebuild-menu"),
  statusMsg: document.getElementById("status-msg"),
  themeToggle: document.getElementById("theme-toggle"),

  debugRot: document.getElementById("debug-rot"),
  debugMode: document.getElementById("debug-mode"),

  optionBtns: document.querySelectorAll(".btn-option")
};


/* ======================================================
   INIT
====================================================== */

function init() {
  updateWordVisuals();
  bindEvents();
  requestAnimationFrame(loop);
}


/* ======================================================
   EVENTS
====================================================== */

function bindEvents() {
  els.btnBreak.addEventListener("click", startBreakMode);
  els.themeToggle.addEventListener("click", toggleTheme);
  els.mainWord.addEventListener("click", handleWordClick);

  els.optionBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      startRebuildMode(e.currentTarget.dataset.word);
    });
  });
}


/* ======================================================
   MAIN LOOP
====================================================== */

function loop(t) {
  updateRotation();
  updateDebug();

  if (state.mode === "BREAK") updatePhysics();
  if (state.mode === "REBUILD") updateRebuild(t);

  requestAnimationFrame(loop);
}


/* ======================================================
   ROTATION + DEBUG
====================================================== */

function updateRotation() {
  state.rotationY +=
    state.mode === "BUILD"
      ? CONFIG.rotationSpeed
      : CONFIG.rotationSpeed * 0.2;

  els.sceneRoot.style.transform = `rotateY(${-state.rotationY}deg)`;
}

function updateDebug() {
  els.debugRot.textContent = Math.round(state.rotationY);
  els.debugMode.textContent = state.mode;
}


/* ======================================================
   PHYSICS (BREAK MODE)
====================================================== */

function updatePhysics() {
  state.particles.forEach(p => {
    if (p.grounded) return;

    p.vy += CONFIG.gravity;

    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    p.rx += p.vrx;
    p.ry += p.vry;
    p.rz += p.vrz;

    p.vx *= CONFIG.drag;
    p.vy *= CONFIG.drag;
    p.vz *= CONFIG.drag;

    if (p.y >= CONFIG.floorY) {
      p.y = CONFIG.floorY;
      p.grounded = true;
    }

    p.el.style.transform = `
      translate3d(${p.x}px, ${p.y}px, ${p.z}px)
      rotateX(${p.rx}deg)
      rotateY(${p.ry}deg)
      rotateZ(${p.rz}deg)
    `;
  });
}


/* ======================================================
   REBUILD
====================================================== */

function updateRebuild(t) {
  if (!state.rebuildStart) state.rebuildStart = t;

  const progress = (t - state.rebuildStart) / 1500;
  if (progress >= 1) return finishRebuild();

  const ease = 1 - Math.pow(2, -10 * progress);

  state.particles.forEach(p => {
    if (!p.startX) {
      p.startX = p.x;
      p.startY = p.y;
      p.startZ = p.z;
      p.startRx = p.rx;
      p.startRy = p.ry;
      p.startRz = p.rz;
    }

    const f = 1 - ease;

    p.el.style.transform = `
      translate3d(${p.startX * f}px, ${p.startY * f}px, ${p.startZ * f}px)
      rotateX(${p.startRx * f}deg)
      rotateY(${p.startRy * f}deg)
      rotateZ(${p.startRz * f}deg)
    `;

    if (progress > 0.8) {
      p.el.style.opacity = 1 - (progress - 0.8) * 5;
    }
  });
}


/* ======================================================
   ACTIONS
====================================================== */

function startBreakMode() {
  if (state.mode !== "BUILD") return;

  state.mode = "BREAK";

  els.mainWord.style.opacity = 0;
  els.mainWord.style.pointerEvents = "none";
  els.btnBreak.classList.add("hidden");

  createParticles();

  setTimeout(() => {
    els.rebuildMenu.classList.remove("hidden");
  }, 800);
}

function startRebuildMode(word) {
  if (!CONFIG.words[word]) return;

  state.word = word;
  state.mode = "REBUILD";
  state.rebuildStart = 0;

  els.rebuildMenu.classList.add("hidden");
  els.statusMsg.classList.remove("hidden");

  updateWordVisuals();
}

function finishRebuild() {
  state.mode = "BUILD";

  els.particleSystem.innerHTML = "";
  state.particles = [];

  els.mainWord.textContent = state.word;
  els.mainWord.style.opacity = 1;
  els.mainWord.style.pointerEvents = "auto";

  els.statusMsg.classList.add("hidden");
  els.btnBreak.classList.remove("hidden");
}


/* ======================================================
   PARTICLES
====================================================== */

function createParticles() {
  const count = 400;
  const color = CONFIG.words[state.word].color;

  els.particleSystem.innerHTML = "";
  state.particles = [];

  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";

    const size = 4 + Math.random() * 10;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.background = color;
    el.style.boxShadow = `0 0 5px ${color}`;

    const x = (Math.random() - 0.5) * 500;
    const y = (Math.random() - 0.5) * 100;

    frag.appendChild(el);

    state.particles.push({
      el,
      x,
      y,
      z: 0,

      vx: (Math.random() - 0.5) * 40,
      vy: Math.random() * -30 - 5,
      vz: (Math.random() - 0.5) * 40,

      vrx: (Math.random() - 0.5) * 20,
      vry: (Math.random() - 0.5) * 20,
      vrz: (Math.random() - 0.5) * 20,

      rx: 0,
      ry: 0,
      rz: 0,

      grounded: false
    });
  }

  els.particleSystem.appendChild(frag);
}


/* ======================================================
   HELPERS
====================================================== */

function updateWordVisuals() {
  const data = CONFIG.words[state.word];
  if (!data) return;

  document.documentElement.style.setProperty("--accent-color", data.color);
  els.mainWord.textContent = state.word;
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
}

function handleWordClick() {
  if (state.mode !== "BUILD") return;

  const data = CONFIG.words[state.word];
  if (data && data.url) {
    location.href = data.url;
  }
}


/* ======================================================
   START
====================================================== */

init();
