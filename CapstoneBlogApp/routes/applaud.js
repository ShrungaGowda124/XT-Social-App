const express = require('express');
const router = express.Router();
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
      console.log("response:", response.data)
      if(response.data.length > 0){
      var BlogAuthor = response.data[0].blogAuthor;
      if (BlogAuthor != req.headers["user_id"]) {

        var status = response.data[0].isInteraction;
        if (status) {
          let usersApplauded = response.data[0]["usersApplauded"] //?response.data.usersApplauded:[] ;

          if (!usersApplauded.includes(req.headers["user_id"])) {
            usersApplauded.push(req.headers["user_id"]);

            const updateQuery = {
              usersApplauded
            }

            axios.post(blogs_db_url + "update", { query, updateQuery })
              .then(updatedBlogApllaud => {
                console.log("updated blog response", updatedBlogApllaud.data)
                //res.send("Applaud Successfull");
                res.data = {
                  statusCode: 200,
                  message: "Applauded Successfully",
                  data: {}
                }
                next();
              })
              .catch(
                (err) => {
                  console.log("Blog of this ID does not exist");
                  //res.status(404).send("Blog of this ID does not exist");
                  error = new Error("Server error");
                  error.status = 500;
                  next(error);
                }
              );
          } else {
            //res.send("Applauded successfully")
            res.data = {
              statusCode: 200,
              message: "Applauded Successfully",
              data: {}
            }
            next();
          }
        } else {
          //res.send("Appluad is disabled by Blog Author")
          res.data = {
            statusCode: 403,
            message: "Appluad is disabled by Blog Author",
            data: {}
          }
          next();
        }
      }
      else{
        //res.send("author cannot applaud his blogs")
        res.data = {
          statusCode: 403,
          message: "Author cannot applaud his blogs",
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
