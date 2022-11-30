const express = require('express');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();
const users_db_url = process.env.users_db_url;


const router = express.Router();
const userSchema = require('../model/UsersModel');
const fs = require('fs');
const { default: mongoose } = require('mongoose');

router.post('/', (req, res) => {

    fs.readFile('./csvSource/users.csv', 'utf8', async function (err, data) {
        var data = data.split(/\r?\n/);
        data = data.map(item => item.split(","));
        console.log(data);
        var objArray = [];
        var object = {};
        var emailID;
        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {

                object[data[0][j]] = data[i][j];
                emailID = data[i][0];
            }
            console.log(object);

            objArray.push(object);
            try {
            await axios
            .post(users_db_url+"create", object);
            // await axios
            //     .post(users_db_url + "create",CapstoneDB.users.find({ emailID: emailID }, console.log("im here"))
            //     // .count()
            //     .then(count => {
            //         if (count > 0) {
            //             // res.status(400,console.log("user email aready exists, pls try login "));
            //             console.log("u r a existing user");
            //         }
            //         else {
            //             var users = new userSchema(object);
                        // users.save().then(() => console.log('data saved'));
            //         }
            //     }))
                
            }
            catch (error) {
                // res.status(500).send("");
                console.log("error");
            }
            // console.log("OBJ",object);
            // mongoose.connect(users_db_url);
            // var users =  new userSchema(object);
            // users.save().then(() => console.log('data saved'));
            // // console.log(user);
            // objArray.push(object);
        }
        res.send("success")
        // console.log("Final Obj ", JSON.stringify(objArray));     
    });
});

module.exports = router;