const { expect } = require("chai");
const chai = require("chai");
var mocks = require("node-mocks-http");

const { createBlog } = require("../routes/blogs");
//Assertion Style
chai.expect();

/**Here we will test api for creating the blog */

describe("Get all Blog Api - /view", () => {
  it("It should give us a response code 400", async () => {
    const req = {
      body: {},
    };
    const res = mocks.createResponse();
    const response = await createBlog(req, res);
    console.log(response.statusCode);
    expect(response.statusCode).to.equal(400);
  });

  // it("It should give response 404", () => {
  //   chai
  //     .request(router)
  //     .post("/view")
  //     .end((err, resp) => {
  //       resp.should.have.status(404);
  //     });
  // });
});

// describe("Get Blog by ID Api -- view/:id ", () => {
//   it("It should give us the blog whose uuid matches the params from the user", () => {
//     const id = "lqx8iWadoE";
//     chai
//       .request(router)

//       .get("/view/" + id)
//       .end((err, resp) => {
//         resp.should.have.status(200);
//         resp.body.should.be.a("object");
//         resp.body.should.have.property("usersShared");
//         resp.body.should.have.property("blogDescription");
//       });
//   });

//   it("It should give us a response object saying couldn't find the blog matching in the DB", () => {
//     const id = "lqx8iWadoG";
//     chai
//       .request(router)

//       .get("/view/" + id)
//       .end((err, resp) => {
//         resp.should.have.status(400);
//         resp.body.should.be.a("object");
//       });
//   });

//   it("It should give us a response object saying couldn't find the blog matching in the DB", () => {
//     const id = "";
//     chai
//       .request(router)

//       .get("/view/" + id)
//       .end((err, resp) => {
//         resp.should.have.status(400);
//         resp.body.should.be.a("object");
//       });
//   });

//   it("It should give us a response object saying couldn't find the blog matching in the DB", () => {
//     const id = "this is a id";
//     chai
//       .request(router)

//       .get("/view/" + id)
//       .end((err, resp) => {
//         resp.should.have.status(400);
//         resp.body.should.be.a("object");
//       });
//   });
//   it("It should give us a response object saying couldn't find the blog matching in the DB", () => {
//     const id = null;
//     chai
//       .request(router)

//       .get("/view/" + id)
//       .end((err, resp) => {
//         resp.should.have.status(400);
//         resp.body.should.be.a("object");
//       });
//   });
// });
