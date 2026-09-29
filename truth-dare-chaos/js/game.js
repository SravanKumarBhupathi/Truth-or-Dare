/**
 * TRUTH × DARE: CHAOS MODE
 * Core Game Logic State & Players
 */

class GameEngine {
    constructor() {
        // Core state variables
        this.players = [];
        this.settings = {};
        this.state = {
            isActive: false,
            mode: 'classic',
            categories: { truth: [], dare: [] },
            difficulty: 'medium',
            round: 1,
            currentPlayerIndex: 0,
            scores: {}, // player.id -> score
            trustScores: {}, // player.id -> trust
            usedChallenges: new Set(),
            currentChallenge: null,
            chainLevel: 0,
            modifiers: [], // e.g., 'double_points'
            kingPlayerId: null
        };

        // Difficulty point mapping
        this.difficultyPoints = {
            easy: 1,
            medium: 2,
            hard: 4,
            insane: 8
        };
    }

    init() {
        this.settings = Storage.getSettings();
        this.players = Storage.getPlayers();
    }

    // --- Player Management ---
    addPlayer(name, avatar) {
        if (!name || name.trim() === '') return { success: false, msg: "Name cannot be empty." };
        if (this.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            return { success: false, msg: "Name already exists." };
        }
        if (this.players.length >= 10) {
            return { success: false, msg: "Maximum 10 players allowed." };
        }

        const newPlayer = {
            id: 'p_' + Date.now(),
            name: name.trim(),
            avatar: avatar,
            // Assign random personality for fun
            personality: this.assignPersonality(avatar)
        };

        this.players.push(newPlayer);
        Storage.savePlayers(this.players);
        return { success: true, player: newPlayer };
    }

    removePlayer(id) {
        this.players = this.players.filter(p => p.id !== id);
        Storage.savePlayers(this.players);
        return true;
    }

    assignPersonality(avatar) {
        const map = {
            '😎': 'Cool',
            '😇': 'Innocent',
            '😂': 'Funny',
            '😈': 'Savage',
            '🧠': 'Smart',
            '😏': 'Flirty',
            '🤪': 'Crazy'
        };
        return map[avatar] || 'Unknown';
    }

    getPlayerById(id) {
        return this.players.find(p => p.id === id);
    }

    getCurrentPlayer() {
        if (this.players.length === 0) return null;
        return this.players[this.state.currentPlayerIndex];
    }

    // --- Game Initialization ---
    startGame(config) {
        if (this.players.length < 2) return false;

        this.state = {
            isActive: true,
            mode: config.mode,
            categories: config.categories,
            difficulty: config.difficulty,
            round: 1,
            currentPlayerIndex: 0,
            scores: {},
            trustScores: {},
            usedChallenges: new Set(),
            currentChallenge: null,
            chainLevel: 0,
            modifiers: [],
            kingPlayerId: null
        };

        // Init scores
        this.players.forEach(p => {
            this.state.scores[p.id] = 0;
            this.state.trustScores[p.id] = 0;
        });

        // Randomize starting player
        this.state.currentPlayerIndex = Math.floor(Math.random() * this.players.length);

        this.saveState();
        Storage.incrementStat('gamesPlayed');
        return true;
    }

    resumeGame() {
        const saved = Storage.getGameState();
        if (saved && saved.isActive) {
            this.state = saved;
            // Reconstruct Set
            this.state.usedChallenges = new Set(saved.usedChallengesArray || []);
            return true;
        }
        return false;
    }

    saveState() {
        if (!this.state.isActive) return;
        // Convert Set to Array for JSON stringify
        const saveObj = { ...this.state, usedChallengesArray: Array.from(this.state.usedChallenges) };
        // Don't save the actual Set object
        delete saveObj.usedChallenges;
        Storage.saveGameState(saveObj);
    }

    endGame() {
        this.state.isActive = false;
        Storage.clearGameState();
    }


    // --- Core Game Loop ---

    advanceTurn() {
        // Move to next player
        this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.players.length;

        // If we wrapped around, increment round
        if (this.state.currentPlayerIndex === 0) {
            this.state.round++;
        }

        // Reset turn-specific modifiers
        this.state.currentChallenge = null;

        // Save
        this.saveState();

        return {
            round: this.state.round,
            isGameOver: this.state.round > this.settings.maxRounds,
            nextPlayer: this.getCurrentPlayer()
        };
    }

    determineFate() {
        // Wheel probabilities based on mode/settings
        const p = Math.random();
        let result = 'truth'; // default

        if (this.state.mode === 'chaos') {
            if (p < 0.35) result = 'truth';
            else if (p < 0.70) result = 'dare';
            else if (p < 0.90) result = 'chaos';
            else result = 'mystery';
        } else {
            // Classic
            if (p < 0.45) result = 'truth';
            else if (p < 0.90) result = 'dare';
            else result = 'mystery'; // slight chance of mystery even in classic
        }

        return result; // 'truth', 'dare', 'chaos', 'mystery'
    }

