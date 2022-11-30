const expect = require('chai').expect;
const createCommentDB = require('../routes/commentsDBRoute').createCommentDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var commentModel = require("../model/CommentsModel");

describe('Comment DB Service Create Test Cases', () => {
    it("should throw error", (done) => {
        let req = {
            body: {
                comment: faker.datatype.string(),
                commentAuthor: faker.datatype.uuid()
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
            comment: req.body.comment,
            commentAuthor: req.body.commentAuthor,
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(commentModel, 'create');
        commentModel.create.throws();
        createCommentDB(req, response, () => { }).then(result => {
            
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
            done();
        });
        commentModel.create.restore();
    });
    it("should throw error other than 500", (done) => {
        let req = {
            body: {
                comment: faker.datatype.string(),
                commentAuthor: faker.datatype.uuid()
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
            comment: req.body.comment,
            commentAuthor: req.body.commentAuthor,
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(commentModel, 'create');
        err = new Error("Error");
        err.statusCode = 400;
        commentModel.create.throws(err);
        createCommentDB(req, response, () => { }).then(result => {
            
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 400);
            done();
        });
        commentModel.create.restore();
    });
    it('should throw error for empty request', async () => {
        let req = {};
        //const saveObj = new commentModel(req);
        sinon.stub(commentModel, 'create');
        commentModel.create.throws();
        let res = await createCommentDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        commentModel.create.restore();
    });
    it('should throw error for empty request body', async () => {
        let req = {
            body: {}
        };
        //const saveObj = new commentModel(req);
        sinon.stub(commentModel, 'create');
        commentModel.create.throws();
        let res = await createCommentDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        commentModel.create.restore();
    });
    it('should throw error for no comment in request', async () => {
        let req = {
            body: {
                commentAuthor: faker.datatype.uuid()
            }
        };
        //const saveObj = new commentModel(req);
        sinon.stub(commentModel, 'create');
        commentModel.create.throws();
        let res = await createCommentDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        commentModel.create.restore();
    });
    it('should throw error for no commentAuthor in request', async () => {
        let req = {
            body: {
                comment: faker.datatype.string()
            }
        };
        //const saveObj = new commentModel(req);
        sinon.stub(commentModel, 'create');
        commentModel.create.throws();
        let res = await createCommentDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        commentModel.create.restore();
    });
    it("should create comment in DB from the given comment, commentAuthor with all default values", (done) => {
        let req = {
            body: {
                comment: faker.datatype.string(),
                commentAuthor: faker.datatype.uuid()
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
            comment: req.body.comment,
            commentAuthor: req.body.commentAuthor,
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        sinon.stub(commentModel, 'create');
        commentModel.create.returns(stubValue);
        createCommentDB(req, response, () => { }).then(result => {
            expect(response.data).to.be.an('object');
            expect(response.data.comment).to.be.equal(req.body.comment);
            expect(response.data.comment).to.be.a('string');
            expect(response.data).to.have.property('_id');
            expect(response.data._id).to.be.a('string');
            expect(response.data.commentAuthor).to.be.equal(req.body.commentAuthor);
            expect(response.data.commentAuthor).to.be.a('string');
            expect(response.data.isActive).to.be.equal(stubValue.isActive);
            expect(response.data.isActive).to.be.a('boolean');
            expect(response.data.createdAt).to.be.equal(stubValue.createdAt);
            expect(response.data.createdAt).to.be.a('date');
            expect(response.data.updatedAt).to.be.equal(stubValue.updatedAt);
            expect(response.data.updatedAt).to.be.a('date');
            done();
        });
        commentModel.create.restore();
    });
});