
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		transaction B2C model

----------------------------------------------*/
const db = require('./connectiondb.js');

//transaction Schema
const transactionSchema = db.Mongoose.Schema({
    //_id:{ type: Number, index: { unique: true } },
    store_id:{
        type: String,
        required: true
    },
    CREATE_DATE: {
        type: Date,
        required: true
    },
    DOC_NUMBER: {
        type: String,
        required: true,
        trim: true
    },
    Year:{
        type: String
    },
    Month:{
        type: String
    },
    PRODUCT_CODE:{
        type:String,
        required:true
    },
    Cat:{
        type:String,
    },
    QUANTITY: {
        type: Number,
        required:true
    },
    AMOUNT:{
        type: Number
    }
}, {
    collection: 'Transactions'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const transactions = module.exports = db.Mongoose.model('Transactions', transactionSchema);

module.exports.newtransaction = function(data,callback){
    transactions.updateOne(
         {$and:[{'DOC_NUMBER':data.DOC_NUMBER},{'PRODUCT_CODE':data.PRODUCT_CODE},{'CREATE_DATE':data.CREATE_DATE}]}
        ,{$set:data},{upsert:true},callback);
   // transactions.create(data,callback);
}

module.exports.insertManyTran = function(data,callback){
    transactions.insertMany(data,callback);
}

module.exports.getProductOnly = function(callback){
    transactions.aggregate([
        {
            $group:{
                _id:"$PRODUCT_CODE"
            }
        }
    ]).exec(callback);
}

// Get all transaction
module.exports.gettransactions = function(data,callback, limit) {
    transactions.find({
        'Month': data.Month,
        'Year':data.Year,
        'store_id':data.store_id}, {
        '__v': 0
    }, callback);
}

module.exports.exportsByMonth = function(data,callback){
    transactions.aggregate([
        {
            $match:{
                'Month': data.Month,
                'Year':data.Year,
                'store_id':data.store_id
            }
        }
    ]).exec(callback);
}

module.exports.getTransactionssumByMonth = function(data,callback){
    transactions.aggregate([
        {
            $match:{
                'Month': data.Month,
                'Year':data.Year,
                'store_id':data.store_id
            }
        },{
            $group:{
                _id:'$Month',
                sumtotal:{$sum:"$AMOUNT"}
            }
        }
    ]).exec(callback);
}

module.exports.getTransactions= function(data,callback){
    transactions.aggregate([
        {
            $match:{
                'Month': data.Month,
                'Year':data.Year,
                'store_id':data.store_id
            }
        }
    ]).exec(callback);
}

module.exports.getTransactionsByMonth = function(data, callback){
    transactions.aggregate([
        {
            $match:{
              'store_id': data.store_id,
              'Month':data.Month,
              'Year':data.Year
            }
        },{
            $group: {
              _id:{"Cat":"$Cat","Date":{ $dateToString: {date:"$CREATE_DATE",format:"%Y-%m-%d" }}},
              sumAmount: {$sum:'$AMOUNT'}
            }
          },{
            $project: {
              '_id':0,
              'Date':'$_id.Date',
              'Cat':'$_id.Cat',
              'sumAmount':"$sumAmount"
            }
          }
    ]).exec(callback);
}

module.exports.getTransactionsBtwDate = function(data, callback){
    transactions.aggregate([
        {
            $match:{
              'store_id': data.store_id,
              'CREATE_DATE':{
                    $gte:new Date(data.startDate),
                    $lte:new Date(data.endDate)
                },
            }
        },{
            $group: {
              _id:{"Cat":"$Cat","Date":{ $dateToString: {date:"$CREATE_DATE",format:"%Y-%m-%d" }}},
              sumAmount: {$sum:'$AMOUNT'}
            }
          },{
            $project: {
              '_id':0,
              'Date':'$_id.Date',
              'Cat':'$_id.Cat',
              'sumAmount':"$sumAmount"
            }
          }
    ]).exec(callback);
}

module.exports.getTransactionsByDate = function(data, callback){
    transactions.aggregate([
        {
            $match:{
              'store_id': data.store_id,
              'CREATE_DATE':{
                    $gte:new Date(data.startDate),
                    $lte:new Date(data.endDate)
                },
            }
        },{
            $group: {
              _id:{"Cat":"$Cat","Date":{ $hour: "$CREATE_DATE" }},
              sumAmount: {$sum:'$AMOUNT'}
            }
          },{
            $project: {
              '_id':0,
              'Date':'$_id.Date',
              'Cat':'$_id.Cat',
              'sumAmount':"$sumAmount"
            }
          }
    ]).exec(callback);
}


module.exports.getTransactionByCatDate =function(data, callback){
    transactions.aggregate([
        {
            $match:{
                'store_id': data.store_id,
                'Cat': data.cat,
                'CREATE_DATE':{
                    $gte:new Date(data.startDate),
                    $lte:new Date(data.endDate)
                },
            }
        },{
            $lookup: {
                from:"Products",
                localField: "PRODUCT_CODE",
                foreignField: "ProductCode",
                as: "Product"
                
            }
        },{
            $group: {
              _id:{"PRODUCT_CODE":"$PRODUCT_CODE","Product_Name":"$Product.ProductNameTH","Date":{ $hour: "$CREATE_DATE" }},
              sumAmount: {$sum:'$AMOUNT'}
            }
          },{
            $project: {
              '_id':0,
              'Date':'$_id.Date',
              'PRODUCT_CODE':'$_id.PRODUCT_CODE',
              'Product_Name':"$_id.Product_Name",
              'sumAmount':"$sumAmount"
            }
          }
    ]).exec(callback);
}

module.exports.gettransactionByDateStore = function(data, callback){
    transactions.aggregate([
        {
            $match:{
              'store_id': data.store_id,
              'CREATE_DATE':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },{
            $lookup: {
                from:"Products",
                localField: "PRODUCT_CODE",
                foreignField: "ProductCode",
                as: "Product"
                
            }
        },{
            $unwind:{
              path:'$Product',
              "preserveNullAndEmptyArrays": true}
          },{
            $group: {
              _id:{"Cat":"$Product.Cat","Date":"$CREATE_DATE"},
              sumAmount: {$sum:'$AMOUNT'},
              sumQUANTITY:{$sum:'$QUANTITY'},
            }
          },{
            $project: {
              '_id':0,
              'Date':'$_id.Date',
              'Cat':'$_id.Cat',
              'sumAmount':"$sumAmount",
              'sumQUANTITY': "$sumQUANTITY"
            }
          }
    ]).exec(callback);
}

// Update transaction
module.exports.updatetransaction = function(data, callback) {
    transactions.updateMany({
        'PRODUCT_CODE': data.ProductCode,
        "CREATE_DATE": { $gte: new Date(data.startDate) },
        "CREATE_DATE": { $lte: new Date(data.endDate) },
        'Cat':{$exists:false}
    },{$set: {"Cat":data.Cat}},{
        new: true
    }, callback);
}

// Delete transaction
module.exports.removetransaction = function(data,callback) {
    transactions.deleteMany({
        'store_id': data.store_id,
    }, callback);
}