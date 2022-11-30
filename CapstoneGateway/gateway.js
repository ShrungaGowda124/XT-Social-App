const express = require('express');
const dotenv = require('dotenv');
const {router} = require('./router');
dotenv.config();

const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));


app.use('/api', router);

app.listen(process.env.PORT,() => {
    console.log('Gatwway Server running on', process.env.PORT);
})

