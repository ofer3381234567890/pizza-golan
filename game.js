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
    newGameButton.style.display = 'none'; // Hide new game button
    backgroundMusic.src = "music_end.mp3"; // Change to end game music
    backgroundMusic.play(); // Start end game music
    setTimeout(() => {
        endingVideo.style.display = 'none';
        gameContainer.style.display = 'block';
        scoreDisplay.style.display = 'block';
        newGameButton.style.display = 'block';
        backgroundMusic.src = "music.mp3";
        backgroundMusic.loop = true; // Loop background music
        backgroundMusic.play(); // Restart background music
    }, 8000); // Wait 8 seconds
}

// Move player with mouse or touch
document.addEventListener('mousemove', movePlayer);
document.addEventListener('touchmove', movePlayer);

function movePlayer(event) {
    if (!gameRunning) return;
    let x = event.clientX || event.touches[0].clientX;
    x = Math.max(0, Math.min(window.innerWidth, x));
    player.style.left = `${x}px`;
}

// Start the game
playOpeningSlideshow();

// Example collision handling
function handleCollision() {
    gameRunning = false;
    playEndingVideo();
}
