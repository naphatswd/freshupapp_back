
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		DB client

----------------------------------------------*/
const db = require('./connectiondb.js');
//client Schema
const clientSchema = db.Mongoose.Schema({
    //client_id:{ type: Number, index: { unique: true } },
    CVNumber:{
        type:String,
        unique: true,
        trim: true
    },
    AccountNameTH:{
        type:String,
        trim: true
    },
    Store:{
        type:String
    },
    TaxID:{
        type:String
    },
    Phone:{
        type:String
    },
    CVLabel:{
        type:String
    },
    CVType:{
        type:String
    },
    CVTypeCode:{
        type:String
    },
    CustomerPrice:{
        type:String
    },
    CreditLimit:{
        type:Number
    },
    CreditTerm:{
        type:String
    },
    Status:{
        type:String
    },
    StatusDate:{
        type:Date
    },
    Salesman:{
        type:String
    },
    Latitude:{
        type:String
    },
    Longitude:{
        type:String
    },
    Lastorder: {
        type: Date
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
        type:Date
    }
}, {
    collection: 'Clients'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const clients = module.exports = db.Mongoose.model('Clients', clientSchema);

module.exports.newClient = function(data,callback){
    clients.updateOne({'CVNumber':data.CVNumber},{$set:data},{upsert: true},callback);
}

module.exports.getClientbyStore = function(data, callback){
    clients.find({
        'Store':data.adm_store,
    },{
        '_id':0,
        'CVNumber': 1,
        'AccountNameTH':1,
        'Lastorder':1,
        'Salesman':1,
        'CustomerPrice':1,
        'CreditLimit':1}
    ,callback);
}

// Get all client
module.exports.getclients = function(callback, limit) {
    clients.find({}, {
        '_id': 0,
        '__v': 0
    }, callback);
}

module.exports.getCVName = function(callback, limit) {
    clients.find({}, {
        'CVNumber':1,
        'AccountNameTH':1,
        'CVType':1,
        '_id': 0
    }, callback);
}

module.exports.getclientQuotation = function(SalesCode, callback){
    clients.aggregate([
        {
            $match: {
                'Salesman': SalesCode,
            }
        },
        {
            $project: {
                '_id': 0,
                'CVNumber': 1,
                'AccountNameTH':1,
                'CustomerPrice':1,
                'Store':1
            }
        }
    ]).exec(callback);
}

module.exports.getCVnoLead = function(store_id,callback){
    clients.aggregate([
        {
            $match:{
                'Store':{$in:store_id},
                $or:[
                    {"Latitude":{$exists:false}},
                    {'Longitude':{$exists:false}},
                    {"Latitude":0},
                    {'Longitude':0},
            ]
            }
        },{
            $project:{
                '_id':0,
                'CVNumber':1,
                'Name':'$AccountNameTH',
                'Type':'$CVType'
            }
        }
    ]).exec(callback);    
}

module.exports.getGroupCustbtwDate = function(data,callback){
    clients.aggregate([
        {
            $match: {
                'Salesman': data.SalesmanCode
            }
        },
        {
            $lookup: {
                from: "Invoice",
                localField: "CVNumber",
                foreignField: "Account.CVNumber",
                as: "Invoice"
            }
        },
        {$unwind:"$Invoice"},
        {
            $match: {
                'Invoice.IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "Invoice.InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $group:{
                _id: "$CVNumber",
                CVName:{$last:"$AccountNameTH"},
                IssueDate: { $addToSet:'$Invoice.IssueDate'},
                Lastorder:{ $last:'$Lastorder'},
                totalNet:{ $sum:"$Invoice.NetAmount"},
                Difference:{ $sum:{ $arrayElemAt: [ "$Dncn.Difference", 0 ] }},
            }
        }
    ]).exec(callback);
}

module.exports.getExportDeptor = function(date, callback) {
    clients.aggregate([
        {
            $lookup: {
                from: "deptors",
                let: { cvNumber: "$CVNumber", date: date },
                pipeline: [
                { $match: 
                    { $expr: 
                        { $and: 
                            [
                                { $eq: ["$CVNumber","$$cvNumber"] },
                                { $eq: ["$out_updateon","$$date"] },
                            ]
                        }
                    }
                }
                ],
                as: "Deptors"
            }
        },
        {
            $project: {
                '_id': 0,
                'CVNumber': 1,
                'Salesman':1,
                'AccountNameTH':1,
                'Lastorder':1,
                'CreditLimit':1,
                'outstanding':{ $ifNull: [{ $arrayElemAt: ['$Deptors.outstanding',0]},0]},
                'remaining':{ $ifNull: [{ $arrayElemAt: ['$Deptors.remaining',0]},0]},
                'dayoverdue':{ $ifNull: [{ $arrayElemAt: ['$Deptors.dayoverdue',0]},0]},
                'out_updateon':{ $ifNull: [{ $arrayElemAt: ['$Deptors.out_updateon',0]},0]}
            }
        }
    ]).exec(callback);
}

// Get client by SaleID
module.exports.getclientBySaleId = function(Salesman,date, callback) {
    clients.aggregate([
        {
            $match: {
                'Salesman': Salesman,
            }
        },
        {
            $lookup: {
                from: "deptors",
                let: { cvNumber: "$CVNumber", date: date },
                pipeline: [
                { $match: 
                    { $expr: 
                        { $and: 
                            [
                                { $eq: ["$CVNumber","$$cvNumber"] },
                                { $eq: ["$out_updateon","$$date"] },
                            ]
                        }
                    }
                }
                ],
                as: "Deptors"
            }
        },
        {
            $project: {
                '_id': 0,
                'CVNumber': 1,
                'AccountNameTH':1,
                'Lastorder':1,
                'Latitude':1,
                'Longitude':1,
                'CreditLimit':1,
                'outstanding':{ $ifNull: [{ $arrayElemAt: ['$Deptors.outstanding',0]},0]},
                'remaining':{ $ifNull: [{ $arrayElemAt: ['$Deptors.remaining',0]},0]},
                'dayoverdue':{ $ifNull: [{ $arrayElemAt: ['$Deptors.dayoverdue',0]},0]},
                'out_updateon':{ $ifNull: [{ $arrayElemAt: ['$Deptors.out_updateon',0]},0]}
            }
        }
    ]).exec(callback);
}

// Get client by email
module.exports.getclientByCv = function(CVNumber, callback) {
    clients.findOne({
        'CVNumber': CVNumber
    }, {
        '_id': 0,
        '__v': 0
    }, callback);
}

// Update client
module.exports.updateclient = function(data, callback) {
    clients.findOneAndUpdate({
        'CVNumber': data.CVNumber
    }, {$set: data}, {
        new: true
    }, callback);
}

// Delete client
module.exports.removeclient = function(CVNumber, callback) {
    clients.findOneAndDelete({
        'CVNumber': CVNumber
    }, callback);
}