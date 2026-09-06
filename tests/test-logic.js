async function run() {
  const { generatePuzzle } = await import('../src/utils/sudokuLogic.ts');
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
}

run().catch(console.error);
