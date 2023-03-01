const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("UnitTests => Solver Logic Functions", () => {
  suite("solver tests", function () {
    test("Logic handles a valid puzzle string of 81 characters", function (done) {
      let complete = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      assert.equal(solver.solve(validPuzzle), complete);
      done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .), should return false", function (done) {
        let inValidPuzzle = "1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.equal(solver.solve(inValidPuzzle), false);
        done();
      });

      test("Logic handles a puzzle string that is not 81 characters in length, should return false", function (done) {
        let inValidPuzzle = "1.5..2.84..63.12.7.2..5.......9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
          assert.equal(solver.solve(inValidPuzzle), false);
        done();
      });
  
    //   test("Logic handles a valid row placement", function (done) {
    //     assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "9"), true);
    //     done();
    //   });


})
})