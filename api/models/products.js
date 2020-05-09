/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		product model

----------------------------------------------*/
const db = require('./connectiondb.js');

//product Schema
const productSchema = db.Mongoose.Schema({
    //product_id:{ type: Number, index: { unique: true } },
    ProductCode:{
        type:String,
        unique: true
    },
    ProductNameTH:{
        type: String
    },
    ProductNameEN:{
        type: String
    },
    EcomName:{
        type: String
    },
    QuantityUOM: {
        type: String
    },
    QuantityUOMCode: {
        type: String
    },
    Cat:{
        type: String
    },
    SubCat:{
        type: String
    },  
    ecom_store:{
        type:[
            String
        ]
    },
    stock:{
        type:[
            {
                store_id:{
                    type:Number
                },
                quantity:{
                    type:Number
                }
            }
        ]
    },
    retail_Price:{
        type:Number
    },
    classcost:{
        type:[
            {
                CLASS_COST:{
                    type:String
                },
                GROSS_COST:{
                    type:Number
                },
                UM_CODE:{
                    type:String
                },
                UM_Text:{
                    type:String
                },
                UM_Thai:{
                    tpye:String
                },
                VENDOR_CODE:{
                    type:String
                },
                updateon:{
                    type:Date
                }
            }
        ]
    },
    classprice:{
        type:[
            {
                zone:{
                    type:String
                },
                class:{
                    type:String
                },
                UM_CODE:{
                    type:String
                },
                UM_Text:{
                    type:String
                },
                UM_Thai:{
                    tpye:String
                },
                price:{
                    type:Number
                },
                label:{
                    type:String
                },
                updateon:{
                    type:Date
                }
            }
        ]
    },
    updateon:{
        type:Date
    }
}, {
    collection: 'Products'
});
//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const products = module.exports = db.Mongoose.model('Products', productSchema);

module.exports.newProducts = function(data,callback){
    products.updateOne({'ProductCode':data.ProductCode},{$set:data},{upsert:true},callback);
}

module.exports.getProductCostGroupID= function(data, callback){
    products.aggregate([
        { $match: {
            'ProductCode': {$in:data.ProductCode}
         } 
        }, 
        { $project: {
            '_id':0,
            'ProductCode':1,
            "ProductNameTH":1,
            "Cat":1,
            "products":{
                $filter: {
                    input: "$classprice",
                    as: "classprice",
                    cond: { $and:[
                        {$eq: [ "$$classprice.class", data.classprice] }   
                     ]
                    }
                 }
                },
            'classBI01':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI01" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] } 
                     ]
                    }
                 }
                },
            'classBI02':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI02" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }
                     ]
                    }
                 }
                },
            'classA':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRA" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }   
                     ]
                    }
                 }
                }
            }
        }
    ],callback);
}

module.exports.getCat = function(callback){
    products.find().distinct('Cat',callback);
}

module.exports.getEcomProduct = function(data,callback){
    products.find({
        'ecom_store':data.store_id
    },{
    '_id':0,
    'ProductCode':1,
    'EcomName':1,
    'retail_Price':1,
    'Cat':1},callback);
}

module.exports.getNullProduct = function(callback){
    products.find({
        'ProductNameTH':{$exists:false}
    },
    {'_id':0,'ProductCode':1,'ProductNameTH':1,'Cat':1,'SubCat':1,'QuantityUOM':1,'QuantityUOMCode':1},callback);
}

module.exports.getProductByClassPrice = function(data, callback){
    products.aggregate([
        { $match: {
            'ProductCode': data.ProductCode,
            'ProductNameTH': {$exists:true} } }, 
        { $project: {
            '_id':0,
            'ProductCode':1,
            "ProductNameTH":1,
            "Cat":1,
            "products":{
                $filter: {
                    input: "$classprice",
                    as: "classprice",
                    cond: { $and:[
                        {$eq: [ "$$classprice.class", data.classprice] }   
                     ]
                    }
                 }
                },
            'classBI01':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI01" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                },
            'classBI02':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI02" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                },
            'classA':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRA" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                }
            }
        }
    ],callback);
}

