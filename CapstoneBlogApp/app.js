const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//const indexRouter = require('./routes/index');
const blogsRoute = require("./routes/blogs").router;
const applaud = require("../CapstoneBlogApp/routes/applaud");
const share = require("../CapstoneBlogApp/routes/share");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
// import * as createError from 'http-errors';
// import express from 'express';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import * as logger from 'morgan';

// import indexRouter from './routes/index';
// import * as blogsRoute from './routes/blogs';

// import mongoose from "mongoose";
// import dotenv from "dotenv";
dotenv.config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "3000kb" }));

// app.use('/', indexRouter);

app.use("/", blogsRoute);
app.use("/applaud", applaud);
app.use("/share", share);

app.use(function (req, res, next) {
  if (res.data) {
    res.status(res.data.statusCode || 400).send({
      data: res.data.data || {},
      message: res.data.message || "Bad Request",
    });
  } else {
    console.log("AFTER SUCCESS ", res.data);
    next();
  }
  //next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
