
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		Db for staff attendance

----------------------------------------------*/

const db = require('./connectiondb.js');
const moment = require('../../node_modules/moment-timezone');

let today = moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD");

//attendance Schema
const attendanceSchema = db.Mongoose.Schema({
    emp_id: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        default: today
    },
    status:{
        type:String,
        enum: ["checkin","resting","resume","leave"],
        required: true
    },
    time_stamp:{
        type:Date,
        default:Date.now
    },
    store_id:{
        type:String
    }
}, {
    collection: 'Attendance'
});


//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const attendance = module.exports = db.Mongoose.model('Attendance', attendanceSchema);

module.exports.newAttendance = function(data, callback) {
    attendance.create(data,callback);
}

// Get all attendance
module.exports.getAttendance = function(callback, limit) {
    attendance.find({}, {
        '__v': 0
    }, callback);
}

// Get attendance by ID
module.exports.getAttendanceByStoreId = function(store_id, callback) {
    attendance.find({
        'store_id': store_id
    }, {
        '__v': 0
    }, callback);
}

module.exports.getAttendanceByStoreAndDate = function(store_id,date, callback) {
    attendance.aggregate([
        {
            $match:{
                'date': date,
                'store_id':store_id
            }
        }
    ]).exec(callback);
}

// Get attendance by emp_id
module.exports.getAttendanceByDateAndEmpId = function(start,end,emp_id, callback) {
    attendance.find({
        'time_stamp': {$gte:start,$lte:end},
        'emp_id':emp_id
    }, {
        '__v': 0
    }, callback);
}

// Get attendance by emp_id
module.exports.getAttendanceByEmpId = function(emp_id, callback) {
    attendance.find({
        'emp_id': emp_id
    }, {
        '__v': 0
    }, callback);
}

// Update attendance
module.exports.updateAttendance = function(_id, data, options, callback) {
    attendance.findOneAndUpdate({
        '_id': _id
    }, {
        $set: data
    }, options, callback);
}


module.exports.removeattenByEmp = function(emp_id, callback) {
    attendance.remove({
        'emp_id': emp_id
    }, callback);
}

// Delete attendance
module.exports.removeattendance = function(_id, callback) {
    attendance.remove({
        '_id': _id
    }, callback);
}