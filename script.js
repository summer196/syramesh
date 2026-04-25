// Mengambil elemen dari HTML
const target = document.getElementById('target');
const scoreElement = document.getElementById('score');
const gameArea = document.getElementById('game-area');

let score = 0;
let moveInterval;

// Fungsi saat pita diklik
target.addEventListener('click', (event) => {
    score++;
    scoreElement.textContent = score;
    moveTarget(); // Pindahkan pita ke tempat baru
    createSparkle(event.clientX, event.clientY); // Munculkan efek bintang
});

// Fungsi untuk memindahkan pita secara acak di dalam kotak
function moveTarget() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    
    // Kita kurangi sedikit ukurannya agar pita tidak keluar batas kotak
    const maxX = areaWidth - 50; 
    const maxY = areaHeight - 50;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX + 25}px`;
    target.style.top = `${randomY + 25}px`;
}

// Fungsi membuat efek bintang (sparkle) saat diklik
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x - 10}px`;
    sparkle.style.top = `${y - 10}px`;
    sparkle.style.pointerEvents = 'none'; // Supaya tidak mengganggu klik
    sparkle.style.animation = 'floatUp 0.8s ease-out forwards';
    sparkle.style.fontSize = '1.5em';
    sparkle.style.zIndex = '999';
    
    document.body.appendChild(sparkle);

    // Hapus elemen bintang setelah animasinya selesai
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// Menambahkan CSS untuk animasi bintang secara dinamis dari JS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
    }
`;
document.head.appendChild(style);

// Tantangan: Pita akan berpindah sendiri setiap 1.2 detik!
moveInterval = setInterval(moveTarget, 1200);