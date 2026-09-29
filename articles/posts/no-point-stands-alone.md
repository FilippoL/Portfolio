---
layout: layouts/article.njk
title: "No Point Stands Alone"
description: "Why peer-to-peer connection — in friendship, in encryption, in blockchain — isn't just the safest architecture, but the only one where anything actually means something."
date: 2026-09-15
---
I keep landing back on the same shape, no matter which direction I approach it from. Whether I'm thinking about a friendship, an encrypted message, or a blockchain transaction, the structure underneath is identical: two points, and a direct line between them, with nothing standing in the middle claiming the right to read, judge, or intercept what passes along it. I used to think of that as a nice property. I've started to think it's closer to a requirement.

## A Point Alone Isn't Anything

I wrote [a while back](/articles/posts/a-node-alone-is-nothing/) that a node, by itself, means nothing — it's just a location with no distance from anything else, and distance is where meaning actually lives. I don't think that idea stayed confined to graphs and networks. A person, considered in total isolation, doesn't really have an identity either, not in any way that matters day to day. We define ourselves relationally, constantly, whether we notice it or not: I'm someone's friend, someone's son, someone's colleague, someone who argues a certain way with certain people and goes quiet with others. Take away every edge and you're not left with a purer version of the person. You're left with an undefined point. Life is a graph, and a single point in it is not self-representative — it only becomes something in relation to the points it's connected to.

That's not a metaphor I'm reaching for to make a technical argument sound deeper. I think it's the actual reason bilateral connection keeps showing up as the right answer, in contexts that have nothing to do with each other on the surface.

## Where This Shows Up Socially

The friendships that have actually held up for me — the ones from Rome I've kept since I was fourteen, the ones I've built since moving countries — are all bilateral in a specific sense: they exist between two people directly, not routed through a platform, an audience, or a performance of the friendship for anyone else watching. Broadcast relationships, the one-to-many kind that social platforms are built to maximize, can feel like connection without actually supplying the thing connection is for, which is being known by someone specific and knowing them back. A post seen by three hundred people isn't three hundred relationships. It's one point transmitting outward with no distance closed on either end.

## Where This Shows Up Technically

End-to-end encryption is the same shape wearing different clothes. Its entire safety property comes from refusing to let anything sit in the middle of a conversation — not the platform carrying it, not a government requesting access, not an attacker who's compromised the server in between. The message only ever exists, in readable form, at the two endpoints that were supposed to have it. I've [written before](/articles/posts/centralised-federated-or-peer-to-peer/) about the three ways power and data get arranged — centralised, federated, or fully peer-to-peer — and encryption is where that framework gets the clearest possible verdict. A centralised system can promise not to read your messages. A peer-to-peer, end-to-end encrypted one doesn't have to promise, because it structurally can't. The bilateral connection isn't the cautious choice here. It's the only one where the guarantee is real instead of a policy someone could quietly change.

Blockchain runs on the same principle at a different scale: a transaction is valid because it verifies directly against the one before it, peer to peer, without asking a central ledger-keeper to vouch for it. I've argued elsewhere that [decentralisation is fundamentally about where power sits](/articles/posts/power-of-decentralisation/), and this is the sharpest version of that argument — power sits nowhere, because trust is established directly between the two parties in the transaction, not delegated to a third one holding the master copy.

## Necessary, Not Just Safe

I think "safer" undersells what's actually going on. A bilateral connection isn't just harder to attack, easier to trust, or more resistant to a single point of failure — although it's all of those things too. It's necessary because it's the only structure that actually produces the thing everyone's after in the first place: a relationship, a secret, a transaction that means what it claims to mean. Route it through a third point and you haven't made it safer with extra steps. You've changed what it is. A broadcast isn't a weaker friendship, it's not a friendship. A message a server can read isn't a slightly less private message, it's not private. The moment a third point enters what was supposed to be a direct line between two, the line stops representing the thing it was supposed to represent — same as a single node in a graph, standing alone, representing nothing at all.
