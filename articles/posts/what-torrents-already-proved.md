---
layout: layouts/article.njk
title: "What Torrents Already Proved"
description: "Peer-to-peer file-sharing ran the largest decentralisation experiment in computing history before blockchain made it fashionable - and it doubles as a blueprint for resisting centralised power."
date: 2026-09-29
---
Long before anyone was pitching blockchains as the future of trust, peer-to-peer file-sharing had already run the experiment at a scale almost nothing else has matched: millions of ordinary computers, with no central server, moving an enormous share of the internet's traffic for the better part of two decades. It gets dismissed as a piracy story, which it partly is, but underneath the piracy is a security architecture that quietly answered a question a lot of more "serious" systems still haven't: what happens to a network when there's no single point left to attack?

## The Resilience Nobody Credited

A torrent doesn't live on a server. It lives in pieces, scattered across whoever currently has them, reassembled on the fly from however many peers happen to be online at the moment. There's no address to subpoena, no company to pressure, no single machine that, if seized or switched off, takes the file down with it. And it has a property almost no centralised system shares: it gets *more* resilient and *faster* as more people use it, not less. Centralised infrastructure groans under load and needs more servers thrown at the problem. A healthy swarm does the opposite — every new peer is both a consumer and a source, so popularity feeds the network's capacity instead of draining it.

That's not an accident of file-sharing specifically. It's what happens whenever you remove the single point that everything else used to depend on.

## The Same Architecture, With Secrecy Bolted On

End-to-end encryption is the same idea pointed at confidentiality instead of availability. A torrent swarm has nothing to shut down because no single node holds the whole file; an end-to-end encrypted conversation has nothing to compel or hack out of the middle because no single party in the middle ever holds the whole, readable message. I've written before about why that makes the privacy guarantee [structurally real rather than a policy that could be walked back](/articles/posts/no-point-stands-alone/) — a platform can promise not to read your messages, but a system that was never built to be able to read them doesn't need to promise anything. Torrents proved the "no single point to attack" half of that argument for availability, years before anyone needed to prove the equivalent for confidentiality.

## Blockchain Inherits the Same Resilience

A blockchain is the same architecture again, pointed at trust instead of file transfer or secrecy. Instead of one institution keeping the ledger and everyone else trusting it was kept honestly, the ledger exists everywhere at once, verified peer-to-peer, with no single operator whose shutdown, seizure, or corruption would take the whole system down. I laid out the broader [centralised, federated, or peer-to-peer framework](/articles/posts/centralised-federated-or-peer-to-peer/) for thinking about where power and data can sit, and blockchain is the sharpest version of the third option: nothing to subpoena, nothing to switch off, because nothing is sitting in any one place to begin with.

## A Weapon, Not Just a Preference

It's easy to treat all of this as a philosophical taste — some people prefer centralised convenience, some prefer decentralised principle, pick your side. I think that undersells what's actually at stake. [Centralisation concentrates power](/articles/posts/power-of-decentralisation/) by design: whoever runs the server decides who gets access, whose account gets suspended, whose data gets sold, whose content gets removed, and there's exactly one place a government or a corporation needs to apply pressure to make any of that happen everywhere at once. Decentralised, peer-to-peer architecture isn't just a nicer-feeling alternative to that. It's one of the few practical countermeasures ordinary people actually have against it, because it removes the lever that concentrated power depends on pulling.

Torrents proved you don't strictly need a central distributor to move information at scale. End-to-end encryption proved you don't need a trusted middleman to have a private conversation. Blockchain is proving you don't need a central authority to agree on what's true. None of these technologies were built by the people they protect against being told "no" — they were built by people who noticed the single point of control was the actual vulnerability, not a necessary feature. Going forward, choosing the peer-to-peer version of a tool over the centralised one isn't a nostalgia trip for the early internet. It's picking the version of the system that can't be switched off by whoever happens to be in charge this decade.
