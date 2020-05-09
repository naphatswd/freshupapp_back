/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		users model

----------------------------------------------*/
const bcrypt = require('../../node_modules/bcrypt');
const db = require('./connectiondb.js');

//users Schema
const usersSchema = db.Mongoose.Schema({ 
	//Users_id:{ type: Number, index: { unique: true } },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  emp_id: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  nickname:{
    type:String,
    trim:true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  role: {
    type: String,
      enum: [
        "admin",
        "saleman",
        "butcher",
        "staff",
        "user"
      ]
  },
  status: {
    type: String,
      enum: [
      "active",
      "waiting",
      "offline",
      "closed",
      "banned",
      "verified"
    ],
    default: 'offline'
  },
  admin_store:{
      type:[
        String
      ]
  },
  imageprofile:{
    type:String
  },
  created: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String
  },
  pushnoti:{
    type: String
  },
  offline:{
    type:Date,
    default: Date.now
  },
  unread:{
    type:Number,
    default:0
  },
  group_type:{
    type:String
  },
  group_model:{
    type:String
  }
}, {collection:'Users'});

//----------------------------------------------------------------------------
// for auto increment Users_id 
//----------------------------------------------------------------------------

usersSchema.pre('save', async function(next) {
    const user = this;
    const hashedPassword = await bcrypt.hash(user.password, 10);
  this.password = hashedPassword;
  if(user.role != 'saleman') this.emp_id = this._id;
    next();
});

usersSchema.methods.isValidPassword = async function(password){
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

usersSchema.methods.checkaccess = async function(){
  const user = this;
  if(user.status == 'closed' || user.status == 'banned')
    return false;
  else 
    return true;
}

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const Users = module.exports =  db.Mongoose.model('Users', usersSchema);

module.exports.getCPClient = function(emp_id, callback) {
  Users.aggregate([
    {
      $match:{
        'emp_id':emp_id
      }
    },{
      $unwind:"$admin_store"
    },
    {
        $lookup: {
            from: "Clients",
            let: { sap_id: "$admin_store" },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$Store","$$sap_id"] }
                    ]
                  }
                }
              }
           ],
            as: "Clients"
        }
    },{
      $unwind:'$Clients'
    },{
      $project:{
        '_id':0,
        'Clients.CVNumber': 1,
        'Clients.AccountNameTH':1,
        'Clients.Latitude':1,
        'Clients.Longitude':1,
      }
    }
  ]).exec((callback));
}

module.exports.getClientByStore = function(emp_id, callback) {
  Users.aggregate([
    {
      $match:{
        'emp_id':emp_id
      }
    },{
      $unwind:"$admin_store"
    },
    {
        $lookup: {
            from: "Clients",
            let: { sap_id: "$admin_store" },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$Store","$$sap_id"] }
                    ]
                  }
                }
              }
           ],
            as: "Clients"
        }
    },{
      $unwind:'$Clients'
    },{
      $project:{
        '_id':0,
        'Clients.CVNumber': 1,
        'Clients.AccountNameTH':1,
        'Clients.Lastorder':1,
        'Clients.Latitude':1,
        'Clients.Longitude':1,
        'Clients.CreditLimit':1,
      }
    }
  ]).exec((callback));
}

module.exports.getSumByStore = function(emp_id,month,year, callback) {
  Users.aggregate([
    {
      $match:{
        'emp_id':emp_id
      }
    },{
      $unwind:"$admin_store"
    },
    {
        $lookup: {
            from: "Sumstore",
            let: { sap_id: "$admin_store", month: month, year :year },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$store_id","$$sap_id"] },
                      { $eq: ["$month","$$month"] },
                      { $eq: ["$year","$$year"] }
                    ]
                  }
                }
              }
           ],
            as: "Sumstore"
        }
    },{
      $unwind:'$Sumstore'
    },
    {
      $project:{
        '_id':0,
        'role':0,
        'status':0,
        'firstname':0,
        'lastname':0,
        'emp_id':0,
        'phonenumber':0,
        'store_id':0,
        'email':0,
        'password':0,
        'created':0,
        '__v':0,
        'pushnoti':0,
        'token':0,
        'offline':0,
        'admin_store':0,
        'nickname':0,
        'imageprofile':0,
        'unread':0,
        'Sumstore._id':0,
        'Sumstore.__v':0,
        'Sumstore.month':0,
        'Sumstore.year':0
      }
    }
  ]).exec((callback));
}

