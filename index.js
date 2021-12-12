const express = require('express');
const env = require('./config/environment');
const app = express();
const logger = require('morgan');

const port = 8000;
const cookieParser = require('cookie-parser');
require('./config/view_helper')(app);


const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//set up the chatServer to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
const path = require('path');
console.log('chatServer is listening on port 5000');
if(env.name=='development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
   }));
}


app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
console.log(env.asset_path);
app.use(express.static(env.asset_path));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session cookie in db
app.use(session({
    name:'codial',
    //ToDo change the secret before deployment in production mode
    secret:env.session_cookie_key,
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
app.use(flash());
app.use(customMware.setFlash);
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in running server:${err}`);
        
    }
    console.log(`Server is running on port:${port}`);
});