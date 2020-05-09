/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2018-12-13:16.39
	@modeified 	2018-12-17:23.59
	@des		receive message from line.

----------------------------------------------*/
const Linemsgapi = require('./line-messaging');

class Linereceive{
	constructor() {}

	async replyMsg(replyToken, message){
		let msg = [{
			type: 'text',
			text: message
		}];	
		try{
			await Linemsgapi.reply(replyToken,msg);
		}
		catch (e){
			console.log(e);
		}
	}
	async replyImg(replyToken, originalContentUrl, previewImageUrl){
		let msg = [{
			type: 'image',
			originalContentUrl: originalContentUrl,
			previewImageUrl: previewImageUrl
		}];	
		try{
			await Linemsgapi.reply(replyToken,msg);
		}
		catch (e){
			console.log(e);
		}
	}
}

module.exports = new Linereceive();