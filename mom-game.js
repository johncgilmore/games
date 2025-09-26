(function () {
    const state = {
        running: false,
        currentRoom: 'bedroom',
        score: 0,
        timeLeft: 90,
        dishProgress: 0,
        babyState: 'sleeping',
        potState: 'simmering',
        catState: 'idle',
        babyTimers: [],
        potTimers: [],
        catTimers: [],
        timers: [],
        dishReady: false,
        kidsArrived: false,
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
        babyLight: document.getElementById('babyLight'),
        potLight: document.getElementById('potLight'),
        catLight: document.getElementById('catLight'),
        introOverlay: document.getElementById('introOverlay'),
        startButton: document.getElementById('startButton'),
        gameOverOverlay: document.getElementById('gameOverOverlay'),
        gameOverTitle: document.getElementById('gameOverTitle'),
        gameOverMessage: document.getElementById('gameOverMessage'),
        playAgainButton: document.getElementById('playAgainButton'),
    };

    function clearTimers(list) {
        list.forEach(clearTimeout);
        list.length = 0;
    }

    function resetState() {
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

        updateHUD();
        updateRoom();
        updateSprites();
        dom.eventFeed.innerHTML = '';
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
    }

    function updateSprites() {
        dom.babySprite.className = `baby ${state.babyState}`;

        dom.potSprite.className = `pot ${state.potState === 'boiling' ? 'boiling' : ''} ${state.potState === 'burning' ? 'burning' : ''}`.trim();
        dom.burnerGlow.classList.toggle('active', state.potState === 'boiling' || state.potState === 'burning');

        dom.vaseSprite.className = `vase ${state.catState === 'knocking' ? 'falling' : ''} ${state.catState === 'broken' ? 'broken' : ''}`.trim();
        dom.catSprite.className = `cat ${state.catState === 'knocking' ? 'mischief' : ''}`.trim();

        dom.babyLight.textContent = state.babyState === 'sleeping' ? '👶 Sleeping' : state.babyState === 'crawling' ? '👶 Crawling!' : '👶 Crying!';
        dom.potLight.textContent = state.potState === 'simmering' ? '🔥 Simmering' : state.potState === 'boiling' ? '🔥 Boiling over!' : '🔥 Burning!';
        dom.catLight.textContent = state.catState === 'idle' ? '🐈 Lounging' : state.catState === 'knocking' ? '🐈 Causing chaos!' : '🐈 Oops!';

        dom.babyLight.classList.toggle('warning', state.babyState !== 'sleeping');
        dom.potLight.classList.toggle('warning', state.potState !== 'simmering');
        dom.catLight.classList.toggle('warning', state.catState !== 'idle');
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
        state.currentRoom = direction === 'left' ? 'bedroom' : 'kitchen';
        updateRoom();
        updateHUD();
        addFeed(`You hustle to the ${state.currentRoom}.`);
    }

    function startGame() {
        resetState();
        state.running = true;
        dom.introOverlay.style.display = 'none';
        dom.gameOverOverlay.hidden = true;
        addFeed('Shift started. Deep breaths!');
        updateObjective();
        tickTimer();
        scheduleBabyWake();
        schedulePotBoil();
        scheduleCatChaos();
    }

    function updateObjective() {
        if (state.dishReady) {
            dom.objective.textContent = 'Dinner is done! Defend it until the kids get home.';
        } else {
            dom.objective.textContent = 'Kids storm in when the timer hits zero. Finish dinner before then!';
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

            if (state.timeLeft <= 0 && !state.kidsArrived) {
                kidsArrive();
                clearInterval(id);
            }
        }, 1000);
        state.timers.push(id);
    }

    function scheduleBabyWake() {
        const delay = randomBetween(6000, 14000);
        const timer = setTimeout(() => {
            if (!state.running) return;
            startBabyCrawl();
        }, delay);
        state.babyTimers.push(timer);
    }

    function startBabyCrawl() {
        if (!state.running) return;
        state.babyState = 'crawling';
        updateSprites();
        showAlert(dom.babyAlert, 'Baby is up! Space to scoop!');
        addFeed('Baby flips over and starts crawling toward the edge!', 'alert');

        const timer = setTimeout(() => {
            babyFalls();
        }, 4500);
        state.babyTimers.push(timer);
    }

    function sootheBaby() {
        if (state.babyState !== 'crawling') return;
        state.babyState = 'sleeping';
        updateSprites();
        addFeed('Baby snuggles back to sleep. Crisis averted.', 'success');
        changeScore(40);
        scheduleBabyWake();
    }

    function babyFalls() {
        if (state.babyState !== 'crawling') return;
        state.babyState = 'crying';
        updateSprites();
        addFeed('You hear a wail! The baby almost tumbled.', 'alert');
        changeScore(-60);
        showAlert(dom.babyAlert, 'She needs a lullaby!');

        const timer = setTimeout(() => {
            state.babyState = 'sleeping';
            updateSprites();
            addFeed('Baby finally drifts back to sleep. Phew.');
            scheduleBabyWake();
        }, 3500);
        state.babyTimers.push(timer);
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
        state.potState = 'boiling';
        updateSprites();
        showAlert(dom.kitchenAlert, 'Stir that stew!');
        addFeed('The stew bubbles violently. Space to tamp it down!', 'alert');

        const timer = setTimeout(() => {
            burnDinner();
        }, 5000);
        state.potTimers.push(timer);
    }

    function calmPot() {
        if (state.potState !== 'boiling') return;
        state.potState = 'simmering';
        updateSprites();
        addFeed('You steady the stew with a heroic stir.', 'success');
        changeScore(35);
        schedulePotBoil();
    }

    function burnDinner() {
        if (state.potState !== 'boiling') return;
        state.potState = 'burning';
        updateSprites();
        addFeed('Smoke alarm shrieks! Dinner scorches.', 'alert');
        changeScore(-80);
        state.dishProgress = Math.max(0, state.dishProgress - 15);
        updateHUD();
        updateObjective();

        const timer = setTimeout(() => {
            state.potState = 'simmering';
            updateSprites();
            addFeed('You salvage what you can. Back to simmering.');
            schedulePotBoil();
        }, 3000);
        state.potTimers.push(timer);
    }

    function scheduleCatChaos() {
        const delay = randomBetween(8000, 16000);
        const timer = setTimeout(() => {
            if (!state.running) return;
            startCatKnock();
        }, delay);
        state.catTimers.push(timer);
    }

    function startCatKnock() {
        if (state.catState === 'knocking') return;
        state.catState = 'knocking';
        updateSprites();
        showAlert(dom.kitchenAlert, 'Cat eyes the vase!');
        addFeed('The cat saunters over and bats at a vase.', 'alert');

        const timer = setTimeout(() => {
            shatterVase();
        }, 4200);
        state.catTimers.push(timer);
    }

    function shooCat() {
        if (state.catState !== 'knocking') return;
        state.catState = 'idle';
        updateSprites();
        addFeed('Cat begrudgingly curls up elsewhere.', 'success');
        changeScore(25);
        scheduleCatChaos();
    }

    function shatterVase() {
        if (state.catState !== 'knocking') return;
        state.catState = 'broken';
        updateSprites();
        addFeed('Crash! Glass everywhere.', 'alert');
        changeScore(-40);

        const timer = setTimeout(() => {
            state.catState = 'idle';
            updateSprites();
            addFeed('You sweep up the shards, muttering.');
            scheduleCatChaos();
        }, 3200);
        state.catTimers.push(timer);
    }

    function handleAction() {
        if (!state.running) return;
        if (state.currentRoom === 'bedroom') {
            if (state.babyState === 'crawling') {
                sootheBaby();
            } else if (state.babyState === 'crying') {
                state.babyState = 'sleeping';
                updateSprites();
                addFeed('You scoop her up and hum the sleepy song.', 'success');
                scheduleBabyWake();
            } else {
                addFeed('Baby snores softly. You tuck the blanket in.');
                changeScore(5);
            }
        } else {
            if (state.potState === 'boiling') {
                calmPot();
            } else if (state.potState === 'burning') {
                state.potState = 'simmering';
                updateSprites();
                addFeed('You air out the kitchen and turn the burner down.');
                schedulePotBoil();
            } else if (state.catState === 'knocking') {
                shooCat();
            } else {
                addFeed('Kitchen looks good—for now.');
            }
        }
    }

    function stirPot() {
        if (!state.running || state.currentRoom !== 'kitchen') return;
        if (state.potState === 'burning') {
            addFeed('Too smoky to stir! Hit the space bar first.', 'alert');
            return;
        }
        const gain = state.potState === 'boiling' ? 3 : 5;
        state.dishProgress = Math.min(110, state.dishProgress + gain);
        updateHUD();
        if (!state.dishReady && state.dishProgress >= 100) {
            state.dishReady = true;
            addFeed('Dinner is done! Kids will be impressed.', 'success');
            changeScore(120);
            updateObjective();
        } else {
            addFeed('You stir the stew. Smells amazing.');
            changeScore(8);
        }
    }

    function kidsArrive() {
        state.kidsArrived = true;
        if (!state.running) return;
        if (state.dishReady) {
            winGame();
        } else {
            loseGame('The kids burst in, backpacks flying. Dinner isn\'t ready.');
        }
    }

    function winGame() {
        state.running = false;
        changeScore(100);
        dom.gameOverTitle.textContent = 'You conquered the chaos!';
        dom.gameOverMessage.textContent = `Score: ${state.score}. The kids cheer and set the table.`;
        dom.gameOverOverlay.hidden = false;
    }

    function loseGame(message) {
        state.running = false;
        dom.gameOverTitle.textContent = 'Chaos wins this round…';
        dom.gameOverMessage.textContent = `${message} Final score: ${state.score}.`;
        dom.gameOverOverlay.hidden = false;
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    document.addEventListener('keydown', (event) => {
        if (dom.introOverlay.style.display !== 'none' && event.key === 'Enter') {
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
        } else if (event.key.toLowerCase() === 's') {
            event.preventDefault();
            stirPot();
        }
    });

    dom.startButton.addEventListener('click', startGame);
    dom.playAgainButton.addEventListener('click', () => {
        dom.gameOverOverlay.hidden = true;
        dom.introOverlay.style.display = 'grid';
    });

    resetState();
})();