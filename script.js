// --- グローバル変数 ---
// 選択された画像ファイルを保持しておく変数
let selectedFile = null;

// --- 初期化処理 ---
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('uploadInput');

    // 1. クリックされたらファイル選択ダイアログを開く
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // 2. ファイルinputが変更された時 (クリック選択時)
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // 3. ドラッグ＆ドロップのイベント設定
    // ドラッグ中 (見た目を変える)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); // デフォルトの挙動（ファイルを開く）をキャンセル
        dropZone.classList.add('dragover');
    });

    // ドラッグが外れた (見た目を戻す)
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    // ドロップされた時
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
});

// ファイルが選択されたときの共通処理
function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        alert('画像ファイルのみアップロード可能です。');
        return;
    }
    selectedFile = file;
    // 画面にファイル名を表示して、選ばれたことをわかりやすくする
    document.getElementById('fileNameDisplay').textContent = "選択中: " + file.name;
    document.getElementById('dropZone').style.borderColor = "#007bff"; // 枠線を青くして完了感を出す
}


// --- 埋め込みロジック (前回とほぼ同じ) ---

function textToBits(text) {
    let bits = "";
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let binary = charCode.toString(2).padStart(8, '0'); 
        bits += binary;
    }
    return bits;
}

function embedData() {
    const textInput = document.getElementById('secretText').value;
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.getElementById('resultArea');
    const outputImg = document.getElementById('outputImage');
    const downloadLink = document.getElementById('downloadLink');

    // チェック: ファイルとテキストがあるか？
    if (!selectedFile) {
        alert("画像をドラッグ＆ドロップしてください。");
        return;
    }
    if (!textInput) {
        alert("隠したいメッセージを入力してください。");
        return;
    }

    const delimiter = "#####END#####";
    const fullMessage = textInput + delimiter;
    const binaryMessage = textToBits(fullMessage);

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let bitIndex = 0;
            const totalPixels = data.length / 4;
            
            if (binaryMessage.length > totalPixels * 3) {
                alert("テキストが長すぎて画像に入りきりません。\nもっと大きな画像を使うか、文章を短くしてください。");
                return;
            }

            for (let i = 0; i < data.length; i += 4) {
                if (bitIndex >= binaryMessage.length) break;
                for (let j = 0; j < 3; j++) {
                    if (bitIndex < binaryMessage.length) {
                        let bit = parseInt(binaryMessage[bitIndex], 10);
                        data[i + j] = (data[i + j] & 0xFE) | bit;
                        bitIndex++;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            const dataURL = canvas.toDataURL("image/png");
            outputImg.src = dataURL;
            downloadLink.href = dataURL;
            
            resultArea.style.display = "block";
            // 結果位置までスクロール
            resultArea.scrollIntoView({ behavior: 'smooth' });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
}