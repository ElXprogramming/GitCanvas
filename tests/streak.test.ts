import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakStats, CalendarDay } from '@/lib/github-stats';

test('calculateStreakStats handles empty days', () => {
  const stats = calculateStreakStats([]);
  assert.equal(stats.currentStreak.days, 0);
  assert.equal(stats.longestStreak.days, 0);
  assert.equal(stats.totalActiveDays, 0);
  assert.equal(stats.totalContributionsPastYear, 0);
  assert.equal(stats.completionRate, 0);
});

test('calculateStreakStats computes active streaks and longest streak', () => {
  const now = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const d1 = new Date(now.getTime() - 4 * 86400000);
  const d2 = new Date(now.getTime() - 3 * 86400000);
  const d3 = new Date(now.getTime() - 2 * 86400000);
  const d4 = new Date(now.getTime() - 1 * 86400000);
  const dToday = now;

  const days: CalendarDay[] = [
    { date: format(d1), contributionCount: 0, weekday: d1.getDay() },
    { date: format(d2), contributionCount: 5, weekday: d2.getDay() },
    { date: format(d3), contributionCount: 3, weekday: d3.getDay() },
    { date: format(d4), contributionCount: 2, weekday: d4.getDay() },
    { date: format(dToday), contributionCount: 4, weekday: dToday.getDay() },
  ];

  const stats = calculateStreakStats(days);
  assert.equal(stats.currentStreak.days, 4);
  assert.equal(stats.currentStreak.isActiveToday, true);
  assert.equal(stats.currentStreak.startDate, format(d2));
  assert.equal(stats.currentStreak.endDate, format(dToday));
  assert.equal(stats.longestStreak.days, 4);
  assert.equal(stats.totalActiveDays, 4);
  assert.equal(stats.totalContributionsPastYear, 14);
});

test('calculateStreakStats handles active streak from yesterday when today has no commits yet', () => {
  const now = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const d1 = new Date(now.getTime() - 3 * 86400000);
  const d2 = new Date(now.getTime() - 2 * 86400000);
  const d3 = new Date(now.getTime() - 1 * 86400000);
  const dToday = now;

  const days: CalendarDay[] = [
    { date: format(d1), contributionCount: 0, weekday: d1.getDay() },
    { date: format(d2), contributionCount: 2, weekday: d2.getDay() },
    { date: format(d3), contributionCount: 3, weekday: d3.getDay() },
    { date: format(dToday), contributionCount: 0, weekday: dToday.getDay() },
  ];

  const stats = calculateStreakStats(days);
  assert.equal(stats.currentStreak.days, 2);
  assert.equal(stats.currentStreak.isActiveToday, false);
  assert.equal(stats.currentStreak.startDate, format(d2));
  assert.equal(stats.currentStreak.endDate, format(d3));
});

test('calculateStreakStats ignores future placeholder days in GitHub calendar', () => {
  const now = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const dYesterday = new Date(now.getTime() - 1 * 86400000);
  const dToday = now;
  const dTomorrow = new Date(now.getTime() + 1 * 86400000);
  const dDayAfter = new Date(now.getTime() + 2 * 86400000);

  const days: CalendarDay[] = [
    { date: format(dYesterday), contributionCount: 5, weekday: dYesterday.getDay() },
    { date: format(dToday), contributionCount: 1, weekday: dToday.getDay() },
    // Future days padded by GitHub's contribution calendar
    { date: format(dTomorrow), contributionCount: 0, weekday: dTomorrow.getDay() },
    { date: format(dDayAfter), contributionCount: 0, weekday: dDayAfter.getDay() },
  ];

  const stats = calculateStreakStats(days);
  assert.equal(stats.currentStreak.days, 2);
  assert.equal(stats.currentStreak.isActiveToday, true);
  assert.equal(stats.currentStreak.endDate, format(dToday));
});
