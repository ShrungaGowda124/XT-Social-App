var express = require("express");
var router = express.Router();
var commentModel = require("../model/CommentsModel");

/* GET users listing. */
const readCommentDB =  async (req, res, next) => {
  console.log("Comments DB Inside Read request : ", req.body);
  let query = {};
  if (req.body.query) {
    query = req.body.query;
  }
  let populateQuery;
  if(req.body.populateQuery){
    populateQuery = req.body.populateQuery;
  } 
  console.log("Query for read Comments DB : ", query);
  //{path: 'commentAuthor', select: 'name careerStage emailID'}
  console.log("Populate : ", populateQuery);
  try{
  var users = await commentModel.find(query).populate(populateQuery);
  res.send(users);
  return;
  }
  catch (err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
router.post("/read", readCommentDB);

const createCommentDB = async (req, res, next) => {
  console.log("Comments DB Inside Create req : ", req.body);

  if(!req.body || JSON.stringify(req.body)=='{}' || !req.body.comment || !req.body.commentAuthor){
    error = new Error("Missing properties in request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  // const postBody = new commentModel(req.body);
  // await postBody.save((err) => {
  //   if (err) {
  //     console.log("Error in Create Comments DB : ", err);
  //     return res.status(500).send(err);
  //   } else {
  //     console.log("Success Create Comments DB Service");
  //     return res.status(200).send(postBody);
  //   }
  // });
  let commentSaved = await commentModel.create(req.body);
  res.status(200);
  res.send(commentSaved);
  return;
  }
  catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
router.post("/create", createCommentDB);

const updateCommentDB = async (req, res, next) => {
  console.log("Comments DB Inside Update req : ", req.body);
  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}' || JSON.stringify(req.body?.updateQuery)=='{}' || !req.body.query || !req.body.updateQuery){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersUpdate = await commentModel.findOneAndUpdate(
    req.body.query,
    req.body.updateQuery, {new: true}
  );
  if (usersUpdate) {
  res.send(usersUpdate);
  }
  else {
    //res.status(400).json({message: "No matching query"});
    error = new Error("No matching query");
    error.status = 400;
    next(error);
    return error;
  }
    return;
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
router.post("/update", updateCommentDB);

const deleteCommentDB = async (req, res, next) => {
  console.log("Comments DB Inside Delete req : ", req.body);

  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}'){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersDeleted = await commentModel.findOneAndUpdate(req.body.query, {
    isActive: false,
  }, {new: true});
  if(usersDeleted)
  res.send(usersDeleted);
  else{
    //res.status(400).json({message: "No matching query"});
    error = new Error("No matching query");
    error.status = 400;
    next(error);
    return error;
  }
  return;
  }
  catch (err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
}
router.post("/delete", deleteCommentDB);

module.exports = {router, createCommentDB, readCommentDB, updateCommentDB, deleteCommentDB};
