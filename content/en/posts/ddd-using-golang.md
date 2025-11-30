---
title: "[DDD] Expressing Domain Knowledge Through Models Using Golang"
description: "[DDD] Expressing Domain Knowledge Through Models Using Golang"
emoji: "🍖"
type: "tech" # tech: technical article / idea: idea
topics: ["Go", "DDD", "Domain-Driven Design", "Architecture", "Beginner"]
date: "2021-12-05"
categories: ["engineering"]
tags: ["Go", "DDD", "Domain-Driven Design", "Architecture", "Beginner"]
---

## Introduction

[This is a repost of the article from zenn.](https://zenn.dev/jojo/articles/4cec9606662446c502e9)

This is the 6th day article for [Go Advent Calendar 2021](https://qiita.com/advent-calendar/2021/go).

Since there are incredibly understandable books by Eric Evans sensei and predecessors about DDD,
I recommend reading these. (laugh)

- [Domain-Driven Design Modeling/Implementation Guide](https://little-hands.booth.pm/items/1835632)
- [Domain-Driven Design Sample Code & FAQ](https://little-hands.booth.pm/items/3363104)
- [Introduction to Domain-Driven Design: Understanding from Bottom-Up! Basics of Domain-Driven Design](https://www.amazon.co.jp/dp/B082WXZVPC)

So here, without detailed explanation of DDD,
I'll explain how to incorporate domain knowledge into software using models with Golang,
with a simple concrete example.

## What is Domain-Driven Design (DDD)?

Having said that, let me briefly explain what domain-driven design is.
Here are the definitions from [DDD Reference](https://www.domainlanguage.com/ddd/reference/):

> Domain-Driven Design is an approach to the development of complex software in which we:
>
> 1. Focus on the core domain.
> 2. Explore models in a creative collaboration of domain practitioners and software practitioners.
> 3. Speak a ubiquitous language within an explicitly bounded context.
>
> This three-point summary of DDD depends on the definition of the terms, which are defined in this booklet.
> Source URL: https://www.domainlanguage.com/ddd/reference/

In [Videos from DDD Europe 2016](https://youtu.be/dnUFEg68ESM), the expression is slightly different, but it's defined as follows:

> What is Domain Driven Design?
>
> 1. Focus on the core complexity and opportunity in the domain
> 2. Explore models in a collaboration of domain experts and software experts
> 3. Write software that expresses those models explicitly
> 4. Speak ubiquitous language within a bounded context

Translated to Japanese:

> 1. Focus on the core complexity and opportunities in the domain 2. Explore models in collaboration of domain experts and software experts 3. Write software that explicitly expresses those models 4. Speak ubiquitous language within bounded contexts

In other words,

```
Software developers and domain experts align their understanding using the same language,
continuously explore domain models, and incorporate those models into software
```

can be said to be DDD.
(Eric Evans himself also said "it's difficult to define clearly," so it's difficult to define it categorically.)

## What is a Domain Model?

Let's also refer to [DDD Reference](https://www.domainlanguage.com/ddd/reference/) for this definition.

> domain
> A sphere of knowledge, influence, or activity. The subject area to which the user applies a program is the domain of the software.
>
> model
> A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.

Here's DeepL sensei's translation:

> Domain:
> A sphere of knowledge, influence, or activity. The subject area to which the user
> applies a program is the domain of that software.
>
> Model:
> A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.

In other words, it defines that `a domain is a business concern, and a model is the subject of solving that domain's issues with software`.

## What Are Invariants?

Having reviewed DDD and domain models,
let's next touch on invariants when considering business constraints.
Invariants refer to `states that must be consistently maintained during the period a model is valid`.
For example, let's take a TODO list application.
After conducting requirement definition, we found that the following invariants need to be satisfied:

- A task must have a name, due date, and priority
- When a task is created, it becomes incomplete status
- Once a task is completed, it becomes completed status and the status cannot be reverted
- A task can be postponed 5 times, by 1 day each time
- Task name and priority cannot be changed

Now, let's incorporate these invariants into code.

## [Failure Pattern] Model That Doesn't Express Domain Knowledge

First, let's implement in the domain layer without expressing domain knowledge.

Domain layer

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

// Create setters for all items
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

// Create a method with behavior for now
func (t *task) CanPostpone() bool {
	return t.postponeCount < POSTPONE_MAX_COUNT
}
```

Done!
This implementation feels like not much thought was put into it. laugh
Now let's implement the application layer (use case layer).

```go
type TaskApplication struct {
	ctx      context.Context
	taskRepo repository.TaskRepository
}

func (s *TaskApplication) CreateTask(name string, dueDate time.Time, priority domain.PriorityStatus) error {
	if name == "" || dueDate.IsZero() {
		return errors.New("Required items are not set.")
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
		return errors.New("Maximum extension count exceeded.")
	}
	task.SetDueDate(task.GetDueDate().Add(24 * time.Hour))
	task.SetPostponeCount(task.GetPostponeCount() + 1)
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}
```

Now we've implemented something that meets the requirements.
Let's release it.

However, half a year later, a newly joined engineer implemented the following code.

Application layer

```go
func (s *TaskApplication) CreateDoneTask(taskID, name string, dueDate time.Time, taskStatus domain.TaskStatus, priority domain.PriorityStatus) error {
	task := domain.NewTask()
	task.SetTaskStatus(domain.TaskStatusDone) // Create task in completed state
	task.SetPostponeCount(-1)                 // Set negative count
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}

func (s *TaskApplication) ChangeTask(taskID, name string, dueDate time.Time, taskStatus domain.TaskStatus, priority domain.PriorityStatus) error {
	task := domain.NewTask(
	task.SetName(name)             // Changing task name which shouldn't be changed
	task.SetPriority(priority)     // Changing priority which shouldn't be changed
	task.SetDueDate(dueDate)       // Arbitrarily setting due date with input, ignoring extension count
	task.SetTaskStatus(taskStatus) // Can revert task to incomplete
	if err := s.taskRepo.Save(ctx, task); err != nil {
		return err
	}
	return nil
}
```

The invariants were destroyed so much it makes you wonder what they were.
Domain knowledge has evaporated somewhere and couldn't be noticed.

While the application specifications are expressed to some extent,
since there are Setter/Getters for all items, the task model itself doesn't express anything.

This state is called `anemic domain model`.

So, how can we resolve this anemia and incorporate invariants into the implementation?
Let's continue to look at a model that expresses domain knowledge.

## [Success Pattern] Model That Expresses Domain Knowledge

Here's the domain layer implementation.

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

// Express invariants when creating entity
func NewTask(name string, dueDate time.Time, priority PriorityStatus) (*task, error) {
	if name == "" || dueDate.IsZero() {
		return nil, errors.New("Required items are not set.")
	}
	return &task{
		taskStatus:    TaskStatusDoing,
		name:          name,
		dueDate:       dueDate,
		priority:      priority,
		postponeCount: 0,
	}, nil
}

// Express invariants regarding state transitions of created entities
func (t *task) Postpone() (*task, error) {
	if !t.CanPostpone() {
		return nil, errors.New("Maximum extension count exceeded.")
	}
	t.dueDate.Add(24 * time.Hour)
	t.postponeCount++
	return t, nil
}

func (t *task) Done() {
	t.taskStatus = TaskStatusDone
}

// No setters for name and priority exist, so name and priority cannot be changed

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

Here's the application layer.

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

The application layer implementation has become incredibly simple.
And business concerns are now consolidated in the domain layer, don't you think?

Let's look at the invariants again.

- A task must have a name, due date, and priority
- When a task is created, it becomes incomplete status
- Once a task is completed, it becomes completed status and the status cannot be reverted
- A task can be postponed 5 times, by 1 day each time
- Task name and priority cannot be changed

Yes! The invariants are properly incorporated into code in the domain layer.
By designing like this,
you can understand the Task model's invariants just by looking at the domain layer implementation,
and you can make it impossible to implement code that destroys the application's invariants no matter what code is written.

This is what it means to `have a model expressing domain knowledge`.

## Summary

DDD is:

> 1. Focus on the core complexity and opportunities in the domain 2. Explore models in collaboration of domain experts and software experts 3. Write software that explicitly expresses those models 4. Speak ubiquitous language within bounded contexts

And to express domain knowledge in code,
consolidate invariants in the domain layer, so that other engineers can
aim for a state where even without knowing domain knowledge, it's expressed in software,
and we can `develop with a focus on solving essential issues using more complex models`.

I'd be happy if this was helpful to everyone even a little.
I'm looking forward to comments and feedback!

## References

- [little hands' lab - I Want to Evangelize Domain-Driven Design](https://little-hands.hatenablog.com/)
- [Domain-Driven Design Modeling/Implementation Guide](https://little-hands.booth.pm/items/1835632)
- [Domain-Driven Design Sample Code & FAQ](https://little-hands.booth.pm/items/3363104)
- [Introduction to Domain-Driven Design: Understanding from Bottom-Up! Basics of Domain-Driven Design](https://www.amazon.co.jp/dp/B082WXZVPC)
- [Eric Evans' Domain-Driven Design](https://www.amazon.co.jp/dp/B00GRKD6XU)
- [Implementing Domain-Driven Design](https://www.amazon.co.jp/dp/B00UX9VJGW)

