const expect = require('chai').expect;
const deleteBlogDB = require('../routes/blogsDBRoutes').deleteBlogDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var blogModel = require("../model/BlogsModel");

describe('Blog DB Delete Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    uuid: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            deleteBlogDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error other than 500', (done) => {
        let req = {
            body: {
                query: {
                    uuid: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
        let err = new Error("Error");
        err.statusCode = 400;
            blogModel.findOneAndUpdate.throws(err);
            deleteBlogDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty request',(done) => {
        let req = {
            body: {}
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            deleteBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty query in request',(done) => {
        let req = {
            body: {
                query: {}
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            deleteBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for no matching query in request',(done) => {
        let req = {
            body: {
                query: {
                    uuid: faker.datatype.uuid()
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
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.returns(null);
            deleteBlogDB(req,res,()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should change isActive to true for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            blogTitle: faker.datatype.string(),
            blogDescription: [],
            blogAuthor: faker.datatype.uuid(),
            isInteraction: faker.datatype.boolean(),
            isActive: true,
            usersShared: [],
            usersApplauded: [],
            blogPublishTimeStamp: faker.date.past(),
            comments: [],
            uuid: faker.datatype.uuid(),
            numOfWords: "",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let req = {
            body: {
                query: {
                    uuid: stubValue.uuid
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
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.returns(newStubValue);
            deleteBlogDB(req,res,()=>{}).then(result=>{
                expect(res.finalObj.isActive).to.be.equal(false);
                expect(res.finalObj.uuid).to.be.equal(stubValue.uuid);
                expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
});