---
title: "【入門編】Reduxによる状態管理の仕組みを理解する"
emoji: "🍖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "redux", "js", "frontend", "初心者向け"]
published: true
date: "2021-03-21"
categories: ["engineering"]
tags: ["react", "redux", "js", "frontend", "初心者向け"]
description: "【入門編】Reduxによる状態管理の仕組みを理解する"
---

# まず結論から

[zenn の記事の転載です。](https://zenn.dev/jojo/articles/25c10b27783093)

Redux を理解する上では、この図解(引用元：[Redux Application Data Flow](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#redux-application-data-flow))を理解できれば 90%は OK。

![](https://storage.googleapis.com/zenn-user-upload/92alq46m4gh0v1sprqgf46m3f38r)

1. ユーザーの入力から、(ActionCreator が)Action(アクション)を作成する
2. Store(状態を管理するところ)へ Action を Dispatch（送信）する
3. Dispatch された Action を Reducer（状態を変更するところ）へ渡す
4. Reducer が作成した新しい State を Store が保存する
5. Store からデータを参照して View（画面）に描画する

「ここが間違ってる！」や「もっとこんな仕組みが使われてるよ！」等のツッコミがあれば、どしどし貰えると助かります！(そのために書いてるみたいなところも多いので！)

# Redux とは

[Redux](https://redux.js.org/)は、React が扱う UI の state(状態)を管理をするためのフレームワークです。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/3bd8bfcf-a885-b584-294c-f307b70e4820.png)

React では state の管理するデータフローに[Flux](https://facebook.github.io/flux/)を提案していますが、Redux は Flux の概念を拡張してより扱いやすく設計されています。
React 以外にも AngularJS や jQuery などと併用して使用することもできますが、React と使用するのがベターです。

[Redux - GitHub](https://github.com/reduxjs/redux)

# Redux の 3 原則（Three Principles）

Redux の基本設計は以下の 3 つの原則に基づいて設計されています。
順を追って見ていきましょう。

## Single source of truth(ソースは１つだけ)

この原則は以下のような要約できます。

- アプリケーション全体の状態(State)はツリーの形で１つのオブジェクトで作られ、１つのストアに保存される
- State が保存しやすいので、ユニバーサルアプリケーションがつくりやすい
- State が 1 つだから、デバッグしやすい、開発しやすい

以下の図は、[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)で使ってサンプルアプリケーションの State の構成を示しているものです。
![図解](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/426da52e-ec7a-1dc1-5f73-ea548f504baf.png)

つまり、以下のように Store を複数作成することはできません。

```js
const store = createStore(sample);
const store2 = createStore(sample);
```

## State is read-only(状態は読み取り専用)

この原則は、

- 状態を変更する手段は、変更内容をもった Action オブジェクトを発行して実行するだけ
- ビューやコールバックが状態を直接変更させることはできない
- 変更は一つずつ順番に行なわれる
- Action はオブジェクトなので、保存可能であり、テストしやすい

ということを示してます。

## Mutations are written as pure functions(変更はすべて pure な関数で書かれる)

そして、これが最後の原則です。

- アクションがどのように状態を変更するかを「Reducer」で行う
- 「Reducer」は状態とアクションを受けて、新しい状態を返す関数である
- 現在の State オブジェクトを変更することはせずに、新しい State オブジェクトを作って返すというのがポイント
- 開発するときは、最初はアプリケーションで一つの Reducer を用意して、巨大化してきたら Reducer を分割していく

![State is read-only](https://storage.googleapis.com/zenn-user-upload/jjsyg69aqpszdrftdby7fh07jx8m)

# 全体構造

ここで、改めて全体構造(引用元:
[Redux. From twitter hype to production](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/27]))を確認してみましょう。
今回の図は、はじめに見せた図よりもより抽象化したものです。
新しい要素もありますが、このあとに解説にしますのでここでは気にしないでください。

![redux図解](https://storage.googleapis.com/zenn-user-upload/d0fynf9oun172ovf2qcwntt6yg2q)

1. ユーザーの入力から、ActionCreator が Action を作成する
2. Store へ Action を Dispatch（送信）する
3. Dispatch された Action を Reducer へ渡す
4. Reducer が作成した新しい State を Store が保存する
5. Store からデータを参照して View に描画する

では、具体的なアプリケーションを例に出して解説していきたいのですが、
その前にざっくり構成要素の説明をしておきます。

# 構成要素

構成要素は、以下の 7 つです。
1 つずつ見ていきましょう。

- View
- ActionCreator
- Action
- Middleware
- State
- Reducer
- Store

## View: ユーザーの見る画面

View とは、実際にユーザーに表示される画面のことを指します。
ユーザーがボタンをクリックしたり、テキストを入力することでイベントが発行されるので、この画面へイベントが処理の起点となります。

![redux_fig3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/e88bcbd4-92d4-0d9c-510a-99b220430cbe.png)

## ActionCreator: アクションを生成する

ActionCreator は、その名の通り、アクションを生成する処理を行います。
図解されている部分では、青いダイアログで示されている Actions に対応しています。

![redux_fig4.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/f2e55558-8014-ce49-cd75-ada456bbd79f.png)

## Action: ユーザーの入力したアクション

Action とは、ユーザーが入力したアクションのことを指します。
例えば、ボタンをクリックしたり、テキストを入力することを指しています。
他にもあるボタンをクリックしたときに複数の処理が発行される場合、単一のユーザー入力に対して複数のアクションが発行されることもあります。

![redux_fig5.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/553acf7e-f450-9040-983f-31307d3cad54.png)

## Middleware: アクションをウォッチして、副作用を取り込む

Middleware とは、アクションは発行されることを監視して、ある特定の処理に対して副作用を取り込む処理を行います。
例えば、ボタンをクリックした際にサーバーへ API を叩きに行く処理が発生する場合は、この Middleware が API への接続の処理を担っています。
逆に、ただ、テキストを入力するだけなどのシンプルな処理、つまり、View の状態を変更するだけでサーバーとのやり取りを行わない・副作用を含まないアクションでは、Middleware での処理を介しません。

![redux_fig6.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/912dc342-6a0d-d75c-2d4d-43036bf3ac47.png)

## Reducer: アプリケーションの状態を書き換える事が唯一できる

Reducer とは、アプリケーションの状態を書き換える事が唯一できるものです。
Redux の基本設計の 1 つである Single source of truth(ソースは１つだけ)でもあるように State を書き換える事ができるのはこの Reducer のみです。
アクションから処理を伝搬する役割を持っています。

![redux_fig7.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/4200ed43-eb67-bfe5-f6b6-e2d352610ccc.png)

## State: アプリケーションの状態

State とは、アプリケーションの状態を示しています。
例えば、チェックボックスをチェックしているとか、API を叩いてデータを取得できたなどの状態を指します。

![redux_fig8.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/e91e1cf5-a7cb-ac86-9dc9-078c892761f7.png)

## Store: アプリケーションの状態を保存する

Store とは、アプリケーションの状態を保存する場所です。
State を格納しており、Reducer から State を変更された場合、Store に保存されている State が書き換わります。

![redux_fig9.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/26aac20b-f77a-b575-e157-de4401949eec.png)

# 処理の流れ

では、具体的にタスク管理 TODO アプリを例に処理の流れを見ていきましょう。

こちらがタスク管理 TODO アプリです。

@[codesandbox](https://codesandbox.io/embed/github/jotaro-biz/todo-app-with-redux/tree/main/?fontsize=14&hidenavigation=1&theme=dark)

## ユーザーの入力により、Action を発行する

TODO リストの項目を追加するために「筋トレをする」と入力して、「追加」のボタンをクリックしてタスクを追加するユースケースでみてみましょう。

![「筋トレをする」と入力](https://storage.googleapis.com/zenn-user-upload/j5oa9l5miqr24i0pezqcj84etbs2 =400x)

まず、タスクを追加するというアクションを定義します。

```js:actionType.js
export const ADD_TODO = "ADD_TODO";
```

```js:actions.js
export const addTodo = content => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
});
```

そして、ここに定義したアクションを View から dispatch（送信）するために、`InputWithButton`に処理を追加します。（UI コンポーネント自体に state を持たせる+ドメイン知識を持たせるのは、場合によってはアンチパターンですが、ここでは処理の流れを理解してもらうためにあえてこのカタチで説明します。）

![InputWithButton](https://storage.googleapis.com/zenn-user-upload/kzd708748e5dtlx0q35fmbywaqzd =400x)

```js:InputWithButton.js
class InputWithButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  updateInput = (input) => {
    this.setState({ input });
  };

  handleAddTodo = () => {
    this.props.addTodo(this.state.input);
    this.setState({ input: "" });
  };

  render() {
    return (
      <div>
        <input
          onChange={(e) => this.updateInput(e.target.value)}
          value={this.state.input}
        />



        <button className="add-todo" onClick={this.handleAddTodo}>
          追加
        </button>
      </div>
    );
  }
}
```

ここでは、input へ入力したテキストは、

```js
this.state = { input: "" };
```

このようにローカルの State に格納されて、追加ボタンを押したタイミングで Action が dispatch されます。

```js
<button className="add-todo" onClick={this.handleAddTodo}>
  追加
</button>
```

また、`handleAddTodo`は action を dispatch するのと同時に input を空にする処理もしています。

```js
handleAddTodo = () => {
  this.props.addTodo(this.state.input);
  this.setState({ input: "" });
};
```

`ADD_TODO`は予め定義されていたアクションです。
ここで、アクションを生成するのが ActionCreator です。

## 伝搬（dispatch）された Action を Reducer へ渡し、Reducer が State を更新して Store に保存する

Reducer は dispatch された Action を受け取り、その Action によって Store に保存されている Store を書き換える処理を実行します。

```js:redux/reducer/todos.js
const initialState = {
  allIds: [],
  byIds: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content,
            completed: false
          }
        }
      };
    }
    ...
```

`allIds`とはすべてのタスクを示しており、`ADD_TODO`というアクションが dispatch されると、その`allIds`という state の中に、新しく作成した TODO タスクが追加されます。

## Store からデータを参照して View に描画する

新しく TODO タスクを追加すると、View にもその変更が反映されます。

![新しくタスクが追加された状態](https://storage.googleapis.com/zenn-user-upload/6yd48wunxjr59wtyw4gcotkbkgbl =400x)

ここでは、`TodoList`というコンポーネントが Store に保存されている State を監視しているため、即座に反映されます。

![TodoList](https://storage.googleapis.com/zenn-user-upload/hk1oy3pjdqozvcpfspni9f5wfxxg =400x)

```js:TodoList.js
const TodoList = ({ todos }) => (
  <ul className="todo-list">
    {todos && todos.length
      ? todos.map((todo, index) => {
          return <TodoItem key={`todo-${todo.id}`} todo={todo} />;
        })
      : "タスクがありません。"}
  </ul>
);

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  const todos = getTodosByVisibilityFilter(state, visibilityFilter);
  return { todos };
};
export default connect(mapStateToProps)(TodoList);
```

`getTodosByVisivikityFilter`の定義元へ移動してみます。
ここではじめて`selector`というものがでてきましたが、
これは store の state を取得する際に加工・選択（select）してから view へデータを投げてくれる人です。
今回の場合は、フィルターを「すべて・完了・未完了」によって取得するデータを整形するという処理をしてます。

```js:selector.js
export const getTodosByVisibilityFilter = (store, visibilityFilter) => {
  const allTodos = getTodos(store);
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allTodos.filter(todo => todo.completed);
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allTodos.filter(todo => !todo.completed);
    case VISIBILITY_FILTERS.ALL:
    default:
      return allTodos;
  }
};
```

なので、おおもとの store からデータを持ってくる処理とはこの`getTodos`が行っています。

```js:selector.js
export const getTodos = store =>
getTodoList(store).map(id => getTodoById(store, id));
```

これで、todo タスクを追加した際に行われている一連の流れを理解することができました。

今回は、サーバーとのやり取りを行わないシンプルなアプリケーションだったので、Middleware などは介在しないシンプルな処理になりましたが、実際にサービスをつくるとなった際にはもっと複雑な設計が求められるでしょう。
これについては次回の記事で。

少しでも、Redux を学ぶ人の手助けができたら嬉しいです！
アドバイスや質問などのあれば[twitter](https://twitter.com/jojo__hack)の DM やコメントでもいいので是非是非お待ちしてますー！
