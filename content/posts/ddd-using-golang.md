---
title: "【DDD】Golangを使ってモデルでドメイン知識を表現してみた"
description: "【DDD】Golangを使ってモデルでドメイン知識を表現してみた"
emoji: "🍖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Go", "DDD", "ドメイン駆動設計", "アーキテクチャ", "初心者向け"]
published: true
date: "2021-12-05"
categories: ["engineering"]
tags: ["Go", "DDD", "ドメイン駆動設計", "アーキテクチャ", "初心者向け"]
---

## はじめに

[zenn の記事の転載です。](https://zenn.dev/jojo/articles/4cec9606662446c502e9)

これは[Go Advent Calendar 2021](https://qiita.com/advent-calendar/2021/go)の 6 日目の記事です。

DDD についてはエリック・エヴァンス先生や先人の鬼ほどわかりやすい書籍があるので、
こちらを読むことをおすすめします。（笑）

- [ドメイン駆動設計 モデリング/実装ガイド](https://little-hands.booth.pm/items/1835632)
- [ドメイン駆動設計 サンプルコード&FAQ](https://little-hands.booth.pm/items/3363104)
- [ドメイン駆動設計入門 ボトムアップでわかる！ドメイン駆動設計の基本](https://www.amazon.co.jp/dp/B082WXZVPC)

なのでここでは、DDD を詳しく解説などはせずに、
Golang を使ってモデルでドメイン知識をどのようにソフトウェアに落とし込むのか、
簡単な具体例をあげて説明していきます。

## ドメイン駆動設計(DDD)とは？

とはいっても、ドメイン駆動設計とはなんぞやをカンタンに説明しておきますね。
[DDD Reference](https://www.domainlanguage.com/ddd/reference/)での定義を以下に記します。

> Domain-Driven Design is an approach to the development of complex software in which we:
>
> 1. Focus on the core domain.
> 2. Explore models in a creative collaboration of domain practitioners and software practitioners.
> 3. Speak a ubiquitous language within an explicitly bounded context.
>
> This three-point summary of DDD depends on the definition of the terms, which are defined in this booklet.
> 出典 URL：https://www.domainlanguage.com/ddd/reference/

[Videos from DDD Europe 2016](https://youtu.be/dnUFEg68ESM)では、微妙に表現は異なりますが以下のように定義しています。

> What is Domain Driven Design?
>
> 1. Focus on the core complexity and opportunity in the domain
> 2. Explore models in a collaboration of domain experts and software experts
> 3. Write software that expresses those models explicitly
> 4. Speak ubiquitous language within a bounded context

こちらを日本語に意訳すると、

> 1.ドメインの中核となる複雑さと機会に焦点を当てる 2.ドメインのドメイン専門家とソフトウェア専門家のコラボレーションでモデルを探求する 3.明示的にそれらのモデルを表現するソフトウェアを書く 4.境界づけられたコンテキストの中でユビキタスな言語を話す

つまり、

```
ソフトウェア開発者とドメインエキスパートが同じ言葉で認識をすり合わせて、
ドメインモデルについて探求し続け、それらのモデルをソフトウェアに落とし込むこと
```

が DDD であると言えるでしょう。
(Eric Evans 本人も「明確に定義するのは難しい」と言っていたりするので一概に定義するのは難しいですが。)

## ドメイン・モデルとは？

こちらも[DDD Reference](https://www.domainlanguage.com/ddd/reference/)で定義されていたので参考にしていきましょう。

> domain
> A sphere of knowledge, influence, or activity. The subject area to which the user applies a program is the domain of the software.
>
> model
> A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.

以下が DeepL 先生の意訳です。

> ドメイン：　
> 知識、影響力、または活動の範囲のこと。ユーザーがプログラムを適用する対象領域が
> プログラムを適用する対象領域が、そのソフトウェアのドメインです。
>
> モデル:
> あるドメインの選択された側面を記述し、そのドメインに関連する問題を解決するために使用することができる抽象化のシステム。

つまりは`ドメインは業務的な関心事、モデルはソフトウェアでそのドメインの課題解決する対象`と定義しています。

## 不変条件とは？

DDD とドメイン・モデルがおさらいできたところで、
次に業務上の制約を考える上で、不変条件に触れていきましょう。
不変条件とは、`モデルが有効である期間中に、常に一貫している必要のある状態`を指します。
例えば、TODO リストのアプリケーションを例にとってみます。
要件定義を行ったところ、以下の普遍条件を満たす必要があるということがわかりました。

- タスクは必ず名称と期日と優先度を持つ
- タスクを作成すると未完了ステータスとなる
- タスクは完了したら完了ステータスとなり、ステータスを戻せない
- タスクは 5 回だけ、1 日ずつ延期できる
- タスク名、優先度は変更できない

では、この不変条件を使って次に実際にコードへ落とし込んでいきます。

## [失敗パターン]ドメインの知識を表現していないモデル

まずはドメイン知識を表現できていないドメイン層に実装しています。

ドメイン層

```go
type task struct {
	id            string
	taskStatus    TaskStatus
	name          string
	dueDate       time.Time
	priority      PriorityStatus
	postponeCount int64
}

func NewTask() *task {
	return &task{}
}

const POSTPONE_MAX_COUNT = 5

type TaskStatus string

const (
	TaskStatusDoing TaskStatus = "doing"
	TaskStatusDone  TaskStatus = "done"
)

type PriorityStatus string

const (
	PriorityStatusHigh   PriorityStatus = "high"
	PriorityStatusMiddle PriorityStatus = "middle"
	PriorityStatusLow    PriorityStatus = "low"
)

// setterを全項目分作成しちゃう
func (t *task) SetID(id string) {
	t.id = id
}
func (t *task) SetTaskStatus(taskStatus TaskStatus) {
	t.taskStatus = taskStatus
}
func (t *task) SetName(name string) {
	t.name = name
}
func (t *task) SetDueDate(dueDate time.Time) {
	t.dueDate = dueDate
}
func (t *task) SetPriority(priority PriorityStatus) {
	t.priority = priority
}
func (t *task) SetPostponeCount(postponeCount int64) {
	t.postponeCount = postponeCount
}

// getter
func (t *task) GetID() string {
	return t.id
}
func (t *task) GetName() string {
	return t.name
}
func (t *task) GetTaskStatus() TaskStatus {
	return t.taskStatus
}
func (t *task) GetDueDate() time.Time {
	return t.dueDate
}
func (t *task) GetDueDate() PriorityStatus {
	return t.priority
}
func (t *task) GetPostponeCount() int64 {
	return t.postponeCount
}

// とりあえず振る舞いをもたせたメソッドを作っておく
func (t *task) CanPostpone() bool {
	return t.postponeCount < POSTPONE_MAX_COUNT
}
```

できました！
何も考えずに実装している感がありますね。笑
では次にアプリケーション層（ユースケース層）を実装していきます。

```go
type TaskApplication struct {
	ctx      context.Context
	taskRepo repository.TaskRepository
}

func (s *TaskApplication) CreateTask(name string, dueDate time.Time, priority domain.PriorityStatus) error {
	if name == "" || dueDate.IsZero() {
		return errors.New("必須項目が設定されていません。")
	}
	task := domain.NewTask()
	task.SetTaskStatus(domain.TaskStatusDoing
	task.SetName(name))
	task.SetPriority(priority)
	task.SetDueDate(dueDate)
	task.SetPostponeCount(0)
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}

func (s *TaskApplication) PostponeTask(taskID string) error {
	task, err := s.taskRepo.GetByID(ctx, taskID)
	if err != nil {
		return err
	}
	if !task.CanPostpone() {
		return errors.New("最大延長回数を超過しています。")
	}
	task.SetDueDate(task.GetDueDate().Add(24 * time.Hour))
	task.SetPostponeCount(task.GetPostponeCount() + 1)
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}
```

とりあえず、これで要件は満たしている実装ができましたね。
ではリリースしちゃいましょう。

ただ、半年後に新しくジョインしたエンジニアが以下のコードを実装しました。

アプリケーション層

```go
func (s *TaskApplication) CreateDoneTask(taskID, name string, dueDate time.Time, taskStatus domain.TaskStatus, priority domain.PriorityStatus) error {
	task := domain.NewTask()
	task.SetTaskStatus(domain.TaskStatusDone) // 完了自体でタスクを作成
	task.SetPostponeCount(-1)                 // カウントにマイナスを設定
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}

func (s *TaskApplication) ChangeTask(taskID, name string, dueDate time.Time, taskStatus domain.TaskStatus, priority domain.PriorityStatus) error {
	task := domain.NewTask(
	task.SetName(name)             // 変更しては行けないタスク名を変更してしまってる
	task.SetPriority(priority)     // 変更しては行けない優先度を変更してしまっている
	task.SetDueDate(dueDate)       // 勝手に期日を入力値で設定、延長回数も無視してしまってる
	task.SetTaskStatus(taskStatus) // タスクを未完了に戻せてしまう
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}
```

不変条件とは何だったのかと思うくらいに破壊しました。
ドメイン知識どこかに空中分解したようなので気づくことができませんでした。

一応、アプリケーションの仕様は表現されているようですが、
すべての項目に Setter/Getter があるのでタスクのモデル自体は何も表現していません。

このような状態を`ドメインモデル貧血症`といいます。

では、どのようにしたらこの貧血症を解消して、不変条件を実装に落とし込むことができるしょうか。
続いて、ドメインの知識を表現できているモデルを見ていきましょう。

## [成功パターン]ドメインの知識を表現しているモデル

以下がドメイン層の実装になります。

```go
type task struct {
	id            string
	taskStatus    TaskStatus
	name          string
	dueDate       time.Time
	priority      PriorityStatus
	postponeCount int64
}

const POSTPONE_MAX_COUNT = 5

type TaskStatus string

const (
	TaskStatusDoing TaskStatus = "doing"
	TaskStatusDone  TaskStatus = "done"
)

type PriorityStatus string

const (
	PriorityStatusHigh   PriorityStatus = "high"
	PriorityStatusMiddle PriorityStatus = "middle"
	PriorityStatusLow    PriorityStatus = "low"
)

// エンティティ作成時の不変条件を表現する
func NewTask(name string, dueDate time.Time, priority PriorityStatus) (*task, error) {
	if name == "" || dueDate.IsZero() {
		return nil, errors.New("必須項目が設定されていません。")
	}
	return &task{
		taskStatus:    TaskStatusDoing,
		name:          name,
		dueDate:       dueDate,
		priority:      priority,
		postponeCount: 0,
	}, nil
}

// 作成済みエンティティの状態遷移に関する不変条件を表現する
func (t *task) Postpone() (*task, error) {
	if !t.CanPostpone() {
		return nil, errors.New("最大延長回数を超過しています。")
	}
	t.dueDate.Add(24 * time.Hour)
	t.postponeCount++
	return t, nil
}

func (t *task) Done() {
	t.taskStatus = TaskStatusDone
}

// name,priorityのsetterは存在しないので、name,priorityを変更することはできない

// getter
func (t *task) GetID() string {
	return t.id
}
func (t *task) GetName() string {
	return t.name
}
func (t *task) GetDueDate() time.Time {
	return t.dueDate
}
func (t *task) GetDueDate() PriorityStatus {
	return t.priority
}

func (t *task) IsDoing() bool {
	return t.taskStatus == TaskStatusDoing
}
func (t *task) CanPostpone() bool {
	return t.postponeCount < POSTPONE_MAX_COUNT
}
```

以下がアプリケーション層です。

```go
type TaskApplication struct {
	ctx      context.Context
	taskRepo repository.TaskRepository
}

func (s *TaskApplication) CreateTask(name string, dueDate time.Time, priority domain.PriorityStatus) error {
	task, err := domain.NewTask(name, dueDate, priority)
	if err != nil {
		return err
	}
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}

func (s *TaskApplication) PostponeTask(taskID string) error {
	task, err := s.taskRepo.GetByID(ctx, taskID)
	if err != nil {
		return err
	}
	postponedTask, err := task.Postpone()
	if err != nil {
		return err
	}
	if err := s.taskRepo.Save(ctx, postponedTask); err != nil {
		return err
	}
	return nil
}
```

アプリケーション層の実装がめちゃくちゃシンプルになりましたね。
そして、ドメイン層に業務的な関心事が集約されたのではないでしょうか。

改めて、不変条件を見てみましょう。

- タスクは必ず名称と期日と優先度を持つ
- タスクを作成すると未完了ステータスとなる
- タスクは完了したら完了ステータスとなり、ステータスを戻せない
- タスクは 5 回だけ、1 日ずつ延期できる
- タスク名,優先度は変更できない

うん！しっかり、ドメイン層へ普遍条件がコードに落とし込めていますね。
このような設計をすることで、
ドメイン層の実装を見るだけで Task モデルの不変条件を理解することができ、
どんなコードを書いてもアプリケーションの不変条件を破壊するような実装ができないようにすることができます。

これが`モデルがドメインの知識を表現しているということができている`ということですね。

## まとめ

DDD とは、

> 1.ドメインの中核となる複雑さと機会に焦点を当てる 2.ドメイン専門家とソフトウェア専門家のコラボレーションでモデルを探求する 3.明示的にそれらのモデルを表現するソフトウェアを書く 4.境界づけられたコンテキストの中でユビキタスな言語を話す

で、ドメインの知識をコードに表現するには、
ドメイン層に不変条件を集約して、他のエンジニアがドメイン知識がわからなくても、
ソフトウェアで表現できている状態を目指していくと、
`より複雑なモデルを用いて本質的な課題解決に焦点を当てた開発ができる`のではないでしょうか。

少しでも皆さんの参考になれたら嬉しいです。
コメント・フィードバックもドジドジお待ちしています。

## 参考文献

- [little hands' lab - ドメイン駆動設計を布教したい](https://little-hands.hatenablog.com/)
- [ドメイン駆動設計 モデリング/実装ガイド](https://little-hands.booth.pm/items/1835632)
- [ドメイン駆動設計 サンプルコード&FAQ](https://little-hands.booth.pm/items/3363104)
- [ドメイン駆動設計入門 ボトムアップでわかる！ドメイン駆動設計の基本](https://www.amazon.co.jp/dp/B082WXZVPC)
- [エリック・エヴァンスのドメイン駆動設計](https://www.amazon.co.jp/dp/B00GRKD6XU)
- [実践ドメイン駆動設計](https://www.amazon.co.jp/dp/B00UX9VJGW)
