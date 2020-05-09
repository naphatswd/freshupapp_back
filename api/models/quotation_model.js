/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		quotation model

----------------------------------------------*/
const db = require('./connectiondb.js');
//quotation Schema
const quotationSchema = db.Mongoose.Schema({
    emp_id:{
        type:String
    },
    Store:{
        type:String
    },
    Salescode:{
        type:String
    },
    company:{
        type:String
    },
    operationCode:{
        type:String
    },
    subOperation:{
        type:String
    },
    QUOTATION_ID:{
        type:Number,
        unique:true
    },
    AccountNameTH:{
        type:String
    },
    CVNumber:{
        type:String
    },
    ProductData:{
        type:{
                lstQuotation:{
                    type:[
                        {
                            QUOTATION_ID:{
                                type:Number
                            },
                            QUOTATION_DATE:{
                                type:String
                            },
                            CLASS_PRICE:{
                                type:String
                            },
                            COMPANY:{
                                type:String
                            },
                            CONTRACT_PRICE:{
                                type:String
                            },
                            COST_PRICE:{
                                type:Number
                            },
                            CV_CODE:{
                                type:String
                            },
                            EFFECTIVE_DATE:{
                                type:String
                            },
                            EXPIRY_DATE:{
                                type:String
                            },
                            EXT_NO:{
                                type:Number
                            },
                            IS_CRITERIA:{
                                type:String
                            },
                            OPERATION_CODE:{
                                type:String
                            },
                            PERCENT_PROFIT:{
                                type:Number
                            },
                            PRODUCT_CODE:{
                                type:String
                            },
                            PRODUCT_NAME:{
                                type:String
                            },
                            QTY_CONTRACT:{
                                type:Number
                            },
                            SALES_PRICE:{
                                type:Number
                            },
                            STATUS:{
                                type:String
                            },
                            SUB_OPERATION:{
                                type:String
                            },
                            TOTAL_CRITERIA:{
                                type:String
                            },
                            TOTAL_PRICE:{
                                type:Number
                            },
                            TOTAL_PROFIT:{
                                type:Number
                            },
                            UM_CONTRACT:{
                                type:String
                            }
                        }
                    ]
                },
                lstContractPrice:{
                    type:[
                        {
                            COMPANY:{
                                type:String
                            },
                            CV_CODE:{
                                type:String
                            },
                            EFFECTIVE_DATE:{
                                type:String
                            },
                            EXPIRY_DATE:{
                                type:String
                            },
                            EXT_NO:{
                                type:Number
                            },
                            GROSS_PRICE:{
                                type:Number
                            },
                            NAME_TO:{
                                type:String
                            },
                            NET_PRICE_DIS:{
                                type:Number
                            },
                            NET_PRICE_FREE:{
                                type:Number
                            },
                            OPERATION_CODE:{
                                type:String
                            },
                            PRODUCT_CODE:{
                                type:String
                            },
                            SUB_OPERATION:{
                                type:String
                            },
                            UM_ORDER:{
                                type:String
                            },
                            REMARK:{
                                type:String
                            },
                            DOC_NUMBER:{
                                type:String
                            }
                        }
                    ]
                }
            }
    }
}, {
    collection: 'Quotations'
});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const quotations = module.exports = db.Mongoose.model('Quotations', quotationSchema);

module.exports.newQuotation = function(data,callback){
    quotations.updateOne({'QUOTATION_ID':data.QUOTATION_ID},{$set:data},{upsert:true},callback);
}

module.exports.getQuotationByCV = function(CVNumber, callback){
    quotations.find({
        'CVNumber':CVNumber
    }, {
        '_id': 0,
        'QUOTATION_ID':1,
        'ProductData.lstQuotation':1
    },callback);
}

module.exports.getQuotationByID = function(QUOTATION_ID, callback){
    quotations.find({
        'QUOTATION_ID':QUOTATION_ID
    }, {
        '_id': 0,
    },callback);
}

module.exports.getQuoatation = function(callback){
    quotations.find({}, {
        '__v': 0
    },callback);
}

// Delete quotation
module.exports.removeQuotation = function(QUOTATION_ID, callback) {
    quotations.findOneAndDelete({
        'QUOTATION_ID': QUOTATION_ID
    }, callback);
}