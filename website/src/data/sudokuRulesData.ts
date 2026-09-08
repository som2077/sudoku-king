// Auto-generated Sudoku Rules Dataset from sudoku.com/sudoku-rules/
// Generated on 2026-09-08T16:35:59.372Z

export interface RuleImage {
  url: string;
  alt: string;
}

export interface SudokuTechnique {
  id: number;
  slug: string;
  originalSlug: string;
  title: string;
  headingTitle: string;
  shortDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  videoUrl: string | null;
  thumbnail: string;
  images: RuleImage[];
  paragraphs: string[];
}

export interface BasicRuleItem {
  id: number;
  title: string;
  description: string;
}

export interface FoundationalRules {
  title: string;
  subtitle: string;
  basicRules: BasicRuleItem[];
}

export const foundationalRules: FoundationalRules = {
  "title": "What is Sudoku and what are the rules of this game?",
  "subtitle": "Sudoku is a popular logic puzzle with numbers. Its rules are quite simple, so even beginners can handle the simple levels.",
  "basicRules": [
    {
      "id": 1,
      "title": "9x9 Grid Layout",
      "description": "The classic Sudoku board consists of 81 cells organized into 9 rows, 9 columns, and nine 3×3 blocks."
    },
    {
      "id": 2,
      "title": "Use Numbers 1 through 9",
      "description": "Only single digits from 1 to 9 may be entered into any cell on the board. No zeros or negative numbers."
    },
    {
      "id": 3,
      "title": "Unique 3x3 Blocks",
      "description": "Each of the nine 3×3 sub-grids must contain the numbers 1 to 9 exactly once without duplication."
    },
    {
      "id": 4,
      "title": "Unique Columns",
      "description": "Each vertical column must contain all digits from 1 to 9 with no repeated numbers."
    },
    {
      "id": 5,
      "title": "Unique Rows",
      "description": "Each horizontal row must contain all digits from 1 to 9 with no repeated numbers."
    },
    {
      "id": 6,
      "title": "No Guessing Required",
      "description": "Every valid Sudoku puzzle has a single unique solution that can be deduced through pure logical reasoning."
    },
    {
      "id": 7,
      "title": "Victory Condition",
      "description": "The game is successfully completed when all 81 cells are filled in strict adherence to every row, column, and block constraint."
    }
  ]
};

