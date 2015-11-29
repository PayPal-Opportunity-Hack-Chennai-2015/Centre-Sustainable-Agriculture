'use strict';

var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch'); 
var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'trace' }); 

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

    router.get('/project',function(req,res){
        res.render('projects');
    });
    router.post('/project',function(req,res){
        res.render('projects');
    });

    router.post('/add', function(req, res){
        console.log("adding");
    });

    router.get('/getsolution',function(req,res){

        var crop=req.query.crop;
        var soil=req.query.soil;
        var img=req.query.pestImage;
        console.log(crop,soil,img);
        //console.log(crop);
        //console.log(req.query.soil);

    });
    router.get('/data', function(req, res) {
        //res.status(500).send('something went wrong while connecting to service');

        console.log("entering");
        client.search({ 
            index:'data',
            type:'pest' 
        }).then(function (body) { 
            var hits = body.hits.hits;
            console.log(hits);
            res.send(hits);
        }, function (error) { 
            console.trace(error.message); 
        }); 
    });

    //Handle About before and after login
    router.get("/submit", function(req,res){
        console.log("Here");
        client.search({
            "index":"data",
            "type":"crops",
            "body": {
                        query: {
                            match: {
                                "name": req.query.crop
                            }
                        }
                    }
        }).then(function (body) {
            var hits = body.hits.hits;
            console.log(hits.pest.solution);
            res.send(hits.pest.solution);
            //res.render('qna-timeline',hits);
        }, function (error) {
            console.trace(error.message);
        });

    });
    return router;
}  


//exporting the functions
module.exports={index:index};


