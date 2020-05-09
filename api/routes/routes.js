'use strict'
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		route for none secure

----------------------------------------------*/
const { parse,stringify } = require('../../node_modules/flatted/cjs');
const express = require('../../node_modules/express');
const passport = require('../../node_modules/passport');
const path = require('path');
const fs = require('fs');
const jwt = require('../../node_modules/jsonwebtoken');
const user_model = require('../models/users');
const store_model = require('../models/stores');
const otp_model = require('../models/otp');
const product_model = require('../models/products');
const router = express.Router();
const sendMail = require('../controllers/mailController').sendMail;
const version = require(__dirname+'/../../appversion.json');

let mailOptions = {
  from: 'Naphat.Saw@cpf.co.th',               
  to: "",                
  subject: "",            
  html: ""   
};

router.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
    res.json({status:'ok'});
    user_model.getAdminNotiIn((err,data)=>{
      if(err) console.log(err);
      else{
        let pushToken = [];
        for(let i = 0;i<data.length;i++){
        if(data[i].pushnoti!= '')
          pushToken.push(data[i].pushnoti);
        }
      }
  });
});

router.post('/requestOTP',(req, res, next)=>{
  if (/@cpf.co.th\s*$/.test(req.body.email) || 
      /@truecorp.co.th\s*$/.test(req.body.email) || 
      /@cpcrop.co.th\s*$/.test(req.body.email) || 
      /@cptrading.co.th\s*$/.test(req.body.email) || 
      /@cpall.co.th\s*$/.test(req.body.email) || 
      /@cpmail.in.th\s*$/.test(req.body.email)) {
        user_model.checkEmailExist(req.body.email, (err,data)=>{
          if(err) res.json({status:false});
          else{
            if(data.length > 0)
              res.json({status:"exist"});
            else{
              let otp = Math.floor(Math.random() * 900000) + 100000;
              req.body.otp = otp;
              otp_model.createOTP(req.body,(err,data)=>{
              if(err){res.send(err)}
              else{
                  mailOptions.to = req.body.email;
                  mailOptions.subject = "Freshup Validation Code."
                  mailOptions.html = '<b>your validation code: </b>'  + data.otp +
                                "<br> "+'<b>รหัสยืนยันตัวตน: </b>'  + data.otp+
                                "<br> "+'<b>Code valid only 10 minutes</b>';
                  sendMail(mailOptions);
                  res.json({status:true});
                }
              });
            }
          }
        });
  }else{
      res.json({status:"idiot"});
  } 
});

router.post('/checkOTP',(req, res,next)=>{
  otp_model.checkOTP(req.body,(err,data)=>{
    if(err){res.send(err)}
    else{
      if(data.length > 0){
        let temp = new Date();
        temp -= new Date(data[0].valid_date);
        temp = Math.round(((temp % 86400000) % 3600000) / 60000);
        if(temp > 10)
          res.json({status:false});
        else{
          res.json({status:true});
          otp_model.removeOtp(req.body,(err,data)=>{});
        }
      }else{
          res.json({status:false});
      }
    }
  });
})

router.post('/checksalename', (req, res, next)=>{
  user_model.checkEmpExist(req.body.salecode, (err,data)=>{
    if(err) res.json({status:false});
    else{
      if(data.length > 0){
        res.json({status:"exist"});
      }else{
        getSaleName(req.body.salecode,(salename)=>{
          if(salename == null){
              let jsonresult = {
                  salename:null
              }
                  res.json(jsonresult)
          }else{
              let jsonresult = {
                  salename:salename
              }    
                  res.json(jsonresult);
              }
          });
      }
    }
  });
});

router.get('/quotation/:quotationid', async (req, res, next)=>{
  fs.access(path.join(__dirname,"/../files/quotation/ExportFile_ใบเสนอราคาเลขที่_"+req.params.quotationid+".pdf"), fs.F_OK, (err) => {
    if (err) {
      res.send('404 Not Found');
      return
    }else res.download(path.join(__dirname,"/../files/quotation/ExportFile_ใบเสนอราคาเลขที่_"+req.params.quotationid+".pdf"));
  });
});

router.get('/download/:filename', async (req,res,next) =>{
  jwt.verify(req.params.filename, 'key',(err,decoded)=>{
    if(decoded != undefined){
    fs.access(path.join(__dirname,decoded.data), fs.F_OK, (err) => {
      if (err) {
        res.send('404 Not Found');
        return
      }else res.download(path.join(__dirname,decoded.data));
    });
    }else res.send('404 Not Found');
  });
});

router.get('/user/userImage/:imageprofile', (req,res,next) =>{
    fs.readFile(__dirname+"/../files/image/"+req.params.imageprofile+".png", (err,content)=>{
      if (err) {
        res.sendStatus(404);
      } else {
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(content);
      }
    });
});

router.get('/store/registStore', (req, res, next) => { 
  store_model.getRegistStore((err, data) => {
    if (err || data == null) {
        res.send('something went wrong.');
    } else {
        res.json(data);
    }
  });
});

router.post('/appversion', (req, res, next) => {
    if(req.body.version === version.version)
      res.json({status:true});
    else
      res.json({status:false});
});

router.get('/checkserver', (req, res, next)=>{
  res.json({status:true});
});

router.post('/ecomproduct', (req, res, next)=>{
  product_model.getEcomProduct(req.body,(err,data)=>{
    if(err) console.log(err)
    else res.json(data);
  })
});

router.post('/requestpassword', async (req,res, next) =>{
  user_model.getUserByEmail(req.body.email,(err,data)=>{
    if(data != null){
      let password = makeid(8);
      user_model.changePassword(data.emp_id,password,(err,data)=>{
        if(err) console.log(err);
        else{
          mailOptions.to = req.body.email;
          mailOptions.subject = "Request password for Freshup."
          mailOptions.html = '<b>รหัสผ่านใหม่คือ:</b>'  + password +"<br> กรุณาเปลี่ยน password หลังจาก login อีกครั้ง";
          sendMail(mailOptions);
          res.json({body:true});
        }
      }); 
    }else {
      res.json({body:false});
    }
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
   try {
      if(err || !user || user.status == 'closed' || user.status == 'banned'){
        const error = new Error('An Error occured')
        return res.json({status:'false'});
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return res.json({'status':'false'});
        const body = { _id : user._id, emp_id : user.emp_id, role: user.role };
        const token = jwt.sign({ user : body },'key');
        if(user.status == 'waiting'){
                return res.json({ token, status: 'waiting' });
        }
        else{
          user_model.updateUser(user.emp_id,{'token':token,'status':'active', 'pushnoti':req.body.pushnoti}, (err, data) => {
            if (err) {
                return res.json({status:'false'});
           } else {
                return res.json({emp_id:user.emp_id, token, 'role': user.role, 'store':user.admin_store });
           }
         });
    	}
      });     
    } catch (error) {
          return res.json({status:'false'});
    }
  })(req, res, next);
});

let makeid = (length) =>{
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;