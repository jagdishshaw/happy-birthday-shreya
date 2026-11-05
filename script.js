/**
 * Unified Celebration Engine for Shreya's Birthday
 * Combines:
 * 1. Retro Postcard Stage (Kristina Ooo Hero, 3D Parallax, GSAP, Audio FX, Wishes Modal)
 * 2. Celebration Dashboard (Photo Gallery, Violin Synthesizer, Floating Hearts, Rishi Companion)
 */

// ==========================================================================
// 1. Permitted Dashboard 10-Color Palette
// ==========================================================================
const PALETTE_COLORS = [
  "#cdb4db", // thistle
  "#ffc8dd", // pastel-petal
  "#ffafcc", // baby-pink
  "#bde0fe", // icy-blue
  "#a2d2ff", // sky-blue
  "#ffffff"
];

// ==========================================================================
// 2. Shared Web Audio Context & Synthesizers
// ==========================================================================
let sharedAudioCtx = null;
let soundFxEnabled = true;

function getAudioContext() {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

// Auto-unlock Web Audio on user gesture
['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => {
    getAudioContext();
  }, { once: true });
});

// Synthesized Retro Sound Effects (Pure Web Audio API)
const soundFx = {
  celebrate() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major chord
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 1.25);
        } catch (e) { }
      }, idx * 80);
    });
  },

  partyPopper() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    try {
      const snapLen = Math.floor(ctx.sampleRate * 0.05);
      const snapBuffer = ctx.createBuffer(1, snapLen, ctx.sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
      }
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'highpass';
      snapFilter.frequency.setValueAtTime(1400, now);

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.85, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapSource.start(now);

      const thumpOsc = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thumpOsc.type = 'sine';
      thumpOsc.frequency.setValueAtTime(180, now);
      thumpOsc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

      thumpGain.gain.setValueAtTime(0.65, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      thumpOsc.connect(thumpGain);
      thumpGain.connect(ctx.destination);
      thumpOsc.start(now);
      thumpOsc.stop(now + 0.19);
    } catch (e) { }
  },

  fizz() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.6);
    } catch (e) { }
  },

  boxTap() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) { }
  },

  whoosh() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } catch (e) { }
  },

  chime() {
    if (!soundFxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { }
  }
};

// ==========================================================================
// 3. Violin Melody Synthesizer (Classical Birthday Serenade)
// ==========================================================================
let isViolinPlaying = false;
let violinSequenceTimeout = null;

const violinMelody = [
  { note: 293.66, duration: 0.4 }, // D4
  { note: 293.66, duration: 0.4 }, // D4
  { note: 329.63, duration: 0.8 }, // E4
  { note: 293.66, duration: 0.8 }, // D4
  { note: 392.00, duration: 0.8 }, // G4
  { note: 369.99, duration: 1.2 }, // F#4

  { note: 293.66, duration: 0.4 }, // D4
  { note: 293.66, duration: 0.4 }, // D4
  { note: 329.63, duration: 0.8 }, // E4
  { note: 293.66, duration: 0.8 }, // D4
  { note: 440.00, duration: 0.8 }, // A4
  { note: 392.00, duration: 1.2 }, // G4

  { note: 293.66, duration: 0.4 }, // D4
  { note: 293.66, duration: 0.4 }, // D4
  { note: 587.33, duration: 0.8 }, // D5
  { note: 493.88, duration: 0.8 }, // B4
  { note: 392.00, duration: 0.8 }, // G4
  { note: 369.99, duration: 0.8 }, // F#4
  { note: 329.63, duration: 1.2 }, // E4

  { note: 523.25, duration: 0.4 }, // C5
  { note: 523.25, duration: 0.4 }, // C5
  { note: 493.88, duration: 0.8 }, // B4
  { note: 392.00, duration: 0.8 }, // G4
  { note: 440.00, duration: 0.8 }, // A4
  { note: 392.00, duration: 1.6 }  // G4
];

