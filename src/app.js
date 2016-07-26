'use strict'

let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');

let cookieParser  =require('cookie-parser'),
    bodyParser = require('body-parser'),
    pug = require('pug'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy;

 //mongoose connection
mongoose.connect('mongodb://localhost/one');
let db = mongoose.connection;

//creating the app and setting port
let app = express();
let port = process.env.PORT || 3000;

//Routes
let router = require('./routes/index');
let users = require('./routes/users');

//setting engine and views path
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.set('view options', {pretty: true});

//setup parsers
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.locals.pretty = true;

//set up the static server for static files
app.use('/static', express.static(__dirname + '/public'));

//setting the logger and listener to port
app.use(morgan('dev'));

//app.use(cookieParser('a little secret'));
//setting express session
app.use(session({
	secret: 'a little secret',
	saveUninitialized: true,
	resave: true
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//express validator errorFormater code (//dont think its needed so empty atm) and delete app use validator


//connect flash and global messages
app.use(flash());
app.use(function(req, res, next){
	res.locals.sucess_msg = req.flash('sucess_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//redirect to route variables
app.use('/', router);
//app.use('/users', users);

app.listen(port, function(){
	console.log('listening in port: ', port);
})
