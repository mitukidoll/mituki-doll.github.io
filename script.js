const heroTitle = document.getElementById("heroTitle");
const nameSpan = heroTitle.querySelector("span");

const originalText = "Mituki";
const targetText = "Okami";

// Characters used during corruption
const glitchChars = "!@#$%&?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789░▒▓█";

function randomGlitchText(length) {
    return Array.from({ length }, () =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
    ).join("");
}

function glitchTo(target) {
    heroTitle.classList.add("glitch");

    let count = 0;
    const duration = 600;
    const interval = 50;
    const steps = duration / interval;

    const timer = setInterval(() => {
        count++;

        if (count >= steps) {
            clearInterval(timer);

            // Final text
            nameSpan.textContent = target;
            heroTitle.classList.remove("glitch");

            return;
        }

        // Gradually reveal the target text
        const progress = count / steps;
        const revealed = Math.floor(target.length * progress);

        let result = "";

        for (let i = 0; i < target.length; i++) {
            if (i < revealed) {
                result += target[i];
            } else {
                result += glitchChars[
                    Math.floor(Math.random() * glitchChars.length)
                ];
            }
        }

        nameSpan.textContent = result;

    }, interval);
}

// 30 seconds after page load
setTimeout(() => {
    glitchTo(targetText);
}, 10000);