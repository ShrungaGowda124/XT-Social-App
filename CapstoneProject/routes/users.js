var express = require('express');
var router = express.Router();
//var userModel = require("../model/UsersModel");
const axios = require('axios').default;
const dotenv = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
const fs = require('fs');
const multer = require('multer');
const path = require('path');
dotenv.config();
const users_db_url = process.env.users_db_url

var config = {
  apiKey: 'test-70ad838f-965c-4fd0-a574-3aee8f0e8f01',
};

var ma = require('mojoauth-sdk')(config);

var email;

router.post('/login',async(req,res,next) => {
  var emaildb; 
  email = req.body.email;
   const query = {
    "query": {
      "emailID" : email
    }
  }
  try{
   emaildb = await axios
       .post(users_db_url+"read", query)
  }
  catch(error){
    console.log(error);
    //res.status(500).send(error);
    error = new Error("Server error");
    error.status = 500;
    next(error);
    return;
  }
  console.log("Emaildb",emaildb.data)
  if(!email || (emaildb && emaildb.data && emaildb.data.length==0)) { 
  //return res.status(400).send("Email not found");
  res.data = {
    statusCode: 404,
    message: "Email ID not found in DB",
    data: {}
  }
  next();
  return;
 
}
   console.log("Received email at",email );
  ma.mojoAPI
.signinWithEmailOTP(email, {})
.then(response => {
  console.log("mojo auth" ,response);
  
  //return res.send(response);
  res.data = {
    statusCode: 200,
    message: "OTP sent successfully",
    data: response
  }
  next();

})

.catch(function (error) {
  console.log(error)
  error = new Error("Server error");
  error.status = 500;
  next(error);
})
});


router.post('/verifyotp',(req,res, next) => {
  const state_id = req.body.state_id;
  const otp = req.body.otp;
   email = req.body.email;
  const EXPIRYDURATION = process.env.EXPIRYDURATION;
  const CAPSTONESECRETKEY = process.env.CAPSTONESECRETKEY;
  
  ma.mojoAPI
  .verifyEmailOTP(otp,state_id)
  .then(response => {
    // console.log("Response OTP ", response);
    if(response.authenticated){
    let token =  jsonwebtoken.sign(
     {email}, CAPSTONESECRETKEY,  { expiresIn: EXPIRYDURATION } );
  //  res.json( {
  //     message:("OTP verified successfully"),
  //     token
  //   });
  res.data = {
    statusCode: 200,
    message: "OTP verified successfully",
    data: {token: token}
  }
  next();
  }
  else{
    //res.status(401).json(response);
    res.data = {
      statusCode: 401,
      message: "Failure",
      data: response
    }
    next();
  }
  })
  .catch(function (error) {
    console.log(error)
    error = new Error("Server error");
    error.status = 500;
    next(error);
  })
});

// router.post('/register', (req, res) => {

//   fs.readFile('./csvSource/users.csv', 'utf8', async function (err, data) {
//       var data = data.split(/\r?\n/);
//       data = data.map(item => item.split(","));
//       //console.log(data);
//       //var objArray = [];
//       var object = {};
//       //var emailID;
//       for (let i = 1; i < data.length; i++) {
//           for (let j = 0; j < data[i].length; j++) {

//               object[data[0][j]] = data[i][j];
//               //emailID = data[i][0];
//           }
//           //console.log(object);

//           //objArray.push(object);
//           try {
//           await axios
//           .post(users_db_url+"create", object);
//           }
//           catch (error) {
//               // res.status(500).send("");
//               console.log("error");
//           }
//       }
//       res.send("success");  
//   });
// });

// initiating multer Engine to store the file in a locatio
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./csvSource");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

//router to upload and add user data to DB
router.post('/register', upload.single('usersData'), (req, res, next) => {
  var ref = `${req.file.originalname}`;
  let successUsers = [];
  let registeredUsers = [];
  fs.readFile(path.join(__dirname, "../csvSource/", `${ref}`), 'utf8', async function (err, data) {
    var data = data.split(/\r?\n/);
    data = data.map(item => item.split(","));
    const arr = ['emailID', 'name', 'careerStage'];
    if (JSON.stringify(data[0]) === JSON.stringify(arr)) {
      var object = {};
      for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          object[data[0][j]] = data[i][j];
        }
        try {
          await axios
            .post(users_db_url + "create", object);
          successUsers.push(object.emailID);
        }
        catch (error) {
          if(error.response && error.response.data){
          console.log(" Already registered...!", error.response.data);
          registeredUsers.push(object.emailID);
          }
          else{
            error = new Error("Server error");
            error.status = 500;
            next(error);
            return;
          }
        }
      }
      res.data = {
        statusCode: 200,
        message: successUsers.length>0 ? "Registration Successfull" : "No new registration",
        data: {
          "Already Registered": registeredUsers.length || 0,
          "New Registration": successUsers.length || 0
        }
      }
      next();
      fs.unlinkSync(path.join(__dirname, "../csvSource/", `${ref}`));
    }
    else {
      res.data = {
        statusCode: 403,
        message: "Wrong File",
        data: {}
      }
      next();
      fs.unlinkSync(path.join(__dirname, "../csvSource/", `${ref}`));
    }
  });
});

module.exports = router;