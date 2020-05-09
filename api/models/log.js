/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		log of user

----------------------------------------------*/
const db = require('./connectiondb.js');

//log Schema
const logSchema = db.Mongoose.Schema({ 
    emp_id:{
        type:String
    },
    cat:{
        type:String,
        enum: ["Login", "ProductSearch", "Overview", "B2B", "B2C" ,"ViewClient", "POI", "Quotation" ,"ContractPrice", "ViewUser"],
    },
    subcat:{
        type:String,
    },
    location:{
        type:{
            lat: {type:Number},
            lon: {type:Number}
        }
    },
    created_date:{
        type:Date,
        default: Date.now
    }
}, {collection:'Logmodel'});

//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const log = module.exports =  db.Mongoose.model('Logmodel', logSchema);

module.exports.createlog = function(data, callback) {
    log.create(data, callback);
}

module.exports.getLog = function(callback){
    log.find({},{'_id':0},callback);
}
