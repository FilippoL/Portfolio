#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.GH_ACTIVITY_TOKEN;
const USERNAME = 'FilippoL';
const WINDOW_DAYS = 91;

if (!TOKEN) {
    console.error('GH_ACTIVITY_TOKEN is not set');
    process.exit(1);
}

const to = new Date();
const from = new Date(to.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

const query = `
  query($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function computeStreaks(days) {
    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    let longestStreak = 0;
    let running = 0;
    for (const day of days) {
        if (day.count > 0) {
            running++;
            longestStreak = Math.max(longestStreak, running);
        } else {
            running = 0;
        }
    }

    return { currentStreak, longestStreak };
}

async function main() {
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables: { from: from.toISOString(), to: to.toISOString() }
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed: ${response.status} ${await response.text()}`);
    }

    const json = await response.json();
    if (json.errors) {
        throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const collection = json.data.viewer.contributionsCollection;
    const days = collection.contributionCalendar.weeks
        .flatMap((week) => week.contributionDays)
        .map((day) => ({ date: day.date, count: day.contributionCount }));

    const { currentStreak, longestStreak } = computeStreaks(days);

    const snapshot = {
        username: USERNAME,
        generatedAt: new Date().toISOString(),
        totalContributions: collection.contributionCalendar.totalContributions,
        totalCommits: collection.totalCommitContributions,
        totalPullRequests: collection.totalPullRequestContributions,
        totalIssues: collection.totalIssueContributions,
        totalReviews: collection.totalPullRequestReviewContributions,
        currentStreak,
        longestStreak,
        days
    };

    const outputPath = fileURLToPath(new URL('../_data/githubActivity.json', import.meta.url));
    await writeFile(outputPath, JSON.stringify(snapshot, null, 2) + '\n');
    console.log(`Wrote ${days.length} days, ${snapshot.totalContributions} total contributions to ${outputPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
