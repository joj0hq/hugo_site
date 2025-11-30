+++
categories = ["engineering"]
tags = ["hugo", "firebase"]
date = "2019-11-10"
description = "This time, we'll create a static site using Firebase and Hugo for quick implementation."
linktitle = ""
title = "[Implement in 10 minutes!] Create a Static Website with Hugo and Firebase"
type = "post"
cover.image = "/images/2019/11/2019-11-10.png"

+++

## What We're Building

This time, we're creating a static website.

For a site like this blog that doesn't expect dynamic updates from multiple users, implementing with static pages allows you to develop a site that loads quickly.

![JOJO HACK Top Page](/images/2019/11/2019-11-10-p2.png)

Here, we'll quickly implement it using Firebase and Hugo.

## What is Hugo?

![HUGO](/images/2019/11/2019-11-10-p3.png)

What exactly is HUGO?

According to [HUGO's official site](https://gohugo.io/),

> Hugo is one of the most popular open-source static site generators.

> With its amazing speed and flexibility,

> Hugo makes building websites fun again.

In other words, HUGO is a framework that can generate static sites by creating static HTML.

### Benefits of HUGO

- Fast because of static pages
- Can reduce security risks
- Can write articles in Markdown format
- Easy site implementation using existing themes

Using static pages makes the site display speed fast, and without server-side processing, security risks can be reduced.

Above all, the charm of this framework is that articles written in Markdown format can be published as is.

This is a very appreciated benefit for all engineers!

On the other hand, for those unfamiliar with Markdown notation, a framework with a GUI like WordPress might be more convenient.

### Disadvantages of HUGO

- Unique notation with some learning cost
- Customizing existing themes can be tedious
- Dynamically building title tags and descriptions is troublesome

Basically, standard features are extensive, so there's little need for adding plugins.

Therefore, when you want to customize to a site that suits you, minimum JavaScript knowledge will be required for implementation.

## Creating a Static Site Locally with Hugo

First, let's quickly go through creating a static site in a local environment with HUGO.

If you just want to run it, you can create a website with just a few commands - that's what's amazing about HUGO.

Let's get started.

### Installing Hugo

This time, we'll develop in a Mac environment.

Let's install HUGO using brew.

```sh
brew install hugo
```

To check if the installation is complete,

```sh
hugo version
```

Verify by checking if the version command works.

By the way, for Linux or Windows users, you can check the installation method from the official site [here](https://gohugo.io/getting-started/installing/).

### Creating a Website

Next, let's create a website.

```sh
hugo new site jojo-hack (please give it your preferred name)
```

If you run such a command, you should get a comment like this:

```
Congratulations! Your new Hugo site is created in (PATH you specified for site creation).

Just a few more steps and you're ready to go:

1. Download a theme into the same-named folder.
   Choose a theme from https://themes.gohugo.io/, or
   create your own with the "hugo new theme <THEMENAME>" command.
2. Perhaps you want to add some content. You can add single files
   with "hugo new <SECTIONNAME>/<FILENAME>.<FORMAT>".
3. Start the built-in live server via "hugo server".

Visit https://gohugo.io/ for quickstart guide and full documentation.
```

Now the foundation has been created.

Next, as mentioned in this comment, let's add a HUGO site theme.

### Adding a Theme

You can find themes at [Hugo Themes](https://themes.gohugo.io/).

![Hugo Themes](/images/2019/11/2019-11-10-p4.png)

Here, we'll use **hugo-coder-portfolio**, which is used for JOJO HACK's theme.

```sh
cd jojo-hack // Move to the target project
$ git init
$ git submodule add https://github.com/naro143/hugo-coder-portfolio.git themes/hugo-coder-portfolio
```

Now that we've added the theme, let's modify the config.toml configuration file.

```sh
echo 'theme = "hugo-coder-portfolio"' >> config.toml
```

Now we've explicitly configured using hugo-coder-portfolio as the theme.

### Creating a Test Article

Finally, let's add a Hello World-style article.

```sh
hugo new posts/hello-world.md
```

Now we've created a new article.

Let's add Hello World to this file and remove draft mode (draft: false, or delete it).

```
---
title: "Hello World"
date: 2019-11-10T18:29:02+09:00
---

Hello World
```

Now all preparations are complete. Finally, let's check the display on localhost.

### Checking Operation on localhost

To check the display in a local environment,

```sh
hugo server -D
```

This command is OK. Now a web server has been built locally.

```sh
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

Let's access it right away.

### Generating Static Pages (Build)

```sh
hugo
```

### Installing Firebase Tools

```sh
npm i npm
$ npm install -g firebase-tools
```

### Initial Firebase Setup

Just select hugo

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

## Summary

We were able to quickly create our own blog with Hugo and firebase. Please try it.

