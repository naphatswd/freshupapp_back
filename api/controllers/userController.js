'use strict'

/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		token for user

----------------------------------------------*/
const localStrategy  = require('../../node_modules/passport-local').Strategy;
const JWTstrategy = require('../../node_modules/passport-jwt').Strategy;
const ExtractJWT = require('../../node_modules/passport-jwt').ExtractJwt;
const passport  = require('../../node_modules/passport');
const user_model = require('../models/users');

passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback: true
}, async (req,email, password, done) => {
    try {
      req.body.email = req.body.email.toLowerCase();
      const user = await user_model.create(req.body);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
}));

passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    email = email.toLowerCase();
    //Find the user associated with the email provided by the user
    const user = await user_model.findOne({ email });
    const access = await user.checkaccess();
    if( !user || !access){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'pakchongcpf',
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));