function playViolinNote(freq, duration) {
  const ctx = getAudioContext();
  if (!ctx || !isViolinPlaying) return;

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, now);

  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(5.5, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(freq * 0.015, now);
  lfo.connect(osc.frequency);
  lfo.start(now);

  const subOsc = ctx.createOscillator();
  subOsc.type = "triangle";
  subOsc.frequency.setValueAtTime(freq, now);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1750, now);
  filter.Q.setValueAtTime(2.8, now);

  const noteGain = ctx.createGain();
  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(0.16, now + 0.1);
  noteGain.gain.exponentialRampToValueAtTime(0.11, now + duration * 0.7);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(filter);
  subOsc.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(ctx.destination);

  osc.start(now);
  subOsc.start(now);

  osc.stop(now + duration);
  subOsc.stop(now + duration);
  lfo.stop(now + duration);
}

function startViolinMelody() {
  getAudioContext();
  isViolinPlaying = true;
  let noteIndex = 0;

  function scheduleNextNote() {
    if (!isViolinPlaying) return;
    const current = violinMelody[noteIndex];
    playViolinNote(current.note, current.duration);

    noteIndex = (noteIndex + 1) % violinMelody.length;
    const pauseTime = noteIndex === 0 ? 1100 : 80;
    violinSequenceTimeout = setTimeout(scheduleNextNote, current.duration * 1000 + pauseTime);
  }

  scheduleNextNote();
}

function stopViolinMelody() {
  isViolinPlaying = false;
  if (violinSequenceTimeout) {
    clearTimeout(violinSequenceTimeout);
    violinSequenceTimeout = null;
  }
}

function toggleViolinMusic() {
  const musicBtn = document.getElementById("musicBtn");
  if (!isViolinPlaying) {
    startViolinMelody();
    if (musicBtn) {
      musicBtn.textContent = "🔊";
      musicBtn.setAttribute("title", "Mute Violin Music");
      musicBtn.style.transform = "rotate(12deg) scale(1.08)";
    }
  } else {
    stopViolinMelody();
    if (musicBtn) {
      musicBtn.textContent = "🎻";
      musicBtn.setAttribute("title", "Play Violin Music");
      musicBtn.style.transform = "";
    }
  }
}

// ==========================================================================
// 4. Confetti & Celebration Visual Effects
// ==========================================================================
function fireConfetti(originX = 0.5, originY = 0.5) {
  if (typeof confetti === 'function') {
    const colors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#ffffff'];
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { x: originX, y: originY },
      colors: colors,
      disableForReducedMotion: true
    });
  }
}

function fireCelebrationStorm() {
  if (typeof confetti !== 'function') return;
  const colors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#ffffff'];

  // Left cannon
  confetti({
    particleCount: 65,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: colors
  });

  // Right cannon
  confetti({
    particleCount: 65,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: colors
  });

  // Center starburst
  setTimeout(() => {
    confetti({
      particleCount: 110,
      spread: 120,
      origin: { x: 0.5, y: 0.4 },
      colors: colors
    });
  }, 180);
}

function createFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "float-heart";
  heart.textContent = "♥";

  const warmColors = ["#ffafcc", "#ffc8dd", "#cdb4db", "#bde0fe", "#a2d2ff"];
  heart.style.color = warmColors[Math.floor(Math.random() * warmColors.length)];

  const offsetX = Math.random() * 80 - 40;
  heart.style.left = `${x + offsetX}px`;
  heart.style.top = `${y}px`;
  heart.style.animationDuration = `${2.2 + Math.random() * 1.2}s`;

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 3400);
}

function heartBurst(count = 18) {
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.55;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      createFloatingHeart(startX, startY);
    }, i * 65);
  }
}

function triggerFullCelebration() {
  let overlay = document.getElementById("celebrationOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "celebrationOverlay";
    overlay.className = "celebration-overlay";
    document.body.appendChild(overlay);
  }

  const symbols = ["♥", "★", "✦", "++", "*", "♥", "★"];
  const totalItems = 75;

  for (let i = 0; i < totalItems; i++) {
    const item = document.createElement("div");
    item.className = "celebration-item";
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.color = PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)];

    const leftPos = Math.random() * 96;
    const fontSize = (Math.random() * 1.8 + 1.2).toFixed(2);
    const duration = (Math.random() * 2.2 + 2.8).toFixed(2);
    const delay = (Math.random() * 1.5).toFixed(2);
    const sway = (Math.random() * 80 - 40).toFixed(0);
    const rot = (Math.random() * 720 - 360).toFixed(0);

    item.style.left = `${leftPos}vw`;
    item.style.fontSize = `${fontSize}rem`;
    item.style.setProperty("--duration", `${duration}s`);
    item.style.setProperty("--delay", `${delay}s`);
    item.style.setProperty("--sway", `${sway}px`);
    item.style.setProperty("--rot", `${rot}deg`);

    overlay.appendChild(item);

    const totalTimeMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 300;
    setTimeout(() => item.remove(), totalTimeMs);
  }
}

