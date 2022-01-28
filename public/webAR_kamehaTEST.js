//TODOこちらのファイルは未使用です 試験運転用で別ファイルとして作ってました。


//MediaPipeやOpenCVでの処理を記述
let canvasElement;
let canvasCtx;  //キャンバスコンテキストを使って絵を描く
let kameha;
let rect;
let ell_rect;
let ell_ratio;
let SE_flag = 0;
const SE_kameha = new Audio('kameha.mp3');

//初期化
window.onload = function () {
    //画像の読み込み
    kameha = document.getElementById('kameha');
    //ビデオ要素の取得
    let videoElement = document.getElementById('input_video');
    //表示用のCanvasを取得
    canvasElement = document.getElementById('output_canvas');
    //Canvas描画に関する情報にアクセス
    canvasCtx = canvasElement.getContext('2d');
    //HandTrackingを使用するための関連ファイルの取得と初期化
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    //手の認識に関するオプション
    if (!nowPlaying_Goku) {
        hands.setOptions({
            selfieMode: true,  //画像を左右反転
            maxNumHands: 1, //認識可能な手の最大数
            modelComplexity: 1,//精度に関する設定(0~1)
            minDetectionConfidence: 0.4,//手検出の信頼度 0〜1の値が帰ってきた時に幾つ以上の場合に手を判定するか
            minTrackingConfidence: 0.3,//手追跡の信頼度
            useCpuInference: false, //M1 MacのSafariの場合は1  crhomかfirefoxでやる
        });
    } else {  //悟空の時だけ２つの手を使うのでオプションを切り替える
        hands.setOptions({
            selfieMode: true,  //画像を左右反転
            maxNumHands: 2, //認識可能な手の最大数
            modelComplexity: 1,//精度に関する設定(0~1)
            minDetectionConfidence: 0.4,//手検出の信頼度 0〜1の値が帰ってきた時に幾つ以上の場合に手を判定するか
            minTrackingConfidence: 0.3,//手追跡の信頼度
            useCpuInference: false, //M1 MacのSafariの場合は1  crhomかfirefoxでやる
        });
    }

    //結果を処理する関数を登録
    hands.onResults(recv2Results);
    //カメラの初期化
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            //カメラの画像を用いて手の検出を実行
            await hands.send({ image: videoElement });  //videoElementの映像をハンドトラッキング処理に渡す
        },
        width: 1280, height: 720  //画像サイズを設定
    });
    //カメラの動作開始
    camera.start();
};

//results = MediaPipeによる手の検出結果 を利用する
function recv2Results(results) {
    let width = results.image.width;  //イメージの元画像お大きさ
    let height = results.image.height;
    //画像のサイズとcanbasのサイズが異なる場合はサイズを調整
    if (width != canvasElement.width) { //最初は一致しないので
        //入力画像と同じサイズのcanvas(描画領域)を用意
        canvasElement.width = width;
        canvasElement.height = height;
    }
    //以下canvasへの描画に関する記述 saveで始まりrestoreでおわる
    canvasCtx.save();
    //(カメラで取得した)画像を表示  →消すと白いキャンバスにひたすら手の動きが描画されていく 
    canvasCtx.drawImage(results.image, 0, 0, width, height);
    //2つ手を検出したならばtrue
    if (results.multiHandLandmarks.length == 2) {
        // console.log(results.multiHandLandmarks);
        cvFunction_kameha(results.multiHandLandmarks[0], results.multiHandLandmarks[1], width, height);
        //見つけた手の数だけ処理を繰り返す
        for (const landmarks of results.multiHandLandmarks) {
            //骨格を描画(MediaPipeのライブラリ) コメントアウトすれば表示せずに済む
            // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#040404', lineWidth: 1 });  //大きくすると線が太くなる
            //関節を描画(MediaPipeのライブラリ) コメントアウトすれば表示せずに済む
            // drawLandmarks(canvasCtx, landmarks, { color: '#000000', lineWidth: 1, radius: 2 });
        }
    }
    canvasCtx.restore();
}


