
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		send an email

----------------------------------------------*/

const nodemailer = require('nodemailer');
exports.sendMail = function(mailOptions){
    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL, 
                      // you can try with TLS, but port is then 587
        auth: {
            user: '', // your email
            pass: '' // your email password
        }
    };
    let transporter = nodemailer.createTransport(smtpConfig);
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}