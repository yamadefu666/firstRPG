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

//PCの移動スピード（1回の押下で何ドット進むか）
const SPEED = 8;

//使用するフォント
const FONT = "12px monospase";
const FONTSTYLE = "#ffffff";

//仮想画面の高さと幅
const WIDTH = 560;
const HEIGHT = 304;

//画面タイルサイズの半分の高さ・幅（画面中央まで何タイルか）
const SCR_WIDTH = 18;
const SCR_HEIGHT = 10;

//マップを32タイル×32タイルで描画する
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

//ドットの補間
const SMOOTH =0;

//ゲーム開始位置（タイル座標）
const START_X = 16;
const START_Y = 30;

//素材をどの単位で切り取るか(元画像からして16*16ドットか・・・？)
const TILESIZE = 16;

/**
 * 元画像を16*16を1マスとした時
 * @param {number} -TILECOLMUN -タイル列数
 * @param {number} -TILEROW -タイル行数
 */
const TILECOLMUN = 16;
const TILEROW = 24;

//ウインドウのスタイル
const WNDSTYLE = "rgba(0, 0, 0, 0.75)";

//キー入力バッファ
const Key = new Uint8Array(0x100);

//PCの向き
let xAngle = 1;
let yAngle = 1;


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
let PlayerX = START_X * TILESIZE + TILESIZE/2 ;  //17
let PlayerY = START_Y * TILESIZE + TILESIZE/2;   //9

//イメージのパス
const fieldImgPath1 = "./image/mapImage1.png";
const playerImgPath = "./image/character01.png";

//マップ関連 
const G = 0;
const T =1;
const F = 2; 
const gameMapBase = [
 102,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,  36,  37,  38,  39,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,  52,  53,  54,  55,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,  68,  69,  70,  71,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,  84,  85,  86,  87,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  40,  43,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  88,  91,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,
   0,   0,   0,   0,   0, 250, 251, 252,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 122, 154, 155,   2,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 168, 154, 171,   2,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 152, 154, 155,   2,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 168, 154, 171,   2,
   2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1,   1,   1,   1,   1,   1, 102,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 152, 154, 155,   2,
   2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 136, 138, 139,   0,   1,   1,   2, 136, 138, 137, 138, 137, 138, 106, 154, 171,   2,
   1, 102,   0,   0,   0,   0,   3, 136, 138, 139,   0,   0,   0,   0,   0, 152, 154, 171,   0,   1,   1,   2, 152, 154, 154, 154, 154, 154, 154, 154, 155,   2,
   1,   1,   1,   1,   1,   3,   3, 168, 154, 155,   0,   0,   0,   0,   0, 168, 154, 155,   0,   1,   1,   2, 152, 154, 123, 186, 185, 186, 185, 186, 187,   2,
   1,   1,   1,   1,   1,   3,   3, 168, 154, 171,   0,   1,   1,   1,   0, 152, 154, 171,   0,   1,   1,   2, 168, 154, 171,   3,   1,   1,   1,   1,   1,   1,
   1,   1,   1,   1,   1,   3,   3, 152, 154, 155,   0,   1,   1,   1,   0, 168, 154, 155,   0,   1,   1,   2, 152, 154, 155,   3,   1,   1,   1,   1,   1,   1,
   1,   1,   1,   1,   1,   3,   3, 168, 154, 171,   0,   0,   0,   0,   0, 184, 185, 187,   0,   0,   0,   0, 168, 154, 171,   3,   1,   1,   1,   1,   1,   1,
   2,   0,   0,   0,   0,   0,   0, 152, 154, 155,   0,   0,   0,   0,   0,   1,   1,   1,   0,   0,   0,   0, 152, 154, 155,   0,   0,   0,   0,   0,   0,   0,
   2,   0,   0,   0,   0,   0,   0, 152, 154, 107, 138, 137, 138, 137, 138, 137, 138, 137, 138, 137, 138, 137, 106, 154, 171,   0,   0,   0,   0,   0,   0,   0,
   2,   0,   0,   0,   0,   0,   0, 168, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 155,   0,   0,   0,   0,   0,   0,   0,
   2,   0,   0,   0,   0,   0,   0, 184, 185, 186, 185, 186, 185, 186, 185, 122, 154, 123, 186, 185, 186, 185, 186, 185, 187,   0,   0,   0,   0,   0,   0,   0,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 152, 154, 155,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0, 102,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 152, 154, 155,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,
   1,   1,   1,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 152, 154, 155,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1
]

const drawMain = () =>{
    
    //仮想画面の2d描画コンテキストの取得
    const Vctx = ctxScreen.getContext("2d");
    
    //PCがいるタイル座標
    let mx = Math.floor(PlayerX/TILESIZE);
    let my = Math.floor(PlayerY/TILESIZE);
    

    //マップの描画
    for(let dy = - SCR_HEIGHT; dy <= 64; dy++ ){
          //差分
          let y = dy + SCR_HEIGHT;
          //タイルY座標
          let ty = my + dy;
          //マップループ後のY座標
          let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;
        for(let dx = - SCR_WIDTH; dx <= 64; dx++){
            let x = dx + SCR_WIDTH;
            let tx = mx + dx;
            let px = (tx + MAP_WIDTH) % MAP_WIDTH;
            drawTile(Vctx, 
                     tx * TILESIZE + WIDTH/2 - PlayerX, 
                     ty * TILESIZE + HEIGHT/2 - PlayerY, 
                     gameMapBase[ py * MAP_WIDTH + px]);
        }
    }
    
    Vctx.fillStyle = "#ff0000";
    Vctx.fillRect(0, HEIGHT/2 - 1, WIDTH, 2);
    Vctx.fillRect(WIDTH/2 - 1, 0, 2, HEIGHT);
    
    //デバッグウィンドウ
    Vctx.fillStyle = WNDSTYLE;
    Vctx.fillRect(55, 269, 450, 30)

    //キャラクターの描画
    Vctx.drawImage(playerImg, 0, 8, 
                   CHARWIDTH, CHARHEIGHT, 
                   WIDTH/2 - CHARWIDTH/2, HEIGHT/2 - CHARHEIGHT/2, 
                   CHARWIDTH, CHARHEIGHT );

     Vctx.font = FONT;
     Vctx.fillStyle = FONTSTYLE;
     Vctx.fillText('x=' + PlayerX + 'y=' + PlayerY + 'tile=' + gameMapBase
    [ my * MAP_WIDTH + mx], 60, 283);

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
        PlayerX -= SPEED; // アローキーの左
    }
    if(window.isKeyDown.key_ArrowRight === true){
        PlayerX += SPEED; // アローキーの右
    }
    if(window.isKeyDown.key_ArrowUp === true){
        PlayerY -= SPEED; // アローキーの上
    }
    if(window.isKeyDown.key_ArrowDown === true){
        PlayerY += SPEED; // アローキーの下
    }

    //マップループ処理
    PlayerX += (MAP_WIDTH * TILESIZE);
    PlayerX %= (MAP_WIDTH * TILESIZE);
    PlayerY += (MAP_HEIGHT * TILESIZE);
    PlayerY %= (MAP_HEIGHT * TILESIZE);

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
    
