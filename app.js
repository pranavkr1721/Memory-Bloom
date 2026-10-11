/* ==========================================================================
   MemoryBloom - Senior & Memory Care Application Logic
   ========================================================================== */

// ---------------------------------------------------------------------------
// 1. Audio & Speech Synthesis Engine
// ---------------------------------------------------------------------------
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.35, gainValue = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainValue, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playTap() {
    // Warm marimba tap
    this.playTone(440, 'triangle', 0.18, 0.2);
  }

  playTileSelect(index) {
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    const freq = scale[index % scale.length];
    this.playTone(freq, 'sine', 0.28, 0.22);
  }

  playSuccess() {
    if (!this.enabled) return;
    // Cheerful harmonic arpeggio: C5 - E5 - G5 - C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.35, 0.2), i * 110);
    });
  }

  playIncorrect() {
    if (!this.enabled) return;
    // Unmistakable distinct low descending cue (293Hz -> 220Hz)
    const notes = [293.66, 220.00];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.35, 0.22), i * 180);
    });
  }

  playGentleTryAgain() {
    if (!this.enabled) return;
    this.playIncorrect();
  }

  playHint() {
    if (!this.enabled) return;
    // Shimmering two-tone
    this.playTone(587.33, 'triangle', 0.2, 0.15);
    setTimeout(() => this.playTone(880.00, 'triangle', 0.3, 0.15), 120);
  }
}

class VoiceEngine {
  constructor() {
    this.enabled = true;
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const findVoice = () => {
      const voices = this.synth.getVoices();
      // Look for a pleasant English voice
      this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Zira'))) 
                   || voices.find(v => v.lang.startsWith('en')) 
                   || voices[0];
    };
    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  speak(text) {
    if (!this.enabled || !this.synth) return;
    try {
      this.synth.cancel(); // Cancel any ongoing speech
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;
      utter.rate = 0.9; // Slightly slower, calm cadence for seniors
      utter.pitch = 1.05;
      utter.volume = 1.0;
      this.synth.speak(utter);
    } catch (e) {
      console.warn('Speech error', e);
    }
  }

  stop() {
    if (this.synth) this.synth.cancel();
  }
}

// ---------------------------------------------------------------------------
// 2. Data Stores & Configurations
// ---------------------------------------------------------------------------
const SYMBOLS = [
  { id: 'apple', icon: '🍎', name: 'Apple' },
  { id: 'flower', icon: '🌻', name: 'Sunflower' },
  { id: 'tea', icon: '☕', name: 'Warm Tea' },
  { id: 'cat', icon: '🐱', name: 'Friendly Cat' },
  { id: 'home', icon: '🏠', name: 'Cozy Home' },
  { id: 'boat', icon: '⛵', name: 'Calm Boat' },
  { id: 'bell', icon: '🔔', name: 'Golden Bell' },
  { id: 'leaf', icon: '🌿', name: 'Green Leaf' }
];

const SHAPES = [
  { icon: '🔷', name: 'Blue Diamond' },
  { icon: '🟡', name: 'Yellow Circle' },
  { icon: '⭐', name: 'Golden Star' },
  { icon: '🟩', name: 'Green Square' },
  { icon: '💜', name: 'Purple Heart' },
  { icon: '🔺', name: 'Red Triangle' }
];

const LEVEL_CONFIGS = {
  grid: [
    { level: 1, size: 2, count: 2, label: 'Level 1: 2 Tiles (2x2)' },
    { level: 2, size: 2, count: 3, label: 'Level 2: 3 Tiles (2x2)' },
    { level: 3, size: 3, count: 3, label: 'Level 3: 3 Tiles (3x3)' },
    { level: 4, size: 3, count: 4, label: 'Level 4: 4 Tiles (3x3)' },
    { level: 5, size: 3, count: 5, label: 'Level 5: 5 Tiles (3x3)' },
    { level: 6, size: 4, count: 4, label: 'Level 6: 4 Tiles (4x4)' },
    { level: 7, size: 4, count: 5, label: 'Level 7: 5 Tiles (4x4)' },
    { level: 8, size: 4, count: 6, label: 'Level 8: 6 Tiles (4x4)' },
    { level: 9, size: 4, count: 7, label: 'Level 9: 7 Tiles (4x4)' },
    { level: 10, size: 4, count: 8, label: 'Level 10: 8 Tiles (4x4)' }
  ],
  sequence: [
    { level: 1, length: 2, label: 'Level 1: 2 Familiar Friends' },
    { level: 2, length: 2, label: 'Level 2: 2 Familiar Friends' },
    { level: 3, length: 3, label: 'Level 3: 3 Familiar Friends' },
    { level: 4, length: 3, label: 'Level 4: 3 Familiar Friends' },
    { level: 5, length: 4, label: 'Level 5: 4 Familiar Friends' },
    { level: 6, length: 4, label: 'Level 6: 4 Familiar Friends' },
    { level: 7, length: 5, label: 'Level 7: 5 Familiar Friends' },
    { level: 8, length: 5, label: 'Level 8: 5 Familiar Friends' },
    { level: 9, length: 6, label: 'Level 9: 6 Familiar Friends' },
    { level: 10, length: 6, label: 'Level 10: 6 Familiar Friends' }
  ],
  choice: [
    { level: 1, length: 2, choices: 2, label: 'Level 1: 2 Shapes (2 Choices)' },
    { level: 2, length: 2, choices: 2, label: 'Level 2: 2 Shapes (2 Choices)' },
    { level: 3, length: 3, choices: 2, label: 'Level 3: 3 Shapes (2 Choices)' },
    { level: 4, length: 3, choices: 3, label: 'Level 4: 3 Shapes (3 Choices)' },
    { level: 5, length: 3, choices: 3, label: 'Level 5: 3 Shapes (3 Choices)' },
    { level: 6, length: 4, choices: 3, label: 'Level 6: 4 Shapes (3 Choices)' },
    { level: 7, length: 4, choices: 3, label: 'Level 7: 4 Shapes (3 Choices)' },
    { level: 8, length: 4, choices: 3, label: 'Level 8: 4 Shapes (3 Choices)' },
    { level: 9, length: 5, choices: 3, label: 'Level 9: 5 Shapes (3 Choices)' },
    { level: 10, length: 5, choices: 3, label: 'Level 10: 5 Shapes (3 Choices)' }
  ]
};

// ---------------------------------------------------------------------------
// 3. Main App Controller
// ---------------------------------------------------------------------------
class MemoryBloomApp {
  constructor() {
    this.sound = new SoundEngine();
    this.voice = new VoiceEngine();

    // App State
    this.currentMode = 'grid'; // 'grid' | 'sequence' | 'choice'
    this.currentLevel = 1;
    this.currentPhase = 'idle'; // 'study' | 'pause' | 'recall' | 'feedback'
    this.studyTimer = null;
    this.studyTimerDuration = 5; // seconds
    this.pauseDuration = 3; // seconds
    this.studyProgressInterval = null;

    // Pattern Data
    this.activePattern = [];
    this.userSelection = [];
    this.activeChoices = [];
    this.correctChoiceIndex = 0;
    this.hintsUsedInRound = 0;

    // Local Storage Data
    this.userProgress = this.loadProgress();

    this.initDOM();
    this.initSettings();
    this.attachEventListeners();
    this.registerPWA();
    this.updateStatsUI();
  }

