export type SudokuGrid = number[][];

export type SudokuPuzzle = {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
};

/**
 * Create an empty 9x9 Sudoku grid.
 */
function createEmptyGrid(): SudokuGrid {
  return Array.from(
    { length: 9 },
    () => Array(9).fill(0)
  );
}

/**
 * Shuffle an array.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

/**
 * Check whether a number can be placed
 * in the given position.
 */
function isSafe(
  grid: SudokuGrid,
  row: number,
  col: number,
  number: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === number) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === number) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow =
    row - (row % 3);

  const startCol =
    col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        grid[startRow + i][
          startCol + j
        ] === number
      ) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Solve Sudoku using backtracking.
 */
function solveSudoku(
  grid: SudokuGrid
): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle([
          1, 2, 3, 4, 5,
          6, 7, 8, 9,
        ]);

        for (const number of numbers) {
          if (
            isSafe(
              grid,
              row,
              col,
              number
            )
          ) {
            grid[row][col] = number;

            if (solveSudoku(grid)) {
              return true;
            }

            grid[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
}

/**
 * Create a new Sudoku puzzle.
 */
export function generateSudoku(): SudokuPuzzle {
  const solution = createEmptyGrid();

  solveSudoku(solution);

  const puzzle = solution.map(row => [
    ...row,
  ]);

  /*
   * Remove numbers from the completed grid.
   *
   * 45 empty cells means the user gets
   * a reasonably playable beginner puzzle.
   */
  let cellsToRemove = 45;

  while (cellsToRemove > 0) {
    const row = Math.floor(
      Math.random() * 9
    );

    const col = Math.floor(
      Math.random() * 9
    );

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return {
    puzzle,
    solution,
  };
}