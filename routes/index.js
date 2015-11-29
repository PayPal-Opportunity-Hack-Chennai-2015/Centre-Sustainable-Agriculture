'use strict';

var express = require('express');
var router = express.Router();


var url=require('url');
var querystring=require('querystring');


//function to handle sign in/sign up features
var index=function(){
  //console.log("testing");

    // GET login page
    router.get('/', function(req, res) {
        //res.status(500).send('something went wrong while connecting to service');

        console.log("entering");
  //      res.send({"test":"testing"});
        //res.end();
        res.render('index');
    });

    

    //Handle About before and after login
    
    return router;
}  


//exporting the functions
module.exports={index:index};


