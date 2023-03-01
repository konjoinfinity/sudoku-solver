"use strict";
const SudokuSolver = require("../controllers/sudoku-solver.js");
module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    var { coordinate, value, puzzle } = req.body;
    if (!coordinate || !puzzle)
      return res.send({ error: "Required field(s) missing" });
    let row = coordinate[0];
    let col = coordinate[1];
    if (coordinate.length > 2) res.send({ error: "Invalid coordinate" });
    res.send(solver.checkValue(puzzle, row, col, value));
  });

  app.route("/api/solve").post((req, res) => {
    if (solver.validate(req.body.puzzle) == true) {
      console.log(solver.solve(req.body.puzzle));
      return res.send(solver.solve(req.body.puzzle));
    } else {
      return res.send(solver.validate(req.body.puzzle));
    }
  });
};
