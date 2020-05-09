/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		main server file

----------------------------------------------*/
const  UserControll = require('./api/controllers/userController'),
  checkMessage = require('./api/routes/check-messsage'),
 lineMessaging = require('./api/routes/line-receive'),
 compression = require('compression'),
 sec_routes = require('./api/routes/secure-routes'),
 schedule = require('node-schedule'),
 client_model = require('./api/models/clients'),
 lead_model = require('./api/models/clientlead'),
 invoice_model = require('./api/models/invoice'),
 dncn_model = require('./api/models/dncn'),
 product_model = require('./api/models/products'),
 transaction_model = require('./api/models/storeTransaction'),
 qs = require('querystring'),
 log_model = require('./api/models/log'),
 user_model = require('./api/models/users'),
 deptor_model = require('./api/models/deptor'),
 sum_model = require('./api/summodels/storetotal'),
 routes = require('./api/routes/routes'),
 {parse, stringify} = require('flatted/cjs'),
 { Kafka, logLevel } = require('kafkajs'),
 session = require('express-session'),
 bodyParser = require('body-parser'),
 socketIO = require('socket.io'),
 passport = require('passport'),
 jwt = require('jsonwebtoken'),
 express = require('express'),
 path = require('path'),
 fs = require('fs'),
 axios = require('axios'),
 moment = require('moment-timezone'),
 http = require('http'),
 {Expo} = require('expo-server-sdk');

const expo = new Expo();
const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: ["kafka.cpf"],
  clientId: 'name',
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync('certpem', 'utf-8')
  },
  sasl: {
    mechanism: 'plain',
    username: '',
    password: '',
  }
})

const consumer = kafka.consumer({ groupId: 'kafka' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'Invoice' })
  await consumer.subscribe({ topic: 'CNDN' })
  await consumer.subscribe({ topic: 'Product' })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let today = moment.tz(new Date(),"Asia/Bangkok").format("YYYY-MM-DD:HH:mm:ss");
      let decoded = message.value.toString('utf8');
      switch(`${topic}`){
        case 'Invoice' :
              let invoiceJSON = JSON.parse(decoded);
              for(let i =0;i<invoiceJSON.InvoiceCNDNList.length;i++){
                if(invoiceJSON.InvoiceCNDNList[i].Account.CVNumber != "1251"){
                let cvtype = checkCVType(invoiceJSON.InvoiceCNDNList[i].Account);
                invoiceJSON.InvoiceCNDNList[i].Account.CVLabel = cvtype;
                if(invoiceJSON.InvoiceCNDNList[i].Store == '1415'){
                  invoiceJSON.InvoiceCNDNList[i].Store = "2826M";
                }
                if(invoiceJSON.InvoiceCNDNList[i].Store == '0422'){
                  invoiceJSON.InvoiceCNDNList[i].Store = "B422"
                }
                if(invoiceJSON.InvoiceCNDNList[i].Store == '1561'){
                  invoiceJSON.InvoiceCNDNList[i].Store = "8001";
                }
                if(invoiceJSON.InvoiceCNDNList[i].Store == '1468'){
                  invoiceJSON.InvoiceCNDNList[i].Store = "2843A";
                }
                invoiceJSON.InvoiceCNDNList[i].Month = moment(invoiceJSON.InvoiceCNDNList[i].IssueDate).format("MMMM");
                invoice_model.newInvoice(invoiceJSON.InvoiceCNDNList[i],(err,data)=>{
                  if(err){
                      let text = +"-------------------------\n"+today+"\n"+err+"\n";
                      fs.appendFileSync(__dirname+"/serverlog.txt",text);
                  }
                  else{
                    invoiceJSON.InvoiceCNDNList[i].Account.Lastorder = invoiceJSON.InvoiceCNDNList[i].IssueDate;
                    invoiceJSON.InvoiceCNDNList[i].Account.Store = invoiceJSON.InvoiceCNDNList[i].Store;
                    let temp =  invoiceJSON.InvoiceCNDNList[i].Account;
                    let body = {
                      "CVNumber":temp.CVNumber,
                      "Name":temp.AccountNameTH,
                      "Type":temp.CVLabel,
                      "Supplier":"CP",
                      "Status":"Acitve",
                      "Refer":temp.Salesman,
                      "Loc":{ type: "Point", coordinates: [ parseFloat(temp.Longitude), parseFloat(temp.Latitude) ] },
                      "Store":temp.Store
                    }
                    let promise = Promise.all([
                      client_model.newClient(invoiceJSON.InvoiceCNDNList[i].Account,(err,data)=>{
                        if(err){
                          let text = +"-------------------------\n"+today+"\n"+err+"\n";
                          fs.appendFileSync(__dirname+"/serverlog.txt",text);
                        }
                      })
                      ,lead_model.newCPClient(body,(err,data)=>{})
                      ,updateB2B(invoiceJSON.InvoiceCNDNList[i].Store)]);
                  }
                });
                }
              }
              break;
        case 'CNDN' :
              let dncnJSON = JSON.parse(decoded);
              for(let i =0;i<dncnJSON.InvoiceCNDNList.length;i++){
                dncn_model.newDncn(dncnJSON.InvoiceCNDNList[i],(err,data)=>{
                  if(err)
                    {
                    
                    let text = +"-------------------------\n"+today+"\n"+err+"\n";
                    fs.appendFileSync(__dirname+"/serverlog.txt",text);
                  }
                  else{
                  }
                });
              }
              break;
        case 'Product' :
              let productJSON = JSON.parse(decoded);
              for(let i =0;i<productJSON.ProductList.length;i++){
                fs.appendFileSync(__dirname+"/product/"+moment(new Date()).format("YYYYMMDD:HH")+"_product.txt",JSON.stringify(productJSON.ProductList[i]));
              }
              break;
        default:
              let text = +"-------------------------\n"+today+"\n"+'not in any case'+"\n";
              fs.appendFileSync(__dirname+"/serverlog.txt",text);
              break;
      }
    },
  })
}