    generateChallenge(type) {
        let pool = [];

        if (type === 'truth') {
            pool = gameData.truths.filter(t =>
                this.state.categories.truth.includes(t.category)
            );
            // Fallback if empty due to filters
            if (pool.length === 0) pool = gameData.truths;
        } else if (type === 'dare') {
            pool = gameData.dares.filter(d =>
                this.state.categories.dare.includes(d.category)
            );
            if (pool.length === 0) pool = gameData.dares;
        } else if (type === 'chaos') {
            pool = gameData.chaosEvents;
        } else if (type === 'mystery') {
            pool = gameData.rewards;
        }

        // Filter out used ones unless we run out
        let available = pool.filter(c => !this.state.usedChallenges.has(c.id));
        if (available.length === 0) {
            // Pool exhausted, reset used for this type
            pool.forEach(c => this.state.usedChallenges.delete(c.id));
            available = pool;
        }

        // Apply Difficulty Filtering for Truths/Dares (if applicable)
        if (type === 'truth' || type === 'dare') {
            // Try to find matching difficulty or lower
            const diffLevels = ['easy', 'medium', 'hard', 'insane'];
            const targetDiffIndex = diffLevels.indexOf(this.state.difficulty);

            // Allow up to target difficulty
            const diffFiltered = available.filter(c => diffLevels.indexOf(c.diff) <= targetDiffIndex);
            if (diffFiltered.length > 0) {
                available = diffFiltered;
            }
        }

        // Random Selection
        const selected = available[Math.floor(Math.random() * available.length)];
        this.state.usedChallenges.add(selected.id);

        // Process text for dynamic names (e.g., if requires target)
        let processedText = selected.text || selected.desc;
        if (processedText && type !== 'chaos' && type !== 'mystery') {
             processedText = this.injectDynamicNames(processedText, this.getCurrentPlayer());
        }

        const challengeData = {
            ...selected,
            processedText: processedText,
            points: this.calculatePotentialPoints(selected)
        };

        this.state.currentChallenge = challengeData;
        this.saveState();

        return challengeData;
    }

    injectDynamicNames(text, currentPlayer) {
        // If text doesn't explicitly need a replacement but requires a target conceptually
        // Not all data has placeholders, but we can append " (Target: [Name])" if needed.
        // For now, just return text. Future extension can replace {target} tokens.
        return text;
    }

    // --- Scoring & Logic ---

    calculatePotentialPoints(challenge) {
        if (challenge.type === 'truth' || challenge.type === 'dare') {
            return this.difficultyPoints[challenge.diff] || 2;
        }
        return 0;
    }

    resolveChallenge(success) {
        const challenge = this.state.currentChallenge;
        const player = this.getCurrentPlayer();
        if (!challenge || !player) return { scoreChange: 0 };

        let scoreChange = 0;

        if (success) {
            scoreChange = challenge.points;
            Storage.incrementStat('totalChallengesCompleted');
        } else {
            // Penalty
            scoreChange = -Math.max(1, Math.floor(challenge.points / 2));
        }

        // Apply Double Points modifier if active
        if (this.state.modifiers.includes('double_points')) {
            scoreChange *= 2;
            this.state.modifiers = this.state.modifiers.filter(m => m !== 'double_points');
        }

        this.updateScore(player.id, scoreChange);
        this.saveState();

        return {
            success,
            scoreChange,
            newScore: this.state.scores[player.id],
            triggersChain: success && Math.random() < 0.15 // 15% chance to start a chain on success
        };
    }

    updateScore(playerId, amount) {
        if (this.state.scores[playerId] !== undefined) {
            this.state.scores[playerId] += amount;
            // Prevent negative score for better UX? Or allow it. Allow it for Chaos.
        }
    }

    applyEventEffect(event) {
        const player = this.getCurrentPlayer();
        let message = "";

        switch (event.effect) {
            case 'add_points':
                this.updateScore(player.id, event.amount);
                message = `Gained ${event.amount} points!`;
                break;
            case 'lose_points':
                this.updateScore(player.id, -event.amount);
                message = `Lost ${event.amount} points!`;
                break;
            case 'steal_points':
                // Find highest scorer other than current
                let target = this.players.filter(p => p.id !== player.id)
                    .reduce((prev, curr) => (this.state.scores[curr.id] > this.state.scores[prev.id] ? curr : prev), this.players.find(p=>p.id!==player.id));
                if (target) {
                    this.updateScore(target.id, -event.amount);
                    this.updateScore(player.id, event.amount);
                    message = `Stole ${event.amount} from ${target.name}!`;
                }
                break;
            case 'double_points':
                this.state.modifiers.push('double_points');
                message = "Next challenge points doubled!";
                break;
            case 'skip_turn':
                message = "You miss your next turn.";
                // Could implement skipping logic in advanceTurn
                break;
            default:
                message = "Effect applied.";
        }

        this.saveState();
        return { message, newScore: this.state.scores[player.id] };
    }

    getLeaderboard() {
        return this.players.map(p => ({
            ...p,
            score: this.state.scores[p.id] || 0
        })).sort((a, b) => b.score - a.score);
    }

    getFunStats() {
        // Generate mock or derived fun stats
        const lb = this.getLeaderboard();
        if(lb.length === 0) return [];
        return [
            { title: "Chaos Champion", name: lb[0].name, icon: "👑" },
            { title: "Most Dangerous", name: lb[lb.length-1].name, icon: "💀" },
            { title: "Bravest", name: lb[0].name, icon: "🔥" } // Simplified for now
        ];
    }


}
// Global instance
window.gameEngine = new GameEngine();
