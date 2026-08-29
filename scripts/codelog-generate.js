#!/usr/bin/env node
/**
 * codelog-generate.js
 * Regenerates codelog.md from git commit history.
 * Preserves manual [Unreleased] entries.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const CODELOG_PATH = join(ROOT, 'codelog.md');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return '';
  }
}

function getCommits() {
  const lastTag = run('git describe --tags --abbrev=0 2>/dev/null');
  const range = lastTag ? `${lastTag}..HEAD` : '-50';
  const log = run(`git log ${range} --pretty=format:"%h|%s|%ad" --date=short --reverse`);
  return log.split('\n').filter(Boolean).map(line => {
    const [hash, ...rest] = line.split('|');
    const date = rest.pop();
    const subject = rest.join('|');
    return { hash, subject, date };
  });
}

function getChangedFunctions(commitHash) {
  const diff = run(`git show ${commitHash} --name-only --pretty=format: --diff-filter=ACM`);
  const files = diff.split('\n').filter(f => 
    /\.(js|ts|tsx|astro|mjs)$/.test(f) && !f.includes('node_modules')
  );
  
  const changes = { Added: [], Changed: [], Removed: [] };
  
  for (const file of files) {
    const fileDiff = run(`git show ${commitHash} -- ${file}`);
    const funcs = extractFunctions(fileDiff, file);
    funcs.added.forEach(f => changes.Added.push(f));
    funcs.changed.forEach(f => changes.Changed.push(f));
    funcs.removed.forEach(f => changes.Removed.push(f));
  }
  
  return changes;
}

function extractFunctions(diff, file) {
  const added = [];
  const changed = [];
  const removed = [];
  
  const patterns = [
    /^\+.*(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm,
    /^\+.*(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(/gm,
    /^\+.*(\w+)\s*:\s*(?:async\s+)?function\s*\(/gm,
    /^\+.*(\w+)\s*=\s*(?:async\s+)?\(/gm,
    /^\-.*(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm,
    /^\-.*(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(/gm,
  ];
  
  let match;
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(diff)) !== null) {
      const name = match[1];
      const line = match[0].startsWith('+') ? 'Added' : 'Removed';
      const entry = `**${name}** (${file}): ${line.toLowerCase()} function`;
      if (line === 'Added') added.push(entry);
      else removed.push(entry);
    }
  }
  
  return { added, changed, removed };
}

function parseExistingLog() {
  const content = readFileSync(CODELOG_PATH, 'utf8');
  const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(?=## \[\d{4}-\d{2}-\d{2}\]|$)/);
  const unreleased = unreleasedMatch ? unreleasedMatch[1].trim() : '';
  return { content, unreleased };
}

function generateLog() {
  const { content, unreleased } = parseExistingLog();
  const commits = getCommits();
  
  let log = '# Code Change Log\n\n> **Manual entries** — Developers add entries here when making changes.\n> **Regenerate from git** — Run `npm run codelog:generate` to rebuild from commit history.\n\n---\n\n';
  
  log += '## [Unreleased]\n\n';
  log += unreleased || `### Added\n- \n\n### Changed\n- \n\n### Removed\n- \n\n### Fixed\n- \n\n---\n\n`;
  
  const byDate = {};
  for (const commit of commits) {
    const date = commit.date;
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(commit);
  }
  
  for (const [date, dayCommits] of Object.entries(byDate).reverse()) {
    log += `## [${date}]\n\n`;
    const allChanges = { Added: [], Changed: [], Removed: [], Fixed: [], Refactored: [] };
    
    for (const commit of dayCommits) {
      const changes = getChangedFunctions(commit.hash);
      for (const cat of ['Added', 'Changed', 'Removed']) {
        changes[cat].forEach(c => allChanges[cat].push(`${c} (${commit.hash.slice(0,7)})`));
      }
      if (commit.subject.toLowerCase().includes('fix')) {
        allChanges.Fixed.push(`**${commit.subject}** (${commit.hash.slice(0,7)})`);
      } else if (commit.subject.toLowerCase().includes('refactor')) {
        allChanges.Refactored.push(`**${commit.subject}** (${commit.hash.slice(0,7)})`);
      }
    }
    
    for (const cat of ['Added', 'Changed', 'Removed', 'Fixed', 'Refactored']) {
      if (allChanges[cat].length) {
        log += `### ${cat}\n`;
        allChanges[cat].forEach(c => log += `- ${c}\n`);
        log += '\n';
      }
    }
    log += '---\n\n';
  }
  
  writeFileSync(CODELOG_PATH, log);
  console.log('✅ codelog.md regenerated from git history');
  console.log(`   Processed ${commits.length} commits`);
}

generateLog();