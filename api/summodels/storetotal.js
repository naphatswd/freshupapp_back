/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		sum by month

----------------------------------------------*/

const db = require('../models/connectiondb.js');

//store Schema
const sumSchema = db.Mongoose.Schema({
    //_id:{ type: Number, index: { unique: true } },
    data:{
        type:[
            {
                CVLabel:{
                    type:String
                },
                CVType:{
                    type:String
                },
                CVTypeCode:{
                    type:String
                },
                Chsum:{
                    type:Number
                }
            }
        ]
    },
    groupsale:{
        type:[
            {
                SalesCode:{
                    type:String
                },
                SalesName:{
                    type:String
                },
                Salesum:{
                    type:Number
                }
            }
        ]
    },
    amount:{
        type:Number
    },
    avg:{
        type:Number
    },
    rr:{
        type:Number
    },
    month:{
        type:String
    },
    year:{
        type:String
    },
    store_id:{
        type:String
    },
    b2c:{
        type:Number
    },
    today:{
        type:Number
    }
}, {
    collection: 'Sumstore'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const sumStore = module.exports = db.Mongoose.model('Sumstore', sumSchema);

module.exports.getStoreTotal = function(store_id, callback){
    sumStore.find({'store_id':store_id},callback);
}

module.exports.getStoreTotalMonthYear = function(data, callback){
    sumStore.find({
        'store_id':data.adm_store,
        'month':data.month,
        'year':data.year
    },{'_id':0,'data._id':0,'groupsale._id':0},callback);
}

// Update store
module.exports.updatestore = function(store_id, data, callback) {
    sumStore.findOneAndUpdate({
        'store_id': store_id,
        'month':data.month,
        'year':data.year
    }, {$set: data}, {upsert:true}, callback);
}

// Delete store
module.exports.removestore = function(store_id, callback) {
    sumStore.findOneAndDelete({
        'store_id': store_id
    }, callback);
}