class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.initializeSounds();
    }

    async initializeSounds() {
        // Paddle hit sound
        this.sounds.paddle = await this.createOscillator(200, 'square', 0.1);
        // Wall hit sound
        this.sounds.wall = await this.createOscillator(300, 'sine', 0.1);
        // Score sound
        this.sounds.score = await this.createOscillator(400, 'triangle', 0.2);
    }

    async createOscillator(frequency, type, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.value = 0.1;
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return {
            play: () => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = type;
                osc.frequency.value = frequency;
                
                gain.gain.value = 0.1;
                gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.start();
                osc.stop(this.audioContext.currentTime + duration);
            }
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
}
