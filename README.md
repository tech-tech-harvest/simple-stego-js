# simple-stego-js

`simple-stego-js` は，ブラウザ上で画像に秘密のテキストメッセージを埋め込むことができる，シンプルなステガノグラフィツールです．

## Features

* サーバーへのアップロード不要（クライアントサイドの JavaScript のみで完結）
* HTML5 Canvas を利用した LSB（最下位ビット）置換アルゴリズム
* ドラッグ＆ドロップによる画像読み込み
* 外部ライブラリ不使用（Vanilla JS）

## Requirements

* 動作確認済み環境: 最新のモダンブラウザ（Google Chrome, Safari, Firefox, Edge など）

## Files

* `index.html` : ツールのメイン画面
* `script.js` : 画像処理とビット埋め込みのロジック
* `style.css` : レイアウトと装飾
* `README.md` : 本ファイル

## Usage

1. リポジトリ内の `index.html` をブラウザで開きます．
2. 画面上のエリアに画像をドラッグ＆ドロップ（またはクリックして選択）します．
3. 埋め込みたいメッセージをテキストエリアに入力します．
```text
例: Premature optimization is the root of all evil.
```


4. 「画像を生成してダウンロード」ボタンを押すと，テキストが埋め込まれた PNG 画像が保存されます．

## Logic & Notes

* **LSB手法**: RGB 各色の最下位ビット（Least Significant Bit）をテキストデータのビットに置き換えることで情報を隠蔽しています．
* **画像形式**: 出力は可逆圧縮の PNG 形式で行われます．（JPEG などの非可逆圧縮に変換するとデータは破損します）
* **文字コード**: 現状の簡易実装では，主に英数字（ASCII）での利用を想定しています．
