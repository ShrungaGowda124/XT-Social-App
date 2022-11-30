const express = require('express');
const router = express.Router();
//var BlogsModel = require("../model/BlogsModel")
//var jwt = require('jsonwebtoken');
const axios = require('axios').default;
const dotenv = require("dotenv");
dotenv.config();
const blogs_db_url = process.env.blogs_db_url


router.post('/', (req, res, next) => {


    const query = {
        "uuid": req.body.blogID
    }

    console.log("query: ", query)
    axios.post(blogs_db_url + "read", { query: query })
        .then((response) => {
            console.log("response:", response.data);
            if(response.data.length > 0){
            var status = response.data[0].isInteraction;
            if (status) {
                let usersShared = response.data[0]["usersShared"] //?response.data.usersApplauded:[] ;
                if (!usersShared.includes(req.headers["user_id"])) {
                    usersShared.push(req.headers["user_id"])

                    const updateQuery = {
                        usersShared
                    }

                    axios.post(blogs_db_url + "update", { query, updateQuery })
                        .then(updatedBlogShared => {
                            console.log("updated blog response", updatedBlogShared.data)
                            //res.send("Shared successfully")
                            res.data = {
                                statusCode: 200,
                                message: "Shared Successfully",
                                data: {}
                              }
                              next();
                        })
                        .catch(
                            (err) => {
                                console.log("Blog of this ID does not exist");
                                //res.status(500).send(err);
                                error = new Error("Server error");
                                error.status = 500;
                                next(error);
                            })
                } else {
                    //res.send("Shared successfully");
                    res.data = {
                        statusCode: 200,
                        message: "Shared Successfully",
                        data: {}
                      }
                      next();
                }
            } else {
                //res.send("Share is disabled by Blog Author")
                res.data = {
                    statusCode: 403,
                    message: "Sharing is disabled by Blog Author",
                    data: {}
                  }
                  next();
            }
        }
            else{
                error = new Error("No blogs found");
                          error.status = 400;
                          next(error);
              }
        })
});



module.exports = router;
