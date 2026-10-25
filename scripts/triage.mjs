// bala-voice — issue triage skeleton
// Reads new issues, suggests [NOW]/[NEXT]/[LATER] priority, logs to reports/.
// Run: node scripts/triage.mjs

import { createWriteStream, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const reportDir = new URL('./reports/', import.meta.url);

// Response-time promise (reviewed each session):
// - Issues: acknowledged within 7 days
// - Pull requests: reviewed within 14 days
// - Email (support@balamonis.com): within 7 days

function suggestPriority(issue) {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  if (text.includes('security') || text.includes('broken') || text.includes('urgent')) return '[NOW]';
  if (text.includes('feature') || text.includes('enhancement')) return '[NEXT]';
  if (text.includes('idea') || text.includes('someday')) return '[LATER]';
  return '[NEXT]';
}

function logTriage(issue, priority) {
  const line = `${new Date().toISOString()} | triage | #${issue.number} | ${priority} | ${issue.title}\n`;
  appendFileSync(join(reportDir, 'triage.log'), line);
  console.log(line.trim());
}

// Example usage:
// logTriage({ number: 1, title: 'Add GitHub trending source', body: 'feature request' }, suggestPriority({}));

console.log('Triage script ready. Response-time promise: 7/14/7 days.');