  loadProgress() {
    const saved = localStorage.getItem('memorybloom_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse progress', e);
      }
    }
    return {
      streak: 1,
      lastDate: new Date().toDateString(),
      totalCompleted: 0,
      totalStars: 0,
      levels: {
        grid: { current: 1, stars: {} },
        sequence: { current: 1, stars: {} },
        choice: { current: 1, stars: {} }
      },
      settings: {
        fontSize: 'large',
        theme: 'soft',
        displayTime: '5',
        pauseTime: '3',
        voiceEnabled: true,
        soundEnabled: true
      }
    };
  }

  saveProgress() {
    localStorage.setItem('memorybloom_progress', JSON.stringify(this.userProgress));
    this.updateStatsUI();
  }

  updateStatsUI() {
    // Check daily streak
    const today = new Date().toDateString();
    if (this.userProgress.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (this.userProgress.lastDate === yesterday) {
        this.userProgress.streak += 1;
      } else {
        this.userProgress.streak = 1;
      }
      this.userProgress.lastDate = today;
      localStorage.setItem('memorybloom_progress', JSON.stringify(this.userProgress));
    }

    // Calculate total stars
    let totalStars = 0;
    ['grid', 'sequence', 'choice'].forEach(mode => {
      const starsMap = this.userProgress.levels[mode].stars;
      for (const lvl in starsMap) {
        totalStars += starsMap[lvl] || 0;
      }
    });
    this.userProgress.totalStars = totalStars;

    // Update screen elements
    document.getElementById('stat-streak').textContent = this.userProgress.streak;
    document.getElementById('stat-stars').textContent = totalStars;
    document.getElementById('stat-completed').textContent = this.userProgress.totalCompleted;

    // Update mode badges
    document.getElementById('badge-grid-level').textContent = `Level ${this.userProgress.levels.grid.current}`;
    document.getElementById('badge-seq-level').textContent = `Level ${this.userProgress.levels.sequence.current}`;
    document.getElementById('badge-choice-level').textContent = `Level ${this.userProgress.levels.choice.current}`;

    const renderModeStars = (mode, elId) => {
      const currLvl = this.userProgress.levels[mode].current;
      const count = this.userProgress.levels[mode].stars[currLvl] || 0;
      let starStr = '⭐'.repeat(count) + '☆'.repeat(Math.max(0, 3 - count));
      document.getElementById(elId).textContent = starStr;
    };
    renderModeStars('grid', 'stars-grid-mode');
    renderModeStars('sequence', 'stars-seq-mode');
    renderModeStars('choice', 'stars-choice-mode');
  }

  initDOM() {
    // Screen elements
    this.screens = {
      welcome: document.getElementById('screen-welcome'),
      game: document.getElementById('screen-game')
    };

    // Playgrounds
    this.playgrounds = {
      grid: document.getElementById('grid-playground'),
      sequence: document.getElementById('sequence-playground'),
      choice: document.getElementById('choice-playground')
    };

    // Guidance Banner
    this.guidance = {
      banner: document.getElementById('guidance-banner'),
      emoji: document.getElementById('guidance-emoji'),
      title: document.getElementById('guidance-title'),
      subtitle: document.getElementById('guidance-subtitle')
    };

    // Dialogs
    this.dialogLevels = document.getElementById('modal-levels');
    this.dialogSettings = document.getElementById('modal-settings');
    this.dialogConnect = document.getElementById('modal-connect');

    // Controls
    this.btnHome = document.getElementById('btn-home');
    this.btnLevels = document.getElementById('btn-levels');
    this.btnSettings = document.getElementById('btn-settings');
    this.btnVoiceToggle = document.getElementById('btn-voice-toggle');
    this.btnSoundToggle = document.getElementById('btn-sound-fx');
    this.btnHint = document.getElementById('btn-hint');
    this.btnReadyNow = document.getElementById('btn-ready-now');
    this.studyProgressBar = document.getElementById('study-progress-bar');
    this.pauseScreen = document.getElementById('pause-screen');
    this.resultFeedback = document.getElementById('result-feedback');
    this.toast = document.getElementById('toast-message');
  }

  initSettings() {
    const s = this.userProgress.settings;
    this.applyFontSize(s.fontSize);
    this.applyTheme(s.theme);
    this.studyTimerDuration = s.displayTime === 'manual' ? 0 : parseInt(s.displayTime, 10);
    this.pauseDuration = parseInt(s.pauseTime, 10);
    this.sound.enabled = s.soundEnabled;
    this.voice.enabled = s.voiceEnabled;

    // Update toggles in settings modal
    document.getElementById('toggle-voice').checked = s.voiceEnabled;
    document.getElementById('toggle-sound').checked = s.soundEnabled;
    document.getElementById('voice-icon').textContent = s.voiceEnabled ? '🔊' : '🔇';
    document.getElementById('sound-icon').textContent = s.soundEnabled ? '🔔' : '🔕';

    // Highlight active setting buttons
    document.querySelectorAll('.font-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === s.fontSize);
    });
    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === s.theme);
    });
    document.querySelectorAll('.time-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.time === s.displayTime);
    });
    document.querySelectorAll('.pause-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pause === s.pauseTime);
    });
  }

  applyFontSize(size) {
    document.body.classList.remove('font-size-medium', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${size}`);
    this.userProgress.settings.fontSize = size;
  }

  applyTheme(theme) {
    document.body.classList.remove('theme-soft', 'theme-amber', 'theme-contrast');
    document.body.classList.add(`theme-${theme}`);
    this.userProgress.settings.theme = theme;
  }

  attachEventListeners() {
    // Top Nav
    this.btnHome.addEventListener('click', () => {
      this.sound.playTap();
      this.stopAllTimers();
      this.showScreen('welcome');
      this.voice.speak("Welcome back home. Take your time.");
    });

    this.btnLevels.addEventListener('click', () => {
      this.sound.playTap();
      this.openLevelsModal(this.currentMode);
    });

    this.btnSettings.addEventListener('click', () => {
      this.sound.playTap();
      this.dialogSettings.showModal();
    });

    this.btnVoiceToggle.addEventListener('click', () => {
      this.voice.enabled = !this.voice.enabled;
      this.userProgress.settings.voiceEnabled = this.voice.enabled;
      document.getElementById('voice-icon').textContent = this.voice.enabled ? '🔊' : '🔇';
      document.getElementById('toggle-voice').checked = this.voice.enabled;
      this.saveProgress();
      this.showToast(this.voice.enabled ? 'Voice guidance on' : 'Voice guidance muted');
      if (this.voice.enabled) this.voice.speak('Voice guidance is now on.');
    });

    this.btnSoundToggle.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.userProgress.settings.soundEnabled = this.sound.enabled;
      document.getElementById('sound-icon').textContent = this.sound.enabled ? '🔔' : '🔕';
      document.getElementById('toggle-sound').checked = this.sound.enabled;
      this.saveProgress();
      this.showToast(this.sound.enabled ? 'Sound chimes on' : 'Sound chimes muted');
      if (this.sound.enabled) this.sound.playSuccess();
    });

    // Start Buttons from Welcome Cards
    document.getElementById('card-mode-grid').addEventListener('click', () => {
      this.startExercise('grid');
    });
    document.getElementById('card-mode-sequence').addEventListener('click', () => {
      this.startExercise('sequence');
    });
    document.getElementById('card-mode-choice').addEventListener('click', () => {
      this.startExercise('choice');
    });

    // Connect / Android Button
    document.getElementById('btn-show-connect').addEventListener('click', () => {
      this.sound.playTap();
      this.dialogConnect.showModal();
      this.renderQRCode();
    });

    // Modal Close Buttons
    document.getElementById('btn-close-levels').addEventListener('click', () => this.dialogLevels.close());
    document.getElementById('btn-close-settings').addEventListener('click', () => this.dialogSettings.close());
    document.getElementById('btn-close-connect').addEventListener('click', () => this.dialogConnect.close());

    // Settings adjustments
    document.querySelectorAll('.font-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.sound.playTap();
        document.querySelectorAll('.font-opt').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.applyFontSize(e.target.dataset.font);
        this.saveProgress();
      });
    });

    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.sound.playTap();
        document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.applyTheme(e.target.dataset.theme);
        this.saveProgress();
      });
    });

    document.querySelectorAll('.time-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.sound.playTap();
        document.querySelectorAll('.time-opt').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.userProgress.settings.displayTime = e.target.dataset.time;
        this.studyTimerDuration = e.target.dataset.time === 'manual' ? 0 : parseInt(e.target.dataset.time, 10);
        this.saveProgress();
      });
    });

    document.querySelectorAll('.pause-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.sound.playTap();
        document.querySelectorAll('.pause-opt').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.userProgress.settings.pauseTime = e.target.dataset.pause;
        this.pauseDuration = parseInt(e.target.dataset.pause, 10);
        this.saveProgress();
      });
    });

    document.getElementById('toggle-voice').addEventListener('change', (e) => {
      this.voice.enabled = e.target.checked;
      this.userProgress.settings.voiceEnabled = this.voice.enabled;
      document.getElementById('voice-icon').textContent = this.voice.enabled ? '🔊' : '🔇';
      this.saveProgress();
    });

    document.getElementById('toggle-sound').addEventListener('change', (e) => {
      this.sound.enabled = e.target.checked;
      this.userProgress.settings.soundEnabled = this.sound.enabled;
      document.getElementById('sound-icon').textContent = this.sound.enabled ? '🔔' : '🔕';
      this.saveProgress();
    });

    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all training records and stars?')) {
        localStorage.removeItem('memorybloom_progress');
        this.userProgress = this.loadProgress();
        this.updateStatsUI();
        this.dialogSettings.close();
        this.showToast('Records reset successfully');
      }
    });

    // Level tab switching
    document.querySelectorAll('.level-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.sound.playTap();
        document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.renderLevelsList(e.target.dataset.tab);
      });
    });

    // Game Actions
    this.btnReadyNow.addEventListener('click', () => {
      this.sound.playTap();
      if (this.currentPhase === 'study') {
        this.finishStudyPhase();
      }
    });

    this.btnHint.addEventListener('click', () => {
      this.provideHint();
    });

    document.getElementById('btn-next-round').addEventListener('click', () => {
      this.sound.playTap();
      this.resultFeedback.classList.add('hidden');
      // Advance level or repeat
      if (this.currentLevel < 10) {
        this.currentLevel += 1;
        this.userProgress.levels[this.currentMode].current = this.currentLevel;
        this.saveProgress();
      }
      this.startRound();
    });

    document.getElementById('btn-retry-round').addEventListener('click', () => {
      this.sound.playTap();
      this.resultFeedback.classList.add('hidden');
      this.startRound();
    });
  }

  showScreen(screenName) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[screenName].classList.add('active');
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 2500);
  }

  // ---------------------------------------------------------------------------
  // 4. Exercise Management & Game Lifecycle
  // ---------------------------------------------------------------------------
  startExercise(mode) {
    this.sound.playTap();
    this.currentMode = mode;
    this.currentLevel = this.userProgress.levels[mode].current || 1;
    this.showScreen('game');

    // Update Header labels
    const modeMeta = {
      grid: { title: 'Glowing Tiles', icon: '🏮' },
      sequence: { title: 'Familiar Friends', icon: '🍎' },
      choice: { title: 'Pattern Match', icon: '🔷' }
    };
    document.getElementById('game-mode-name').textContent = modeMeta[mode].title;
    document.getElementById('game-mode-icon').textContent = modeMeta[mode].icon;

    this.startRound();
  }

  startRound() {
    this.stopAllTimers();
    this.resultFeedback.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.userSelection = [];
    this.hintsUsedInRound = 0;

    const feedbackCard = document.getElementById('feedback-card');
    if (feedbackCard) feedbackCard.className = 'feedback-card';
    const btnNext = document.getElementById('btn-next-round');
    if (btnNext) {
      btnNext.classList.remove('hidden');
      btnNext.className = 'btn-primary btn-large';
      btnNext.textContent = 'Next Level ➔';
    }
    const btnRetry = document.getElementById('btn-retry-round');
    if (btnRetry) {
      btnRetry.className = 'btn-secondary btn-large';
      btnRetry.textContent = 'Try Again ↺';
    }
    const existingReveal = document.getElementById('seq-reveal-box');
    if (existingReveal) existingReveal.remove();

    // Update level display
    const totalLevels = LEVEL_CONFIGS[this.currentMode].length;
    document.getElementById('game-level-indicator').textContent = `Level ${this.currentLevel} of ${totalLevels}`;

    // Switch playground container
    Object.values(this.playgrounds).forEach(p => p.classList.add('hidden'));
    this.playgrounds[this.currentMode].classList.remove('hidden');

    // Set Guidance to Study
    this.setGuidancePhase('study');

    // Generate and render study pattern
    if (this.currentMode === 'grid') {
      this.setupGridRound();
    } else if (this.currentMode === 'sequence') {
      this.setupSequenceRound();
    } else if (this.currentMode === 'choice') {
      this.setupChoiceRound();
    }

    // Launch Study Timer
    this.beginStudyTimer();
  }

  setGuidancePhase(phase) {
    this.currentPhase = phase;
    this.guidance.banner.className = `guidance-banner phase-${phase}`;

    if (phase === 'study') {
      this.guidance.emoji.textContent = '👀';
      if (this.currentMode === 'grid') {
        this.guidance.title.textContent = 'Look at the Glowing Lanterns';
        this.guidance.subtitle.textContent = 'Take your time to memorize their locations.';
        this.voice.speak('Look at the glowing lanterns and remember where they are.');
      } else if (this.currentMode === 'sequence') {
        this.guidance.title.textContent = 'Remember the Order';
        this.guidance.subtitle.textContent = 'Notice the sequence of friendly items.';
        this.voice.speak('Remember the order of these friendly items.');
      } else {
        this.guidance.title.textContent = 'Memorize This Pattern';
        this.guidance.subtitle.textContent = 'Look at the shapes and their arrangement.';
        this.voice.speak('Memorize this pattern. You will recognize it soon.');
      }
      document.getElementById('study-action-bar').classList.remove('hidden');
      document.getElementById('study-progress-container').classList.remove('hidden');
      this.btnHint.classList.add('hidden');

    } else if (phase === 'pause') {
      this.guidance.emoji.textContent = '🍃';
      this.guidance.title.textContent = 'Rest & Breathe';
      this.guidance.subtitle.textContent = 'Hold the picture softly in your mind.';
      document.getElementById('study-action-bar').classList.add('hidden');
      document.getElementById('study-progress-container').classList.add('hidden');
      this.voice.speak('Keep the picture in your mind.');

    } else if (phase === 'recall') {
      this.guidance.emoji.textContent = '👆';
      if (this.currentMode === 'grid') {
        this.guidance.title.textContent = 'Tap the Glowing Tiles';
        this.guidance.subtitle.textContent = `Select the ${this.activePattern.length} tiles that were lit up.`;
        this.voice.speak('Now, tap the tiles where the lanterns were.');
      } else if (this.currentMode === 'sequence') {
        this.guidance.title.textContent = 'Repeat the Sequence';
        this.guidance.subtitle.textContent = 'Tap the items in the order you saw them.';
        this.voice.speak('Tap the items in the order you saw them.');
      } else {
        this.guidance.title.textContent = 'Which Pattern Did You See?';
        this.guidance.subtitle.textContent = 'Tap the card that matches the pattern.';
        this.voice.speak('Which pattern did you see? Tap your answer.');
      }
      document.getElementById('study-action-bar').classList.add('hidden');
      document.getElementById('study-progress-container').classList.add('hidden');
      this.btnHint.classList.remove('hidden');
    }
  }

  beginStudyTimer() {
    this.studyProgressBar.style.width = '100%';

    if (this.studyTimerDuration <= 0) {
      // Manual study mode: no timer bar, user presses button
      this.studyProgressBar.style.width = '100%';
      return;
    }

    const durationMs = this.studyTimerDuration * 1000;
    const intervalMs = 50;
    let elapsed = 0;

    clearInterval(this.studyProgressInterval);
    this.studyProgressInterval = setInterval(() => {
      elapsed += intervalMs;
      const remainingPercent = Math.max(0, 100 - (elapsed / durationMs) * 100);
      this.studyProgressBar.style.width = `${remainingPercent}%`;

      if (elapsed >= durationMs) {
        clearInterval(this.studyProgressInterval);
        this.finishStudyPhase();
      }
    }, intervalMs);
  }

  finishStudyPhase() {
    clearInterval(this.studyProgressInterval);
    this.studyProgressBar.style.width = '0%';

    // Enter Retention / Breathing Pause
    this.setGuidancePhase('pause');
    this.pauseScreen.classList.remove('hidden');

    // Hide patterns in the playground
    if (this.currentMode === 'grid') {
      this.hideGridPattern();
    } else if (this.currentMode === 'sequence') {
      this.hideSequencePattern();
    } else if (this.currentMode === 'choice') {
      this.hideChoicePattern();
    }

    // After pauseDuration, start Recall Phase
    setTimeout(() => {
      this.pauseScreen.classList.add('hidden');
      this.beginRecallPhase();
    }, this.pauseDuration * 1000);
  }

  beginRecallPhase() {
    this.setGuidancePhase('recall');

    if (this.currentMode === 'grid') {
      this.enableGridTaps();
    } else if (this.currentMode === 'sequence') {
      this.enableSequenceTaps();
    } else if (this.currentMode === 'choice') {
      this.enableChoiceTaps();
    }
  }

  stopAllTimers() {
    clearInterval(this.studyProgressInterval);
    if (this.studyTimer) clearTimeout(this.studyTimer);
    this.voice.stop();
  }

  // ---------------------------------------------------------------------------
  // 5. Exercise 1: Glowing Tiles (Spatial Grid Matrix)
  // ---------------------------------------------------------------------------
  setupGridRound() {
    const config = LEVEL_CONFIGS.grid[this.currentLevel - 1] || LEVEL_CONFIGS.grid[0];
    const gridContainer = document.getElementById('memory-grid');
    gridContainer.innerHTML = '';
    gridContainer.className = `memory-grid grid-${config.size}x${config.size}`;

    const totalTiles = config.size * config.size;
    
    // Pick unique random indices for glowing lanterns
    const indices = [];
    while (indices.length < config.count) {
      const rand = Math.floor(Math.random() * totalTiles);
      if (!indices.includes(rand)) indices.push(rand);
    }
    this.activePattern = indices;

    // Create tiles
    for (let i = 0; i < totalTiles; i++) {
      const tile = document.createElement('button');
      tile.className = 'grid-tile';
      tile.dataset.index = i;
      tile.setAttribute('aria-label', `Grid tile ${i + 1}`);

      if (indices.includes(i)) {
        tile.classList.add('tile-lit');
        tile.innerHTML = '🏮';
      }

      gridContainer.appendChild(tile);
    }

    // Play initial gentle notification
    this.sound.playTileSelect(0);
  }

  hideGridPattern() {
    const tiles = document.querySelectorAll('#memory-grid .grid-tile');
    tiles.forEach(tile => {
      tile.classList.remove('tile-lit');
      tile.innerHTML = '';
    });
  }

  enableGridTaps() {
    const tiles = document.querySelectorAll('#memory-grid .grid-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => this.handleGridTileClick(e));
    });
  }

  handleGridTileClick(e) {
    if (this.currentPhase !== 'recall') return;
    const tile = e.currentTarget;
    const index = parseInt(tile.dataset.index, 10);

    // If already selected, do nothing
    if (this.userSelection.includes(index)) return;

    this.userSelection.push(index);
    this.sound.playTileSelect(this.userSelection.length);

    // Visual feedback for tap (neutral slate tap before evaluation)
    tile.classList.add('tile-selected');
    tile.innerHTML = '●';

    // Check if reached target count
    if (this.userSelection.length === this.activePattern.length) {
      this.evaluateGridResult();
    }
  }

  evaluateGridResult() {
    this.currentPhase = 'feedback';
    const isCorrect = (this.userSelection.length === this.activePattern.length) &&
                      this.activePattern.every(idx => this.userSelection.includes(idx));

    // Visually reveal each tile on the board
    const allTiles = document.querySelectorAll('#memory-grid .grid-tile');
    allTiles.forEach(tile => {
      const idx = parseInt(tile.dataset.index, 10);
      const wasTapped = this.userSelection.includes(idx);
      const wasTarget = this.activePattern.includes(idx);

      if (wasTapped && wasTarget) {
        // Correct tap
        tile.className = 'grid-tile tile-correct';
        tile.innerHTML = '✓ 🏮';
      } else if (wasTapped && !wasTarget) {
        // Wrong tap
        tile.className = 'grid-tile tile-wrong';
        tile.innerHTML = '❌';
      } else if (!wasTapped && wasTarget) {
        // Missed lantern
        tile.className = 'grid-tile tile-missed';
        tile.innerHTML = '🏮';
      }
    });

    setTimeout(() => {
      if (isCorrect) {
        this.handleSuccess();
      } else {
        this.handleIncorrect('grid');
      }
    }, 500);
  }

  // ---------------------------------------------------------------------------
  // 6. Exercise 2: Familiar Friends (Sequence Recall)
  // ---------------------------------------------------------------------------
  setupSequenceRound() {
    const config = LEVEL_CONFIGS.sequence[this.currentLevel - 1] || LEVEL_CONFIGS.sequence[0];
    const track = document.getElementById('seq-study-track');
    const recallPanel = document.getElementById('seq-recall-panel');
    track.classList.remove('hidden');
    recallPanel.classList.add('hidden');
    track.innerHTML = '';

    const existingReveal = document.getElementById('seq-reveal-box');
    if (existingReveal) existingReveal.remove();

    // Pick sequence
    const shuffled = [...SYMBOLS].sort(() => 0.5 - Math.random());
    this.activePattern = shuffled.slice(0, config.length);

    // Render cards
    this.activePattern.forEach(item => {
      const card = document.createElement('div');
      card.className = 'seq-card';
      card.innerHTML = `
        <span class="seq-card-icon">${item.icon}</span>
        <span class="seq-card-name">${item.name}</span>
      `;
      track.appendChild(card);
    });

    this.sound.playTileSelect(0);
  }

  hideSequencePattern() {
    document.getElementById('seq-study-track').classList.add('hidden');
  }

  enableSequenceTaps() {
    const recallPanel = document.getElementById('seq-recall-panel');
    const slotsContainer = document.getElementById('seq-target-slots');
    const choicesTray = document.getElementById('seq-choices-tray');

    recallPanel.classList.remove('hidden');
    slotsContainer.innerHTML = '';
    choicesTray.innerHTML = '';

    const existingReveal = document.getElementById('seq-reveal-box');
    if (existingReveal) existingReveal.remove();

    // Create target slots
    for (let i = 0; i < this.activePattern.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'seq-slot';
      slot.id = `seq-slot-${i}`;
      slot.innerHTML = `?`;
      slotsContainer.appendChild(slot);
    }

    // Provide shuffled choices (including target items)
    const choices = [...this.activePattern].sort(() => 0.5 - Math.random());
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'seq-choice-btn';
      btn.innerHTML = `
        <span class="seq-card-icon">${item.icon}</span>
        <span class="seq-card-name">${item.name}</span>
      `;
      btn.addEventListener('click', () => this.handleSequenceChoice(item, btn));
      choicesTray.appendChild(btn);
    });
  }

  handleSequenceChoice(item, btn) {
    if (this.currentPhase !== 'recall') return;
    const currentIndex = this.userSelection.length;
    if (currentIndex >= this.activePattern.length) return;

    this.userSelection.push(item);
    this.sound.playTileSelect(currentIndex);

    // Fill slot
    const slot = document.getElementById(`seq-slot-${currentIndex}`);
    if (slot) {
      slot.classList.add('filled');
      slot.innerHTML = `<span>${item.icon}</span>`;
    }

    btn.disabled = true;
    btn.style.opacity = '0.4';

    if (this.userSelection.length === this.activePattern.length) {
      this.evaluateSequenceResult();
    }
  }

  evaluateSequenceResult() {
    this.currentPhase = 'feedback';
    const isCorrect = this.activePattern.every((item, idx) => {
      return this.userSelection[idx] && item.id === this.userSelection[idx].id;
    });

    // Reveal slots: mark which were right and which were wrong
    for (let i = 0; i < this.activePattern.length; i++) {
      const slot = document.getElementById(`seq-slot-${i}`);
      if (slot) {
        if (this.userSelection[i] && this.userSelection[i].id === this.activePattern[i].id) {
          slot.className = 'seq-slot filled slot-correct';
        } else {
          slot.className = 'seq-slot filled slot-wrong';
        }
      }
    }

    // If wrong, show the correct sequence clearly
    if (!isCorrect) {
      const recallPanel = document.getElementById('seq-recall-panel');
      let revealBox = document.getElementById('seq-reveal-box');
      if (!revealBox) {
        revealBox = document.createElement('div');
        revealBox.id = 'seq-reveal-box';
        revealBox.className = 'seq-correct-reveal';
        recallPanel.appendChild(revealBox);
      }
      revealBox.innerHTML = `
        <div class="seq-correct-reveal-title">✓ Correct sequence was:</div>
        <div class="seq-correct-reveal-items">
          ${this.activePattern.map(item => `<span>${item.icon}</span>`).join(' ➔ ')}
        </div>
      `;
    }

    setTimeout(() => {
      if (isCorrect) {
        this.handleSuccess();
      } else {
        this.handleIncorrect('sequence');
      }
    }, 500);
  }

  // ---------------------------------------------------------------------------
  // 7. Exercise 3: Pattern Match (Recognition Choice)
  // ---------------------------------------------------------------------------
  setupChoiceRound() {
    const config = LEVEL_CONFIGS.choice[this.currentLevel - 1] || LEVEL_CONFIGS.choice[0];
    const studyContainer = document.getElementById('choice-study-pattern');
    const optionsPanel = document.getElementById('choice-options-panel');
    studyContainer.classList.remove('hidden');
    optionsPanel.classList.add('hidden');
    studyContainer.innerHTML = '';

    // Pick target pattern of shapes
    const shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
    const target = shuffled.slice(0, config.length);
    this.activePattern = target;

    // Render study target
    target.forEach(shape => {
      const span = document.createElement('span');
      span.className = 'choice-item-shape';
      span.textContent = shape.icon;
      studyContainer.appendChild(span);
    });

    // Generate distractors
    const allOptions = [target];
    while (allOptions.length < config.choices) {
      // Create a subtle variation
      const distractor = [...target];
      const randIdx = Math.floor(Math.random() * distractor.length);
      const replacement = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      distractor[randIdx] = replacement;

      // Ensure distinct
      const strD = distractor.map(s => s.icon).join('');
      const exists = allOptions.some(opt => opt.map(s => s.icon).join('') === strD);
      if (!exists) {
        allOptions.push(distractor);
      }
    }

    // Shuffle options
    this.activeChoices = allOptions.sort(() => 0.5 - Math.random());
    this.correctChoiceIndex = this.activeChoices.findIndex(opt => {
      return opt.map(s => s.icon).join('') === target.map(s => s.icon).join('');
    });

    this.sound.playTileSelect(0);
  }

  hideChoicePattern() {
    document.getElementById('choice-study-pattern').classList.add('hidden');
  }

  enableChoiceTaps() {
    const optionsPanel = document.getElementById('choice-options-panel');
    const cardsContainer = document.getElementById('choice-cards-container');
    optionsPanel.classList.remove('hidden');
    cardsContainer.innerHTML = '';

    this.activeChoices.forEach((option, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-card-btn';
      btn.id = `choice-opt-${idx}`;
      btn.setAttribute('aria-label', `Choice option ${idx + 1}`);

      option.forEach(shape => {
        const span = document.createElement('span');
        span.textContent = shape.icon;
        btn.appendChild(span);
      });

      btn.addEventListener('click', () => this.handleChoiceSelection(idx));
      cardsContainer.appendChild(btn);
    });
  }

  handleChoiceSelection(selectedIndex) {
    if (this.currentPhase !== 'recall') return;
    this.sound.playTap();
    this.currentPhase = 'feedback';

    const isCorrect = (selectedIndex === this.correctChoiceIndex);

    // Mark all choices clearly
    this.activeChoices.forEach((_, idx) => {
      const btn = document.getElementById(`choice-opt-${idx}`);
      if (btn) {
        btn.disabled = true;
        if (idx === this.correctChoiceIndex) {
          btn.className = 'choice-card-btn choice-correct';
          const tag = document.createElement('div');
          tag.className = 'choice-status-tag';
          tag.textContent = '✓ Correct Answer';
          btn.appendChild(tag);
        } else if (idx === selectedIndex && !isCorrect) {
          btn.className = 'choice-card-btn choice-wrong';
          const tag = document.createElement('div');
          tag.className = 'choice-status-tag';
          tag.textContent = '❌ Your Choice';
          btn.appendChild(tag);
        } else {
          btn.style.opacity = '0.35';
        }
      }
    });

    setTimeout(() => {
      if (isCorrect) {
        this.handleSuccess();
      } else {
        this.handleIncorrect('choice');
      }
    }, 550);
  }

  // ---------------------------------------------------------------------------
  // 8. Hint Provider
  // ---------------------------------------------------------------------------
  provideHint() {
    this.hintsUsedInRound += 1;
    this.sound.playHint();

    if (this.currentMode === 'grid') {
      // Find one unselected correct tile
      const unselected = this.activePattern.filter(idx => !this.userSelection.includes(idx));
      if (unselected.length > 0) {
        const hintIdx = unselected[0];
        const tile = document.querySelector(`#memory-grid .grid-tile[data-index="${hintIdx}"]`);
        if (tile) {
          tile.classList.add('tile-hint');
          tile.innerHTML = '🏮';
          this.voice.speak('Here is one of the glowing lanterns.');
          setTimeout(() => {
            if (!this.userSelection.includes(hintIdx)) {
              tile.classList.remove('tile-hint');
              tile.innerHTML = '';
            }
          }, 2000);
        }
      }
    } else if (this.currentMode === 'sequence') {
      const nextExpected = this.activePattern[this.userSelection.length];
      if (nextExpected) {
        this.voice.speak(`The next item is ${nextExpected.name}.`);
        this.showToast(`Hint: Next is ${nextExpected.icon} ${nextExpected.name}`);
      }
    } else if (this.currentMode === 'choice') {
      // Eliminate an incorrect choice
      this.activeChoices.forEach((_, idx) => {
        if (idx !== this.correctChoiceIndex) {
          const btn = document.getElementById(`choice-opt-${idx}`);
          if (btn && btn.style.opacity !== '0.3') {
            btn.style.opacity = '0.3';
            btn.disabled = true;
          }
        }
      });
      this.voice.speak('One choice has been removed for you.');
    }
  }

  // ---------------------------------------------------------------------------
  // 9. Results & Feedback
  // ---------------------------------------------------------------------------
  handleSuccess() {
    this.sound.playSuccess();

    // Calculate stars: 3 stars if no hints, 2 stars if 1 hint, 1 star if multiple
    let stars = 3;
    if (this.hintsUsedInRound === 1) stars = 2;
    if (this.hintsUsedInRound > 1) stars = 1;

    // Update progress
    this.userProgress.totalCompleted += 1;
    const modeData = this.userProgress.levels[this.currentMode];
    const prevStars = modeData.stars[this.currentLevel] || 0;
    modeData.stars[this.currentLevel] = Math.max(prevStars, stars);
    this.saveProgress();

    // UI Feedback Card
    const card = document.getElementById('feedback-card');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-message');
    const emoji = document.getElementById('feedback-emoji');
    const btnNext = document.getElementById('btn-next-round');
    const btnRetry = document.getElementById('btn-retry-round');

    card.className = 'feedback-card feedback-success';
    emoji.textContent = '🎉';
    title.textContent = 'Correct! Well Done!';
    msg.textContent = `You remembered the pattern accurately! Earned ${stars} ⭐!`;

    btnNext.classList.remove('hidden');
    btnNext.textContent = 'Next Level ➔';
    btnNext.className = 'btn-primary btn-large';

    btnRetry.textContent = 'Replay Level ↺';
    btnRetry.className = 'btn-secondary btn-large';

    this.voice.speak('Correct! You remembered the pattern.');
    this.resultFeedback.classList.remove('hidden');
  }

  handleIncorrect(mode) {
    this.sound.playIncorrect();

    const card = document.getElementById('feedback-card');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-message');
    const emoji = document.getElementById('feedback-emoji');
    const btnNext = document.getElementById('btn-next-round');
    const btnRetry = document.getElementById('btn-retry-round');

    card.className = 'feedback-card feedback-wrong';
    emoji.textContent = '❌';
    title.textContent = 'Incorrect';

    if (mode === 'grid') {
      msg.textContent = 'That was not the right pattern. Look at the board: ❌ marks wrong taps, and 🏮 marks the correct lanterns.';
    } else if (mode === 'sequence') {
      msg.textContent = 'The sequence was not in the right order. Take a look at the correct order shown above.';
    } else {
      msg.textContent = 'That card was not the matching pattern. The card with the green border was the correct answer.';
    }

    // Do NOT show Next Level button on wrong answers!
    btnNext.classList.add('hidden');

    // Make "Try Again ↺" the primary action
    btnRetry.textContent = 'Try Again ↺';
    btnRetry.className = 'btn-primary btn-try-again btn-large';

    this.voice.speak('That was incorrect. Take a look at the correct pattern.');
    this.resultFeedback.classList.remove('hidden');
  }

  // ---------------------------------------------------------------------------
  // 10. Level Selector Dialog
  // ---------------------------------------------------------------------------
  openLevelsModal(mode) {
    document.querySelectorAll('.level-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === mode);
    });
    this.renderLevelsList(mode);
    this.dialogLevels.showModal();
  }

  renderLevelsList(mode) {
    const container = document.getElementById('level-list-container');
    container.innerHTML = '';
    const configs = LEVEL_CONFIGS[mode];
    const starsMap = this.userProgress.levels[mode].stars || {};

    configs.forEach(cfg => {
      const btn = document.createElement('button');
      btn.className = 'level-item-btn';
      const earned = starsMap[cfg.level] || 0;
      const starStr = '⭐'.repeat(earned) + '☆'.repeat(3 - earned);

      btn.innerHTML = `
        <span class="level-item-num">Level ${cfg.level}</span>
        <span class="level-item-stars">${starStr}</span>
      `;

      btn.addEventListener('click', () => {
        this.sound.playTap();
        this.currentMode = mode;
        this.currentLevel = cfg.level;
        this.userProgress.levels[mode].current = cfg.level;
        this.saveProgress();
        this.dialogLevels.close();
        this.startExercise(mode);
      });

      container.appendChild(btn);
    });
  }

  // ---------------------------------------------------------------------------
  // 11. QR Code Renderer for Android Device Pairing
  // ---------------------------------------------------------------------------
  async renderQRCode() {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let url = window.location.origin;
    try {
      const res = await fetch('/api/info');
      if (res.ok) {
        const info = await res.json();
        url = info.androidUrl || url;
      }
    } catch (e) {
      console.log('Using origin', e);
    }

    document.getElementById('android-url-display').textContent = url;

    // Draw clean visual QR representation
    const size = canvas.width;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const matrixSize = 25;
    const cellSize = Math.floor((size - 20) / matrixSize);
    const offset = Math.floor((size - matrixSize * cellSize) / 2);

    ctx.fillStyle = '#1C3127';

    // Helper to draw QR finder pattern (top-left, top-right, bottom-left)
    const drawFinder = (r, c) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            ctx.fillRect(offset + (c + j) * cellSize, offset + (r + i) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, matrixSize - 7);
    drawFinder(matrixSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i += 2) {
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
    }

    // Pseudorandom deterministic data matrix for the specific IP
    let seed = 123456789;
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        const inFinder = (r < 8 && c < 8) || (r < 8 && c >= matrixSize - 8) || (r >= matrixSize - 8 && c < 8);
        if (!inFinder) {
          seed = (seed * 9301 + 49297) % 233280;
          if (seed / 233280 > 0.52) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 12. PWA Registration (Windows & Android Native Installation)
  // ---------------------------------------------------------------------------
  registerPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(reg => console.log('Service Worker registered', reg.scope))
          .catch(err => console.log('Service Worker failed', err));
      });
    }

    // Handle install prompt for Windows & Android
    let deferredPrompt;
    const btnInstall = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (btnInstall) {
        btnInstall.classList.remove('hidden');
        btnInstall.addEventListener('click', () => {
          btnInstall.classList.add('hidden');
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User installed the PWA');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new MemoryBloomApp();
});
