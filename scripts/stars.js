const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

var stars = [], // Array that contains the stars
    FPS = 60, // Frames per second
    x = canvas.width; // Number of stars

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Push stars to array

for (let i = 0; i < x; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random(),
        vx: Math.floor(Math.random() * 10) - 5,
        vy: Math.floor(Math.random() * 10) - 5
    });
}

// Draw the scene

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.globalCompositeOperation = "lighter";

    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fill();

    moveStars();
}

// Move the stars

function moveStars() {
    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        s.x += s.vx / FPS;
        s.y += s.vy / FPS;

        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
    }
}

// Update and draw

function tick() {
    draw();
    requestAnimationFrame(tick);
}

tick();
