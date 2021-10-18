const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/user/profile');
    }
    return res.render('user_sign_in',{
        title: 'codial | SignIn'
    })
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('user_sign_up',{
        title: 'codial | signUp'
    })
}

module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
      if(err){console.log('Error in finding user in signing up' ); return;}

      if(!user){
          User.create(req.body,function(err,user){
              if(err){console.log('Error in creating user while signing up'); return ;}
              return res.redirect('/user/sign-in');
          })
      }else{
          return res.redirect('/user/sign-up');
      }
    })

}

module.exports.createSession = function(req,res){
    return res.redirect('/');
}
module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/')
}