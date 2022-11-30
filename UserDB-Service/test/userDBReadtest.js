const expect = require('chai').expect;
const readUserDB = require('../routes/usersDBRoute').readUserDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var userModel = require("../model/UsersModel");

describe("User DB Service test", ()=>{
    describe("Read operation ", () => {
        it('should read user db & throws error with statusCode 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(userModel, 'find');
            userModel.find.throws();
            readUserDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            userModel.find.restore();
        });
        it('should read user db & throws error with statusCode other than 500', (done)=>{
        
            let req = {
                body: {}
            };
            sinon.stub(userModel, 'find');
            err = new Error("Error");
            err.statusCode = 400;
            userModel.find.throws(err);
            readUserDB(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 400);
                done();
            });
            userModel.find.restore();
        });
        it('should read user db & result be array', (done)=>{
            let response = {
                finalRes: {},
                send: function(value){
                    this.finalRes=value;
                }
            };
            let req = {
                body: {}
            };
            sinon.stub(userModel, 'find');
            userModel.find.returns([]);
            readUserDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                done();
            });
            expect(userModel.find.called).to.be.true;
            userModel.find.restore();
        });
        it('should read user db & pass query in request body & get result matching the same', (done)=>{
            const stubValue = {
                _id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                emailID: faker.internet.email(),
                careerStage: "AL2",
                isActive: faker.datatype.boolean(),
                createdBy: faker.name.fullName(),
                ipAddress: "",
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
                        emailID: stubValue.emailID
                    }
                }
            };
            sinon.stub(userModel, 'find');
            userModel.find.returns([
                stubValue
            ]);
            readUserDB(req,response,()=>{}).then(result=>{
                expect(response.finalRes).to.be.an('array');
                expect(response.finalRes[0].emailID).to.be.equal(stubValue.emailID);
                expect(response.finalRes[0].emailID).to.be.a('string');
                expect(response.finalRes[0]._id).to.be.equal(stubValue._id);
                expect(response.finalRes[0]._id).to.be.a('string');
                expect(response.finalRes[0].name).to.be.equal(stubValue.name);
                expect(response.finalRes[0].name).to.be.a('string');
                expect(response.finalRes[0].careerStage).to.be.equal(stubValue.careerStage);
                expect(response.finalRes[0].careerStage).to.be.a('string');
                expect(response.finalRes[0].isActive).to.be.equal(stubValue.isActive);
                expect(response.finalRes[0].isActive).to.be.a('boolean');
                expect(response.finalRes[0].createdAt).to.be.equal(stubValue.createdAt);
                expect(response.finalRes[0].createdAt).to.be.a('date');
                expect(response.finalRes[0].updatedAt).to.be.equal(stubValue.updatedAt);
                expect(response.finalRes[0].updatedAt).to.be.a('date');
                expect(response.finalRes[0].createdBy).to.be.equal(stubValue.createdBy);
                expect(response.finalRes[0].createdBy).to.be.a('string');
                expect(response.finalRes[0].ipAddress).to.be.equal(stubValue.ipAddress);
                expect(response.finalRes[0].ipAddress).to.be.a('string');
                done();
            });
            expect(userModel.find.called).to.be.true;
            userModel.find.restore();
        });
    });
    it('should read user db & pass query in request body & get result no matching the same', (done)=>{
        const stubValue = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: faker.internet.email(),
            careerStage: "AL2",
            isActive: faker.datatype.boolean(),
            createdBy: faker.name.fullName(),
            ipAddress: "",
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
                    emailID: "random@123.com"
                }
            }
        };
        sinon.stub(userModel, 'find');
        userModel.find.returns([]);
        readUserDB(req,response,()=>{}).then(result=>{
            expect(response.finalRes).to.be.an('array');
            expect(response.finalRes.length).to.be.equal(0);
            done();
        });
        expect(userModel.find.called).to.be.true;
        userModel.find.restore();
    });
    
});