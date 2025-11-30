+++
categories = ["http"]
tags = ["http", "book", "beginner"]
date = "2019-07-16"
description = "About Session Management Vulnerabilities"
linktitle = ""
title = "Session Management Vulnerabilities"
type = "post"

+++

## URL-embedded Session ID

### Overview

Sessions can be embedded in URIs.

PHP, Java, ASP.NET and others support this.

```
http://example.jp/mail/123?SESSIONID=XXXXXXX
```

Issues:

- Session IDs leak externally via the Referer header ([What is the Referer header](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referer))

> The Referer header allows servers to identify where people are visiting from, and can be used for analysis, logging, and cache optimization.

Countermeasures:

- Prohibit URL-embedded sessions themselves

### Attack Methods and Impact

Attack flow:

- Start page (transitions to another page)
- Page with external links (SESSIONID attached as a parameter)
- External page (obtains SESSIONID from referer header)

  1. Change configuration file to enable URL-embedded sessions

  2. External site links exist or attacker can create links (mail, bulletin board, blog, SNS)

Impact:

Same as session hijacking

### Root Causes of Vulnerabilities

- Due to "Cookie is harmful theory" that arose around the year 2000

  -> Problem from privacy perspective that access history can be tracked

- Influence of docomo's feature phone browsers not supporting cookies in the past

  ---> Now considered safer to store in cookies?

### Countermeasures

Just configure to store session IDs only in cookies

## Session ID Fixation

### Overview

Among attacks causing session hijacking, there's a **Session Fixation Attack** that forces a session ID from outside.

Attack flow:

- Obtain session ID

- Force target to access with stolen session ID

- Target logs into target app

- Attacker logs into target app using forced session ID

Countermeasures:

- Change session ID on login

### Session ID Attack After Login

- Click on trap site
- Transition to login page with URL embedded with `SESSIONID=ABC`
- Enter username etc. and login directly
- Attacker logs in using `SESSIONID=ABC`

### Session ID Attack Before Login

- Click on trap site
- Enter personal information at URL embedded with `SESSIONID=ABC`
- At this stage, personal information is displayed on attacker's browser

POINT:
If session variables are used on pages that don't require authentication, there's a possibility of session ID attacks.

### "Session Adoption" That Accepts Unknown Sessions

PHP and ASP.NET can accept unknown sessions, so they allow `SESSIONID=ABC`

For attacks on apps running on middleware without session adoption,
browse the target application, obtain a valid session ID, and use this session

In other words, even without session adoption, session ID attacks before login are possible

For session fixation attacks on sites that only store session IDs in cookies
Using browser vulnerabilities etc., fixation is effective even for session IDs stored in cookies

- Cookie monster bug
- Cross-site scripting
- HTTP header injection

If an attacker exists on the communication path, cookies can be altered with proxy tools like OWASP ZAP
Even with HTTPS, if a cookie is set with plaintext HTTP, that cookie is also valid with HTTPS
-> In other words, there's no way to prevent cookie alteration!
[I tested experimentally that even using HTTPS doesn't prevent Cookie manipulation](https://blog.tokumaru.org/2013/09/cookie-manipulation-is-possible-even-on-ssl.html)

Impact
Everything possible after logging in

## Root Causes of Vulnerabilities

Being able to force session IDs from outside

Countermeasures

- Don't embed session IDs in URLs
- Don't use browsers with cookie monster bug
- Don't use prefecture-type JP domains and regional-type JP domain names where cookie monster bugs occur easily
- Eliminate cross-site script vulnerabilities
- Eliminate HTTP header injection vulnerabilities
- Eliminate other vulnerabilities that can rewrite cookies

It's impossible to counter all of these
-> It's generally accepted to allow session IDs to be forced from outside and take countermeasures to prevent session hijacking even if fixation attacks occur
**Changing the session ID when authentication succeeds** is effective

### Countermeasures for Session ID Fixation Attacks After Login

- Change session after authentication
- If session cannot be changed, countermeasure with tokens
  -> Generate token on login
  Authenticate OK only if cookie token and session variable token values match
  Use cryptographically secure pseudorandom number generator for token generation

### Countermeasures for Session ID Fixation Attacks Before Login

- Before login, don't use session management mechanism and pass around values with hidden parameters, which is effective

## Summary

- Don't create your own session management mechanism, use the Web application development tool's
- Store session IDs in cookies
- Change session ID on successful authentication
- Don't store secret information in session variables before authentication

