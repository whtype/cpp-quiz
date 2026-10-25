# Interview Preparation Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for the main implementation. Independent question shards are delegated under dispatching-parallel-agents.

**Goal:** Deliver a graded C++ campus interview learning center, 150 scenario questions, and verified bug fixes.
**Architecture:** Retain native mini-program pages and stable question IDs. Share a browser/CommonJS learning selector between the new learning page and preview.
**Tech Stack:** Native WXML/WXSS, JavaScript, Node built-in tests; no runtime packages.
**Spec:** ../specs/2026-10-25-interview-design.md

## Global Constraints
Stable old IDs and Storage keys; nav content-box; do not invent company attribution; no deployment.

## Review Focus
Empty filtered results must not fall back to unrelated questions. Old snapshots must remain readable. Filtered resume must not load a different track. Remote IDs must not shadow built-ins. Examination time must include background time.

## Tasks
- [x] Add failing regressions in tools/test-interview.js for reported bugs and learning selectors.
- [x] Implement utils/learning.js: select(list, filters), describe(q), exam(list, count). Add pages/learn four files and route.
- [x] Add three independent authored data/bank/*-interview.js shards; validate IDs, answers, references, metadata, and sample factual claims.
- [x] Repair practice/store/adapter/data boundary logic and homepage distinct-question coverage; retain old flow regression tests.
- [x] Synchronize browser learning/answer UI; label preview records as samples. Document content quality and limitations.
- [x] Run node check.js, node tools/test-resume.js, node tools/test-interview.js, content validation, browser/mobile checks. Review diff and report limits.

## Verification record (2026-10-25)
20 static checks + 16 resume checks + 19 interview regressions passed. Corpus audit: 750 unique IDs, 150 authored additions, 74 code questions, 26 multi-select additions, zero identical prompt/code pairs; all 600 original IDs retained. Browser flow and 320/390/430px overflow checks passed. Independent code review fixes rechecked. No WeChat device compilation or deployment performed.
