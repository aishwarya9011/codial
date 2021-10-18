const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
function(email,password,done){
    User.findOne({email: email},function(err,user){
        if(err){
            console.log('Error in finding the user-->passport');
            return done(err);
        }
        if(!user || user.password!=password){
            return done(null,false);
        }
        return done(null,user);
    });

}
));

//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
     done(null,user.id);
});


//deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
   User.findById(id,function(err,user){
    if(err){
        console.log('Error in finding the user -->passport');
        return done(err);
   }
     return done(null,user);
   });
   
});
//check if the user is authenticated
passport.checkAuthentication = (function(req,res,next){
    //if the user is signed in then pass on the request to the next function(i.e Controller's action)
    if(req.isAuthenticated()){
        return next();

    }
    //if the user is not signed in
    return res.redirect('/user/sign-in');
});
passport.setAuthenticatedUser = function(req,res,next){
    //req.user contains the current signed in from the cookie and we are just sending this to the locals for the views
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;