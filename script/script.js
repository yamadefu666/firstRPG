"use strict";

/**
 * キーの押下状態を調べるためのオブジェクト
 * このオブジェクトはプロジェクトのどこからでも参照できるように
 * window オブジェクトのカスタムプロパティとして設定する
 * @global
 * @type {object}
*/
window.isKeyDown = {};

//フレーム呼び出し間隔(ms)
const INTERVAL = 40;

//PCのデカさ
const CHARHEIGHT = 32;
const CHARWIDTH = 16;

//スクロール速度
const SCROLL = 2;

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

//初期HP
const START_HP = 20;

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
let xAngle = 0;
let yAngle = 1;


//実画面の高さと幅
let ctxWidth;
let ctxHeight;

//キー入力による移動量(X成分、Y成分)
let moveX = 0;
let moveY = 0;

//カーソルの位置
let cursor = 1;

//内部カウンタ（とりあえず置いとく）
let ctxFrame = 0;

//アイテム
let Item = 0;
//戦闘フェーズ
let Phase = 0;

//ポケモンの種類
let monsterType;

//仮想画面
let ctxScreen;

//とりあえず草を生やす画像
let fieldImg1;
//マップオブジェクトの画像
let mapObjImg;
//PCの画像
let playerImg;
//ポケモンの画像
let monsterImg;

//PCの座標
let PlayerX = START_X * TILESIZE + TILESIZE/2 ;  //17
let PlayerY = START_Y * TILESIZE + TILESIZE/2;   //9

/** PCのステータス情報
 * @param {number} Ex - 経験値
 * @param {number} HP - ヒットポイント
 * @param {number} maxHP - 最大ヒットポイント
 * @param {number} Lv - レベル
*/

let Ex = 0;
let HP = START_HP;
let maxHP = START_HP;
let Lv = 1;

//イメージのパス
const fieldImgPath1 = "./image/mapImage1.png";
const mapObjImgPath = "./image/MapObj.png";
const playerImgPath = "./image/character01.png";
const monsterImgPath = "./image/monsters.png"

//メッセージウインドウに表示させるメッセージ
let message1 = null;
let message2 = null;


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
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 138, 137, 138, 139,   2,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,   0,   0,   0,   0,   0, 154, 154, 154, 171,   2,
   0,   0,   0,   0,   0, 250, 251, 252,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,   0,   0,   0,   0, 185, 186, 122, 154, 155,   2,
   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,   0,   0,   0,   0,   0,   0, 168, 154, 171,   2,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,   0,   0,   0,   0,   0,   0, 152, 154, 155,   2,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2,   0,   0,   0,   0,   0,   0, 168, 154, 171,   2,
   2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1,   1,   1,   1,   1,   1, 102,   1,   0,   0,   0,   2,   0,   0,   0,   0,   0,   0, 152, 154, 155,   2,
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
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 152, 170, 155,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,
   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 152, 154, 155,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1
]

