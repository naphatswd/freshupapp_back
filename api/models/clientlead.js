/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		assign lead for customer

----------------------------------------------*/

const db = require('./connectiondb.js');
let ObjectId = require('mongodb').ObjectID;
//Lead Schema
const leadSchema = db.Mongoose.Schema({
    CVNumber:{
        type:String,
        trim: true
    },
    Name:{
        type:String,
        trim: true
    },
    CVName:{
        type:String,
        trim:true
    },
    Type:{
        type:String
    },
    Loc:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:[]
    },
    Supplier:{
        type:String
    },
    Description:{
        type:[
            {
                _id:{
                    type:String,
                    required:true
                },
                createdAt:{
                    type:Date,
                    default:Date.now
                },
                text:{
                    type: String,
                    required:true
                },
                user:{
                    type:{
                        _id:{
                            type:Number,
                            required:true
                        },
                        avatar:{
                            type:String
                        },
                        name:{
                            type:String
                        }
                    }
                }
            }
        ]
    },
    Status:{
        type:String
    },
    Refer:{
        type:String
    },
    Store:{
        type:String
    }
}, {
    collection: 'Leads'
});
leadSchema.index({ "Loc": "2dsphere" });

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const leads = module.exports = db.Mongoose.model('Leads', leadSchema);

module.exports.newLead = function(data,callback){
    leads.updateOne({'_id':new ObjectId(data._id)},{$set:data},{upsert: true},callback);
}

module.exports.newCPClient = function(data,callback){
    if(data.Latitude > 0 && data.Longitude > 0 )
        leads.updateOne({'CVNumber':data.CVNumber},{$set:data},{upsert:true},callback);
    else callback
}

module.exports.newManyLeads = function(data,callback){
    leads.insertMany(data,callback);
}

module.exports.getCPClient = function(callback){
    leads.find({
        'CVNumber':{$exists:true}
    },{
        'Description':0,
    },callback)
}

module.exports.getNearest = function(data,callback){
    leads.find(
        {
            Loc:
            { $near :
               {
                 $geometry: { type: "Point",  coordinates: [ data.Longitude, data.Latitude ] },
                 $maxDistance: 10
               }
            },
            'Status':"Active"
        }, callback).limit(1);
}

module.exports.Othernearby = function(data,callback){
    leads.find(
        {
            Loc:
            { $near :
               {
                 $geometry: { type: "Point",  coordinates: [ data.Longitude, data.Latitude ] },
                 $maxDistance: 1000
               }
            },
            $or : [
                { 'Supplier':'CP' },
                { $and : [ { 'Supplier':{$ne:'CP'} }, { 'Type':data.Type } ] }
            ],
            'Status':"Active"
        }, callback);
}

module.exports.CPnearby = function(callback){
    leads.find(
        {
            'Supplier':"CP",
            'Status':"Active"
        }, callback);
}

module.exports.getObjectLeadDetail = function(data,callback){
    leads.find({'_id':ObjectId(data._id)},callback)
}

module.exports.getObjectLead = function(data,callback){
    leads.find({'_id':ObjectId(data._id)},{'Description':1,'_id':0},callback)
}

// Get all lead
module.exports.getleads = function(data,callback) {
    leads.find({
        'Supplier':data.supplier,
        'Type':data.Type,
        'status':"Active"
    }, {
        '__v': 0
    }, callback);
}