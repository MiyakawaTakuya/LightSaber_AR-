/** * 音声認識のインスタンス. */
const BGM_SW = new Audio('STAR WARS theme.mp3');
const BGM_DV = new Audio('Darth Vader.mp3');
const BGM_Goku = new Audio('chara.mp3');
let nowPlaying_SW = false;
let nowPlaying_DV = false;
let nowPlaying_Goku = false;   //test用でtrueにする

function bgmSWStartButtonClick() {
    if (nowPlaying_DV) {
        BGM_DV.pause();
        BGM_DV.currentTime = 0;
        nowPlaying_DV = false;
    } else if (nowPlaying_Goku) {
        BGM_Goku.pause();
        BGM_Goku.currentTime = 0;
        nowPlaying_Goku = false;
    }
    BGM_SW.volume = 0.4;
    BGM_SW.play();
    nowPlaying_SW = true;
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Let's give it a thumbs up.".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 60);
        }
        elm.innerHTML = '';
        showMessage(texts, resolve);
    });
}
function bgmDVStartButtonClick() {
    if (nowPlaying_SW) {
        BGM_SW.pause();
        BGM_SW.currentTime = 0;
        nowPlaying_SW = false;
    } else if (nowPlaying_Goku) {
        BGM_Goku.pause();
        BGM_Goku.currentTime = 0;
        nowPlaying_Goku = false;
    }
    BGM_DV.volume = 0.4;
    BGM_DV.play();
    nowPlaying_DV = true;
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Let's give it a thumbs up.".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 60);
        }
        elm.innerHTML = '';
        showMessage(texts, resolve);

    });
}



function bgmGokuStartButtonClick() {
    if (nowPlaying_SW) {
        BGM_SW.pause();
        BGM_SW.currentTime = 0;
        nowPlaying_SW = false;
    } else if (nowPlaying_DV) {
        BGM_DV.pause();
        BGM_DV.currentTime = 0;
        nowPlaying_DV = false;
    }
    BGM_Goku.volume = 0.4;
    BGM_Goku.play();
    nowPlaying_Goku = true;
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Let's pose Kamehame_ha".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 60);
        }
        elm.innerHTML = '';
        showMessage(texts, resolve);
    });
}

function bgmStopButtonClick() {
    if (nowPlaying_DV) {
        BGM_DV.pause();
        BGM_DV.currentTime = 0;
        nowPlaying_DV = false;
    } else if (nowPlaying_SW) {
        BGM_SW.pause();
        BGM_SW.currentTime = 0;
        nowPlaying_SW = false;
    } else if (nowPlaying_Goku) {
        BGM_Goku.pause();
        BGM_Goku.currentTime = 0;
        nowPlaying_Goku = false;
    }
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Select your mode".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 60);
        }
        elm.innerHTML = '';
        showMessage(texts, resolve);
    });
}

/** * アプリ起動時に、説明を表示します. */
function startIntro() {
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Select your mode".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 60);
        }
        elm.innerHTML = '';
        showMessage(texts, resolve);
    });
}

/** * アプリを起動します. */
window.addEventListener('DOMContentLoaded', () => {
    // アプリの説明を行います.
    startIntro().then(() => {
        // ボタンの表示と挙動
        document.querySelector('.js-btn-group').classList.add('--visible');
        document.getElementById('SW_startButton').onclick = bgmSWStartButtonClick;
        document.getElementById('DV_startButton').onclick = bgmDVStartButtonClick;
        document.getElementById('Goku_startButton').onclick = bgmGokuStartButtonClick;
        document.getElementById('stopButton').onclick = bgmStopButtonClick;
    });
});
