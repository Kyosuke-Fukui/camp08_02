//グローバル変数の宣言
var usedWord;
var lastLetter;
var boo;

//初期値の設定
window.onload = function () {
  $("#username").val("No Name");
  $("#text").val("りんご");
  lastLetter = "";
  usedWord = [];
  boo = Boolean(1);
};

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseURL: "",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebaseのDBを使いますと言うjsのコード
const newPostRef = firebase.database().ref();

//送信後の処理
$("#send").on("click", async function () {
  var text = $("#text").val();

  //辞書APIの設定
  const response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/ja/" + text
  );
  const data = await response.json();
  let moji = await data[0]["word"]; //仕様上必ずひらがなまたはカタカナになる
  let resp = await data[0]["meanings"][0]["definitions"][0]["definition"];

  var arrSearch = usedWord.indexOf(text);
  //分岐1 すでに使われた単語を使った場合
  if (arrSearch != -1) {
    swal("その単語はすでに使われています");
  } else if (
    //分岐2 初回もしくは最初の文字がが前の言葉の最後の文字と一致していた場合
    lastLetter === "" ||
    (await moji.slice(0, 1)) === lastLetter ||
    (await kanaToHira(moji).slice(0, 1)) === lastLetter ||
    (await hiraToKana(moji).slice(0, 1)) === lastLetter
  ) {
    swal(resp); //言葉の意味を表示

    if (
      (await kanaToHira(moji).slice(-1)) === "ん" ||
      (await hiraToKana(moji).slice(-1)) === "ン"
    ) {
      boo = Boolean(0);
      //敗者判定
    }
    //firebaseデータベースへ追加
    await newPostRef.push({
      username: $("#username").val(),
      text: text,
      read: moji,
    });
  } else {
    //分岐3 初めの文字が前の言葉の最後の文字と一致しない場合
    swal(`"「${kanaToHira(lastLetter)}」から始まる言葉を入力してください"`);
  }
  $("#text").val("");
});

// データ追加時の受信処理
var ignoreItems = true;
newPostRef.on("child_added", (data) => {
  if (!ignoreItems) {
    let v = data.val();
    //末尾の文字を更新
    lastLetter = v.read.slice(-1);
    lastLetter = getOmoji(lastLetter);
    //受信したオブジェクトをウィンドウに表示
    let str = `<p>${v.username}:${v.text}</div></p>`;
    $("#output").prepend(str);
    //使用済単語リストを更新
    usedWord.push(v.text);

    //勝敗判定
    if (lastLetter === "ん" || lastLetter === "ン") {
      if (boo) {
        swal(
          "あなたの勝ちです。もう一度遊ぶ場合はリセットボタンを押してください。"
        );
      } else {
        $("body").css("backgroundColor", "red");
        swal(
          "「ん」がついたのであなたの負けです。もう一度遊ぶ場合はリセットボタンを押してください。"
        );
      }
    }
  }
});
//Load時にchild_addedメソッドがDB上のデータ全てを返してしまう仕様に対処するもの
newPostRef.once("value", () => {
  ignoreItems = false;
});
