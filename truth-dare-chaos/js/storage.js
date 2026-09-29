/**
 * TRUTH × DARE: CHAOS MODE
 * LocalStorage wrapper
 */

const Storage = {
    // Keys
    KEYS: {
        PLAYERS: 'tdc_players',
        SETTINGS: 'tdc_settings',
        GAME_STATE: 'tdc_game_state',
        STATS: 'tdc_stats'
    },

    // Save data to localStorage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    },

    // Load data from localStorage
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error loading from localStorage', e);
            return defaultValue;
        }
    },

    // Remove specific key
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage', e);
        }
    },

    // Clear all game-related data
    clearAll() {
        Object.values(this.KEYS).forEach(key => this.remove(key));
    },

    // Specific Getters / Setters

    getPlayers() {
        return this.load(this.KEYS.PLAYERS, []);
    },

    savePlayers(players) {
        this.save(this.KEYS.PLAYERS, players);
    },

    getSettings() {
        return this.load(this.KEYS.SETTINGS, {
            sound: true,
            animations: true,
            trustSystem: true,
            chaosEvents: true,
            maxRounds: 10
        });
    },

    saveSettings(settings) {
        this.save(this.KEYS.SETTINGS, settings);
    },

    getGameState() {
        return this.load(this.KEYS.GAME_STATE, null);
    },

    saveGameState(state) {
        this.save(this.KEYS.GAME_STATE, state);
    },

    clearGameState() {
        this.remove(this.KEYS.GAME_STATE);
    },

    getStats() {
        return this.load(this.KEYS.STATS, {
            gamesPlayed: 0,
            totalChallengesCompleted: 0
        });
    },

    saveStats(stats) {
        this.save(this.KEYS.STATS, stats);
    },

    incrementStat(statName) {
        const stats = this.getStats();
        stats[statName] = (stats[statName] || 0) + 1;
        this.saveStats(stats);
    }
};

window.Storage = Storage;
