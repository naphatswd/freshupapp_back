/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2018-12-13:16.34
	@modeified 	2018-12-17:23.57
	@des		service connect to line msg api

----------------------------------------------*/
const linesdk = require('../../node_modules/@line/bot-sdk');
const client = new linesdk.Client({
	  channelAccessToken: 'channelAccessToken'
});

class Linemsgapi{
	constructor() {}
	async reply(replyToken,message){
			try{
				await client.replyMessage(replyToken,message);
			}
			catch (e){
				console.log(e);
			}
	}
	async push(tokenid,message){
			try{
				await client.pushMessage(tokenid,message);
			}
			catch (e){
				console.log(e);
			}
	}
}
module.exports = new Linemsgapi();