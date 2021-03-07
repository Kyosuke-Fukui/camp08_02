//ひらがな→カタカナ
function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

//カタカナ→ひらがな
function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

//小文字→大文字　「―」をその前の文字に変換
function getOmoji(str) {
  if (str === "ゃ" || str === "ャ") {
    return (str = "や");
  } else if (str === "ゅ" || str === "ュ") {
    return (str = "ゆ");
  } else if (str === "ょ" || str === "ョ") {
    return (str = "よ");
  } else if (str === "ー") {
    return (str = str.slice(-2, -1));
  } else {
    return str;
  }
}

$("#howTo").on("click", function () {
  swal(
    "遊び方：普通のしりとりです。\n \n１．入力欄に文字を入力し、正しく認識されると単語の意味がアラートで表示されます。\n２．自分を含むみんなの画面にその文字が表示されるので、順番に送信してください。\n \nひらがな、カタカナ対応。漢字も送信可能ですが、参照するデータベースの関係で認識できない場合や入力したものと違った読み方で認識される場合があります。"
  );
});

$("#reset").on("click", function () {
  location.reload();
});
