const { expect } = require("chai");
const chai = require("chai");
var mocks = require("node-mocks-http");
const { faker } = require("@faker-js/faker");
const sinon = require("sinon");
const axios = require("axios");

const { createBlog, viewBlog, viewBlogById } = require("../routes/blogs");
//Assertion Style
chai.expect();

/**Here , we will test the view blogs api**/
describe("View Blog api - /view", () => {
  it("It should read the user db and give an array", async () => {
    const req = { body: {}, headers: { timezone: "Asia/Calcutta" } };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };

    sinon.stub(axios, "post").returns([]);

    viewBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("array");
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });

  /**Error due to not passing any timezone**/
  it("It should throw an error and status code 500", async () => {
    const req = { body: {}, headers: {} };
    const response = {};

    sinon.stub(axios, "post");
    axios.post.throws();

    viewBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });

    axios.post.restore();
  });
  it("It should throw an error and status code 500", async () => {
    const req = { body: {}, headers: { timezone: "Asia/Calcuttayyyaaaaa" } };
    const response = {};

    sinon.stub(axios, "post");
    axios.post.throws();

    viewBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });

    axios.post.restore();
  });
  it("It should throw an error and status code 500", async () => {
    const req = { body: {}, headers: { timezone: null } };
    const response = {};

    sinon.stub(axios, "post");
    axios.post.throws();

    viewBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });

    axios.post.restore();
  });
  it("It should throw an error and status code 500", async () => {
    const req = { body: {}, headers: { timezone: 12344 } };
    const response = {};

    sinon.stub(axios, "post");
    axios.post.throws();

    viewBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });

    axios.post.restore();
  });
});

describe("View Blog by id api - /view/:id", () => {
  it("It should read the DB and return the matching blog by id", async () => {
    const stub = {
      _id: faker.datatype.uuid(),
      blogTitle: faker.name.jobTitle(),
      blogDescription: faker.datatype.array(5),
      blogAuthor: faker.datatype.uuid(),
      usersShared: faker.datatype.array(),
      usersApplauded: faker.datatype.array(),
      comments: faker.datatype.array(),
      uuid: faker.datatype.uuid(),
      timeNeededToRead: "50 seconds",
      isActive: true,
      isInteraction: faker.datatype.boolean,
      blogPublishTimeStamp: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
    const req = {
      params: { uuid: stub.uuid },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post").returns(stub);
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("object");
      expect(response).to.have.property("blogDescription");
      expect(response.blogDescription).to.be.equal(stub.blogDescription);
      expect(response.blogDescription).to.be.an("array");
      expect(response).to.have.property("comments");
      expect(response.comments).to.be.an("array");
      expect(response.comments).to.be.equal(stub.comments);
      expect(response).to.have.property("usersShared");
      expect(response.usersShared).to.be.an("array");
      expect(response.usersShared).to.be.equal(stub.usersShared);
      expect(response).to.have.property("usersApplauded");
      expect(response.usersApplauded).to.be.an("array");
      expect(response).to.have.property("createdAt");
      expect(response.createdAt).to.be.a("date");
      expect(response.createdAt).to.be.equal(stub.createdAt);
      expect(response).to.have.property("updatedAt");
      expect(response.updatedAt).to.be.a("date");
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });

  it("It should throw an error with status code - 500", async () => {
    const req = {
      params: {},
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: { uuid: "" },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: { uuid: "abc" },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: { uuid: null },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: { uuid: 1345 },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: { uuid: undefined },
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should give a error- 500", async () => {
    const req = {
      params: {},
      body: {},
      headers: { timezone: "Asia/Calcutta" },
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");
    axios.post.throws();
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("error");
      expect(response).to.have.property("status", 500);
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
  it("It should read the DB and get us the data based on the id and populate query ", async () => {
    const stub = {
      _id: faker.datatype.uuid(),
      blogTitle: faker.name.jobTitle(),
      blogDescription: faker.datatype.array(5),
      blogAuthor: {
        name: faker.name.fullName(),
        careerStage: faker.name.jobTitle(),
        emailID: faker.internet.email(),
      },
      usersShared: [
        {
          name: faker.name.fullName(),
          careerStage: faker.name.jobTitle(),
          emailID: faker.internet.email(),
        },
      ],
      usersApplauded: [
        {
          name: faker.name.fullName(),
          careerStage: faker.name.jobTitle(),
          emailID: faker.internet.email(),
        },
      ],
      comments: [
        {
          comment: faker.lorem.sentence(),
          commentAuthor: {
            name: faker.name.fullName(),
            careerStage: faker.name.jobTitle(),
            emailID: faker.internet.email(),
          },
        },
      ],
      uuid: faker.datatype.uuid(),
      timeNeededToRead: "50 seconds",
      isActive: true,
      isInteraction: faker.datatype.boolean,
      blogPublishTimeStamp: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
    const req = {
      params: { uuid: stub.uuid },
      body: {},
    };
    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post").returns(stub);
    viewBlogById(req, response, () => {}).then((result) => {
      expect(response).to.be.an("object");
      expect(response).to.have.property("blogDescription");
      expect(response.blogDescription).to.be.equal(stub.blogDescription);
      expect(response.blogDescription).to.be.an("array");
      expect(response).to.have.property("comments");
      expect(response.comments).to.be.an("array");
      expect(response.comments).to.be.equal(stub.comments);
      expect(response).to.have.property("usersShared");
      expect(response.usersShared).to.be.an("array");
      expect(response.usersShared).to.be.equal(stub.usersShared);
      expect(response).to.have.property("usersApplauded");
      expect(response.usersApplauded).to.be.an("array");
      expect(response).to.have.property("createdAt");
      expect(response.createdAt).to.be.a("date");
      expect(response.createdAt).to.be.equal(stub.createdAt);
      expect(response).to.have.property("updatedAt");
      expect(response.updatedAt).to.be.a("date");
    });
    expect(axios.post.called).to.be.true;
    axios.post.restore();
  });
});

/**Here we will test api for creating the blog */

describe("Create blog api is tested in this block", () => {
  it("gives status code 200 and returns an object", async () => {
    const stub = {
      message: "Blog saved successfully",
      data: faker.datatype.uuid(),
    };
    const req = {
      body: {
        blogTitle: "dummy blog",
        blogAuthor: faker.datatype.uuid(),
        uuid: faker.datatype.uuid(),
        blogDescription: faker.datatype.array(),
      },
    };

    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post").returns(stub);

    createBlog(req, response, () => {}).then((result) => {
      expect(response).to.be.an("object");
      expect(response).to.have.property("status", 200);
      expect(response.message).to.have.property(
        "message",
        "Blog saved successfully"
      );
      expect(response).to.have.property(data);
    });
    axios.post.restore();
  });

  it("gives status code 400 because no blog title is passed", async () => {
    const req = {
      body: {
        blogAuthor: faker.datatype.uuid(),
        uuid: faker.datatype.uuid(),
        blogDescription: faker.datatype.array(),
      },
    };

    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");

    createBlog(req, response, () => {}).then((result) => {
      expect(response).to.have.property("status", 400);
      expect(response.message).to.be.equal("No blog title found");
    });
    axios.post.restore();
  });

  it("gives status code 400 because nothing is passed in body", async () => {
    const req = {
      body: {},
    };

    const response = {
      data: {},
      send: function (value) {
        this.data = value;
      },
    };
    sinon.stub(axios, "post");

    createBlog(req, response, () => {}).then((result) => {
      expect(response).to.have.property("status", 400);
      expect(response.message).to.be.equal("No blog details found");
    });
  });
});