module.exports.getCatByProduct = function(product_code,callback){
    products.find({
        'ProductCode':product_code},
        {'Cat':1,
        '_id':0},callback);
}

module.exports.getProductByCats = function(cats,callback){
    products.find({
        'Cat':cats,updateon:{$exists:true}},
        {'ProductCode':1,
        'ProductNameTH':1},callback);
}

module.exports.getAllProducts = function(callback){
    products.find({},
        {
        '_id':0,
        'ProductCode':1,
        'ProductNameTH':1,
        'Cat':1,
        'SubCat':1},callback);
}

//Get Product ID & Name 
module.exports.getProductIDAndName = function(callback){
    products.find({}, {
        '_id':0,
        'ProductCode':1,
        'ProductNameTH':1,
        'Cat':1
    }, callback);
}

module.exports.getProductName = function(ProductCode,callback){
    products.findOne({'ProductCode':ProductCode}, {
        '_id':0,
        'ProductNameTH':1
    }, callback);
}

// Get all product
module.exports.getProducts = function(callback, limit) {
    products.find({}, {
         '_id':0,
        'Description':0,
        'IsActive':0,
        'ProductCustomer1':0,
        'classprice':0,
        'ProductCustomer2':0,
        'ProductCustomer3':0,
        'ProductCustomer4':0,
        'ProductCustomerCode1':0,
        'ProductCustomerCode2':0,
        'ProductCustomerCode3':0,
        'ProductCustomerCode4':0,
        'Weight':0,
        'Width':0,
        'Depth':0,
        'Height':0,
        '__v': 0
    }, callback);
}
module.exports.getTestProducts = function(callback, limit) {
    products.find({}, {
        'ProductCode':1,
        'classprice':1,
    }, callback);
}

// Get product by ProductCode
module.exports.getProductBySap = function(ProductCode, callback) {
    products.findOne({
        'ProductCode': ProductCode
    }, {
        '_id': 0,
        '__v': 0
    }, callback);
}

module.exports.getProductBySapTest = function(data, callback) {
    products.aggregate([
        { $match: {
            'ProductCode': data.ProductCode,
            'ProductNameTH': {$exists:true} } }, 
        { $project: {
            '_id':0,
            'ProductCode':1,
            "ProductNameTH":1,
            "SubCat":1,
            "updateon":1,
            "retail_Price":1,
            "QuantityUOM":1,
            "products":"$classprice"
            }
        }
    ],callback);
}

module.exports.getProductBySapAndZone = function(data, callback) {
    products.aggregate([
        { $match: {
            'ProductCode': data.ProductCode,
            'ProductNameTH': {$exists:true} } }, 
        { $project: {
            '_id':0,
            'ProductCode':1,
            "ProductNameTH":1,
            "Cat":1,
            "retail_Price":1,
            "products":{
                $filter: {
                    input: "$classprice",
                    as: "classprice",
                    cond: { $and:[
                        {$eq: [ "$$classprice.zone", data.zone] }   
                     ]
                    }
                 }
                },
            'classBI01':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI01" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                },
            'classBI02':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRBI02" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                },
            'classA':{
                $filter: {
                    input: "$classcost",
                    as: "classcost",
                    cond: { $and:[
                        {$eq: [ "$$classcost.CLASS_COST", "CLSPRA" ] },
                        {$eq: [ "$$classcost.VENDOR_CODE", "242" ] }      
                     ]
                    }
                 }
                }
            }
        }
    ],callback);
}

