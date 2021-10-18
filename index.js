const express = require('express');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware({
     src: './assets/scss',
     dest: './assets/css',
     debug: true,
     outputStyle: 'extended',
     prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static('./assets'));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session cookie in db
app.use(session({
    name:'codial',
    //ToDo change the secret before deployment in production mode
    secret:'Blahsomething',
    saveUninitialised: false,
    resave: false,
    cookie:{
        maxAge:(1000*60*1000)
    },
    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017'
    },
    function(err){
        console.log(err ||'connect-mongodb setup ok');
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server:${err}`);
        
    }
    console.log(`Server is running on port:${port}`);
});