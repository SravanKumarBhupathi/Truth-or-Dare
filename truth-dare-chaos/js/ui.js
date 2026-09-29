/**
 * TRUTH × DARE: CHAOS MODE
 * UI Rendering and Screen Management
 */

const UI = {
    // --- Screen Management ---

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });

        // Show target screen
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            // Slight delay to allow display block to apply before opacity transition
            setTimeout(() => {
                target.classList.add('active');
            }, 10);
        }

        this.updateHeaderVisibility(screenId);
    },

    updateHeaderVisibility(screenId) {
        const header = document.getElementById('game-header');
        // Hide header on Home and Transition screens for full immersion
        if (screenId === 'screen-home' || screenId === 'screen-transition') {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    },

    // --- Modal Management ---

    showModal(contentHTML) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');

        content.innerHTML = contentHTML;
        overlay.classList.remove('hidden');
    },

    hideModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.add('hidden');
    },

    showAlert(title, message) {
        this.showModal(`
            <h3>${title}</h3>
            <p style="margin: 16px 0;">${message}</p>
            <button class="btn btn-primary" onclick="UI.hideModal()">OK</button>
        `);
    },

    showConfirm(title, message, onConfirm) {
        this.showModal(`
            <h3>${title}</h3>
            <p style="margin: 16px 0;">${message}</p>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="UI.hideModal()">CANCEL</button>
                <button class="btn btn-primary" id="modal-confirm-btn">CONFIRM</button>
            </div>
        `);
        // We defer binding to ensure DOM is updated, though innerHTML is sync.
        document.getElementById('modal-confirm-btn').onclick = () => {
            UI.hideModal();
            if(onConfirm) onConfirm();
        };
    },

    // --- Component Rendering ---

    renderPlayersList(players) {
        const container = document.getElementById('players-list');
        container.innerHTML = '';

        players.forEach(p => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <div class="avatar">${p.avatar}</div>
                <div class="name">${p.name}</div>
                <div style="font-size: 0.8rem; color: #888;">${p.personality}</div>
                <button class="remove-btn" onclick="app.removePlayer('${p.id}')">×</button>
            `;
            container.appendChild(card);
        });

        // Update Next button state
        const nextBtn = document.getElementById('btn-setup-next');
        if (players.length >= 2) {
            nextBtn.disabled = false;
            nextBtn.innerText = 'NEXT';
        } else {
            nextBtn.disabled = true;
            nextBtn.innerText = `NEXT (Need 2+)`;
        }
    },

    renderTransitionScreen(player, onComplete) {
        document.getElementById('transition-avatar').innerText = player.avatar;
        document.getElementById('transition-name').innerText = player.name;

        this.showScreen('screen-transition');

        const countdownEl = document.getElementById('transition-countdown');
        let count = 3;
        countdownEl.innerText = count;

        const iv = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else {
                clearInterval(iv);
                countdownEl.innerText = "YOUR TURN";
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 1000);
            }
        }, 800);
    },

    renderChallengeCard(challenge, player, score) {
        document.getElementById('hud-player').innerText = `${player.avatar} ${player.name}`;
        document.getElementById('hud-score').innerText = `Score: ${score}`;

        // Reset Card UI
        const cardEl = document.getElementById('challenge-card');
        Animations.flipCard(cardEl, 'front'); // Ensure it's facing front

        // Populate Data
        let typeStr = "";
        let color = "var(--color-primary)";
        if (challenge.type === 'truth') { typeStr = "🧠 TRUTH"; color = "#ff5500"; }
        if (challenge.type === 'dare') { typeStr = "🔥 DARE"; color = "#cc0000"; }

        document.getElementById('card-type').innerText = typeStr;
        document.getElementById('card-type').style.color = color;

        document.getElementById('card-level').innerText = challenge.points ? `+${challenge.points} PTS` : '';
        document.getElementById('card-category').innerText = challenge.category ? challenge.category.toUpperCase() : '';

        // Hide Text initially for reveal effect
        const textEl = document.getElementById('challenge-text');
        textEl.innerText = "???";

        // Reset buttons
        document.getElementById('challenge-pre-actions').classList.remove('hidden');
        document.getElementById('challenge-active-actions').classList.add('hidden');

        // Timer container
        document.getElementById('card-timer-container').classList.add('hidden');

        this.showScreen('screen-challenge');
    },

    revealChallengeText(challenge) {
        const textEl = document.getElementById('challenge-text');
        textEl.innerText = challenge.processedText || challenge.text;
        Animations.popOut(textEl);
    },

    renderEventScreen(event) {
        document.getElementById('event-icon').innerText = event.icon;
        document.getElementById('event-name').innerText = event.name;
        document.getElementById('event-desc').innerText = event.desc;
        this.showScreen('screen-event');
    },

    renderMysteryScreen() {
        document.getElementById('mystery-box-container').classList.remove('hidden');
        document.getElementById('mystery-reward').classList.add('hidden');
        document.getElementById('btn-mystery-continue').classList.add('hidden');
        this.showScreen('screen-mystery');
    },

    revealMysteryReward(reward) {
        document.getElementById('mystery-box-container').classList.add('hidden');

        const rewardEl = document.getElementById('mystery-reward');
        document.getElementById('reward-icon').innerText = reward.icon;
        document.getElementById('reward-name').innerText = reward.name;
        document.getElementById('reward-desc').innerText = reward.desc;

        rewardEl.classList.remove('hidden');
        Animations.popOut(rewardEl);

        setTimeout(() => {
            document.getElementById('btn-mystery-continue').classList.remove('hidden');
        }, 1000);
    },

    renderResults(leaderboard, funStats) {
        const container = document.getElementById('leaderboard');
        container.innerHTML = '';

        leaderboard.forEach((p, idx) => {
            const el = document.createElement('div');
            el.className = `leaderboard-item ${idx === 0 ? 'rank-1' : ''}`;
            let rankIcon = `#${idx+1}`;
            if(idx===0) rankIcon = '🏆';
            if(idx===1) rankIcon = '🥈';
            if(idx===2) rankIcon = '🥉';

            el.innerHTML = `
                <span>${rankIcon} ${p.avatar} ${p.name}</span>
                <span>${p.score} pts</span>
            `;
            container.appendChild(el);
        });

        const statsContainer = document.getElementById('fun-stats');
        statsContainer.innerHTML = '';
        funStats.forEach(stat => {
            statsContainer.innerHTML += `
                <div class="stat-card">
                    <div class="stat-icon">${stat.icon}</div>
                    <div class="stat-title">${stat.title}</div>
                    <div class="stat-name">${stat.name}</div>
                </div>
            `;
        });

        this.showScreen('screen-results');
    },

    updateSettingsUI(settings) {
        if(!settings) return;
        document.getElementById('set-sound').checked = settings.sound;
        document.getElementById('set-anim').checked = settings.animations;
        document.getElementById('set-trust').checked = settings.trustSystem;
        document.getElementById('set-chaos').checked = settings.chaosEvents;
        document.getElementById('set-rounds').value = settings.maxRounds;
    }
};

window.UI = UI;
