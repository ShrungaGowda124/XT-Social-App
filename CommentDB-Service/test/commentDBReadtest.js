const expect = require('chai').expect;
const readCommentDB = require('../routes/commentsDBRoute').readCommentDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var commentModel = require("../model/CommentsModel");

describe("Comment DB Service test", ()=>{
    describe("Read operation ", () => {
        it('should read comment db & throws error with statusCode 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(commentModel, 'find');
            commentModel.find.throws();
            readCommentDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            commentModel.find.restore();
        });
        it('should read comment db & throws error with statusCode other then 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(commentModel, 'find');
            err = new Error("Error");
            err.statusCode = 400;
            commentModel.find.throws(err);
            readCommentDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            commentModel.find.restore();
        });
        it('should read comment db & result be array', (done)=>{
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {}
            };
            //sinon.stub(commentModel, 'find');
            //commentModel.find.returns([]);
            sinon.stub(commentModel, 'find').returns({
                populate: sinon.stub().returns([])
            });
            readCommentDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                done();
            });
            expect(commentModel.find.called).to.be.true;
            commentModel.find.restore();
        });
        it('should read comment db & pass query in request body & get result matching the same', (done)=>{
            const stubValue = {
                _id: faker.datatype.uuid(),
                comment: faker.datatype.string(),
                commentAuthor: faker.datatype.uuid(),
                isActive: faker.datatype.boolean(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
            };
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {
                    query: {
                        _id: stubValue._id
                    }
                }
            };
            let newStubValue = {...stubValue};
            sinon.stub(commentModel, 'find').returns({
                populate: sinon.stub().returns([
                    newStubValue
                ])
            });
            readCommentDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes[0].comment).to.be.equal(stubValue.comment);
                expect(response.finalRes[0].comment).to.be.a('string');
                expect(response.finalRes[0]).to.have.property('_id');
                expect(response.finalRes[0]._id).to.be.equal(stubValue._id);
                expect(response.finalRes[0]._id).to.be.a('string');
                expect(response.finalRes[0].commentAuthor).to.be.equal(stubValue.commentAuthor);
                expect(response.finalRes[0].commentAuthor).to.be.a('string');
                expect(response.finalRes[0].isActive).to.be.equal(stubValue.isActive);
                expect(response.finalRes[0].isActive).to.be.a('boolean');
                expect(response.finalRes[0].createdAt).to.be.equal(stubValue.createdAt);
                expect(response.finalRes[0].createdAt).to.be.a('date');
                expect(response.finalRes[0].updatedAt).to.be.equal(stubValue.updatedAt);
                expect(response.finalRes[0].updatedAt).to.be.a('date');
                done();
            });
            expect(commentModel.find.called).to.be.true;
            commentModel.find.restore();
        });
        it('should read comment db & pass query in request body & get result no matching the same', (done)=>{
            const stubValue = {
                _id: faker.datatype.uuid(),
                comment: faker.datatype.string(),
                commentAuthor: faker.datatype.uuid(),
                isActive: faker.datatype.boolean(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
            };
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {
                    query: {
                        _id: faker.datatype.uuid()
                    }
                }
            };
            let newStubValue = {...stubValue};
            sinon.stub(commentModel, 'find').returns({
                populate: sinon.stub().returns([
                ])
            });
            //commentModel.find.returns([]);
            readCommentDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes.length).to.be.equal(0);
                done();
            });
            expect(commentModel.find.called).to.be.true;
            commentModel.find.restore();
        });
        it('should read comment db & pass query & populate query in request body & get result with corresponding information', (done)=>{
            
            const stubValue = {
                _id: faker.datatype.uuid(),
                comment: faker.datatype.string(),
                commentAuthor: {
                    name: faker.name.fullName(),
                    emailID: faker.internet.email(),
                    careerStage: faker.datatype.string()
                },
                isActive: faker.datatype.boolean(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
            };
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {
                    "query": {
                        "_id": stubValue._id
                    },
                    "populateQuery": {
                        "path": "commentAuthor",
                        "select": "name careerStage emailID -_id"
                    } 
                }
            };
            sinon.stub(commentModel, 'find').returns({
                populate: sinon.stub().returns([
                    stubValue
                ])
            });
            //commentModel.find.returns([]);
            readCommentDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes[0].comment).to.be.equal(stubValue.comment);
                expect(response.finalRes[0].comment).to.be.a('string');
                expect(response.finalRes[0]).to.have.property('_id');
                expect(response.finalRes[0]._id).to.be.equal(stubValue._id);
                expect(response.finalRes[0]._id).to.be.a('string');
                expect(response.finalRes[0].commentAuthor).to.be.a('object');
                expect(response.finalRes[0].isActive).to.be.equal(stubValue.isActive);
                expect(response.finalRes[0].isActive).to.be.a('boolean');
                expect(response.finalRes[0].createdAt).to.be.equal(stubValue.createdAt);
                expect(response.finalRes[0].createdAt).to.be.a('date');
                expect(response.finalRes[0].updatedAt).to.be.equal(stubValue.updatedAt);
                expect(response.finalRes[0].updatedAt).to.be.a('date');

                expect(response.finalRes[0].commentAuthor).to.not.have.property('_id');
                expect(response.finalRes[0].commentAuthor).to.have.property('name');
                expect(response.finalRes[0].commentAuthor).to.have.property('emailID');
                expect(response.finalRes[0].commentAuthor).to.have.property('careerStage');
                
                done();
            });
            expect(commentModel.find.called).to.be.true;
            commentModel.find.restore();
        });
    });
});