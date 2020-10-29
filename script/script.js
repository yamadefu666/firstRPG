"use strict";

//使用するフォント
const FONT = "48px monospase";
//内部カウンタ（とりあえず置いとく）
let ctxFrame = 0;

///とりあえず草を生やす画像
let fieldImg1;

const WmTimer = ()=>{
    ctxFrame++;
    //maincanvasの要素を取得する
    const canvas = document.getElementById("main_canvas");
    //2d描画コンテキストを取得
    const ctx = canvas.getContext("2d");

    for(let y = 0; y < 16; y++ ){
        for(let x = 0; x < 16; x++){
            ctx.drawImage(fieldImg1, x * 32, y * 32);
        }
    }

    ctx.font = FONT;
    ctx.fillText("Hello World" + ctxFrame, ctxFrame/10, 64);
}

//onLoadイベントをwindow全体に設定する
window.addEventListener('load', () =>{

    //ロードのタイミングで草を生やす
    fieldImg1 = new Image();
    fieldImg1.src = "./image/grassField.png";
    //40ms間隔でWmTimer関数を呼び出す
    setInterval(()=>{WmTimer()}, 40);
}, false);
    
