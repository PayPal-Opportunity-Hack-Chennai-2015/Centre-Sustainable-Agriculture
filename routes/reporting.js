var express = require('express');
var router = express.Router();
var url=require('url');
var querystring=require('querystring');
var isLoggedIn=require('./index').isLoggedIn;
var path=require('path');

var fs=require('fs');
var json2xls=require('json2xls');
var xls2json=require('xls-to-json');

var multer=require('multer');
var upload=multer({dest:'../files/'});





  router.get('/',function(req,res){

      res.render('reporting');

  });

  //Export Beneficairy details
  router.get('/export',isLoggedIn,function(req,res){

     //Fetch data from db and remove not needed fields
     benfDetails.find({},{_id:0,updated_at:0}).lean().exec(function(err,data){
           
        var exportXLS=json2xls(data);
        var filepath=path.resolve('.')+'\\files\\BeneficiaryDetails.xls';
        

        //write to file details.xls
        fs.writeFile(filepath,exportXLS,'binary',function(err){
            if(err)
                throw err;  
            res.download(filepath); 
        });
     });

  });


  //Generic functionality to handle send mail on all contexts
  router.get('/sendmail/:filename',function(req,res){

          var reqBody=querystring.parse(url.parse(req.url).query);

          var email=reqBody.email;
          var fileName=req.params.filename;
          var templateType;

     
          //Setting template type based on the content we are exporting
          if(reqBody.type=="beneficiary")
              templateType=template.beneficiary;
          

          //Getting pre-defined subject & content for reporting 
          var subject=templateType.subject;
          var content=templateType.content;

          
          sendmail(email,subject,content,fileName);

          res.redirect(req.get('referer'));
            
  });


  //Import beneficiary details into data store
  router.post('/upload',upload.single('file'),function(req,res){

     var filepath=path.resolve('.')+'\\files\\Beneficiary-Import.xls';

 
     //Read the uploaded file
     fs.readFile(req.file.path,function(err,data){

           //Write into a server file
           fs.writeFile(filepath,data,'binary',function(err){

                if(err)
                    throw err;
                 //Convert uploaded excel into json
                 xls2json({input:'./files/Beneficiary-Import.xls',output:"./files/Beneficiary-out.json",sheet:"Sheet1"}, 
                        function(err, result) {
                             if(err)
                                throw err;
                   });

                  //Read the converted json file and insert into data store
                  fs.readFile('./files/Beneficiary-out.json','utf8',function(err,data){
 
                        if(data!=""){
                        
                              benfDetails.collection.insertMany(JSON.parse(data),function(err){
 
                                    if(err)
                                      throw err;
                                    else{
                                      var user=req.session.passport.user;
                                      console.log("Imported Successfully");
                                      res.render('home',{user:user});
                                    }
                              });
                         }

                  });

           });
     });

         
   });









  module.exports=router;