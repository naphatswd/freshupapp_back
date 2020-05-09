/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		dncn model

----------------------------------------------*/

const db = require('./connectiondb.js');

//dncn Schema
const dncnSchema = db.Mongoose.Schema({
    InvoiceNumber:{ type: String, ref: 'Invoice'},
    Year:{
        type: String,
        required: true
    },
    CVNumber: {
        type:String,
        required:true
    },
    SONumber:{
        type: String,
        required: true,
        trim: true
    },
    Type:{
        type: String,
        required: true,
        trim: true
    },
    IssueDate:{
        type: Date,
        required: true,
        trim: true
    },
    SalesmanCode:{
        type: String,
        required: true,
        trim: true
    },
    Store:{
        type: String,
        required: true,
        trim: true
    },
    TotalSales:{
        type: Number,
        required: true,
        trim: true
    },
    EndOfBillDiscount:{
        type: Number,
        required: true,
        trim: true
    },
    LineItemDiscount:{
        type: Number,
        required: true,
        trim: true
    },
    Discount:{
        type: Number,
        required: true,
        trim: true
    },
    NetAmount:{
        type: Number,
        required: true,
        trim: true
    },
    VatAmount:{
        type: Number,
        required: true,
        trim: true
    },
    TotalAmount:{
        type: Number,
        required: true,
        trim: true
    },
    Status:{
        type: String,
        required: true,
        trim: true
    },
    PaymentStatus:{
        type: String,
        required: true,
        trim: true
    },
    DeliveryStatus:{
        type: String,
        required: true,
        trim: true
    },
    DeliveryDate:{
        type: String,
        required: true,
        trim: true
    },
    TransactionControlCode:{
        type: String,
        required: true,
        trim: true
    },
    TransactionControl:{
        type: String,
        required: true,
        trim: true
    },
    TransactionCode:{
        type: String,
        required: true,
        trim: true
    },
    TransactionName:{
        type: String,
        required: true,
        trim: true
    },
    CNDNNumber:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    OriginalInvoiceValue:{
        type: Number,
        required: true,
        trim: true
    },
    CorrectProductValue:{
        type: Number,
        required: true,
        trim: true
    },
    Difference:{
        type: Number,
        required: true,
        trim: true
    },
    Account:{
        type: String,
        trim: true
    },   
    ShipToAddress:{
        type: String,
        trim: true
    },
    BillToAddress:{
        type: String,
        trim: true
    },
    LineItemList: {
        type: [
                {
                    InvoiceLineItemName:{
                        type:String,
                        required: true
                    },
                    ProductCode:{
                        type:String,
                        required: true
                    },
                    UOMType:{
                        type:String,
                        required: true
                    },
                    QuantitySales:{
                        type:Number,
                        required: true
                    },
                    WeightSales:{
                        type:Number,
                        required: true
                    },
                    WeightSalesUOM:{
                        type:String,
                        required: true
                    },
                    PricePerUnit:{
                        type:Number,
                        required: true
                    },
                    DiscountPerUnit:{
                        type:Number,
                        required: true
                    },
                    NetPricePerUnit:{
                        type:Number,
                        required: true
                    },
                    TotalPrice:{
                        type:Number,
                        required: true
                    },
                    TotalDiscount:{
                        type:Number,
                        required: true
                    },
                    TotalNetPrice:{
                        type:Number,
                        required: true
                    },
                    IsFreeOfGoods:{
                        type:Boolean,
                        required: true
                    },
                    Status:{
                        type:String,
                        required: true
                    }
                }
        ],
        required: true
    }
}, {
    collection: 'Dncn'
});


//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const dncn = module.exports = db.Mongoose.model('Dncn', dncnSchema);

module.exports.newDncn = function(data, callback) {
    dncn.updateOne({'CNDNNumber':data.CNDNNumber},{$set:data},{upsert:true},callback);
}

// Get all dncn
module.exports.getDncn = function(callback, limit) {
    dncn.findOne({}, {
        '__v': 0
    }, callback);
}

module.exports.getCorrectValueByInvoice =async (InvoiceNumber,callback) =>{
    await dncn.findOne({'InvoiceNumber':InvoiceNumber}, 
    {
        'CorrectProductValue': 1,
        '_id' :0
    }, callback);
}

module.exports.getDncnByInvoice = async (InvoiceNumber,callback, limit)=> {
    await dncn.findOne({'InvoiceNumber':InvoiceNumber}, 
    {
        'LineItemList': 1,
        'CorrectProductValue':1,
        '_id':0
    }, callback);
}

module.exports.getDncnByDate = function(date, callback) {
    dncn.find({
        'IssueDate': date
    }, {
        '__v': 0
    }, callback);
}

module.exports.getDncnByMonth = function(date, callback) {
    let start = new Date(date.year,date.month,1);
    let end = new Date(date.year,date.month,31);
    dncn.find({
        'IssueDate': {$gte: start, $lte: end}
    }, {
        '__v': 0
    }, callback);
}


// Update dncn
module.exports.updateDncn = function(_id, data, options, callback) {
    dncn.findOneAndUpdate({
        '_id': _id
    }, {
        $set: data
    }, options, callback);
}

// Delete dncn
module.exports.removeDncn = function(_id, callback) {
    dncn.remove({
        '_id': _id
    }, callback);
}