//手の中心や傾きを計算  関節の点群データlandmarksは画像の各幅全体を1と置き換えたパラメーターになっている。配列で０番目から20番目までの値が入っている
function cvFunction_kameha(landmarksA, landmarksB, width, height) {
    //手の関節を保持する配列
    let points = [];
    //手のひらや親指の付け根付近以外の関節を取得
    for (var i = 5; i < 12; i++) {  //欲しい長方形に必要なlandmarksを拾う
        //0~1で表現されたx,yを画像のサイズに変換
        // if (i == 6 || i == 8 || i == 10 || i == 12){
        // if (i == 1 || i == 6 || i == 7 || i == 8) {
        points.push(landmarksA[i].x * width);
        points.push(landmarksA[i].y * height);
        points.push(landmarksB[i].x * width);
        points.push(landmarksB[i].y * height);
        // }
    }
    //点の集まりをOpenCVで扱えるデータフォーマットmatに変換         
    // let mat = cv.matFromArray(points.length / 2, 1, cv.CV_32SC2, points);
    let ell_mat = cv.matFromArray(points.length / 2, 1, cv.CV_32SC2, points);
    // 6.8.10.12にフィットする四角形を計算 
    // rect = cv.boundingRect(mat);
    // mat.delete();
    //楕円 後世には５点以上必要
    ell_rect = cv.fitEllipse(ell_mat);
    ell_mat.delete();
    // console.log(ell_rect);

    // console.log(rect);

    //メモリの解放(変数定義するとメモリを消費しているので不要になったら消す)


    //両腕の手首の距離
    let dx = (landmarksA[1].x - landmarksB[1].x) * width;
    let dy = (landmarksA[1].y - landmarksB[1].y) * height;
    let distance1 = Math.sqrt(dx * dx + dy * dy);
    // 人差し指から小指までの距離
    dx = (landmarksA[8].x - landmarksB[8].x) * width;
    dy = (landmarksA[8].y - landmarksB[8].y) * height;
    let distance2 = Math.sqrt(dx * dx + dy * dy);
    // //
    ell_ratio = distance2 / distance1;
    // console.log(ell_ratio);
    // //0.6:close, 1.3:sumb up 閉じる条件は少し甘めに0.9にする
    // //0.9~1.3を0~1に正規化
    let close = 1.4;
    let open = 3;
    // ell_ratio = (Math.max(close, Math.min(open, ell_ratio)) - close) / (open - close);//map(ratio,0.9,1.3,0,1,true);
    console.log(ell_ratio);
    // //モードに入っている時(どちらかのBGMが流れているときに)
    if (nowPlaying_Goku == true) {
        // 開き具合によってカメハメは起動音を出す。
        if (ell_ratio > 3) {
            drawKamehameha();
            kameha_SE();
            // isStandingThumb = true;
        } else if (ell_ratio < 2) {  //閉じたらリセット
            SE_flag = 0;
            // isStandingThumb = false;
        }
    }
}

//かめはめ波を表示
function drawKamehameha() {  //画像、位置X、位置Y、横幅、縦幅
    //楕円の角度
    // let angle = ell_rect.angle;
    let angle = ell_rect.angle + 90;
    //ライトセイバーの向きを反転 openCVは第２.３象限でしか角度判定できない 
    if (angle < 90) { angle = angle + 180; }
    //デフォルトサイズを元画像の２倍くらいにしたい  ratioをかけることで親指の立ち具合で大きさが変わるようになった
    let mul = 3.0 * (ell_rect.size.width * 1.5) / kameha.width;
    //位置指定
    canvasCtx.translate(ell_rect.center.x, ell_rect.center.y);
    //角度指定
    canvasCtx.rotate(angle * Math.PI / 180.0); //openCVの角度は°でcanvasはラジアン
    //楕円を描画
    canvasCtx.beginPath();    //複数の点をつなぐ線を書くよの宣言
    canvasCtx.ellipse(0, 0,   //位置 楕円そのものでは位置指定せず、全体のオブジェクトに対してtranslate()で指定する
        ell_rect.size.width / 2.0, ell_rect.size.height / 2.0,  //半径
        0, 90, 2 * Math.PI);    //角度と表示の開始・終了
    // ellipse(中心のx座標, 中心のy座標, x方向の半径, y方向の半径,傾き, 開始角度, 終了角度, [回転方向]);
    // canvasCtx.stroke();  //線で書くよ
    //デフォルトサイズに倍数をかける
    canvasCtx.scale(mul, mul);
    canvasCtx.drawImage(kameha, -kameha.width / 2.0, -kameha.width / 12.0, kameha.width, kameha.height); //画像の位置をあらかじめx方向に半分ずらす
}

//ライトセイバー起動時の一回のみ効果音
function kameha_SE() {
    if (SE_flag == 0) {
        console.log("kameha_SE");
        SE_kameha.play();
        SE_flag++;
        console.log(SE_flag);
    }
}
