+++
categories = ["10X"]
tags = ["10X", "career", "engineer"]
date = "2024-12-17T00:00:00+09:00"
description = "Reflecting on my two years as an engineer at 10X - what I've done and what I've been thinking."
title = "Reflecting on Two Years as an Engineer at 10X"
type = "post"
cover.image = "/images/2024-12-17.png"
cover.linkFullImages = true
cover.responsiveImages = true
cover.relative = true

+++

## Introduction

Hello. I'm JOJO ([@joj0hq](https://x.com/joj0hq)), a software engineer in my second year at 10X. I'm currently developing on the Sales Floor Team, which is mainly responsible for developing the online supermarket app that customers use for shopping.

This article is the 17th day entry for the [10X Advent Calendar 2024](https://10xall.notion.site/10X-2024-1443747cdaf180a4a8dbcd7267044c57). Yesterday, hisaichi ([@hisaichi5518](https://x.com/hisaichi5518)) published an article titled "[Creating architecture rules with custom_lint](https://hisaichi5518.hatenablog.jp/entry/2024/12/16/080000)", so please check it out as well.

## My Favorite Points About 10X

The way we systematically solve operational issues as much as possible. For example, there's a mechanism where mentioning `@google_meet` automatically issues a Google Meet URL and sends notifications encouraging recording of conversations. This creates an environment where discussion content doesn't evaporate and is shared. There are many such mechanisms at 10X.

![Google Meet conversation recording reminder](/images/10x-engineer-journey-2nd-year/1.png)

## Expectations When Joining

This blog hasn't been updated since my previous joining entry - it's been a really long time, but I'm enjoying life every day. Since it's been a little over a year since [my previous joining entry](https://joj0hq.com/posts/join-10x), I'd like to reflect on my current position compared to my initial thoughts when joining.

The decisive factors for my job change were these three points:

> - Business: Expectations for the potential of the online supermarket sector, which I was convinced would become social infrastructure
> - Organization: An organization that faces current issues with a long-term perspective
> - People: A professional group with a customer-oriented "WHY" focus

To summarize briefly, I expected to be able to focus on raising product value with team members who could mutually inspire each other in a business I strongly believed would have a major impact on the world, and to pour energy into solving long-term, high-issue-level problems rather than immediate issues.

## What I Did and What I Thought

Now, let's talk about what I've actually been doing along with the team's evolution.

### Shopping Team Era (February 2023~): Team Formation and Epic Waves

When I joined, I was assigned to the "Shopping Team." At that time, 10X was introducing a domain-based team structure, with teams being reorganized to handle specific domains. The "Shopping Team" was positioned as a team responsible for the entire shopping-related domain, covering an exceptionally wide range even among domain teams.

Here's a rough bullet-point summary of what I worked on in this team:

```markdown
- BOPIS (Buy Online Pick-up In Store) support for web applications
- Standardization of OTC pharmaceutical sales
- Log infrastructure for mobile applications
- Development of new product ranking feature
- Refactoring of sales floor tabs
- Refactoring of product pickup methods
- Implementation of Braze
- Flutter major version updates, etc.
```

The "Shopping Team" handled various shopping functions in the online supermarket app and had a very wide range of responsibilities. On the other hand, since it was a newly formed team, we also proceeded with building the team's foundation in parallel. For example, we worked on introducing working agreements within the team and improving Scrum ceremonies, gradually solidifying the team's form.

To deepen my understanding of the field, I also experienced the pick-pack work that store staff do when I joined. Through this experience, I raised the resolution of the business flow and consciously maintained a user perspective. I also became a "heavy user" who uses the online supermarket 1-2 times a week after joining, wanting to stand from the user's perspective.

In the Shopping Team, we seamlessly switched between server-side and client-side development, and I was heavily involved in client-side development. Especially, developing mobile apps with Flutter was my first experience, but frequent pair programming with team members allowed me to participate in development smoothly. I'm still grateful to the team members for this.

The particularly memorable initiative was developing the product ranking feature. To realize this function, refactoring the foundational code on the mobile app side was necessary. Therefore, I first created a Design Doc and implemented refactoring of the tab structure for switching sales floor categories. Then, I realized the function while collaborating with other teams. This initiative had a significant impact on app UX and business, and it was a very educational experience for me. (For specific partners, there were major changes such as making the ranking the first sales floor displayed after app launch.)

![Product Ranking Feature](/images/10x-engineer-journey-2nd-year/2.png)

You can also listen to the story from that time in [【Engineer's Room Episode 3】Talking with the Shopping Team (mainly toC product development) with @jojo](https://www.youtube.com/watch?v=9G3-MKgBlhw) if you're interested!

What I was conscious of in daily development was aiming for "overall product optimization" rather than "partial optimization." At that time, there were cases where partner-specific features became technical debt. Therefore, I always thought about whether what I was working on was the optimal choice for the entire product while developing.

### Sales Floor Team Era (April 2024~): Bottom-up Initiatives and Foundation Building

I was assigned from the Shopping Team to the newly formed "Sales Floor Team." This Sales Floor Team was born as a result of separating the domains related to store operations and the sales floor on the app.

Here's a summary of the main initiatives in this team:

```markdown
- Accessibility support for visually impaired people
- Rollout of store groups to all partners
- Development of bulk product delisting feature
- Elimination of default stores (refactoring)
- Mobile app re-architecture, etc.
```

The accessibility initiative for visually impaired people was a focused initiative by the Sales Floor Team. When we conducted user interviews with visually impaired people after implementing accessibility support, I felt truly fulfilled as an engineer when they said in person, "It's rare to see an app read aloud this well!"

![Customer reaction to screen reader support](/images/10x-engineer-journey-2nd-year/3.png)

For details, futabooo also presented at FlutterKaigi, so if you're interested, please read "[How an online supermarket supported screen readers, or user acquisition through improved accessibility](https://www.docswell.com/s/futabooo/ZXE4NX-flutterkaigi2024)".

We also inherited the mobile app architecture issues that had gradually emerged since the Shopping Team era, and in the Sales Floor Team, we created ADRs for mobile app re-architecture and solidified the direction through verbalization.

Since the Sales Floor Team didn't have a dedicated PdM, many bottom-up engineer-led initiatives were advanced. What I kept in mind when raising initiatives was whether solving one issue could solve multiple issues. Particularly impressive was the refactoring to eliminate the concept of "default store." This concept was not only causing issues with sales floor experience improvement and code simplification but also generating significant noise in analytics data. Through this initiative, it became a good example of how solving one issue simultaneously solved multiple problems, contributing to improving the sales floor experience and system health.

![Reaction to eliminating default stores](/images/10x-engineer-journey-2nd-year/4.png)

### New Sales Floor Team Era (November 2024~): Embodying Think 10X and More

From November 2024, we reorganized the Sales Floor Team's domain, separating the area related to product data management with partners. With this, the Sales Floor Team's responsibilities were redefined, members were reshuffled, and a new team was formed.

The main initiatives (and ongoing activities) in this new team are as follows:

```markdown
- Improvement of customer app CUJ SLO
- Construction of promotional infrastructure with Braze
- Enhancement of product sales information, etc.
```

We defined the customer's core purchase experience as "Critical User Journey (CUJ)" and worked on improving the SLO (Service Level Objective) set for related RPCs. Through this, we successfully reduced performance by 1/10 through data loading design improvements. Achieving a numerical 10X efficiency improvement was a very significant achievement for me.

![SLO improvement results](/images/10x-engineer-journey-2nd-year/5.png)

Also, when enhancing product sales information, we conducted user interviews inviting six online supermarket users per day. Through this initiative, we were able to obtain real feedback on new features and reflect it in the product. The process of refining features while directly listening to user voices was very meaningful, and I want to actively incorporate this going forward.

## From Now On

My desire to work on businesses that impact the world, focus on product value with professional colleagues, and proceed with problem-solving from a long-term perspective remains unchanged. I will continue to commit to business growth and continue challenges to further increase value.

Currently, in addition to promoting initiatives, the foundation supporting core product value is steadily being established through SLO improvements and re-architecture. Leveraging this foundation, I will actively advance more aggressive development from now on and accelerate further growth.

10X is actively recruiting software engineers. Please also check out our recruitment page.

Recruitment page: https://open.talentio.com/r/1/c/10x/pages/97170

And tomorrow, kotaroooo0 is scheduled to publish an article. Look forward to it!

