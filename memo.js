//canvas2d drawImageメソッドにおける引数の指定（引数の個数に応じて挙動が変化する非常にややこいメソッド）

/**
 * パターンその1
 * @param {string} image -画像のパスとか（？）
 * @param {number} dx -canvasの左上端から画像の左上端の横の距離
 * @param {number} dy -canvasの左上端から画像の左上端の縦の距離
 * みっつの時は指定した位置に画像がベタ張りされる
 */
ctx.drawImage(image, dx, dy);

/**
 * パターンその2
 * @param {string} image -画像のパスとか（？）
 * @param {number} dx -canvasの左上端から画像の左上端の横の距離
 * @param {number} dy -canvasの左上端から画像の左上端の縦の距離
 * @param {number} dw -置く画像の幅を指定
 * @param {number} dh -置く画像の高さを指定
 * ５つの時は指定した位置に指定したデカさの画像がベタ張りされる
 */
ctx.drawImage(image, dx, dy, dw, dh);

/**
 * パターンその3
 * @param {string} image -画像のパスとか（？）
 * @param {number} sx -読み込む元画像をトリミングして使う場合、画像の左上端から切り出しはじめの位置までの横の距離
 * @param {number} sy -↑の縦の距離
 * @param {number} sw -切り出し初めの位置から、どんくらいのデカさで切り取るのか、の幅
 * @param {number} sh -↑の高さ
 * @param {number} dx -canvasの左上端から画像の左上端の横の距離
 * @param {number} dy -canvasの左上端から画像の左上端の縦の距離
 * @param {number} dw -置く画像の幅を指定
 * @param {number} dh -置く画像の高さを指定
 * 9つの時は指定した位置から指定したデカさ分だけトリミングした画像を、canvasの指定した位置に指定したデカさで張られる（順番注意：トリミングが先）
 */
ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

//canvas2d fillRect関数（四角形の描画）
/**
 * 指定された座標に短形（四角形のこと）を描画する
 * @param {number} x -塗りつぶす短形の左上のX座標
 * @param {number} y -塗りつぶす短形の左上のY座標
 * @param {number} w -塗りつぶす短形の横幅
 * @param {number} h -塗りつぶす短形の高さ
 */

AudioContext.fillRect(x, y, w, h);

/* マップ地形と対応するタイル座標
1 - 明るい草 => 0
2- 暗い草 => 36〜39  (+ 16  :4行)
3- 暗い土 => 40〜43  (+ 16  :4行)
*/

/* 草の中でそれぞれが意味するところ
0 - ポケモンとエンカウントする草むら
1 - 木（侵入不可）
2 - 柵？杭？（侵入不可）
3 - 侵入できるなんの変哲もない草
*/


/*
Math.floor() ==>小数点以下を切り捨てる関数
引数には数値を渡す（整数同士の割り算なんかを渡してあげると小数点以下切り捨てして答えをくれる、jsでは整数/整数でもよしなに少数で返してくれたりするから）
nullや空文字を渡すと、0が帰ってくる
文字列の場合はNaN
*/

//座標=>jsの世界では原点は左上（つまり正の方向が、xは右でyは"下"）

/*フィールド進行処理
一回の押下でタイルごと移動するようにするか
今は半タイル（8ドット）ずつの移動になっている
*/