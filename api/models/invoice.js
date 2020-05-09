/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		invoices model

----------------------------------------------*/

const db = require('./connectiondb.js');

//invoice Schema
const invoiceSchema = db.Mongoose.Schema({
    //invoice_id:{ type: Number, index: { unique: true } },
    InvoiceNumber:{
        type:String,
        unique: true
    },
    Year:{
        type: String
    },
    Month:{
        type: String
    },
    CompanyCode:{
        type: String
    },
    DocType:{
        type: String
    },
    DocTypeSMARTSoft: {
        type: String
    },
    CVNumber: {
        type: String
    },
    SONumber: {
        type: String
    },
    Type: {
        type: String
    },
    ShipToSeq: {
        type: String
    },
    BillToSeq: {
        type: String
    },
    IssueDate: {
        type: Date
    },
    CreditTerm: {
        type: Number
    },
    SalesmanCode: {
        type: String
    },
    Store: {
        type: String
    },
    TotalSales: {
        type: Number
    },
    EndOfBillDiscount: {
        type: Number
    },
    LineItemDiscount: {
        type: Number
    },
    Discount: {
        type: Number
    },
    NetAmount: {
        type: Number
    },
    VatAmount: {
        type: Number
    },
    TotalAmount: {
        type: Number
    },
    Status: {
        type: String
    },
    PaymentStatus: {
        type: String
    },
    DeliveryStatus: {
        type: String
    },
    DeliveryDate: {
        type: Date
    },
    TransactionControlCode: {
        type: String
    },
    TransactionControl: {
        type: String
    },
    TransactionCode: {
        type: String
    },
    TransactionName: {
        type: String
    },
    Remark: {
        type: String
    },
    isDNCN:{
        type:Boolean,
        default:false
    },
    SaleName:{
        type:String,
        default:""
    },
    LineItemList: {
        type: [
                {
                    InvoiceLineItemName:{
                        type:String
                    },
                    ProductCode:{
                        type:String
                    },
                    ProductName:{
                        type:String
                    },
                    UOMType:{
                        type:String
                    },
                    QuantitySales:{
                        type:Number
                    },
                    QuantitySalesUOM:{
                        type:String
                    },
                    WeightSales:{
                        type:Number
                    },
                    WeightSalesUOM:{
                        type:String
                    },
                    PricePerUnit:{
                        type:Number
                    },
                    NetPricePerUnit:{
                        type:Number
                    },
                    TotalPrice:{
                        type:Number
                    },
                    TotalDiscount:{
                        type:Number
                    },
                    TotalNetPrice:{
                        type:Number
                    },
                    IsFreeOfGoods:{
                        type:Boolean
                    },
                    Status:{
                        type:String
                    }
                }
        ]
    },
    Account: {
        type: [
                {
                    CVNumber:{
                        type:String
                    },
                    ParentCVNumber:{
                        type:String
                    },
                    AccountNameTH:{
                        type:String
                    },
                    AccountNameEN:{
                        type:String
                    },
                    TaxID:{
                        type:String
                    },
                    Type:{
                        type:String
                    },
                    Phone:{
                        type:String
                    },
                    Website:{
                        type:String
                    },
                    PhotoUrl:{
                        type:String
                    },
                    AccountSource:{
                        type:String
                    },
                    BusinessType:{
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
                    Latitude:{
                        type:Number
                    },
                    Longitude:{
                        type:Number
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
                    TerritoryCode:{
                        type:String
                    },
                    TerritoryName:{
                        type:String
                    },
                    Description:{
                        type:String
                    },
                    Remark:{
                        type:String
                    }
                }
        ]
    },
    ShipToAddress: {
        type: [
                {
                    Name:{
                        type:String
                    },
                    CVNumber:{
                        type:String
                    },
                    AddressNumber:{
                        type:String
                    },
                    Phone:{
                        type:String
                    },
                    AddressStreet:{
                        type:String
                    },
                    AddressStreet2:{
                        type:String
                    },
                    AddressDistrict:{
                        type:String
                    },
                    AddressSubdistrict:{
                        type:String
                    },
                    AddressProvince:{
                        type:String
                    },
                    AddressCountry:{
                        type:String
                    },
                    AddressZipCode:{
                        type:String
                    },
                    AddressDistrictCode:{
                        type:String
                    },
                    AddressSubdistrictCode:{
                        type:String
                    },
                    AddressProvinceCode:{
                        type:String
                    },
                    AddressCountryCode:{
                        type:String
                    },
                    Latitude:{
                        type:Number
                    },
                    Longitude:{
                        type:Number
                    },
                    Fax:{
                        type:String
                    },
                    FaxExt:{
                        type:String
                    },
                    Remark:{
                        type:String
                    }
                }
        ]
    },
    BillToAddress: {
        type: [
                {
                    Name:{
                        type:String
                    },
                    CVNumber:{
                        type:String
                    },
                    AddressNumber:{
                        type:String
                    },
                    Phone:{
                        type:String
                    },
                    AddressStreet:{
                        type:String
                    },
                    AddressStreet2:{
                        type:String
                    },
                    AddressDistrict:{
                        type:String
                    },
                    AddressSubdistrict:{
                        type:String
                    },
                    AddressProvince:{
                        type:String
                    },
                    AddressCountry:{
                        type:String
                    },
                    AddressZipCode:{
                        type:String
                    },
                    AddressDistrictCode:{
                        type:String
                    },
                    AddressSubdistrictCode:{
                        type:String
                    },
                    AddressProvinceCode:{
                        type:String
                    },
                    AddressCountryCode:{
                        type:String
                    },
                    Latitude:{
                        type:Number
                    },
                    Longitude:{
                        type:Number
                    },
                    Fax:{
                        type:String
                    },
                    FaxExt:{
                        type:String
                    },
                    Remark:{
                        type:String
                    }
                }
        ]
    }
}, {
    collection: 'Invoice'
});
//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const invoices = module.exports = db.Mongoose.model('Invoice', invoiceSchema);

module.exports.newInvoice = function(json,callback){
    invoices.find({'InvoiceNumber':json.InvoiceNumber},{'_id':0},
        (err,data)=>{
            if(err) console.log(err);
            else{
                if(data.length > 0){
                    callback
                }else{
                    invoices.updateOne({'InvoiceNumber':json.InvoiceNumber},{$set:json},{upsert:true},callback);
                }
            }
    });
}

module.exports.getProductByMonthStore = function(data,callback){
    invoices.aggregate([
        {
            $match: {
                'Month':data.Month,
                'Store':data.store_id
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
                '_id': 0,
                'InvoiceNumber':1,
                'Account':1,
                'LineItemList':1,
                'IssueDate':1,
                'Store':1,
                'NetAmount':1,
                'Month':1,
                'Dncn.LineItemList': 1,
            }
        }
    ]).exec(callback);
}

module.exports.getProductOnly = function(data,callback){
    invoices.aggregate([
        {
            $match: {
                'IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $lookup: {
                from: "Products",
                localField: "LineItemList.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }
        },
        { 
            $project: {
            '_id': 0,
            'InvoiceNumber':1,
            'LineItemList':1,
            'Dncn.LineItemList': 1,
            'Products.ProductCode':1,
            'Products.ProductNameTH':1,
            'Products.Cat':1
            }
        }
    ]).exec(callback);
} 

module.exports.getGroupProduct = function(callback){
    invoices.aggregate([
        {
            $lookup: {
                from: "Products",
                localField: "LineItemList.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }
        },
        {
            $unwind:"$Products"
        },{
            $group:{
                _id:"$Products.ProductCode",
            }
        },
        {
            $unwind:"$_id"
        }
    ]).exec(callback);
}

module.exports.getProductByCatOnly = function(data,callback){
    invoices.aggregate([
        {
            $match: {
                'IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $lookup: {
                from: "Products",
                localField: "LineItemList.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }
        },
        {    $match:{
                'Products.Cat':data.Cat
            }
        },
        { 
            $project: {
            '_id': 0,
            'InvoiceNumber':1,
            'LineItemList':1,
            'Dncn.LineItemList': 1,
            'Products.ProductCode':1,
            'Products.ProductNameTH':1,
            'Products.Cat':1
            }
        }
    ]).exec(callback);
} 

module.exports.getCVName = function(InvoiceNumber,callback){
    invoices.findOne({'InvoiceNumber':InvoiceNumber},{'_id':0,'Account.AccountNameTH':1},callback);
}

module.exports.getSumofMonth = function(Month,Year,callback){
    invoices.aggregate([
        { $match: { Month: Month,Year: Year }},
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $group:{
                _id:"$Month",
                totalNet:{ $sum:"$NetAmount"},
                Difference:{ $sum:{ $arrayElemAt: [ "$Dncn.Difference", 0 ] }},
            }
        }
    ]).exec(callback);
}

// Get invoice by Date
module.exports.getInvoiceBtwDate = function(data, callback) {
    invoices.aggregate([
        { $match: {
            'IssueDate':{
                $gte: new Date(data.startDate),
                $lte: new Date(data.endDate)
            }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
                '_id': 0,
                'InvoiceNumber':1,
                'CVNumber':1,
                'NetAmount':1,
                'IssueDate':1,
                'TotalAmount':1,
                'SONumber':1,
                'Account.AccountNameTH':1,
                'Account.CVLabel':1,
                'Account.CVType':1,
                'Account.CVTypeCode':1,
                'Account.CustomerPrice':1,
                'Account.Salesman':1,
                'LineItemList':1,
                'ShipToAddress.AddressStreet':1,
                'ShipToAddress.AddressStreet2':1,
                'BillToAddress.AddressStreet':1,
                'BillToAddress.AddressStreet2':1,
                'Dncn.CorrectProductValue': 1,
                'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceCVBtwDateStore = function(data,callback){
    invoices.aggregate([
        { $match: {
            'Account.CVTypeCode': data.CVTypeCode,
            'Store':data.store_id,
            'IssueDate':{
                $gte: new Date(data.startDate),
                $lte: new Date(data.endDate)
            }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },{
            $lookup:{
                from:"Users",
                localField:"Account.Salesman",
                foreignField:"emp_id",
                as:"Users"
            }
        },
        { $unwind:"$Account"},
        { $unwind:"$ShipToAddress"},
        { $unwind:"$BillToAddress"},
        { $unwind:{
            path:"$Users",
            "preserveNullAndEmptyArrays": true
          }
        },
        { 
            $project: {
              '_id':0,
              'InvoiceNumber':1,
              'NetAmount':1,
              'IssueDate':1,
              'Account.AccountNameTH':1,
              'Account.CVLabel':1,
              'Account.CVType':1,
              'Account.CVTypeCode':1,
              'Dncn.CorrectProductValue': 1,
              'Dncn.LineItemList': 1,
              'Users.firstname':'$Users.firstname',
              'Users.lastname':'$Users.lastname',
              'Users.imageprofile':'$Users.imageprofile'
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceSalesBtwDate = function(data,callback){
    invoices.aggregate([
        { $match: {
            'Account.Salesman': data.SalesmanCode,
            'IssueDate':{
                $gte: new Date(data.startDate),
                $lte: new Date(data.endDate)
            }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },{
            $lookup:{
                from:"Users",
                localField:"Account.Salesman",
                foreignField:"emp_id",
                as:"Users"
            }
        },
        { $unwind:"$Account"},
        { $unwind:"$ShipToAddress"},
        { $unwind:"$BillToAddress"},
        { $unwind:{
            path:"$Users",
            "preserveNullAndEmptyArrays": true
          }
        },
        { 
            $project: {
              '_id':0,
              'InvoiceNumber':1,
              'NetAmount':1,
              'IssueDate':1,
              'Account.AccountNameTH':1,
              'Account.CVLabel':1,
              'Account.CVType':1,
              'Account.CVTypeCode':1,
              'Dncn.CorrectProductValue': 1,
              'Dncn.LineItemList': 1,
              'Users.firstname':'$Users.firstname',
              'Users.lastname':'$Users.lastname',
              'Users.imageprofile':'$Users.imageprofile'
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceBtwDateByStore = function(data, callback){
    invoices.aggregate([
        { $match: {
                Store:{$in:data.adm_store}, 
                'IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { $unwind:"$Account"},
        { $unwind:"$ShipToAddress"},
        { $unwind:"$BillToAddress"},
        { 
            $project: {
                '_id':0,
                'InvoiceNumber':1,
                'IssueDate':1,
                'CVNumber':1,
                'NetAmount':1,
                'Store':1,
                'Account.AccountNameTH':1,
                'Account.Salesman':1,
                'Account.CVLabel':1,
                'Account.CVType':1,
                'Account.CVTypeCode':1,
                'Dncn.CorrectProductValue': 1,
                'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceByDateByStore = function(data, callback) {
    invoices.aggregate([
        { $match: {
                Store:{$in:data.store_id}, 
                IssueDate: new Date(data.date) 
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { $unwind:"$Account"},
        { $unwind:"$ShipToAddress"},
        { $unwind:"$BillToAddress"},
        { 
            $project: {
                '_id':0,
                'InvoiceNumber':1,
                'NetAmount':1,
                'Store':1,
                'Account.AccountNameTH':1,
                'Account.CVLabel':1,
                'Account.CVType':1,
                'Account.CVTypeCode':1,
                'Dncn.CorrectProductValue': 1,
                'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

// Get invoice by Date
module.exports.getInvoiceByDate = function(IssueDate, callback) {
    invoices.aggregate([
        { $match: { IssueDate: new Date(IssueDate) }},
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
            '_id': 0,
            'InvoiceNumber':1,
            'CVNumber':1,
            'NetAmount':1,
            'IssueDate':1,
            'TotalAmount':1,
            'SONumber':1,
            'Account.AccountNameTH':1,
            'Account.CVLabel':1,
            'Account.CVType':1,
            'Account.CVTypeCode':1,
            'Account.CustomerPrice':1,
            'Account.Salesman':1,
            'LineItemList':1,
            'ShipToAddress.AddressStreet':1,
            'ShipToAddress.AddressStreet2':1,
            'BillToAddress.AddressStreet':1,
            'BillToAddress.AddressStreet2':1,
            'Dncn.CorrectProductValue': 1,
            'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

// Get all invoice
module.exports.getInvoice = function(month,callback) {
    invoices.find({'Month':month}, {
        '__v': 0
    }, callback);
}

module.exports.getInvoiceByMonthAndProduct = function (Month,Year ,callback){
    invoices.aggregate([
        { $match: { Month: Month,Year: Year }},
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $lookup: {
                from: "Products",
                localField: "LineItemList.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }
        },
        { 
            $project: {
            '_id': 0,
            'LineItemList':1,
            'Dncn.LineItemList': 1,
            'Products.ProductCode':1,
            'Products.ProductNameTH':1,
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceByMonth = function(Month,Year, callback) {
    invoices.aggregate([
        { $match: { Month: Month,Year: Year }},
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
            '_id': 0,
            'InvoiceNumber':1,
            'CVNumber':1,
            'NetAmount':1,
            'IssueDate':1,
            'TotalAmount':1,
            'SONumber':1,
            'Store':1,
            'Account.AccountNameTH':1,
            'Account.CVLabel':1,
            'Account.CVType':1,
            'Account.CVTypeCode':1,
            'Account.CustomerPrice':1,
            'Account.Salesman':1,
            'LineItemList':1,
            'ShipToAddress.AddressStreet':1,
            'ShipToAddress.AddressStreet2':1,
            'BillToAddress.AddressStreet':1,
            'BillToAddress.AddressStreet2':1,
            'Dncn.CorrectProductValue': 1,
            'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

// Get invoice by CV
module.exports.getInvoiceByCV = function(data, callback) {
    invoices.find({
        'CVNumber': data.CVNumber,
        'Month':data.Month,
        'Year':data.Year
    }, {
        '_id': 0,
        '__v': 0
    }, callback);
}

module.exports.getInvoiceSumTotal = function(store,month,year,callback){
    invoices.aggregate([
        {
            $match: {
                'Store':store,
                'Year':year,
                'Month':month
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $lookup: {
                from: "Users",
                  localField: "Account.Salesman",
                  foreignField: "emp_id",
                  as: "Users"
            }
        },{
            $unwind:{
              path:'$Users',
              "preserveNullAndEmptyArrays": true}
        },{
            $project:{
                '_id':0,
                'IssueDate':1,
                'NetAmount':1,
                'Account.CVLabel':1,
                'Account.CVType':1,
                'Account.CVTypeCode':1,
                'Account.Salesman':1,
                'Dncn.CorrectProductValue': 1,
                'Users.firstname':1,
                'Users.lastname':1,
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceByStore = function(month,callback) {
    invoices.aggregate([
        {
            $match: {
                'Month':month
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $group:{
                _id:{Store:"$Store", date:"$IssueDate"},
                totalNet:{ $sum:"$NetAmount"},
            }
        },{
            $project:{
                "_id":0,
                "Store":"$_id.Store",
                "Date":"$_id.date",
                "totalNet":1,
            }
        }
    ]).exec(callback);
}

module.exports.sumItemByCV = function(data ,callback){
    invoices.aggregate([
        {
            $match: {
                'Account.CVNumber':data.CVNumber,
                'Month':data.Month,
                'Year':data.Year
            }
        },
        {
            $unwind:"$Account"
        },{
            $unwind:"$LineItemList"
        },
        {
            $group:{
                _id:{CVNumber:"$Account.CVNumber", ProductCode:"$LineItemList.ProductCode"},
                totalQuantity:{ $sum: "$LineItemList.QuantitySales" },
                totalWeight:{ $sum: "$LineItemList.WeightSales" },
                totalPrice:{ $sum: "$LineItemList.TotalPrice" },
            }
        },
        {
            $lookup: {
                from: "Products",
                localField: "_id.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }            
        },{
            $unwind:"$Products"
        },{
            $project:{
                "_id":0,
                "CVNumber":"$_id.CVNumber",
                "Date":"$_id.date",
                "Month":data.Month,
                "Year":data.Year,
                "ProductCode":"$Products.ProductCode",
                "ProductNameTH":"$Products.ProductNameTH",
                "Cat":"$Products.Cat",
                "totalQuantity":1,
                "totalWeight":1,
                "totalPrice":1,
            }
        },{
            $group:{
                _id:{CVNumber:"$_id.CVNumber", Cat:"$Cat" },
                totalQuantity:{ $sum: "$totalQuantity" },
                totalWeight:{ $sum: "$totalWeight" },
                totalPrice:{ $sum: "$totalPrice" },
                item:{ $push : {ProductCode: "$ProductCode", ProductNameTH: "$ProductNameTH", Cat: "$Cat", totalQuantity: "$totalQuantity", totalWeight: "$totalWeight", totalPrice: "$totalPrice", }}
            }
        },{
            $project:{
                "_id":0,
                "CVNumber":"$_id.CVNumber",
                "Cat":"$_id.Cat",
                "Month":data.Month,
                "Year":data.Year,
                "totalQuantity":1,
                "totalWeight":1,
                "totalPrice":1,
                "item":1
            }
        }
    ]).exec(callback);
}

module.exports.sumInvoiceByCV = function(data,callback){
    invoices.aggregate([
        {
            $match: {
                'CVNumber':data.CVNumber,
                'IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                }
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        {
            $lookup: {
                from: "Products",
                localField: "LineItemList.ProductCode",
                foreignField: "ProductCode",
                as: "Products"
            }
        },
        { 
            $project: {
                '_id': 0,
                'IssueDate':1,
                'NetAmount':1,
                'InvoiceNumber':1,
                'LineItemList':1,
                'Dncn.LineItemList': 1,
                'Dncn.CorrectProductValue': 1,
                'Products.ProductCode':1,
                'Products.ProductNameTH':1,
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceByProductCode = function(data, callback) {
    invoices.aggregate([
        {
            $match: {
                'IssueDate':{
                    $gte: new Date(data.startDate),
                    $lte: new Date(data.endDate)
                },
                'LineItemList.ProductCode': data.ProductCode,
            }
        },
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
            '_id': 0,
            '_id': 0,
            'InvoiceNumber':1,
            'LineItemList': 1,
            'IssueDate':1,
            'Account.CustomerPrice':1,
            'Account.CVLabel':1,
            'Account.CVType':1,
            'Account.CVTypeCode':1,
            'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

module.exports.getInvoiceBySaleCode = function(SalesmanCode,IssueDate, callback) {
    invoices.aggregate([
        { $match: { 'Account.Salesman': SalesmanCode,IssueDate: new Date(IssueDate) }},
        {
            $lookup: {
                from: "Dncn",
                localField: "InvoiceNumber",
                foreignField: "InvoiceNumber",
                as: "Dncn"
            }
        },
        { 
            $project: {
            '_id': 0,
            'InvoiceNumber':1,
            'CVNumber':1,
            'NetAmount':1,
            'IssueDate':1,
            'TotalAmount':1,
            'SONumber':1,
            'Account.AccountNameTH':1,
            'Account.CVLabel':1,
            'Account.CVType':1,
            'Account.CVTypeCode':1,
            'Account.CustomerPrice':1,
            'Account.Salesman':1,
            'LineItemList':1,
            'ShipToAddress.AddressStreet':1,
            'ShipToAddress.AddressStreet2':1,
            'BillToAddress.AddressStreet':1,
            'BillToAddress.AddressStreet2':1,
            'Dncn.CorrectProductValue': 1,
            'Dncn.LineItemList': 1
            }
        }
    ]).exec(callback);
}

module.exports.getLatestInvoiceByCV = function(callback){
    invoices.aggregate([
        {
            $match:{
                'Store':'1415'
            }
        },  
        {$unwind: '$Account' },
        {
            $group:{
                _id:{
                    "CVNumber":"$Account.CVNumber",
                    "Salesman":"$Account.Salesman",
                    "Store":"$Store"},
                Account:{$last:"$Account"},
                IssueDate: { $last: "$IssueDate" }
            }
        },
        {
            $project:{
                "_id":0,
                "CVNumber":"$_id.CVNumber",
                "Salesman":"$_id.Salesman",
                "Store":"$_id.Store"
            }
        }
    ]).exec(callback);
}


// Get invoice by invoiceDetail
module.exports.getInvoiceDetail = function(InvoiceNumber, callback) {
    invoices.aggregate([
    {
        $match:{'InvoiceNumber': InvoiceNumber}
    },
    {
        $lookup:{
            from:"Products",
            localField:"LineItemList.ProductCode",
            foreignField:"ProductCode",
            as:"Products"
        }
    },{
        $lookup:{
            from:"Users",
            localField:"Account.Salesman",
            foreignField:"emp_id",
            as:"Sales"
        }
    },
    {   $unwind:"$Account"},
    {   $unwind:"$BillToAddress"},
    {   $unwind:"$ShipToAddress"}, 
    {   $unwind:{
        path:"$Sales",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
        $project:{
            '_id': 0,
            'CVNumber': 1,
            'CustomerPrice': "$Account.CustomerPrice",
            'CVName': "$Account.AccountNameTH",
            'SaleCode':"$Account.Salesman",
            'SaleName':"$Sales.firstname",
            'SaleLast':"$Sales.lastname",
            'NetAmount':1,
            'IssueDate':1,
            'Shipto':'$ShipToAddress.AddressStreet',
            'Billto':'$BillToAddress.AddressStreet',
            'LineItemList.ProductCode':1,
            'LineItemList.QuantitySales':1,
            'LineItemList.QuantitySalesUOM':1,
            'LineItemList.WeightSales':1,
            'LineItemList.WeightSalesUOM':1,
            'LineItemList.TotalNetPrice':1,
            'LineItemList.NetPricePerUnit':1,
            'Products.ProductCode':1,
            'Products.ProductNameTH':1
        }
    },
    ]).exec(callback);
}

// Update invoice
module.exports.updateInvoice = function(invoiceCode, data, callback) {
    invoices.findOneAndUpdate({
        'invoiceCode': invoiceCode
    },  {$set: data}, {
        new: true
    }, callback);
}

// Delete invoice
module.exports.removeInvoice = function(invoiceCode, callback) {
    invoices.remove({
        'invoiceCode': invoiceCode
    }, callback);
}