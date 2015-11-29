var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
//var session=require('express-session');
var flash=require('connect-flash');



//Connect to db ProjectMgmt
//var config=require('./config')
//mongoose.connect(config.url);

var routes = require('./routes').index();
//var analytics=require('./routes/analytics');
//var beneficiary=require('./routes/beneficiary');
//var project=require('./routes/project');
//var profile=require('./routes/profile');
//var reports=require('./routes/reporting');

//require('./config/passport.js')(passport);



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(session({secret: 'mySecretKey',
                 saveUninitialized:true,
                 resave:true         
               }));
app.use(passport.initialize());
app.use(passport.session());*/
app.use(flash());


app.use('/', routes); 
//app.use('/analytics', analytics);
//app.use('/beneficiary',beneficiary);
//app.use('/project',project);
//app.use('/reports',reports);
//app.use('/profile',profile);

console.log("after routes");

//atch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

