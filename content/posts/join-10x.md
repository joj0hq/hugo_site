+++
categories = ["10X"]
tags = ["10X", "入社エントリ", "エンジニア"]
date = "2023-06-18"
description = "2023年2月に10Xに入社しました。ここではそのきっかけと4ヶ月経ってのリアルを話します。"
featured = "2023-06-19.png"
featuredpath = "/images"
featuredalt = "10X"
title = "10Xに入社した、そして4ヶ月後…"
type = "post"

+++

![10Xに入社した、そして4ヶ月後…](/images/2023-06-19.png)

この記事は[10X 創業 6 周年アドベントカレンダー](https://10xall.notion.site/10X-6-6-6-30-23ba40d94ad14700b46a661cd045e968)の 19 日目の記事になります。 昨日は BizDev の寺崎さんが、「[100 社以上の小売企業と面談して知った 5 つの発見](https://note.com/yuka_terasaki/n/ne59ee6afddbc)」という記事を公開していますのでぜひ読んでみてくださいね。

## はじめに

2023 年 2 月に 10X に入社した jojo です。

入社してエントリ書くぞと思っていたのですが時が経つのは早く、気づけば早 4 ヶ月が経ってしまいました（この企画がなければ、なかなか筆を取ることができなかったかもしれません笑）。

この記事は、かなり個人的な備忘録ですが興味を持ってくれた人に少しでもためになれば嬉しいです。今回は、私が 10X へ転職を決意した経緯と、この 4 ヶ月間で感じたことについて話していきます。

## 前職でやっていたことは？

新卒で入社した前職では、メガベンチャーで BtoB マーケティング領域の新規事業部のエンジニアをしていました。

チームが小さく、一人ひとりが多くの役割を担う環境だったため、落ちているボールは全て拾うぞーという勢いで私は 4 年間でサーバーサイド（Golang）の開発に関わりつつ、フロントエンド（React・TypeScript）も触りながら iOS アプリのリニューアルなどを行ったり広くプロダクト開発に携わる機会がありました。（新卒 1 年目のぺーぺーにも機会を惜しみなくくれた環境に本当に感謝です。）

また、PdM（プロダクトマネージャー）としての役割も任され、複数のステークホルダーと連携しながらプロダクトの仮説検証や施策推進を行いました。私が加入した当初は十数人規模だった事業部も、私が在籍している間に 50 人近くの組織に拡大して、事業は独立し、最終的には分社化するまで見届けました。

## なぜ転職を？

心理的安全が高く裁量もやりがいもある環境から移ることを考えたのは、結婚等を通して自分の人生を見つめ直して二十代最後の時間をどう使うかと考えたときにもう一段階ギアを上げることが求められるよりチャレンジングな環境に身を置くことが今の自分にとっては必要なんじゃないかと感じるようになっていったためです。

転職活動は初めてだったのでせっかくなら色んな人・業界の話を聞いてみたいと思い 30 社以上とカジュアル面談実施して広く話を聞きに行ってました。

各企業と話していて言語化された自分の価値観を Notion にまとめていきました。（一部抜粋）

![転職活動中にNotionにまとめていた価値観軸2](/images/join-10x/2.png)

そんな中で固まった転職軸は以下の 3 つです。

- 世の中のシリアスでインパクトの大きな課題解決に取り組んでいること
- エンジニアが事業づくりにおける越境をすることが肯定される組織であること
- ユーザー志向で素早く開発プロセス・プロダクト改善のサイクルを回していること

新卒で勤めていた会社を選んだ最大の理由も、「テクノロジーで世の中のシリアスで大きな課題の解決に取り組んでいる」という観点でした。また、私はエンジニアとして技術そのものがもちろん好きが、それ以上にその技術をどのように活用して課題解決に取り組むのか、どのような仮説を立てるのかに強い関心を持っています。

その上で、自分が作ったプロダクトがユーザーにとって真に価値あるものであると自信を持てるよう、絶えず改善を重ねられる組織に所属したいという思いが、多くの人々との対話を通じて明確になりました。（当時まとめていた Notion ページ抜粋）

![転職活動中にNotionにまとめていた価値観軸](/images/join-10x/1.png)

## なぜ 10X に？

10X への道のりは、たまたま遠方のサウナ（[みんな大好き The Sauna](lampinc.co.jp/nojiriko/sauna)）に行く道中で前職の先輩と「エンジニアもビズも関係なくイシューにこだわってプロダクト作ってる会社ありますかねー？」という何気ない会話をしたことがきっかけでした。

その先輩の紹介により 10X の [suumin](https://twitter.com/suuminbot) さんとのカジュアル面談の機会を得ることができ、「プロダクト開発への真摯な姿勢めっちゃいい！社会のインフラになり得るプロダクトにわくわくする！」と一瞬で 10X の魅力に強く引きつけられました。

10X への気持ちが本当かどうかを確かめる意味でも行った 30 以上の企業とのカジュアル面談を経ても、やはり自分の気持ちは変わらなかったです。以下、私が 10X に魅せられた理由を 3 つ挙げます。

### 事業：社会のインフラになると確信したネットスーパー領域のポテンシャルに対する期待

他の多くの商品がネットで買える中で、生鮮食品だけが物理的な店舗でしか購入され続けている現状が歪のある状態だと自分は思っています。そこには巨大な市場が存在しておりネットスーパー領域には伸びしろしかない状態で未来のインフラを作っていく事業にわくわくしました。（[参考：「Culture Deck」](https://speakerdeck.com/10xinc/zhu-shi-hui-she-10x-culture-deck?slide=11)）

![Culture Deck](/images/join-10x/3.png)

### 組織：長期的な視点で目の前の課題解決に向き合う組織

短期的な利益のために闇雲に事業を作っていくのではなく、「長期的に見て価値があるもの」に時間とリソースを使いたい、という矢本さんの強いマインドセットがプロダクト開発にも強く反映していることに魅力を感じました。(参考：[「「10 倍」の困難を知っているからこそ。社名とミッションに込めた「10X」の想い」](https://10x.co.jp/blog/10xblog/10x-mission-and-company/))

個人的にもじっくりと腰を据えて長期的な視点を持って大きなイシューに向き合い続けるというスタンスでプロダクトと向き合いたくそれがスタートアップにも関わらず持てていることがとてもすごいなと思っていました。

### 人：”WHY”にこだわる顧客志向を持ったプロフェッショナル集団

実際にエンジニアも BizDev も現場でユーザーの声をキャッチアップしてプロダクトを作っていくという話を聞いてすごく現場感が持ってイシューと向き合っているんだなと魅力を感じました。(参考：[10X プロダクト本部・エンジニアリング本部 紹介資料](https://speakerdeck.com/10xinc/10x-purodakutobu-men-shao-jie-zi-liao?slide=14))

自分も来週実際に店舗にいってチラシを配りに行ってきます！

あとはそもそも自分がユーザーなのでプロダクトのイシューに対して近い距離で向き合うことができるもの良かったです。

![転職活動中にNotionにまとめていた価値観軸](/images/join-10x/4.png)

## 今、何をしている？

私は主にネットスーパーアプリの開発しています。今まで経験がなかった Dart は今まで書いたことがなかったので不安でしたが癖のそこまでない言語なので割とシームレスに入っていくことができました（まだまだですが）。

また、少し前まではプロダクトの複雑化に伴うコンテキストスイッチの負荷増加を解消するためチームのドメイン境界を検証するプロジェクトにも取り組んでいました。(参考：[ドメインベースの開発体制への移行](https://product.10x.co.jp/entry/2023/04/28/080000))

## 10X に入社して感じたことは？

それでは 4 ヶ月 10X に入ってみて実際に感じたことを話していきます。

### 圧倒的 One Team な組織

現在開発チームは 5 つあるのですが、それぞれの開発プロセスにおける Good things があればそれを他のチームに自然と横展開していくという動きがあります。

例えば、開発規模が大きくなっていくと開発の認知負荷が増えていくので Dart Doc を拡充していくという動きとしてコメントをつける会を実施したりしたのですがそれを他のチームに自然と展開されて全チームで適応されて今では model を作ったらコメントをつけるのは当たり前になっています。

あとは、困ったことがあれば #all_ask-anythings チャンネル(誰が何を聞いても OK)にポストしたら直接仕事に関わりのなくてもわかる人がシュッと教えてくれたり、クイックに call で相談できる空気感もあってとても素敵です。

### ドキュメントカルチャーがすごい

個人ではなく組織・チームにナレッジが貯まるような仕組みになっているのでドキュメントを読めば分かる情報がたくさんあります。

過去の「このナレッジをドキュメントに残してくれてまじで助かった。」みたいなドキュメントがめっちゃ転がっていて自分の知見もストックしていこうという気持ちになる（call したらログを残す習慣もめっちゃある）。

### “もっと”よくなるために変わり続ける

10X はより良くなるために絶えず改善と進化を続けています。

例えば、今まで、全ドメイン横断チームで事業の拡大に連れてのコンテキストスイッチの負荷の拡大があり、その解決案としてドメインごとに開発チームを分割するという検証を行ったり（現在はドメインごとにチームが適切に分割されている）、チーム内だけでないだけでは課題解決できない課題に対してギルドチームを発足して別の角度からのアプローチを進めたり、スクラムチームでアジャイルに開発プロセスを改善し続ける姿勢がチーム全体にあります。

その結果、ワーキングアグリーメントが生まれたり、チームの効果測定と開発の割合などの可視化などどんどんチーム・組織の効率と品質を上げるための取り組みが積極的に行われているのです。（まさに 10X!）

### 抽象的な課題解決で未来にわくわくする

未来の市場を作っているということでまだまだ解決すべき課題の抽象度が高く、かつ複雑度も高いです。ただ、この組織ならできる、もっとこの人たちと一緒に世の中に価値のあるものを提供していきたいという気持ちに溢れてきます。

自分ももっと 10 X で本質的なイシューの探索と仮説検証に入り込んで顧客志向でのユーザーに寄り添ったプロダクト開発を推進していきます。

## 最後に

毎日が新しい刺激と学びに満ちており、非常に楽しい日々を送っています。そして、もしもこの記事が誰かの役に立つなら、とても嬉しいです。

そして 10X ではメンバーを募集しています！[採用ページ](https://10x.co.jp/recruit/)もぜひご覧ください。

明日は 前職でもお世話になった QAE のブロッコリー（[@nihonbuson](https://twitter.com/nihonbuson)）さんが記事を公開する予定です。お楽しみに！