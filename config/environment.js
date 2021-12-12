const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});



const development = {
    name:'development',
    asset_path :'./assets' ,
    session_cookie_key: 'blahsomething',
    db:'code_dev',
    smtp:{
        service :'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'ameshram2002@gmail.com',
            pass:'Aish2002#'
        }
    },
    google_client_ID:"152903133363-t58mn2rsdcj3eg46e4bhu8j6n988jq1s.apps.googleusercontent.com",
    google_client_Secret:"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",
    google_callback_URL: "http://localhost:8000/user/auth/google/callback",
    jwt_secret:'codial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}
const production = {
    name: 'production',
    asset_path: process.env.CODIAL_ASSET_PATH ,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE,
    db:process.env.CODIAL_DB,
    smtp:{
        service :'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.CODIAL_USERNAME,
            pass:process.env.CODIAL_PASSWORD
        }
    },
    google_client_ID:process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_Secret:process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.CODIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}
module.exports = eval(process.env.CODIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODIAL_ENVIRONMENT);
