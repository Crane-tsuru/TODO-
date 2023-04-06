"use strict";

const table = document.querySelector("table"); // 表
const todo = document.getElementById("todo"); // TODO
const priority = document.querySelector("select"); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締切
const submit = document.getElementById("submit"); // 登録ボタン

// ローカルストレージの準備と読み込み
const storage = localStorage;
let list = []; // TODOリストのデータ
document.addEventListener("DOMContentLoaded", () => {
  // 1. ストレージデータ（JSON）の読み込み
  const json = storage.todoList;
  if (json == undefined) {
    return; // ストレージデータがない場合は何もしない
  }
  // 2. JSONをオブジェクトの配列に変換して配列listに代入
  list = JSON.parse(json);
  // 3. 配列listのデータを元にテーブルに要素を追加
  // 配列listのデータをテーブルに追加
  for (const item of list) {
    // console.log(item);
    addItem(item);
  }
});

// TODO登録ボタン
submit.addEventListener("click", () => {
  const item = {}; // 入力値を一時的に格納するオブジェクト

  item.todo = todo.value;
  item.priority = priority.value;
  item.deadline = deadline.value;
  item.done = false; // 完了はひとまずBoolean値で設定

  //   入力値チェック
  if (item.deadline != "") {
    item.deadline = deadline.value;
  } else {
    const date = new Date(); // 本日の日付情報を取得
    item.deadline = date.toLocaleDateString().replace(/\//g, "-");
  }

  if (item.todo != "") {
    item.todo = todo.value;

    if (item.todo.length >= 12) {
      window.alert("文字数を12文字以内に収めてください");
      return;
    }
  } else {
    window.alert("TODOの項目が入力されていません");
    return;
  }

  todo.value = "";
  priority.value = "普";
  deadline.value = "";

  // 配列listのデータをテーブルに追加
  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

// 関数を定義
const addItem = (item) => {
  // 上記のコードを［登録］ボタンのイベントリスナーの中からここに移動
  // 元の場所には忘れずに関数呼び出しを書くこと → addItem(item);
  const tr = document.createElement("tr");

  for (const prop in item) {
    const td = document.createElement("td");
    if (prop == "done") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener("change", checkBoxListener); // 追加
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }

  table.append(tr);
};

// 絞り込み機能の実装
const filterButton = document.createElement("button"); // ボタン要素を生成
filterButton.textContent = "優先度（高）で絞り込み";
filterButton.id = "priority"; // CSSでの装飾用
const main = document.querySelector("main");
main.appendChild(filterButton);

filterButton.addEventListener("click", () => {
  clearTable();
  for (const item of list) {
    if (item.priority == "高") {
      addItem(item);
    }
  }
});

// 関数定義
const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

// 削除ボタンの作成
const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除する";
remove.id = "remove"; // CSS装飾用
const br = document.createElement("br"); // 改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener("click", () => {
  clearTable(); // TODOデータを一旦削除

  // 1. 未完了のTODOを抽出して定数listを置き換え
  list = list.filter((item) => item.done == false);
  // 2. TODOデータをテーブルに追加
  for (const item of list) {
    addItem(item);
  }

  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
});

// チェックボックスの反映
const checkBoxListener = (ev) => {
  // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementsByTagName("tr"));

  // 1-2. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;

  // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;

  // 2. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;

  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};

// deletebuttonの実装
const del = document.getElementById("deleteButton");

del.addEventListener("click", () => {
  todo.value = "";
});