module.exports.getInvoiceBtwDateAndCVType = function(emp_id,data, callback){
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
      $unwind:"$admin_store"
    },
    {
        $lookup: {
            from: "Invoice",
            let: { sap_id: "$admin_store", startDate: new Date(data.startDate), endDate: new Date(data.endDate)},
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$Store","$$sap_id"] },
                      { $gte: ["$IssueDate","$$startDate"] },
                      { $lte: ["$IssueDate","$$endDate"] },
                    ]
                  }
                }
              }
           ],
            as: "Invoices"
        }
    },
    { $unwind:"$Invoices"},
    {
      $match:{
        "Invoices.Account.CVLabel": data.CVLabel
      }
    },  
    {
        $lookup: {
            from: "Dncn",
              localField: "Invoices.InvoiceNumber",
              foreignField: "InvoiceNumber",
              as: "Dncn"
        }
    },
    {
        $lookup: {
            from: "Users",
              localField: "Invoices.Account.Salesman",
              foreignField: "emp_id",
              as: "Users"
        }
    },{
        $unwind:{
          path:'$Users',
          "preserveNullAndEmptyArrays": true}
    },
    { $unwind:"$Invoices.Account"},
    { 
        $project: {
          '_id':1,
          "InvoiceNumber":'$Invoices.InvoiceNumber',
          "CVNumber":'$Invoices.CVNumber',
          "NetAmount":'$Invoices.NetAmount',
          "IssueDate":'$Invoices.IssueDate',
          "AccountNameTH":'$Invoices.Account.AccountNameTH',
          "Salesman":'$Invoices.Account.Salesman',
          'Dncn.CorrectProductValue': 1,
          'Dncn.LineItemList': 1,
          'Users.firstname':1,
          'Users.lastname':1,
        }
    }
  ]).exec((callback));
}

module.exports.getAttendee = function(store_id,start,end, callback){
  Users.aggregate([
    {
        $match:{
          'admin_store': store_id,
          'role':'staff'
        }
    },
    {
        $lookup: {
            from: "Attendance",
            let: { emp_id: "$emp_id", start: start, end:end },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$emp_id","$$emp_id"] },
                      { $gte: ["$time_stamp","$$start"] },
                      { $lte: ["$time_stamp","$$end"] }
                    ]
                  }
                }
              }
           ],
            as: "Attendance"
        }
    },{
      $project:{
        "_id":0,
        "emp_id":1,
        "firstname":1,
        "imageprofile":1,
        "lastname":1,
        "phonenumber":1,
        "nickname":1,
        "Attendance":{$slice:["$Attendance",-1]}
      }
    },{
      $unwind:"$Attendance"
    },{
      $project:{
        "emp_id":1,
        "firstname":1,
        "imageprofile":1,
        "lastname":1,
        "nickname":1,
        "phonenumber":1,
        "Attendance":"$Attendance"
      }
    }
  ]).exec((callback));
}

module.exports.getB2CByMonth = function(emp_id,month,year, callback) {
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
      $unwind:"$admin_store"
    },
    {
      $group:{_id:"$admin_store"}
    },
    {
        $lookup: {
            from: "Transactions",
            let: { store_id: "$_id", month: month, year :year },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$store_id","$$store_id"] },
                      { $eq: ["$Month","$$month"] },
                      { $eq: ["$Year","$$year"] }
                    ]
                  }
                }
              }
           ],
            as: "Stores"
        }
    },
    {
      $unwind:"$Stores"
    },
    { 
      $group:{
          _id:'$Stores.store_id',
          sumtotal: {$sum:'$Stores.AMOUNT'}
      }
    }
  ]).exec((callback));
}

