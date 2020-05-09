/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2018-12-13:16.34
	@modeified 	2018-12-17:23.58
	@des		push message from line.

----------------------------------------------*/
const Linemsgapi = require('./line-messaging');

class Linepush{
	constructor() {}

	async pushMsg(userid, message){
		let msg = [{
					type: 'text',
					text: message
				}];
		try{
			await Linemsgapi.push(userid,msg)
		}
		catch (e){
			console.log(e);
		}
	}
	async pushLocation(userid, message){
		let msg = [{
					type: 'location',
					title: message.title,
					address: message.address,
					latitude: message.latitude,
					longitude: message.longitude
				}];
		try{
			await Linemsgapi.push(userid,msg)
		}
		catch (e){
			console.log(e);
		}
	}
}

module.exports = new Linepush();
