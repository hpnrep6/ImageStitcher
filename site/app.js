const express = require('express');
const mongoose = require('mongoose');
const setup = require('./api/libs/setup');

const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
 
const mongoURL = 'mongodb://localhost:27017/comicdb';

console.log('Connecting to MongoDB...');
mongoose.connect(mongoURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }, (err) => {
        if(err) {
            console.log("MongoDB Error: ")
            console.log(err);
        } else {
            console.log('DB connected...');
        }    
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

setup();

const inc = require('./api/libs/increment')

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening at port ' + port + '...');
});

const apiRoute = require('./api/api');

app.use('/api', apiRoute);

// 404 not found get path
