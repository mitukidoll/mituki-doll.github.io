const heroTitle = document.getElementById("heroTitle");
const nameSpan = heroTitle.querySelector("span");

// ページを開いて30秒後
setTimeout(() => {

    // グリッチ開始
    heroTitle.classList.add("glitch");

    // 0.6秒後に名前を変更
    setTimeout(() => {
        nameSpan.textContent = "Okami";

        // グリッチ終了
        heroTitle.classList.remove("glitch");

    }, 600);

}, 10000);