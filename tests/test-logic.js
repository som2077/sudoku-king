async function run() {
  const {
    generatePuzzle,
    solveBoard,
    countSolutions,
    isValid,
  } = await import('../src/utils/sudokuLogic.ts');
  console.time('Medium');
  generatePuzzle('Medium');
  console.timeEnd('Medium');
  console.time('Hard');
  generatePuzzle('Hard');
  console.timeEnd('Hard');
  console.time('Expert');
  generatePuzzle('Expert');
  console.timeEnd('Expert');

  // Test deterministic Daily Challenge generation
  const p1 = generatePuzzle('Medium', 'daily-2026-09-07');
  const p2 = generatePuzzle('Medium', 'daily-2026-09-07');
  if (JSON.stringify(p1.puzzle) !== JSON.stringify(p2.puzzle)) {
    throw new Error('Daily challenges must be deterministic for identical date seeds!');
  }
  if (JSON.stringify(p1.solution) !== JSON.stringify(p2.solution)) {
    throw new Error('Daily challenge solutions must be deterministic!');
  }
  console.log('✅ Deterministic Daily Challenge tests passed!');
  console.log('✅ Sudoku puzzle generation benchmarks passed!');

  // Invalid complete boards must not be accepted as solved or unique.
  const invalidCompleteBoard = Array(81).fill(1);
  if (solveBoard([...invalidCompleteBoard])) {
    throw new Error('Solver must reject a board with duplicate givens');
  }
  if (countSolutions([...invalidCompleteBoard]) !== 0) {
    throw new Error('Solution counter must reject a board with duplicate givens');
  }
  if (isValid([], 0, 1) || isValid(Array(81).fill(0), 0, 10)) {
    throw new Error('isValid must reject malformed board or digit input');
  }
  console.log('✅ Sudoku input validation regressions passed!');
}

run().catch(console.error);
