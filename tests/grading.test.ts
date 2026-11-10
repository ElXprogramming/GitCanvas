import test from 'node:test';
import assert from 'node:assert/strict';
import {
  gradeCommits,
  gradePRs,
  gradeIssues,
  gradeStars,
  gradeRepos,
  gradePolyglot,
  computeOverallGrade,
} from '@/lib/github-stats';

test('gradeCommits returns expected tiers', () => {
  assert.equal(gradeCommits(500), 'S');
  assert.equal(gradeCommits(200), 'S');
  assert.equal(gradeCommits(199), 'A');
  assert.equal(gradeCommits(100), 'A');
  assert.equal(gradeCommits(99), 'B');
  assert.equal(gradeCommits(40), 'B');
  assert.equal(gradeCommits(39), 'C');
  assert.equal(gradeCommits(10), 'C');
  assert.equal(gradeCommits(9), 'D');
  assert.equal(gradeCommits(0), 'D');
});

test('gradePRs returns expected tiers', () => {
  assert.equal(gradePRs(25), 'S');
  assert.equal(gradePRs(10), 'A');
  assert.equal(gradePRs(4), 'B');
  assert.equal(gradePRs(1), 'C');
  assert.equal(gradePRs(0), 'D');
});

test('gradeIssues returns expected tiers', () => {
  assert.equal(gradeIssues(20), 'S');
  assert.equal(gradeIssues(8), 'A');
  assert.equal(gradeIssues(3), 'B');
  assert.equal(gradeIssues(1), 'C');
  assert.equal(gradeIssues(0), 'D');
});

test('gradeStars returns expected tiers', () => {
  assert.equal(gradeStars(50), 'S');
  assert.equal(gradeStars(15), 'A');
  assert.equal(gradeStars(5), 'B');
  assert.equal(gradeStars(1), 'C');
  assert.equal(gradeStars(0), 'D');
});

test('gradeRepos returns expected tiers', () => {
  assert.equal(gradeRepos(25), 'S');
  assert.equal(gradeRepos(15), 'A');
  assert.equal(gradeRepos(8), 'B');
  assert.equal(gradeRepos(3), 'C');
  assert.equal(gradeRepos(0), 'D');
});

test('gradePolyglot returns expected tiers', () => {
  assert.equal(gradePolyglot(12), 'S');
  assert.equal(gradePolyglot(9), 'A');
  assert.equal(gradePolyglot(6), 'B');
  assert.equal(gradePolyglot(3), 'C');
  assert.equal(gradePolyglot(1), 'D');
});

test('computeOverallGrade calculates overall score and letter grade', () => {
  assert.deepEqual(computeOverallGrade(['S', 'S', 'S', 'S', 'S', 'S']), {
    grade: 'S',
    score: 100,
  });
  assert.deepEqual(computeOverallGrade(['A', 'A', 'A', 'A', 'A', 'A']), {
    grade: 'A',
    score: 80,
  });
  assert.deepEqual(computeOverallGrade(['B', 'B', 'B', 'B', 'B', 'B']), {
    grade: 'B',
    score: 60,
  });
  assert.deepEqual(computeOverallGrade(['C', 'C', 'C', 'C', 'C', 'C']), {
    grade: 'C',
    score: 40,
  });
  assert.deepEqual(computeOverallGrade(['D', 'D', 'D', 'D', 'D', 'D']), {
    grade: 'D',
    score: 20,
  });
  assert.deepEqual(computeOverallGrade([]), {
    grade: 'C',
    score: 50,
  });
});
