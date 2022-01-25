/** * 音声認識のインスタンス. */
const BGM_SW = new Audio('STAR WARS theme.mp3');
const BGM_DV = new Audio('Darth Vader.mp3');
let nowPlaying_SW = false;
let nowPlaying_DV = false;

function bgmSWStartButtonClick() {
    if (nowPlaying_DV) {
        BGM_DV.pause();
        BGM_DV.currentTime = 0;
        nowPlaying_DV = false;
    }
    BGM_SW.volume = 0.4;
    BGM_SW.play();
    nowPlaying_SW = true;
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Luke Skywalker".split('');
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
    }
    BGM_DV.volume = 0.4;
    BGM_DV.play();
    nowPlaying_DV = true;
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "Darth Vader".split('');
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
        document.getElementById('stopButton').onclick = bgmStopButtonClick;
    });
});
