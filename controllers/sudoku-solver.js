"use strict";
var previousSolvedBoard = [];

class SudokuSolver {
  validate(puzzleString) {
    var validation = true;
    if (!puzzleString) validation = { error: "Required field missing" };
    else if (!/^[0-9\.]+$/.test(puzzleString))
      validation = { error: "Invalid characters in puzzle" };
    else if (puzzleString.length !== 81)
      validation = { error: "Expected puzzle to be 81 characters long" };
    return validation;
  }

  transformToBoard(puzzleString) {
    const sudokuSize = 9;
    const board = [];
    const puzzleArr = puzzleString.split("");
    for (let i = 0; i < sudokuSize; i++) {
      board.push(puzzleArr.slice(sudokuSize * i, (i + 1) * sudokuSize));
    }
    return board;
  }

  checkRowPlacement(board, letter, row, value) {
    if (/^[A-Ia-i]$/.test(row)) {
      return board[letter].find((x) => x == value) ? "conflictRow" : "validRow";
    } else {
      return { error: "Invalid coordinate" };
    }
  }

  checkColPlacement(board, letter, column, value) {
    if (/^[1-9]$/.test(column)) {
      const valuesInCol = [];
      for (var i = 0; i < 9; i++) {
        valuesInCol.push(board[i][column - 1]);
      }
      return valuesInCol.find((x) => x == value)
        ? "conflictColumn"
        : "validColumn";
    } else {
      return { error: "Invalid coordinate" };
    }
  }

  checkRegionPlacement(board, letter, column, value) {
    const rowStart = Math.floor(letter / 3) * 3;
    const colStart = Math.floor((column - 1) / 3) * 3;
    const valuesInRegion = [];
    for (var i = rowStart; i < rowStart + 3; i++) {
      for (var j = colStart; j < colStart + 3; j++) {
        valuesInRegion.push(board[i][j]);
      }
    }
    return valuesInRegion.find((x) => x == value)
      ? "conflictRegion"
      : "validRegion";
  }

  checkValue(puzzleString, row, column, value) {
    if (this.validate(puzzleString) != true) return this.validate(puzzleString);

    if (!/^[1-9]$/.test(column) || !/^[A-Ia-i]$/.test(row))
      return { error: "Invalid coordinate" };
    if (!value) return { error: "Required field(s) missing" };
    if (!/^[1-9]$/.test(value)) return { error: "Invalid value" };

    const board = this.transformToBoard(puzzleString);

    const letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I"].findIndex(
      (x) => x == row
    );
    if (board[letter][column - 1] == value) return { valid: true };

