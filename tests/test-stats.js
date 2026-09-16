import assert from "assert";

const {
  calculateAverageTime,
  calculateWinRate,
  markDailyChallengeSolved,
  normalizeGameStats,
  recordDailyGameSolved,
  recordPlayed,
  recordSolved,
} = await import("../src/utils/gameStats.ts");

const empty = { solved: 0, played: 0, bestSec: null, totalSec: 0 };

assert.deepStrictEqual(recordPlayed(empty), {
  solved: 0,
  played: 1,
  bestSec: null,
  totalSec: 0,
});

assert.deepStrictEqual(recordSolved(recordPlayed(empty), 125), {
  solved: 1,
  played: 1,
  bestSec: 125,
  totalSec: 125,
});

assert.deepStrictEqual(recordSolved({ solved: 1, played: 1, bestSec: 125, totalSec: 125 }, 90), {
  solved: 2,
  played: 2,
  bestSec: 90,
  totalSec: 215,
});

assert.deepStrictEqual(recordSolved(empty, "invalid"), {
  solved: 1,
  played: 1,
  bestSec: null,
  totalSec: 0,
});

assert.deepStrictEqual(recordDailyGameSolved({ played: 1, solved: 0, bestSec: null }, 125), {
  played: 1,
  solved: 1,
  bestSec: 125,
});
assert.deepStrictEqual(markDailyChallengeSolved({ played: 1, solved: 1, bestSec: 125 }, 90), {
  played: 1,
  solved: 1,
  bestSec: 90,
});

assert.deepStrictEqual(normalizeGameStats({ solved: 4, played: 2, totalSec: 601.9 }), {
  solved: 4,
  played: 4,
  bestSec: null,
  totalSec: 601,
});

assert.strictEqual(calculateWinRate(1, 3), 33);
assert.strictEqual(calculateWinRate(5, 2), 100);
assert.strictEqual(calculateWinRate(0, 0), 0);
assert.strictEqual(calculateAverageTime(301, 2), 151);
assert.strictEqual(calculateAverageTime(301, 0), 0);

console.log("✅ Game statistics calculations passed!");
