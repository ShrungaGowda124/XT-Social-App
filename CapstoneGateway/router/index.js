const express = require('express');
const axios = require('axios');
const proxy = require('express-http-proxy');
const MicroServices = require('./config.local.json');
const router = express.Router();
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const users_db_url = process.env.users_db_url;
const CAPSTONESECRETKEY = process.env.CAPSTONESECRETKEY;

const checkServices = (req,res,next) => {
    if(!getServer(req.params.service)) {
        res.status(404);
        res.send({message: 'Microservice not found'});
        return;
    }
    next();
};
router.use('/:service', checkServices)

const validateToken = async (req,res,next) => {
    const isValidate = new Promise(async (resolve, reject) => {
      if(req._parsedUrl.path.includes('/users')) {
       return resolve(true)
      }
      if(req.headers.authorization){
        const tokenValue = req.headers.authorization.split(" ")[1];
        // const tokenValue = jwt.sign({ emailID: 'marudhu@gmail.com' }, 'secret',{expiresIn:'10m'});
        console.log("TokenValue: ",tokenValue);
        jwt.verify(tokenValue, CAPSTONESECRETKEY, async (err,decode) => {
            if(err) {
              return reject(err);
            }
            const query = {
                "query": {"emailID":decode.email}
            }
            // console.log("Decode toekn value", decode)
            // console.log("updated Decode Expiry: ", new Date(decode.exp*1000) > new Date())
            return axios.post(users_db_url+"read", query).then(res => {
                    const userExist = res.data[0];
                    if(userExist) {
                        console.log('User Exisit', userExist);
                        req.headers.user_id = userExist._id;
                        return resolve(true);
                    } else {
                        return reject({message: 'Unauthorized'})
                    }
            }).catch(err => {
                console.log(err.message);
                return reject({message: err.message})
            })
        });
    }
    else{
        return reject({message: 'Unauthorized'});
    }
    });
    await isValidate.then(() => {
        next();
    }).catch(err => {
        res.status(401);
        res.send({message: err.message});
    });
}

// Create routers for the configured Microservice
const createRoutes = () => {
    MicroServices.api.some(service => {
        router.use(service.path, validateToken, proxy(service.url, { timeout: 5000 }))
    })
}

createRoutes();


const getServer = (service) => {
   return MicroServices.api.find(item => item.path === `/${service}`);
};

module.exports = {
    router,
    validateToken,
    checkServices,
    getServer
};