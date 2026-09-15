---
layout: layouts/article.njk
title: "Inheritance Without the Middlemen"
description: "What a will looks like if you replace the lawyer, the notary, and the bureaucracy in between with a smart contract - and the one problem that's still unsolved."
date: 2021-04-21
---
Inheritance, as it currently works, is fundamentally a contract between two parties: the person who has died and the person who benefits, with the terms defined in a will and a small industry of lawyers, notaries, and legal process sitting in between to make sure those terms get honored. That middle layer exists for good reasons — verification, dispute resolution, legal enforceability — but it's also slow, expensive, and entirely dependent on institutions that have to be trusted to do their job correctly and honestly, every single time, for every single estate.

I keep thinking about what that process looks like if you replace the middle layer with a smart contract instead of a law firm.

## The Basic Shape

The person who owns the assets — while very much alive — writes their terms and conditions directly into a contract: who the beneficiary is, what they receive, under what conditions. This isn't limited to money or property in the traditional sense. It could just as easily govern cryptocurrency, digital files, video archives, or any other kind of asset that can be represented digitally. Once the terms are set, the contract sits there, inert, doing nothing, until the condition that triggers it — the person's death — is met.

The person also designates someone they trust and gives that person a key. Not necessarily a physical object; it could be a passphrase, a seed phrase, any string that functions as proof of authorization. When the time comes, that key is what unlocks the contract and releases the assets to the beneficiary exactly as specified, with no lawyer required to interpret intent, no notary required to certify a signature, no court required to arbitrate a dispute about what the deceased "really meant."

## What This Actually Removes

The appeal isn't really about saving money on legal fees, although it would do that too. It's that the entire process becomes self-executing and unambiguous. The terms are the terms; there's no interpretation gap between what's written and what's honored, because a smart contract doesn't have opinions about ambiguous phrasing the way a probate court might. It also removes a layer of institutional trust that the current system requires — you have to trust that the law firm you hired decades ago is still operating, still has your documents, still remembers what you wanted, and that everyone in the chain behaves in good faith. A contract on a distributed ledger doesn't get sold to another firm, doesn't lose a filing cabinet in a flood, and doesn't need to remember anything, because it isn't capable of forgetting.

## The Part I Haven't Solved

Here's the honest problem, and it's not a small one: where does the key live, and how does it actually get triggered on death?

A key stored anywhere digital is one bad decade of technology shifts away from being unreadable, one hack away from being stolen while the owner is still alive and very much not ready to transfer anything, or one forgetful trusted-person away from being lost entirely. A key stored physically has all the usual physical-object problems — fire, theft, simple misplacement — plus the added complication that whoever holds it now has the *power* to unlock the contract whenever they want, not just when the death condition is actually met. You need some mechanism that verifies the triggering condition itself, not just guards the key, and "prove someone has died" turns out to be a much harder problem to put into a trustless system than "prove a transaction is valid."

I don't have that piece solved. I'm not sure anyone does yet, cleanly. But the rest of the idea — terms without lawyers, execution without probate, assets that transfer on a condition rather than on a bureaucrat's timeline — feels like exactly the kind of problem worth sitting with until the key-custody piece catches up.