module.exports.getProductPriceByZone = function(data, callback) {
    products.aggregate([
        { $match: {
            'classprice': {$elemMatch: {zone: data.zone}} } }, 
        { $unwind : "$classprice" },
        { $match: { "classprice.zone" : data.zone , "classprice.price" : {$gt : 0} } },
        { $group : { _id : {"ProductCode":"$ProductCode","ProductNameTH":"$ProductNameTH","Cat":"$Cat","SubCat":"$SubCat","updateon":"$updateon","retail_Price":"$retail_Price"}, products : { $addToSet : "$classprice" }}},
        { 
            $project: {
                '_id':0,
                'ProductCode':"$_id.ProductCode",
                "ProductNameTH":"$_id.ProductNameTH",
                "SubCat":"$_id.SubCat",
                "Cat":"$_id.Cat",
                "updateon":"$_id.updateon",
                "retail_Price":"$_id.retail_Price",
                "class":[{$arrayToObject :{
                                        $map:{
                                                "input": "$products",
                                                "as": "el",
                                                "in":{
                                                        "k":"$$el.class",
                                                        "v":"$$el.price"
                                                    }
                                            }
                                    }}
                    ]
            }
        },
        { $unwind:"$class"},
        {
            $project: {
                'ProductCode':1,
                "ProductNameTH":1,
                "Cat":1,
                "SubCat":1,
                "updateon":1,
                "retail_Price":1,
                "class":1
            }
        }
    ],callback);
}

// Get product by ProductCode
module.exports.getProductOrder = function(data, callback) {
    products.find({
        'ProductCode': {$in: data}
    }, {
        '_id': 0,
        'classprice':0,
        '__v': 0
    }, callback);
}

// Get product by title
module.exports.getProductByTitle= function(title, callback) {
    products.findOne({
        'title': title
    }, {
        '_id': 0,
        'classprice':0,
        '__v': 0
    }, callback);
}

// Get product by title
module.exports.getProductByType= function(type, callback) {
    products.findOne({
        'type': type
    }, {
        '_id': 0,
        'classprice':0,
        '__v': 0
    }, callback);
}

// Restock
module.exports.reStock= function(ProductCode, data, callback) {
    products.findOneAndUpdate({
        'ProductCode': ProductCode
    },  {$inc: data}, {
        new: true
    }, callback);
}

// Update product
module.exports.updateProduct = function(ProductCode, data, callback) {
    products.updateOne({'ProductCode':ProductCode},
    {$set:data},callback);
}

module.exports.updatePrice = function(data, callback){
    products.aggregate([
        { $match: {
            'ProductCode': data.product_code 
        } }, 
        { $project: {
            '_id':0,
            'ProductCode':1,
            "products":{
                $filter: {
                    input: "$classprice",
                    as: "classprice",
                    cond: { $and:[
                        {$eq: [ "$$classprice.zone", data.classprice.zone] }  , 
                        {$eq: [ "$$classprice.class", data.classprice.class] }   
                     ]
                    }
                 }
                }
            }
        }
    ],(err,pdlist)=>{
        if(err) console.log(err);
        else{
            if(pdlist.length>0){
            if(pdlist[0].products != null){
                let idk = -1;
                pdlist[0].products.find((item,k)=>{
                    if(item.class == data.classprice.class){
                        idk = k;
                        return;
                    }
                });
                if(idk > -1){
                    if((pdlist[0].products[idk].price != data.classprice.price )|| (pdlist[0].products[idk].UM_Thai != data.classprice.UM_Thai)){
                        products.updateOne({
                            'ProductCode':data.product_code,
                            'classprice.class':data.classprice.class,
                            'classprice.UM_CODE':data.classprice.UM_CODE,
                        },{
                            $set:{
                                "classprice.$[elem].price":data.classprice.price,
                                "classprice.$[elem].label":data.classprice.label,
                                "classprice.$[elem].UM_Thai":data.classprice.UM_Thai,
                                "classprice.$[elem].updateon":data.updateon
                            }
                        },
                        {
                            arrayFilters:[{
                                "elem.class":data.classprice.class,
                                "elem.UM_CODE":data.classprice.UM_CODE}
                            ],
                            multi: true,
                        }
                        ,callback)
                    }
                }else{
                    products.updateOne({
                        'ProductCode':data.product_code
                    },{$addToSet:{"classprice":data.classprice}},{upsert:true},callback);
                }
            }else{
                products.updateOne({
                    'ProductCode':data.product_code
                },{$addToSet:{"classprice":data.classprice}},{upsert:true},callback);
            }}else{
                callback
            }
        }
    });
}