    var conflict = [];
    if (this.checkRowPlacement(board, letter, row, value) == "conflictRow")
      conflict.push("row");
    if (
      this.checkColPlacement(board, letter, column, value) == "conflictColumn"
    )
      conflict.push("column");
    if (
      this.checkRegionPlacement(board, letter, column, value) ==
      "conflictRegion"
    )
      conflict.push("region");
    return conflict.length == 0
      ? { valid: true }
      : { valid: false, conflict: conflict };
  }

  solvedFunction(board) {
    var boardUpdated = board;
    var err;
    var result;
    var validValuesArray = [];

    for (var i = 0; i < 9; i++) {
      for (var k = 1; k <= 9; k++) {
        var uniqueK = [];
        for (var j = 0; j < 9; j++) {
          if (boardUpdated[i][j] == ".") {
            if (
              !boardUpdated[i].find((x) => x == k) &&
              this.checkColPlacement(boardUpdated, i, j + 1, k) ==
                "validColumn" &&
              this.checkRegionPlacement(boardUpdated, i, j + 1, k) ==
                "validRegion"
            )
              uniqueK.push([i, j, k]);
          }
        }
        if (uniqueK.length == 1) boardUpdated[i][uniqueK[0][1]] = uniqueK[0][2];
      }
    }

    var columns = [];
    for (var j = 0; j < 9; j++) {
      var column = [];
      for (var i = 0; i < 9; i++) {
        column.push(boardUpdated[i][j]);
      }
      columns.push(column);
    }
    for (var j = 0; j < 9; j++) {
      for (var k = 1; k <= 9; k++) {
        var uniqueK = [];
        for (var i = 0; i < 9; i++) {
          if (boardUpdated[i][j] == ".") {
            if (!columns[j].find((x) => x == k)) {
              if (
                !boardUpdated[i].find((x) => x == k) &&
                this.checkRegionPlacement(boardUpdated, i, j + 1, k) ==
                  "validRegion"
              )
                uniqueK.push([i, j, k]);
            }
          }
        }
        if (uniqueK.length == 1) boardUpdated[uniqueK[0][0]][j] = uniqueK[0][2];
      }
    }

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (boardUpdated[i][j] == ".") {
          var region = [];
          const rowStart = Math.floor(i / 3) * 3;
          const colStart = Math.floor(j / 3) * 3;
          for (var d = rowStart; d < rowStart + 3; d++) {
            for (var r = colStart; r < colStart + 3; r++) {
              region.push([d, r, boardUpdated[d][r]]);
            }
          }
          var absentFigures = [];
          for (var k = 1; k <= 9; k++) {
            if (!region.find((x) => x[2] == k)) absentFigures.push(k);
          }
          absentFigures.map((x) => {
            var uniqueK = [];
            for (var q = 0; q < 9; q++) {
              if (region[q][2] == ".") {
                if (
                  !boardUpdated[region[q][0]].find((y) => y == x) &&
                  this.checkColPlacement(
                    boardUpdated,
                    region[q][0],
                    region[q][1] + 1,
                    x
                  ) == "validColumn"
                )
                  uniqueK.push([region[q][0], region[q][1]]);
              }
            }
            if (uniqueK.length == 1)
              boardUpdated[uniqueK[0][0]][uniqueK[0][1]] = x;
          });
        }
      }
    }

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var validValues = [];
        if (boardUpdated[i][j] == ".") {
          for (var k = 1; k <= 9; k++) {
            if (
              !boardUpdated[i].find((x) => x == k) &&
              this.checkColPlacement(boardUpdated, i, j + 1, k) ==
                "validColumn" &&
              this.checkRegionPlacement(boardUpdated, i, j + 1, k) ==
                "validRegion"
            )
              validValues.push(k);
          }
        }
        if (validValues.length == 1) boardUpdated[i][j] = validValues[0];
        if (validValues.length == 0 && boardUpdated[i][j] == ".")
          err = "errora";
        if (validValues.length > 1)
          validValuesArray.push([i, j, ...validValues]);

        if (err == "errora") break;
      }
      if (err == "errora") break;
    }

    if (err) result = err;
    else {
      if (boardUpdated.flat().find((x) => x == ".")) {
        validValuesArray.map((x) => {
          var options = [];
          for (var d = 2; d < x.length; d++) {
            var erro = false;
            if (
              boardUpdated[x[0]].find((y) => y == x[d]) ||
              this.checkColPlacement(boardUpdated, x[0], x[1] + 1, x[d]) !=
                "validColumn" ||
              this.checkRegionPlacement(boardUpdated, x[0], x[1] + 1, x[d]) !=
                "validRegion"
            )
              continue;

            boardUpdated[x[0]][x[1]] = x[d];
            for (var i = 0; i < 9; i++) {
              for (var j = 0; j < 9; j++) {
                var validValues = [];
                if (boardUpdated[i][j] == ".") {
                  for (var k = 1; k <= 9; k++) {
                    if (
                      !boardUpdated[i].find((y) => y == k) &&
                      this.checkColPlacement(boardUpdated, i, j + 1, k) ==
                        "validColumn" &&
                      this.checkRegionPlacement(boardUpdated, i, j + 1, k) ==
                        "validRegion"
                    )
                      validValues.push(k);
                  }
                }

                if (validValues.length == 0 && boardUpdated[i][j] == ".") {
                  erro = true;
                }
                if (erro) break;
              }
              if (erro) break;
            }
            if (!erro) options.push(x[d]);
            boardUpdated[x[0]][x[1]] = ".";
          }
          if (options.length == 1) boardUpdated[x[0]][x[1]] = options[0];
        });

        if (
          boardUpdated.flat().find((x) => x == ".") &&
          boardUpdated
            .flat()
            .every((v, i) => v == previousSolvedBoard.flat()[i])
        ) {
          var index = boardUpdated.flat().findIndex((x) => x == ".");
          var row = Math.floor(index / 9);
          var column = index % 9;
          var firstApplicaple = validValuesArray.find((x) => x[0] == row);
          boardUpdated[row][column] = firstApplicaple[2];
        } else {
          previousSolvedBoard = boardUpdated;
        }

        this.solvedFunction(boardUpdated);
      }
      result = boardUpdated.flat();
    }

    return result;
  }

  solve(puzzleString) {
    var board = this.transformToBoard(puzzleString);
    var solution = this.solvedFunction(board);
    console.log(typeof solution); // выведет string для случая А и object для В
    if (typeof solution == "string")
      return { error: "Puzzle cannot be solved" };
    else {
      return solution.find((x) => x == ".")
        ? { error: "Puzzle cannot be solved" }
        : { solution: solution.join("") };
    }
  }
}

module.exports = SudokuSolver;
