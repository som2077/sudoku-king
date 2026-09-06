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
  console.log('✅ Sudoku puzzle generation benchmarks passed!');
}

run().catch(console.error);
