const expect = require('chai').expect;
const updateUserDB = require('../routes/usersDBRoute').updateUserDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var userModel = require("../model/UsersModel");

describe('User DB Update Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    email: 'test@12.com'
                },
                updateQuery: {
                    careerStage: 'new stage'
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error other than 500', (done) => {
        let req = {
            body: {
                query: {
                    email: 'test@12.com'
                },
                updateQuery: {
                    careerStage: 'new stage'
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
        err = new Error("Test");
        err.statusCode = 400
            userModel.findOneAndUpdate.throws(err);
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty request',(done) => {
        let req = {
            body: {}
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty query in request',(done) => {
        let req = {
            body: {
                query: {}
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for empty updateQuery in request',(done) => {
        let req = {
            body: {
                updateQuery: {}
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for no query but updateQuery object in request',(done) => {
        let req = {
            body: {
                updateQuery: {
                    "careerStage": "newPos"
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for query but no updateQuery object in request',(done) => {
        let req = {
            body: {
                query: {
                    "_id": "Test"
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('Empty request');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 403);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for no matching query in request',(done) => {
        let req = {
            body: {
                query: {
                    _id: "123"
                },
                updateQuery: {
                    careerStage: "new POS"
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.returns(null);
            updateUserDB(req,{},()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for number passed in isActive property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: faker.internet.email(),
            careerStage: "AL2",
            isActive: true,
            createdBy: faker.name.fullName(),
            ipAddress: "",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    careerStage: "SAL1",
                    isActive: 123
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should throw error for string passed in isActive property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: faker.internet.email(),
            careerStage: "AL2",
            isActive: true,
            createdBy: faker.name.fullName(),
            ipAddress: "",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    careerStage: "SAL1",
                    isActive: "Test string"
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            updateUserDB(req,{},()=>{}).then(result=>{
                //console.log();
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should change the object property value as passed in updateQuery for matching query in request',(done) => {
        const stubValue = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: faker.internet.email(),
            careerStage: "AL2",
            isActive: true,
            createdBy: faker.name.fullName(),
            ipAddress: "",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let req = {
            body: {
                query: {
                    _id: stubValue._id
                },
                updateQuery: {
                    careerStage: "SAL1",
                    isActive: false
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
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.returns(newStubValue);
            updateUserDB(req,res,()=>{}).then(result=>{
                //console.log();
                for(let keys in req.body.updateQuery){
                    expect(res.finalObj[keys]).to.be.equal(req.body.updateQuery[keys]);
                }
                expect(res.finalObj._id).to.be.equal(stubValue._id);
                // expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
});