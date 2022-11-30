const expect = require('chai').expect;
const deleteUserDB = require('../routes/usersDBRoute').deleteUserDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var userModel = require("../model/UsersModel");

describe('User DB Delete Function', () => {
    it('should throw error', (done) => {
        let req = {
            body: {
                query: {
                    email: 'test@12.com'
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.throws();
            deleteUserDB(req,{},()=>{}).then(result=>{
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
                }
            }
        }
        sinon.stub(userModel, 'findOneAndUpdate');
        err = new Error("Error");
        err.statusCode = 400;
            userModel.findOneAndUpdate.throws(err);
            deleteUserDB(req,{},()=>{}).then(result=>{
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
            deleteUserDB(req,{},()=>{}).then(result=>{
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
            deleteUserDB(req,{},()=>{}).then(result=>{
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
                    name: "123"
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
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.returns(null);
            deleteUserDB(req,res,()=>{}).then(result=>{
                expect(result.message).to.be.equal('No matching query');
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 400);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
    it('should change isActive to true for matching query in request',(done) => {
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
        sinon.stub(userModel, 'findOneAndUpdate');
            userModel.findOneAndUpdate.returns(newStubValue);
            deleteUserDB(req,res,()=>{}).then(result=>{
                expect(res.finalObj.isActive).to.be.equal(false);
                expect(res.finalObj._id).to.be.equal(stubValue._id);
                expect(stubValue.isActive).to.be.equal(true);
                done();
            });
            userModel.findOneAndUpdate.restore();
    });
});