// ==========================================================================
// 5. Photo Slot Loader (20 Independent Slots)
// ==========================================================================
function initPhotoSlots() {
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    const img = card.querySelector(".photo-img");
    const placeholder = card.querySelector(".photo-placeholder");
    if (!img) return;

    img.addEventListener("load", () => {
      card.classList.add("has-photo");
    });

    img.addEventListener("error", () => {
      card.classList.remove("has-photo");
      if (placeholder) placeholder.textContent = "++";
    });

    if (img.complete) {
      if (img.naturalWidth > 0) {
        card.classList.add("has-photo");
      } else {
        card.classList.remove("has-photo");
      }
    }
  });
}

// ==========================================================================
// 6. Interactive Character Companion Engine (Rishi)
// ==========================================================================
function makeCharacterTransparent(img) {
  if (!img || img.dataset.processedTransparent) return;

  function process() {
    try {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const visited = new Uint8Array(w * h);
      const queue = [];

      function isBgPixel(idx) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        return (minVal >= 185 && (maxVal - minVal) <= 18);
      }

      for (let x = 0; x < w; x++) {
        const topIdx = x * 4;
        if (isBgPixel(topIdx)) {
          visited[x] = 1;
          queue.push(x, 0);
        }
        const btmPos = (h - 1) * w + x;
        const btmIdx = btmPos * 4;
        if (isBgPixel(btmIdx)) {
          visited[btmPos] = 1;
          queue.push(x, h - 1);
        }
      }

      for (let y = 0; y < h; y++) {
        const lPos = y * w;
        const lIdx = lPos * 4;
        if (isBgPixel(lIdx) && !visited[lPos]) {
          visited[lPos] = 1;
          queue.push(0, y);
        }
        const rPos = y * w + (w - 1);
        const rIdx = rPos * 4;
        if (isBgPixel(rIdx) && !visited[rPos]) {
          visited[rPos] = 1;
          queue.push(w - 1, y);
        }
      }

      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const cIdx = (cy * w + cx) * 4;
        data[cIdx + 3] = 0;

        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1]
        ];

        for (let i = 0; i < 4; i++) {
          const nx = neighbors[i][0];
          const ny = neighbors[i][1];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nPos = ny * w + nx;
            if (!visited[nPos]) {
              visited[nPos] = 1;
              const nIdx = nPos * 4;
              if (isBgPixel(nIdx)) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      img.dataset.processedTransparent = "true";
      img.src = canvas.toDataURL("image/png");
    } catch (err) {
      console.warn("Canvas background processing skipped:", err);
    }
  }

  if (img.complete && img.naturalWidth > 0) {
    process();
  } else {
    img.addEventListener("load", process, { once: true });
  }
}

class CharacterEngine {
  constructor() {
    this.companion = document.getElementById("characterCompanion");
    this.inner = document.getElementById("characterInner");
    this.img = document.getElementById("characterImg");
    this.bubble = document.getElementById("characterBubble");
    this.sparkleBox = document.getElementById("characterSparkleBox");

    if (!this.companion || !this.img) return;

    makeCharacterTransparent(this.img);

    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.mode = this.reducedMotion ? "reduced" : "full";

    this.state = "idle";
    this.facingLeft = false;
    this.currentX = 0;
    this.currentY = 0;
    this.actionTimer = null;
    this.bubbleTimer = null;
    this.isPaused = false;
    this.isInteracting = false;
    this.palette = PALETTE_COLORS;

    this.dialogue = [
      "Peek-a-boo! ✨",
      "Happy Birthday Shreya! 🎂",
      "Hehe! ♥",
      "Wheee! 🎉",
      "Catch me!",
      "✦ Magical moments!",
      "Boing!",
      "Shh... surprise! 🎁",
      "Yay!",
      "Cheers to you! 🥂"
    ];

    this.init();
  }

