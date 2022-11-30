const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
//const userRegisterRouter = require('./routes/userRegister');
const mongoDB = require("mongoose");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '3000kb'}));

// app.use('/', indexRouter);
app.use('/', usersRouter);
//app.use('/register', userRegisterRouter);

//DB Connection
// console.log("Mongo URL ", process.env.MONGO_URL);
// mongoDB.connect(process.env.MONGO_URL).then(
//   console.log("DB connection established")
// ).catch(err => {
//   console.log("DB connection error ", err);
// });
app.use(function(req, res, next) {
  if(res.data){
    res.status(res.data.statusCode || 400).send({data: res.data.data || {}, message: res.data.message || "Bad Request"});
  }
  else {
    console.log("AFTER SUCCESS ", res.data);
    next();
  }
  //next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    error: {
      message: err.message
    }
  })
});

module.exports = app;