const  mapObj= [
    102,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,  36,  37,  38,  39,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,  52,  53,  54,  55,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,  68,  69,  70,  71,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,  84,  85,  86,  87,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  40,  43,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  88,  91,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0, 250, 251, 252,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,  48,  48,  48,  48,  48,  48,  48,  48,  48,   1,   1,   1,   1,   1,   1,   6,   1,   0,   0,   0,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,  48,  48,  48,  48,  48,  48,  48,  48,  48,  48,  48,  48,  48,  48,   6,   6,   6,  48,   0,   0,  54,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   6,  48,  48,  48,  48,   6,   6,   6,   6,  48,  48,  48,  48,  48,   6,   6,   6,  48,   0,   0,  54,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0,   6,   6,   6,   6,   6,  48,  48,  48,  48,  48,   6,   6,   6,  48,   0,   0,  54,   6,   6,   6,   6,   6,   6,   6,   6,   6,  54,
      0,   0,   0,   0,   0,   6,   6,   6,   6,   6,  48,   0,   0,   0,  48,   6,   6,   6,  48,   0,   0,  54,   6,   6,   6,   6,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   6,   6,   6,   6,   6,  48,   0,   0,   0,  48,   6,   6,   6,  48,   0,   0,  54,   6,   6,   6,   6,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   6,   6,   6,   6,   6,  48,  48,  48,  48,  48,   6,   6,   6,  48,  48,  48,  48,   6,   6,   6,   6,   0,   0,   0,   0,   0,   0,
     54,  48,  48,  48,  48,  48,  48,   6,   6,   6,  48,  48,  48,  48,  48,   0,   0,   0,  48,  48,  48,  48,   6,   6,   6,  48,  48,  48,  48,  48,  48,  48,
     54,  48,  48,  48,  48,  48,  48,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  48,  48,  48,  48,  48,  48,  48,
     54,  48,  48,  48,  48,  48,  48,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  48,  48,  48,  48,  48,  48,  48,
     54,  48,  48,  48,  48,  48,  48,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,  48,  48,  48,  48,  48,  48,  48,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   0,   0,   0,   0,   0,   0,   0,   0,  48,  48,  48,  48,  48,   6,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
      0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   6,   6,   6,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0
   ]
   //モンスターの名前
   const monsterName = ['ペカチュウ', 'ラントセル', 'キャタペー']

//マップ全般の描画処理
const drawMap = (Vctx) => {
       
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

    //マップオブジェクトの描画

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
          drawObj(Vctx, 
                   tx * TILESIZE + WIDTH/2 - PlayerX, 
                   ty * TILESIZE + HEIGHT/2 - PlayerY, 
                   mapObj[ py * MAP_WIDTH + px]);
      }
  }
    
    //中心がわかるように補助線を引いていた
    // Vctx.fillStyle = "#ff0000";
    // Vctx.fillRect(0, HEIGHT/2 - 1, WIDTH, 2);
    // Vctx.fillRect(WIDTH/2 - 1, 0, 2, HEIGHT);

    //キャラクターの描画
    //ビット演算（16でわって、かつ、少数は切り捨て）
    if(ctxFrame >> 4 & 1){
       xAngle = 0;
    }else{
       xAngle = 32;
    }
    Vctx.drawImage(playerImg, xAngle , 8 * yAngle, 
                   CHARWIDTH, CHARHEIGHT, 
                   WIDTH/2 - CHARWIDTH/2, HEIGHT/2 - CHARHEIGHT/2, 
                   CHARWIDTH, CHARHEIGHT );

    //ステータスウィンドウの描画（常に出しておく）
    Vctx.fillStyle = WNDSTYLE;
    Vctx.fillRect(4, 4, 44, 45);

    drawmessage(Vctx);
    drawStatus(Vctx);

    //デバッグウィンドウの描画（あとで消す）
    Vctx.fillStyle = WNDSTYLE;
    Vctx.fillRect(55, 10, 450, 30)

     Vctx.font = FONT;
     Vctx.fillStyle = FONTSTYLE;
     Vctx.fillText('x=' + PlayerX + 'y=' + PlayerY + 'tile=' + gameMapBase
    [ my * MAP_WIDTH + mx], 60, 25);

}

//戦闘画面の描画
const drawFight = (Vctx) => {
    //背景色が黒の戦闘画面
    Vctx.fillStyle = '#000000';
    Vctx.fillRect(0, 0, WIDTH, HEIGHT);

    let w = monsterImg.width/3;
    let h = monsterImg.height;

    Vctx.drawImage(monsterImg, monsterType * w, 0, w, h, Math.floor(WIDTH/2 - w/2), Math.floor(HEIGHT/2 - h/2), w, h);

    drawmessage(Vctx);
    drawStatus(Vctx);

    //戦闘コマンド選択中の場合カーソルを描画
    if(Phase == 2){
        Vctx.fillText('→', 45, 270 + 14 * cursor)
    } 


}

