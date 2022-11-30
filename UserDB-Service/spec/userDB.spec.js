var axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();
const users_db_url = process.env.users_db_url;

describe("User DB Service", ()=>{
    describe("read operation - user details", ()=>{
        it("returns status code 200", async ()=>{
            let response = await axios.post(users_db_url+"/read", {});
            //console.log("Req1111");
            expect(response.status).toBe(200);
        });
    });
    describe("create operation - user ", ()=>{
        it("returns status 200 ", async ()=>{
            let obj = {
                "emailID": "test11@123.com",
                "name": "test11",
                "careerStage": "AL1"
            };
            let response = await axios.post(users_db_url+"/create", obj);
            expect(response.status).toBe(200);
            //console.log("Req1");
        });
        it("returns status 500 ", async ()=>{
            let obj = {
                "emailID": "test11@123.com",
                "name": "test11",
                "careerStage": "AL1"
            };
            try {
                let response = await axios.post(users_db_url+"/create", obj);
                //console.log("Erro 500 ", response);
                //console.log("Req21");
            } catch (error) {
                //console.log("Req22");
                expect(error.response.status).toBe(500);
            }
        });
    });
});