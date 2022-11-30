const expect = require('chai').expect;
const readBlogDB = require('../routes/blogsDBRoutes').readBlogDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var blogModel = require("../model/BlogsModel");

describe("Blog DB Service test", ()=>{
    describe("Read operation ", () => {
        it('should read blog db & throws error with statusCode 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(blogModel, 'find');
            blogModel.find.throws();
            readBlogDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            blogModel.find.restore();
        });
        it('should read blog db & throws error with statusCode other than 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(blogModel, 'find');
            let err = new Error("Error");
            err.statusCode = 400;
            blogModel.find.throws(err);
            readBlogDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            blogModel.find.restore();
        });
        it('should read blog db & result be array', (done)=>{
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {}
            };
            //sinon.stub(blogModel, 'find');
            //blogModel.find.returns([]);
            sinon.stub(blogModel, 'find').returns({
                sort: sinon.stub().returns({
                    lean: sinon.stub().returns({
                        populate: sinon.stub().returns([])
                    })
                })
            });
            readBlogDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                done();
            });
            expect(blogModel.find.called).to.be.true;
            blogModel.find.restore();
        });
        it('should read blog db & pass query in request body & get result matching the same', (done)=>{
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
                numOfWords: faker.datatype.number(),
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
                        uuid: stubValue.uuid
                    }
                }
            };
            let newStubValue = {...stubValue};
            delete newStubValue._id;
            sinon.stub(blogModel, 'find').returns({
                sort: sinon.stub().returns({
                    lean: sinon.stub().returns({
                        populate: sinon.stub().returns([
                            newStubValue
                        ])
                    })
                })
            });
            readBlogDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes[0].blogTitle).to.be.equal(stubValue.blogTitle);
                expect(response.finalRes[0].blogTitle).to.be.a('string');
                expect(response.finalRes[0]).to.not.have.property('_id');
                // expect(response.finalRes[0]._id).to.be.a('string');
                expect(response.finalRes[0].uuid).to.be.equal(stubValue.uuid);
                expect(response.finalRes[0].uuid).to.be.a('string');
                expect(response.finalRes[0].blogAuthor).to.be.equal(stubValue.blogAuthor);
                expect(response.finalRes[0].blogAuthor).to.be.a('string');
                expect(response.finalRes[0].blogPublishTimeStamp).to.be.equal(stubValue.blogPublishTimeStamp);
                expect(response.finalRes[0].blogPublishTimeStamp).to.be.a('date');
                expect(response.finalRes[0].isActive).to.be.equal(stubValue.isActive);
                expect(response.finalRes[0].isActive).to.be.a('boolean');
                expect(response.finalRes[0].isInteraction).to.be.equal(stubValue.isInteraction);
                expect(response.finalRes[0].isInteraction).to.be.a('boolean');
                expect(response.finalRes[0].numOfWords).to.be.equal(stubValue.numOfWords);
                expect(response.finalRes[0].numOfWords).to.be.a('number');
                expect(response.finalRes[0].createdAt).to.be.equal(stubValue.createdAt);
                expect(response.finalRes[0].createdAt).to.be.a('date');
                expect(response.finalRes[0].updatedAt).to.be.equal(stubValue.updatedAt);
                expect(response.finalRes[0].updatedAt).to.be.a('date');
                
                expect(response.finalRes[0].blogDescription).to.be.an('array');
                expect(response.finalRes[0].comments).to.be.an('array');
                expect(response.finalRes[0].usersApplauded).to.be.an('array');
                expect(response.finalRes[0].usersShared).to.be.an('array');
                done();
            });
            expect(blogModel.find.called).to.be.true;
            blogModel.find.restore();
        });
        it('should read blog db & pass query in request body & get result no matching the same', (done)=>{
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
                numOfWords: faker.datatype.number(),
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
                        uuid: faker.datatype.uuid()
                    }
                }
            };
            sinon.stub(blogModel, 'find').returns({
                sort: sinon.stub().returns({
                    lean: sinon.stub().returns({
                        populate: sinon.stub().returns([])
                    })
                })
            });
            //blogModel.find.returns([]);
            readBlogDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes.length).to.be.equal(0);
                done();
            });
            expect(blogModel.find.called).to.be.true;
            blogModel.find.restore();
        });
        it('should read blog db & pass query & populate query in request body & get result with corresponding information', (done)=>{
            const stubValue = {
                blogTitle: faker.datatype.string(),
                blogDescription: [],
                blogAuthor: {
                    name: faker.name.fullName(),
                    emailID: faker.internet.email(),
                    careerStage: faker.datatype.string()
                },
                isInteraction: faker.datatype.boolean(),
                isActive: true,
                usersShared: [
                    {
                        name: faker.name.fullName(),
                        emailID: faker.internet.email(),
                        careerStage: faker.datatype.string()
                    }
                ],
                usersApplauded: [
                    {
                        name: faker.name.fullName(),
                        emailID: faker.internet.email(),
                        careerStage: faker.datatype.string()
                    }
                ],
                blogPublishTimeStamp: faker.date.past(),
                comments: [
                    {
                        comment: faker.datatype.string(),
                        commentAuthor: {
                            name: faker.name.fullName(),
                            emailID: faker.internet.email(),
                            careerStage: faker.datatype.string()
                        }
                    }
                ],
                uuid: faker.datatype.uuid(),
                numOfWords: faker.datatype.number(),
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
                        "uuid": stubValue.uuid
                    },
                    "populateQuery": [
                        {
                            "path": "blogAuthor usersShared usersApplauded",
                            "select": "name emailID careerStage -_id"
                        },
                        {
                            "path": "comments",
                            "select": "comment commentAuthor -_id",
                            "populate": {
                                "path": "commentAuthor",
                                "select": "name emailID careerStage -_id"
                            }
                        }
                    ]
                }
            };
            sinon.stub(blogModel, 'find').returns({
                sort: sinon.stub().returns({
                    lean: sinon.stub().returns({
                        populate: sinon.stub().returns([stubValue])
                    })
                })
            });
            //blogModel.find.returns([]);
            readBlogDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes[0].blogTitle).to.be.equal(stubValue.blogTitle);
                expect(response.finalRes[0].blogTitle).to.be.a('string');
                expect(response.finalRes[0]).to.not.have.property('_id');
                expect(response.finalRes[0].uuid).to.be.equal(stubValue.uuid);
                expect(response.finalRes[0].uuid).to.be.a('string');
                expect(response.finalRes[0].blogAuthor).to.be.equal(stubValue.blogAuthor);
                expect(response.finalRes[0].blogAuthor).to.be.a('object');
                expect(response.finalRes[0].blogPublishTimeStamp).to.be.equal(stubValue.blogPublishTimeStamp);
                expect(response.finalRes[0].blogPublishTimeStamp).to.be.a('date');
                expect(response.finalRes[0].isActive).to.be.equal(stubValue.isActive);
                expect(response.finalRes[0].isActive).to.be.a('boolean');
                expect(response.finalRes[0].isInteraction).to.be.equal(stubValue.isInteraction);
                expect(response.finalRes[0].isInteraction).to.be.a('boolean');
                expect(response.finalRes[0].numOfWords).to.be.equal(stubValue.numOfWords);
                expect(response.finalRes[0].numOfWords).to.be.a('number');
                expect(response.finalRes[0].createdAt).to.be.equal(stubValue.createdAt);
                expect(response.finalRes[0].createdAt).to.be.a('date');
                expect(response.finalRes[0].updatedAt).to.be.equal(stubValue.updatedAt);
                expect(response.finalRes[0].updatedAt).to.be.a('date');
                
                expect(response.finalRes[0].blogDescription).to.be.an('array');
                expect(response.finalRes[0].comments).to.be.an('array');
                expect(response.finalRes[0].usersApplauded).to.be.an('array');
                expect(response.finalRes[0].usersShared).to.be.an('array');

                
                expect(response.finalRes[0].blogAuthor).to.not.have.property('_id');
                expect(response.finalRes[0].blogAuthor).to.have.property('name');
                expect(response.finalRes[0].blogAuthor).to.have.property('emailID');
                expect(response.finalRes[0].blogAuthor).to.have.property('careerStage');
                
                expect(response.finalRes[0].usersShared[0]).to.not.have.property('_id');
                expect(response.finalRes[0].usersShared[0]).to.have.property('name');
                expect(response.finalRes[0].usersShared[0]).to.have.property('emailID');
                expect(response.finalRes[0].usersShared[0]).to.have.property('careerStage');

                expect(response.finalRes[0].usersApplauded[0]).to.not.have.property('_id');
                expect(response.finalRes[0].usersApplauded[0]).to.have.property('name');
                expect(response.finalRes[0].usersApplauded[0]).to.have.property('emailID');
                expect(response.finalRes[0].usersApplauded[0]).to.have.property('careerStage');

                expect(response.finalRes[0].comments[0]).to.not.have.property('_id');
                expect(response.finalRes[0].comments[0]).to.have.property('comment');
                expect(response.finalRes[0].comments[0]).to.have.property('commentAuthor');

                expect(response.finalRes[0].comments[0].commentAuthor).to.not.have.property('_id');
                expect(response.finalRes[0].comments[0].commentAuthor).to.have.property('name');
                expect(response.finalRes[0].comments[0].commentAuthor).to.have.property('emailID');
                expect(response.finalRes[0].comments[0].commentAuthor).to.have.property('careerStage');
                done();
            });
            expect(blogModel.find.called).to.be.true;
            blogModel.find.restore();
        });
    });
});