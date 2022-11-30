const expect = require('chai').expect;
const createUserDB = require('../routes/usersDBRoute').createUserDB;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
var userModel = require("../model/UsersModel");

describe('User DB Service Create Test Cases', () => {
    it('should throw error 500', async () => {
        let req = {
            body: {
                emailID: faker.internet.email(),
                name: "test",
                careerStage: "AL2"
            }
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res).to.be.an('error');
        expect(res).to.have.property('statusCode', 500);
        userModel.create.restore();
    });
    it('should throw error other than 500', async () => {
        let req = {
            body: {
                emailID: faker.internet.email(),
                name: "test",
                careerStage: "AL2"
            }
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        err = new Error("Error");
        err.statusCode = 400;
        userModel.create.throws(err);
        let res = await createUserDB(req, {}, ()=>{});
        expect(res).to.be.an('error');
        expect(res).to.have.property('statusCode', 400);
        userModel.create.restore();
    });
    it('should throw error for empty request', async () => {
        let req = {};
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        userModel.create.restore();
    });
    it('should throw error for empty request body', async () => {
        let req = {
            body: {}
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        userModel.create.restore();
    });
    it('should throw error for no name in request', async () => {
        let req = {
            body: {
                emailID: "test@123.com",
                careerStage: "AL2"
            }
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        userModel.create.restore();
    });
    it('should throw error for no emailID in request', async () => {
        let req = {
            body: {
                name: "test",
                careerStage: "AL2"
            }
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        userModel.create.restore();
    });
    it('should throw error for no careerStage in request', async () => {
        let req = {
            body: {
                emailID: "test@123.com",
                name: "test"
            }
        };
        //const saveObj = new userModel(req);
        sinon.stub(userModel, 'create');
        userModel.create.throws();
        let res = await createUserDB(req, {}, ()=>{});
        expect(res.message).to.be.equal('Missing properties in request');
        expect(res).to.be.an('error');
        expect(res).to.have.property('status', 403);
        userModel.create.restore();
    });
    it('should throw error for Duplicate request', async () => {
        let objArray = [];
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
        objArray.push(stubValue);
        let req = {
            body: {
                emailID: stubValue.emailID,
                name: "test",
                careerStage: "AL2"
            }
        };
        sinon.stub(userModel, 'create');
        for(let obj of objArray){
            if(obj.emailID === req.body.emailID){
                userModel.create.throws();
                let res = await createUserDB(req, {}, ()=>{});
                expect(res).to.be.an('error');
                expect(res).to.have.property('statusCode', 500);
            }
        }
        userModel.create.restore();
    });
    it("should create user in DB from the given email, name & careerStage with all default values", (done) => {
        let req = {
            body: {
                name: faker.name.fullName(),
                emailID: faker.internet.email(),
                careerStage: "AL2"
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
            name: req.body.name,
            emailID: req.body.emailID,
            careerStage: req.body.careerStage,
            isActive: true,
            createdBy: "csv",
            ipAddress: "localhost",
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
        sinon.stub(userModel, 'create');
        userModel.create.returns(stubValue);
        createUserDB(req, response, () => { }).then(result => {
            console.log("Result  ", response);
            expect(response.data.emailID).to.be.equal(req.body.emailID);
            expect(response.data.emailID).to.be.a('string');
            expect(response.data._id).to.be.equal(stubValue._id);
            expect(response.data._id).to.be.a('string');
            expect(response.data.name).to.be.equal(req.body.name);
            expect(response.data.name).to.be.a('string');
            expect(response.data.careerStage).to.be.equal(req.body.careerStage);
            expect(response.data.careerStage).to.be.a('string');
            expect(response.data.isActive).to.be.equal(true);
            expect(response.data.isActive).to.be.a('boolean');
            // expect(response.data.createdAt).to.be.equal(Date.now());
            // expect(response.data.createdAt).to.be.a('date');
            //expect(response.data.updatedAt).to.be.equal(Date.now());
            // expect(response.data.updatedAt).to.be.a('date');
            expect(response.data.createdBy).to.be.equal("csv");
            expect(response.data.createdBy).to.be.a('string');
            expect(response.data.ipAddress).to.be.equal("localhost");
            expect(response.data.ipAddress).to.be.a('string');
            done();
        });
        userModel.create.restore();
    });
});