  init() {
    try {
      const rect = this.companion.getBoundingClientRect();
      this.currentX = rect.left;
      this.currentY = rect.top;

      this.companion.style.bottom = "auto";
      this.companion.style.right = "auto";
      this.companion.style.left = `${this.currentX}px`;
      this.companion.style.top = `${this.currentY}px`;

      this.setAnim("anim-idle");
      this.bindEvents();

      if (this.mode === "full") {
        this.scheduleNextAction(2500);
      }
    } catch (err) {
      console.error("Character init error:", err);
      this.fallbackToStatic();
    }
  }

  fallbackToStatic() {
    if (this.actionTimer) clearTimeout(this.actionTimer);
    if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
    if (this.companion) {
      this.companion.className = "character-companion";
      this.companion.style.left = "";
      this.companion.style.top = "";
      this.companion.style.bottom = "24px";
      this.companion.style.right = "28px";
    }
  }

  bindEvents() {
    this.companion.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleUserClick();
    });

    let lastMoveTime = 0;
    window.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastMoveTime < 60) return;
      lastMoveTime = now;
      this.handleProximity(e.clientX, e.clientY);
    }, { passive: true });

    document.querySelectorAll(".playful-target").forEach((target) => {
      target.addEventListener("click", (e) => {
        e.stopPropagation();
        this.respondToTargetClick(target);
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.isPaused = true;
        if (this.actionTimer) clearTimeout(this.actionTimer);
      } else {
        this.isPaused = false;
        if (this.mode === "full" && this.state === "idle") {
          this.scheduleNextAction(1500);
        }
      }
    });

    window.addEventListener("resize", () => {
      this.clampWithinViewport();
    });
  }

  setAnim(animClass) {
    if (!this.inner) return;
    this.inner.classList.remove("anim-idle", "anim-walk", "anim-hop", "anim-sneak", "anim-peek", "anim-nudge", "anim-spin");
    if (animClass && !this.reducedMotion) {
      this.inner.classList.add(animClass);
    }
  }

  setFacing(isLeft) {
    this.facingLeft = isLeft;
    if (!this.inner) return;
    this.inner.style.transform = isLeft ? "scaleX(-1)" : "scaleX(1)";
  }

  say(text, duration = 1800) {
    if (!this.bubble) return;
    if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
    this.bubble.textContent = text;
    this.bubble.classList.add("active");
    this.bubbleTimer = setTimeout(() => {
      this.bubble.classList.remove("active");
    }, duration);
  }

  clampWithinViewport() {
    const isMobile = window.innerWidth < 650;
    const width = this.companion.offsetWidth || (isMobile ? 58 : 80);
    const height = this.companion.offsetHeight || (isMobile ? 70 : 95);
    const pad = 16;

    const maxX = window.innerWidth - width - pad;
    const maxY = window.innerHeight - height - pad;

    this.currentX = Math.min(Math.max(this.currentX, pad), Math.max(maxX, pad));
    this.currentY = Math.min(Math.max(this.currentY, pad), Math.max(maxY, pad));

    this.companion.style.left = `${this.currentX}px`;
    this.companion.style.top = `${this.currentY}px`;
  }

  scheduleNextAction(delayMs = 3000) {
    if (this.reducedMotion || this.isPaused || this.isInteracting) return;
    if (this.actionTimer) clearTimeout(this.actionTimer);

    this.actionTimer = setTimeout(() => {
      this.executeRandomAction();
    }, delayMs);
  }

  executeRandomAction() {
    if (this.reducedMotion || this.isPaused || this.isInteracting) return;

    const actions = ["walk", "hop", "saySomething", "sneak", "idlePeek"];
    const chosen = actions[Math.floor(Math.random() * actions.length)];

    switch (chosen) {
      case "walk":
        this.actionWalkRandom();
        break;
      case "hop":
        this.actionHopInPlace();
        break;
      case "saySomething":
        this.actionSayRandom();
        break;
      case "sneak":
        this.actionSneakMove();
        break;
      default:
        this.actionPeek();
        break;
    }
  }

  actionWalkRandom() {
    this.state = "walking";
    this.setAnim("anim-walk");

    const pad = 24;
    const isMobile = window.innerWidth < 650;
    const charW = isMobile ? 58 : 80;
    const charH = isMobile ? 70 : 95;

    const maxDelta = isMobile ? 120 : 220;
    const targetX = Math.min(Math.max(this.currentX + (Math.random() - 0.5) * maxDelta, pad), window.innerWidth - charW - pad);
    const targetY = Math.min(Math.max(this.currentY + (Math.random() - 0.5) * (maxDelta * 0.7), pad), window.innerHeight - charH - pad);

    this.setFacing(targetX < this.currentX);

    const dist = Math.hypot(targetX - this.currentX, targetY - this.currentY);
    const durationSec = Math.max(0.7, dist / 150);

    this.companion.style.transition = `left ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1), top ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1)`;
    this.companion.style.left = `${targetX}px`;
    this.companion.style.top = `${targetY}px`;

    this.currentX = targetX;
    this.currentY = targetY;

    setTimeout(() => {
      this.companion.style.transition = "";
      this.state = "idle";
      this.setAnim("anim-idle");
      this.scheduleNextAction(3000 + Math.random() * 2500);
    }, durationSec * 1000);
  }

  actionHopInPlace() {
    this.state = "hopping";
    this.setAnim("anim-hop");
    soundFx.chime();
    this.emitCharacterSparkles();

    setTimeout(() => {
      this.state = "idle";
      this.setAnim("anim-idle");
      this.scheduleNextAction(2500 + Math.random() * 2000);
    }, 700);
  }

  actionSayRandom() {
    const text = this.dialogue[Math.floor(Math.random() * this.dialogue.length)];
    this.say(text, 1900);
    this.scheduleNextAction(3200 + Math.random() * 2000);
  }

  actionSneakMove() {
    this.state = "sneaking";
    this.setAnim("anim-sneak");

    const moveRight = Math.random() > 0.5;
    const shift = (moveRight ? 1 : -1) * 60;
    const targetX = Math.min(Math.max(this.currentX + shift, 20), window.innerWidth - 100);

    this.setFacing(!moveRight);
    this.companion.style.transition = "left 1.2s ease-in-out";
    this.companion.style.left = `${targetX}px`;
    this.currentX = targetX;

    setTimeout(() => {
      this.companion.style.transition = "";
      this.state = "idle";
      this.setAnim("anim-idle");
      this.scheduleNextAction(2800);
    }, 1250);
  }

  actionPeek() {
    this.state = "peeking";
    this.setAnim("anim-peek");
    setTimeout(() => {
      this.state = "idle";
      this.setAnim("anim-idle");
      this.scheduleNextAction(3500);
    }, 900);
  }

  handleUserClick() {
    this.isInteracting = true;
    if (this.actionTimer) clearTimeout(this.actionTimer);

    soundFx.partyPopper();
    this.setAnim("anim-spin");
    this.say("Wheee! You found me! 🎈", 2200);
    this.emitCharacterSparkles();
    createFloatingHeart(this.currentX + 40, this.currentY);

    setTimeout(() => {
      this.setAnim("anim-idle");
      this.isInteracting = false;
      this.scheduleNextAction(3000);
    }, 950);
  }

  handleProximity(mouseX, mouseY) {
    if (this.state !== "idle" || this.isInteracting || this.reducedMotion) return;

    const charCenter = {
      x: this.currentX + 45,
      y: this.currentY + 50
    };

    const deltaX = mouseX - charCenter.x;
    const deltaY = mouseY - charCenter.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < 130) {
      const tiltDeg = Math.min(Math.max((deltaX / 130) * 12, -12), 12);
      if (this.inner) {
        const flip = this.facingLeft ? -1 : 1;
        this.inner.style.transform = `scaleX(${flip}) rotate(${tiltDeg}deg)`;
      }
    } else {
      if (this.inner && this.state === "idle") {
        const flip = this.facingLeft ? -1 : 1;
        this.inner.style.transform = `scaleX(${flip}) rotate(0deg)`;
      }
    }
  }

  respondToTargetClick(targetEl) {
    if (this.actionTimer) clearTimeout(this.actionTimer);
    targetEl.classList.remove("target-wobble");
    void targetEl.offsetWidth;
    targetEl.classList.add("target-wobble");

    soundFx.chime();
    this.say("I love this! ♥", 1600);
    this.emitCharacterSparkles();
    this.scheduleNextAction(2200);
  }

  emitCharacterSparkles() {
    if (!this.sparkleBox) return;
    const symbols = ["★", "✦", "♥", "•"];
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "char-sparkle";
      sparkle.textContent = symbols[i % symbols.length];
      sparkle.style.color = this.palette[Math.floor(Math.random() * this.palette.length)];
      sparkle.style.position = "absolute";
      sparkle.style.left = `${Math.random() * 60 + 10}px`;
      sparkle.style.top = `${Math.random() * 40 - 20}px`;
      sparkle.style.fontSize = `${Math.random() * 0.7 + 0.8}rem`;
      sparkle.style.pointerEvents = "none";
      sparkle.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
      sparkle.style.transform = "translateY(0) scale(0.5)";
      sparkle.style.opacity = "1";

      this.sparkleBox.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, -35px) scale(1.2)`;
        sparkle.style.opacity = "0";
      });

      setTimeout(() => sparkle.remove(), 750);
    }
  }
}

// Global character companion reference
let characterInstance = null;

// ==========================================================================
// 7. Master Initialization on DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // A. Postcard Ambient Stars & GSAP
  // -------------------------------------------------------------------------
  const bgStars = document.getElementById('bgStars');
  if (bgStars) {
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star-sparkle';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${2 + Math.random() * 4}s`;
      star.style.opacity = (Math.random() * 0.7 + 0.3).toString();
      bgStars.appendChild(star);
    }
  }

  const postcardCard = document.getElementById('postcardCard');
  const beginBtn = document.getElementById('beginBtn');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const confettiCannonBtn = document.getElementById('confettiCannonBtn');

  // Decorative floating assets
  const assetBalloons = document.getElementById('assetBalloons');
  const assetChampagne = document.getElementById('assetChampagne');
  const assetUfo = document.getElementById('assetUfo');
  const assetGift = document.getElementById('assetGift');
  const assetLollipop = document.getElementById('assetLollipop');

  // Modal elements
  const revealModal = document.getElementById('revealModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const candleFlame = document.getElementById('candleFlame');
  const cakeTip = document.getElementById('cakeTip');
  const popChampagneBtn = document.getElementById('popChampagneBtn');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const blastMoreConfetti = document.getElementById('blastMoreConfetti');
  const modalGoDashboard = document.getElementById('modalGoDashboard');
  const postageStamp = document.getElementById('postageStamp');
  const postmarkCircle = document.getElementById('postmarkCircle');

  let candleBlown = false;

  // Sound Toggle Handler
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundFxEnabled = !soundFxEnabled;
      if (soundFxEnabled) {
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'Music: ON';
        soundFx.chime();
      } else {
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'Music: OFF';
      }
    });
  }

  // Confetti Blast Button
  if (confettiCannonBtn) {
    confettiCannonBtn.addEventListener('click', () => {
      soundFx.partyPopper();
      fireCelebrationStorm();
    });
  }

  // GSAP 3D Parallax & Animations
  if (window.gsap && postcardCard) {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)' } });
    tl.from(postcardCard, {
      scale: 0.85,
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out'
    }).from('.floating-asset', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
    }, '-=0.6');

    // Continuous floating asset animations
    if (assetBalloons) {
      gsap.to(assetBalloons, { y: -16, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (assetChampagne) {
      gsap.to(assetChampagne, { rotation: 5, y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (assetUfo) {
      gsap.to(assetUfo, { x: 14, y: -12, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (assetGift) {
      gsap.to(assetGift, { rotation: -6, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (assetLollipop) {
      gsap.to(assetLollipop, { rotation: 8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    // 3D Parallax Tilt
    let cardX = gsap.quickTo(postcardCard, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    let cardY = gsap.quickTo(postcardCard, 'rotationX', { duration: 0.6, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      cardX(deltaX * 8);
      cardY(-deltaY * 8);

      if (assetBalloons) gsap.to(assetBalloons, { x: deltaX * -20, duration: 0.8, ease: 'power1.out', overwrite: 'auto' });
      if (assetUfo) gsap.to(assetUfo, { x: deltaX * 25, duration: 0.8, ease: 'power1.out', overwrite: 'auto' });
      if (assetChampagne) gsap.to(assetChampagne, { x: deltaX * -15, duration: 0.8, ease: 'power1.out', overwrite: 'auto' });
      if (assetGift) gsap.to(assetGift, { x: deltaX * 18, duration: 0.8, ease: 'power1.out', overwrite: 'auto' });
    });

    document.addEventListener('mouseleave', () => {
      cardX(0);
      cardY(0);
    });

    // Magnetic CTA Button attraction
    if (beginBtn) {
      beginBtn.addEventListener('mousemove', (e) => {
        const rect = beginBtn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(beginBtn, { x: relX * 0.25, y: relY * 0.25, duration: 0.25, ease: 'power2.out' });
      });

      beginBtn.addEventListener('mouseleave', () => {
        gsap.to(beginBtn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    }
  }

  // -------------------------------------------------------------------------
  // Multi-View Page Switcher (Postcard View vs Dashboard View)
  // -------------------------------------------------------------------------
  const postcardView = document.getElementById('postcardView');
  const dashboardView = document.getElementById('dashboardView');
  const navExploreDashboard = document.getElementById('navExploreDashboard');
  const backToPostcardBtn = document.getElementById('backToPostcardBtn');
  const characterCompanion = document.getElementById('characterCompanion');

  function showDashboard(animated = true) {
    if (!dashboardView || !postcardView) return;

    if (animated) {
      postcardView.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      postcardView.style.opacity = '0';
      postcardView.style.transform = 'scale(0.96)';

      setTimeout(() => {
        postcardView.classList.remove('active');
        postcardView.style.display = 'none';

        dashboardView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });

        requestAnimationFrame(() => {
          dashboardView.classList.add('active');
          dashboardView.style.opacity = '1';
          dashboardView.style.transform = 'scale(1)';
          if (characterCompanion) characterCompanion.style.display = 'block';
          window.location.hash = 'dashboard';
        });
      }, 350);
    } else {
      postcardView.classList.remove('active');
      postcardView.style.display = 'none';
      dashboardView.style.display = 'block';
      dashboardView.classList.add('active');
      dashboardView.style.opacity = '1';
      dashboardView.style.transform = 'scale(1)';
      if (characterCompanion) characterCompanion.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function showPostcard(animated = true) {
    if (!dashboardView || !postcardView) return;

    if (animated) {
      dashboardView.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      dashboardView.style.opacity = '0';
      dashboardView.style.transform = 'scale(0.96)';

      setTimeout(() => {
        dashboardView.classList.remove('active');
        dashboardView.style.display = 'none';
        if (characterCompanion) characterCompanion.style.display = 'none';

        postcardView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });

        requestAnimationFrame(() => {
          postcardView.classList.add('active');
          postcardView.style.opacity = '1';
          postcardView.style.transform = 'scale(1)';
          window.location.hash = 'postcard';
        });
      }, 350);
    } else {
      dashboardView.classList.remove('active');
      dashboardView.style.display = 'none';
      if (characterCompanion) characterCompanion.style.display = 'none';
      postcardView.style.display = 'block';
      postcardView.classList.add('active');
      postcardView.style.opacity = '1';
      postcardView.style.transform = 'scale(1)';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  // -------------------------------------------------------------------------
  // B. "Let's begin" Button — Switches directly to Dashboard View!
  // -------------------------------------------------------------------------
  if (beginBtn) {
    beginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      soundFx.celebrate();
      fireCelebrationStorm();
      heartBurst(16);
      showDashboard(true);
    });
  }

  if (navExploreDashboard) {
    navExploreDashboard.addEventListener('click', (e) => {
      e.preventDefault();
      soundFx.chime();
      showDashboard(true);
    });
  }

  if (backToPostcardBtn) {
    backToPostcardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      soundFx.chime();
      showPostcard(true);
    });
  }

  // -------------------------------------------------------------------------
  // C. Interactive Reveal Modal / Postcard Flip
  // -------------------------------------------------------------------------
  function openModal() {
    if (!revealModal) return;
    revealModal.classList.add('active');
    revealModal.removeAttribute('inert');
    soundFx.celebrate();
    fireConfetti(0.5, 0.5);
  }

  function closeModal() {
    if (!revealModal) return;
    revealModal.classList.remove('active');
    revealModal.setAttribute('inert', '');
    soundFx.chime();
  }

  if (postageStamp) postageStamp.addEventListener('click', openModal);
  if (postmarkCircle) postmarkCircle.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && revealModal && revealModal.classList.contains('active')) {
      closeModal();
    }
  });

  if (modalGoDashboard) {
    modalGoDashboard.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      soundFx.celebrate();
      fireCelebrationStorm();
      showDashboard(true);
    });
  }

  // Candle flame blowout
  if (candleFlame && cakeTip) {
    candleFlame.addEventListener('click', () => {
      if (!candleBlown) {
        candleBlown = true;
        soundFx.whoosh();
        candleFlame.classList.add('blown-out');
        cakeTip.innerHTML = '✨ <strong>Your wish is on its way to the stars!</strong> 🌟';
        cakeTip.style.color = '#00b4a7';

        setTimeout(() => {
          soundFx.celebrate();
          fireCelebrationStorm();
        }, 300);
      } else {
        candleBlown = false;
        candleFlame.classList.remove('blown-out');
        cakeTip.textContent = 'Click the flame to make a wish & blow out the candle! 🎂';
        cakeTip.style.color = '#6c757d';
        soundFx.chime();
      }
    });
  }

  if (popChampagneBtn) {
    popChampagneBtn.addEventListener('click', () => {
      soundFx.fizz();
      fireCelebrationStorm();
    });
  }

  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', () => {
      soundFx.boxTap();
      setTimeout(() => soundFx.celebrate(), 160);
      fireConfetti(0.5, 0.7);
      openGiftBtn.innerHTML = '🎁 Happiness Unlocked! ✨';
      openGiftBtn.style.background = '#ffc425';
    });
  }

  if (blastMoreConfetti) {
    blastMoreConfetti.addEventListener('click', () => {
      soundFx.partyPopper();
      fireCelebrationStorm();
    });
  }

  // Interactive Floating Assets Click Reactions
  if (assetBalloons) {
    assetBalloons.addEventListener('click', () => {
      soundFx.whoosh();
      fireConfetti(0.15, 0.3);
      if (window.gsap) gsap.to(assetBalloons, { y: '-=30', scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
    });
  }
  if (assetChampagne) {
    assetChampagne.addEventListener('click', () => {
      soundFx.fizz();
      fireConfetti(0.15, 0.8);
      if (window.gsap) gsap.to(assetChampagne, { rotation: '-=18', duration: 0.22, yoyo: true, repeat: 1 });
    });
  }
  if (assetUfo) {
    assetUfo.addEventListener('click', () => {
      soundFx.chime();
      fireConfetti(0.85, 0.25);
      if (window.gsap) gsap.to(assetUfo, { rotation: '+=360', duration: 0.8, ease: 'power2.inOut' });
    });
  }
  if (assetGift) {
    assetGift.addEventListener('click', () => {
      soundFx.boxTap();
      fireConfetti(0.85, 0.8);
      if (window.gsap) gsap.to(assetGift, { rotation: 6, yoyo: true, repeat: 3, duration: 0.06 });
    });
  }

  // -------------------------------------------------------------------------
  // D. Dashboard Controls & Photo Gallery Initialization
  // -------------------------------------------------------------------------
  initPhotoSlots();

  const musicBtn = document.getElementById("musicBtn");
  if (musicBtn) {
    musicBtn.addEventListener("click", toggleViolinMusic);
  }

  const celebrateBtn = document.getElementById("celebrateBtn");
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      const memoriesSection = document.getElementById("memories");
      if (memoriesSection) {
        memoriesSection.scrollIntoView({ behavior: "smooth" });
      }
      triggerFullCelebration();
      heartBurst(18);

      if (!isViolinPlaying) {
        toggleViolinMusic();
      }
    });
  }


  // Page-wide click for floating hearts (except buttons and companion)
  document.addEventListener("click", (event) => {
    if (event.target.closest("button") || event.target.closest("a") || event.target.closest("#characterCompanion")) {
      return;
    }
    createFloatingHeart(event.clientX, event.clientY);
  });

  // Initialize Rishi character companion
  try {
    characterInstance = new CharacterEngine();
  } catch (err) {
    console.error("Failed to start CharacterEngine:", err);
  }

  // Set initial view based on URL hash or default to Postcard landing
  if (window.location.hash === '#dashboard') {
    showDashboard(false);
  } else {
    showPostcard(false);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#dashboard') {
      showDashboard(true);
    } else if (window.location.hash === '#postcard' || window.location.hash === '') {
      showPostcard(true);
    }
  });
});

// Personal Birthday Voice Message
function playBirthdayVoice() {
    const voice = document.getElementById("birthdayVoice");

    if (voice) {
        voice.currentTime = 0;

        voice.play().catch(error => {
            console.error("Audio playback error:", error);
        });
    }
}
