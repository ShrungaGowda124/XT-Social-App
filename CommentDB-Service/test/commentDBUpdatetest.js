const expect = require('chai').expect;
const updateCommentDB = require('../routes/commentsDBRoute').updateCommentDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var commentModel = require("../model/CommentsModel");

describe('Comment DB Update Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                },
                updateQuery: {
                    comment: faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error other than 500', (done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                },
                updateQuery: {
                    comment: faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
        err = new Error("Error");
        err.statusCode = 400;
            commentModel.findOneAndUpdate.throws(err);
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty request',(done) => {
        let req = {
            body: {}
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty query in request',(done) => {
        let req = {
            body: {
                query: {}
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty updateQuery in request',(done) => {
        let req = {
            body: {
                updateQuery: {}
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for no query but updateQuery object in request',(done) => {
        let req = {
            body: {
                updateQuery: {
                    "comment": faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for query but no updateQuery object in request',(done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for no matching query in request',(done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                },
                updateQuery: {
                    comment: faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.returns(null);
            updateCommentDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for number passed in isActive property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            comment: faker.datatype.string(),
            commentAuthor: faker.datatype.uuid(),
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    isActive: 123,
                    comment: faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error for string passed in isActive property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            comment: faker.datatype.string(),
            commentAuthor: faker.datatype.uuid(),
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    isActive: "test str",
                    comment: faker.datatype.string()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            updateCommentDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should change the object property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            comment: faker.datatype.string(),
            commentAuthor: faker.datatype.uuid(),
            isActive: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
        };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    isActive: false,
                    comment: faker.datatype.string()
                }
            }
        }
        let res = {
            finalObj: {},
            send: function(value){
                return this.finalObj = value;
            }
        }
        const newStubValue = {...stubValue};
        for(let keys in req.body.updateQuery){
            newStubValue[keys] = req.body.updateQuery[keys];
        }
        //console.log("new val ", newStubValue);
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.returns(newStubValue);
            updateCommentDB(req,res,()=>{}).then(result=>{
                //console.log();
                for(let keys in req.body.updateQuery){
                    expect(res.finalObj[keys]).to.be.equal(req.body.updateQuery[keys]);
                }
                expect(res.finalObj._id).to.be.equal(stubValue._id);
                // expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
});