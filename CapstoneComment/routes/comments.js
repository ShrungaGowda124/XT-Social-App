var express = require("express");
var router = express.Router();
//var commentModel = require("../model/CommentsModel");
const Filter = require("bad-words");
const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();
const comments_db_url = process.env.comment_db_url;
const blogs_db_url = process.env.blogs_db_url;

const filter = new Filter();

router.post("/add", async (req, res, next) => {
  let active = await getStatus(req.body.blogID);
  console.log("isActive: " + JSON.stringify(active));
  if (active.isActive) {
    if (active.isDisabled) {
      const updatedObj = {};
      updatedObj.comment = filter.clean(req.body.comment);
      updatedObj.commentAuthor = req.headers.user_id;
      console.log("we have headers" + JSON.stringify(req.headers));
      console.log("Objec update ", updatedObj);
      axios
        .post(comments_db_url + "create", updatedObj)
        .then(async (response) => {
          console.log("Response from CommentsDB Service :", response.data);

          // res.send(response.data);
          let addCommentRes = await addComment(response.data._id, req.body.blogID);
          console.log("Add comm respo ", addCommentRes);
          if (addCommentRes) {
            //res.send("success");
            res.data = {
              statusCode: 200,
              message: "Success",
              data: {
                comment: response.data.comment,
                commentID: response.data._id
              }
            }
            next();
          } else {
            res.data = {
              statusCode: 500,
              message: "Failure in adding comment",
              data: {}
            }
            next();
          }
        })
        .catch((err) => {
          console.log("Error from DB Service :", err);
          //res.status(500).send(err);
          error = new Error("Server error");
          error.status = 500;
          next(error);
        });
    } else {
      console.log("This action cannot be performed");
      //res.send("Comments is disabled by Blog Author");
      res.data = {
        statusCode: 403,
        message: "Comments is disabled by Blog Author",
        data: {}
      }
      next();
    }
  } else {
    res.data = {
      statusCode: 403,
      message: "Invalid Post",
      data: {}
    }
    next();
  }
});

async function getStatus(blogID) {
  var isDisabled;
  var isActive;
  try {
    var query = {
      uuid: blogID
    };
    console.log("query: ", query);
    blogComments = await axios.post(blogs_db_url + "read", {
      query: query,
    });
    if(blogComments && blogComments.data && blogComments.data.length > 0){
    isDisabled = blogComments.data[0].isInteraction;
    isActive = blogComments.data[0].isActive;
    console.log("from get status function: " + isDisabled);
    }
  } catch (err) {
    console.log("Error in blog db : ", err);
  }
  return { isDisabled, isActive };
}

async function addComment(commentID, blogID) {
  let returnResult = false;
  console.log(blogs_db_url);
  try {
    var query = {
      uuid: blogID,
    };
    console.log("query: ", query);
    let blogComments = await axios.post(blogs_db_url + "read", {
      query: query,
    });
    let comments = blogComments.data[0]["comments"];
    // console.log(blogComments);
    console.log("comments: " + comments);
    comments.push(commentID);
    console.log("comments are: " + comments);
    try {
      const updateQuery = {
        comments: comments,
      };
      const query = {
        uuid: blogID,
      };
      let updateBlog = await axios.post(blogs_db_url + "update", {
        query: query,
        updateQuery: updateQuery,
      });

      returnResult = true;
    } catch (error) {
      console.log("Error Update ", error);
      returnResult = false;
    }
  } catch (err) {
    console.log("Error in blog db : ", err);
    returnResult = false;
  }
  return returnResult;
}

// async function getComment() {
//   var commentId = await commentModel.find({}).sort({_id:-1}).limit(1);
//   console.log("we are having:" + commentId);
//   // let commentID = Number;
//   let res = await axios
//     .post(comments_db_url + "read", commentId)
//       .then(response=>{
//         console.log("comment Id data"+ response.data);
//         // response.data = commentId;
//         // commentID = response.data[0].id;
//       });
//       return commentId[0].id;
// }

router.delete("/delete/:_id", async (req, res, next) => {
  console.log("Inside update api req body : ", req.body);
  const query = {
    _id: req.params._id
  }
  await axios
    .post(comments_db_url + "delete", { query: query },
    )
    .then((response) => {
      console.log("Response from CommentsDB Service :", response.data);
      //res.send(response.data);
      res.data = {
        statusCode: 200,
        message: "Deleted Successfully",
        data: {}
      }
      next();
    })
    .catch((err) => {
      //console.log("Error from CommentsDB Service :", err);
      //res.status(500).send(err);
      error = new Error("Server error");
      error.status = 500;
      next(error);
    });
});

/*router.post("/", (req, res, next) => {
  axios
    .post(comments_db_url + "read", req.body)
    .then(async (response) => {
      console.log("Response from CommentsDB Service :", response.data);
      //res.send(response.data);
      let commentAuthorsArr = [];
      let commentAuthorInfoArr = {};
      response.data.forEach(comment=>{
        commentAuthorsArr.push(comment.commentAuthor);
      });
      console.log("Arra ", commentAuthorsArr);
      commentAuthorInfoArr = await getUsers(commentAuthorsArr);
      console.log("Got Authors : ", commentAuthorInfoArr);
      response.data.forEach(comment=>{
        comment.commentAuthor = commentAuthorInfoArr[comment.commentAuthor];
      });
      res.send(response.data);
    })
    .catch((err) => {
      console.log("Error from CommentsDB Service :", err.data);
      res.status(500).send(err);
    });
});


async function getUsers(commentAuthorsArr)
{
  let commentAuthorInfo = {};
  let res = await axios
      .post(users_db_url + "read",{"query": {"name": commentAuthorsArr}});
      // .then(data => {
      //   console.log("User db response : ", data.data);
      //   data.data.forEach(commentAuthor => {
      //     commentAuthorInfo[commentAuthor.name] = commentAuthor.emailID;
      //   });
      //   console.log("Comment Author Infos : ",commentAuthorInfo);
      //   //resolve(commentAuthorInfo);
      // });
  res.data.forEach(commentAuthor => {
    commentAuthorInfo[commentAuthor.name] = commentAuthor.emailID;
  });
  return commentAuthorInfo;
}*/

router.post("/view", async (req, res, next) => {
  try {
    req.body.populateQuery = {
      path: "commentAuthor",
      select: "name careerStage emailID",
    };
    let comments = await axios.post(comments_db_url + "read", req.body);
    console.log("Comments ", comments.data);
    res.status(200).send(comments.data);
    // comments.forEach(comment => {
    //   comment = await comment.populate
    // });
  } catch (error) {
    res.status(500).send(error);
  }
});

const commentUpdate = async (req, res, next) => {
  try {
    console.log("Inside update api req body : ", req.body);
    const query = {
      _id: req.params._id
    }
    // const updateObject = req.body.updateQuery;
    // updateObject.comment = filter.clean(updateObject.comment);
    const updateQuery = req.body;
    updateQuery.comment = filter.clean(updateQuery.comment);
    let comments = await axios
      .post(comments_db_url + "update", {
        query,
        updateQuery
      })

    console.log("Response from CommentsDB Service :", comments.data);
    //res.send(response.data);
    res.data = {
      statusCode: 200,
      message: "Update Successful",
      data: { comment: comments.data.comment }
    }
    next();
  }
  catch (error) {
    //console.log("Error from CommentsDB Service :", error.);
    //res.status(500).send(err);
    error = new Error("Server error");
    error.status = 500;
    next(error);
    return error;
  };
};
router.put("/update/:_id", commentUpdate);


module.exports = { router, commentUpdate };