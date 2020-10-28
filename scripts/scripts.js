
//使用するフォント
const FONT = "48px monospase"
//内部カウンタ（とりあえず置いとく）
let ctxFrame = 0;

const WmTimer = () =>{
    //maincanvasの要素を取得する
    const canvas = document.getElementById('main_canvas');
    //2d描画コンテキストを取得
    const ctx = canvas.getContext('2d');

    // まず最初に画像の読み込みを開始する
    util.imageLoader('./image/viper.png', (loadedImage) => {
        // 引数経由で画像を受け取り変数に代入しておく
        image = loadedImage;
        // 初期化処理を行う
        initialize();
        // 描画処理を行う
        render();
    });
}

//onLoadイベントをwindow全体に設定する
window.addEventListener('load', () => {
    //40ms間隔でWmTimer関数を呼び出す
    setInterval(()=>{WmTimer()}, 40);
}, false);