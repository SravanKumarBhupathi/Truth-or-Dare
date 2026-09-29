/**
 * TRUTH × DARE: CHAOS MODE
 * Main Application Controller
 */

const App = {
    // Audio contexts or simple elements
    sounds: {},

    // Setup config built during screens
    setupConfig: {
        mode: 'classic',
        categories: { truth: [], dare: [] },
        difficulty: 'medium'
    },

    init() {
        console.log("Initializing Truth x Dare: Chaos Mode");

        // Init Game Engine
        gameEngine.init();

        // Init UI
        UI.updateSettingsUI(gameEngine.settings);

        // Bind Events
        this.bindEvents();

        // Check for active game
        if (Storage.getGameState() && Storage.getGameState().isActive) {
            UI.showConfirm("RESUME GAME?", "You have an unfinished game. Do you want to resume?", () => {
                gameEngine.resumeGame();
                this.resumeGameLoop();
            });
            // If they cancel, they stay on Home screen.
        } else {
            UI.showScreen('screen-home');
        }
    },

    // --- Audio ---
    playSound(id) {
        if (!gameEngine.settings.sound) return;
        // In a real implementation, we'd load actual Audio objects.
        // For this frontend-only zero-asset version, we can use synthetic beeps or just log.
        // Optional: Web Audio API for simple synthetic sounds.
        console.log("Sound Played: " + id);
    },

    // --- Game Flow ---

    startNewGameFlow() {
        // Render players for setup
        UI.renderPlayersList(gameEngine.players);
        UI.showScreen('screen-setup');
    },

    // Used in setup screen
    addPlayer() {
        const nameInput = document.getElementById('input-player-name');
        const selectedAvatar = document.querySelector('.avatar-option.selected').dataset.avatar;

        const res = gameEngine.addPlayer(nameInput.value, selectedAvatar);
        if (res.success) {
            nameInput.value = '';
            UI.renderPlayersList(gameEngine.players);
            this.playSound('click');
        } else {
            UI.showAlert("Error", res.msg);
        }
    },

    removePlayer(id) {
        gameEngine.removePlayer(id);
        UI.renderPlayersList(gameEngine.players);
        this.playSound('click');
    },

    startActualGame() {
        // Collect categories
        const truthCats = Array.from(document.querySelectorAll('#screen-categories .category-col:nth-child(1) input:checked')).map(cb => cb.value);
        const dareCats = Array.from(document.querySelectorAll('#screen-categories .category-col:nth-child(2) input:checked')).map(cb => cb.value);

        this.setupConfig.categories.truth = truthCats.length ? truthCats : ['funny']; // fallback
        this.setupConfig.categories.dare = dareCats.length ? dareCats : ['funny'];

        const success = gameEngine.startGame(this.setupConfig);
        if (success) {
            this.startTurn();
        } else {
            UI.showAlert("Error", "Could not start game. Check players.");
        }
    },

    startTurn() {
        const currentPlayer = gameEngine.getCurrentPlayer();
        UI.renderTransitionScreen(currentPlayer, () => {
            this.showFateWheel();
        });
    },

    showFateWheel() {
        UI.showScreen('screen-wheel');
        const wheelEl = document.getElementById('fate-wheel');
        Animations.drawWheelSegments(wheelEl, gameEngine.state.mode);

        document.getElementById('wheel-result-display').classList.add('hidden');
        document.getElementById('btn-spin-wheel').classList.remove('hidden');
        document.getElementById('btn-wheel-continue').classList.add('hidden');
    },

    executeFate() {
        const resultType = gameEngine.determineFate();
        const wheelEl = document.getElementById('fate-wheel');

        document.getElementById('btn-spin-wheel').classList.add('hidden');

        Animations.spinWheel(wheelEl, resultType, (res) => {
            const display = document.getElementById('wheel-result-display');
            const textEl = document.getElementById('wheel-result-text');
            display.classList.remove('hidden');

            let displayStr = "";
            if(res === 'truth') displayStr = "🧠 TRUTH";
            if(res === 'dare') displayStr = "🔥 DARE";
            if(res === 'chaos') displayStr = "💣 CHAOS EVENT";
            if(res === 'mystery') displayStr = "🎁 MYSTERY BOX";

            textEl.innerText = displayStr + " SELECTED";
            Animations.popOut(display);

            document.getElementById('btn-wheel-continue').classList.remove('hidden');

            // Store for next step
            this.pendingFate = res;
        });
    },

    continueFromWheel() {
        const type = this.pendingFate;
        const challenge = gameEngine.generateChallenge(type);

        if (type === 'truth' || type === 'dare') {
            const player = gameEngine.getCurrentPlayer();
            const score = gameEngine.state.scores[player.id];
            UI.renderChallengeCard(challenge, player, score);
        } else if (type === 'chaos') {
            UI.renderEventScreen(challenge);
        } else if (type === 'mystery') {
            this.pendingReward = challenge;
            UI.renderMysteryScreen();
        }
    },

    startChallenge() {
        document.getElementById('challenge-pre-actions').classList.add('hidden');
        document.getElementById('challenge-active-actions').classList.remove('hidden');

        UI.revealChallengeText(gameEngine.state.currentChallenge);

        if (gameEngine.state.currentChallenge.timer) {
            const timerEl = document.getElementById('timer-display');
            Animations.startTimer(gameEngine.state.currentChallenge.timer, timerEl, () => {
                // Auto fail if timer runs out? Let player click fail.
            });
        }
    },

    resolveChallengeUI(success) {
        Animations.stopTimer(document.getElementById('card-timer-container'));
        const res = gameEngine.resolveChallenge(success);

        UI.showAlert(success ? "SUCCESS!" : "FAILED", `Score change: ${res.scoreChange}`);

        setTimeout(() => {
            UI.hideModal();
            this.nextTurnLogic();
        }, 2000);
    },

    acceptEvent() {
        const res = gameEngine.applyEventEffect(gameEngine.state.currentChallenge);
        UI.showAlert("EVENT APPLIED", res.message);
        setTimeout(() => {
            UI.hideModal();
            this.nextTurnLogic();
        }, 2000);
    },

    openMysteryBox() {
        UI.revealMysteryReward(this.pendingReward);
        const res = gameEngine.applyEventEffect(this.pendingReward);
        // Note: applyEventEffect returns msg but reveal handles UI.
    },

    continueFromMystery() {
        this.nextTurnLogic();
    },

    nextTurnLogic() {
        const res = gameEngine.advanceTurn();
        if (res.isGameOver) {
            this.showResults();
        } else {
            this.startTurn();
        }
    },

    showResults() {
        const lb = gameEngine.getLeaderboard();
        const stats = gameEngine.getFunStats();
        UI.renderResults(lb, stats);
        gameEngine.endGame();
    },

    resumeGameLoop() {
        // If resuming, figure out where we were. Simplest is starting the current player's turn over.
        this.startTurn();
    },

    // --- Events Binding ---
    bindEvents() {
        window.app = this; // Expose for inline handlers like removePlayer

        // Navigation / Headers
        document.getElementById('btn-back').onclick = () => {
            // Basic back logic. In a real app, track history.
            if(gameEngine.state.isActive) {
                UI.showConfirm("Leave Game?", "Your progress is saved, but you'll return to home.", () => {
                    UI.showScreen('screen-home');
                });
            } else {
                UI.showScreen('screen-home');
            }
        };
        document.getElementById('btn-settings-header').onclick = () => UI.showScreen('screen-settings');

        // Home Screen
        document.getElementById('btn-play-now').onclick = () => {
            if(gameEngine.players.length >= 2) {
                // Quick start with default classic settings
                this.setupConfig.mode = 'classic';
                this.startActualGame();
            } else {
                this.startNewGameFlow();
            }
        };
        document.getElementById('btn-create-game').onclick = () => this.startNewGameFlow();
        document.getElementById('btn-how-to-play').onclick = () => UI.showScreen('screen-tutorial');
        document.getElementById('btn-settings').onclick = () => UI.showScreen('screen-settings');

        // Setup Screen
        document.getElementById('avatar-selector').addEventListener('click', (e) => {
            if(e.target.classList.contains('avatar-option')) {
                document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });
        document.getElementById('btn-add-player').onclick = () => this.addPlayer();
        document.getElementById('btn-setup-next').onclick = () => UI.showScreen('screen-mode');

        // Mode Selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.onclick = () => {
                document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.setupConfig.mode = card.dataset.mode;
            };
        });
        document.getElementById('btn-mode-next').onclick = () => UI.showScreen('screen-categories');

        // Category Selection
        document.getElementById('btn-categories-next').onclick = () => UI.showScreen('screen-difficulty');

        // Difficulty Selection
        document.querySelectorAll('.diff-card').forEach(card => {
            card.onclick = () => {
                document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.setupConfig.difficulty = card.dataset.diff;
            };
        });
        document.getElementById('btn-start-game').onclick = () => this.startActualGame();

        // Wheel Screen
        document.getElementById('btn-spin-wheel').onclick = () => this.executeFate();
        document.getElementById('btn-wheel-continue').onclick = () => this.continueFromWheel();

        // Challenge Screen
        document.getElementById('btn-start-challenge').onclick = () => this.startChallenge();
        document.getElementById('btn-reroll-challenge').onclick = () => {
             // Basic reroll - just re-run wheel logic (costs points or items in advanced versions)
             this.continueFromWheel();
        };
        document.getElementById('btn-complete-challenge').onclick = () => this.resolveChallengeUI(true);
        document.getElementById('btn-fail-challenge').onclick = () => this.resolveChallengeUI(false);

        // Event / Mystery
        document.getElementById('btn-event-continue').onclick = () => this.acceptEvent();
        document.getElementById('mystery-box-container').onclick = () => this.openMysteryBox();
        document.getElementById('btn-mystery-continue').onclick = () => this.continueFromMystery();

        // Results Screen
        document.getElementById('btn-play-again').onclick = () => {
            // Keep config, start new
            this.startActualGame();
        };
        document.getElementById('btn-new-game').onclick = () => this.startNewGameFlow();
        document.getElementById('btn-home-from-results').onclick = () => UI.showScreen('screen-home');

        // Settings Screen
        document.getElementById('btn-reset-data').onclick = () => {
            UI.showConfirm("WARNING", "This will delete all players and stats. Are you sure?", () => {
                Storage.clearAll();
                gameEngine.init();
                UI.showScreen('screen-home');
            });
        };

        // Listen for setting changes
        const saveSettings = () => {
            gameEngine.settings = {
                sound: document.getElementById('set-sound').checked,
                animations: document.getElementById('set-anim').checked,
                trustSystem: document.getElementById('set-trust').checked,
                chaosEvents: document.getElementById('set-chaos').checked,
                maxRounds: parseInt(document.getElementById('set-rounds').value) || 10
            };
            Storage.saveSettings(gameEngine.settings);
        };
        document.querySelectorAll('#screen-settings input').forEach(input => {
            input.addEventListener('change', saveSettings);
        });
    }
};

// Initialize App on load
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
