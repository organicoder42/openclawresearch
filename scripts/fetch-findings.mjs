#!/usr/bin/env node

/**
 * Fetches research submissions and bounty claims from GitHub Issues,
 * parses them into structured data, and writes src/data/findings.json.
 *
 * Usage: node scripts/fetch-findings.mjs
 * Env: GITHUB_TOKEN (optional, increases rate limit)
 */

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = 'organicoder42/openclawresearch';
const API = 'https://api.github.com';
const OUTPUT = join(__dirname, '..', 'src', 'data', 'findings.json');

// Task metadata for enrichment
const TASKS = {
  'find-funding': { title: 'Find Funding Sources for LHON Research', category: 'Funding' },
  'connect-researchers': { title: 'Map the Global LHON Research Network', category: 'Networking' },
  'support-foundations': { title: 'Support LHON Foundations and Organizations', category: 'Foundation Support' },
  'discover-solutions': { title: 'Discover Innovative Solutions from Adjacent Fields', category: 'Innovation' },
  'compile-research': { title: 'Compile and Organize LHON Research Data', category: 'Data' },
  'monitor-publications': { title: 'Monitor New LHON Publications and News', category: 'Monitoring' },
  'map-patient-registries': { title: 'Map LHON Patient Registries Worldwide', category: 'Data' },
  'treatment-cost-analysis': { title: 'Analyze LHON Treatment Costs and Access', category: 'Data' },
};