module.exports.getB2CByMonthDetail = function(emp_id,month,year, callback) {
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
      $unwind:"$admin_store"
    },
    {
      $group:{_id:"$admin_store"}
    },
    {
        $lookup: {
            from: "Transactions",
            let: { store_id: "$_id", month: month, year :year },
            pipeline: [
              { $match: 
                { $expr: 
                  { $and: 
                    [
                      { $eq: ["$store_id","$$store_id"] },
                      { $eq: ["$Month","$$month"] },
                      { $eq: ["$Year","$$year"] }
                    ]
                  }
                }
              }
           ],
            as: "Stores"
        }
    },
    {
      $unwind:"$Stores"
    },
    {
      $lookup:{
        from:"Products",
        localField:"Stores.PRODUCT_CODE",
        foreignField:"ProductCode",
        as:"Products"
      }
    },{
      $unwind:"$Products"
    },
    { 
      $group:{
          _id:{"Store":"$Stores.store_id","Product_Code":'$Stores.PRODUCT_CODE',"Product_Name":"$Products.ProductNameTH"},
          sumtotal: {$sum:'$Stores.AMOUNT'}
      }
    },
    { $sort : { sumtotal : -1} },
    {
      $project:{
        '_id':0,
        "Product_Code":"$_id.Product_Code",
        "Product_Name":"$_id.Product_Name",
        "store_Id":"$_id.Store",
        "sumtotal":1
      }
    }
  ]).exec((callback));
}

module.exports.getImageProfile = function(emp_id,callback){
  Users.findOne({
    'emp_id':emp_id
  },
  {'_id':0,'imageprofile':1},callback);
}

module.exports.getTest = function(emp_id,data, callback) {
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
      $unwind:"$admin_store"
    },
    {
      $lookup: {
          from: "Transactions",
          let: { store_id: "$admin_store", startDate: new Date(data.startDate), endDate: new Date(data.endDate)},
          pipeline: [
            { $match: 
              { $expr: 
                { $and: 
                  [
                    { $eq: ["$store_id","$$store_id"] },
                    { $gte: ["$CREATE_DATE","$$startDate"] },
                    { $lte: ["$CREATE_DATE","$$endDate"] },
                  ]
                }
              }
            }
         ],
          as: "Transactions"
      }
  },{
    $unwind:'$Transactions'
  },{
    $lookup: {
        from:"Products",
        localField: "Transactions.PRODUCT_CODE",
        foreignField: "ProductCode",
        as: "Product"
        
    }
  },{
    $unwind:{
      path:'$Product',
      "preserveNullAndEmptyArrays": true}
  },{
    $group: {
      _id:{"Cat":"$Product.Cat","Date":"$Transactions.CREATE_DATE"},
      sumAmount: {$sum:'$Transactions.AMOUNT'},
      sumQUANTITY:{$sum:'$Transactions.QUANTITY'},
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
  ]).exec((callback));
}

module.exports.getUsers = function(emp_id,callback){
  Users.aggregate([
    {
        $match:{
          'emp_id':emp_id
        }
    },
    {
        $project:{
          '_id':0,
          'admin_store':1
        }
    },
    {
        $lookup:{
          from:"Users",
          localField:"admin_store",
          foreignField:"admin_store",
          as:"Users"
        }
    },{
        $unwind:"$Users"
    },{
        $project:{
          'Users.emp_id': 1,
          'Users.role':1,
          'Users.status':1,
          'Users.nickname':1,
          'Users.firstname':1,
          'Users.lastname':1,
          'Users.phonenumber':1,
          'Users.email':1,
          'Users.imageprofile':1,
          'Users.offline':1,
          'Users.admin_store':1,
        }
    },{
      $lookup: {
        from: "Stores",
        localField: "Users.admin_store",
        foreignField: "store_id",
        as: "Stores"
      }
    }
  ]).exec((callback));
}


module.exports.getMySale = function(data, callback){
  Users.find({
    'admin_store':{$in:data.adm_store},
    'role':'saleman'
  },{
    '_id':0,
    'emp_id': 1,
    'firstname':1,
    'lastname':1}
    ,callback);
}

module.exports.getAdminandStaff = function(store_id, callback){
  Users.find({
      'admin_store':store_id,
      $or:[{'role':'admin'},{'role':'staff'}]
    },
    {'_id':0,'pushnoti':1},callback);
}


module.exports.getAdminandSale = function(store_id, callback) {
  Users.find({
      'admin_store':store_id,
      $or:[{'role':'admin'},{'role':'saleman'}]
    },
    {'_id':0,'pushnoti':1},callback);
}

