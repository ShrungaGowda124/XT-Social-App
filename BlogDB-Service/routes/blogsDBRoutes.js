var express = require('express');
var router = express.Router();
var blogModel = require("../model/BlogsModel");

/* GET users listing. */
const readBlogDB = async (req, res, next) => {
  console.log("Blog DB Inside Read request : ", req.body);
  let query = {};
  if(req.body.query){
    query = req.body.query;
  }
  let populateQuery;
  if(req.body.populateQuery){
    populateQuery = req.body.populateQuery;
  }
  console.log("Blog DB Query for read db : ", query);
  // populate Query to get blogs with everything
  /*{
    "populateQuery": [
      {
        "path": "blogAuthor usersShared usersApplauded", 
        "select": "name emailID careerStage"
      },
      {
        "path": "comments",
        "select": "comment commentAuthor",
        "populate": {
          "path": "commentAuthor",
          "select": "name emailID careerStage"
        }
        
      }
    ]
  }*/
  try{
  var users = await blogModel.find(query, { _id: 0, __v: 0, "blogDescription._id": 0 })
  .sort({ createdAt: -1 })
  .lean().populate(populateQuery);
  console.log("Response from blog DB Service: ", users);
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
router.post('/read', readBlogDB)

const createBlogDB = async (req, res, next)=> {
  console.log("Blog DB Inside Create req : ", req.body);
  if(!req.body || JSON.stringify(req.body)=='{}' || !req.body.blogTitle || !req.body.blogAuthor){
    error = new Error("Missing properties in request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  //const postBody = new blogModel(req.body);
  //  postBody.save().then((data) => {
  //    res.status(200).send(data);
  //  })
  //  .catch((err) => res.status(500).send(err));
  let blogSaved = await blogModel.create(req.body);
  res.status(200);
  res.send(blogSaved);
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
router.post('/create', createBlogDB);

const updateBlogDB = async (req, res, next) => {
  console.log("Blog DB Inside Update req : ", req.body);
  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}' || JSON.stringify(req.body?.updateQuery)=='{}' || !req.body.query || !req.body.updateQuery){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersUpdate = await blogModel.findOneAndUpdate(req.body.query, req.body.updateQuery, {new: true});
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
router.post('/update', updateBlogDB);

const deleteBlogDB = async (req, res, next)=>{
  console.log("Blog DB Inside Delete req : ", req.body);

  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}'){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersDeleted = await blogModel.findOneAndUpdate(req.body.query, {isActive: false}, {new: true});
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

};
router.post('/delete', deleteBlogDB);

module.exports = {router, createBlogDB, readBlogDB, updateBlogDB, deleteBlogDB};
