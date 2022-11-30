var express = require('express');
var router = express.Router();
var userModel = require("../model/UsersModel");

/* GET users listing. */
const readUserDB = async (req, res, next) => {
  console.log("Inside Read request : ", req.body);
  let query = {};
  if(req.body.query){
    query = req.body.query;
  }
  console.log("Query for read user db : ", query);
  // await userModel.find((err, users)=>{
  //   if (err){
  //     console.log("User DB Error : ", err);
  //     return res.status(500).send(err);
  //   } else{
  //     console.log("Success User DB Read: ", users);
  //     return res.status(200).send(users);
  //   }
    
  // });
  try{
  var users = await userModel.find(query);
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
router.post('/read', readUserDB);

const createUserDB = async (req, res, next)=> {
  console.log("Inside Create req : ", req.body);
  if(!req.body || JSON.stringify(req.body)=='{}' || !req.body.name || !req.body.emailID || !req.body.careerStage){
    error = new Error("Missing properties in request");
    error.status = 403;
    next(error);
    return error;
  }
  //const postBody = new userModel(req.body);
  try{
  //let userSaved = await postBody.save();
  let userSaved = await userModel.create(req.body);
  res.status(200);
  res.send(userSaved);
  return;
  }
  catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
  // .then((data)=>{
  //   console.log("Success Create User DB Service");
  //   //res.status(200);
  //   res.send(data);
  //   next(data);
  //   return;
  // }
  // )
  // .catch(err => {
  //   if(!err.statusCode){
  //     err.statusCode = 500;
  //   }
  //   next(err);
  //   return err;
  // }
  // );
};
router.post('/create', createUserDB);

const updateUserDB = async (req, res, next) => {
  console.log("Inside Update req : ", req.body);
  // await userModel.findOneAndUpdate(req.body.query, req.body.updateQuery, (err, value)=>{
  //   if (err) return res.status(500).send(err);
  //   return res.send(value);
  // });
  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}' || JSON.stringify(req.body?.updateQuery)=='{}' || !req.body.query || !req.body.updateQuery){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersUpdate = await userModel.findOneAndUpdate(req.body.query, req.body.updateQuery, {new: true});
  if(usersUpdate){
  res.send(usersUpdate);
  }
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
router.post('/update', updateUserDB);

const deleteUserDB =  async (req, res, next)=>{
  console.log("Inside Delete req : ", req.body);
  // await userModel.findOneAndUpdate(req.body.query, {isActive: false}, function (err, value){
  //   if (err) return res.status(500).send(err);
  //   return res.send(value);
  // });
  if(JSON.stringify(req.body) == '{}' || JSON.stringify(req.body?.query)=='{}'){
    error = new Error("Empty request");
    error.status = 403;
    next(error);
    return error;
  }
  try{
  let usersDeleted = await userModel.findOneAndUpdate(req.body.query, {isActive: false}, {new: true});
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
router.post('/delete', deleteUserDB);

module.exports = {router, readUserDB, createUserDB, updateUserDB, deleteUserDB};
//exports.readUserDB = readUserDB;
