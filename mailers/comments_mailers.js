const nodeMailer = require('../config/nodemailer');

//this is another way of exporting the method
exports.newComment = (comment)=>{
    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
     nodeMailer.transporter.sendMail({
          from:'ameshram2002@gmail.com',
          to: comment.user.email,
          subject:"New comment published",
          html: htmlString
     },(err,info)=>{
         if(err){
             console.log('Error in sending the message',err);
             return;
         }

         console.log('Message sent',info);
         return;
     });
}