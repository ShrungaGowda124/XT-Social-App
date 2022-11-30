const expect = require('chai').expect;
const deleteCommentDB = require('../routes/commentsDBRoute').deleteCommentDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var commentModel = require("../model/CommentsModel");

describe('Comment DB Delete Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.throws();
            deleteCommentDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should throw error other 500', (done) => {
        let req = {
            body: {
                query: {
                    _id: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
        err = new Error("Error");
        err.statusCode = 400;
            commentModel.findOneAndUpdate.throws(err);
            deleteCommentDB(req,{},()=>{}).then(result=>{
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
            deleteCommentDB(req,{},()=>{}).then(result=>{
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
            deleteCommentDB(req,{},()=>{}).then(result=>{
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
                }
            }
        }
        let res = {
            statusCode: 100,
            message: null,
            status: function(value){
                return this.statusCode = value;
            },
            json: function(msg){
                return this.message = msg.message;
            }
        }
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.returns(null);
            deleteCommentDB(req,res,()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
    it('should change isActive to false for matching query in request',(done) => {
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
        newStubValue.isActive = false;
        sinon.stub(commentModel, 'findOneAndUpdate');
            commentModel.findOneAndUpdate.returns(newStubValue);
            deleteCommentDB(req,res,()=>{}).then(result=>{
                expect(res.finalObj.isActive).to.be.equal(false);
                expect(res.finalObj._id).to.be.equal(stubValue._id);
                expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            commentModel.findOneAndUpdate.restore();
    });
});