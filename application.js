let spinCount = 0;
let bgMusicStarted = false;
let spinning = false;

function startBackgroundMusic() {
  const bgMusic = document.getElementById('bgMusic');
  if (!bgMusicStarted) {
    bgMusic.volume = 1.0;
    bgMusic.play();
    bgMusicStarted = true;
  }
}

function reduceBackgroundMusicVolume() {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusicStarted) {
    bgMusic.volume = Math.max(bgMusic.volume * 0.5, 0.05);
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const spinButton = document.querySelector('.spin-button');
  spinButton.classList.add('hide-animation');
  spinButton.disabled = true;

  // Fully hide after animation
  setTimeout(() => {
    spinButton.style.display = 'none';
  }, 500);

  startBackgroundMusic();
  reduceBackgroundMusicVolume();

  const wheel = document.getElementById('wheel');
  const pointer = document.querySelector('.pointer');
  const modal = document.getElementById('winModal');
  const retryModal = document.getElementById('retryModal');

  const clickSound = document.getElementById('clickSound');
  const spinSound = document.getElementById('spinSound');
  const modalSound = document.getElementById('modalSound');

  // Play click sound
  clickSound.currentTime = 0;
  clickSound.play();

  // Reset wheel and pointer
  wheel.style.transition = 'none';
  wheel.style.transform = 'rotate(0deg)';
  pointer.style.transition = 'none';
  pointer.style.transform = 'rotate(0deg)';

  setTimeout(() => {
    const rotations = 10;
    const targetAngle = spinCount === 0 ? 20 : 0;
    const totalDegrees = (rotations * 360) + targetAngle;

    wheel.style.transition = 'transform 4s ease-out';
    wheel.style.transform = `rotate(${totalDegrees}deg)`;

    pointer.style.transition = 'transform 4s ease-out';
    pointer.style.transform = `rotate(${-totalDegrees}deg)`;

    spinSound.currentTime = 0;
    spinSound.play();

    setTimeout(() => {
      spinSound.pause();
      spinSound.currentTime = 0;

      if (spinCount === 0) {
        retryModal.style.display = 'flex';
        modalSound.currentTime = 0;
        modalSound.play();
        spinCount++;
      } else {
        modal.style.display = 'flex';
        modalSound.currentTime = 0;
        modalSound.play();
        spinCount = 0;

        // 🎉 Confetti on win
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 2000
        });
      }
    }, 4000);
  }, 50);
}

// Reset for next spin
function enableSpinAgain() {
  spinning = false;
  const spinButton = document.querySelector('.spin-button');
  spinButton.classList.remove('hide-animation');
  spinButton.style.opacity = '1';
  spinButton.style.transform = 'translateX(-50%) scale(1)';
  spinButton.style.display = 'block';
  spinButton.disabled = false;
}

// Close modals
document.getElementById('winModal').addEventListener('click', function (e) {
  if (e.target === this) {
    this.style.display = 'none';
    enableSpinAgain();
  }
});

document.getElementById('retryModal').addEventListener('click', function (e) {
  if (e.target === this) {
    this.style.display = 'none';
    enableSpinAgain();
  }
});

// Retry click
function retrySpin() {
  reduceBackgroundMusicVolume();
  document.getElementById('retryModal').style.display = 'none';
  enableSpinAgain();
}

// Start music on first click
document.addEventListener('click', startBackgroundMusic, { once: true });

// Lower music when clicking key elements
document.addEventListener('click', function (e) {
  if (
    e.target.tagName === 'BUTTON' ||
    e.target.classList.contains('spin-button') ||
    e.target.classList.contains('try_again_button')
  ) {
    reduceBackgroundMusicVolume();
  }
});
