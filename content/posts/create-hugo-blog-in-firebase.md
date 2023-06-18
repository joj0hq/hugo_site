+++
categories = ["engineering"]
tags = ["hugo", "firebase"]
date = "2019-11-10"
description = "今回作るのは静的なサイトです。FirebaseとHugoをつかってさくっと実装していきます。今回作るのは静的なサイトです。FirebaseとHugoをつかってさくっと実装していきます。"
linktitle = ""
title = "【10分で実装！】HugoとFirebaseで静的なWebサイトをつくる"
type = "post"
cover.image = "/images/2019/11/2019-11-10.png"

+++

## 今回つくるもの

今回作るのは静的な Web サイトです。

まさにこのサイトのようなブログのような複数のユーザーから動的な更新を想定しないサイトの場合は、静的なページで実装することで高速に読み込むことができるサイトを開発することができます。

![JOJO HACKのトップページ](/images/2019/11/2019-11-10-p2.png)

ここでは、Firebase と Hugo をつかってさくっと実装していきます。

## Hugo とは？

![HUGO](/images/2019/11/2019-11-10-p3.png)

HUGO とは、一体何でしょうか。

[HUGO の公式](https://gohugo.io/)によると、

> Hugo is one of the most popular open-source static site generators.

> With its amazing speed and flexibility,

> Hugo makes building websites fun again.

つまり、HUGO とは静的な html を生成する事ができる静的サイトを生成するフレームワークです。

### HUGO のメリット

- 静的なページなので高速
- セキュリティ面でのリスクを減らすことができる
- Markdown 形式で記事を書くことができる
- 既存のテーマを使えばサイトの実装がかんたん

静的なページにすることでサイトの表示速度は高速になり、サーバサイドの処理が無い分セキュリティ的にもリスクを減らすことができます。

なんといってもこのフレームワークの魅力は Markdown 形式で書いた記事がそのまま公開できるという点です。

これは全エンジニアにとってはとてもありがたい利点ではないでしょうか！？

逆に Markdown 記法になれていない方にとっては WordPress のような GUI 的にマークダウンできるフレームワークのほうが便利かもしれませんね。

### HUGO のデメリット

- 記述が独特で学習コストがかかるところがある
- 既存のテーマを使用するとカスタマイズが面倒
- 動的に title タグや description を組み立てるのが面倒

基本的には、標準機能が充実しているのでプラグインを追加してなにかするといったことはほとんどありません。

そのため、自分にあったサイトにカスタマイズをしたい！と思ったときには最低限の JavaScript の知識は実装に必要になってしまいます。

## Hugo でローカルに静的なサイトを作るまで

まずは HUGO でローカル環境で静的なサイトを作るところまでさくっと行っていきましょう。

実際に動かすだけならほんの数回のコマンドで Web サイトを作ることができてしまうのが HUGO のすごいところです。

それでは、行ってみましょう。

### Hugo のインストール

今回は mac の環境で開発を行っていきます。

brew を使って HUGO をインストールしましょう。

```sh
brew install hugo
```

実際にインストールが済んだかどうかは

```sh
hugo version
```

バージョン確認のコマンドが通るかどうかで確認しましょう。

ちなみに Lunix や Windows 環境の方は公式からインストールの方法を確認することができますので[コチラ](https://gohugo.io/getting-started/installing/)を読んでみてください。

### Web サイトの作成

次に Web サイトを作っていきます。

```sh
hugo new site jojo-hack(好きな名前をつけてください)
```

このようなコマンドを叩いてもらうと、以下のようなコメントが返ってくるはずです。

```
Congratulations! Your new Hugo site is created in (サイト作成に指定したPATH).

Just a few more steps and you're ready to go:

1. Download a theme into the same-named folder.
   Choose a theme from https://themes.gohugo.io/, or
   create your own with the "hugo new theme <THEMENAME>" command.
2. Perhaps you want to add some content. You can add single files
   with "hugo new <SECTIONNAME>/<FILENAME>.<FORMAT>".
3. Start the built-in live server via "hugo server".

Visit https://gohugo.io/ for quickstart guide and full documentation.
```

これで土台となる部分が作成完了しました。

次にこのコメントでも述べているように HUGO のサイトテーマを追加してみましょう。

### テーマの追加

テーマは[Hugo Themes](https://themes.gohugo.io/)で探すことができます。

![Hugo Themes](/images/2019/11/2019-11-10-p4.png)

ここでは、JOJO HACK のテーマに使用している**hugo-coder-portfolio**を使います。

```sh
cd jojo-hack // 対象のプロジェクトに移動
$ git init
$ git submodule add https://github.com/naro143/hugo-coder-portfolio.git themes/hugo-coder-portfolio
```

これでテーマを追加することができたので、あとは設定ファイルである config.toml の記入を修正しましょう。

```sh
echo 'theme = "hugo-coder-portfolio"' >> config.toml
```

これで hugo-coder-portfolio をテーマとして使用することを明示的に設定することができました。

### テスト記事の作成

最後に Hello World 的な記事を追加してみましょう。

```sh
hugo new posts/hello-world.md
```

これで新しく記事を作成することができました。

このファイルに Hello World と追加して、下書きモード(draft: false、または削除)を外しておきましょう。

```
---
title: "Hello World"
date: 2019-11-10T18:29:02+09:00
---

Hello World
```

さあこれですべての準備が整いました。最後に localhost で表示を確認してみましょう。

### localhost で動作を確認する

ローカル環境で表示を確認するには、

```sh
hugo server -D
```

このコマンドで OK です。これで Web サーバがローカルに構築されました。

```sh
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

早速アクセスしてみましょう。

### 静的ページの生成（ビルド）

```sh
hugo
```

### Firebase Tools のインストール

```sh
npm i npm
$ npm install -g firebase-tools
```

### firebase の初期設定

hugo を選択するだけ

```sh
firebase login
$ cd your-firebase-project
$ firebase init
$ firebase use --add
```

### firebase deploy

```sh
firebase deploy
```

## まとめ

Hugo と firebase でクイックに自分のブログを作ることができました。ぜひ。
