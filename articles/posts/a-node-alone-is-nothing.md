---
layout: layouts/article.njk
title: "A Node Alone Is Nothing"
description: "A node only means something in relation to other nodes — a small idea about graphs that keeps showing up everywhere once you start looking for it."
date: 2018-07-17
---
I keep coming back to a stupidly simple idea: a node, on its own, is nothing. It's not a concept, not an object, not even really a "thing" — it's just a point with no meaning until something else exists for it to have a distance from. The moment you introduce a second node, you get a relationship. Introduce enough of them and the relationships start forming something bigger than either node individually — a society, if you want to be dramatic about it. An artifact, at minimum.

What got me was noticing how far that one idea travels once you stop thinking of it as a computer science thing.

## The Same Shape, Everywhere

Nodes and the distances between them are obviously how we think about networks and graphs in code — routing, dependency trees, neural nets, all of it. But the same shape shows up the moment you look at geography, at ethnography, at architecture. A city block is a node relative to the blocks around it. A cultural group only has an identity in relation to the groups it's not. A building's floor plan is a graph of rooms connected by the "edges" of doorways, and the interesting property was never any single room — it's how the rooms relate.

Once I noticed that, I couldn't stop seeing it. Machine learning models that are supposedly about "understanding" data are, underneath, mostly about measuring distance — how far is this point from that one, in whatever embedding space we've projected it into. The whole discipline of graphics I care about is nodes and edges wearing a trench coat. And all of it maps back onto something recognizably human: we don't understand ourselves in isolation either, we understand ourselves relative to family, friends, the city we grew up in, the people we're not.

## What I Actually Want to Build

The idea I keep circling is small on purpose: a program that draws a line from a node to another node, and from that node other lines branch out to others again. Nothing about a single line is interesting. What's interesting is the *order* — which node reaches out first, which connection happens next, how the sequence of who-connects-to-whom shapes the overall structure that emerges. If you let that ordering be driven by randomness rather than a fixed rule, you start getting shapes that feel less designed and more grown, which is closer to how real networks — social, biological, architectural — actually seem to form.

I don't think this is a groundbreaking observation. It's closer to a reminder I keep having to give myself: don't get distracted by the node. The node was never the point. The point is always the distance.
