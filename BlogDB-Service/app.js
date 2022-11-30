var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//var indexRouter = require('./routes/index');
var blogsDBRouter = require('./routes/blogsDBRoutes').router;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '3000kb'}))

//app.use('/', indexRouter);
app.use('/blogs-db', blogsDBRouter);

console.log("Mongo URL ", process.env.MONGO_URL);
const url = process.env.MONGO_URL;
mongoose.connect(url).then(
  console.log("DB connection established")
).catch(err => {
  console.log("DB connection error ", err);
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
