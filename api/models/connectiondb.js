
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		connect mongodb

----------------------------------------------*/

const mongoose = require('../../node_modules/mongoose');
const opt = {
        user: 'username', //change for your
        pass: 'password', //change for your
        useUnifiedTopology: true,
        useNewUrlParser: true,  
        useCreateIndex: true
    };
const db = mongoose.connect( 'mongodb://localhost:27017/dbname', opt); //change for your db name
mongoose.connection.on('error', error => console.log(error) );
mongoose.set('useFindAndModify', false);
module.exports.Connection = db;
module.exports.Mongoose = mongoose;