export const sudokuTechniques: SudokuTechnique[] = [
  {
    "id": 1,
    "slug": "last-free-cell",
    "originalSlug": "last-free-cell",
    "title": "Last free cell",
    "headingTitle": "\"Last free cell\" technique.",
    "shortDescription": "\"Last free cell\" is the basic Sudoku solving technique. It's pretty simple and based on the fact that each 3×3 block, vertical column or horizontal row on Sudoku grid should contain numbers from 1 to 9 and each number can be used only once within 3×3 block, vertical column or horizontal row.",
    "difficulty": "Beginner",
    "videoUrl": "https://www.youtube-nocookie.com/embed/1i4br16Xogw",
    "thumbnail": "/images/rules/last-free-cell-thumb.png",
    "images": [
      {
        "url": "/images/rules/last-free-cell-step-1.png",
        "alt": "Last free cell step 1"
      },
      {
        "url": "/images/rules/last-free-cell-step-2.png",
        "alt": "Last free cell step 2"
      },
      {
        "url": "/images/rules/last-free-cell-step-3.png",
        "alt": "Last free cell step 3"
      },
      {
        "url": "/images/rules/last-free-cell-step-4.png",
        "alt": "Last free cell step 4"
      }
    ],
    "paragraphs": [
      "\"Last free cell\" is the basic Sudoku solving technique. It's pretty simple and based on the fact that each 3×3 block, vertical column or horizontal row on Sudoku grid should contain numbers from 1 to 9 and each number can be used only once within 3×3 block, vertical column or horizontal row.",
      "Therefore, if we see that there is only one free cell left in the 3×3 block, vertical column or horizontal row, then we have to define which number from 1 to 9 is missing and enter it in this empty cell.",
      "You can see how it looks in the examples below.",
      "This is the main basic rule. Once you have learned it, you can proceed with the following Sudoku strategies."
    ]
  },
  {
    "id": 2,
    "slug": "last-remaining-cell",
    "originalSlug": "last-remaining-cell",
    "title": "Last remaining cell",
    "headingTitle": "\"Last remaining cell\" technique.",
    "shortDescription": "\"Last remaining cell\" is another basic Sudoku strategy. It's based on the fact that numbers should not be repeated within 3×3 block, vertical column and horizontal row.",
    "difficulty": "Beginner",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Ul_hDUPLCqU",
    "thumbnail": "/images/rules/last-remaining-cell-thumb.png",
    "images": [
      {
        "url": "/images/rules/last-remaining-cell-step-1.png",
        "alt": "Last remaining cell step 1"
      },
      {
        "url": "/images/rules/last-remaining-cell-step-2.png",
        "alt": "Last remaining cell step 2"
      }
    ],
    "paragraphs": [
      "\"Last remaining cell\" is another basic Sudoku strategy. It's based on the fact that numbers should not be repeated within 3×3 block, vertical column and horizontal row.",
      "Let's take a look at an example with the 3x3 block. There always must be number 8 - in each block, column and row. There's already 8 in the column and in the row. As we already know, we can't repeat numbers. So we can't place 8 there again. It means that there's only one cell remaining inside the block and we should put number 8 into it.",
      "The same technique applies to the Rows and Columns.",
      "That is how \"Last remaining cell\" technique can be used while solving Sudoku. Once you have learned it, you can proceed with the following Sudoku strategies."
    ]
  },
  {
    "id": 3,
    "slug": "last-possible-number",
    "originalSlug": "last-possible-number",
    "title": "Last possible number",
    "headingTitle": "\"Last possible number\" technique.",
    "shortDescription": "Last possible number is a simple strategy that is suitable for beginners. It is based on finding the missing number. To find the missing number you should take a look at the numbers that are already exist in the 3x3 block you are interested in, and in the rows and columns connected with it.",
    "difficulty": "Beginner",
    "videoUrl": "https://www.youtube-nocookie.com/embed/t7oeVmG9QhQ",
    "thumbnail": "/images/rules/last-possible-number-thumb.png",
    "images": [
      {
        "url": "/images/rules/last-possible-number-step-1.png",
        "alt": "Last possible number step 1"
      },
      {
        "url": "/images/rules/last-possible-number-step-2.png",
        "alt": "Last possible number step 2"
      }
    ],
    "paragraphs": [
      "Last possible number is a simple strategy that is suitable for beginners. It is based on finding the missing number. To find the missing number you should take a look at the numbers that are already exist in the 3x3 block you are interested in, and in the rows and columns connected with it.",
      "Let's take a look at an example.",
      "Pay attention to the highlighted cell. Look at the numbers in its block, row and column. We can see that numbers 1,2,3,4,6,7,8,9 are already used in this row, column and block.",
      "The only missing number is 5. Considering that numbers should not be repeated, the only number that must be put in this cell is 5.",
      "That is how \"Last possible number\" technique works. Once you have mastered it, you will begin to solve Sudoku easier and faster!"
    ]
  },
  {
    "id": 4,
    "slug": "notes-in-sudoku",
    "originalSlug": "notes-in-sudoku",
    "title": "Notes in Sudoku",
    "headingTitle": "Notes in Sudoku.",
    "shortDescription": "If you get stuck on Sudoku grid and don't see the obvious solutions for the rest of cells, you should use Notes. With the help of Notes you should fill in all the possible options for each blank cell, focusing on the numbers that are already on the Sudoku grid.",
    "difficulty": "Beginner",
    "videoUrl": "https://www.youtube-nocookie.com/embed/wynjw67JFUM",
    "thumbnail": "/images/rules/notes-in-sudoku-thumb.png",
    "images": [],
    "paragraphs": [
      "If you get stuck on Sudoku grid and don't see the obvious solutions for the rest of cells, you should use Notes. With the help of Notes you should fill in all the possible options for each blank cell, focusing on the numbers that are already on the Sudoku grid.",
      "It is very important to fill in Notes correctly. Since if you make a mistake, it will be much more difficult and longer to solve Sudoku.",
      "When you place the Notes, it will be easier for you to understand where and what number should be placed. Also, many advanced Sudoku solving techniques are based on the use of Notes. You can learn about such techniques from the lessons on our Sudoku.com website."
    ]
  },
  {
    "id": 5,
    "slug": "obvious-singles",
    "originalSlug": "obvious-singles",
    "title": "Obvious singles",
    "headingTitle": "\"Obvious singles\" technique.",
    "shortDescription": "This strategy is based on the correct placement of Notes. Sometimes it is called Naked Singles. The point is that in a specific cell only one digit (from the Notes) remains possible.",
    "difficulty": "Beginner",
    "videoUrl": "https://www.youtube-nocookie.com/embed/gyptoqHnaAg",
    "thumbnail": "/images/rules/obvious-singles-thumb.png",
    "images": [
      {
        "url": "/images/rules/obvious-singles-step-1.png",
        "alt": "Obvious singles step 1"
      },
      {
        "url": "/images/rules/obvious-singles-step-2.png",
        "alt": "Obvious singles step 2"
      }
    ],
    "paragraphs": [
      "This strategy is based on the correct placement of Notes. Sometimes it is called Naked Singles. The point is that in a specific cell only one digit (from the Notes) remains possible.",
      "Let's have look at this case with an example.",
      "Let's look at the highlighted cell. We can see that it is filled with only one Note - number 2. It means that this cell has only one possible solution. Since it is the only possible option, this cell will be 2. So we remove Note from this cell and fill it with the number 2.",
      "That is how \"Obvious singles\" technique works. As you see, this is not as difficult as it seems. Therefore, if you put \"Obvious singles\" technique into practice, the process of solving Sudoku will become easier and faster!"
    ]
  },
  {
    "id": 6,
    "slug": "obvious-pairs",
    "originalSlug": "obvious-pairs",
    "title": "Obvious pairs",
    "headingTitle": "\"Obvious pairs\" technique.",
    "shortDescription": "Like the \"Obvious Singles\" technique, \"Obvious pairs\" is based on the correct placement of Notes. The point is that you should find 2 cells with the same pairs of Notes within 3x3 block. This means that these pairs of Notes cannot be used in other cells within this 3x3 block. So they can be removed from your Notes. It will be easier to understand this strategy if you look at the example.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/MfH3hHi7qrw",
    "thumbnail": "/images/rules/obvious-pairs-thumb.png",
    "images": [
      {
        "url": "/images/rules/obvious-pairs-step-1.png",
        "alt": "Obvious pairs step 1"
      }
    ],
    "paragraphs": [
      "Like the \"Obvious Singles\" technique, \"Obvious pairs\" is based on the correct placement of Notes. The point is that you should find 2 cells with the same pairs of Notes within 3x3 block. This means that these pairs of Notes cannot be used in other cells within this 3x3 block. So they can be removed from your Notes. It will be easier to understand this strategy if you look at the example.",
      "Let's look at this block. We see empty cells filled with notes of possible numbers. Among them, there are two cells that contain 7 or 9.",
      "This means that one of these cells necessarily contains 7 and the other one contains 9. This also means that we can't have 7 and 9 in other cells of this block.",
      "Hence, we remove them from other cells' notes. Next we can apply the \"Obvious singles\" rule we learned in the previous lesson. We'll write 6 in the cell with a single note of 6 and and 4 in another one.",
      "That is how \"Obvious Pairs\" technique can be used while solving Sudoku. Once you have learned it, you can proceed with the following Sudoku strategies."
    ]
  },
  {
    "id": 7,
    "slug": "obvious-triples",
    "originalSlug": "obvious-triples",
    "title": "Obvious triples",
    "headingTitle": "\"Obvious triples\" technique.",
    "shortDescription": "This Sudoku solving technique is built upon the previous one - \"Obvious pairs\". But \"Obvious triples\" is not based on two numbers from the Notes, it's based on three. This is the only difference. To understand better, let's take a look at the example.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/GLWG4BoeUYo",
    "thumbnail": "/images/rules/obvious-triples-thumb.png",
    "images": [
      {
        "url": "/images/rules/obvious-triples-step-1.png",
        "alt": "Obvious triples step 1"
      },
      {
        "url": "/images/rules/obvious-triples-step-2.png",
        "alt": "Obvious triples step 2"
      },
      {
        "url": "/images/rules/obvious-triples-step-3.png",
        "alt": "Obvious triples step 3"
      }
    ],
    "paragraphs": [
      "This Sudoku solving technique is built upon the previous one - \"Obvious pairs\". But \"Obvious triples\" is not based on two numbers from the Notes, it's based on three. This is the only difference. To understand better, let's take a look at the example.",
      "Look at the top left block. Its three bottom cells contain notes of 1, 5; 1, 8 &amp; 5, 8. This means that these cells have number 1, 5 &amp; 8 in them but we don't know yet where each number is exactly. What we know though, is that 1, 5 &amp; 8 can't be in other cells of this block.",
      "So, we can remove them from the notes.",
      "That is how \"Obvious Triples\" technique works while solving Sudoku."
    ]
  },
  {
    "id": 8,
    "slug": "hidden-singles",
    "originalSlug": "hidden-singles",
    "title": "Hidden singles",
    "headingTitle": "\"Hidden singles\" technique.",
    "shortDescription": "\"Hidden singles\" is a quite simple Sudoku technique. The point of \"Hidden singles\" is that a Note is the only one of its kind in an entire row, column, or 3x3 block. However, this technique requires careful attention from the player, because it can be quite hard to spot the single Notes.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Tc7tLelw9ug",
    "thumbnail": "/images/rules/hidden-singles-thumb.png",
    "images": [
      {
        "url": "/images/rules/hidden-singles-step-1.png",
        "alt": "Hidden singles step 1"
      },
      {
        "url": "/images/rules/hidden-singles-step-2.png",
        "alt": "Hidden singles step 2"
      }
    ],
    "paragraphs": [
      "\"Hidden singles\" is a quite simple Sudoku technique. The point of \"Hidden singles\" is that a Note is the only one of its kind in an entire row, column, or 3x3 block. However, this technique requires careful attention from the player, because it can be quite hard to spot the single Notes.",
      "It will be easier to understand this technique if you look at the example.",
      "Let's pay attention to this 3x3 block with Notes. There is only one cell, that may contain number 1. It's the top right cell. There are no any other cells in this block whith the Note 1.",
      "So we can remove all the Notes from this cell and put number 1 instead, since it's the only possible option.",
      "That's it for \"Hidden singles\" technique. Once you have learned it, you can proceed with the following Sudoku strategies."
    ]
  },
  {
    "id": 9,
    "slug": "hidden-pairs",
    "originalSlug": "hidden-pairs",
    "title": "Hidden pairs",
    "headingTitle": "\"Hidden pairs\" technique.",
    "shortDescription": "\"Hidden pairs\" technique works the same way as \"Hidden singles\". The only thing that changes is the number of cells and Notes. If you can find two cells within a row, column, or 3x3 block where two Notes appear nowhere outside these cells, these two Notes must be placed in the two cells. All other Notes can be eliminated from these two cells.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/dD1fSm8BEj8",
    "thumbnail": "/images/rules/hidden-pairs-thumb.png",
    "images": [
      {
        "url": "/images/rules/hidden-pairs-step-1.png",
        "alt": "Hidden pairs step 1"
      },
      {
        "url": "/images/rules/hidden-pairs-step-2.png",
        "alt": "Hidden pairs step 2"
      }
    ],
    "paragraphs": [
      "\"Hidden pairs\" technique works the same way as \"Hidden singles\". The only thing that changes is the number of cells and Notes. If you can find two cells within a row, column, or 3x3 block where two Notes appear nowhere outside these cells, these two Notes must be placed in the two cells. All other Notes can be eliminated from these two cells.",
      "For example:",
      "Let's pay attention to this block with Notes and look for the numbers that can be found in Notes less often than others. Only two cells contain 2 and 6. This means 2 must occupy one of these cells and 6 must occupy another.Any other numbers cannot be found in these cells.",
      "After this conclusion, extra numbers can be deleted from the Notes to avoid confusion.",
      "So, you know how to apply \"Hidden pairs\" technique in Sudoku. Now it's time for some practice!"
    ]
  },
  {
    "id": 10,
    "slug": "hidden-triples",
    "originalSlug": "hidden-triples",
    "title": "Hidden triples",
    "headingTitle": "\"Hidden triples\" technique.",
    "shortDescription": "\"Hidden triples\" technique is very similar to \"Hidden pairs\" and works on the same concept.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/b-n1eCknvKg",
    "thumbnail": "/images/rules/hidden-triples-thumb.png",
    "images": [
      {
        "url": "/images/rules/hidden-triples-step-1.png",
        "alt": "Hidden triples step 1"
      },
      {
        "url": "/images/rules/hidden-triples-step-2.png",
        "alt": "Hidden triples step 2"
      }
    ],
    "paragraphs": [
      "\"Hidden triples\" technique is very similar to \"Hidden pairs\" and works on the same concept.",
      "\"Hidden triples\" applies when three cells in a row, column, or 3x3 block contain the same three Notes. These three cells also contain other candidates, which may be removed from them.",
      "It will be easier to understand this technique if you look at the example.",
      "Take a look at the highlighted cells. There are only three cells, which contain repeated numbers: 5, 6 and 7. This means each of these numbers must occupy one of these cells. And any other numbers cannot be found here. If so, 5,6 and 7 cannot be presented in any other cell of this 3x3 block as well.\"",
      "After this conclusion, extra numbers can be deleted from the Notes to avoid confusion.",
      "That is how \"Hidden Triples\" technique works while solving Sudoku."
    ]
  },
  {
    "id": 11,
    "slug": "pointing-pairs",
    "originalSlug": "pointing-pairs",
    "title": "Pointing pairs",
    "headingTitle": "\"Pointing pairs\" technique.",
    "shortDescription": "\"Pointing pairs\" applies when a Note is present twice in a block and this Note also belongs to the same row or column. This means that the Note must be the solution for one of the two cells in the block. So, you can eliminate this Note from any other cells in the row or column.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/Ldz_1kFRFto",
    "thumbnail": "/images/rules/pointing-pairs-thumb.png",
    "images": [
      {
        "url": "/images/rules/pointing-pairs-step-1.png",
        "alt": "Pointing pairs step 1"
      },
      {
        "url": "/images/rules/pointing-pairs-step-2.png",
        "alt": "Pointing pairs step 2"
      }
    ],
    "paragraphs": [
      "\"Pointing pairs\" applies when a Note is present twice in a block and this Note also belongs to the same row or column. This means that the Note must be the solution for one of the two cells in the block. So, you can eliminate this Note from any other cells in the row or column.",
      "To understand \"Pointing pairs\" better, let's take a look at the example.",
      "Let's look at the block at the top left corner. All the cells that might contain number 4 are located in one column. As number 4 should appear in this block at least once, one of the highlighted cells will surely contain 4.",
      "Hence, we can safely eliminate all other possible 4s from all the cells of this column.",
      "Remember that you can do the same trick for blocks, rows, and columns.",
      "That's it for \"Pointing pairs\" technique. Now you can proceed with the following Sudoku strategy \"Pointing triples\"."
    ]
  },
  {
    "id": 12,
    "slug": "pointing-triples",
    "originalSlug": "pointing-triples",
    "title": "Pointing triples",
    "headingTitle": "\"Pointing triples\" technique.",
    "shortDescription": "\"Pointing triples\" technique is very similar to \"Pointing pairs\". It applies if a Note is present in only three cells of a 3x3 block and also belongs to the same row or column. This means that the Note must be a solution for one of these three cells in the block. So, obviously it can't be a solution of any other cell in the row or column and can be eliminated from them.",
    "difficulty": "Intermediate",
    "videoUrl": "https://www.youtube-nocookie.com/embed/5Luea4rGxrA",
    "thumbnail": "/images/rules/pointing-triples-thumb.png",
    "images": [
      {
        "url": "/images/rules/pointing-triples-step-1.png",
        "alt": "Pointing triples step 1"
      },
      {
        "url": "/images/rules/pointing-triples-step-2.png",
        "alt": "Pointing triples step 2"
      }
    ],
    "paragraphs": [
      "\"Pointing triples\" technique is very similar to \"Pointing pairs\". It applies if a Note is present in only three cells of a 3x3 block and also belongs to the same row or column. This means that the Note must be a solution for one of these three cells in the block. So, obviously it can't be a solution of any other cell in the row or column and can be eliminated from them.",
      "For example:",
      "Let's take a look at the bottom right corner. In this block all the cells that might contain number 1 are located in one row. As number 1 must appear in the bottom right block at least once, one of the highlighted cells will surely contain 1.",
      "After this conclusion all other possible numbers 1 can be safely deleted from the Notes of this row to avoid confusion.",
      "Remember that you can do the same trick for blocks, rows, and columns.",
      "That is how \"Pointing Triples\" technique works. Once you have learned it, you can get some practice."
    ]
  },
  {
    "id": 13,
    "slug": "x-wing",
    "originalSlug": "h-wing",
    "title": "Х-wing",
    "headingTitle": "\"Х-wing\" technique.",
    "shortDescription": "\"Х-wing\" is an advanced sudoku technique, which is based on the two parallel rows or two parallel columns. You shouldn't pay attention to the 3x3 blocks as they aren't involved in this strategy.",
    "difficulty": "Advanced",
    "videoUrl": "https://www.youtube-nocookie.com/embed/r1G_Bph8jXk",
    "thumbnail": "/images/rules/x-wing-thumb.png",
    "images": [
      {
        "url": "/images/rules/x-wing-step-1.png",
        "alt": "Х-wing step 1"
      },
      {
        "url": "/images/rules/x-wing-step-2.png",
        "alt": "Х-wing step 2"
      }
    ],
    "paragraphs": [
      "\"Х-wing\" is an advanced sudoku technique, which is based on the two parallel rows or two parallel columns. You shouldn't pay attention to the 3x3 blocks as they aren't involved in this strategy.",
      "It will be easier to understand this technique if you look at the example.",
      "Let's take a look at the two rows. There are two cells in each of them that contain a note of 4. Since 4s can't repeat in the same row or column, we can safely assume that 4s will be placed diagonally – either in light blue cells or dark blue cells.",
      "Now let's zoom out and take a look at the columns involved. Since 4s are diagonal, there will already be one number 4 in each of these columns. That means that we can't write it again.",
      "So, we can confidently remove 4 from all the remaining notes of these two columns.",
      "Now you know how to apply X-wing technique in Sudoku and can proceed with the following advanced Sudoku strategy \"Y-Wing\"."
    ]
  },
  {
    "id": 14,
    "slug": "y-wing",
    "originalSlug": "y-wing",
    "title": "Y-wing",
    "headingTitle": "\"Y-wing\" technique.",
    "shortDescription": "\"Y-Wing\" technique is similar to \"X-Wing\", but it based on three corners instead of four.",
    "difficulty": "Advanced",
    "videoUrl": "https://www.youtube-nocookie.com/embed/9qNDjbw1SlA",
    "thumbnail": "/images/rules/y-wing-thumb.png",
    "images": [
      {
        "url": "/images/rules/y-wing-step-1.png",
        "alt": "Y-wing step 1"
      },
      {
        "url": "/images/rules/y-wing-step-2.png",
        "alt": "Y-wing step 2"
      }
    ],
    "paragraphs": [
      "\"Y-Wing\" technique is similar to \"X-Wing\", but it based on three corners instead of four.",
      "Let's take a look at this technique with an example.",
      "To start, we need to find a cell with exactly two notes. We'll call this cell a pivot.Then, we'll look for two more cells with 2 notes as well. These cells (called pincers) should be in the same row, column or block as the pivot. One of the two numbers in each pincer should be the same as in the pivot. The other number is the same for both pincers.",
      "Now let's look where the both pincers intersect. That would be a cell in the bottom row. If that cell contains a note that is shared by both pincers, we can eliminate it. In this case it's number 4, because there's 4 in both pincers.",
      "That is how \"Y-wing\" technique works. This is an advanced sudoku strategy. It may take you some time and practice to figure it out."
    ]
  },
  {
    "id": 15,
    "slug": "swordfish",
    "originalSlug": "swordfish",
    "title": "Swordfish",
    "headingTitle": "\"Swordfish\" technique.",
    "shortDescription": "The \"Swordfish\" technique is an advanced Sudoku strategy. It's usually applied in the hard levels of Sudoku puzzles to eliminate candidates. \"Swordfish\" is similar to X-wing but uses three sets of cells instead of two.",
    "difficulty": "Advanced",
    "videoUrl": "https://www.youtube-nocookie.com/embed/lLVAVPLH7G4",
    "thumbnail": "/images/rules/swordfish-thumb.png",
    "images": [
      {
        "url": "/images/rules/swordfish-step-1.png",
        "alt": "Swordfish step 1"
      },
      {
        "url": "/images/rules/swordfish-step-2.png",
        "alt": "Swordfish step 2"
      },
      {
        "url": "/images/rules/swordfish-step-3.png",
        "alt": "Swordfish step 3"
      },
      {
        "url": "/images/rules/swordfish-step-4.png",
        "alt": "Swordfish step 4"
      }
    ],
    "paragraphs": [
      "The \"Swordfish\" technique is an advanced Sudoku strategy. It's usually applied in the hard levels of Sudoku puzzles to eliminate candidates. \"Swordfish\" is similar to X-wing but uses three sets of cells instead of two.",
      "To understand better, let's take a look at the example.",
      "In this puzzle 6 is our \"fish digit\" and rows 1, 6 and 9 are the base sets. The candidates for number 6 also align up perfectly in 3 columns. So, there are two options for number 6 to reside.",
      "Either this way",
      "Or this way",
      "Either way, those 3 sets cover the aligned columns meaning 6 cannot appear twice there. Hence, we can safely eliminate 6 from all other notes in these columns.",
      "Now you know how to apply \"Swordfish\" technique in Sudoku. It's very hard to spot but tremendously useful for your sudoku-solving arsenal."
    ]
  }
];

export function getTechniqueBySlug(slug: string): SudokuTechnique | undefined {
  const normalized = slug.toLowerCase();
  return sudokuTechniques.find(
    (t) => t.slug === normalized || t.originalSlug === normalized
  );
}

export function getTechniqueNavigation(currentSlug: string) {
  const normalized = currentSlug.toLowerCase();
  const currentIndex = sudokuTechniques.findIndex(
    (t) => t.slug === normalized || t.originalSlug === normalized
  );
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = currentIndex > 0 ? sudokuTechniques[currentIndex - 1] : null;
  const next = currentIndex < sudokuTechniques.length - 1 ? sudokuTechniques[currentIndex + 1] : null;
  return { prev, next };
}
