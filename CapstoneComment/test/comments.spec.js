const expect = require("chai").expect;
const commentUpdate = require("../routes/comments").commentUpdate;

const sinon = require("sinon");
const { faker } = require("@faker-js/faker");

const axios = require("axios").default;

describe("Comment Update Test", () => {
    describe("Update Operation", () => {
        it("should throw error with status code 500", async () => {
            let req = {
                body: {}
            };

            sinon.stub(axios, 'post');
            axios.post.throws();
            let result = await commentUpdate(req, {}, () => { })
            // console.log("result will be: " + result);
            expect(result).to.be.an('error');
            expect(result).to.have.property('status', 500);
            axios.post.restore();
        });
        it("should be updating the comment object", async () => {
            const stubValue = {
                _id: faker.datatype.uuid(),
                comment: faker.datatype.string(),
            }
            const axiosObject = {
                data: stubValue
            }
            let response = {
                data: {}

            }
            let req = {
                body: {
                    comment: stubValue.comment
                },
                params: {
                    _id: stubValue._id
                }

            }
            sinon.stub(axios, 'post');
            console.log("Axios Object: " + JSON.stringify(axiosObject));
            axios.post.returns(axiosObject);
            await commentUpdate(req, response, () => { })
            console.log("Response of this: " + JSON.stringify(response));
            expect(response.data).to.have.property('statusCode', 200);
            expect(response.data).to.have.property('message', 'Update Successful');
            expect(response.data.data).to.have.property('comment', stubValue.comment);
            axios.post.restore();
        });
    });
});

