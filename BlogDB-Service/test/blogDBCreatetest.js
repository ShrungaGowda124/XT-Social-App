const expect = require('chai').expect;
const createBlogDB = require('../routes/blogsDBRoutes').createBlogDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var blogModel = require("../model/BlogsModel");

describe('Blog DB Service Create Test Cases', () => {
    it('should throw error for empty request', async () => {
        let req = {};
        //const saveObj = new blogModel(req);
        sinon.stub(blogModel, 'create');
        blogModel.create.throws();
        let res = await createBlogDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        blogModel.create.restore();
    });
    it('should throw error for empty request body', async () => {
        let req = {
            body: {}
        };
        //const saveObj = new blogModel(req);
        sinon.stub(blogModel, 'create');
        blogModel.create.throws();
        let res = await createBlogDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        blogModel.create.restore();
    });
    it('should throw error for no blogTitle in request', async () => {
        let req = {
            body: {
                blogAuthor: faker.datatype.uuid()
            }
        };
        //const saveObj = new blogModel(req);
        sinon.stub(blogModel, 'create');
        blogModel.create.throws();
        let res = await createBlogDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        blogModel.create.restore();
    });
    it('should throw error for no blogAuthor in request', async () => {
        let req = {
            body: {
                blogTitle: faker.datatype.string()
            }
        };
        //const saveObj = new blogModel(req);
        sinon.stub(blogModel, 'create');
        blogModel.create.throws();
        let res = await createBlogDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        blogModel.create.restore();
    });
    it("should throw error other then 500", (done) => {
        let req = {
            body: {
                blogTitle: faker.datatype.string(),
                blogAuthor: faker.datatype.uuid()
            }
        };
        let response = {
            data: {},
            statusCode: 500,
            send: function(value){
                return this.data=value;
            },
            status: function(val){
                return this.statusCode = val;
            }

        };
        const stubValue = {
            _id: faker.datatype.uuid(),
            blogTitle: req.body.blogTitle,
            blogDescription: [],
            blogAuthor: req.body.blogAuthor,
            isInteraction: faker.datatype.boolean(),
            isActive: faker.datatype.boolean(),
            usersShared: [],
            usersApplauded: [],
            blogPublishTimeStamp: faker.date.past(),
            comments: [],
            uuid: faker.datatype.uuid(),
            numOfWords: faker.datatype.number(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(blogModel, 'create');
        const err = new Error('Internal server error');
        err.statusCode = 400;
        blogModel.create.throws(err);
        createBlogDB(req, response, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 400);
            done();
        });
        blogModel.create.restore();
    });
    it("should throw error 500", (done) => {
        let req = {
            body: {
                blogTitle: faker.datatype.string(),
                blogAuthor: faker.datatype.uuid()
            }
        };
        let response = {
            data: {},
            statusCode: 500,
            send: function(value){
                return this.data=value;
            },
            status: function(val){
                return this.statusCode = val;
            }

        };
        const stubValue = {
            _id: faker.datatype.uuid(),
            blogTitle: req.body.blogTitle,
            blogDescription: [],
            blogAuthor: req.body.blogAuthor,
            isInteraction: faker.datatype.boolean(),
            isActive: faker.datatype.boolean(),
            usersShared: [],
            usersApplauded: [],
            blogPublishTimeStamp: faker.date.past(),
            comments: [],
            uuid: faker.datatype.uuid(),
            numOfWords: faker.datatype.number(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(blogModel, 'create');
        const err = new Error('Internal server error');
        blogModel.create.throws(err);
        createBlogDB(req, response, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });
        blogModel.create.restore();
    });
    it("should create blog in DB from the given blogTitle, blogAuthor with all default values", (done) => {
        let req = {
            body: {
                blogTitle: faker.datatype.string(),
                blogAuthor: faker.datatype.uuid()
            }
        };
        let response = {
            data: {},
            statusCode: 500,
            send: function(value){
                return this.data=value;
            },
            status: function(val){
                return this.statusCode = val;
            }

        };
        const stubValue = {
            _id: faker.datatype.uuid(),
            blogTitle: req.body.blogTitle,
            blogDescription: [],
            blogAuthor: req.body.blogAuthor,
            isInteraction: faker.datatype.boolean(),
            isActive: faker.datatype.boolean(),
            usersShared: [],
            usersApplauded: [],
            blogPublishTimeStamp: faker.date.past(),
            comments: [],
            uuid: faker.datatype.uuid(),
            numOfWords: faker.datatype.number(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(blogModel, 'create');
        blogModel.create.returns(stubValue);
        createBlogDB(req, response, () => { }).then(result => {
            console.log("Res... ", response);
            expect(response.data).to.be.an('object');
            expect(response.data.blogTitle).to.be.equal(req.body.blogTitle);
            expect(response.data.blogTitle).to.be.a('string');
            expect(response.data).to.have.property('_id');
            expect(response.data._id).to.be.a('string');
            expect(response.data.uuid).to.be.equal(stubValue.uuid);
            expect(response.data.uuid).to.be.a('string');
            expect(response.data.blogAuthor).to.be.equal(req.body.blogAuthor);
            expect(response.data.blogAuthor).to.be.a('string');
            expect(response.data.blogPublishTimeStamp).to.be.equal(stubValue.blogPublishTimeStamp);
            expect(response.data.blogPublishTimeStamp).to.be.a('date');
            expect(response.data.isActive).to.be.equal(stubValue.isActive);
            expect(response.data.isActive).to.be.a('boolean');
            expect(response.data.isInteraction).to.be.equal(stubValue.isInteraction);
            expect(response.data.isInteraction).to.be.a('boolean');
            expect(response.data.numOfWords).to.be.equal(stubValue.numOfWords);
            expect(response.data.numOfWords).to.be.a('number');
            expect(response.data.createdAt).to.be.equal(stubValue.createdAt);
            expect(response.data.createdAt).to.be.a('date');
            expect(response.data.updatedAt).to.be.equal(stubValue.updatedAt);
            expect(response.data.updatedAt).to.be.a('date');
                
            expect(response.data.blogDescription).to.be.an('array');
            expect(response.data.comments).to.be.an('array');
            expect(response.data.usersApplauded).to.be.an('array');
            expect(response.data.usersShared).to.be.an('array');
            done();
        });
        blogModel.create.restore();
    });
});