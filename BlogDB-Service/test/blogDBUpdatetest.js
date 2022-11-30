const expect = require('chai').expect;
const updateBlogDB = require('../routes/blogsDBRoutes').updateBlogDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var blogModel = require("../model/BlogsModel");

describe('Blog DB Update Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    uuid: faker.datatype.uuid()
                },
                updateQuery: {
                    isInteraction: false
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
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
                },
                updateQuery: {
                    isInteraction: false
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
        let err = new Error("Error");
        err.statusCode = 400;
            blogModel.findOneAndUpdate.throws(err);
            updateBlogDB(req,{},()=>{}).then(result=>{
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
            updateBlogDB(req,{},()=>{}).then(result=>{
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
            updateBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty updateQuery in request',(done) => {
        let req = {
            body: {
                updateQuery: {}
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for no query but updateQuery object in request',(done) => {
        let req = {
            body: {
                updateQuery: {
                    "isInteraction": true
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for query but no updateQuery object in request',(done) => {
        let req = {
            body: {
                query: {
                    uuid: faker.datatype.uuid()
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
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
                },
                updateQuery: {
                    isInteraction: true
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.returns(null);
            updateBlogDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for number passed in isActive/isInteraction property value as passed in updateQuery for matching query in request',(done) => {
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
                },
                updateQuery: {
                    usersShared: [faker.datatype.uuid()],
                    isActive: 123,
                    isInteraction: 456
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for string passed in isActive/isInteraction property value as passed in updateQuery for matching query in request',(done) => {
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
                },
                updateQuery: {
                    usersShared: [faker.datatype.uuid()],
                    isActive: "test str",
                    isInteraction: "test str"
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should throw error for string passed in numOfWords property value as passed in updateQuery for matching query in request',(done) => {
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
                },
                updateQuery: {
                    numOfWords: "test str"
                }
            }
        }
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.throws();
            updateBlogDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
    it('should change the object property value as passed in updateQuery for matching query in request',(done) => {
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
                },
                updateQuery: {
                    isInteraction: true,
                    isActive: false,
                    numOfWords: 12,
                    comments: [faker.datatype.uuid()]
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
        sinon.stub(blogModel, 'findOneAndUpdate');
            blogModel.findOneAndUpdate.returns(newStubValue);
            updateBlogDB(req,res,()=>{}).then(result=>{
                //console.log();
                for(let keys in req.body.updateQuery){
                    expect(res.finalObj[keys]).to.be.equal(req.body.updateQuery[keys]);
                }
                expect(res.finalObj._id).to.be.equal(stubValue._id);
                // expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            blogModel.findOneAndUpdate.restore();
    });
});