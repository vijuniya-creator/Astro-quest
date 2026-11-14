/**
 * ASTRO QUEST – Junior Astronaut Mission Trainer
 * Interactive Logic, Starfield Canvas, Web Audio Synthesizer,
 * Planet Hopper Quiz, and ASTRO AI Co-Pilot Chatbot.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL AUDIO DEPENDENCY)
  // =========================================================================
  let audioCtx = null;
  let isSoundMuted = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Playful pop sound for buttons and chips
  function playPop() {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Star sparkle chime for quiz correct and badge unlock
  function playChime() {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';

        const startTime = audioCtx.currentTime + (idx * 0.07);
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Friendly sci-fi robot blip for ASTRO AI replies
  function playBlip() {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(900, now + 0.06);
      osc.frequency.setValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Audio blip error:', e);
    }
  }

  // Rocket whoosh for launch actions
  function playWhoosh() {
    if (isSoundMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio whoosh error:', e);
    }
  }

  // Sound toggle button in Navigation
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) {
        soundToggleBtn.classList.add('muted');
        soundToggleBtn.innerHTML = '<span class="sound-icon">🔇</span><span class="sound-text">Sound OFF</span>';
      } else {
        soundToggleBtn.classList.remove('muted');
        soundToggleBtn.innerHTML = '<span class="sound-icon">🔊</span><span class="sound-text">Sound ON</span>';
        playPop();
      }
    });
  }

  // =========================================================================
  // 2. DYNAMIC CANVAS STARFIELD & SHOOTING STARS
  // =========================================================================
  const starCanvas = document.getElementById('starfieldCanvas');
  const ctx = starCanvas ? starCanvas.getContext('2d') : null;

  let stars = [];
  let shootingStars = [];
  const STAR_COUNT = 140;

  function resizeStarfield() {
    if (!starCanvas) return;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const colors = ['#FFFFFF', '#38EFFF', '#FDE047', '#FF7AC6', '#E9D5FF'];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function maybeSpawnShootingStar() {
    if (Math.random() < 0.012 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * starCanvas.width * 0.8,
        y: Math.random() * starCanvas.height * 0.4,
        length: Math.random() * 90 + 70,
        speed: Math.random() * 8 + 10,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        opacity: 1
      });
    }
  }

  function renderStarfield() {
    if (!ctx || !starCanvas) return;
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Draw twinkling stars
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.direction;
      if (s.alpha > 0.95) {
        s.alpha = 0.95;
        s.direction = -1;
      } else if (s.alpha < 0.2) {
        s.alpha = 0.2;
        s.direction = 1;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.radius * 3;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Maybe spawn and draw shooting stars
    maybeSpawnShootingStar();

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(56, 239, 255, 0)');
      grad.addColorStop(0.7, `rgba(253, 224, 71, ${ss.opacity * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
      ctx.restore();

      // Advance
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= 0.02;

      if (ss.opacity <= 0 || ss.x > starCanvas.width || ss.y > starCanvas.height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(renderStarfield);
  }

  if (starCanvas) {
    window.addEventListener('resize', resizeStarfield);
    resizeStarfield();
    renderStarfield();
  }

  // =========================================================================
  // 3. CONFETTI CELEBRATION SYSTEM
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiPieces = [];

  function triggerConfettiBurst() {
    if (!confettiCanvas || !confCtx) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#FF7AC6', '#38EFFF', '#FDE047', '#C084FC', '#4ADE80', '#FFFFFF'];
    const count = 90;

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: window.innerWidth * 0.5 + (Math.random() * 200 - 100),
        y: window.innerHeight * 0.45 + (Math.random() * 100 - 50),
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    animateConfetti();
  }

  function animateConfetti() {
    if (!confCtx || !confettiCanvas) return;
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      confCtx.save();
      confCtx.translate(p.x, p.y);
      confCtx.rotate((p.rotation * Math.PI) / 180);
      confCtx.globalAlpha = Math.max(0, p.opacity);
      confCtx.fillStyle = p.color;

      if (p.shape === 'rect') {
        confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        confCtx.beginPath();
        confCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confCtx.fill();
      }
      confCtx.restore();

      if (p.opacity <= 0 || p.y > window.innerHeight) {
        confettiPieces.splice(i, 1);
      }
    }

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // =========================================================================
  // 4. PLANET HOPPER & SPACE QUIZ INTERACTIVITY
  // =========================================================================
  const planetDatabase = {
    mercury: {
      name: 'Mercury – The Speedy Pebble',
      class: 'preview-mercury',
      tag: 'Fastest Orbit in the Solar System! 🏎️',
      distance: '57.9 Million km from Sun',
      temp: 'Day: 430°C | Night: -180°C',
      fact: 'Mercury zooms around the Sun in just 88 days! That means on Mercury, your birthday would happen every 3 months! But remember to wear a super-suit: at night it gets colder than an ice planet, and during the day it is hot enough to melt solid metal!',
      quiz: {
        question: 'Does speedy Mercury have any moons orbiting it?',
        options: [
          { text: 'Nope, Zero Moons! 🌑', correct: true },
          { text: 'Yes, Two Moons! 🌕🌕', correct: false }
        ],
        successText: 'Spot on, Cadet! Mercury has 0 moons because it is so close to the Sun that the Sun’s gravity would steal them away!',
        failText: 'Oops, cosmic detour! Mercury is all by itself with zero moons!'
      }
    },
    venus: {
      name: 'Venus – The Golden Pressure Cooker',
      class: 'preview-venus',
      tag: 'Hottest Planet in our Solar System! 🌋',
      distance: '108.2 Million km from Sun',
      temp: 'Scorching 465°C all day and night!',
      fact: 'Even though Mercury is closer to the Sun, Venus is hotter! Thick yellow clouds of carbon dioxide trap the heat like an enormous space greenhouse oven. Plus, Venus spins backwards compared to most other planets!',
      quiz: {
        question: 'Why is Venus hotter than Mercury even though it is farther from the Sun?',
        options: [
          { text: 'Runaway Greenhouse Clouds! ☁️🔥', correct: true },
          { text: 'It has giant space heaters! 🔌', correct: false }
        ],
        successText: 'Brilliant deduction! Thick greenhouse atmosphere acts like an ultra-heavy heat blanket!',
        failText: 'Not quite! It’s all due to the super-thick blanket of greenhouse gases trapping heat!'
      }
    },
    earth: {
      name: 'Earth – Our Oasis in the Void',
      class: 'preview-earth',
      tag: 'The Only Known Planet with Ice Cream & Life! 🍦',
      distance: '149.6 Million km from Sun',
      temp: 'Average comfortable 15°C',
      fact: 'Earth is called the "Blue Marble" because oceans cover over 70% of its surface! Our magnetic field and ozone layer shield us from solar radiation, making it the perfect sanctuary for animals, trees, and junior astronauts.',
      quiz: {
        question: 'About how much of planet Earth is covered by liquid ocean water?',
        options: [
          { text: 'Around 71% 🌊', correct: true },
          { text: 'Only 15% 🏜️', correct: false }
        ],
        successText: 'Correct, Junior Navigator! More than two-thirds of our world is deep blue ocean!',
        failText: 'Try again! Earth is super watery—over 70% is covered by oceans!'
      }
    },
    mars: {
      name: 'Mars – The Rusty Desert World',
      class: 'preview-mars',
      tag: 'Home to the Solar System’s Tallest Volcano! 🏔️',
      distance: '227.9 Million km from Sun',
      temp: 'Chilly -60°C on average',
      fact: 'Mars appears rusty red because its surface rocks are packed with iron oxide (just like rusty metal!). Mars also has Olympus Mons, an ancient volcano three times taller than Mount Everest, and two lumpy potato-shaped moons named Phobos and Deimos!',
      quiz: {
        question: 'What gives Mars its famous red-orange rusty color?',
        options: [
          { text: 'Iron Oxide (Rust) in the dirt! 🧪', correct: true },
          { text: 'Red alien food coloring! 🎨', correct: false }
        ],
        successText: 'Bullseye! Iron in the Martian dust oxidized and rusted billions of years ago!',
        failText: 'Haha, no alien paint here! It is real iron oxide (rust) in the soil!'
      }
    },
    jupiter: {
      name: 'Jupiter – King of the Gas Giants',
      class: 'preview-jupiter',
      tag: 'More than 1,300 Earths could fit inside! 🌪️',
      distance: '778.5 Million km from Sun',
      temp: 'Freezing -110°C cloud tops',
      fact: 'Jupiter is so massive that it protects the inner planets by deflecting rogue comets like a cosmic goalie! Its Great Red Spot is a monster hurricane that has raged for at least 350 years—and it’s big enough to swallow our entire Earth whole!',
      quiz: {
        question: 'What is Jupiter’s famous Great Red Spot?',
        options: [
          { text: 'A giant swirling cosmic storm! 🌀', correct: true },
          { text: 'A giant swimming pool! 🏊', correct: false }
        ],
        successText: 'Bingo! A super-hurricane storm that has spun across Jupiter for centuries!',
        failText: 'No swimming here! It is a gigantic storm with 400-mph winds!'
      }
    },
    saturn: {
      name: 'Saturn – The Ringed Wonder',
      class: 'preview-saturn',
      tag: 'Would float in a giant bathtub of water! 🛁',
      distance: '1.43 Billion km from Sun',
      temp: 'Chilly -140°C',
      fact: 'Saturn’s breathtaking rings look solid from afar, but they are actually made of billions of chunks of pure sparkling water ice and rock, ranging from tiny ice cubes to house-sized boulders! And because Saturn is made mostly of light gas, it is less dense than water!',
      quiz: {
        question: 'What are Saturn’s shiny rings mostly made of?',
        options: [
          { text: 'Sparkling ice chunks & rocks! ❄️', correct: true },
          { text: 'Solid shiny metal titanium! ⛓️', correct: false }
        ],
        successText: 'Masterful, Cadet! Billions of icy fragments shimmering in the sunlight!',
        failText: 'Not metal! They are made of water ice, like celestial snowballs!'
      }
    }
  };

  let activePlanetKey = 'mercury';
  let hasPassedQuiz = false;

  const planetTabs = document.querySelectorAll('.planet-tab');
  const planetIllustration = document.getElementById('planetIllustration');
  const planetFunTag = document.getElementById('planetFunTag');
  const planetDistance = document.getElementById('planetDistance');
  const planetTemp = document.getElementById('planetTemp');
  const planetTitle = document.getElementById('planetTitle');
  const planetFactText = document.getElementById('planetFactText');
  const planetQuizQuestion = document.getElementById('planetQuizQuestion');
  const planetQuizOptions = document.getElementById('planetQuizOptions');
  const planetQuizFeedback = document.getElementById('planetQuizFeedback');

  function renderPlanet(planetKey) {
    const data = planetDatabase[planetKey];
    if (!data) return;

    activePlanetKey = planetKey;

    // Update active tab button
    planetTabs.forEach(tab => {
      if (tab.dataset.planet === planetKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Visual Sphere
    if (planetIllustration) {
      planetIllustration.innerHTML = `<div class="planet-sphere ${data.class}"></div>`;
    }

    if (planetFunTag) planetFunTag.textContent = data.tag;
    if (planetDistance) planetDistance.textContent = data.distance;
    if (planetTemp) planetTemp.textContent = data.temp;
    if (planetTitle) planetTitle.textContent = data.name;
    if (planetFactText) planetFactText.textContent = data.fact;

    // Render Quiz
    if (planetQuizQuestion) planetQuizQuestion.textContent = data.quiz.question;
    if (planetQuizFeedback) {
      planetQuizFeedback.textContent = '';
      planetQuizFeedback.style.color = '';
    }

    if (planetQuizOptions) {
      planetQuizOptions.innerHTML = '';
      data.quiz.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.dataset.correct = opt.correct;
        btn.textContent = opt.text;

        btn.addEventListener('click', () => {
          handleQuizAnswer(btn, opt.correct, data.quiz.successText, data.quiz.failText);
        });

        planetQuizOptions.appendChild(btn);
      });
    }
  }

  function handleQuizAnswer(btn, isCorrect, successText, failText) {
    const allBtns = planetQuizOptions.querySelectorAll('.quiz-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      planetQuizFeedback.textContent = `🎉 ${successText}`;
      planetQuizFeedback.style.color = 'var(--color-alien-green)';
      playChime();
      triggerConfettiBurst();

      if (!hasPassedQuiz) {
        hasPassedQuiz = true;
        unlockPlanetBadge();
      }
    } else {
      btn.classList.add('wrong');
      planetQuizFeedback.textContent = `❌ ${failText}`;
      planetQuizFeedback.style.color = '#F87171';
      playPop();

      // Let cadet retry after 1.8 seconds
      setTimeout(() => {
        allBtns.forEach(b => {
          b.disabled = false;
          b.classList.remove('wrong');
        });
        planetQuizFeedback.textContent = 'Give it another shot, Cadet!';
        planetQuizFeedback.style.color = 'var(--color-yellow)';
      }, 1800);
    }
  }

  function unlockPlanetBadge() {
    const badge = document.getElementById('planetQuizBadge');
    const badgeStatus = document.getElementById('quizBadgeStatus');
    if (badge && badgeStatus) {
      badge.classList.add('unlocked');
      badgeStatus.className = 'badge-status-label status-unlocked';
      badgeStatus.textContent = 'UNLOCKED! 🌟';
      promoteCadetLevel(2);
    }
  }

  planetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playPop();
      renderPlanet(tab.dataset.planet);
    });
  });

  // Initial render for Mercury
  renderPlanet('mercury');

  // =========================================================================
  // 5. CADET LEVEL UP & BADGE PROGRESSION
  // =========================================================================
  let cadetQuestionsAsked = 0;
  const chatBadgeCard = document.getElementById('chatBadgeCard');
  const chatBadgeStatus = document.getElementById('chatBadgeStatus');
  const cadetStatusBtn = document.getElementById('cadetStatusBtn');

  function incrementCadetQuestionCount() {
    cadetQuestionsAsked++;
    if (chatBadgeStatus && cadetQuestionsAsked <= 3) {
      chatBadgeStatus.textContent = `${cadetQuestionsAsked} / 3 Questions`;
    }

    if (cadetQuestionsAsked === 3 && chatBadgeCard) {
      chatBadgeCard.classList.add('unlocked');
      if (chatBadgeStatus) {
        chatBadgeStatus.className = 'badge-status-label status-unlocked';
        chatBadgeStatus.textContent = 'UNLOCKED! 🤖';
      }
      playChime();
      triggerConfettiBurst();
      promoteCadetLevel(3);
    }
  }

  function promoteCadetLevel(lvl) {
    if (cadetStatusBtn) {
      cadetStatusBtn.innerHTML = `<span class="cadet-rank-star">⭐</span><span class="cadet-label">Cadet Lvl ${lvl}</span>`;
      cadetStatusBtn.classList.add('animate-pulse');
      setTimeout(() => cadetStatusBtn.classList.remove('animate-pulse'), 1500);
    }
  }

  // =========================================================================
  // 6. AI FEATURE: ASTRO COMPANION CHATBOT
  // =========================================================================
  const astroChatModal = document.getElementById('astroChatModal');
  const astroHeadButton = document.getElementById('astroHeadButton');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const meetAstroBtn = document.getElementById('meetAstroBtn');
  const footerAskAstro = document.getElementById('footerAskAstro');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const typingIndicator = document.getElementById('typingIndicator');
  const quickChips = document.querySelectorAll('.quick-chip-btn');
  const voiceReadToggle = document.getElementById('voiceReadToggle');
  const voiceIcon = document.getElementById('voiceIcon');

  let isVoiceReadEnabled = false;

  // Toggle voice speech reading
  if (voiceReadToggle) {
    voiceReadToggle.addEventListener('click', () => {
      isVoiceReadEnabled = !isVoiceReadEnabled;
      if (isVoiceReadEnabled) {
        voiceIcon.textContent = '🔊';
        voiceReadToggle.style.color = 'var(--color-yellow)';
        speakText("Voice synthesizer online, Junior Astronaut!");
      } else {
        voiceIcon.textContent = '🔈';
        voiceReadToggle.style.color = '';
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
      playPop();
    });
  }

  function speakText(text) {
    if (!isVoiceReadEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown and emojis for clean speech
      const cleanText = text.replace(/[*_#`~]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.35; // friendly, upbeat slightly playful pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Open/Close Chat Drawer
  function toggleAstroChat(open = null) {
    playPop();
    const shouldOpen = open !== null ? open : !astroChatModal.classList.contains('open');

    if (shouldOpen) {
      astroChatModal.style.display = 'flex';
      setTimeout(() => {
        astroChatModal.classList.add('open');
        astroChatModal.setAttribute('aria-hidden', 'false');
        if (chatInput) chatInput.focus();
      }, 20);
    } else {
      astroChatModal.classList.remove('open');
      astroChatModal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        astroChatModal.style.display = 'none';
      }, 350);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }

  if (astroHeadButton) astroHeadButton.addEventListener('click', () => toggleAstroChat());
  if (meetAstroBtn) meetAstroBtn.addEventListener('click', () => toggleAstroChat(true));
  if (closeChatBtn) closeChatBtn.addEventListener('click', () => toggleAstroChat(false));
  if (footerAskAstro) {
    footerAskAstro.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAstroChat(true);
    });
  }

  // Add Message to Chat UI
  function addChatMessage(sender, text, isAstro = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isAstro ? 'astro-msg' : 'user-msg'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.innerHTML = isAstro ? '<span class="avatar-emoji">🧑‍🚀</span>' : '<span class="avatar-emoji">⭐</span>';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    if (isAstro) {
      const authorSpan = document.createElement('div');
      authorSpan.className = 'msg-author';
      authorSpan.textContent = 'ASTRO';
      bubbleDiv.appendChild(authorSpan);
    }

    const p = document.createElement('p');
    p.innerHTML = text;
    bubbleDiv.appendChild(p);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'msg-timestamp';
    timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubbleDiv.appendChild(timeSpan);

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);

    if (chatBody) {
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    if (isAstro) {
      playBlip();
      speakText(text);
    }
  }

  // ASTRO Knowledge Database & Smart Keyword Engine for Junior Explorers
  const astroKnowledgeBank = [
    {
      keywords: ['oxygen', 'breathe', 'air', 'lungs'],
      reply: "<strong>Bloop-bleep! Great question, Cadet! 🫁</strong> Space is a complete cosmic vacuum—meaning there is <em>no air at all</em> to breathe! Humans need oxygen so our bodies can turn food into energy. That's why our spacesuits and spaceships have life-support tanks that continuously pump fresh oxygen and filter out carbon dioxide!"
    },
    {
      keywords: ['moon', 'lunar', 'crater'],
      reply: "<strong>Ah, Earth's best buddy, the Moon! 🌕</strong> The Moon is our closest celestial neighbor, about 384,400 km away. Because the Moon has no atmosphere and no wind, astronaut footprints from Apollo 11 over 50 years ago are STILL there today! Plus, with 1/6th of Earth's gravity, you could jump as high as a house!"
    },
    {
      keywords: ['sun', 'hot', 'solar', 'star', 'plasma'],
      reply: "<strong>Whoa, put on your cosmic sunglasses! ☀️</strong> The Sun's core boils at an incredible <strong>15 million degrees Celsius</strong>! It's a colossal ball of glowing hydrogen and helium plasma. You could fit about <strong>1.3 million Earths</strong> inside the Sun! It gives us all the warmth and light that makes life possible."
    },
    {
      keywords: ['pizza', 'food', 'eat', 'dinner', 'ice cream', 'snack'],
      reply: "<strong>Yum! Space dining is wild! 🍕🌮</strong> Astronauts CAN eat pizza, but they usually use soft tortillas instead of bread! Why? Because bread crumbs float in zero gravity and could get sucked into air filters or computer fans! They also enjoy freeze-dried space strawberries, mac-and-cheese, and space ice cream!"
    },
    {
      keywords: ['black hole', 'singularity', 'event horizon', 'gravity'],
      reply: "<strong>Hold onto your helmet, this is intense! 🕳️</strong> A Black Hole is a region where a giant star collapsed into a super-tiny point with such intense gravity that <em>nothing</em>—not even light itself—can escape! If you approached one, scientists say you would experience 'spaghettification'—stretching out like a long noodle!"
    },
    {
      keywords: ['mars', 'red planet', 'rover', 'perseverance', 'curiosity'],
      reply: "<strong>Setting coordinates for Mars! 🚀</strong> With current rocket technology, a flight to Mars takes about <strong>6 to 9 months</strong>! You'd travel about 300 million miles across deep space. When you arrive, our robot explorer buddies like Perseverance and Curiosity will be waiting to greet you!"
    },
    {
      keywords: ['alien', 'extraterrestrial', 'ufo', 'life', 'et'],
      reply: "<strong>Bloop-bleep! Are we alone? 👽</strong> Scientists haven't discovered alien life yet, but we are actively searching! Astrobiologists are examining icy moons like Europa and Enceladus, which have giant warm oceans hidden under miles of ice. Microscopic space bacteria could be swimming there right now!"
    },
    {
      keywords: ['gravity', 'float', 'zero-g', 'weightless'],
      reply: "<strong>Wheeee! Floating in zero-G! 🧑‍🚀</strong> Astronauts on the Space Station aren't completely free of gravity; they are actually in 'free fall'! The station is traveling forward at 17,500 mph while falling around the curve of the Earth. It feels just like endless floating!"
    },
    {
      keywords: ['rocket', 'launch', 'thruster', 'blast off', 'propulsion'],
      reply: "<strong>3... 2... 1... Liftoff! 🚀</strong> Rockets work on Sir Isaac Newton's Third Law of Motion: 'For every action, there is an equal and opposite reaction!' When giant rocket engines blast fiery gas downward, the immense push propels the rocket upward into orbit at over 25,000 mph!"
    },
    {
      keywords: ['suit', 'spacesuit', 'helmet', 'clothes'],
      reply: "<strong>A spacesuit is actually a personal mini-spaceship! 🧑‍🚀</strong> It keeps astronauts at a comfortable temperature, supplies pure oxygen, shields against micrometeorites, and has a gold-coated visor to block blinding cosmic sunlight!"
    },
    {
      keywords: ['toilet', 'bathroom', 'pee', 'poop'],
      reply: "<strong>Hehe! Every cadet asks this! 🚽</strong> In zero gravity, astronauts use a special vacuum toilet that uses airflow suction instead of water to pull waste away! Urine is actually recycled into ultra-pure drinking water that is cleaner than tap water on Earth!"
    },
    {
      keywords: ['earth', 'home', 'blue marble'],
      reply: "<strong>Earth is the crown jewel of the cosmos! 🌍</strong> It is the only known planet in the universe with liquid water oceans, breathable atmosphere, and living ecosystems. No matter how far we venture, Earth is always our beloved home base!"
    }
  ];

  function getAstroResponse(userText) {
    const lower = userText.toLowerCase().trim();

    // Scan for matched keywords
    for (const item of astroKnowledgeBank) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.reply;
      }
    }

    // Cute child-friendly fallback response
    return `<strong>Beep-boop! Fascinating inquiry, Cadet! 📡</strong> My deep-space telemetry scanners are processing your question about <em>"${escapeHtml(userText)}"</em>! While I calibrate my sensor array with Earth Mission Control, remember: curious questions are the rocket fuel of true space explorers! Try asking me about <strong>oxygen, the Moon, black holes, the Sun, or space pizza!</strong>`;
  }

  function escapeHtml(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Handle Asking ASTRO
  function askAstro(questionText) {
    if (!questionText.trim()) return;

    // Add cadet's message
    addChatMessage('Cadet', escapeHtml(questionText), false);
    incrementCadetQuestionCount();

    // Show typing indicator
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Realistic child-friendly simulation delay
    setTimeout(() => {
      if (typingIndicator) typingIndicator.style.display = 'none';
      const answer = getAstroResponse(questionText);
      addChatMessage('ASTRO', answer, true);
    }, 750);
  }

  // Quick prompt buttons click
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playPop();
      const question = chip.dataset.question;
      askAstro(question);
    });
  });

  // Chat Form Submit
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        askAstro(text);
        chatInput.value = '';
      }
    });
  }

  // =========================================================================
  // 7. HERO INTERACTIONS & BUTTONS
  // =========================================================================
  const startAdventureBtn = document.getElementById('startAdventureBtn');
  if (startAdventureBtn) {
    startAdventureBtn.addEventListener('click', () => {
      playWhoosh();
      triggerConfettiBurst();
      const trainingSection = document.getElementById('training');
      if (trainingSection) {
        trainingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Hero Astronaut Mascot Interactive Click
  const heroAstronaut = document.getElementById('heroAstronaut');
  if (heroAstronaut) {
    heroAstronaut.addEventListener('click', () => {
      playChime();
      triggerConfettiBurst();
      const heroBubble = heroAstronaut.querySelector('.hero-bubble');
      if (heroBubble) {
        const cheerLines = [
          "🚀 High-five, Cadet! You're ready for orbit!",
          "⭐ Keep looking at the stars, never at your boots!",
          "🛸 Did you know Saturn could float in a giant bathtub?",
          "🤖 ASTRO and I are super proud of your training!"
        ];
        const randomCheer = cheerLines[Math.floor(Math.random() * cheerLines.length)];
        heroBubble.innerHTML = `<span class="bubble-sparkle">✨</span><span>"${randomCheer}"</span>`;
      }
    });
  }

  // =========================================================================
  // 8. TRAINING SECTOR PREVIEW MODAL
  // =========================================================================
  const genericModal = document.getElementById('genericModal');
  const genericModalClose = document.getElementById('genericModalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const sectorData = {
    rocket: {
      icon: '🚀',
      title: 'Rocket Builder Lab Initialized!',
      desc: 'Get ready to test solid vs liquid fuel thrust! You will balance weight ratios and stage booster separations to achieve escape velocity.'
    },
    solar: {
      icon: '🪐',
      title: 'Solar System Safari Ready!',
      desc: 'Fasten your seatbelts! We are navigating the asteroid belt between Mars and Jupiter. Keep an eye out for icy comets!'
    },
    alien: {
      icon: '👽',
      title: 'Alien Signal Decoder Active!',
      desc: 'Incoming rhythmic pulses from the Trappist-1 system! Use prime numbers, binary sequences, and color keys to decode friendly extraterrestrial greetings.'
    },
    zerog: {
      icon: '🧑‍🚀',
      title: 'Zero-G Spacewalk Simulator Prepared!',
      desc: 'Suit pressurized! Practice handhold tethers, nitrogen jetpack bursts, and satellite solar panel repairs outside the orbital station.'
    }
  };

  function openSectorModal(sectorKey) {
    playPop();
    const data = sectorData[sectorKey] || {
      icon: '🚀',
      title: 'Mission Simulator Ready',
      desc: 'Cadet flight controls are fully calibrated. Proceed to training!'
    };

    if (modalIcon) modalIcon.textContent = data.icon;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalBody) modalBody.textContent = data.desc;

    if (genericModal) {
      genericModal.classList.add('open');
      genericModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeGenericModal() {
    playPop();
    if (genericModal) {
      genericModal.classList.remove('open');
      genericModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (genericModalClose) genericModalClose.addEventListener('click', closeGenericModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeGenericModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeGenericModal);

  // Bind sector card buttons
  document.querySelectorAll('.card-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.training-card');
      const moduleKey = card ? card.dataset.module : 'rocket';
      openSectorModal(moduleKey);
    });
  });

  // Pre-Register Mission Button
  const preRegisterMissionBtn = document.getElementById('preRegisterMissionBtn');
  if (preRegisterMissionBtn) {
    preRegisterMissionBtn.addEventListener('click', () => {
      playChime();
      triggerConfettiBurst();
      openSectorModal('marsExpedition');
      if (modalIcon) modalIcon.textContent = '🚜';
      if (modalTitle) modalTitle.textContent = 'Mission to Mars: Crew Confirmed!';
      if (modalBody) modalBody.textContent = 'Welcome to the Mars Exploration Rover team! Your astronaut helmet is ready in the airlock.';
    });
  }

  // =========================================================================
  // 9. MOBILE MENU TOGGLE & SMOOTH SCROLLING
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      playPop();
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        playPop();
      });
    });
  }

  console.log('🚀 ASTRO QUEST – Mission Control online and ready for junior astronauts!');
});