module.exports.getStaff = function( callback){
  Users.aggregate([
    {
        $match:{
          'role': 'staff'
        }
    },
    {
        $lookup: {
            from: "Stores",
            localField: "admin_store",
            foreignField: "store_id",
            as: "Stores"
        }
    },
    { 
        $project: {
        '_id': 0,
        'firstname':1,
        'lastname':1,
        'Stores.name':1,
        'Stores.store_id':1,
        'Stores.location.lat':1,
        'Stores.location.lon':1,
        }
    }
  ]).exec((callback));
}

module.exports.getAdminNoti = function(store_id, callback){
 Users.find({
      'admin_store':store_id,
      'role':'admin'
    },
    {'_id':0,'pushnoti':1},callback);
}

module.exports.getAdminNotiIn = function(callback){
  Users.find({
       'emp_id':"01095800"
     },
     {'_id':0,'pushnoti':1},callback);
 }

module.exports.checkExist = function(emp_id, callback) {
	Users.findOne({'emp_id': emp_id}, {'_id':0, 'status':1,'role':1, 'admin_store':1}, callback);
}

module.exports.checkEmailExist = function(email, callback){
	Users.find({'email': email}, {'_id':0, 'email':1}, callback);
}

module.exports.checkEmpExist = function(emp_id, callback) {
	Users.find({'emp_id': emp_id}, {'_id':0, 'emp_id':1}, callback);
}

module.exports.getUsersByRole = function(role,callback, limit) {
  Users.find({'role':role}, {'_id':0, '__v':0, 'password':0}, callback);
}

module.exports.getNameByEmp= function(emp_id, callback) {
	Users.findOne({'emp_id': emp_id}, {'_id':0, 'firstname':1, 'lastname':1}, callback);
}

module.exports.getStoreByEmp= function(emp_id, callback) {
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
        $lookup: {
            from: "Stores",
            localField: "admin_store",
            foreignField: "store_id",
            as: "Stores"
        }
    },
    { 
        $project: {
        '_id': 0,
        'firstname':1,
        'nickname':1,
        'lastname':1,
        'Stores.name':1,
        'Stores.store_id':1,
        'Stores.location.lat':1,
        'Stores.location.lon':1,
        }
    }
  ]).exec((callback));
}

module.exports.getUnread = function(emp_id,callback){
  Users.find({'emp_id': emp_id},{'unread':1,'_id':0},callback)
}

module.exports.clearRead = function(emp_id,callback){
	Users.updateOne({'emp_id': emp_id}, {$set: {'unread':0}},callback);
}

// Get users by ID
module.exports.getUserByEmp = function(emp_id, callback) {
  Users.aggregate([
    {
        $match:{
          'emp_id': emp_id
        }
    },
    {
        $lookup: {
            from: "Stores",
            localField: "admin_store",
            foreignField: "store_id",
            as: "Stores"
        }
    },
    { 
        $project: {
        '_id': 0,
        '__v':0,
        'password':0
        }
    }
  ]).exec((callback));
}

// Get users by email
module.exports.getUserByEmail= function(email, callback) {
	Users.findOne({'email': email}, {'_id':0, '__v':0, 'password':0}, callback);
}

// Update users
module.exports.updateUser = function(emp_id, data, callback) {
	Users.updateOne({'emp_id': emp_id}, {$set: data}, callback);
}

module.exports.changePassword = async function(emp_id,password,callback) {
  const hashedPassword = await bcrypt.hash(password, 10);
  let data = {'password':hashedPassword};
	Users.updateOne({'emp_id': emp_id}, {$set: data}, callback);
}

module.exports.incUnread = function(callback){
  Users.updateMany( 
    { $and: [ { 'status': { $ne: 'banned' } }, { 'status': { $ne: 'closed' } } ] },
    { $inc:{'unread':1}},callback);
}

module.exports.getNoti = function (callback){
  Users.find({},
  {'_id':0,'pushnoti':1},callback); 
}

// Delete users
module.exports.removeUser = function(emp_id, callback) {
	Users.findOneAndDelete({'emp_id': emp_id}, callback);
}
