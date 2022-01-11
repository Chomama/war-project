const server = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

describe("Test GET endpoint /getWins", () => {
  it("should return player lifetime scores", (done) => {
    chai
      .request(server)
      .get("/getWins")
      .send({ playerId1: "playerOne", playerId2: "playerTwo" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});

describe("Test POST endpoint /updateWins", () => {
  it("should add one to the win column of the database", (done) => {
    chai
      .request(server)
      .post("/updateWins")
      .send({ playerId: "playerOne" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
