'use strict'

let express = require('express');
let router = express.Router();
let User= require('../models/user')

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;


router.get('/', function(req, res){
	if(req.user) return res.render('index', {username: req.user.username})
	res.render('index');
});


passport.use('local-login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
  },
  function(req, username, password, done){
	  User.getUserByUsername(username, function(err, user){
		  if (err) return done(err);
		  if(!user) return done(null, false, {message: "No User found"});
		  User.comparePassword(password, user.password, function(err, isMatch){
			  if (err) return done(err);
			  if(!isMatch) return done(null,false, {message: "Wrong Password"});
			  return done(null, user);
		  });
	  });
  }
));

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(id, function(err, user){
		done(err, user);
	});
});


router.route('/login')
  .get( function(req, res){
	res.render('login');
  })
  .post(passport.authenticate('local-login', {sucessRedirect: '/', failureRedirect: '/login' }),
		  function(req, res){
			  res.redirect('/');
		  }
		  );
 

router.route('/register')
  .get( function(req, res){
	res.render('register')
  })
  .post(function(req, res){
	  let person = {
		  firstName: req.body.firstName,
		  lastName: req.body.lastName,
		  username: req.body.username,
		  password: req.body.password
	  };
	  //validation
	  req.checkBody('firstName', 'First Name is Required').notEmpty();
	  req.checkBody('lastName', 'Last Name is Required').notEmpty();
	  req.checkBody('username', 'Email is Required').notEmpty();
	  req.checkBody('username', 'Correct Email Format Required').isEmail();
	  req.checkBody('password', 'Password is Required').notEmpty();
	  req.checkBody('confirmPassword', 'Must Match Password').equals(req.body.password);
	  let errors = req.validationErrors();
	  if(errors) return res.render('register', {errors: errors});
	  let user = new User(person);
	  User.createUser(user, function(err, user){
		  if(err) return console.error(err);
		  console.log(user);
	  });
	  res.render('login');
  });

router.route('/logout')
  .get(function(req, res){
	  req.logout();
	  res.redirect('/login');
  });
module.exports = router;
