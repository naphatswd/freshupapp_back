/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		create and verify otp

----------------------------------------------*/

const db = require('./connectiondb.js');

//OTP Schema
const otpSchema = db.Mongoose.Schema({ 
    otp:{
        type:String
    },
    email:{
        type:String,
        unique: true
    },
    valid_date:{
        type:Date,
        default: Date.now
    }
}, {collection:'Otp'});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const Otp = module.exports =  db.Mongoose.model('Otp', otpSchema);

module.exports.createOTP = function(data, callback) {
    Otp.findOneAndUpdate({'email': data.email}, 
                    {$set: {'otp':data.otp, 'valid_date':new Date()}},
                    {
                        new: true,
                        upsert: true // Make this update into an upsert
                    },
    callback);
}

module.exports.checkOTP = function(data, callback){
    Otp.find({
        'email':data.email,
        'otp':data.otp
    },{'_id':0,'valid_date':1},callback)
}

// Delete OTP
module.exports.removeOtp = function(data, callback) {
	Otp.deleteOne({'email':data.email, 'otp':data.otp}, callback);
}
