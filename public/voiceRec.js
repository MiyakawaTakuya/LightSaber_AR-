/** * 音声認識のインスタンス. */
let recognition;
const BGM_SW = new Audio('STAR WARS theme.mp3');
const BGM_DV = new Audio('Darth Vader.mp3');
let nowPlaying_SW = false;
let nowPlaying_DV = false;
// class Mode{


// }


/** * サーバー通信を行う. */
function api(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function (e) {
            if (this.readyState === 4 && this.status === 200) {
                resolve(this.responseText);
            }
        }
        xhr.send();
    });
}

/** * 開始ボタンを押した時のイベント. */
function handleStartButtonClick() {
    // 音声認識のインスタンスを生成.
    recognition = new webkitSpeechRecognition();
    // 言語は日本語.
    recognition.lang = 'ja';
    // 音声認識開始時のイベント.
    recognition.onstart = function () {
        console.log('onstart');
        document.querySelector('.js-btn-group').classList.add('--recording');
    };
    // 音声認識エラー発生時のイベント.
    recognition.onerror = function (event) {
        console.log('onerror:', event.error);
        document.querySelector('.js-btn-group').classList.remove('--recording');
    };
    // 音声認識終了時のイベント.
    recognition.onend = function () {
        console.log('onend');
        document.querySelector('.js-btn-group').classList.remove('--recording');
    };
    // 音声認識の結果を取得した時のイベント.
    recognition.onresult = event => {
        let text = event.results.item(0).item(0).transcript;
        let isFinal = event.results.item(0).isFinal;
        console.log('onresult: ', text, event.results);
        if (!isFinal) {
            return;
        }
        //「フォースと共にあれ」だとルークバージョンで先へ進む
        if (text.indexOf('フォース') !== -1 && text.indexOf('あれ') !== -1 && text.indexOf('あるな') === -1) {
            if (nowPlaying_DV) {
                BGM_DV.pause();
                BGM_DV.currentTime = 0;
                nowPlaying_DV = false;
            }
            BGM_SW.play();
            nowPlaying_SW = true;
            //「フォースと共にあるな」だとダースベイダーバージョンで先へ進む
        } else if (text.indexOf('フォース') !== -1 && text.indexOf('あるな') !== -1 && text.indexOf('あれ') === -1) {
            // showArchitectureNews();
            if (nowPlaying_SW) {
                BGM_SW.pause();
                BGM_SW.currentTime = 0;
                nowPlaying_SW = false;
            }
            BGM_DV.play();
            nowPlaying_DV = true;
        } else if (text.indexOf('ストップ') !== -1) {
            if (nowPlaying_SW) {
                BGM_SW.pause();
                BGM_SW.currentTime = 0;
                nowPlaying_SW = false;
            } else if (nowPlaying_DV) {
                BGM_DV.pause();
                BGM_DV.currentTime = 0;
                nowPlaying_DV = false;
            }
        } else {
            let synthes = new SpeechSynthesisUtterance('ごめんなさい、フォースの力を感じ取れませんでした');
            synthes.lang = "ja-JP";
            speechSynthesis.speak(synthes);
        }
    };

    // 音声認識を開始します.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.start();
}

/** * 停止ボタンを押した時のイベント. */
function handleStopButtonClick() {
    if (recognition) {
        recognition.stop();
    }
}

/** * アプリ起動時に、説明を表示します. */
function startIntro() {
    let elm = document.getElementById('text');
    return new Promise((resolve, reject) => {
        let texts = "フォースと共に...！！".split('');
        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 120);
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
        document.getElementById('startButton').onclick = handleStartButtonClick;
        document.getElementById('stopButton').onclick = handleStopButtonClick;
    });
});
