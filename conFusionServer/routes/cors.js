const express = require('express');
const cors = require('cors');
const app = express();

// whitelist  add all the origin
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
let corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    //if income header contain origin find then check whitelist that it contain or not
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
// specific root
exports.corsWithOptions = cors(corsOptionsDelegate);