/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		staff vacatino model

----------------------------------------------*/

const db = require('./connectiondb.js');

//vacation Schema
const vacationSchema = db.Mongoose.Schema({
    emp_id:{
        type:String,
        required:true,
        trim:true
    },
    vactype:{
        type: String,
            enum: [
                "vacation",
                "business",
                "sick",
                "other"
            ],
        required: true
    },
    date: [{
        type:Date,
        required:true
    }],
    detail:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type:String,
        required: true,
        enum: [
        "rejected",
        "waiting",
        "approved"
        ],
        default: 'waiting'
    }
}, {
    collection: 'Vacation'
});


//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const vacation = module.exports = db.Mongoose.model('Vacation', vacationSchema);

module.exports.newVacation = function(data, callback) {
    vacation.create(data,callback);
}

// Get all vacation
module.exports.getVacation = function(callback, limit) {
    vacation.find({}, {
        '__v': 0
    }, callback);
}


module.exports.getVacationByDate = function(date, callback) {
    vacation.findOne({
        'date': date
    }, {
        '__v': 0
    }, callback);
}

// Get vacation by emp_id
module.exports.getVacationByDateAndEmpId = async function(date,emp_id,callback) {
  await vacation.find({ 
        'date': { $in: [ date ] }, 
        'emp_id': emp_id 
    }, {
        '_id':0,
        '__v': 0
    }, callback );
}

// Get vacation by emp_id
module.exports.getVacationByEmpId = function(emp_id, callback) {
    vacation.find({
        'emp_id': emp_id
    }, {
        '__v': 0
    }, callback);
}

// Update vacation
module.exports.updateVacation = function(_id, data, options, callback) {
    vacation.findOneAndUpdate({
        '_id': _id
    }, {
        $set: data
    }, options, callback);
}

// Delete vacation
module.exports.removeVacation = function(_id, callback) {
    vacation.remove({
        '_id': _id
    }, callback);
}