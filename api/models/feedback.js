/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		feedback of app

----------------------------------------------*/

const db = require('./connectiondb.js');

//token Schema
const feedSchema = db.Mongoose.Schema({ 
    emp_id:{
        type:String,
        required:true
    },
    data:{
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
    }
}, {collection:'feedback'});


//----------------------------------------------------------------------------
// for call from app.js 
//----------------------------------------------------------------------------

const Feed = module.exports =  db.Mongoose.model('feedback', feedSchema);

module.exports.newFeedback = function(data,callback){
    Feed.updateOne({emp_id:data.emp_id},{$set:data},{upsert:true},callback);
}
// Get token by ID
module.exports.getFeedback = function(emp_id,callback) {
	Feed.findOne({emp_id:emp_id}, {'_id':0, '__v':0 }, callback);
}