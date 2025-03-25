const shortSounds = ['A', 'A2', 'O', 'O2', 'II', 'II2'];
const longSounds = ['IOOIAI', 'IOOIAI2'];
const mlgTexts = [
    'OOOOOOOOOOOOOOO!!!',
    'IIIIIIIIIIIIIIIII!!!',
    'AAAAAAAAAAAAAAAA!!!',
    'OOOIIIAAA!!!',
    'IIIOOOAAA!!!',
    'AAAOOOIII!!!'
];
let pressTimer;
let currentLongSound = null;
let isLongPressing = false;
let clickCount = 0;
let clickTimer = null;

const image = document.getElementById('oiiaImage');
const video = document.getElementById('oiiaVideo');
const container = document.querySelector('.container');

// 隨機選擇音效
function getRandomSound(sounds) {
    return sounds[Math.floor(Math.random() * sounds.length)];
}

// 隨機選擇 MLG 文字
function getRandomMlgText() {
    return mlgTexts[Math.floor(Math.random() * mlgTexts.length)];
}

// 創建彩虹背景
function createRainbowBackground() {
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow-bg';
    document.body.appendChild(rainbow);
    rainbow.addEventListener('animationend', () => {
        rainbow.remove();
    });
}

// 旋轉視窗效果
function rotateScreen() {
    document.body.classList.add('rotate-screen');
    setTimeout(() => {
        document.body.classList.remove('rotate-screen');
    }, 200);
}

// 創建浮動文字
function createFloatingText(text, isMLG = false) {
    const element = document.createElement('div');
    element.className = 'sound-text';
    element.textContent = isMLG ? text : text.repeat(3);
    
    // 隨機位置和移動
    const startX = Math.random() * window.innerWidth;
    const moveX = (Math.random() - 0.5) * 600;
    
    element.style.left = `${startX}px`;
    element.style.setProperty('--move-x', `${moveX}px`);
    
    document.body.appendChild(element);
    
    element.addEventListener('animationend', () => {
        element.remove();
    });
}

// 創建橫向移動文字
function createHorizontalText(text) {
    const element = document.createElement('div');
    element.className = 'horizontal-text';
    element.textContent = text.repeat(2);
    
    const top = Math.random() * (window.innerHeight - 50);
    element.style.top = `${top}px`;
    
    element.classList.add(Math.random() > 0.5 ? 'move-left' : 'move-right');
    
    document.body.appendChild(element);
    
    element.addEventListener('animationend', () => {
        element.remove();
    });
}

// 添加震動效果
function addShakeEffect() {
    image.classList.add('shake');
    setTimeout(() => {
        image.classList.remove('shake');
    }, 300);
}

// 處理連續點擊
function handleRapidClicks() {
    clickCount++;
    clearTimeout(clickTimer);
    
    if (clickCount >= 3) {
        createRainbowBackground();
        rotateScreen();
        createFloatingText(getRandomMlgText(), true);
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 500);
}

// 播放短音效
function playShortSound() {
    if (!isLongPressing) {
        const soundName = getRandomSound(shortSounds);
        const sound = new Audio(`${soundName}.MP3`);
        sound.play();
        
        // 添加視覺效果
        addShakeEffect();
        createFloatingText(soundName.replace('2', ''));
        createHorizontalText(soundName.replace('2', ''));
        handleRapidClicks();
    }
}

// 播放長音效
function playLongSound() {
    const soundName = getRandomSound(longSounds);
    currentLongSound = new Audio(`${soundName}.MP3`);
    currentLongSound.play();
    
    createRainbowBackground();
    rotateScreen();
    
    currentLongSound.addEventListener('ended', () => {
        if (isLongPressing) {
            stopLongPress();
        }
    });
}

// 開始長按
function startLongPress() {
    isLongPressing = true;
    image.style.display = 'none';
    video.style.display = 'block';
    video.play();
    playLongSound();
    
    // 定期產生 MLG 文字
    const mlgInterval = setInterval(() => {
        if (isLongPressing) {
            createFloatingText(getRandomMlgText(), true);
            createHorizontalText(getRandomMlgText());
        } else {
            clearInterval(mlgInterval);
        }
    }, 300);
}

// 停止長按
function stopLongPress() {
    isLongPressing = false;
    if (currentLongSound) {
        currentLongSound.pause();
        currentLongSound.currentTime = 0;
    }
    video.pause();
    video.currentTime = 0;
    video.style.display = 'none';
    image.style.display = 'block';
}

// 點擊事件
image.addEventListener('click', (e) => {
    if (!isLongPressing) {
        playShortSound();
    }
});

// 觸控事件
image.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(startLongPress, 500);
});

image.addEventListener('touchend', (e) => {
    clearTimeout(pressTimer);
    if (isLongPressing) {
        stopLongPress();
    }
});

// 滑鼠事件
image.addEventListener('mousedown', (e) => {
    pressTimer = setTimeout(startLongPress, 500);
});

image.addEventListener('mouseup', (e) => {
    clearTimeout(pressTimer);
    if (isLongPressing) {
        stopLongPress();
    }
});

// 防止拖曳圖片
image.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// 防止長按選單
image.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}); 