const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const newGameButton = document.getElementById('newGameButton');
const startGameButton = document.getElementById('startGameButton');
const scoreDisplay = document.getElementById('score');
const openingSlideshow = document.getElementById('openingSlideshow');
const endingVideo = document.getElementById('endingVideo');
const loadingMessage = document.getElementById('loadingMessage');
const backgroundMusic = document.getElementById('backgroundMusic');
let bullets = [];
let aliens = [];
let score = 0;
let gameRunning = false;

startGameButton.addEventListener('click', () => {
    startGameButton.style.display = 'none';
    loadingMessage.style.display = 'block';
    playOpeningSlideshow();
});

newGameButton.addEventListener('click', () => {
    gameRunning = true;
    newGameButton.style.display = 'none';
    startGameButton.style.display = 'block';
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.style.fontSize = '18px';
    scoreDisplay.style.backgroundColor = 'orange';
    while (bullets.length > 0) {
        bullets.pop().remove();
    }
    while (aliens.length > 0) {
        aliens.pop().remove();
    }
    backgroundMusic.currentTime = 0; // Reset music to start
    backgroundMusic.play(); // Start background music
});

function playOpeningSlideshow() {
    openingSlideshow.style.display = 'block';
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    const images = openingSlideshow.getElementsByTagName('img');
    let index = 0;
    const interval = setInterval(() => {
        images[index].style.display = 'none';
        index = (index + 1) % images.length;
        images[index].style.display = 'block';
    }, 10000 / images.length); // 10 seconds divided by number of images
    setTimeout(() => {
        clearInterval(interval);
        openingSlideshow.style.display = 'none';
        loadingMessage.style.display = 'none';
        gameRunning = true;
    }, 10000); // 10 seconds delay
}

function playEndingVideo() {
    endingVideo.style.display = 'block';
    endingVideo.play();
    gameContainer.style.display = 'none'; // Hide game container
    scoreDisplay.style.display = 'none'; // Hide score display
    newGameButton.style.display = 'block'; // Show new game button
    backgroundMusic.src = "music_end.mp3"; // Change to end game music
    backgroundMusic.play(); // Start end game music
    endingVideo.onended = () => {
        endingVideo.style.display = 'none';
        gameContainer.style.display = 'block';
        scoreDisplay.style.display = 'block';
        newGameButton.style.display = 'none';
        backgroundMusic.src = "music.mp3";
        backgroundMusic.loop = true; // Loop background music
        backgroundMusic.play(); // Restart background music
        setTimeout(() => {
            playOpeningSlideshow();
        }, 8000); // 8 seconds delay before starting new game
    };
}

// Move player with mouse or touch
document.addEventListener('mousemove', movePlayer);
document.addEventListener('touchmove', movePlayer);

function movePlayer(event) {
    if (gameRunning) {
        let posX = event.clientX || event.touches[0].clientX;
        let posY = event.clientY || event.touches[0].clientY;
        let rect = gameContainer.getBoundingClientRect();
        let offsetX = rect.left;
        let offsetY = rect.top;
        let playerX = posX - offsetX;
        let playerY = posY - offsetY;
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }
}

// Handle player shooting
document.addEventListener('click', shootBullet);
document.addEventListener('touchstart', shootBullet);

function shootBullet(event) {
    if (gameRunning) {
        let bullet = document.createElement('div');
        bullet.className = 'bullet';
        let rect = player.getBoundingClientRect();
        let playerX = rect.left + rect.width / 2;
        let playerY = rect.top;
        bullet.style.left = `${playerX}px`;
        bullet.style.top = `${playerY}px`;
        gameContainer.appendChild(bullet);
        bullets.push(bullet);
    }
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        // Move bullets
        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            let bulletY = parseFloat(bullet.style.top);
            bullet.style.top = `${bulletY - 10}px`; // Move bullet up
            // Remove bullet if out of screen
            if (bulletY < -bullet.offsetHeight) {
                bullet.remove();
                bullets.splice(i, 1);
                i--;
            }
        }

        // Spawn aliens
        if (Math.random() < 0.02) {
            let alien = document.createElement('div');
            alien.className = 'alien';
            let alienX = Math.random() * (gameContainer.offsetWidth - 150); // Max width - alien width
            alien.style.left = `${alienX}px`;
            alien.style.top = '0px';
            gameContainer.appendChild(alien);
            aliens.push(alien);
        }

        // Move aliens
        for (let i = 0; i < aliens.length; i++) {
            let alien = aliens[i];
            let alienY = parseFloat(alien.style.top);
            alien.style.top = `${alienY + 5}px`; // Move alien down
            let alienRect = alien.getBoundingClientRect();
            let playerRect = player.getBoundingClientRect();
            // Check collision between alien and player
            if (isColliding(alienRect, playerRect)) {
                handleCollision();
                break;
            }
            // Remove alien if out of screen
            if (alienY > gameContainer.offsetHeight) {
                alien.remove();
                aliens.splice(i, 1);
                i--;
            }
            // Check collision between bullets and aliens
            for (let j = 0; j < bullets.length; j++) {
                let bullet = bullets[j];
                let bulletRect = bullet.getBoundingClientRect();
                if (isColliding(bulletRect, alienRect)) {
                    bullet.remove();
                    bullets.splice(j, 1);
                    j--;
                    alien.remove();
                    aliens.splice(i, 1);
                    i--;
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    break;
                }
            }
        }

        requestAnimationFrame(gameLoop);
    }
}

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function handleCollision() {
    gameRunning = false;
    playEndingVideo();
}

// Start the game loop
gameLoop();
