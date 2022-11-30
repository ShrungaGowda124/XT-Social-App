const expect = require('chai').expect;
const sinon = require('sinon');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const proxy = require('express-http-proxy');
const MicroServices = require('../router/config.json');
var jwt = require('jsonwebtoken');
const { checkServices, getServer, validateToken } = require('../router');
const { deleteOne } = require('../../CommentDB-Service/model/UsersModel');
const dotenv = require('dotenv');
dotenv.config();
const users_db_url = process.env.users_db_url;
const CAPSTONESECRETKEY = process.env.CAPSTONESECRETKEY;

describe('Gateway Test Cases ', ()=>{
    it('should throw 404 Microservice not found', ()=>{
        let req = {
            params: {
                service: faker.datatype.string
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let res = checkServices(req, response, ()=>{});
        expect(response).to.have.property('statusCode', 404);
        expect(response).to.have.property('data');
        expect(response.data).to.have.property('message', "Microservice not found");
    });
    it('should not throw 404 Microservice not found', ()=>{
        let req = {
            params: {
                service: "users"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let res = checkServices(req, response, ()=>{});
        expect(res).to.be.equal(undefined);
    });
    it('should pass next Microservice -> users', ()=>{
        let req = {
            params: {
                service: "users"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let res = getServer(req.params.service);
        expect(res).to.have.property('path', "/"+req.params.service);
        expect(res).to.have.property('url');
        //console.log("Res ", res);
    });
    it('should pass next Microservice -> blogs', ()=>{
        let req = {
            params: {
                service: "blogs"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        //let res = checkServices(req, response, ()=>{});
        let res = getServer(req.params.service);
        expect(res).to.have.property('path', "/"+req.params.service);
        expect(res).to.have.property('url');
        // console.log("Res ", res);
    });
    it('should pass next Microservice -> comments', ()=>{
        let req = {
            params: {
                service: "comments"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let res = getServer(req.params.service);
        expect(res).to.have.property('path', "/"+req.params.service);
        expect(res).to.have.property('url');
        // console.log("Res ", res);
    });
    it('should pass validation for users path', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/users']
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let result = await validateToken(req, response, ()=>{});
        expect(result).to.be.equal(undefined);
    });
    it('should not pass validation for blogs path as authorization hearder not provided', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/blogs']
            },
            headers: {}
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let result = await validateToken(req, response, ()=>{});
        expect(response.data).to.have.property('message', 'Unauthorized');
        expect(response).to.have.property('statusCode', 401);
    });
    it('should not pass validation for comments path as authorization hearder not provided', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/comments']
            },
            headers: {}
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        }
        let result = await validateToken(req, response, ()=>{});
        expect(response.data).to.have.property('message', 'Unauthorized');
        expect(response).to.have.property('statusCode', 401);
    });
    it('should not pass validation for comments/blogs path as authorization hearder token expired', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/comments', '/blogs']
            },
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOiIyMDIyLTA5LTEzVDE5OjA1OjMzLjExOFoiLCJpYXQiOiIyMDIyLTA5LTEyVDE5OjA1OjMzLjExOFoiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.bjiaidOcQb6LfOsVV857WIY4Y3y04jSV98r4yNe2He0"
            }
        };
        
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        };
    
        err = new Error('jwt expired')
        sinon.stub(jwt, 'verify').yields(err, null);
        //sinon.stub(axios, 'post').resolves(resfromAxios);
        let result = await validateToken(req, response, ()=>{});
        expect(response.data).to.have.property('message', 'jwt expired');
        expect(response).to.have.property('statusCode', 401);
        jwt.verify.restore();
    });
    it('should pass validation for comments/blogs path as authorization hearder token is fine but axios gives error', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/comments', '/blogs']
            },
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpc2hhYmgudmFyc2huZXlAcHVibGljaXNzYXBpZW50LmNvbSIsImlhdCI6MTY2Mjg0MTQ0OSwiZXhwIjoxNjYyODQ1MDQ5fQ.ZgmrorzrdDQ5VH4DjGTlCheSaH2N47c0_hszxiLALo8"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        };
        const decodedJWT = {
            "iat": "2022-09-12T19:05:33.118Z",
            "exp": "2022-09-13T19:05:33.118Z",
            "email": "test@test.com"
        };
        const stubValueUser = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: decodedJWT.email,
            careerStage: "AL2",
            isActive: faker.datatype.boolean(),
            createdBy: faker.name.fullName(),
            ipAddress: "localhost",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let resfromAxios = {
            data: [
                stubValueUser
            ]
        }
        err = new Error('Internal Server Error')
        sinon.stub(jwt, 'verify').yields(null, decodedJWT);
        sinon.stub(axios, 'post').rejects(err);
        let result = await validateToken(req, response, ()=>{});
        expect(response.data).to.have.property('message', 'Internal Server Error');
        expect(response).to.have.property('statusCode', 401);
        jwt.verify.restore();
        axios.post.restore();
    });
    it('should pass validation for comments/blogs path as authorization hearder token is fine but axios gives 0 results', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/comments', '/blogs']
            },
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpc2hhYmgudmFyc2huZXlAcHVibGljaXNzYXBpZW50LmNvbSIsImlhdCI6MTY2Mjg0MTQ0OSwiZXhwIjoxNjYyODQ1MDQ5fQ.ZgmrorzrdDQ5VH4DjGTlCheSaH2N47c0_hszxiLALo8"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        };
        const decodedJWT = {
            "iat": "2022-09-12T19:05:33.118Z",
            "exp": "2022-09-13T19:05:33.118Z",
            "email": "test@test.com"
        };
        const stubValueUser = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: decodedJWT.email,
            careerStage: "AL2",
            isActive: faker.datatype.boolean(),
            createdBy: faker.name.fullName(),
            ipAddress: "localhost",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let resfromAxios = {
            data: []
        }
        sinon.stub(jwt, 'verify').yields(null, decodedJWT);
        sinon.stub(axios, 'post').resolves(resfromAxios);
        let result = await validateToken(req, response, ()=>{});
        expect(response.data).to.have.property('message', 'Unauthorized');
        expect(response).to.have.property('statusCode', 401);
        jwt.verify.restore();
        axios.post.restore();
    });
    it('should pass validation for comments/blogs path as authorization hearder token is fine', async ()=> {
        let req = {
            _parsedUrl: {
                path: ['/comments', '/blogs']
            },
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpc2hhYmgudmFyc2huZXlAcHVibGljaXNzYXBpZW50LmNvbSIsImlhdCI6MTY2Mjg0MTQ0OSwiZXhwIjoxNjYyODQ1MDQ5fQ.ZgmrorzrdDQ5VH4DjGTlCheSaH2N47c0_hszxiLALo8"
            }
        };
        let response = {
            statusCode: 500,
            data: {},
            status: function (val) {
                this.statusCode = val;
            },
            send: function(datav){
                this.data = datav;
            }
        };
        const decodedJWT = {
            "iat": "2022-09-12T19:05:33.118Z",
            "exp": "2022-09-13T19:05:33.118Z",
            "email": "test@test.com"
        };
        const stubValueUser = {
            _id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            emailID: decodedJWT.email,
            careerStage: "AL2",
            isActive: faker.datatype.boolean(),
            createdBy: faker.name.fullName(),
            ipAddress: "localhost",
            createdAt: faker.date.past(),
            updatedAt: faker.date.past()
          };
        let resfromAxios = {
            data: [
                stubValueUser
            ]
        }
        sinon.stub(jwt, 'verify').yields(null, decodedJWT);
        sinon.stub(axios, 'post').resolves(resfromAxios);
        let result = await validateToken(req, response, ()=>{});
        // expect(response.data).to.have.property('message', 'Unauthorized');
        expect(result).to.be.equal(undefined);
        jwt.verify.restore();
        axios.post.restore();
    });
});
