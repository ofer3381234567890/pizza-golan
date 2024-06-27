window.addEventListener('DOMContentLoaded', (event) => {
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
        };
    }

    // Move player with mouse or touch
    document.addEventListener('mousemove', movePlayer);
    document.addEventListener('touchmove', movePlayer);

    function movePlayer(event) {
        let x = event.clientX || event.touches[0].clientX;
        if (gameRunning) {
            player.style.left = `${x - player.offsetWidth / 2}px`;
        }
    }

    // Shoot on click or touch
    document.addEventListener('click', shoot);
    document.addEventListener('touchstart', shoot);

    function shoot(event) {
        if (gameRunning) {
            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            bullet.style.left = (player.offsetLeft + player.offsetWidth / 2 - 5) + 'px';
            bullet.style.bottom = '150px'; // Adjusted position for larger player
            gameContainer.appendChild(bullet);
            bullets.push(bullet);

            const moveBullet = setInterval(() => {
                bullet.style.bottom = (parseInt(bullet.style.bottom) + 5) + 'px';
                if (parseInt(bullet.style.bottom) > window.innerHeight) {
                    clearInterval(moveBullet);
                    bullet.remove();
                    bullets = bullets.filter(b => b !== bullet);
                }
                aliens.forEach(alien => {
                    if (isColliding(bullet, alien)) {
                        createExplosion(alien);
                        clearInterval(moveBullet);
                        bullet.remove();
                        bullets = bullets.filter(b => b !== bullet);
                        alien.remove();
                        aliens = aliens.filter(a => a !== alien);
                        increaseScore();
                    }
                });
            }, 10);
        }
    }

    // Spawn aliens every second
    setInterval(() => {
        if (gameRunning) {
            const alien = document.createElement('div');
            alien.className = 'alien';
            alien.style.top = '0px';
            alien.style.left = Math.random() * (window.innerWidth - 150) + 'px';
            gameContainer.appendChild(alien);
            aliens.push(alien);

            const moveAlien = setInterval(() => {
                alien.style.top = (parseInt(alien.style.top) + 2) + 'px'; // Adjusted speed
                if (parseInt(alien.style.top) > window.innerHeight) {
                    clearInterval(moveAlien);
                    alien.remove();
                    aliens = aliens.filter(a => a !== alien);
                }

                // Check collision with player
                if (isColliding(player, alien)) {
                    handleCollision();
                }
            }, 10);
        }
    }, 1000);

    function createExplosion(alien) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.position = 'absolute';
        explosion.style.width = '150px';
        explosion.style.height = '150px';
        explosion.style.backgroundImage = "url('explosion.gif')";
        explosion.style.backgroundSize = 'cover';
        explosion.style.left = alien.style.left;
        explosion.style.top = alien.style.top;
        gameContainer.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 1000);
    }

    function isColliding(a, b) {
        const rect1 = a.getBoundingClientRect();
        const rect2 = b.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function increaseScore() {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        if (score % 10 === 0) {
            scoreDisplay.style.fontSize = '24px';
            scoreDisplay.style.backgroundColor = 'green';
        } else {
            scoreDisplay.style.fontSize = '18px';
            scoreDisplay.style.backgroundColor = 'orange';
        }
    }

    function handleCollision() {
        gameRunning = false;
        playEndingVideo();
    }
});
