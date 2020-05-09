/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		deptor model

----------------------------------------------*/
const db = require('./connectiondb.js');
//deptor Schema
const deptorSchema = db.Mongoose.Schema({
    //deptor_id:{ type: Number, index: { unique: true } },
    CVNumber:{
        type:String
    },
    Salesman:{
        type:String
    },
    AccountNameTH:{
        type:String
    },
    outstanding:{
        type:Number
    },
    remaining:{
        type:Number
    },
    dayoverdue:{
        type:Number
    },
    out_updateon:{
        type:String
    }
}, {
    collection: 'deptors'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const deptors = module.exports = db.Mongoose.model('deptors', deptorSchema);

module.exports.newdeptor = function(data,callback){
    deptors.create(data,callback);
}

module.exports.getDeptorBySaleId = function(Salesman,date, callback){
    deptors.find({
        'Salesman':Salesman,
        'out_updateon':date
    },
    {
        '_id':0,
        'AccountNameTH':1,
        'outstanding':1,
        'remaining':1,
        'dayoverdue':1,
        'out_updateon':1
    },
    callback);
}

module.exports.getDeptor = function(date,callback, limit) {
    deptors.aggregate([
        {
            $match: {
                'outstanding':{$gt:0},
                'out_updateon':date
            }
        },
        {
            $lookup: {
                from: "Clients",
                localField: "CVNumber",
                foreignField: "CVNumber",
                as: "Clients"
            }
        },
        {
            $unwind:'$Clients'
        },
        {
            $project: {
                '_id': 0,
                'CVNumber':1,
                'Salesman':1,
                'AccountNameTH': 1,
                'CreditLimit':'$Clients.CreditLimit',
                'Lastorder':'$Clients.Lastorder',
                'outstanding':1,
                'remaining':1,
                'dayoverdue':1,
                'out_updateon': 1
            }
        }
    ]).exec(callback);
}

// Get all deptor
module.exports.getdeptors = function(callback, limit) {
    deptors.find({}, {
        'Type':0,
        'AccountNameEN':0,
        'Website':0,
        'CreditTerm':0,
        'PhotoUrl':0,
        'AccountSource':0,
        'TerritoryCode':0,
        'TerritoryName':0,
        'Description':0,
        'Remark':0,
        '_id': 0,
        '__v': 0
    }, callback);
}

// Update deptor
module.exports.updatedeptor = function(data, callback) {
    deptors.findOneAndUpdate({
        'CVNumber': data.CVNumber
    }, {$set: data}, {
        new: true
    }, callback);
}

// Delete deptor
module.exports.removedeptor = function(deptorid, callback) {
    deptors.findOneAndDelete({
        'deptor_id': deptorid
    }, callback);
}