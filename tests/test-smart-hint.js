const assert = require('assert');

async function run() {
  const { getSmartHint, getCandidates } = await import('../src/utils/sudokuLogic.ts');

  console.log('🧪 Running TDD Test Suite for Smart Hint Engine...');

  // Helper to create an empty 81-cell board
  const makeBoard = () => Array(81).fill(null);

  // Solved sample board for ground truth
  const sampleSolution = [
    5, 3, 4, 6, 7, 8, 9, 1, 2,
    6, 7, 2, 1, 9, 5, 3, 4, 8,
    1, 9, 8, 3, 4, 2, 5, 6, 7,
    8, 5, 9, 7, 6, 1, 4, 2, 3,
    4, 2, 6, 8, 5, 3, 7, 9, 1,
    7, 1, 3, 9, 2, 4, 8, 5, 6,
    9, 6, 1, 5, 3, 7, 2, 8, 4,
    2, 8, 7, 4, 1, 9, 6, 3, 5,
    3, 4, 5, 2, 8, 6, 1, 7, 9
  ];

  // ----------------------------------------------------
  // Test 1: getCandidates returns valid candidates for a cell
  // ----------------------------------------------------
  {
    const board = [...sampleSolution];
    // Empty out top-left cell (index 0, solution 5)
    board[0] = 0; // Row 0 has: [., 3, 4, 6, 7, 8, 9, 1, 2] -> only 5 is missing
    const candidates = getCandidates(board, 0);
    assert.deepStrictEqual(candidates, [5], 'Candidates for cell 0 should only be [5]');
    console.log('  ✔ Test 1: getCandidates calculates correct legal candidates');
  }

  // ----------------------------------------------------
  // Test 2: Error Detection takes highest priority
  // ----------------------------------------------------
  {
    const current = [...sampleSolution];
    // Introduce a user error at index 0 (should be 5, user put 9)
    current[0] = 9;
    // And empty cell 1
    current[1] = null;

    const hint = getSmartHint(current, sampleSolution);
    assert(hint !== null, 'Hint must be returned for board with error');
    assert.strictEqual(hint.type, 'error', 'Hint type must be "error" when an incorrect number is placed');
    assert.strictEqual(hint.cellIndex, 0, 'Hint must target the errored cell index');
    assert.strictEqual(hint.value, 9, 'Hint value must reflect the incorrect number');
    assert(hint.explanation.includes('incorrect'), 'Explanation must mention incorrect cell');
    console.log('  ✔ Test 2: Error detection correctly flags incorrect cell');
  }

  // ----------------------------------------------------
  // Test 3: Naked Single Detection
  // ----------------------------------------------------
  {
    const current = [...sampleSolution];
    // Cell 0 is empty. Row 0 already contains 1,2,3,4,6,7,8,9 so 5 is the ONLY legal candidate.
    current[0] = null;

    const hint = getSmartHint(current, sampleSolution);
    assert(hint !== null, 'Hint must be returned for naked single');
    assert.strictEqual(hint.type, 'naked_single', 'Hint type must be naked_single');
    assert.strictEqual(hint.cellIndex, 0, 'Hint cellIndex should be 0');
    assert.strictEqual(hint.value, 5, 'Hint value should be 5');
    assert(hint.explanation.length > 0, 'Explanation must be non-empty');
    assert(Array.isArray(hint.relatedIndices), 'relatedIndices must be an array');
    console.log('  ✔ Test 3: Naked single identified with explanation and related indices');
  }

  // ----------------------------------------------------
  // Test 4: Hidden Single Detection (Row, Col, or Box)
  // ----------------------------------------------------
  {
    // Construct a scenario where a cell has multiple candidates, but within its row, a number can only go in that cell
    // Let's take row 0: [5, 3, 4, 6, 7, 8, 9, 1, 2]
    // Empty cells at (0,0)=5 and (0,1)=3
    const current = [...sampleSolution];
    current[0] = null; // index 0 (row 0, col 0)
    current[1] = null; // index 1 (row 0, col 1)
    // Also empty cells in column 1 so 3 could theoretically go elsewhere in col 1, but in row 0, 3 MUST go to index 1
    current[10] = null; // (row 1, col 1)

    const hint = getSmartHint(current, sampleSolution);
    assert(hint !== null, 'Hint must be returned');
    assert(['naked_single', 'hidden_single'].includes(hint.type), 'Hint should be naked or hidden single');
    assert([0, 1, 10].includes(hint.cellIndex), 'Hint should point to an empty cell');
    console.log(`  ✔ Test 4: Single detection identified (${hint.type}) for cell ${hint.cellIndex} = ${hint.value}`);
  }

  // ----------------------------------------------------
  // Test 5: Prioritizes Selected Cell if valid empty cell
  // ----------------------------------------------------
  {
    const current = [...sampleSolution];
    current[0] = null; // index 0 (sol 5)
    current[80] = null; // index 80 (sol 9)

    // Select index 80
    const hint = getSmartHint(current, sampleSolution, 80);
    assert(hint !== null, 'Hint must not be null');
    assert.strictEqual(hint.cellIndex, 80, 'Hint should target the selected cell');
    assert.strictEqual(hint.value, 9, 'Hint value for cell 80 should be 9');
    console.log('  ✔ Test 5: Hint respects and targets user selectedCellIndex');
  }

  // ----------------------------------------------------
  // Test 6: Returns null when board is fully and correctly solved
  // ----------------------------------------------------
  {
    const current = [...sampleSolution];
    const hint = getSmartHint(current, sampleSolution);
    assert.strictEqual(hint, null, 'Hint must be null for solved board');
    console.log('  ✔ Test 6: Returns null when board is completely solved');
  }

  console.log('\n🎉 ALL SMART HINT ENGINE TESTS PASSED!');
}

run().catch((err) => {
  console.error('\n❌ Test execution failed with error:');
  console.error(err);
  process.exit(1);
});