const headers = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchIssues(label) {
  const issues = [];
  let page = 1;
  while (true) {
    const url = `${API}/repos/${REPO}/issues?labels=${label}&state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      break;
    }
    const data = await res.json();
    if (data.length === 0) break;
    issues.push(...data);
    page++;
  }
  return issues;
}

/**
 * Parse YAML form issue body.
 * GitHub renders form responses as: ### Label\n\nValue\n\n### Next Label\n\n...
 */
function parseFormBody(body) {
  if (!body) return {};
  const fields = {};
  const sections = body.split(/^### /m).filter(Boolean);
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const label = lines[0].trim();
    const value = lines.slice(1).join('\n').trim();
    // Normalize label to snake_case key
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    fields[key] = value;
  }
  return fields;
}

function extractSources(sourcesText) {
  if (!sourcesText) return [];
  return sourcesText
    .split('\n')
    .map(line => line.trim().replace(/^-\s*/, ''))
    .filter(line => line.startsWith('http'));
}

function parseConfidence(text) {
  if (!text) return 'medium';
  const lower = text.toLowerCase();
  if (lower.includes('high')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
}

function getStatus(issue) {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  if (labels.includes('accepted') || labels.includes('verified')) return 'accepted';
  if (labels.includes('rejected')) return 'rejected';
  return 'pending';
}

function getConfidenceFromStatus(status, parsedConfidence) {
  if (status === 'accepted') return 'verified';
  return parsedConfidence;
}

function parseResearchIssue(issue) {
  const fields = parseFormBody(issue.body);
  const taskId = fields.task || fields.task_id || null;
  const sources = extractSources(fields.sources);
  const parsedConfidence = parseConfidence(fields.confidence || fields.confidence_level);
  const status = getStatus(issue);

  return {
    id: issue.number,
    type: 'research',
    title: issue.title.replace(/^\[Research\]\s*/i, '').trim() || 'Research Submission',
    taskId: taskId && TASKS[taskId] ? taskId : null,
    taskCategory: taskId && TASKS[taskId] ? TASKS[taskId].category : null,
    submitter: issue.user.login,
    submitterAvatar: issue.user.avatar_url,
    date: issue.created_at,
    summary: (fields.findings || '').slice(0, 500),
    sourceCount: sources.length,
    sources,
    confidence: getConfidenceFromStatus(status, parsedConfidence),
    status,
    issueUrl: issue.html_url,
    labels: issue.labels.map(l => l.name),
  };
}

function parseBountyIssue(issue) {
  const fields = parseFormBody(issue.body);
  const sources = extractSources(fields.sources || '');
  const status = getStatus(issue);

  return {
    id: issue.number,
    type: 'bounty-claim',
    title: issue.title.replace(/^\[Bounty Claim\]\s*/i, '').trim() || 'Bounty Claim',
    taskId: fields.bounty_id || null,
    taskCategory: null,
    submitter: issue.user.login,
    submitterAvatar: issue.user.avatar_url,
    date: issue.created_at,
    summary: (fields.summary || fields.summary_of_findings || '').slice(0, 500),
    sourceCount: sources.length,
    sources,
    confidence: getConfidenceFromStatus(status, 'medium'),
    status,
    issueUrl: issue.html_url,
    labels: issue.labels.map(l => l.name),
  };
}

function buildKnowledgeBase(submissions) {
  const byTask = {};

  for (const sub of submissions) {
    if (!sub.taskId) continue;
    if (!byTask[sub.taskId]) {
      byTask[sub.taskId] = {
        taskId: sub.taskId,
        taskTitle: TASKS[sub.taskId]?.title || sub.taskId,
        taskCategory: TASKS[sub.taskId]?.category || 'Unknown',
        findings: [],
      };
    }

    // For V1: each submission becomes a finding (dedup by shared sources later)
    byTask[sub.taskId].findings.push({
      summary: sub.summary,
      submissionIds: [sub.id],
      sourceCount: sub.sourceCount,
      confidence: sub.confidence,
      firstSeen: sub.date,
      lastUpdated: sub.date,
    });
  }

  // Deduplicate within each task: merge findings that share 50%+ sources
  for (const entry of Object.values(byTask)) {
    entry.findings = deduplicateFindings(entry.findings, submissions);
  }

  // Ensure all tasks are represented
  for (const [taskId, meta] of Object.entries(TASKS)) {
    if (!byTask[taskId]) {
      byTask[taskId] = {
        taskId,
        taskTitle: meta.title,
        taskCategory: meta.category,
        findings: [],
      };
    }
  }

  return Object.values(byTask);
}

function deduplicateFindings(findings) {
  if (findings.length <= 1) return findings;

  const merged = [];
  const used = new Set();

  for (let i = 0; i < findings.length; i++) {
    if (used.has(i)) continue;
    const current = { ...findings[i], submissionIds: [...findings[i].submissionIds] };

    for (let j = i + 1; j < findings.length; j++) {
      if (used.has(j)) continue;
      // Simple heuristic: if summaries are very similar (share >50% words), merge
      const words1 = new Set(current.summary.toLowerCase().split(/\s+/));
      const words2 = new Set(findings[j].summary.toLowerCase().split(/\s+/));
      const overlap = [...words1].filter(w => words2.has(w)).length;
      const similarity = overlap / Math.max(words1.size, words2.size);

      if (similarity > 0.5) {
        current.submissionIds.push(...findings[j].submissionIds);
        current.sourceCount += findings[j].sourceCount;
        if (findings[j].firstSeen < current.firstSeen) current.firstSeen = findings[j].firstSeen;
        if (findings[j].lastUpdated > current.lastUpdated) current.lastUpdated = findings[j].lastUpdated;
        // Keep highest confidence
        const rank = { low: 0, medium: 1, high: 2, verified: 3 };
        if ((rank[findings[j].confidence] || 0) > (rank[current.confidence] || 0)) {
          current.confidence = findings[j].confidence;
        }
        used.add(j);
      }
    }

    merged.push(current);
    used.add(i);
  }

  return merged;
}

function buildAnalytics(submissions) {
  const submissionsPerTask = {};
  for (const task of Object.keys(TASKS)) {
    submissionsPerTask[task] = 0;
  }
  for (const sub of submissions) {
    if (sub.taskId && submissionsPerTask[sub.taskId] !== undefined) {
      submissionsPerTask[sub.taskId]++;
    }
  }

  // Submissions over time (group by date)
  const byDate = {};
  for (const sub of submissions) {
    const date = sub.date.split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  }
  const submissionsOverTime = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Coverage gaps
  const coverageGaps = Object.keys(TASKS).filter(id => !submissionsPerTask[id]);

  // Contributors
  const contribMap = {};
  for (const sub of submissions) {
    if (!contribMap[sub.submitter]) {
      contribMap[sub.submitter] = { username: sub.submitter, avatar: sub.submitterAvatar, count: 0 };
    }
    contribMap[sub.submitter].count++;
  }
  const topContributors = Object.values(contribMap).sort((a, b) => b.count - a.count).slice(0, 10);

  return {
    submissionsPerTask,
    submissionsOverTime,
    coverageGaps,
    contributorCount: Object.keys(contribMap).length,
    topContributors,
  };
}

async function main() {
  console.log('Fetching research submissions...');
  const researchIssues = await fetchIssues('research');
  console.log(`  Found ${researchIssues.length} research issues`);

  console.log('Fetching bounty claims...');
  const bountyIssues = await fetchIssues('bounty-claim');
  console.log(`  Found ${bountyIssues.length} bounty-claim issues`);

  // Parse all issues (filter out pull requests)
  const submissions = [
    ...researchIssues.filter(i => !i.pull_request).map(parseResearchIssue),
    ...bountyIssues.filter(i => !i.pull_request).map(parseBountyIssue),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const uniqueContributors = new Set(submissions.map(s => s.submitter));
  const totalSources = submissions.reduce((sum, s) => sum + s.sourceCount, 0);

  const data = {
    lastUpdated: new Date().toISOString(),
    totalSubmissions: submissions.length,
    totalContributors: uniqueContributors.size,
    totalSources,
    submissions,
    knowledgeBase: buildKnowledgeBase(submissions),
    analytics: buildAnalytics(submissions),
  };

  writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log(`Wrote ${OUTPUT}`);
  console.log(`  ${data.totalSubmissions} submissions, ${data.totalContributors} contributors, ${data.totalSources} sources`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
