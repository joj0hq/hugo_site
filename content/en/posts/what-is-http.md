+++
categories = ["http"]
tags = ["http", "book", "beginner"]
date = "2019-07-15"
description = ""
linktitle = ""
title = "[Beginner Must-Read] HTTP Basics - Technology Supporting the Web Explained in 5 Minutes"
type = "post"

+++

### HTTP Basics

What is HTTP? You probably only have the impression of it being at the beginning of URLs like http://…..com, right?

If we search for HTTP on Wikipedia:

> Hypertext Transfer Protocol (HTTP) is a communication protocol used for sending and receiving content such as HTML. It is mainly used for transfer between web browsers and web servers on the World Wide Web. In Japanese standard specifications, it is also called hypertext transfer protocol.
>
> HTTP/1.1 is specified in RFC 7230 through RFC 7235. RFC 2616, which previously specified HTTP/1.1, is also frequently referenced. Additionally, HTTP/2 is specified in RFC 7540.
>
> https://ja.wikipedia.org/wiki/Hypertext_Transfer_Protocol

Honestly, there are too many technical terms to understand well...

#### What is HTTP

HTTP (Hypertext Transfer Protocol) is a method (protocol) for transferring (transferring) resources called hypertext.

Even this isn't very clear, right?

Breaking it down more, HTTP means "the **communication method** for **web servers** and **clients** to exchange data".

As an analogy, it's the communication method for data exchange between computers so that readers (=clients) can view JOJOHACK (=web server).

The "http" in http://….com was indicating that data will be transferred using the "http" method.

There are other communication methods like FTP, but HTTP is currently mainstream as the communication method on the Web.

#### Data That Can Be Transferred

In the past, only text data called hypertext could be communicated.

However, currently, the data that can be sent using HTTP includes:

- Hypertext
- Still images
- Audio
- Video, etc...
and much more.

In other words, if it's data, almost anything can be sent.

#### HTTP Features

A characteristic is that it was created based on the REST concept.

REST is:

> Representational State Transfer (REST) is one style of software architecture for distributed hypermedia systems like the web. This term first appeared in 2000 in a doctoral dissertation written by en:Roy Fielding, one of the main authors of the HTTP protocol standard, about the web, and quickly came to be widely used in the networking community.
>
> REST initially referred to a collection of architecture principles and constraints (described below), but gradually came to be used loosely to mean simple web-based interfaces using XML and HTTP that don't use special abstractions like MEP (Message Exchange Pattern; templates for establishing message exchange patterns between SOAP nodes) based Web Services SOAP protocol.
>
> https://ja.wikipedia.org/wiki/Representational_State_Transfer

It's a difficult but very important web architecture style.

I'll explain this in detail in another article, but simply put, it's a design philosophy thoroughly thought out about how to create a simple yet versatile mechanism.

For now, let me just list the important keywords.

| Keyword              | Content                                               |
| -------------------- | -------------------------------------------------- |
| Client-Server        | Separate processing between client and server side |
| Statelessness        | Don't maintain application state on server side    |
| Cache                | Reduce communication count by holding data on client side |
| Uniform Interface    | Fix the interface                                  |
| Layered System       | Separate system into layers                        |
| Code-On-Demand       | Download and execute programs on client            |

Below, I'll focus on Client-Server and Statelessness to explain.

![What is HTTP]()

### Request and Response

Communication between client and server has this flow.

![Request and Response]()

#### HTTP Constructs and Sends Request Message

First, the client creates a message to tell the server what to do, to which site, and using what communication format.

For example, when searching for "JOJOHACK" on Google, it creates a message containing information like the keyword "JOJOHACK" and that it will be sent via "HTTP" communication.

Then it sends that message to the client.

Detailed explanation of HTTP messages will be done later.

#### Server Receives and Analyzes Request Message

The server receives the message and analyzes what information was contained.

#### Delegating Processing to Application Program

After that, the server delegates to derive information suitable for "JOJOHACK" search results from Google's database and algorithm based on the analysis results.

#### Constructing Response Message

Then, it obtains correct search results and creates the search results screen using HTML and CSS.

It consolidates this information into a response message.

#### Sending Response Message

Client receives response message
Analyzes response message

### HTTP Message

So what information is contained in these request and response messages?

Both messages have the structure of start line, header, and body.

#### Request Message Structure

The start line contains method + URI + protocol version.

For example:

```
GET https://engineer-traver.hatenablog.com/ HTTP/1.1
```

Something like this.

The header indicates data type, character coding method, etc.

The body contains supplementary information and attaches queries during POST submission.

#### Response Message Structure

The start line contains protocol version + status code + text phrase.

For example:

```
HTTP/1.1 200 OK
```

Something like this.

The header, like the request, indicates data type, character coding method, etc.

The body attaches all obtained data, that is, HTML files etc.

![HTTP Message]()

### HTTP Versions

HTTP ver1.1 is currently mainstream.

![HTTP Version 1]()
![HTTP Version 2]()

