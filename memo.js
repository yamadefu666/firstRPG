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