const chai = require('chai');
const assert = chai.assert;
const server = require("../server");
const Solver = require('../controllers/sudoku-solver.js');
let solver;

let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite('Unit Tests => API => /api/solve', () => {
    test("Attempt to solve a puzzle with missing puzzle string: POST request to /api/solve, should return error", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field missing");
            done();
          });
      });

      test("Attempt to solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({puzzle: "1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      });

      test("Attempt to solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({puzzle: "1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
      });

    //   test("Attemp to solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    //     chai
    //       .request(server)
    //       .post("/api/solve")
    //       .send({puzzle: "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.error, "Puzzle cannot be solved");
    //         done();
    //       });
    //   });

    });

    suite('Unit Tests => API => /api/check', () => {
    // test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    //     chai
    //       .request(server)
    //       .post("/api/check")
    //       .send({ puzzle: validPuzzle, coordinate: "A2", value: "3" })
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.valid, true);
    //         done();
    //       });
    //   });
    //   test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    //     chai
    //       .request(server)
    //       .post("/api/check")
    //       .send({ puzzle: validPuzzle, coordinate: "A2", value: "8" })
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.valid, false);
    //         assert.equal(res.body.conflict.length, 1);
    //         done();
    //       });
    //   });
    //   test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    //     chai
    //       .request(server)
    //       .post("/api/check")
    //       .send({ puzzle: validPuzzle, coordinate: "A2", value: "6" })
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.valid, false);
    //         assert.equal(res.body.conflict.length, 2);
    //         done();
    //       });
    //   });
    //   test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    //     chai
    //       .request(server)
    //       .post("/api/check")
    //       .send({ puzzle: validPuzzle, coordinate: "A2", value: "2" })
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.valid, false);
    //         assert.equal(res.body.conflict.length, 3);
    //         done();
    //       });
    //   });

    test("Check a puzzle placement with missing required fields: POST request to /api/check, should return: Required field(s) missing", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzle, value: "3" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
      });

      test("Check a puzzle placement with invalid characters: POST request to /api/check, should return: Invalid characters in puzzle", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: "1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "3"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      });

      test("Check a puzzle placement with incorrect length: POST request to /api/check, should return: Expected puzzle to be 81 characters long", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({puzzle: "1.5..2.84..63.12.7.2..5..h..9..1..8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "3"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
      });

      test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check, should return: Invalid coordinate", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzle, coordinate: "L2", value: "3" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
      });

      test("Check a puzzle placement with invalid placement value: POST request to /api/check, should return: Invalid value", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzle, coordinate: "A2", value: "g" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });

});
