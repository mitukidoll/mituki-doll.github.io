const heroTitle = document.getElementById("heroTitle");

const targetText = "Okami";
const glitchChars = "!@#$%&?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

setTimeout(() => {
    // RGBグリッチ開始
    heroTitle.classList.add("glitch");

    const duration = 800;
    const startTime = performance.now();

    function updateGlitch(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let result = "";

        for (let i = 0; i < targetText.length; i++) {

            // 左側の文字から徐々に確定
            const threshold = i / targetText.length;

            if (progress > threshold + 0.25) {
                result += targetText[i];
            } else {
                result += glitchChars[
                    Math.floor(Math.random() * glitchChars.length)
                ];
            }
        }

        heroTitle.textContent = result;

        if (progress < 1) {
            requestAnimationFrame(updateGlitch);
        } else {
            // 最終状態
            heroTitle.textContent = targetText;
            heroTitle.classList.remove("glitch");
        }
    }

    requestAnimationFrame(updateGlitch);

}, 10000);

const slides = document.querySelectorAll(".gallery-slide");

let currentSlide = 0;

setInterval(() => {
    slides[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add("active");
}, 3000);
