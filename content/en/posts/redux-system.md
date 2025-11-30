---
title: "[Introduction] Understanding the Redux State Management System"
emoji: "🍖"
type: "tech" # tech: technical article / idea: idea
topics: ["react", "redux", "js", "frontend", "beginner"]
date: "2021-03-21"
categories: ["engineering"]
tags: ["react", "redux", "js", "frontend", "beginner"]
description: "[Introduction] Understanding the Redux State Management System"
---

## Conclusion First

[This is a repost of the article from zenn.](https://zenn.dev/jojo/articles/25c10b27783093)

To understand Redux, if you can understand this diagram (source: [Redux Application Data Flow](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#redux-application-data-flow)), you're 90% there.

![](https://storage.googleapis.com/zenn-user-upload/92alq46m4gh0v1sprqgf46m3f38r)

1. From user input, (ActionCreator) creates an Action
2. Dispatch (send) the Action to Store (where state is managed)
3. Pass the dispatched Action to Reducer (where state is changed)
4. Store saves the new State created by Reducer
5. Reference data from Store and render in View (screen)

If there are any corrections like "This is wrong!" or "This mechanism is also used!", please give me feedback! (That's partly why I'm writing this!)

## What is Redux

[Redux](https://redux.js.org/) is a framework for managing the state of UI that React handles.
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/3bd8bfcf-a885-b584-294c-f307b70e4820.png)

In React, [Flux](https://facebook.github.io/flux/) is proposed for the data flow to manage state, but Redux is designed to be more manageable by extending the Flux concept.
While it can be used with AngularJS or jQuery, using it with React is better.

[Redux - GitHub](https://github.com/reduxjs/redux)

## Redux's Three Principles

Redux's basic design is based on the following three principles.
Let's look at them in order.

## Single source of truth

This principle can be summarized as follows.

- The entire application's state is created as a single object in tree form and stored in a single store
- Since State is easy to store, it's easy to create universal applications
- Since State is single, it's easy to debug and develop

The following diagram shows the State structure of a sample application using [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).
![Diagram](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/426da52e-ec7a-1dc1-5f73-ea548f504baf.png)

In other words, you cannot create multiple Stores like this:

```js
const store = createStore(sample);
const store2 = createStore(sample);
```

## State is read-only

This principle states:

- The only means to change state is to issue and execute an Action object with the change content
- Views or callbacks cannot directly change the state
- Changes are made one by one in order
- Since Actions are objects, they can be saved and are easy to test

## Mutations are written as pure functions

And this is the final principle.

- How actions change state is done in "Reducers"
- "Reducers" are functions that receive state and action and return new state
- The key point is not to change the current State object, but to create and return a new State object
- When developing, start with one Reducer for the application, and as it grows, split the Reducers

![State is read-only](https://storage.googleapis.com/zenn-user-upload/jjsyg69aqpszdrftdby7fh07jx8m)

## Overall Structure

Now, let's check the overall structure again (source:
[Redux. From twitter hype to production](http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/27])).
This diagram is more abstracted than the one shown at the beginning.
There are new elements, but I'll explain them later, so don't worry about them here.

![redux diagram](https://storage.googleapis.com/zenn-user-upload/d0fynf9oun172ovf2qcwntt6yg2q)

1. From user input, ActionCreator creates an Action
2. Dispatch (send) the Action to Store
3. Pass the dispatched Action to Reducer
4. Store saves the new State created by Reducer
5. Reference data from Store and render in View

Now, I'd like to explain with a specific application example,
but before that, let me roughly explain the components.

## Components

There are the following 7 components.
Let's look at them one by one.

- View
- ActionCreator
- Action
- Middleware
- State
- Reducer
- Store

### View: The screen users see

View refers to the screen actually displayed to users.
Since users click buttons or input text to generate events, this screen is the starting point of event processing.

![redux_fig3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/e88bcbd4-92d4-0d9c-510a-99b220430cbe.png)

### ActionCreator: Generates actions

ActionCreator, as the name suggests, performs the process of generating actions.
In the diagrammed part, it corresponds to Actions shown in blue dialogs.

![redux_fig4.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/f2e55558-8014-ce49-cd75-ada456bbd79f.png)

### Action: User's input action

Action refers to the action that the user inputs.
For example, clicking a button or inputting text.
When clicking a button triggers multiple processes, multiple actions may be issued for a single user input.

![redux_fig5.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/553acf7e-f450-9040-983f-31307d3cad54.png)

### Middleware: Watches actions and incorporates side effects

Middleware monitors the issuance of actions and performs processing to incorporate side effects for certain specific processes.
For example, when clicking a button triggers an API call to the server, this Middleware handles the connection processing to the API.
Conversely, for simple processes that just change the View's state and don't interact with the server - actions without side effects - Middleware processing is not involved.

![redux_fig6.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/912dc342-6a0d-d75c-2d4d-43036bf3ac47.png)

### Reducer: The only thing that can rewrite the application's state

Reducer is the only thing that can rewrite the application's state.
As in Redux's basic design Single source of truth, only this Reducer can rewrite State.
It has the role of propagating processing from actions.

![redux_fig7.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/4200ed43-eb67-bfe5-f6b6-e2d352610ccc.png)

### State: The application's state

State indicates the application's state.
For example, states like whether a checkbox is checked, or whether data was successfully retrieved via API call.

![redux_fig8.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/e91e1cf5-a7cb-ac86-9dc9-078c892761f7.png)

### Store: Saves the application's state

Store is the place that saves the application's state.
It contains State, and when State is changed by Reducer, the State saved in Store is rewritten.

![redux_fig9.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/236878/26aac20b-f77a-b575-e157-de4401949eec.png)

## Processing Flow

Now, let's look at the processing flow using a task management TODO app as an example.

Here's the task management TODO app.

@[codesandbox](https://codesandbox.io/embed/github/jotaro-biz/todo-app-with-redux/tree/main/?fontsize=14&hidenavigation=1&theme=dark)

## User input issues an Action

Let's look at a use case where we add a task by inputting "Do muscle training" and clicking the "Add" button to add the task to the TODO list item.

![Input "Do muscle training"](https://storage.googleapis.com/zenn-user-upload/j5oa9l5miqr24i0pezqcj84etbs2 =400x)

First, define the action to add a task.

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

Then, to dispatch (send) the action defined here from the View, add processing to `InputWithButton`. (Having UI components hold state + domain knowledge is an anti-pattern in some cases, but here I'll explain in this form to understand the processing flow.)

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
          Add
        </button>
      </div>
    );
  }
}
```

Here, the text input to the input is:

```js
this.state = { input: "" };
```

Stored in local State like this, and the Action is dispatched when the add button is pressed.

```js
<button className="add-todo" onClick={this.handleAddTodo}>
  Add
</button>
```

Also, `handleAddTodo` processes emptying the input at the same time as dispatching the action.

```js
handleAddTodo = () => {
  this.props.addTodo(this.state.input);
  this.setState({ input: "" });
};
```

`ADD_TODO` is a pre-defined action.
Here, ActionCreator generates the action.

## Pass the propagated (dispatched) Action to Reducer, Reducer updates State and saves it to Store

Reducer receives the dispatched Action and executes processing to rewrite the Store saved in the Store according to that Action.

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

`allIds` represents all tasks, and when the action `ADD_TODO` is dispatched, the newly created TODO task is added to the state `allIds`.

## Reference data from Store and render in View

When a new TODO task is added, that change is also reflected in the View.

![State with newly added task](https://storage.googleapis.com/zenn-user-upload/6yd48wunxjr59wtyw4gcotkbkgbl =400x)

Here, because the `TodoList` component is monitoring the State saved in the Store, it's immediately reflected.

![TodoList](https://storage.googleapis.com/zenn-user-upload/hk1oy3pjdqozvcpfspni9f5wfxxg =400x)

```js:TodoList.js
const TodoList = ({ todos }) => (
  <ul className="todo-list">
    {todos && todos.length
      ? todos.map((todo, index) => {
          return <TodoItem key={`todo-${todo.id}`} todo={todo} />;
        })
      : "No tasks."}
  </ul>
);

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  const todos = getTodosByVisibilityFilter(state, visibilityFilter);
  return { todos };
};
export default connect(mapStateToProps)(TodoList);
```

Let's move to where `getTodosByVisibilityFilter` is defined.
Here `selector` appears for the first time,
but this is the person who processes/selects data when retrieving the store's state before throwing it to the view.
In this case, it processes the data to be retrieved by filtering with "all, completed, incomplete".

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

So the processing to bring data from the original store is done by this `getTodos`.

```js:selector.js
export const getTodos = store =>
getTodoList(store).map(id => getTodoById(store, id));
```

Now we've understood the series of flows performed when adding a todo task.

This time, since it was a simple application without server interaction, it was simple processing without Middleware, but when actually creating a service, a more complex design will be required.
About this in the next article.

I hope this helps those learning Redux even a little!
If you have any advice or questions, please feel free to send them via [twitter](https://twitter.com/jojo__hack) DM or comments!

