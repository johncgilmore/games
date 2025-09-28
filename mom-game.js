(function () {
    const state = {
        running: false,
        currentRoom: 'bedroom',
        score: 0,
        timeLeft: 90,
        dishProgress: 0,
        soupQuality: 50,
        babyState: 'sleeping',
        potState: 'simmering',
        catState: 'idle',
        babyTimers: [],
        potTimers: [],
        catTimers: [],
        timers: [],
        dishReady: false,
        kidsArrived: false,
        audioEnabled: true,
        babyCrawlStep: 0,
        maxBabySteps: 6,
        letterActive: false,
        letterChar: '',
        letterTimer: null,
        ingredientItemEl: null,
        lettersSpawned: 0,
        maxLetters: 30,
        isOverdue: false,
        lastStirMs: 0,
        stirIntervalMs: 7000,
        lastIngredientSpawnMs: 0,
        ingredientSpawnIntervalMs: 6000,
        catRequiredKey: 'space',
        difficultyLevel: 1, // 1..10
        initialTime: 90,
    };

    // Audio system for 8-bit sounds
    const audio = {
        ctx: null,
        masterGain: null,
        backgroundMusic: null,
        
        init() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3; // Master volume
                console.log('Audio system initialized');
            } catch (e) {
                console.log('Audio not supported:', e);
                state.audioEnabled = false;
            }
        },

        // Create 8-bit style beep
        beep(frequency, duration, type = 'square') {
            if (!state.audioEnabled || !this.ctx) return;
            
            const oscillator = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + duration);
        },

        // Play melody (array of [frequency, duration] pairs)
        playMelody(notes, tempo = 200) {
            if (!state.audioEnabled || !this.ctx) return;
            
            notes.forEach((note, index) => {
                const [freq, duration] = note;
                setTimeout(() => {
                    this.beep(freq, duration / 1000);
                }, index * tempo);
            });
        },

        // Sound effects
        playBabyCry() {
            this.playMelody([
                [400, 150], [350, 150], [300, 150], [250, 300],
                [400, 150], [350, 150], [300, 150], [250, 300]
            ], 100);
        },

        playPotBoil() {
            this.playMelody([
                [200, 100], [250, 100], [300, 100], [350, 100]
            ], 80);
        },

        playCatMeow() {
            this.playMelody([
                [800, 100], [600, 100], [400, 200]
            ], 120);
        },

        playSuccess() {
            this.playMelody([
                [523, 150], [659, 150], [784, 300]
            ], 150);
        },

        playStir() {
            this.beep(440, 0.1, 'sine');
        },

        playGameOver() {
            this.playMelody([
                [392, 200], [349, 200], [294, 200], [262, 400]
            ], 200);
        },

        playWin() {
            this.playMelody([
                [262, 150], [330, 150], [392, 150], [523, 300],
                [392, 150], [523, 300]
            ], 120);
        },

        // Background music (simple loop)
        startBackgroundMusic() {
            if (!state.audioEnabled || !this.ctx) return;
            
            const melody = [
                [262, 200], [330, 200], [392, 200], [523, 400],
                [392, 200], [330, 200], [262, 400],
                [349, 200], [440, 200], [523, 200], [659, 400],
                [523, 200], [440, 200], [349, 400]
            ];
            
            const playLoop = () => {
                if (state.running && state.audioEnabled) {
                    this.playMelody(melody, 180);
                    setTimeout(playLoop, 8000); // Loop every 8 seconds
                }
            };
            
            playLoop();
        },

        toggleMute() {
            state.audioEnabled = !state.audioEnabled;
            if (this.masterGain) {
                this.masterGain.gain.value = state.audioEnabled ? 0.3 : 0;
            }
            return state.audioEnabled;
        }
    };

    const dom = {
        time: document.getElementById('timeStat'),
        score: document.getElementById('scoreStat'),
        dish: document.getElementById('dishStat'),
        room: document.getElementById('roomStat'),
        objective: document.getElementById('objective'),
        bedroomScene: document.getElementById('bedroomScene'),
        kitchenScene: document.getElementById('kitchenScene'),
        babySprite: document.getElementById('babySprite'),
        potSprite: document.getElementById('potSprite'),
        burnerGlow: document.getElementById('burnerGlow'),
        vaseSprite: document.getElementById('vaseSprite'),
        catSprite: document.getElementById('catSprite'),
        eventFeed: document.getElementById('eventFeed'),
        babyAlert: document.getElementById('bedroomAlert'),
        kitchenAlert: document.getElementById('kitchenAlert'),
        bedroomPenalty: document.getElementById('bedroomPenalty'),
        kitchenPenalty: document.getElementById('kitchenPenalty'),
        babyLight: document.getElementById('babyLight'),
        potLight: document.getElementById('potLight'),
        catLight: document.getElementById('catLight'),
        gameOverlay: document.getElementById('gameOverlay'),
        introCard: document.getElementById('introCard'),
        gameOverCard: document.getElementById('gameOverCard'),
        startButton: document.getElementById('startButton'),
        gameOverTitle: document.getElementById('gameOverTitle'),
        gameOverMessage: document.getElementById('gameOverMessage'),
        playAgainButton: document.getElementById('playAgainButton'),
        navButton: document.getElementById('navButton'),
        letterPrompt: document.getElementById('letterPrompt'),
        ingredientConveyor: document.getElementById('ingredientConveyor'),
        muteButton: document.getElementById('muteButton'),
        stirCountdown: document.getElementById('stirCountdown'),
        lettersCount: document.getElementById('lettersCount'),
        lettersTotal: document.getElementById('lettersTotal'),
        callDadButton: document.getElementById('callDadButton'),
        dadOverlay: document.getElementById('dadOverlay'),
        dadArrow: document.getElementById('dadArrow'),
        dadOutcomeText: document.getElementById('dadOutcomeText'),
    };

    // Debug: Check if all DOM elements are found
    console.log('DOM elements found:');
    console.log('gameOverlay:', dom.gameOverlay);
    console.log('introCard:', dom.introCard);
    console.log('gameOverCard:', dom.gameOverCard);
    console.log('playAgainButton:', dom.playAgainButton);

    function clearTimers(list) {
        list.forEach(clearTimeout);
        list.length = 0;
    }

    function resetState() {
        console.log('Resetting game state...');
        clearTimers(state.timers);
        clearTimers(state.babyTimers);
        clearTimers(state.potTimers);
        clearTimers(state.catTimers);

        state.running = false;
        state.currentRoom = 'bedroom';
        state.score = 0;
        state.timeLeft = 90;
        state.dishProgress = 0;
        state.babyState = 'sleeping';
        state.potState = 'simmering';
        state.catState = 'idle';
        state.dishReady = false;
        state.kidsArrived = false;
        state.babySuppressedUntil = 0;
        state.dadUsed = false;
        state.letterActive = false;
        state.letterChar = '';
        state.lettersSpawned = 0;
        state.lastIngredientSpawnMs = 0;
        if (state.ingredientItemEl) { state.ingredientItemEl.remove(); state.ingredientItemEl = null; }

        updateHUD();
        updateRoom();
        updateSprites();
        if (dom.dadOverlay) {
            dom.dadOverlay.hidden = true;
            dom.dadOverlay.style.display = 'none';
            if (dom.dadArrow) {
                dom.dadArrow.style.animation = '';
                dom.dadArrow.style.left = '';
            }
            if (dom.dadOutcomeText) dom.dadOutcomeText.textContent = '';
        }
        dom.eventFeed.innerHTML = '';
        console.log('Game state reset complete');
    }

    function updateHUD() {
        dom.time.textContent = state.timeLeft;
        dom.score.textContent = state.score;
        dom.dish.textContent = Math.min(100, Math.round(state.dishProgress)) + '%';
        dom.room.textContent = state.currentRoom === 'bedroom' ? 'Bedroom' : 'Kitchen';
    }

    function updateRoom() {
        dom.bedroomScene.classList.toggle('active', state.currentRoom === 'bedroom');
        dom.kitchenScene.classList.toggle('active', state.currentRoom === 'kitchen');
        updateNavUI();
        // Show ingredients only in kitchen
        if (dom.ingredientConveyor) {
            dom.ingredientConveyor.style.display = state.currentRoom === 'kitchen' ? 'flex' : 'none';
        }
    }

    function updateSprites() {
        dom.babySprite.className = `baby ${state.babyState}`;

        dom.potSprite.className = `pot ${state.potState === 'boiling' ? 'boiling' : ''} ${state.potState === 'burning' ? 'burning' : ''}`.trim();
        dom.burnerGlow.classList.toggle('active', state.potState === 'boiling' || state.potState === 'burning');

        dom.vaseSprite.className = `vase ${state.catState === 'knocking' ? 'falling' : ''} ${state.catState === 'broken' ? 'broken' : ''}`.trim();
        dom.catSprite.className = `cat ${state.catState === 'prowl' ? 'prowl' : ''} ${state.catState === 'knocking' ? 'mischief' : ''}`.trim();

        dom.babyLight.textContent = state.babyState === 'sleeping' ? '👶 Sleeping' : state.babyState === 'crawling' ? '👶 Crawling!' : '👶 Crying!';
        dom.potLight.textContent = state.potState === 'simmering' ? '🔥 Simmering' : state.potState === 'boiling' ? '🔥 Boiling over!' : '🔥 Burning!';
        dom.catLight.textContent = state.catState === 'idle' ? '🐈 Lounging' : state.catState === 'knocking' ? '🐈 Causing chaos!' : '🐈 Oops!';

        dom.babyLight.classList.toggle('warning', state.babyState !== 'sleeping');
        dom.potLight.classList.toggle('warning', state.potState !== 'simmering');
        dom.catLight.classList.toggle('warning', state.catState !== 'idle');
        updateMechanics();
    }

    function showAlert(element, message) {
        element.textContent = message;
        element.classList.add('show');
        setTimeout(() => element.classList.remove('show'), 2200);
    }

    function addFeed(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `feed-entry ${type !== 'info' ? type : ''}`.trim();
        entry.textContent = `• ${message}`;
        dom.eventFeed.prepend(entry);
        while (dom.eventFeed.children.length > 12) {
            dom.eventFeed.removeChild(dom.eventFeed.lastChild);
        }
    }

    function changeScore(amount) {
        state.score = Math.max(0, state.score + amount);
        updateHUD();
    }

    function switchRoom(direction) {
        if (!state.running) return;
        if (state.movementLockedUntil && Date.now() < state.movementLockedUntil) {
            addFeed('Busy!');
            return;
        }
        state.currentRoom = direction === 'left' ? 'bedroom' : 'kitchen';
        updateRoom();
        updateHUD();
        addFeed(state.currentRoom === 'bedroom' ? 'To Bedroom!' : 'To Kitchen!');
    }

    function updateNavUI() {
        if (!dom.navButton) return;
        if (state.currentRoom === 'bedroom') {
            dom.navButton.textContent = '➡ Kitchen';
        } else {
            dom.navButton.textContent = '⬅ Bedroom';
        }
    }

    function startGame() {
        console.log('Starting game...');
        resetState();
        state.running = true;
        dom.gameOverlay.style.display = 'none';
        addFeed('Shift start.');
        updateObjective();
        tickTimer();
        scheduleBabyWake();
        scheduleCatChaos();
        startStirRequirementLoop();
        startIngredientLoop();
        audio.startBackgroundMusic();
        console.log('Game started successfully, state.running:', state.running);
    }

    function updateObjective() {
        if (state.dishReady) {
            dom.objective.textContent = 'Dinner is done! Defend it until the kids get home.';
        } else {
            dom.objective.textContent = 'Kids storm in when the timer hits zero. Finish dinner before then!';
        }
    }

    function updateMechanics() {
        if (dom.lettersTotal) dom.lettersTotal.textContent = state.maxLetters;
        if (dom.lettersCount) dom.lettersCount.textContent = state.lettersSpawned;
        if (dom.stirCountdown) {
            const remaining = Math.max(0, state.stirIntervalMs - (Date.now() - state.lastStirMs));
            dom.stirCountdown.textContent = (remaining / 1000).toFixed(1);
        }
    }

    function tickTimer() {
        const id = setInterval(() => {
            if (!state.running) {
                clearInterval(id);
                return;
            }
            state.timeLeft -= 1;
            if (state.timeLeft < 0) {
                state.timeLeft = 0;
            }
            updateHUD();
            updateMechanics();
            updateDifficulty();

            if (state.timeLeft <= 0 && !state.kidsArrived) {
                kidsArrive();
                clearInterval(id);
            }
        }, 1000);
        state.timers.push(id);
    }

    function updateDifficulty() {
        // Progress difficulty from 1 to 10 across the game duration
        const elapsed = state.initialTime - state.timeLeft;
        const step = state.initialTime / 10; // e.g., 9 seconds per step for 90s
        const level = Math.max(1, Math.min(10, 1 + Math.floor(elapsed / step)));
        if (level !== state.difficultyLevel) {
            state.difficultyLevel = level;
        }
        // Adjust stir interval: start lenient, tighten later (7s → 3.5s)
        const p = (state.difficultyLevel - 1) / 9;
        state.stirIntervalMs = Math.round(7000 - p * (7000 - 3500));
        state.ingredientSpawnIntervalMs = Math.round(6500 - p * (6500 - 3500));
    }

    function scheduleBabyWake() {
        const delay = getBabyDelay();
        const timer = setTimeout(() => {
            if (!state.running) return;
            // Suppressed?
            if (Date.now() < state.babySuppressedUntil) {
                scheduleBabyWake();
                return;
            }
            startBabyCrawl();
        }, delay);
        state.babyTimers.push(timer);
    }

    function startBabyCrawl() {
        if (!state.running) return;
        state.babyState = 'crawling';
        state.babyCrawlStep = 0;
        updateSprites();
        positionBabyByStep();
        showAlert(dom.babyAlert, 'Baby is up! Space to scoop!');
        addFeed('Baby crawling!', 'alert');
        audio.playBabyCry();

        // Crawl over ~6 seconds in steps
        const stepInterval = 1000;
        const doStep = () => {
            if (!state.running || state.babyState !== 'crawling') return;
            state.babyCrawlStep += 1;
            positionBabyByStep();
            if (state.babyCrawlStep >= state.maxBabySteps) {
                babyFalls();
            } else {
                const t = setTimeout(doStep, stepInterval);
                state.babyTimers.push(t);
            }
        };
        const t = setTimeout(doStep, stepInterval);
        state.babyTimers.push(t);
    }

    function sootheBaby() {
        if (state.babyState !== 'crawling') return;
        state.babyState = 'sleeping';
        state.babyCrawlStep = 0;
        positionBabyByStep();
        updateSprites();
        addFeed('Baby asleep.', 'success');
        changeScore(40);
        audio.playSuccess();
        scheduleBabyWake();
    }

    function babyFalls() {
        if (state.babyState !== 'crawling') return;
        state.babyState = 'crying';
        updateSprites();
        addFeed('Baby crying!', 'alert');
        changeScore(-60);
        showAlert(dom.babyAlert, 'She needs a lullaby!');

        applyBedroomPenalty(5);
        const timer = setTimeout(() => {
            state.babyState = 'sleeping';
            updateSprites();
            addFeed('Baby asleep.');
            scheduleBabyWake();
        }, 3500);
        state.babyTimers.push(timer);
    }

    function positionBabyByStep() {
        const baseLeft = 48; // starting left
        const stepPx = 18;   // pixels per step
        const maxShift = baseLeft + stepPx * Math.min(state.maxBabySteps, state.babyCrawlStep);
        dom.babySprite.style.left = maxShift + 'px';
    }

    function schedulePotBoil() {
        const delay = randomBetween(7000, 15000);
        const timer = setTimeout(() => {
            if (!state.running) return;
            startBoilOver();
        }, delay);
        state.potTimers.push(timer);
    }

    function startBoilOver() {
        if (state.potState === 'boiling') return;
        state.potState = 'boiling';
        updateSprites();
        showAlert(dom.kitchenAlert, 'Stir that stew!');
        addFeed('Pot boiling! Add ingredient!', 'alert');
        audio.playPotBoil();
        trySpawnLetter();
    }

    function calmPot() {
        if (state.potState !== 'boiling') return;
        state.potState = 'simmering';
        updateSprites();
        addFeed('Stirred.', 'success');
        audio.playSuccess();
        endLetterChallenge(false);
        state.isOverdue = false;
        state.lastStirMs = Date.now();
    }

    function burnDinner() {
        if (state.potState !== 'boiling') return;
        addFeed('Food burning!', 'alert');
        state.dishProgress = Math.max(0, state.dishProgress - 1);
        state.soupQuality = Math.max(0, state.soupQuality - 1);
        updateHUD();
    }

    function scheduleCatChaos() {
        const delay = getCatDelay();
        const timer = setTimeout(() => {
            if (!state.running) return;
            startCatKnock();
        }, delay);
        state.catTimers.push(timer);
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function getBabyDelay() {
        const p = (state.difficultyLevel - 1) / 9; // 0..1
        const min = Math.round(lerp(12000, 4000, p));
        const max = Math.round(lerp(20000, 8000, p));
        return randomBetween(min, max);
    }

    function getCatDelay() {
        const p = (state.difficultyLevel - 1) / 9; // 0..1
        const min = Math.round(lerp(14000, 5000, p));
        const max = Math.round(lerp(22000, 9000, p));
        return randomBetween(min, max);
    }

    function startCatKnock() {
        if (state.catState === 'knocking' || state.catState === 'prowl') return;
        state.catState = 'prowl';
        state.catRequiredKey = 'enter';
        updateSprites();
        addFeed('Cat prowls…', 'alert');
        const prowlTimer = setTimeout(() => {
            if (state.catState !== 'prowl') return;
            state.catState = 'knocking';
            updateSprites();
            showAlert(dom.kitchenAlert, `Cat eyes the vase! Press Enter!`);
            addFeed('Cat at vase! Enter!', 'alert');
            audio.playCatMeow();
            const timer = setTimeout(() => {
                shatterVase();
            }, 4200);
            state.catTimers.push(timer);
        }, 1800);
        state.catTimers.push(prowlTimer);
    }

    function shooCat() {
        if (state.catState !== 'knocking') return;
        state.catState = 'idle';
        updateSprites();
        addFeed('Cat settled.', 'success');
        changeScore(25);
        audio.playSuccess();
        scheduleCatChaos();
    }

    function shatterVase() {
        if (state.catState !== 'knocking') return;
        state.catState = 'broken';
        updateSprites();
        addFeed('Vase shattered!', 'alert');
        changeScore(-40);
        applyKitchenPenalty(3);
        const timer = setTimeout(() => {
            state.catState = 'idle';
            updateSprites();
            addFeed('Cleaned up.');
            scheduleCatChaos();
        }, 3200);
        state.catTimers.push(timer);
    }

    function applyKitchenPenalty(seconds) {
        // Pull view to kitchen
        if (state.currentRoom !== 'kitchen') {
            state.currentRoom = 'kitchen';
            updateRoom();
        }
        lockMovement(seconds, dom.kitchenPenalty, 'Cleaning up glass from the cat', seconds);
    }

    function applyBedroomPenalty(seconds) {
        if (state.currentRoom !== 'bedroom') {
            state.currentRoom = 'bedroom';
            updateRoom();
        }
        lockMovement(seconds, dom.bedroomPenalty, 'Consoling baby and crying yourself', seconds);
    }

    function lockMovement(durationSec, bubbleEl, message, countdownStart) {
        state.movementLockedUntil = Date.now() + durationSec * 1000;
        let remaining = countdownStart;
        const updateBubble = () => {
            bubbleEl.textContent = `${message} (${remaining})`;
            bubbleEl.classList.add('show');
        };
        updateBubble();
        const interval = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                bubbleEl.classList.remove('show');
                clearInterval(interval);
            } else {
                updateBubble();
            }
        }, 1000);
        state.timers.push(interval);
    }

    function handleAction() {
        if (!state.running) return;
        if (state.currentRoom === 'bedroom') {
            if (state.babyState === 'crawling') {
                sootheBaby();
            } else if (state.babyState === 'crying') {
                state.babyState = 'sleeping';
                updateSprites();
                addFeed('You soothe her.', 'success');
                scheduleBabyWake();
            } else {
                addFeed('Baby sleeping.');
                changeScore(5);
            }
        } else {
            if (state.catState === 'knocking') {
                // Key requirement handled on keydown, but space also resolves
                if (state.catRequiredKey === 'space') shooCat();
            } else {
                addFeed('Kitchen clear.');
            }
        }
    }

    function stirPot() {
        if (!state.running || state.currentRoom !== 'kitchen') return;
        if (state.potState === 'burning') {
            addFeed('Too smoky! Space first.', 'alert');
            return;
        }
        // Stir only resets overdue and simmers; dish % now only from letters
        state.lastStirMs = Date.now();
        if (state.potState === 'boiling') {
            calmPot();
        }
        updateHUD();
        audio.playStir();
        if (!state.dishReady && state.dishProgress >= 100) {
            state.dishReady = true;
            addFeed('Dinner done!', 'success');
            changeScore(120);
            audio.playSuccess();
            updateObjective();
        } else {
            addFeed('Stirred.');
        }
    }

    function spawnLetterChallenge() {
        // deprecated by marquee but kept for safety (no-op)
        return;
    }

    const ingredientSkins = ['ham','flower','carrot','grape','fish','milk','cheese','nut','burger','candy','salad'];
    const ingredientIcons = {
        ham: '🍖', flower: '🌸', carrot: '🥕', grape: '🍇', fish: '🐟',
        milk: '🥛', cheese: '🧀', nut: '🥜', burger: '🍔', candy: '🍬', salad: '🥗'
    };

    function spawnIngredientMarquee() {
        if (!dom.ingredientConveyor) return;
        if (state.letterActive) return; // serialize
        if (state.lettersSpawned >= state.maxLetters) return;
        state.lettersSpawned += 1;
        // Pick a letter excluding 'S' (reserved for stirring)
        let letter = '';
        do {
            letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        } while (letter === 'S');
        state.letterChar = letter;
        state.letterActive = true;
        const item = document.createElement('div');
        const skin = ingredientSkins[Math.floor(Math.random()*ingredientSkins.length)];
        item.className = `ingredient-item ${skin} show`;
        const icon = ingredientIcons[skin] || '🍲';
        item.innerHTML = `<div class="icon">${icon}</div><div class="label">${letter}</div>`;
        dom.ingredientConveyor.appendChild(item);
        state.ingredientItemEl = item;
        const duration = 5000;
        state.letterTimer = setTimeout(() => {
            if (state.letterActive) {
                state.soupQuality = Math.max(0, state.soupQuality - 8);
                addFeed('Missed ingredient!', 'alert');
                endLetterChallenge(true);
            }
            if (state.ingredientItemEl) { state.ingredientItemEl.remove(); state.ingredientItemEl = null; }
        }, duration);
    }

    function endLetterChallenge(wasMiss) {
        state.letterActive = false;
        state.letterChar = '';
        if (state.letterTimer) {
            clearTimeout(state.letterTimer);
            state.letterTimer = null;
        }
        if (dom.letterPrompt) {
            dom.letterPrompt.style.display = 'none';
            dom.letterPrompt.textContent = '';
        }
        if (state.ingredientItemEl) { state.ingredientItemEl.remove(); state.ingredientItemEl = null; }
        if (!wasMiss) {
            // small positive bump to quality
            state.soupQuality = Math.min(100, state.soupQuality + 6);
        }
        if (state.dishProgress >= 100) {
            state.dishReady = true;
            updateObjective();
        }
    }

    function handleLetterPress(ch) {
        if (!state.running) return;
        if (!state.letterActive) return;
        // Ignore S for ingredient input; S is reserved for stirring only
        if (ch.toLowerCase() === 's') return;
        const pressed = ch.toUpperCase();
        if (pressed === state.letterChar) {
            addFeed(`Added ${pressed}!`, 'success');
            changeScore(15);
            state.dishProgress = Math.min(100, state.dishProgress + 10);
            updateHUD();
            endLetterChallenge(false);
            // Try to spawn next letter promptly while boiling
            setTimeout(trySpawnLetter, 300);
        }
    }

    function trySpawnLetter() {
        if (state.potState === 'boiling') {
            spawnIngredientMarquee();
        }
    }

    function startStirRequirementLoop() {
        state.lastStirMs = Date.now();
        const loop = setInterval(() => {
            if (!state.running) return;
            const elapsed = Date.now() - state.lastStirMs;
            // If overdue, pot starts boiling and we decay dish
            if (elapsed > state.stirIntervalMs) {
                state.isOverdue = true;
                startBoilOver();
                // Decay 1% per 0.5s
                burnDinner();
            }
            updateMechanics();
        }, 500);
        state.timers.push(loop);
    }

    function startIngredientLoop() {
        state.lastIngredientSpawnMs = Date.now();
        const loop = setInterval(() => {
            if (!state.running) return;
            if (state.letterActive) return;
            if (state.lettersSpawned >= state.maxLetters) return;
            const elapsed = Date.now() - state.lastIngredientSpawnMs;
            if (elapsed >= state.ingredientSpawnIntervalMs) {
                spawnIngredientMarquee();
                state.lastIngredientSpawnMs = Date.now();
            }
        }, 500);
        state.timers.push(loop);
    }

    function kidsArrive() {
        state.kidsArrived = true;
        if (!state.running) return;
        // Always show the kids popup and let the player click to get reviews
        triggerKidsAnimation();
    }

    function triggerKidsAnimation() {
        // Replaced by popup flow; no animation
        showKidsPopup();
    }

    function showKidsPopup() {
        // Use game overlay with a simple prompt but keep built-in cards
        dom.introCard.style.display = 'none';
        dom.gameOverCard.style.display = 'none';
        dom.gameOverlay.style.display = 'grid';
        const existing = document.getElementById('kidsPopupCard');
        if (existing) existing.remove();
        const card = document.createElement('div');
        card.className = 'overlay-card';
        card.id = 'kidsPopupCard';
        card.innerHTML = `
            <h1>The kids burst in!</h1>
            <p>Backpacks fly everywhere… and they crowd around the pot.</p>
            <button id="kidsReviewButton">Click here to get their reviews</button>
        `;
        dom.gameOverlay.appendChild(card);
        const btn = card.querySelector('#kidsReviewButton');
        btn.addEventListener('click', () => {
            card.remove();
            // After click, proceed to judge
            judgeDinner();
        });
    }

    function judgeDinner() {
        // Combine dish progress and soup quality into a simple score
        const quality = Math.round(0.6 * Math.min(100, state.dishProgress) + 0.4 * state.soupQuality);
        let remark = '';
        if (quality >= 85) {
            remark = 'They love it! “Best stew ever!”';
            changeScore(80);
        } else if (quality >= 65) {
            remark = 'Thumbs up. “Pretty good, Mom!”';
            changeScore(40);
        } else if (quality >= 45) {
            remark = 'Mixed reviews. “It\'s okay…”';
            changeScore(10);
        } else {
            remark = 'Polite grimaces. “Can we have cereal?”';
            changeScore(-20);
        }
        state.running = false;
        dom.gameOverTitle.textContent = 'Judge\'s Table';
        dom.gameOverMessage.textContent = `${remark}\nFinal score: ${state.score}.`;
        showGameOverScreen();
    }

    function winGame() {
        console.log('Game won! Final score:', state.score);
        state.running = false;
        changeScore(100);
        dom.gameOverTitle.textContent = 'You conquered the chaos!';
        dom.gameOverMessage.textContent = `Score: ${state.score}. The kids cheer and set the table.`;
        audio.playWin();
        showGameOverScreen();
        console.log('Game over screen shown');
    }

    // Removed auto-lose path in favor of kids popup → reviews flow

    function showGameOverScreen() {
        dom.introCard.style.display = 'none';
        dom.gameOverCard.style.display = 'block';
        dom.gameOverlay.style.display = 'grid';
    }

    function showIntroScreen() {
        dom.gameOverCard.style.display = 'none';
        dom.introCard.style.display = 'block';
        dom.gameOverlay.style.display = 'grid';
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    document.addEventListener('keydown', (event) => {
        if (dom.gameOverlay.style.display !== 'none' && event.key === 'Enter') {
            startGame();
            return;
        }
        if (!state.running) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            switchRoom('left');
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            switchRoom('right');
        } else if (event.key === ' ') {
            event.preventDefault();
            handleAction();
            if (state.currentRoom === 'kitchen' && state.catState === 'knocking' && state.catRequiredKey === 'space') {
                shooCat();
            }
        } else if (event.key.toLowerCase() === 's') {
            event.preventDefault();
            // Stir must not cancel letters
            stirPot();
        } else if (event.key === 'Enter') {
            if (state.currentRoom === 'kitchen' && (state.catState === 'knocking' || state.catState === 'prowl')) {
                shooCat();
            }
        } else if (/^[a-zA-Z]$/.test(event.key)) {
            handleLetterPress(event.key);
        }
    });

    dom.startButton.addEventListener('click', startGame);
    dom.playAgainButton.addEventListener('click', () => {
        console.log('Play again button clicked');
        showIntroScreen();
        console.log('Intro screen should be visible now');
    });

    if (dom.navButton) {
        dom.navButton.addEventListener('click', () => {
            if (!state.running) return;
            const to = state.currentRoom === 'bedroom' ? 'kitchen' : 'bedroom';
            switchRoom(to === 'bedroom' ? 'left' : 'right');
        });
    }

    if (dom.callDadButton) {
        dom.callDadButton.addEventListener('click', () => {
            if (!state.running || state.dadUsed) return;
            state.dadUsed = true;
            callDad();
        });
    }

    function callDad() {
        if (!dom.dadOverlay) return;
        dom.dadOutcomeText.textContent = '';
        dom.dadArrow.style.animation = '';
        dom.dadArrow.style.left = '';
        dom.dadOverlay.hidden = false;
        dom.dadOverlay.style.display = 'grid';
        // Cycle arrow already animates via CSS. Settle after a beat
        const settleMs = 1800 + Math.random() * 800;
        const timeout = setTimeout(() => {
            const helps = Math.random() < 0.5;
            // Freeze arrow over the chosen column
            dom.dadArrow.style.animation = 'none';
            dom.dadArrow.style.left = helps ? '25%' : '75%';
            if (helps) {
                dom.dadOutcomeText.textContent = 'He helps! Baby is chill for 20s.';
                addFeed('Dad helps!', 'success');
                state.babySuppressedUntil = Date.now() + 20000;
                scheduleBabyWake();
                setTimeout(() => { dom.dadOverlay.hidden = true; dom.dadOverlay.style.display = 'none'; }, 1000);
            } else {
                const reasons = [
                    'He put the lid on backwards. Steam everywhere.',
                    'He tried to soothe with a kazoo. Why?',
                    'He microwaved a metal spoon. Sparks!',
                    'He offered the cat a bath. Chaos.',
                    'He yelled “enhance!” at the stove.',
                ];
                const reason = reasons[Math.floor(Math.random() * reasons.length)];
                dom.dadOutcomeText.textContent = `Oh no—made it worse! ${reason}`;
                addFeed('Dad made it worse. Frozen 7s.', 'alert');
                // 7s frustration freeze
                const freezeSeconds = 7;
                // Prefer to lock in the current room; show a visible penalty bubble
                const bubble = state.currentRoom === 'kitchen' ? dom.kitchenPenalty : dom.bedroomPenalty;
                lockMovement(freezeSeconds, bubble, 'Frustrated beyond words', freezeSeconds);
                setTimeout(() => { dom.dadOverlay.hidden = true; dom.dadOverlay.style.display = 'none'; }, 1200);
            }
        }, settleMs);
        state.timers.push(timeout);
    }

    dom.muteButton.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        dom.muteButton.textContent = isMuted ? '🔊' : '🔇';
        console.log('Audio', isMuted ? 'enabled' : 'muted');
    });

    // Initialize audio system
    audio.init();
    resetState();
})();