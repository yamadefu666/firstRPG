"use strict";

//使用するフォント
const FONT = "48px monospase";
//仮想画面の高さと幅
const WIDTH = 256;
const HEIGHT = 256;

//ドットの補間
const SMOOTH =0;

//素材をどの単位で切り取るか(元画像からして32*32ドットか・・・？)
const TILESIZE = 32;

//実画面の高さと幅
let ctxWidth;
let ctxHeight;

//内部カウンタ（とりあえず置いとく）
let ctxFrame = 0;
//仮想画面
let ctxScreen;



///とりあえず草を生やす画像
let fieldImg1;

const drawMain = () =>{
    
    //仮想画面の2d描画コンテキストの取得
    const Vctx = ctxScreen.getContext("2d");

    for(let y = 0; y < 32; y++ ){
        for(let x = 0; x < 64; x++){
            Vctx.drawImage(fieldImg1, 0, 0, TILESIZE, TILESIZE, 0, 0, x * 32, y *32 );
        }
    }

    Vctx.font = FONT;
    Vctx.fillText("Hello World" + ctxFrame, ctxFrame/10, 64);

}
//描画関連
const WmPaint = () =>{

    drawMain();

    //maincanvasの要素を取得する
    const canvas = document.getElementById("main_canvas");
    //2d描画コンテキストを取得
    const ctx = canvas.getContext("2d");
    
    //仮想画面のイメージを実画面に転送する
    ctx.drawImage(ctxScreen, 0, 0, ctxScreen.width, ctxScreen.height, 0, 0, ctxWidth, ctxHeight);
    
}

//イベント発生時の処理
const WmTimer = ()=>{
    ctxFrame++;
    WmPaint(); 
}

//キャンバスの取得とサイズの設定
const WmSize = () =>{
    //maincanvasの要素を取得する
    const canvas = document.getElementById("main_canvas");
    //キャンバスの高さと幅をウインドウ全体に設定する
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = SMOOTH;

    //実際に描画する高さと幅を仮想画面の高さと幅を掛け算してアス比を保ったまま拡大  
    ctxWidth = canvas.width;
    ctxHeight = canvas.height;
    if(ctxWidth/WIDTH < ctxHeight/HEIGHT){
        ctxHeight = ctxWidth * HEIGHT/WIDTH;
    }else{
        ctxWidth = ctxHeight * WIDTH/HEIGHT;
    }
}


//onLoadイベントをwindow全体に設定する
window.addEventListener('load', () =>{

    //ロードのタイミングで草を生やす
    fieldImg1 = new Image();
    fieldImg1.src = "./image/mapImage1.png";
    
    //仮想画面
    ctxScreen = document.createElement("canvas");
    ctxScreen.width = WIDTH;
    ctxScreen.height = HEIGHT;
    //ロードのタイミングでcanvasのサイズを指定
    WmSize();
    //ブラウザのサイズに変更があるたびに、canvasのサイズを再設定（resizeイベント）
    window.addEventListener('resize', ()=>{WmSize()}, false);
    //40ms間隔でWmTimer関数を呼び出す
    setInterval(()=>{WmTimer()}, 40);
}, false);
    
