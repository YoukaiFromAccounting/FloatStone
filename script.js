class InteractiveScale {
    constructor() {
        this.leftWeight = 0;
        this.rightWeight = 0;
        this.targetWeight = 100;
        this.selectedBallWeight = 5;
        this.score = 0;
        this.leftBalls = [];
        this.rightBalls = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.generateNewTarget();
    }

    bindEvents() {
        // Platform click events for ball dropping
        document.getElementById('leftPlatform').addEventListener('click', (e) => {
            this.dropBall(e, 'left');
        });

        document.getElementById('rightPlatform').addEventListener('click', (e) => {
            this.dropBall(e, 'right');
        });

        // Ball selection events
        document.querySelectorAll('.ball-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectBall(option);
            });
        });

        // Control button events
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetScale();
        });

        document.getElementById('newTargetBtn').addEventListener('click', () => {
            this.generateNewTarget();
        });

        // Initialize first ball selection
        document.querySelector('.ball-option').classList.add('selected');
    }

    dropBall(event, side) {
        const ballWeight = this.selectedBallWeight;
        const scaleContainer = document.querySelector('.scale-container');
        const fallingBallsContainer = document.getElementById('fallingBalls');
        
        // Get click position relative to scale container
        const rect = scaleContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        
        // Create falling ball
        const fallingBall = document.createElement('div');
        fallingBall.className = 'falling-ball';
        
        // Set ball color based on weight
        if (ballWeight === 5) {
            fallingBall.style.background = 'radial-gradient(circle at 30% 30%, #FF6B6B, #FF4757)';
        } else if (ballWeight === 10) {
            fallingBall.style.background = 'radial-gradient(circle at 30% 30%, #4ECDC4, #26C6DA)';
        } else if (ballWeight === 20) {
            fallingBall.style.background = 'radial-gradient(circle at 30% 30%, #FFD93D, #FFC107)';
        }
        
        // Position ball at click location
        fallingBall.style.left = (clickX - 20) + 'px';
        fallingBall.style.top = '-50px';
        fallingBall.style.animation = 'ballFall 1s ease-in forwards';
        
        fallingBallsContainer.appendChild(fallingBall);
        
        // Remove falling ball and add to platform after animation
        setTimeout(() => {
            fallingBall.remove();
            this.addBall(side);
        }, 1000);
    }

    selectBall(selectedOption) {
        // Remove previous selection
        document.querySelectorAll('.ball-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        selectedOption.classList.add('selected');
        this.selectedBallWeight = parseInt(selectedOption.dataset.weight);
    }

    addBall(side) {
        const ballWeight = this.selectedBallWeight;
        
        if (side === 'left') {
            this.leftWeight += ballWeight;
            this.leftBalls.push(ballWeight);
            this.addBallVisual('leftPlatform', ballWeight);
        } else {
            this.rightWeight += ballWeight;
            this.rightBalls.push(ballWeight);
            this.addBallVisual('rightPlatform', ballWeight);
        }

        this.updateDisplay();
        this.updateScaleRotation();
        this.checkTarget();
    }

    addBallVisual(platformId, weight) {
        const platform = document.getElementById(platformId);
        let ballsContainer = platform.querySelector('.balls-container');
        
        if (!ballsContainer) {
            ballsContainer = document.createElement('div');
            ballsContainer.className = 'balls-container';
            platform.appendChild(ballsContainer);
        }

        const ball = document.createElement('div');
        ball.className = 'placed-ball';
        
        // Set ball color based on weight
        if (weight === 5) {
            ball.style.background = 'radial-gradient(circle at 30% 30%, #FF6B6B, #FF4757)';
        } else if (weight === 10) {
            ball.style.background = 'radial-gradient(circle at 30% 30%, #4ECDC4, #26C6DA)';
        } else if (weight === 20) {
            ball.style.background = 'radial-gradient(circle at 30% 30%, #FFD93D, #FFC107)';
        }

        ballsContainer.appendChild(ball);
    }

    updateDisplay() {
        document.getElementById('leftWeight').textContent = this.leftWeight;
        document.getElementById('rightWeight').textContent = this.rightWeight;
        document.getElementById('totalWeight').textContent = this.leftWeight + this.rightWeight;
        document.getElementById('score').textContent = this.score;
    }

    updateScaleRotation() {
        const scaleArm = document.querySelector('.scale-arm');
        const weightDifference = this.rightWeight - this.leftWeight;
        
        // Calculate rotation angle (max 15 degrees)
        const maxRotation = 15;
        const rotationAngle = Math.max(-maxRotation, Math.min(maxRotation, weightDifference * 0.3));
        
        scaleArm.style.transform = `rotate(${rotationAngle}deg)`;
    }

    checkTarget() {
        const totalWeight = this.leftWeight + this.rightWeight;
        const difference = Math.abs(totalWeight - this.targetWeight);
        
        if (difference === 0) {
            this.score += 100;
            this.showMessage('Perfect! +100 points!', 'success');
            setTimeout(() => this.generateNewTarget(), 2000);
        } else if (difference <= 5) {
            this.score += 50;
            this.showMessage('Very close! +50 points!', 'good');
            setTimeout(() => this.generateNewTarget(), 2000);
        } else if (difference <= 10) {
            this.score += 20;
            this.showMessage('Close! +20 points!', 'okay');
        }
        
        this.updateDisplay();
    }

    showMessage(text, type) {
        const existingMessage = document.querySelector('.game-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `game-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#2ecc71' : type === 'good' ? '#3498db' : '#f39c12'};
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: messagePopIn 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 2000);
    }

    resetScale() {
        this.leftWeight = 0;
        this.rightWeight = 0;
        this.leftBalls = [];
        this.rightBalls = [];

        // Clear visual balls
        document.querySelectorAll('.balls-container').forEach(container => {
            container.remove();
        });

        // Reset scale rotation
        document.querySelector('.scale-arm').style.transform = 'rotate(0deg)';

        this.updateDisplay();
    }

    generateNewTarget() {
        // Generate target weight between 20 and 200, in multiples of 5
        this.targetWeight = Math.floor(Math.random() * 37) * 5 + 20;
        document.getElementById('targetWeight').textContent = this.targetWeight;
        
        // Reset scale for new target
        this.resetScale();
    }
}

// Add CSS animation for message popup
const style = document.createElement('style');
style.textContent = `
    @keyframes messagePopIn {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveScale();
});
