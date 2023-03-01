const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("validates a valid puzzle string of 81 characters, should return true", function () {
    assert.isTrue(
      solver.validate(
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ),
      "valid puzzlestring is true"
    );
  });
  test("Validates invalid characters (not 1-9 or .)", function () {
    assert.equal(
      solver.validate(
        ".a9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ).error,
      "Invalid characters in puzzle",
      "letters are not appropriate in puzzlestring"
    );
  });
  test("Validates puzzle for 81 characters", function () {
    assert.equal(
      solver.validate(
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6"
      ).error,
      "Expected puzzle to be 81 characters long",
      "checking incorrect length"
    );
  });
  test("Validates valid row placement", function () {
    assert.equal(
      solver.checkRowPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        "A",
        7
      ),
      "validRow",
      "valid row"
    );
  });
  test("Checks invalid row placement", function () {
    assert.equal(
      solver.checkRowPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        "A",
        9
      ),
      "conflictRow",
      "invalid row"
    );
  });
  test("Checks valid column placement", function () {
    assert.equal(
      solver.checkColPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        1,
        7
      ),
      "validColumn",
      "valid column"
    );
  });
  test("Checks invalid column placement", function () {
    assert.equal(
      solver.checkColPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        1,
        4
      ),
      "conflictColumn",
      "invalid column"
    );
  });
  test("Checks valid region placement", function () {
    assert.equal(
      solver.checkRegionPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        1,
        7
      ),
      "validRegion",
      "valid region"
    );
  });
  test("Checks invalid region placement", function () {
    assert.equal(
      solver.checkRegionPlacement(
        [
          [".", ".", "9", ".", ".", "5", ".", "1", "."],
          ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
          ["4", "3", "2", ".", ".", ".", ".", ".", "."],
          ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
          [".", "9", ".", ".", ".", ".", ".", "6", "."],
          ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
          [".", ".", ".", ".", ".", ".", "1", "9", "4"],
          ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
          [".", "4", ".", "3", ".", ".", "6", ".", "."],
        ],
        0,
        1,
        5
      ),
      "conflictRegion",
      "invalid region"
    );
  });
  test("Solves a valid puzzle strings", function () {
    assert.isDefined(
      solver.solve(
        "..9..5...8..4....2432......1...69.83.9.....6..2.71...9......1945....4.37.4.3..6.."
      ).solution,
      "valid string shows solution"
    );
  });
  test("Solver completes the puzzle for an incomplete puzzle", function () {
    assert.notInclude(
      solver.solve(
        "..9..5.1..5.4....2432......1....9.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ).solution,
      ".",
      "solver completes the puzzle"
    );
  });
  test("Solver attempts with an invalid puzzle strings", function () {
    assert.isDefined(
      solver.solve(
        "..99.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ).error,
      "invalid string shows error"
    );
  });
});