const drawMain = () =>{
    
    //仮想画面の2d描画コンテキストの取得
    const Vctx = ctxScreen.getContext("2d");

    //描画関数
    if(Phase == 0){
       drawMap(Vctx);
    }else{
       drawFight(Vctx);
    }

}
//メッセージ描画
const drawmessage = (Vctx) =>{
    if(!message1){
        return;
    }
    //メッセージウィンドウの描画
    Vctx.fillStyle = WNDSTYLE;
    Vctx.fillRect(25, 250, 510, 50);
    Vctx.font = FONT;
    Vctx.fillStyle = FONTSTYLE;
    Vctx.fillText(message1, 60, 270);

     //メッセージが2行を超える場合は、その分変数を用意する（今のところ1行で済んでるのでいらない）
    if(message2){
        Vctx.fillText(message2, 60, 285);
    }
}

const drawStatus = (Vctx) =>{

    Vctx.font = FONT;
    Vctx.fillStyle = FONTSTYLE;
    Vctx.fillText('Lv ' + Lv,  6, 17);
    Vctx.fillText('HP ' + HP,  6, 32);
    Vctx.fillText('Ex ' + Ex,  6, 47);

}

//マップのベースとなる土や、草
const drawTile = (Vctx, x, y, mapIndex) =>{
    const ix = (mapIndex % TILECOLMUN) * TILESIZE;
    const iy = Math.floor(mapIndex / TILECOLMUN) * TILESIZE;
    Vctx.drawImage(fieldImg1, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

//マップの上に乗っけるもの
const drawObj = (Vctx, x, y , mapIndex) =>{
    const ix = (mapIndex % TILECOLMUN) * TILESIZE;
    const iy = Math.floor(mapIndex / TILECOLMUN) * TILESIZE;
    Vctx.drawImage(mapObjImg, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

const LoadImage = () =>{
    
    //マップイメージ
    fieldImg1 = new Image();
    fieldImg1.src = fieldImgPath1;
    //PCイメージ
    playerImg = new Image();
    playerImg.src = playerImgPath;
    //マップオブジェクト（木とか）イメージ
    mapObjImg = new Image();
    mapObjImg.src = mapObjImgPath;
    //ポケモンのイメージ
    monsterImg = new Image();
    monsterImg.src = monsterImgPath;

}

const setMessage = (v1, v2) =>{
    message1 = v1;
    message2 = v2;
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

//フィールド進行処理
const TickField = () => {
    if(moveX != 0 || moveY != 0 || message1){}
    else if(window.isKeyDown.key_ArrowLeft === true){
        yAngle = 5;
        moveX = -TILESIZE;
       // PlayerX -= SPEED; // アローキーの左
    }
    else if(window.isKeyDown.key_ArrowRight === true){
        yAngle = 9;
        moveX = TILESIZE;
        //PlayerX += SPEED; // アローキーの右
    }
    else if(window.isKeyDown.key_ArrowUp === true){
        yAngle = 13;
        moveY = -TILESIZE;
        //PlayerY -= SPEED; // アローキーの上
    }
    else if(window.isKeyDown.key_ArrowDown === true){
        yAngle = 1;
        moveY = TILESIZE;
        //PlayerY += SPEED; // アローキーの下
    }

    //移動後のタイル座標判定
    let mx = Math.floor((PlayerX + moveX)/TILESIZE);
    let my = Math.floor((PlayerY + moveY)/TILESIZE);
    //マップループ処理
    // mx += MAP_WIDTH;
    // mx %= MAP_WIDTH;
    // my += MAP_HEIGHT;
    // mx %= MAP_HEIGHT;


    //タイル番号
    let m = gameMapBase[my * MAP_WIDTH + mx];
    //侵入不可にする
    if(m == 1 || m == 2){
        moveX = 0;
        moveY = 0;
    }

    //特定のタイルに移動した直後にメッセージをセットする関数を呼び出す
    if(Math.abs(moveX) + Math.abs(moveY) == SCROLL ){
        if(m == 170){
            setMessage('ペカチュウをつかまえよう！', null);
        }

        //モンスターボールをゲットする
        if(m == 102){
            Item = 1;
            setMessage('モンスターボールをゲットした', null);
        }
        
        //草むらでのエンカウント
        if(m == 0 && Math.random() * 3 < 1){
            //ポケモン出現フェーズ
            Phase = 1;

            monsterType = 0;
            setMessage('あっ、やせいの' +  monsterName[monsterType] + 'がとびだしてきた！！', null);
        }
   }

    //Math.sign()関数を使用し、プレイヤーの移動速度を制御
    //プレイヤー座標
    PlayerX += Math.sign(moveX) * SCROLL;
    PlayerY += Math.sign(moveY) * SCROLL;

    moveX -= Math.sign(moveX) * SCROLL;
    moveY -= Math.sign(moveY) * SCROLL;

     //マップループ処理
     PlayerX += (MAP_WIDTH * TILESIZE);
     PlayerX %= (MAP_WIDTH * TILESIZE);
     PlayerY += (MAP_HEIGHT * TILESIZE);
     PlayerY %= (MAP_HEIGHT * TILESIZE);
}

const Action = () =>{
    Phase++;

    if(Phase == 3){
        setMessage(monsterName[monsterType] + 'の攻撃！', 99 + 'のダメージ！');
        Phase = 7;
        return;
    }

    //たたかう選択時
    if(cursor == 0){
        setMessage('やまでふの攻撃！', 1 + 'のダメージ！');
        Phase = 5;
        return;
    }

    //にげる選択時

    if(Math.random() < 0.5){
        Phase = 6;
        setMessage('うまくにげきれた！', null);
        return;
    }

    setMessage('にげられなかった！', null);
    


}

const commandFight = () =>{
    //コマンド選択フェーズに戻す
    Phase = 2;
    cursor = 0;
    setMessage('　たたかう', '　にげる');
}

//経験値加算処理
const addEx = (val) =>{
    Ex += val;

     while(Lv * (Lv + 1) * 2 <= Ex){
         Lv++ ;
         maxHP += 4 + Math.floor(Math.random() * 3);
     }
}

//イベント発生時の処理
const WmTimer = ()=>{
    ctxFrame++;
    WmPaint(); 
    //フィールド進行処理
    TickField();
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
    
    /** 各フェーズの役割
     * 0 - マップの移動
     * 1 - モンスターの出現
     * 2 - 戦闘コマンド選択
    */


    if(Phase == 1 ){
        commandFight();
        return;
    }

    if(Phase == 2){
        if(window.isKeyDown.key_Enter === true){
            //戦闘行動処理
            Action();
        }else{
            cursor = 1 - cursor;
        }  
        return;
    }

    if(Phase == 3){
        Action();
        return;
    }

    if(Phase == 4){
        //戦闘コマンド
        commandFight();
        return;
    }

    if(Phase == 5){
        Phase++;
        setMessage(monsterName[monsterType] + 'をこらしめた！', null);
        addEx(3 - monsterType);
        return;
    }

    if(Phase == 6){
        Phase = 0;         
    }

    if(Phase == 7){
        Phase = 8;
        setMessage('めのまえがまっくらになった！', null);
        return;
    }

    if(Phase == 8){
        setMessage('ゲームオーバー', null);
        return;
    }
    
    
    //キーリピート状態の時は処理を行わない…？
    // if(isKeyDown){
    //     return;
    // }

    //let c = event.keyCode;

    message1 = null;
    message2 = null;
   

}, false);
// キーが離された時に呼び出されるイベントリスナーを設定する
window.addEventListener('keyup', (event) => {
    // キーが離されたことを設定する
    isKeyDown[`key_${event.key}`] = false;
    
    /*
    //moveX, moveYを初期化
    if(window.isKeyDown.key_ArrowLeft === false){
        moveX = 0;
       // PlayerX -= SPEED; // アローキーの左
    }
    if(window.isKeyDown.key_ArrowRight === false){
        moveX = 0;
        //PlayerX += SPEED; // アローキーの右
    }
    if(window.isKeyDown.key_ArrowUp === false){
        moveY = 0;
        //PlayerY -= SPEED; // アローキーの上
    }
    if(window.isKeyDown.key_ArrowDown === false){
        moveY = 0;
        //PlayerY += SPEED; // アローキーの下
    }
    */

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
    setInterval(()=>{WmTimer()}, INTERVAL);
}, false);
    