module.exports.updateCost = function(data,callback){
    let i=0;
    let jsonresult = [];
    products.find({
    },{
        '_id':0,
        'ProductCode':1,
        'ProductNameTH':1,
        'classcost':1
    },(err,pdlist)=>{
        if(err) console.log(err);
        else{
            data.forEach(element => {
                i++;
                let index = -1;
                pdlist.find((item,k)=>{
                    if(item.ProductCode == element.product_code){
                        index = k;
                        return;
                    }
                });
                if(index > -1 && pdlist[index].classcost.length>0){
                    let idk = -1;
                    pdlist[index].classcost.find((cost,j)=>{
                        if(cost.CLASS_COST == element.CLASS_COST &&
                            cost.UM_CODE == element.UM_CODE &&
                            cost.VENDOR_CODE == element.VENDOR_CODE){
                                idk = j;
                                return;
                            }
                    });
                    if(idk > -1){
                        if((pdlist[index].classcost[idk].GROSS_COST != element.GROSS_COST) || (pdlist[index].classcost[idk].UM_Thai != element.UM_Thai)){
                            jsonresult.push({
                                'ProductCode':element.product_code,
                                'ProductNameTH':pdlist[index].ProductNameTH,
                                'Old':pdlist[index].classcost[idk].GROSS_COST,
                                'New':element.GROSS_COST,
                                'CLASS_COST':element.CLASS_COST,
                                'VENDOR_CODE':element.VENDOR_CODE
                            });
                            products.updateOne({
                                'ProductCode':element.product_code,
                                'classcost.UM_CODE':element.UM_CODE,
                                'classcost.VENDOR_CODE':element.VENDOR_CODE,
                                'classcost.CLASS_COST':element.CLASS_COST
                            },{
                                $set:{"classcost.$[elem].GROSS_COST":element.GROSS_COST,
                                    "classcost.$[elem].UM_Thai":element.UM_Thai,
                                    "classcost.$[elem].updateon":element.updateon
                                }
                            },{
                                arrayFilters:[{
                                                "elem.VENDOR_CODE":element.VENDOR_CODE,
                                                "elem.CLASS_COST":element.CLASS_COST,
                                                "elem.UM_CODE":element.UM_CODE},
                                    ], 
                                multi: true
                            },(err,resultdata)=>{
                                if(err) console.log(err);
                                else{
                                    if(i == data.length){
                                        callback(jsonresult);}
                                }
                            });
                        }
                    }else{
                        products.updateOne({
                            'ProductCode':element.product_code,
                        },{
                            $addToSet:{
                                "classcost":{
                                    "CLASS_COST":element.CLASS_COST,
                                    "GROSS_COST":element.GROSS_COST,
                                    "UM_CODE":element.UM_CODE,
                                    "UM_Text":element.UM_Text,
                                    "UM_Thai":element.UM_Thai,
                                    "VENDOR_CODE":element.VENDOR_CODE,
                                    "updateon":element.updateon
                                },
                            }
                        },(err, resultdata)=>{
                            if(err) console.log(err);
                            else{
                                if(i == data.length){
                                    callback(jsonresult);}
                            }
                        });
                    }
                }else{
                    products.updateOne({
                        'ProductCode':element.product_code,
                    },{
                        $addToSet:{
                            "classcost":{
                                "CLASS_COST":element.CLASS_COST,
                                "GROSS_COST":element.GROSS_COST,
                                "UM_CODE":element.UM_CODE,
                                "UM_Text":element.UM_Text,
                                "UM_Thai":element.UM_Thai,
                                "VENDOR_CODE":element.VENDOR_CODE,
                                "updateon":element.updateon
                            },
                        }
                    },(err, resultdata)=>{
                        if(err) console.log(err);
                        else{
                            if(i == data.length){
                                callback(jsonresult);}
                        }
                    });
                }
            });
        }
    })
}

// Delete product
module.exports.removeProduct = function(callback) {
    products.updateMany({
        'ProductCode':{$exists:true}
    },{$unset:{'classprice':''}}, callback);
}