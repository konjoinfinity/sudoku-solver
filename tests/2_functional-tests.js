const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
chai.use(chaiHttp);

let validPuzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite('Unit Tests => API => /api/solve', () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: validPuzzleString })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            let expectedString = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
            assert.equal(res.body.solution, expectedString);
            done();
          });
      });

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

      test("Attempt to solve a puzzle with invalid characters: POST request to /api/solve, should return error", function (done) {
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

      test("Attempt to solve a puzzle with incorrect length: POST request to /api/solve, should return error", function (done) {
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

      test("Attempt to solve a puzzle that cannot be solved: POST request to /api/solve, should return error", function (done) {
        chai
          .request(server)
          .post("/api/solve")
          .send({puzzle: "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Puzzle cannot be solved");
            done();
          });
      });

    });

    suite('Unit Tests => API => /api/check', () => {
    test("Check a puzzle placement with all fields: POST request to /api/check, should solve puzzle", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzleString, coordinate: "A2", value: "3" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done();
          });
      });
      test("Check a puzzle placement with single placement conflict: POST request to /api/check, should have 1 conflict", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzleString, coordinate: "A2", value: "8" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });
      test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check, should have 2 conflicts", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzleString, coordinate: "A2", value: "6" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 2);
            done();
          });
      });
      test("Check a puzzle placement with all placement conflicts: POST request to /api/check, should have 3 conflicts", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzleString, coordinate: "A2", value: "2" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 3);
            done();
          });
      });

    test("Check a puzzle placement with missing required fields: POST request to /api/check, should return: Required field(s) missing", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzleString, value: "3" })
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
          .send({ puzzle: validPuzzleString, coordinate: "L2", value: "3" })
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
          .send({ puzzle: validPuzzleString, coordinate: "A2", value: "g" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });

});


// Solve a puzzle with valid puzzle string: POST request to /api/solve
// Solve a puzzle with missing puzzle string: POST request to /api/solve
// Solve a puzzle with invalid characters: POST request to /api/solve
// Solve a puzzle with incorrect length: POST request to /api/solve
// Solve a puzzle that cannot be solved: POST request to /api/solve
// Check a puzzle placement with all fields: POST request to /api/check
// Check a puzzle placement with single placement conflict: POST request to /api/check
// Check a puzzle placement with multiple placement conflicts: POST request to /api/check
// Check a puzzle placement with all placement conflicts: POST request to /api/check
// Check a puzzle placement with missing required fields: POST request to /api/check
// Check a puzzle placement with invalid characters: POST request to /api/check
// Check a puzzle placement with incorrect length: POST request to /api/check
// Check a puzzle placement with invalid placement coordinate: POST request to /api/check
// Check a puzzle placement with invalid placement value: POST request to /api/check