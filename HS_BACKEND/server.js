const bodyParser = require('body-parser');
const express = require('express');
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');

const authUser = require('./api/auth/user');

// DB CONNECTION
 mongoose.connect('mongodb://localhost/HomeFinder', {
         useNewUrlParser: true,
         useCreateIndex: true
       })
    .then(() => console.log(`MongoDB Connected`))
      .catch(err => {
        console.log(`MongoDB failed to connect to the server.`);
      });
  var db = mongoose.connection;

  
//init App
const app = express();

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Session
app.use(session({
	secret : 'secret',
	saveUninitialized :true,
	resave :true
}));

//Morgan
app.use(morgan('dev'));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function (req,res,next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//Routes
app.use('/auth',authUser);

//Set port
app.set('port',(process.env.PORT || 8000));

app.listen(app.get('port'),function () {
	console.log('Server started on port ' +app.get('port'))
});