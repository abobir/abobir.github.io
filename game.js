class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.audio = new AudioManager();
        
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        this.paddleHeight = this.canvas.height * 0.15;
        this.paddleWidth = this.canvas.width * 0.02;
        this.ballSize = this.canvas.width * 0.02;
        
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameStarted = false;
        
        // Player paddle
        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 0
        };
        
        // AI paddle
        this.aiPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: this.canvas.height * 0.01
        };
        
        this.resetBall();
    }

    resetBall() {
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speedX: this.canvas.width * 0.007,
            speedY: this.canvas.height * 0.007
        };
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.gameStarted = true;
            this.audio.audioContext.resume();
            document.getElementById('startButton').style.display = 'none';
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const relativeY = touch.clientY - rect.top;
            
            if (touch.clientX < window.innerWidth / 2) {
                this.playerPaddle.y = relativeY - this.paddleHeight / 2;
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const relativeY = touch.clientY - rect.top;
            
            if (touch.clientX < window.innerWidth / 2) {
                this.playerPaddle.y = relativeY - this.paddleHeight / 2;
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.paddleHeight = this.canvas.height * 0.15;
            this.paddleWidth = this.canvas.width * 0.02;
            this.ballSize = this.canvas.width * 0.02;
        });
    }

    update() {
        if (!this.gameStarted) return;

        // Update ball position
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.speedY *= -1;
            this.audio.playSound('wall');
        }

        // Ball collision with paddles
        if (this.ball.x <= this.paddleWidth && 
            this.ball.y >= this.playerPaddle.y && 
            this.ball.y <= this.playerPaddle.y + this.paddleHeight) {
            this.ball.speedX *= -1;
            this.audio.playSound('paddle');
        }

        if (this.ball.x >= this.canvas.width - this.paddleWidth && 
            this.ball.y >= this.aiPaddle.y && 
            this.ball.y <= this.aiPaddle.y + this.paddleHeight) {
            this.ball.speedX *= -1;
            this.audio.playSound('paddle');
        }

        // Score points
        if (this.ball.x <= 0) {
            this.aiScore++;
            this.audio.playSound('score');
            this.resetBall();
            document.getElementById('aiScore').textContent = this.aiScore;
        }
        if (this.ball.x >= this.canvas.width) {
            this.playerScore++;
            this.audio.playSound('score');
            this.resetBall();
            document.getElementById('playerScore').textContent = this.playerScore;
        }

        // AI movement
        const aiCenter = this.aiPaddle.y + this.paddleHeight / 2;
        if (this.ball.y > aiCenter) {
            this.aiPaddle.y += this.aiPaddle.speed;
        } else {
            this.aiPaddle.y -= this.aiPaddle.speed;
        }

        // Keep paddles in bounds
        this.playerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.playerPaddle.y));
        this.aiPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.aiPaddle.y));
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#ff1b8d';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw paddles
        this.ctx.fillStyle = '#00fff9';
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.y, this.paddleWidth, this.paddleHeight);

        // Draw ball
        this.ctx.fillStyle = '#9a1fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new PongGame();
    game.gameLoop();
});
