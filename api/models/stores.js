/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		branch store model

----------------------------------------------*/
const db = require('./connectiondb.js');

//store Schema
const storeSchema = db.Mongoose.Schema({
    //_id:{ type: Number, index: { unique: true } },
    name:{
        type: String,
        required: true
    },
    model:{
        type:String
    },
    store_detail: {
        type: String,
        required: true
    },
    addr: {
        type: String,
        trim: true
    },
    location:{
        type:{
            lat: {type: Number},
            lon: {type:Number}
        }
    },
    store_id:{
        type:String,
        required:true,
        unique: true
    },
    sap_id:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ["active", "closed"],
        default: 'active'
    }
}, {
    collection: 'Stores'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const stores = module.exports = db.Mongoose.model('Stores', storeSchema);

module.exports.newstore = function(data,callback){
    stores.create(data,callback);
}

// Get all store
module.exports.getstores = function(callback, limit) {
    stores.find({}, {
        '__v': 0
    }, callback);
}

module.exports.getRegistStore = function(callback){
    stores.find({}, {
        '_id':0,
        'name': 1,
        'store_id':1,
        'status':1,
    }, callback);
}

module.exports.getNoti_Admin = function(sap_id,callback){
    stores.aggregate([
        {
            $match:{
              'sap_id': sap_id
            }
        },
        {
          $project:{"store_id":1}
        },
        {
            $lookup:{
                from: "Users",
                let: { store_id: "$store_id", role: 'admin'},
                pipeline: [
                { $match: 
                    { $expr: 
                        { $and: 
                            [
                                { $or: ["$admin_store",[["$$store_id"]]] },
                                { $eq: ["$role","$$role"] }
                            ]
                        }
                    }
                }
                ],
                  as: "Users"
            }
        },{
            $unwind:"$Users"
        },{
            $group:{
                _id:"$Users.pushnoti"
            }
        },{
            $project:{
                "_id":0,
                "pushnoti":"$_id"
            }
        }
    ]).exec((callback));
  }

// Get store by email
module.exports.getstoreById= function(store_id, callback) {
    stores.findOne({
        'store_id': store_id
    }, {
        '__v': 0
    }, callback);
}

module.exports.getstoreLocation= function(store_id, callback) {
    stores.findOne({
        'store_id': store_id
    }, {
        'location.lat': 1,
        'location.lon': 1,
        '_id':0
    }, callback);
}

module.exports.getstoreNameById= function(_id, callback) {
    stores.findOne({
        'store_id': store_id
    }, {
        'name': 1,
        '_id':0
    }, callback);
}

// Update store
module.exports.updatestore = function(data, callback) {
    stores.updateOne({
        'store_id': data.store_id
    }, {$set: data}, {
        new: true
    }, callback);
}

// Delete store
module.exports.removestore = function(store_id, callback) {
    stores.findOneAndDelete({
        'store_id': store_id
    }, callback);
}