run().catch(e => console.error("error" +` ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
});

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
});

const secrettoken = "key";
const app = express();
app.use(compression());

let io;

app.use(session({
  secret: secrettoken,
  name: '', // connect-mongo session store
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', routes);
app.use('/api/v1', passport.authenticate('jwt', { session : false }), sec_routes );

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});


const server = http.createServer(app);

server.listen(3000,async()=>{
});

io = socketIO({
  transports:[
        'websocket'
      , 'xhr-polling'
      , 'jsonp-polling'
  ]
}).listen(server);


let getSumOfAR =async (salescode) =>{
  const body = {
        dHeader: {
        UserId: salescode,
        ConName: "ODPConnection"
      },
        ClassWithNs: "",
        paramStr: "{}",
        methodName: ""
  };
  await axios({
        method: 'post',
        url: 'CPF_URL',
        data: body
      }).catch(error => {
      }).then(response => {
          let serialized = stringify(response.data);
          let unserialized  = parse(serialized);
          let JSONObj = JSON.parse(unserialized.d);
          let jsonresult = JSONObj.Result;
          let jsonstring = JSON.stringify(jsonresult).replace("\\","");
          jsonresult = JSON.parse(jsonstring);
          for(let i=0;i<jsonresult.length;i++){
            deptor_model.newdeptor(
              {
                CVNumber:jsonresult[i].CV_CODE,
                Salesman:salescode,
                AccountNameTH:jsonresult[i].NAME_LOCAL,
                outstanding:jsonresult[i].LAST_REMAINING_AMOUNT,
                remaining:jsonresult[i].CREDIT_REMAINING,
                dayoverdue:jsonresult[i].DAY_OVERDUE,
                out_updateon:moment(new Date()).format("DD-MM-YYYY")
            },(err,data)=>{
            });
          }
    });
}

//----------------------------------------------------------------------------
// webhook
//----------------------------------------------------------------------------

app.post('/api/webhook', async function(req,res) {
  let replyToken = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  let filter = checkMessage.check(msg);
  switch(filter) {
      default:
          lineMessaging.replyMsg(replyToken,"ปิดให้บริการชั่วคราวเนื่องจากการปรับเปลี่ยน Algorithm จากบริษัท LINE corporation.");
  }
  res.json({
            status: 200,
            message: `Webhook is working!`
        });
});

//----------------------------------------------------------------------------
// websocket
//----------------------------------------------------------------------------

let activeuser = [];
//socket.io
io.on('connection', socket => {
  socket.on('banned', (emp_id)=>{
    let index = -1;
    activeuser.find(function(item, i){
      if(item.emp_id === emp_id){
        index = i;
        return i;
      }
    });
    if(index > -1){
      io.to(activeuser[index].socketid).emit('getbanned');
      activeuser.splice(index,1);
    }
    io.to('adminroom').emit('refresh');
  });

  socket.on('vacarefresh' , (accesstoken) =>{
    jwt.verify(accesstoken, 'key',(err,decoded)=>{
      let index = -1;
        activeuser.find(function(item, i){
            if(item.emp_id === decoded.user.emp_id){
              index = i;
            return;
            }
        });
        if(index > -1){
          io.to(activeuser[index].socketid).emit('vacarefresh');
        }
      });
  });  

  socket.on('joinfeedback',(emp_id)=>{
    socket.join('feedbackroom');
    user_model.clearRead(emp_id,(err,data)=>{
    });
  });

  socket.on('adminHome',()=>{
    socket.join('adminHome');
  });

  socket.on('feedbackMessage',(message)=>{
    user_model.incUnread((err,data)=>{
    });
    message[0].user.avatar = "/user/userImage/blankprofile"
            user_model.getUserByEmp(message[0].user._id,(err,userdata)=>{
                if(err){} 
                else{
                    if(userdata[0].imageprofile != undefined) message[0].user.avatar = "/user/userImage/"+userdata[0].imageprofile;
                    message[0].user.name = userdata[0].nickname;
                    io.to('feedbackroom').emit('newfeed',message);
                    socket.broadcast.emit('unreadRefresh');
                }
            });
  });

  socket.on('exitfeedback',(emp_id)=>{
    socket.leave('feedbackroom');
    user_model.clearRead(emp_id,(err,data)=>{
    });
    socket.emit('unreadRefresh')
  });

  socket.on('enterPlace',(_id)=>{
    socket.join(_id);
  });

  socket.on('placeMessage',(message,_id)=>{
    message[0].user.avatar = "/user/userImage/blankprofile"
            user_model.getUserByEmp(message[0].user._id,(err,userdata)=>{
                if(err){} 
                else{
                    if(userdata[0].imageprofile != undefined) message[0].user.avatar = "/user/userImage/"+userdata[0].imageprofile;
                    message[0].user.name = userdata[0].nickname;
                    io.to(_id).emit('newDescrip',message);
                }
            });
  });

  socket.on('exitPlace',(_id)=>{
    socket.leave(_id);
  });

  socket.on('requrestadmin',()=>{
  	user_model.getUsersByRole('admin',(err,data) =>{
  		if(err){} 
  		else{
  			let pushToken = [];
  			for(let i = 0;i<data.length;i++){
  				pushToken.push(data[i].pushnoti);
  			}
  			pushnoti(pushToken,"มีผู้ใช้ใหม่ กรุณตรวจสอบ...",null);
  		}
  	});
    io.to('adminroom').emit('refresh');
  });

  socket.on('refresh', (emp_id) =>{
    let index = -1;
    if(activeuser.length>0){
    activeuser.find(function(item, i){
        if(item.emp_id === emp_id){
          index = i;
          return;
        }
      });
    }
    if(index > -1){
      console.log('refresh:'+activeuser[i].socketid+"/"+activeuser[i].emp_id);
      io.to(activeuser[i].socketid).emit('refresh');
      io.to('adminroom').emit('refresh');
    }
  })

  socket.on('login', (accesstoken)=> {
  	jwt.verify(accesstoken, 'key',(err,decoded)=>{
    let index = -1;
  		activeuser.find(function(item, i){
      		if(item.emp_id === decoded.user.emp_id){
            index = i;
        	return;
      		}
      });
      if(index > -1){
        //io.to(activeuser[index].socketid).emit('getlogout');
        console.log('duplicate:'+"/"+activeuser[index].emp_id);
        activeuser.splice(index,1);
      }
        log_model.createlog({
            emp_id:decoded.user.emp_id,
            cat:'Login',
            subcat:'Token'
        }, (err) => {
          if (err) console.log(err);
        });
  			activeuser.push({
  				socketid:socket.id,
  				emp_id:decoded.user.emp_id
  			});
        if(decoded.user.role == 'admin'){
          socket.join('adminroom');
        }
        io.to('adminroom').emit('refresh');
        console.log('login:'+decoded.user.emp_id);
  	});
  });

  socket.on('logout', (emp_id)=>{
    let index = -1;
    if(activeuser.length>0){
      activeuser.find(function(item, i){
  		  if(item.emp_id === emp_id){
          index = i;
          return;
  		  }
      });
    }
    if(index > -1){
      user_model.updateUser(activeuser[index].emp_id,{'status':'offline','offline':Date.now()},(err,data)=>{
        if(err){}
        else{} 
      });
      console.log('logout:'+activeuser[index].emp_id);
      activeuser.splice(index,1);
    }
    socket.leave('adminroom');
  });

  socket.on('disconnect', ()=>{
    if(activeuser.length >0){
      let index = -1;
  	  activeuser.find(function(item, i){
      if(item != undefined){
  		if(item.socketid === socket.id){
        index = i;
    		return;
      }
    }
    });
  if(index > -1){
    user_model.updateUser(activeuser[index].emp_id,{'status':'offline','offline':Date.now()},(err,data)=>{
      if(err){} 
      else{
        console.log('disconnect:'+"/"+activeuser[index].emp_id);
        activeuser.splice(index,1);
      }
    });
    }
    }
    socket.leave('adminroom');
  });
});


//----------------------------------------------------------------------------
// for Notification only!!!
//----------------------------------------------------------------------------

let pushnoti = (notitoken,message,data) =>{
	let messages = [];
	for (let pushToken of notitoken) {
  		if (!Expo.isExpoPushToken(pushToken)) {
    		console.error(`Push token ${pushToken} is not a valid Expo push token`);
    		continue;
  		}
  		messages.push({
    		to: pushToken,
    		sound: 'default',
    		body: message,
    		data: {payload:data},
  		});
 	}
 	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
		(async () => {
  		for (let chunk of chunks) {
    		try {
      			let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      			
      			tickets.push(...ticketChunk);
    	} catch (error) {
      			console.error(error);
    	 }
  		}
	})();
let receiptIds = [];
for (let ticket of tickets) {
  if (ticket.id) {
    receiptIds.push(ticket.id);
  }
}

let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
(async () => {
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      for (let receipt of receipts) {
        if (receipt.status === 'ok') {
          continue;
        } else if (receipt.status === 'error') {
          if (receipt.details && receipt.details.error) {
          }
        }
      }
    } catch (error) {
    }
  }
})();
}

//----------------------------------------------------------------------------
// for Schedule only!!!
//----------------------------------------------------------------------------

let checkCVType = (accout)=>{
  switch(accout.CVTypeCode){
    case 'IM13004167':
        return "ในเครือ";
    case 'FS101504':
        return 'Agent';
    case 'FS101509':
        return 'Agent';
    case 'FS102101':
        return 'Agent';
    case 'FS101405':
        return 'จัดเลี้ยง';
    case 'FS102202':
        return 'Fresh Shop';
    case 'FS102203':
        return 'Fresh Shop';
    case 'FS102204':
        return 'Fresh Shop';
    case 'FS1001':
        return 'โรงแรม';
    case 'FS101406':
        return 'โรงแรม';
    case 'FS101701':
        return 'โรงแรม';
    case 'FS200201':
        return 'Industry';
    case 'FS101506':
        return 'Pork Shop';
    case 'BK':
        return 'อื่นๆ';
    case '17':
        return 'อื่นๆ';
    case '25':
        return 'อื่นๆ';
    case '801C127':
        return 'ตลาดสด';
    case 'FS1011':
        return 'ตลาดสด';
    case '2212F127':
        return 'ตลาดสด';
    case '802D227':
        return 'ตลาดสด';
    case 'FS101505':
        return 'ตลาดสด';
    case 'FS101507':
        return 'ตู้เย็นชุมชน';
    case 'FS100802':
        return 'ตู้เย็นชุมชน';
    case 'FS101604':
        return 'ตู้หมู';
    case 'FS100803':
        return 'ตู้หมู';
    case 'FS101503':
        return 'ตู้หมู';
    case 'I010101':
        return 'ในเครือ';
    case 'FS101508':
        return 'ร้านค้าปลีก';
    case 'FS101603':
        return 'ร้านค้าปลีก';
    case 'FS1007':
        return 'ร้านค้าปลีก';
    case 'FS101501':
        return 'ร้านค้าปลีก';
    case '1001':
        return 'ร้านค้าปลีก';
    case 'FS101702':
        return 'ร้านอาหาร';
    case 'FS1005':
        return 'ร้านอาหาร';
    case '881C01H9':
        return 'ร้านอาหาร';
    case 'FS101408':
        return 'ร้านอาหาร';
    case 'FS101601':
        return 'ร้านอาหาร';
    case '1002D9':
        return 'ร้านอาหาร';
    case 'FS101404':
        return 'โรงพยาบาล';
    case 'FS101403':
        return 'โรงเรียน';
    case 'FS101407':
        return 'สถาบัน-ราชการ';
    case '2209A1':
        return 'หน่วยงานเอกชน-ปรุงอาหารขาย';
    case 'FS101801':
        return 'ธุรกิจอาหารพร้อมทาน';
    case 'FS101602':
        return 'อื่นๆ';
    default :
        return accout.CVType;
  }
}

let updateB2B = async (store_id)=>{
  let result;
      getSumB2B(store_id,moment(new Date()).format("MMMM"),moment(new Date()).format('YYYY'),async (b2b)=>{
        if(b2b == null){
          result={
              month:moment(new Date()).format("MMMM"),
              year:moment(new Date()).format('YYYY'),
              store: store_id,
              data:[],
              groupsale:[],
              today:0,
              amount:0,
              avg:0,
              rr:0
          }
        }else {
          result = b2b
          result.month = moment(new Date()).format("MMMM");
          result.year = moment(new Date()).format('YYYY');
          result.store = store_id;
        };
        sum_model.updatestore(store_id,result,(err,data)=>{
        });
      })
}

let updateB2C = async (store_id) =>{
  let result ={
    b2c:0,
    month:moment(new Date()).format("MMMM"),
    year:moment(new Date()).format('YYYY')
  }
  getSumB2C(store_id,moment(new Date()).format("MMMM"),moment(new Date()).format('YYYY'), (B2Cresult)=>{
      result.b2c = B2Cresult.sumtotal;
      sum_model.updatestore(store_id,result,(err,data)=>{
        
      });
    });
}

schedule.scheduleJob('30 07 * * *' ,() =>{
  let store = [
    //cpf store code
  ];
  for(let i=0;i<store.length;i++){
    frontStore(store[i],moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1)).format("YYYYMMDD"));
  }
});

schedule.scheduleJob('15 03 * * *', ()=>{
  let store = [//cpf store code
  ];
  for(let i=0;i<store.length;i++){
    updateB2B(store[i]);
  }
});

schedule.scheduleJob('02 00 * * *',()=>{
  user_model.getUsersByRole('saleman',(err,data)=>{
    if(err){} 
    else{
      for(let i=0;i<data.length;i++){
        getSumOfAR(data[i].emp_id);
      }
    }
  });
});

schedule.scheduleJob('30 01 * * *', async()=>{
  let classprice = [
    // CPF product_Class
  ]
  for(let i=0;i<classprice.length;i++){
    await upDatePrice(classprice[i]);
  }
});

schedule.scheduleJob('15 05 * * *', async()=>{
  retailPrice();
});

schedule.scheduleJob('10 02 * * *', async()=>{
  classCost();
})

schedule.scheduleJob('30 03 * * *', async()=>{
  let classprice = [
    // CPF product_Class
  ]
    for(let i=0;i<classprice.length;i++){
      await upDatePrice(classprice[i]);
    }
});

let frontStore = async (store,date) =>{
  function callback(itempush,sum,count) {
  if(itempush.length > 0){
    let result = Object.values(count)
   transaction_model.insertManyTran(itempush, (err, data) => {
        if (err){} 
        else {
            updateB2C(store);
            getAdminStaff(store, 'B2C(' + store + '): ' + formatMoney(sum) + " บาท " + "\n TC: " + result.length + "\n TA: " + Math.round(sum / result.length) + " บาท");
        }
    });
  }else{
    sendLineNoti(store+": "+ formatMoney(sum));
  }
}
// url for get transaction
await axios.get('')
    .catch(error => {
      sendLineNoti("frontStore("+store+"): "+error.response);
      callback([],0,0);
    })
    .then(async result => {
        let count = {};
        let sum = 0;
        let itempush = [];
        let itemProcessed = 0;
        if(result.data != undefined){
        await result.data.forEach(async (item) => {
            await product_model.getCatByProduct(item.PRODUCT_CODE, async (err, data) => {
                if (err){}
                else {
                    if (data.length > 0) {
                        item.Cat = data[0].Cat;
                    }
                    item.CREATE_DATE = new Date(Date.parse(moment(item.CREATE_DATE).format("YYYY-MM-DD") + "T" + item.CREATE_TIME + '.000-00:00'));
                    item.store_id = store;
                    item.Month = moment(new Date(new Date(item.CREATE_DATE).getTime() - 25200000), 'Asia/Bangkok').format("MMMM");
                    item.Year = moment(new Date(new Date(item.CREATE_DATE).getTime() - 25200000), 'Asia/Bangkok').format("YYYY");
                    delete item.CREATE_TIME;
                    itempush.push(item);
                    sum += item.AMOUNT;
                    1 + (count[item.DOC_NUMBER] || 0);
                    count[item.DOC_NUMBER] = {
                      DOC_NUMBER:item.DOC_NUMBER,
                      count: count[item.DOC_NUMBER] ? count[item.DOC_NUMBER].count + 1 : 1
                    }
                    itemProcessed++;
                    if (itemProcessed === result.data.length) {
                        callback(itempush,sum,count)
                    }
                }
            });
        });
       }else{
          sendLineNoti("frontStore: "+store+"result.data null");
          callback([],0,0);
       }
    })
}

let getAdminStaff = (store,message)=>{
  user_model.getAdminandStaff(store,(err,data) =>{
    if(err){} 
    else{
      let pushToken = [];
      for(let i = 0;i<data.length;i++){
        if(data[i].pushnoti!= '')
          pushToken.push(data[i].pushnoti);
      } 
      pushnoti(pushToken,message,null);
    }
  });
}

let retailPrice = async () =>{
  await axios.get('')
  .catch(error => {
      sendLineNoti("retail_Price: "+error.response);
    })
  .then( result =>{
    for(let i=0;i<result.data.length;i++){
      let product = {
        product_code:result.data[i].PRODUCT_CODE,
        retail_Price:result.data[i].RETAIL_PRICE,
      }
      product_model.updateProduct(result.data[i].PRODUCT_CODE,product, async (err, data) => {
      });
    }
  });
}

let classCost = async () =>{
  await axios.get('')
  .catch(error =>{
    sendLineNoti("classCost: "+error.response);
  })
  .then( result =>{
    let products = [];
    for(let i=0;i<result.data.length;i++){
      result.data[i].PRODUCT_CODE = '' + result.data[i].PRODUCT_CODE;
      while (result.data[i].PRODUCT_CODE.length < 18) {
        result.data[i].PRODUCT_CODE = '0' + result.data[i].PRODUCT_CODE;
      }
      if((result.data[i].CLASS_COST == "CLSPRA" 
          || result.data[i].CLASS_COST == "CLSPRBI01" 
          || result.data[i].CLASS_COST == "CLSPRBI02") 
          && result.data[i].VENDOR_CODE == "242"){
        let product ={
          product_code:result.data[i].PRODUCT_CODE,
          CLASS_COST:result.data[i].CLASS_COST,
          GROSS_COST:result.data[i].GROSS_COST,
          UM_CODE:result.data[i].UM_CODE,
          VENDOR_CODE:result.data[i].VENDOR_CODE,
          updateon:moment(new Date()).format("YYYY-MM-DD")
        }
        if(product.UM_Text!=undefined){
          products.push(product);
        }
      }
    }
    product_model.updateCost(products,(data)=>{
    });
  });
}

//url get updateprice
let upDatePrice = async (classprice) =>{
  await axios.get('')
  .catch(error => {
    sendLineNoti("upDatePrice: "+error.response);
    })
  .then( result =>{
    for(let i=0;i<result.data.length;i++){
      result.data[i].PRODUCT_CODE = '' + result.data[i].PRODUCT_CODE;
      while (result.data[i].PRODUCT_CODE.length < 18) {
        result.data[i].PRODUCT_CODE = '0' + result.data[i].PRODUCT_CODE;
      }
      let product = {
        product_code:result.data[i].PRODUCT_CODE,
        classprice:{
          zone:classprice.zone,
          label:classprice.label,
          class:classprice.class,
          UM_CODE:result.data[i].UM_CODE,
          price:result.data[i].NET_PRICE
        },
        updateon:moment(new Date()).format("YYYY-MM-DD")
      }
      product_model.updatePrice(product, (err, data) => {
        if (err || data == null) {
        }
      });
    }
  });
}

let getSumB2B = (store_id,month,year,callback) =>{
    invoice_model.getInvoiceSumTotal(store_id,month,year,(err,invoiceData)=>{
        if(err){} 
        else{              
            let jsonresult = [];
            let groupsale = [];
            let sumtoday =0;
            for (let i = 0; i < invoiceData.length; i++) {
                if (invoiceData[i].Dncn.length > 0) {
                    invoiceData[i].NetAmount = invoiceData[i].Dncn[0].CorrectProductValue;
                }
                if(moment.tz(new Date(invoiceData[i].IssueDate),"Asia/Bangkok").format("YYYY-MM-DD") == moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD")){
                    sumtoday+= invoiceData[i].NetAmount;
                }
                if (jsonresult.length > 0) {
                    let index = -1;
                    jsonresult.find((item, j) => {
                        if (item.CVLabel == invoiceData[i].Account[0].CVLabel) {
                            index = j;
                            return;
                        }
                    });
                    if (index == -1) {
                        jsonresult.push({
                            CVLabel: invoiceData[i].Account[0].CVLabel,
                            CVType: invoiceData[i].Account[0].CVType,
                            CVTypeCode: invoiceData[i].Account[0].CVTypeCode,
                            Chsum: invoiceData[i].NetAmount
                        });
                    } else {
                        jsonresult[index].Chsum += invoiceData[i].NetAmount;
                    }
                } else {
                    jsonresult.push({
                        CVLabel: invoiceData[0].Account[0].CVLabel,
                        CVType: invoiceData[0].Account[0].CVType,
                        CVTypeCode: invoiceData[0].Account[0].CVTypeCode,
                        Chsum: invoiceData[0].NetAmount
                    });
                }
                if (groupsale.length > 0) {
                    let index = -1;
                    groupsale.find((item, j) => {
                        if (item.SalesCode == invoiceData[i].Account[0].Salesman) {
                            index = j;
                            return;
                        }
                    });
                    if (index == -1) {
                        if(invoiceData[i].Users != null){
                            groupsale.push({
                                SalesCode: invoiceData[i].Account[0].Salesman,
                                SalesName: invoiceData[i].Users.firstname +" "+ invoiceData[i].Users.lastname,
                                Salesum: invoiceData[i].NetAmount
                            });
                        }else{
                            groupsale.push({
                                SalesCode: invoiceData[i].Account[0].Salesman,
                                SalesName: invoiceData[i].Account[0].Salesman,
                                Salesum: invoiceData[i].NetAmount
                            });
                        }
                    } else {
                        groupsale[index].Salesum += invoiceData[i].NetAmount;
                    }
                } else {
                    if(invoiceData[i].Users != null){
                        groupsale.push({
                            SalesCode: invoiceData[i].Account[0].Salesman,
                            SalesName: invoiceData[i].Users.firstname +" "+ invoiceData[i].Users.lastname,
                            Salesum: invoiceData[i].NetAmount
                        });
                    }else{
                        groupsale.push({
                            SalesCode: invoiceData[i].Account[0].Salesman,
                            SalesName: invoiceData[i].Account[0].Salesman,
                            Salesum: invoiceData[i].NetAmount
                        });
                    }
                }
            }
            let result =null;
            if(month == moment(Date.now()).format("MMMM")){
                let month = new Date(Date.now()).getMonth();
                result={
                    data: jsonresult,
                    groupsale:groupsale,
                    today:sumtoday,
                    amount: jsonresult.reduce((sum, b) => sum + b.Chsum, 0),
                    avg:jsonresult.reduce((sum, b) => sum + b.Chsum, 0)/new Date(Date.now()).getDate(),
                    rr:jsonresult.reduce((sum, b) => sum + b.Chsum, 0)/new Date(Date.now()).getDate()*new Date(year,month+1,0).getDate()
                }
            }else{
                if(invoiceData.length>0){
                    let month = moment(new Date(invoiceData[0].IssueDate)).format("M");
                    result={
                        data: jsonresult,
                        groupsale:groupsale,
                        amount: jsonresult.reduce((sum, b) => sum + b.Chsum, 0),
                        avg:jsonresult.reduce((sum, b) => sum + b.Chsum, 0)/new Date(year,month,0).getDate(),
                        rr:jsonresult.reduce((sum, b) => sum + b.Chsum, 0)
                    }
                }
            }
            callback(result);
                    }
            })
}

let getSumB2C = (store_id,month,year,callback) =>{
  let temp={
    'store_id':store_id,
    'Month':month,
    'Year':year
  }
  transaction_model.getTransactionssumByMonth(temp, (err,data) => {
      if(err){} 
      else {
          let sum ={
              sumtotal:0
          }
          for(let i=0;i<data.length;i++){
              sum.sumtotal+=data[i].sumtotal;
          }
          callback(sum);
      }
  });
}

let sendLineNoti = async (text)=>{
  const AuthStr = 'Bearer '.concat("key");
  await axios({
      'headers' : { 'Authorization': AuthStr,
                    'Content-Type': 'application/x-www-form-urlencoded'},
      'method': 'post',
      'url': 'https://notify-api.line.me/api/notify',
      'data':qs.stringify({
          message: text,
      })
    }).catch((err)=>{
    }).then(response =>{
    });
}

let formatMoney = (inum) => {
  let s_inum = new String(inum);
  let num2 = s_inum.split(".");
  let n_inum = "";  
  if(num2[0] != undefined){
      let l_inum = num2[0].length;  
      for(i=0;i<l_inum;i++){  
          if(parseInt(l_inum-i)%3==0){  
              if(i==0){  
                  n_inum+=s_inum.charAt(i);         
              }else{  
                  n_inum+=","+s_inum.charAt(i);         
              }     
          }else{  
              n_inum+=s_inum.charAt(i);  
          }  
      }  
  }else{
      n_inum=inum;
  }
  if(num2[1]!=undefined){
      n_inum+="."+num2[1];
  }
  return n_inum;
}