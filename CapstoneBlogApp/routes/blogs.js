var express = require("express");
var router = express.Router();
var fs = require("fs");
var gm = require("gm");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });
const axios = require("axios").default;
const dotenv = require("dotenv");
const Agenda = require("agenda");
const sharp = require("sharp");
const { utcToZonedTime } = require("date-fns-tz");
const path = require("path");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
dotenv.config();
const blogs_db_url = process.env.blogs_db_url;

/* GET users listing. */

let agenda = null;

const timeTakenToRead = (words) => {
  let seconds = (1 / 300) * words * 60;
  return Math.ceil(seconds);
};
const getClientSideDate = (utc, timeZone) => {
  const date = utcToZonedTime(utc, timeZone).toISOString();
  return date;
};
const Storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

startAgendaScheduler = async () => {
  agenda = new Agenda({
    db: {
      address: process.env.MONGO_URI,
      collection: "BlogsJobs",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  });
  agenda.on("ready", async () => {
    await agenda.start();
    console.log("Agenda started..");
  });
};

startAgendaScheduler();

const createBlog = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.data = {
      statusCode: 400,
      message: "No blog details found",
      data: {},
    };
    next();
    return;
  }
  if (!("blogTitle" in req.body)) {
    res.data = {
      statusCode: 400,
      message: "No blog title found",
      data: {},
    };
    next();
    return;
  }
  let isfileSize = false;
  let { scheduledTime } = req.body;
  if (scheduledTime) {
    //scheduledTime = Date.parse(scheduledTime);
    delete req.body.scheduledTime;
    if (scheduledTime > new Date()) {
      scheduledTime = Number(scheduledTime);
      req.body.isActive = false;
    } else {
      req.body.isActive = true;
      scheduledTime = null;
    }
  }

  const imagesArray = req.files;
  let numOfWords = 0;
  if (!("description" in req.body)) {
    return res
      .status(500)
      .json({ message: "No description is given for the blog" });
  }
  const blogDescriptionArray = JSON.parse(req.body.description);
  if (blogDescriptionArray.length === 0)
    return res
      .status(400)
      .json({ message: "Please give atleast one blog description" });
  const finalBlogDescriptionArray = await Promise.all(
    blogDescriptionArray.map(async (description) => {
      if (
        description.contentType === "text" ||
        description.contentType === "link"
      ) {
        if (description.contentType === "text") {
          numOfWords += description.content.split(" ").length;
        }
        return {
          type: description.contentType,
          content: description.content,
        };
      } else {
        const requiredImage = imagesArray.find((currentFile, index) => {
          if (currentFile.fieldname === description.content) {
            return currentFile;
          }
        });
        if (!requiredImage) {
          return "imageNotFound";
        } else {
          var ref = `${requiredImage.originalname}`;
          await sharp(requiredImage.path)
            .jpeg({ quality: 20, chromaSubsampling: "4:4:4" })
            .toFile("./uploads/" + ref);

          const image = {
            name: ref,
            image: {
              data: fs.readFileSync(
                path.join(__dirname, "../uploads/", `${ref}`)
              ),
              content: "image",
            },
          };
          const fileSize = requiredImage.size / (1024 * 1024);
          if (fileSize > 2) {
            isfileSize = true;
          }
          fs.unlinkSync(path.join(__dirname, "../uploads/", `${ref}`));
          image.image.data = image.image.data.toString("base64");
          return image;
        }
      }
    })
  );
  if (finalBlogDescriptionArray.indexOf("imageNotFound") > -1) {
    // return res.status(400).json({
    //   message: "Please input same keys for image as in description / content",
    // });
    res.data = {
      statusCode: 403,
      message: "Please input same keys for image as in description / content",
      data: {},
    };
    next();
    return;
  }
  const newBlog = {
    blogTitle: req.body.blogTitle,
    blogAuthor: req.headers.user_id,
    isInteraction: req.body.interaction,
    isActive: req.body.isActive,
    numOfWords: numOfWords,
    uuid: uid(),
    blogDescription: finalBlogDescriptionArray,
  };
  if (scheduledTime) {
    newBlog["blogPublishTimeStamp"] = scheduledTime;
  }
  if (isfileSize) {
    //res.status(500).send({message: "FileSize exceeded 2MB"});
    res.data = {
      statusCode: 413,
      message: "FileSize exceeded 2MB",
      data: {},
    };
    next();
  } else {
    try {
      const { data } = await axios.post(blogs_db_url + "create", newBlog);
      // res.status(200).send({
      //   message: "Blog Saved to DB successfully",
      //   bloguuid: data.uuid,
      // });
      res.data = {
        statusCode: 200,
        message: "Blog saved successfully",
        data: data.uuid,
      };
      next();
      if (scheduledTime) {
        createSheduler(scheduledTime, data);
      }
    } catch (error) {
      // res.status(401).send(error);
      error = new Error("Server error");
      error.status = 500;
      next(error);
    }
  }
};
const viewBlog = async (req, resp, next) => {
  const populateQuery = [
    {
      path: "blogAuthor usersShared usersApplauded",
      select: "name emailID careerStage -_id",
    },
    {
      path: "comments",
      match: { isActive: true },
      select: "comment commentAuthor createdAt updatedAt _id",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "commentAuthor",
        select: "name emailID careerStage -_id",
      },
    },
  ];
  const request = {
    query: {
      isActive: true,
    },
    populateQuery,
  };
  try {
    const { data } = await axios.post(blogs_db_url + "read", request);

    if (data.length > 0) {
      let clientSideDisplayBlogs = data.map((blog) => {
        blog.createdAt = getClientSideDate(
          blog.createdAt,
          req.headers.timezone
        );
        blog.updatedAt = getClientSideDate(
          blog.updatedAt,
          req.headers.timezone
        );
        blog.blogPublishTimeStamp = getClientSideDate(
          blog.blogPublishTimeStamp,
          req.headers.timezone
        );
        blog.comments = blog.comments.map((comment) => {
          comment.createdAt = getClientSideDate(
            comment.createdAt,
            req.headers.timezone
          );
          comment.updatedAt = getClientSideDate(
            comment.updatedAt,
            req.headers.timezone
          );
          return comment;
        });
        blog.TimeNeededToRead =
          timeTakenToRead(blog["numOfWords"]) + " seconds";
        delete blog["numOfWords"];
        return blog;
      });
      //resp.send(clientSideDisplayBlogs);
      resp.data = {
        statusCode: 200,
        message: "Request Success",
        data: clientSideDisplayBlogs,
      };
    } else {
      resp.data = {
        statusCode: 200,
        message: "No data found",
      };
    }
    next();
  } catch (error) {
    error = new Error("Server error");
    error.status = 500;
    next(error);
    //resp.status(400).send({ message: "Couldn't find any blog...." });
  }
};
const viewBlogById = async (req, resp, next) => {
  let query = {};
  if (req.params.id) {
    if (mongoose.isValidObjectId(req.params.id)) {
      query = {
        _id: req.params.id,
        isActive: true,
      };
    } else {
      query = {
        uuid: req.params.id,
        isActive: true,
      };
    }
  }
  const populateQuery = [
    {
      path: "blogAuthor usersShared usersApplauded",
      select: "name emailID careerStage -_id",
    },
    {
      path: "comments",
      match: { isActive: true },
      select: "comment commentAuthor createdAt updatedAt _id",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "commentAuthor",
        select: "name emailID careerStage -_id",
      },
    },
  ];
  const request = {
    query,
    populateQuery,
  };
  try {
    const { data } = await axios.post(blogs_db_url + "read", request);
    if (data.length > 0) {
      let clientSideDisplayBlogs = data.map((blog) => {
        blog.createdAt = getClientSideDate(
          blog.createdAt,
          req.headers.timezone
        );
        blog.updatedAt = getClientSideDate(
          blog.updatedAt,
          req.headers.timezone
        );
        blog.blogPublishTimeStamp = getClientSideDate(
          blog.blogPublishTimeStamp,
          req.headers.timezone
        );
        blog.comments = blog.comments.map((comment) => {
          comment.createdAt = getClientSideDate(
            comment.createdAt,
            req.headers.timezone
          );
          comment.updatedAt = getClientSideDate(
            comment.updatedAt,
            req.headers.timezone
          );
          return comment;
        });
        blog.TimeNeededToRead =
          timeTakenToRead(blog["numOfWords"]) + " seconds";
        delete blog["numOfWords"];
        return blog;
      });
      resp.data = {
        data: clientSideDisplayBlogs[0],
        message: "Success",
        statusCode: 200,
      };
    } else {
      resp.data = {
        data: {},
        message: "Blog Not Found",
        statusCode: 200,
      };
      // error = new Error("Blog not found");
      // error.status = 404;
    }
    next();
  } catch (error) {
    //resp.status(404).send({ message: "Couldn't find any blog...." });
    // resp.data = {
    //   statusCode: 500,
    //   message: "Server Error"
    // }
    error = new Error("Server error");
    error.status = 500;
    next(error);
  }
};
router.post("/create", upload.any("images"), createBlog);

router.get("/view", viewBlog);

router.get("/view/:id", viewBlogById);

const createSheduler = async (scheduledTime, blog) => {
  agenda.define(`publishBlog`, async (job) => {
    const _id = job.attrs.data.blog._id;
    const updateQuery = {
      query: { _id },
      updateQuery: { isActive: true },
    };
    await axios
      .post(blogs_db_url + "update", updateQuery)
      .then((response) => {
        console.log("Blog published", response.data._id);
      })
      .catch((err) => {
        console.log("Blog publish ERROR :", err.data);
      });
  });

  await agenda.schedule(scheduledTime, `publishBlog`, {
    blog: blog,
  });
};

const graceful = async () => {
  await agenda.stop();
  process.exit(0);
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = { router, createBlog, viewBlog, viewBlogById };
