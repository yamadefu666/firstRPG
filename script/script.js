"use strict";

/**
 * キーの押下状態を調べるためのオブジェクト
 * このオブジェクトはプロジェクトのどこからでも参照できるように
 * window オブジェクトのカスタムプロパティとして設定する
 * @global
 * @type {object}
*/
window.isKeyDown = {};

//PCのデカさ
const CHARHEIGHT = 32;
const CHARWIDTH = 16;
//使用するフォント
const FONT = "48px monospase";
//仮想画面の高さと幅
const WIDTH = 560;
const HEIGHT = 304;

//マップを32タイル×32タイルで描画する
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

//ドットの補間
const SMOOTH =0;

//素材をどの単位で切り取るか(元画像からして16*16ドットか・・・？)
const TILESIZE = 16;

/**
 * 元画像を16*16を1マスとした時
 * @param {number} -TILECOLMUN -タイル列数
 * @param {number} -TILEROW -タイル行数
 */
const TILECOLMUN = 16;
const TILEROW = 24;

//実画面の高さと幅
let ctxWidth;
let ctxHeight;

//内部カウンタ（とりあえず置いとく）
let ctxFrame = 0;
//仮想画面
let ctxScreen;
//とりあえず草を生やす画像
let fieldImg1;
//PCの画像
let playerImg;

//PCの座標
let PlayerX = 5;
let PlayerY = 0;

//イメージのパス
const fieldImgPath1 = "./image/mapImage1.png";
const playerImgPath = "./image/character01.png";

//マップ
const gameMap = [
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0, 36, 37, 38, 39,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0, 52, 53, 54, 55,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0, 68, 69, 70, 71,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0, 84, 85, 86, 87,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 40, 43,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 88, 91,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
]

const drawMain = () =>{
    
    //仮想画面の2d描画コンテキストの取得
    const Vctx = ctxScreen.getContext("2d");
    

    //マップの描画
    for(let y = 0; y < 64; y++ ){
        for(let x = 0; x < 64; x++){
            let px = PlayerX + x;
            let py = PlayerY + y;
            drawTile(Vctx, x * TILESIZE, y * TILESIZE, gameMap[ py * MAP_WIDTH + px]);
        }
    }
    
    Vctx.fillStyle = "#ff0000";
    Vctx.fillRect(0, HEIGHT/2 - 1, WIDTH, 2);
    Vctx.fillRect(WIDTH/2 - 1, 0, 2, HEIGHT);

    //キャラクターの描画
    Vctx.drawImage(playerImg, 0, 8, 
                   CHARWIDTH, CHARHEIGHT, 
                   WIDTH/2 - CHARWIDTH/2, HEIGHT/2 - CHARHEIGHT/2, 
                   CHARWIDTH, CHARHEIGHT );

    // Vctx.font = FONT;
    // Vctx.fillText("Hello World" + ctxFrame, ctxFrame/10, 64);

}
const drawTile = (Vctx, x, y, mapIndex) =>{
    const ix = (mapIndex % TILECOLMUN) * TILESIZE;
    const iy = Math.floor(mapIndex / TILECOLMUN) * TILESIZE;
    Vctx.drawImage(fieldImg1, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

const LoadImage = () =>{
    
    //マップイメージ
    fieldImg1 = new Image();
    fieldImg1.src = fieldImgPath1;
    //PCイメージ
    playerImg = new Image();
    playerImg.src = playerImgPath;

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

 // キーの押下時に呼び出されるイベントリスナーを設定する
 window.addEventListener('keydown', (event) => {
    // キーの押下状態を管理するオブジェクトに押下されたことを設定する
    isKeyDown[`key_${event.key}`] = true;

    if(window.isKeyDown.key_ArrowLeft === true){
        PlayerX--; // アローキーの左
    }
    if(window.isKeyDown.key_ArrowRight === true){
        PlayerX++; // アローキーの右
    }
    if(window.isKeyDown.key_ArrowUp === true){
        PlayerY--; // アローキーの上
    }
    if(window.isKeyDown.key_ArrowDown === true){
        PlayerY++; // アローキーの下
    }

}, false);
// キーが離された時に呼び出されるイベントリスナーを設定する
window.addEventListener('keyup', (event) => {
    // キーが離されたことを設定する
    isKeyDown[`key_${event.key}`] = false;
}, false);

//onLoadイベントをwindow全体に設定する（ブラウザ起動時のイベント）
window.addEventListener('load', () =>{

    //ページロードのタイミングで画像を読み込む関数を呼び出す
    LoadImage();
    
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
    
