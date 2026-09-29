/**
 * TRUTH × DARE: CHAOS MODE
 * Animations & Timer Layer
 */

const Animations = {
    wheelRotation: 0,

    drawWheelSegments(wheelEl, mode) {
        wheelEl.innerHTML = ''; // Clear

        let segments = [];
        if (mode === 'chaos') {
            segments = [
                { text: 'TRUTH', color: '#ff5500' },
                { text: 'DARE', color: '#cc0000' },
                { text: 'CHAOS', color: '#6600cc' },
                { text: 'DARE', color: '#cc0000' },
                { text: 'MYSTERY', color: '#00cc66' },
                { text: 'TRUTH', color: '#ff5500' }
            ];
        } else {
            segments = [
                { text: 'TRUTH', color: '#ff5500' },
                { text: 'DARE', color: '#cc0000' },
                { text: 'TRUTH', color: '#ff5500' },
                { text: 'DARE', color: '#cc0000' }
            ];
        }

        const total = segments.length;
        const sliceAngle = 360 / total;

        segments.forEach((seg, index) => {
            const div = document.createElement('div');
            div.className = 'wheel-segment';
            div.style.backgroundColor = seg.color;
            div.innerText = seg.text;

            // Mathematical magic to create slices
            const rot = index * sliceAngle;
            const skew = 90 - sliceAngle;

            // Adjust basic polygon logic depending on segments
            if (total === 4) {
                div.style.clipPath = `polygon(50% 50%, 100% 0, 100% 100%)`;
                div.style.transform = `rotate(${rot - 45}deg)`;
            } else if (total === 6) {
                // Approximate 6 slice using clip path (custom polygon needed)
                div.style.clipPath = `polygon(100% 50%, 50% 50%, 50% 0, 100% 0)`; // simple approximation for now
                div.style.transform = `rotate(${rot}deg) skewY(${-(90-sliceAngle)}deg)`;
                div.style.padding = '0';

                // Content needs counter rotation
                const span = document.createElement('span');
                span.innerText = seg.text;
                span.style.transform = `skewY(${90-sliceAngle}deg) rotate(${sliceAngle/2}deg)`;
                span.style.position = 'absolute';
                span.style.right = '10px';
                span.style.top = '20px';

                div.innerText = '';
                div.appendChild(span);
            }

            wheelEl.appendChild(div);
        });
    },

    spinWheel(wheelEl, targetResult, onComplete) {
        // We know targetResult ('truth', 'dare', 'chaos', 'mystery')
        // Fake the visual stop angle based on result
        let targetAngles = [];
        // Assuming 4 or 6 segments based on drawWheelSegments logic.
        // For simplicity, just pick a random large rotation and resolve result via text.

        const extraSpins = 3 + Math.floor(Math.random() * 3);
        const randomDegreeOffset = Math.floor(Math.random() * 360);

        this.wheelRotation += (extraSpins * 360) + randomDegreeOffset;

        wheelEl.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
        wheelEl.style.transform = `rotate(${this.wheelRotation}deg)`;

        // Play sound if enabled
        if (window.app && window.app.playSound) {
            window.app.playSound('spin'); // hypothetical
        }

        setTimeout(() => {
            if (onComplete) onComplete(targetResult);
        }, 3100);
    },

    // --- Cards and Transitions ---

    flipCard(cardEl, direction = 'front') {
        if (!Storage.getSettings().animations) return;

        if (direction === 'back') {
            cardEl.style.transform = 'rotateY(180deg)';
        } else {
            cardEl.style.transform = 'rotateY(0deg)';
        }
    },

    popOut(element, delay = 0) {
        if (!Storage.getSettings().animations) {
            element.classList.remove('hidden');
            return;
        }

        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        element.classList.remove('hidden');

        setTimeout(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, delay);
    },

    shake(element) {
        if (!Storage.getSettings().animations) return;
        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 500 });
    },

    // --- Timer Logic ---

    timerInterval: null,

    startTimer(seconds, displayEl, onComplete) {
        clearInterval(this.timerInterval);
        let timeLeft = seconds;
        displayEl.innerText = timeLeft;

        // Show element if hidden
        displayEl.parentElement.classList.remove('hidden');

        this.timerInterval = setInterval(() => {
            timeLeft--;
            displayEl.innerText = timeLeft;

            // Visual cue when time is low
            if (timeLeft <= 5 && timeLeft > 0) {
                displayEl.style.color = '#ff0000';
                this.shake(displayEl);
                if (window.app && window.app.playSound) window.app.playSound('tick');
            }

            if (timeLeft <= 0) {
                this.stopTimer();
                displayEl.innerText = "TIME'S UP!";
                if (window.app && window.app.playSound) window.app.playSound('buzzer');
                if (onComplete) onComplete();
            }
        }, 1000);
    },

    stopTimer(displayElContainer) {
        clearInterval(this.timerInterval);
        if (displayElContainer) {
            displayElContainer.classList.add('hidden');
            // reset color
            const displayEl = displayElContainer.querySelector('#timer-display');
            if(displayEl) displayEl.style.color = '';
        }
    }
};

window.Animations = Animations;
