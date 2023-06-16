const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

const stars = [] // Array that contains the stars
const FPS = 60  // Frames per second

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const x = canvas.width / 10; // Number of stars
const offscreenOffset = 50;

// Push stars to array
for (let i = 0; i < x; i++) {
    let vx = Math.random() * 2 - 1;
    let vy = Math.random() * 2 - 1;

    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2, // Increase the radius
        vx: vx,
        vy: vy,
        isShootingStar: false,
    });
}

// Add a new shooting star
function createShootingStar() {
    // Randomly choose starting edge: top (0), right (1), bottom (2), left (3)
    let edge = Math.floor(Math.random() * 4);

    let x, y, vx, vy;
    const maximumVelocity = 15
    const minimumVelocity = 10
    switch (edge) {
        case 0: // Top
            x = Math.random() * canvas.width;
            y = 0 - offscreenOffset;
            vx = Math.random() * maximumVelocity - minimumVelocity;
            vy = Math.random() * minimumVelocity;
            break;
        case 1: // Right
            x = canvas.width + offscreenOffset;
            y = Math.random() * canvas.height;
            vx = -Math.random() * minimumVelocity;
            vy = Math.random() * maximumVelocity - minimumVelocity;
            break;
        case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + offscreenOffset;
            vx = Math.random() * maximumVelocity - minimumVelocity;
            vy = -Math.random() * minimumVelocity;
            break;
        case 3: // Left
            x = 0 - offscreenOffset;
            y = Math.random() * canvas.height;
            vx = Math.random() * minimumVelocity;
            vy = Math.random() * maximumVelocity - minimumVelocity;
            break;
    }

    stars.push({
        x: x,
        y: y,
        radius: Math.random() * 2,
        vx: vx,
        vy: vy,
        isShootingStar: true,
        tailLength: 0,
    });
}

// Create a new shooting star randomly
const maxSSDelay_ms = 15000;
const minSSDelay_ms = 5000;
createShootingStar();
function scheduleNextStar() {
    setTimeout(function() {
        createShootingStar();
        scheduleNextStar();
    }, Math.random() * (maxSSDelay_ms - minSSDelay_ms) + minSSDelay_ms);
}
scheduleNextStar();


// Draw the scene
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        if (s.isShootingStar) {
            let gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.vx * 10, s.y + s.vy * 10);
            gradient.addColorStop(0, "rgba(255,255,255,0)"); // less bright at the beginning
            gradient.addColorStop(1, "rgba(255,255,255,1)"); // brighter at the tip

            ctx.strokeStyle = gradient;
            ctx.lineWidth = s.radius;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + s.vx * 10, s.y + s.vy * 10);
            ctx.stroke();
        } else {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    moveStars();
}


// Move the stars
function moveStars() {
    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        s.x += s.vx / FPS;
        s.y += s.vy / FPS;

        // Bounce off edges for regular stars
        if (!s.isShootingStar && (s.x < 0 || s.x > canvas.width)) s.vx = -s.vx;
        if (!s.isShootingStar && (s.y < 0 || s.y > canvas.height)) s.vy = -s.vy;

        // Remove shooting stars when they leave the screen
        if (s.isShootingStar && (s.x < -offscreenOffset || s.x > canvas.width + offscreenOffset || s.y < -offscreenOffset || s.y > canvas.height + offscreenOffset)) {
            stars.splice(i, 1);
            i--;
            x--;
        }
    }
}

// Update and draw
function tick() {
    draw();
    requestAnimationFrame(tick);
}

tick();

document.getElementById("message").addEventListener("click", function() {
    this.style.display = "none"; // Hide the message
    document.getElementById("scene").classList.add("show"); // Show the campfire scene
});
