'use strict'
/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		secure route all api had to authen

----------------------------------------------*/
const { parse,stringify } = require('../../node_modules/flatted/cjs');
const transaction_model = require('../models/storeTransaction');
const moment = require('../../node_modules/moment-timezone');
const { getDistance } = require('../../node_modules/geolib');
const quotation_model = require('../models/quotation_model');
const jwt = require('../../node_modules/jsonwebtoken');
const express = require('../../node_modules/express');
const feedback_model = require('../models/feedback');
const sum_model = require('../summodels/storetotal');
const vacation_model = require('../models/vacation');
const product_model = require('../models/products');
const atten_model = require('../models/attendance');
const quatation = require('./quatation/Quatation');
const lead_model = require('../models/clientlead');
const invoice_model = require('../models/invoice');
const j2x = require('../../node_modules/exceljs');
const axios = require('../../node_modules/axios');
const client_model = require('../models/clients');
const store_model = require('../models/stores');
const user_model = require('../models/users');
const { Expo } = require('expo-server-sdk');
const log_model = require('../models/log');
const router = express.Router();
const fs = require('fs');
const expo = new Expo();
const tokenList = [];

// admin only ------ Order controller
const verify_token = (token, callback) => {
    jwt.verify(token, 'key', function(err, decoded) {
        if (err) {
            callback(false)
        } else {
            if (!tokenList.includes(token)) {
                callback(false,decoded);
            } else {
                callback(true);
            }
        }
    });
}

// PRODUCT

router.post('/product/remove', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                product_model.removeProduct(req.body.sap_code, (err, data) => {
                    if (err || data == null) {
                        res.send('something went wrong.');
                    } else {
                        res.json(data);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});

router.post('/product/getCat', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            product_model.getCat((err, data) => {
                if (err || data == null) {
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        }
    })
});

router.post('/product/getProductCostGroupID', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            product_model.getProductCostGroupID(req.body,(err,data)=>{
                if (err) {
                    res.send(err);
                } else {
                    data.forEach(item =>{
                        if(item.Cat == "PORK & OTHER MEAT"){
                            if(item.classBI01 != null){
                                let temp = [];
                                item.classBI01.forEach(element =>{
                                    let index = -1;
                                    temp.find((item, j) => {
                                        if (element.UM_CODE == item.UM_CODE) {
                                            index = j;
                                            return;
                                        }
                                    });
                                    if(index >-1){
                                        temp[index].count++;
                                        temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                    }else{
                                        temp.push({
                                            'CLASS_COST':element.CLASS_COST,
                                            'UM_CODE':element.UM_CODE,
                                            'UM_Text':element.UM_Text,
                                            'UM_Thai':element.UM_Thai,
                                            'GROSS_COST':element.GROSS_COST,
                                            'count':1
                                        })
                                    }
                                });
                                temp.forEach(element=>{
                                    element.GROSS_COST /= element.count;
                                })
                                item.Cost = temp;
                            }else if(item.classA != null){
                                let temp = [];
                                item.classA.forEach(element =>{
                                    let index = -1;
                                    temp.find((item, j) => {
                                        if (element.UM_CODE == item.UM_CODE) {
                                            index = j;
                                            return;
                                        }
                                    });
                                    if(index >-1){
                                        temp[index].count++;
                                        temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                    }else{
                                        temp.push({
                                            'CLASS_COST':element.CLASS_COST,
                                            'UM_CODE':element.UM_CODE,
                                            'UM_Text':element.UM_Text,
                                            'UM_Thai':element.UM_Thai,
                                            'GROSS_COST':element.GROSS_COST,
                                            'count':1
                                        })
                                    }
                                });
                                temp.forEach(element=>{
                                    element.GROSS_COST /= element.count;
                                })
                                item.Cost = temp;
                            }else{
                                item.Cost = 0;
                            }
                        }else if(item.Cat == "SAUSAGE"){
                            if(item.classBI02 != null){
                                let temp = [];
                                item.classBI02.forEach(element =>{
                                    let index = -1;
                                    temp.find((item, j) => {
                                        if (element.UM_CODE == item.UM_CODE) {
                                            index = j;
                                            return;
                                        }
                                    });
                                    if(index >-1){
                                        temp[index].count++;
                                        temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                    }else{
                                        temp.push({
                                            'CLASS_COST':element.CLASS_COST,
                                            'UM_CODE':element.UM_CODE,
                                            'UM_Text':element.UM_Text,
                                            'UM_Thai':element.UM_Thai,
                                            'GROSS_COST':element.GROSS_COST,
                                            'count':1
                                        })
                                    }
                                });
                                temp.forEach(element=>{
                                    element.GROSS_COST /= element.count;
                                })
                                item.Cost = temp;
                            }else if(item.classA != null){
                                let temp = [];
                                item.classA.forEach(element =>{
                                    let index = -1;
                                    temp.find((item, j) => {
                                        if (element.UM_CODE == item.UM_CODE) {
                                            index = j;
                                            return;
                                        }
                                    });
                                    if(index >-1){
                                        temp[index].count++;
                                        temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                    }else{
                                        temp.push({
                                            'CLASS_COST':element.CLASS_COST,
                                            'UM_CODE':element.UM_CODE,
                                            'UM_Text':element.UM_Text,
                                            'UM_Thai':element.UM_Thai,
                                            'GROSS_COST':element.GROSS_COST,
                                            'count':1
                                        })
                                    }
                                });
                                temp.forEach(element=>{
                                    element.GROSS_COST /= element.count;
                                })
                                item.Cost = temp;
                            }else{
                                item.Cost = 0;
                            }
                        }else{
                            if(item.classA != null){
                                let temp = [];
                                item.classA.forEach(element =>{
                                    let index = -1;
                                    temp.find((item, j) => {
                                        if (element.UM_CODE == item.UM_CODE) {
                                            index = j;
                                            return;
                                        }
                                    });
                                    if(index >-1){
                                        temp[index].count++;
                                        temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                    }else{
                                        temp.push({
                                            'CLASS_COST':element.CLASS_COST,
                                            'UM_CODE':element.UM_CODE,
                                            'UM_Text':element.UM_Text,
                                            'UM_Thai':element.UM_Thai,
                                            'GROSS_COST':element.GROSS_COST,
                                            'count':1
                                        })
                                    }
                                });
                                temp.forEach(element=>{
                                    element.GROSS_COST /= element.count;
                                })
                                item.Cost = temp;
                            }else{
                                item.Cost = 0;
                            }
                        }
                        let temp =[];
                        if(item.products!=null){
                            item.products.forEach(element=>{
                                temp.push({
                                    'price':element.price,
                                    'UM_Text':element.UM_Text,
                                    'UM_Thai':element.UM_Thai,
                                    'UM_CODE':element.UM_CODE
                                });
                            });}
                            delete item.classBI01;
                            delete item.classBI02;
                            delete item.classA;
                            delete item.products;
                            item.price = temp;
                    });
                    res.json(data);
                }
            });
        }
    });
});

router.post('/product/getproductbyCat', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            product_model.getProductByCats(req.body.cats, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        }
    });
});

router.post('/product/getProductByClassPrice', (req ,res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            product_model.getProductByClassPrice(req.body, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    if(data[0].Cat == "PORK & OTHER MEAT"){
                        if(data[0].classBI01 != null){
                            let temp = [];
                            data[0].classBI01.forEach(element =>{
                                let index = -1;
                                temp.find((item, j) => {
                                    if (element.UM_CODE == item.UM_CODE) {
                                        index = j;
                                        return;
                                    }
                                });
                                if(index >-1){
                                    temp[index].count++;
                                    temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                }else{
                                    temp.push({
                                        'CLASS_COST':element.CLASS_COST,
                                        'UM_CODE':element.UM_CODE,
                                        'UM_Text':element.UM_Text,
                                        'UM_Thai':element.UM_Thai,
                                        'GROSS_COST':element.GROSS_COST,
                                        'count':1
                                    })
                                }
                            });
                            temp.forEach(element=>{
                                element.GROSS_COST /= element.count;
                            })
                            data[0].Cost = temp;
                        }else if(data[0].classA != null){
                            let temp = [];
                            data[0].classA.forEach(element =>{
                                let index = -1;
                                temp.find((item, j) => {
                                    if (element.UM_CODE == item.UM_CODE) {
                                        index = j;
                                        return;
                                    }
                                });
                                if(index >-1){
                                    temp[index].count++;
                                    temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                }else{
                                    temp.push({
                                        'CLASS_COST':element.CLASS_COST,
                                        'UM_CODE':element.UM_CODE,
                                        'UM_Text':element.UM_Text,
                                        'UM_Thai':element.UM_Thai,
                                        'GROSS_COST':element.GROSS_COST,
                                        'count':1
                                    })
                                }
                            });
                            temp.forEach(element=>{
                                element.GROSS_COST /= element.count;
                            })
                            data[0].Cost = temp;
                        }else{
                            data[0].Cost = 0;
                        }
                    }else if(data[0].Cat == "SAUSAGE"){
                        if(data[0].classBI02 != null){
                            let temp = [];
                            data[0].classBI02.forEach(element =>{
                                let index = -1;
                                temp.find((item, j) => {
                                    if (element.UM_CODE == item.UM_CODE) {
                                        index = j;
                                        return;
                                    }
                                });
                                if(index >-1){
                                    temp[index].count++;
                                    temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                }else{
                                    temp.push({
                                        'CLASS_COST':element.CLASS_COST,
                                        'UM_CODE':element.UM_CODE,
                                        'UM_Text':element.UM_Text,
                                        'UM_Thai':element.UM_Thai,
                                        'GROSS_COST':element.GROSS_COST,
                                        'count':1
                                    })
                                }
                            });
                            temp.forEach(element=>{
                                element.GROSS_COST /= element.count;
                            })
                            data[0].Cost = temp;
                        }else if(data[0].classA != null){
                            let temp = [];
                            data[0].classA.forEach(element =>{
                                let index = -1;
                                temp.find((item, j) => {
                                    if (element.UM_CODE == item.UM_CODE) {
                                        index = j;
                                        return;
                                    }
                                });
                                if(index >-1){
                                    temp[index].count++;
                                    temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                }else{
                                    temp.push({
                                        'CLASS_COST':element.CLASS_COST,
                                        'UM_CODE':element.UM_CODE,
                                        'UM_Text':element.UM_Text,
                                        'UM_Thai':element.UM_Thai,
                                        'GROSS_COST':element.GROSS_COST,
                                        'count':1
                                    })
                                }
                            });
                            temp.forEach(element=>{
                                element.GROSS_COST /= element.count;
                            })
                            data[0].Cost = temp;
                        }else{
                            data[0].Cost = 0;
                        }
                    }else{
                        if(data[0].classA != null){
                            let temp = [];
                            data[0].classA.forEach(element =>{
                                let index = -1;
                                temp.find((item, j) => {
                                    if (element.UM_CODE == item.UM_CODE) {
                                        index = j;
                                        return;
                                    }
                                });
                                if(index >-1){
                                    temp[index].count++;
                                    temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                }else{
                                    temp.push({
                                        'CLASS_COST':element.CLASS_COST,
                                        'UM_CODE':element.UM_CODE,
                                        'UM_Text':element.UM_Text,
                                        'UM_Thai':element.UM_Thai,
                                        'GROSS_COST':element.GROSS_COST,
                                        'count':1
                                    })
                                }
                            });
                            temp.forEach(element=>{
                                element.GROSS_COST /= element.count;
                            })
                            data[0].Cost = temp;
                        }else{
                            data[0].Cost = 0;
                        }
                    }
                    let temp =[];
                    if(data[0].products!=null){
                    data[0].products.forEach(element=>{
                        temp.push({
                            'price':element.price,
                            'UM_Text':element.UM_Text,
                            'UM_Thai':element.UM_Thai,
                            'UM_CODE':element.UM_CODE
                        });
                    });}
                    delete data[0].classBI01;
                    delete data[0].classBI02;
                    delete data[0].classA;
                    delete data[0].products;
                    data[0].price = temp;
                    res.json(data[0]);
                }
            });
        }
    });
});

router.post('/product/getproduct', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                log_model.createlog({
                    emp_id:req.user.emp_id,
                    cat:'ProductSearch',
                    subcat:req.body.ProductCode
                });
                product_model.getProductBySapAndZone(req.body, (err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        if (req.user.role == "admin") {
                            if (data[0].Cat == "PORK & OTHER MEAT") {
                                if (data[0].classBI01.length>0) {
                                    let temp = [];
                                    data[0].classBI01.forEach(element => {
                                        let index = -1;
                                        temp.find((item, j) => {
                                            if (element.UM_CODE == item.UM_CODE) {
                                                index = j;
                                                return;
                                            }
                                        });
                                        if (index > -1) {
                                            temp[index].count++;
                                            temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                        } else {
                                            temp.push({
                                                'CLASS_COST': element.CLASS_COST,
                                                'UM_CODE': element.UM_CODE,
                                                'UM_Text': element.UM_Text,
                                                'UM_Thai': element.UM_Thai,
                                                'GROSS_COST': element.GROSS_COST,
                                                'count': 1
                                            })
                                        }
                                    });
                                    temp.forEach(element => {
                                        element.GROSS_COST /= element.count;
                                    })
                                    data[0].classBI02 = [];
                                    data[0].classA = [];
                                    data[0].classBI01 = temp;
                                } else if (data[0].classA.length>0) {
                                    let temp = [];
                                    data[0].classA.forEach(element => {
                                        let index = -1;
                                        temp.find((item, j) => {
                                            if (element.UM_CODE == item.UM_CODE) {
                                                index = j;
                                                return;
                                            }
                                        });
                                        if (index > -1) {
                                            temp[index].count++;
                                            temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                        } else {
                                            temp.push({
                                                'CLASS_COST': element.CLASS_COST,
                                                'UM_CODE': element.UM_CODE,
                                                'UM_Text': element.UM_Text,
                                                'UM_Thai': element.UM_Thai,
                                                'GROSS_COST': element.GROSS_COST,
                                                'count': 1
                                            })
                                        }
                                    });
                                    temp.forEach(element => {
                                        element.GROSS_COST /= element.count;
                                    })
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = temp;
                                } else {
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = [];
                                }
                            } else if (data[0].Cat == "SAUSAGE") {
                                if (data[0].classBI02.length>0) {
                                    let temp = [];
                                    data[0].classBI02.forEach(element => {
                                        let index = -1;
                                        temp.find((item, j) => {
                                            if (element.UM_CODE == item.UM_CODE) {
                                                index = j;
                                                return;
                                            }
                                        });
                                        if (index > -1) {
                                            temp[index].count++;
                                            temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                        } else {
                                            temp.push({
                                                'CLASS_COST': element.CLASS_COST,
                                                'UM_CODE': element.UM_CODE,
                                                'UM_Text': element.UM_Text,
                                                'UM_Thai': element.UM_Thai,
                                                'GROSS_COST': element.GROSS_COST,
                                                'count': 1
                                            })
                                        }
                                    });
                                    temp.forEach(element => {
                                        element.GROSS_COST /= element.count;
                                    })
                                    data[0].classBI01 = [];
                                    data[0].classA = [];
                                    data[0].classBI02 = temp;
                                } else if (data[0].classA.length>0) {
                                    let temp = [];
                                    data[0].classA.forEach(element => {
                                        let index = -1;
                                        temp.find((item, j) => {
                                            if (element.UM_CODE == item.UM_CODE) {
                                                index = j;
                                                return;
                                            }
                                        });
                                        if (index > -1) {
                                            temp[index].count++;
                                            temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                        } else {
                                            temp.push({
                                                'CLASS_COST': element.CLASS_COST,
                                                'UM_CODE': element.UM_CODE,
                                                'UM_Text': element.UM_Text,
                                                'UM_Thai': element.UM_Thai,
                                                'GROSS_COST': element.GROSS_COST,
                                                'count': 1
                                            })
                                        }
                                    });
                                    temp.forEach(element => {
                                        element.GROSS_COST /= element.count;
                                    })
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = temp;
                                } else {
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = [];
                                }
                            } else {
                                if (data[0].classA.length>0) {
                                    let temp = [];
                                    data[0].classA.forEach(element => {
                                        let index = -1;
                                        temp.find((item, j) => {
                                            if (element.UM_CODE == item.UM_CODE) {
                                                index = j;
                                                return;
                                            }
                                        });
                                        if (index > -1) {
                                            temp[index].count++;
                                            temp[index].GROSS_COST = (temp[index].GROSS_COST + element.GROSS_COST)
                                        } else {
                                            temp.push({
                                                'CLASS_COST': element.CLASS_COST,
                                                'UM_CODE': element.UM_CODE,
                                                'UM_Text': element.UM_Text,
                                                'UM_Thai': element.UM_Thai,
                                                'GROSS_COST': element.GROSS_COST,
                                                'count': 1
                                            })
                                        }
                                    });
                                    temp.forEach(element => {
                                        element.GROSS_COST /= element.count;
                                    })
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = temp;
                                } else {
                                    data[0].classBI02 = [];
                                    data[0].classBI01 = [];
                                    data[0].classA = [];
                                }
                            }
                        }else{
                            delete data[0].classBI01;
                            delete data[0].classBI02;
                            delete data[0].classA;
                        }
                        let temp = [];
                        if (data[0].products != null) {
                            data[0].products.forEach(element => {
                                let idk = -1;
                                temp.find((item, j) => {
                                    if (item.class == element.class) {
                                        idk = j;
                                        return;
                                    }
                                });
                                if (idk > -1) {
                                    temp[idk].price.push({
                                        'price': element.price,
                                        'UM_Thai': element.UM_Thai,
                                        'UM_Text': element.UM_Text
                                    })
                                } else {
                                    temp.push({
                                        'class': element.class,
                                        'label': element.label,
                                        'price': [{
                                            'price': element.price,
                                            'UM_Thai': element.UM_Thai,
                                            'UM_Text': element.UM_Text
                                        }]
                                    })
                                }
                            });
                        }
                        data[0].products = temp;
                        res.json(data[0]);
                    }
                });
            }
        }
    });
});

// USER

router.get('/user/avatar', (req,res,next) =>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) =>{
        if (!value) {
            user_model.getImageProfile(req.user.emp_id,(err,data)=>{
                if(data.imageprofile != undefined){
                    let bitmap = fs.readFileSync(__dirname+"/../files/image/"+data.imageprofile+".png");
                    let avatar =  new Buffer(bitmap).toString('base64');
                    res.send(avatar);
                }else{
                    let bitmap = fs.readFileSync(__dirname+"/../files/image/blankprofile.png");
                    let avatar =  new Buffer(bitmap).toString('base64');
                    res.send(avatar);
                }
            })
        } else {
            res.sendStatus(404);
        }
    });
});

router.get('/user/userImage/:imageprofile', (req,res,next) =>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) =>{
        if (!value) {
            fs.readFile(__dirname+"/../files/image/"+req.params.imageprofile+".png", (err,content)=>{
                if (err) {
                  res.sendStatus(404);
              } else {
                  //specify the content type in the response will be an image
                  res.writeHead(200,{'Content-type':'image/png'});
                  res.end(content);
              }
              });
        } else {
            res.sendStatus(404);
        }
    });
});

router.get('/user/allusers', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                });
            } else {
                log_model.createlog({
                    emp_id:req.user.emp_id,
                    cat:'ViewUser',
                    subcat:'ViewUser'
                });
                user_model.getUsers(req.user.emp_id, (err, data) => {
                    if (err || data == null) {
                        res.send('something went wrong.');
                    } else {
                        let jsonresult = [];
                        data.forEach(item => {
                            if (item.Users.emp_id != req.user.emp_id){
                                if (item.Users.role == 'staff' && item.Users.status != "banned" && item.Users.status != "closed"){
                                    jsonresult.push({
                                        emp_id: item.Users.emp_id,
                                        role: item.Users.role,
                                        status: item.Users.status,
                                        nickname: item.Users.nickname,
                                        firstname: item.Users.firstname,
                                        lastname: item.Users.lastname,
                                        phonenumber: item.Users.phonenumber,
                                        imageprofile:item.Users.imageprofile,
                                        email: item.Users.email,
                                        offline: item.Users.offline,
                                        admin_store:item.Users.admin_store,
                                        verifyby:item.Users.verifiedby,
                                    });
                                }
                                else if(item.Users.status != "banned" && item.Users.status != "closed"){
                                    jsonresult.push({
                                        emp_id: item.Users.emp_id,
                                        role: item.Users.role,
                                        status: item.Users.status,
                                        imageprofile:item.Users.imageprofile,
                                        nickname: item.Users.nickname,
                                        firstname: item.Users.firstname,
                                        lastname: item.Users.lastname,
                                        phonenumber: item.Users.phonenumber,
                                        email: item.Users.email,
                                        offline: item.Users.offline,
                                        verifyby:item.Users.verifiedby,
                                        admin_store:item.Users.admin_store
                                    });
                                }
                            }
                        });
                        res.json(jsonresult);
                    }
                });
            }
        }
    });
});

router.post('/user/getUnread',(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.getUnread(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data[0]);
                }
            });
        }
    });
});

router.post('/user/getuser', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                user_model.getUserByEmp(req.body.emp_id, (err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        res.json(data);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});

router.post('/user/myperformance', (req, res, next) => {
    req.body.SalesmanCode = req.user.emp_id;
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "saleman") {
                res.json({
                    status: "note authorized"
                });
            } else{
                log_model.createlog({
                    emp_id:req.user.emp_id,
                    cat:'B2B',
                    subcat:"CheckPerformance"
                }); 
                invoice_model.getInvoiceSalesBtwDate(req.body,(err,data)=>{
                if(err) console.log(err);
                else{
                    let avg,sum,dncn =0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].Dncn.length > 0) {
                            dncn += data[i].Dncn[0].Difference;
                            data[i].LineItemList = data[i].Dncn[0].LineItemList;
                            data[i].NetAmount = data[i].Dncn[0].CorrectProductValue;
                        }
                        data[i].Account.Salesman = data[i].Users.firstname +" "+data[i].Users.lastname;
                    }
                    sum = data.reduce(function (sum, item) {
                        return sum + item.NetAmount;
                    }, 0);
                    const date1 = new Date(req.body.startDate);
                    const date2 = new Date(req.body.endDate);
                    const diffTime = Math.abs(date2.getTime() - date1.getTime());
                    avg = sum/(Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1); 
                    res.json({data:data,sum:sum,avg:avg,dncn:dncn});
                }
                });
            }
        }
    });
});

router.get('/user/me', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.getUserByEmp(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    let jsonresult = [];
                    data.forEach(item => {
                            if (item.role == 'staff'){
                                jsonresult.push({
                                    emp_id: item.emp_id,
                                    store_id: item.store_id,
                                    nickname:item.nickname,
                                    role: item.role,
                                    status: item.status,
                                    firstname: item.firstname,
                                    lastname: item.lastname,
                                    phonenumber: item.phonenumber,
                                    email: item.email,
                                    offline: item.offline,
                                    admin_store:item.admin_store,
                                    store_name: item.Stores[0].name
                                });}
                            else jsonresult.push({
                                emp_id: item.emp_id,
                                store_id: item.store_id,
                                nickname:item.nickname,
                                role: item.role,
                                status: item.status,
                                firstname: item.firstname,
                                lastname: item.lastname,
                                phonenumber: item.phonenumber,
                                email: item.email,
                                admin_store:item.admin_store,
                                offline: item.offline
                            });
                    });
                    res.json(jsonresult[0]);
                }
            });
        }
    });
});

router.put('/user/move', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                user_model.updateUser(req.body.emp_id, {
                    'store_id': req.body.store_id
                }, (err, data) => {
                    if (err || data == null) {
                        res.send('something went wrong.');
                    } else {
                        res.json({
                            body: true
                        });
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});

router.put('/user/changepass', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.changePassword(req.body.emp_id, req.body.password, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.json({
                        body: false
                    });
                } else {
                    res.json({
                        body: true
                    });
                }
            });
        }
    });
});

router.put('/user/verify', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            req.body.verifiedby = req.user.emp_id;
            user_model.updateUser(req.body.old_emp_id, req.body, (err, data) => {
                if (err || data == null) {
                    console.log(err);
                    res.send('something went wrong.');
                } else {
                    res.json({
                        body: true
                    });
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

router.put('/user/updateMyStore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.updateUser(req.user.emp_id, req.body, (err, data) => {
                if (err || data == null) {
                    res.send('something went wrong.');
                } else {
                    res.json({
                        body: true
                    });
                }
            });
        }else{
            res.sendStatus(404)
        }
    });
});

router.put('/user/updateUser', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.updateUser(req.body.old_emp_id, req.body, (err, data) => {
                if (err || data == null) {
                    console.log(err);
                    res.send('something went wrong.');
                } else {
                    res.json({
                        body: true
                    });
                }
            });

        } else {
            res.redirect('/');
        }
    });
});

router.post('/user/remove', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                user_model.removeUser(req.body.emp_id, (err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        tokenList.push(data.token);
                        res.json({
                            body: true
                        });
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});


// admin only ------ STORE controller

router.post('/store/newstore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                store_model.newstore(req.body, (err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        res.json(data);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});

router.put('/store/updatestore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                store_model.updatestore(req.body, (err, data) => {
                    if (err || data == null) {
                        res.send('something went wrong.');
                    } else {
                        res.json(data);
                    }
                });
            }
        }
    });
});

router.post('/store/remove', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                store_model.removestore(req.body.store_id, (err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        res.json(data);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });
});

//
// CLIENT
//

router.post('/client/analyzeClient', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            invoice_model.sumInvoiceByCV(req.body, (err, invoiceData) => {
                if (err) console.log(err);
                else {
                    let productsum = [];
                    for (let i = 0; i < invoiceData.length; i++) {
                        if (invoiceData[i].Dncn.length > 0) {
                            invoiceData[i].NetAmount = invoiceData[i].Dncn[0].CorrectProductValue;
                            invoiceData[i].LineItemList = invoiceData[i].Dncn[0].LineItemList;
                        }
                        for (let j = 0; j < invoiceData[i].LineItemList.length; j++) {
                            let index = -1;
                            invoiceData[i].Products.find((item, k) => {
                                if (item.ProductCode == invoiceData[i].LineItemList[j].ProductCode) {
                                    index = k;
                                    return;
                                }
                            });
                            if (index == -1) {
                                invoiceData[i].LineItemList[j].ProductName = invoiceData[i].ProductCode;
                            } else {
                                invoiceData[i].LineItemList[j].ProductName = invoiceData[i].Products[index].ProductNameTH;

                            }
                            if (productsum.length > 0) {
                                let index = -1;
                                productsum.find((item, k) => {
                                    if (item.ProductCode == invoiceData[i].LineItemList[j].ProductCode) {
                                        index = k;
                                        return;
                                    }
                                });
                                if (index == -1) {
                                    productsum.push({
                                        ProductCode: invoiceData[i].LineItemList[j].ProductCode,
                                        ProductName: invoiceData[i].LineItemList[j].ProductName,
                                        NetSum: invoiceData[i].LineItemList[j].TotalNetPrice,
                                    });
                                } else {
                                    productsum[index].NetSum += invoiceData[i].LineItemList[j].TotalNetPrice;
                                }
                            } else {
                                productsum.push({
                                    ProductCode: invoiceData[0].LineItemList[0].ProductCode,
                                    ProductName: invoiceData[0].LineItemList[0].ProductName,
                                    NetSum: invoiceData[0].LineItemList[0].TotalNetPrice,
                                });
                            }
                        }
                        delete invoiceData[i].Dncn;
                        delete invoiceData[i].LineItemList;
                        delete invoiceData[i].Products;
                    }
                    res.json({
                        productsum: productsum,
                        invoiceData: invoiceData
                    });
                }
            });
        }
    });
});

router.get('/client/myClient', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            client_model.getclientBySaleId(req.user.emp_id,moment(new Date()).format("DD-MM-YYYY"), (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    log_model.createlog({
                        emp_id:req.user.emp_id,
                        cat:'ViewClient',
                        subcat:"MyClient"
                    });
                    res.json(data);
                }
            });
        }
    });
});

router.post('/client/saleClient', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                log_model.createlog({
                    emp_id:req.user.emp_id,
                    cat:'ViewClient',
                    subcat:"SaleClient"
                });
                if(req.body.SaleCode != "All"){
                    client_model.getclientBySaleId(req.body.SaleCode,moment(new Date()).format("DD-MM-YYYY"), (err, data) => {
                        if (err || data == null) {
                            console.error(err);
                            res.send('something went wrong.');
                        } else {
                            res.json(data);
                        }
                    });
                }else if(req.body.SaleCode == 'All'){
                    client_model.getClientbyStore(req.body,(err,data)=>{
                        if(err) res.send(err);
                        else    res.json(data);
                    });
                }
            }
        }
    });
});

router.post('/admin/sumstore', async (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], async (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin") {
                res.json({
                    status: "not authorized."
                })
            } else {
                sum_model.getStoreTotalMonthYear(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else{
                        let result = {
                            amount:0,
                            avg:0,
                            b2c:0,
                            data:[],
                            groupsale:[],
                            today:0,
                            rr:0
                        }
                        for(let i=0;i<data.length;i++){
                            if(data[i].amount != undefined)
                                result.amount += data[i].amount;
                            if(data[i].avg != undefined)
                                result.avg += data[i].avg;
                            if(data[i].b2c != undefined)
                                result.b2c += data[i].b2c;
                            if(data[i].rr != undefined)
                                result.rr += data[i].rr;
                            if(data[i].today != undefined)
                                result.today += data[i].today;
                            if(data[i].data != undefined){
                            for(let j=0;j<data[i].data.length;j++){
                                let idk = -1;
                                    result.data.find((item,k)=>{
                                        if(item.CVLabel == data[i].data[j].CVLabel){
                                            idk = k;
                                        }
                                    });
                                    if(idk > -1 ){
                                        result.data[idk].Chsum += data[i].data[j].Chsum;
                                    }else{
                                        result.data.push(data[i].data[j]);
                                    }
                                }
                            }
                            if(data[i].groupsale != undefined){
                            for(let k=0;k<data[i].groupsale.length;k++){
                                let idk = -1;
                                result.groupsale.find((item,id)=>{
                                    if(item.SalesCode == data[i].groupsale[k].SalesCode){
                                        idk = id;
                                    }
                                });
                                if(idk > -1 ){
                                    result.groupsale[idk].Salesum += data[i].groupsale[k].Salesum;
                                }else{
                                    result.groupsale.push(data[i].groupsale[k]);
                                }
                            }
                            }
                        }
                        res.json(result);
                    }
                })
            }
        }
    });
});

router.post('/admin/getInvoiceByStore', async (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], async (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            } else{
            }
        }
    });
})

router.post('/invoice/sumofB2B', async (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], async (value,decoded) => {
        if (!value) {
            if (req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            } else {
                sum_model.getStoreTotalMonthYear(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else{
                        let result = {
                            amount:0,
                            avg:0,
                            data:[],
                            today:0,
                            rr:0
                        }
                        for(let i=0;i<data.length;i++){
                            if(data[i].amount != undefined)
                                result.amount += data[i].amount;
                            if(data[i].avg != undefined)
                                result.avg += data[i].avg;
                            if(data[i].rr != undefined)
                                result.rr += data[i].rr;
                            if(data[i].today != undefined)
                                result.today += data[i].today;
                            if(data[i].data != undefined){
                            for(let j=0;j<data[i].data.length;j++){
                                let idk = -1;
                                    result.data.find((item,k)=>{
                                        if(item.CVLabel == data[i].data[j].CVLabel){
                                            idk = k;
                                        }
                                    });
                                    if(idk > -1 ){
                                        result.data[idk].Chsum += data[i].data[j].Chsum;
                                    }else{
                                        result.data.push(data[i].data[j]);
                                    }
                                }
                            }
                        }
                        res.json(result);
                    }
                })
            }
        }
    });
});

router.post('/invoice/getInvoiceBySaleCode', async (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], async (value) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "note authorized"
                });
            } else invoice_model.getInvoiceSalesBtwDate(req.body,(err,data)=>{
                if(err) console.log(err)
                else {
                    let avg,sum,dncn =0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].Dncn.length > 0) {
                            dncn += data[i].Dncn[0].Difference;
                            data[i].LineItemList = data[i].Dncn[0].LineItemList;
                            data[i].NetAmount = data[i].Dncn[0].CorrectProductValue;
                        }
                        data[i].Account.Salesman = data[i].Users.firstname +" "+data[i].Users.lastname;
                    }
                    sum = data.reduce(function (sum, item) {
                        return sum + item.NetAmount;
                    }, 0);
                    let image = {};
                    if(data.length > 0){
                        if(data[0].Users.imageprofile != undefined){
                        let bitmap = fs.readFileSync(__dirname+"/../files/image/"+data[0].Users.imageprofile+".png");
                        let avatar =  new Buffer(bitmap).toString('base64');
                        image.avatar = avatar;
                        }
                    }
                    const date1 = new Date(req.body.startDate);
                    const date2 = new Date(req.body.endDate);
                    const diffTime = Math.abs(date2.getTime() - date1.getTime());
                    avg = sum/(Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1); 
                    delete data.Dncn;
                    res.json({data:data,sum:sum,avg:avg,dncn:dncn,avatar:image});
                }
            });
        }
    });
});

router.post('/invoice/getInvoiceByDate', async (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                invoice_model.getInvoiceByDateByStore(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else {
                        log_model.createlog({
                            emp_id:req.user.emp_id,
                            cat:'B2B',
                            subcat:"ViewB2B"
                        });
                        let cvresult =[];
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].Dncn.length > 0) {
                                data[i].NetAmount = data[i].Dncn[0].CorrectProductValue;
                                data[i].Dncn = true;
                            }else{
                                data[i].Dncn = false;
                            }
                            if (cvresult.length > 0) {
                                let index = -1;
                                cvresult.find((item, j) => {
                                    if (item.CVLabel == data[i].Account.CVLabel) {
                                        index = j;
                                        return;
                                    }
                                });
                                if (index == -1) {
                                    cvresult.push({
                                        CVLabel:data[i].Account.CVLabel,
                                        CVType: data[i].Account.CVType,
                                        CVTypeCode: data[i].Account.CVTypeCode,
                                        Chsum: data[i].NetAmount
                                    });
                                } else {
                                    cvresult[index].Chsum += data[i].NetAmount;
                                }
                            } else {
                                cvresult.push({
                                    CVLabel:data[0].Account.CVLabel,
                                    CVType: data[0].Account.CVType,
                                    CVTypeCode: data[0].Account.CVTypeCode,
                                    Chsum: data[0].NetAmount
                                });
                            }
                        }
                        res.json({
                            data: data,
                            amount: data.reduce((sum, b) => sum + b.NetAmount, 0),
                            cvresult: cvresult
                        });
                    }
                });
            }
        }
    });
});


//STORE

router.get('/store/allstores', (req, res, next) => {
    //We'll just send back the user details and the token
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            store_model.getstores((err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

router.get('/store/getstore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            store_model.getstoreById(req.body.store_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

router.post('/store/staffHistory', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            atten_model.getAttendanceByDateAndEmpId(req.body.date, req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        }
    });
});


router.get('/store/checkStaff', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            let start = new Date();
            start.setHours(0,0,0,0);
            let end = new Date()
            end.setHours(23,59,59,999);
            atten_model.getAttendanceByDateAndEmpId(start,end,req.user.emp_id,(err,data)=>{
                if(err) console.log(err)
                else res.json(data);
            });
        } else {
            res.redirect('/');
        }
    });
});

router.get('/store/leaveStore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.getStoreByEmp(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    let store_id = data[0].Stores[0].store_id;
                    atten(res, store_id, req.user.emp_id, "leave");
                }
            });
        }
    });
});

router.get('/store/resting', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.getStoreByEmp(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    let store_id = data[0].Stores[0].store_id;
                    atten(res, store_id, req.user.emp_id, "resting");
                }
            });
        }
    });
});

router.post('/store/getMyStore', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            user_model.getStoreByEmp(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    let dist = getDistance({
                        latitude: req.body.latitude,
                        longitude: req.body.longitude
                    }, {
                        latitude: data[0].Stores[0].location.lat,
                        longitude: data[0].Stores[0].location.lon
                    },1);
                    if (dist <= 500) {
                        atten(res, data[0].Stores[0].store_id, req.user.emp_id, req.body.status);
                    } 
                    else if(dist > 500){
                        res.json({
                            body: false
                        }) 
                    }
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

// OTHER

router.post('/vacation/newvacation', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            let jsonbody = req.body;
            jsonbody.emp_id = req.user.emp_id;
            let selectDate = [];
            for (let m = moment(req.body.startDate); m.diff(req.body.endDate, 'days') <= 0; m.add(1, 'days')) {
                selectDate.push(m.format('YYYY-MM-DD'));
            }
            jsonbody.date = selectDate;
            vacation_model.newVacation(jsonbody, async (err, data) => {
                let result = "";
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    await user_model.getUserByEmp(req.user.emp_id, async (err, data) => {
                        if (err) console.error(err);
                        else {
                            result += data.firstname + " " + data.lastname + " \nขอลาหยุดแบบ\t" + jsonbody.vactype +
                                "\nตั้งแต่วันที่ \t" + req.body.startDate + "\t ถึงวันที่ \t" + req.body.endDate +
                                "\nเนื่องจาก \t" + jsonbody.detail
                            getAdminNoti(data[0].Stores[0].store_id,result);
                            res.json({
                                body: true
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

router.post('/vacation/checkvacation', async (req, res, next) => {
    let result = [];
    let m = moment(req.body.startDate);
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], async (value) => {
        if (!value) {
            do {
                await checkvacation(m, req.user.emp_id, (err, data) => {
                    if (data.length > 0) {
                        if (result.length > 0) {
                            for (let i = 0; i < data[0].date.length; i++) {
                                let temp = result.find(result => {
                                    return result.date == moment.tz(data[0].date[i], "Asia/Bangkok").format("YYYY-MM-DD");
                                });
                                if (temp == undefined) {
                                    result.push({
                                        status: data[0].status,
                                        date: moment.tz(data[0].date[i], "Asia/Bangkok").format("YYYY-MM-DD")
                                    });
                                }
                            }
                        } else {
                            for (let i = 0; i < data[0].date.length; i++) {
                                result.push({
                                    status: data[0].status,
                                    date: moment.tz(data[0].date[i], "Asia/Bangkok").format("YYYY-MM-DD")
                                });
                            }
                        }
                    }
                }).then(await wait(5).then(m.add(1, 'days')));
            } while (m.diff(req.body.endDate, 'days') <= 0);
            res.json(result);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/vacation/vacationhistory', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            vacation_model.getVacationByEmpId(req.user.emp_id, (err, data) => {
                if (err)
                    console.log(err);
                else
                    res.json(data);
            });
        } else {
            res.redirect('/');
        }
    });
});

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

let checkvacation = async (m, emp_id, callback) => {
    await vacation_model.getVacationByDateAndEmpId(m.format('YYYY-MM-DD'), emp_id, callback);
}

router.get('/atten/getAllAtten', (req, res, next) => {
    atten_model.getAttendance((err, data) => {
        res.json(data);
    });
});

let atten = async (res, store_id, emp_id, status) => {
    const data = {
        emp_id:emp_id,
        status:status,
        store_id:store_id
    }
    await atten_model.newAttendance(data, async (err) => {
        let result = "";
        if (err){
            console.log(err);
        }
        else {
            await user_model.getStoreByEmp(emp_id, async (err, data) => {
                if (err) console.error(err);
                else {
                    result += data[0].firstname + " \t" + data[0].lastname + " \t("+data[0].nickname+")"
                    if (status == 'checkin') {
                        result += " เช็คอิน \n" + data[0].Stores[0].name
                        let text = result + "\n เวลา: \t" + moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD/HH:mm");                            
                        getAdminNoti(data[0].Stores[0].store_id,text);
                        
                    }else if (status == 'resting') {
                        result += " พัก \n" + data[0].Stores[0].name
                        let text = result + "\n เวลา: \t" + moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD/HH:mm");
                        getAdminNoti(data[0].Stores[0].store_id,text);
                    }else if (status == 'resume') {
                        result += " กลับเข้างาน \n" + data[0].Stores[0].name
                        let text = result + "\n เวลา: \t" + moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD/HH:mm");
                        getAdminNoti(data[0].Stores[0].store_id,text);
                    }
                    else if (status == 'leave') {
                        result += " เช็คเอาท์ \n" + data[0].Stores[0].name
                        let text = result + "\n เวลา: \t" + moment.tz(new Date(), "Asia/Bangkok").format("YYYY-MM-DD/HH:mm");
                        getAdminNoti(data[0].Stores[0].store_id,text);
                    }
                    res.json({body: true});
                };
            });
        }
    });
}

router.get('/checktoken', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            user_model.checkExist(req.user.emp_id, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    if (data.status == 'closed' || data.status == 'banned' || data.role != decoded.user.role)
                        res.json({
                            body: false
                        });
                    else if (data.status == 'waiting') {
                        res.json({
                            body: true,
                            status: 'waiting'
                        });
                    } else {
                        res.json({
                            body: true,
                            emp_id:req.user.emp_id,
                            role: data.role,
                            store:data.admin_store
                        });
                    }
                    let promise = Promise.all([
                        user_model.updateUser(req.user.emp_id, {
                            'status': 'active'
                        }, (err) => {
                            if (err) console.log(err);
                        })
                    ]);
                }
            });
        } else {
            res.json({
                status: "not authorized."
            });
        }
    });
});

// all user can LOGOUT

router.get('/waiterlogout', (req, res, next) => {
    //We'll just send back the user details and the token
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            tokenList.push(tokenarray[1]);
            res.send('successful');
        } else {
            res.send('successful');
        }
    });
});

router.get('/logout', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            tokenList.push(tokenarray[1]);
            user_model.updateUser(req.user.emp_id, {
                'token': '',
                'status': 'offline',
                'pushnoti': '',
                'offline': Date.now()
            }, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.send('successful');
                }
            });
        } else {
            res.send('successful');
        }
    });
});

router.post('/user/imageProfile', (req, res) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            let encoded = Buffer.from(req.user.emp_id).toString('base64');
            fs.writeFileSync(__dirname+"/../files/image/"+encoded+".png",req.body.img,'base64');
            user_model.updateUser(req.user.emp_id,{imageprofile:encoded},(err,data)=>{
                if(err) res.send(err);
                else res.sendStatus(200);
            })
        }
    });
});

router.post('/user/userAvatar', (req, res) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            user_model.getImageProfile(req.body.emp_id,(err,data)=>{
                if(data.imageprofile != undefined){
                    let bitmap = fs.readFileSync(__dirname+"/../files/image/"+data.imageprofile+".png");
                    let avatar =  new Buffer(bitmap).toString('base64');
                    res.send(avatar);
                }else{
                    res.sendStatus(404);
                }
            });
        }
    });
});

router.post('/product/checkallproduct', async (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                product_model.getAllProducts((err,data)=>{
                    if(err) console.log(err);
                    else {
                        if(req.body.productlength == data.length){
                            res.json({status:true});
                        }else{
                            res.json(data);
                        }
                    }
                });
            }
        }
    });
});

router.post('/users/getattendee', (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                let start = new Date(req.body.date);
                start.setHours(0,0,0,0);
                let end = new Date(req.body.date)
                end.setHours(23,59,59,999);
                user_model.getAttendee(req.body.store_id,start,end, (err, data) => {
                    if(err) res.send(err)
                    else{
                        res.json(data);
                    }
                });
            }
        }
    });
});

router.post('/client/clientdetail', (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                client_model.getclientByCv(req.body.CVNumber,(err, data) => {
                    if (err || data == null) {
                        console.error(err);
                        res.send('something went wrong.');
                    } else {
                        res.json(jsonresult);
                    }
                });
            }
        }
    });
});

router.post('/sale/getMysale', (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                user_model.getMySale(req.body, (err,data) => {
                    if(err) console.log(err);
                    else res.json(data);
                });
            }
        }
    });
});

router.post('/invoice/getInvoice', (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                invoice_model.getInvoiceDetail(req.body.InvoiceNumber,(err,data)=>{
                    if(err) console.log(err);
                    else {
                        if(data.length>0){
                        for(let i=0;i<data[0].LineItemList.length;i++){
                            let index = -1;
                            data[0].Products.find((item, j) => {
                                if (item.ProductCode == data[0].LineItemList[i].ProductCode) {
                                    index = j;
                                    return;
                                }
                            });
                            if(index > -1){
                                data[0].LineItemList[i].ProductName = data[0].Products[index].ProductNameTH
                            }else{
                                data[0].LineItemList[i].ProductName = data[0].LineItemList[i].ProductCode
                            }
                        }
                        if(data[0].SaleName == null){
                            data[0].SaleName = data[0].SaleCode;
                            data[0].SaleLast = "";
                        }
                        delete data[0].Products;}
                        res.json(data);
                    }
                });
            }
        }
    });
});

router.post('/invoice/getInvoiceByCV', (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                })
            }
            else{
                user_model.getInvoiceBtwDateAndCVType(req.user.emp_id,req.body,(err,data)=>{
                    if(err) console.log(err)
                    else{
                        res.json(data);
                    }
                });
            }
        }
    });
});

router.post('/quatation/MyQuotationClient', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
        if (!value) {
            client_model.getclientQuotation(req.body.SalesCode, (err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        }
    });
});

router.post('/quatation/getQuotationByID', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quotation_model.getQuotationByID(req.body.QUOTATION_ID, (err,data)=>{
                    if(err) res.send(err);
                    else{
                        res.json(data);
                    }
                });
            }
        }
    });
});

router.post('/quatation/getQuotationByCV', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quotation_model.getQuotationByCV(req.body.CVNumber, (err,data)=>{
                    if(err) res.send(err);
                    else{
                        let jsonResult = [];
                        data.forEach(item =>{
                            jsonResult.push({
                                QUOTATION_ID:item.QUOTATION_ID,
                                EFFECTIVE_DATE:item.ProductData.lstQuotation[0].EFFECTIVE_DATE,
                                TOTAL_PROFIT:item.ProductData.lstQuotation[0].TOTAL_PROFIT,
                            })
                        });
                        res.json(jsonResult);
                    }
                });
            }
        }
    });
});

router.post('/quatation/createPDF', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quatation.generatePDF(req.body, (data)=>{
                    res.json({status:true})
                });
            }
        }
    });
});

router.post('/quatation/getFactoryCV', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quatation.getFactData(req.body.cvnumber, (data)=>{
                    if(data != null){
                        let jsonResult = [];
                        if(data.length>0){
                            data.forEach(item =>{
                                if(item.OPERATION_CODE != "OPRCD0422")
                                jsonResult.push({
                                    COMPANY:item.COMPANY,
                                    OPERATION_CODE:item.OPERATION_CODE,
                                    SUB_OPERATION:item.SUB_OPERATION,
                                    OPERATION_NAME:item.OPERATION_NAME
                                })
                            });
                            res.json(jsonResult);
                        }else{
                            res.json(jsonResult);
                        }
                    }else{
                        res.json([]);
                    }
                });
            }
        }
    });
});

router.post('/quatation/findDuplicate', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quatation.findDuplicate(req.body, (data)=>{
                    if(data != null){
                        if(data.length>0){
                            res.json({status:true});
                        }else{
                            res.json({status:false});
                        }
                    }else{
                        res.json({status:true});
                    }
                })
            }
        }
    });
});

router.post('/quatation/findQuatation', (req ,res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quatation.FindQuatation(req.body, (data)=>{
                    if(data != null){
                        let jsonResult = [];
                        if(data.length>0){
                            data.forEach(item =>{
                                jsonResult.push({
                                    QUOTATION_ID:item.QUOTATION_ID,
                                    CV_CODE:item.CV_CODE,
                                    EFFECTIVE_DATE:item.EFFECTIVE_DATE,
                                    EXPIRY_DATE:item.EXPIRY_DATE,
                                    PRODUCT_CODE:item.PRODUCT_CODE,
                                    CONTRACT_PRICE:item.CONTRACT_PRICE,
                                    CONTRACT_PROFIT:item.CONTRACT_PROFIT,
                                    QTY_CONTRACT:item.QTY_CONTRACT,
                                    UM_CONTRACT:item.UM_CONTRACT,
                                    STATUS:item.STATUS
                                })
                            });
                            res.json(jsonResult);
                        }else{
                            res.json(jsonResult);
                        }
                    }else{
                        res.json([]);
                    }
                });
            }
        }
    });
});

router.post('/quatation/submitQuatation', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            } else {
                log_model.createlog(
                    {
                        emp_id:req.user.emp_id,
                        cat:'ContractPrice',
                        subcat:'createContractPrice'
                    }
                );
                quatation.GetQuotationID((quotationID) => {
                    if (quotationID != null) {
                        quatation.GetCTCtrlRunning(req.body, (data) => {
                            if (data != null) {
                                let jsonResult = req.body;
                                jsonResult.emp_id = req.user.emp_id;
                                jsonResult.QUOTATION_ID = quotationID;
                                jsonResult.ProductData.lstQuotation.forEach(item => {
                                    item.QUOTATION_ID = quotationID;
                                    item.QUOTATION_DATE = new Date().toISOString()
                                });
                                jsonResult.ProductData.lstContractPrice.forEach(item => {
                                    item.REMARK = "WEB_QUOTATION_" + quotationID;
                                    item.DOC_NUMBER = data.NewDocNumber
                                });
                                quatation.QuotationSubmitAndCreate(jsonResult.Salescode, jsonResult.ProductData, (quostatus) => {
                                    if (quostatus == "Save"){
                                        quotation_model.newQuotation(jsonResult, (err, data) => {});
                                        quatation.generatePDF(jsonResult, (result) => {
                                            res.json({
                                                status: quotationID
                                            });
                                        });}
                                    else {
                                        res.json({
                                            status: false
                                        });
                                    }
                                });
                            } else {
                                res.json({
                                    status: false
                                });
                            }
                        });
                    } else {
                        res.json({
                            status: false
                        });
                    }
                });
            }
        }
    });
});

router.post('/quatation/QuotationSubmitAndCreate', (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value,decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "saleman") {
                res.json({
                    status: "not authorized."
                });
            }else{
                quatation.QuotationSubmitAndCreate(req.body.Salescode,req.body,(data)=>{
                    res.json(data);
                });
            }
        }
    });
});

router.post('/fron/dateCatTran', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
        if (!value) {
            if (req.user.role != "admin" && req.user.role != "staff") {
                res.json({
                    status: "not authorized."
                })
            } else {
                let start = new Date(req.body.startDate);
                start.setHours(7, 0, 0, 0);
                req.body.startDate = start;
                let end = new Date(req.body.endDate)
                end.setHours(29, 59, 59, 999);
                req.body.endDate = end;
                transaction_model.getTransactionByCatDate(req.body, (err, data) => {
                    if (err) res.send(err)
                    else {
                        let dateResult = [];
                        let pdResult = [];
                        for (let i = 0; i < data.length; i++) {
                            let dateIndex = -1;
                            dateResult.find((item, k) => {
                                if (item.Date == data[i].Date) {
                                    dateIndex = k;
                                    return;
                                }
                            });
                            if (dateIndex > -1) {
                                dateResult[dateIndex].sum += data[i].sumAmount;
                            } else {
                                dateResult.push({
                                    Date: data[i].Date,
                                    sum: data[i].sumAmount
                                })
                            }
                            let catIndex = -1;
                            pdResult.find((item, k) => {
                                if (item.PRODUCT_CODE == data[i].PRODUCT_CODE) {
                                    catIndex = k;
                                    return;
                                }
                            });
                            if (catIndex > -1) {
                                pdResult[catIndex].sum += data[i].sumAmount;
                            } else {
                                pdResult.push({
                                    PRODUCT_CODE: data[i].PRODUCT_CODE,
                                    Product_Name: data[i].Product_Name[0],
                                    sum: data[i].sumAmount,
                                })
                            }
                        }
                        dateResult = dateResult.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                        pdResult = pdResult.sort((a, b) => b.sum - a.sum);
                        res.json({
                            dateResult: dateResult,
                            pdResult: pdResult
                        });
                    }
                })
            }
        }
    });
});

router.post('/fron/fronByWeek',(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "staff") {
            res.json({
                status: "not authorized."
            })
        } else {
            let start = new Date(req.body.startDate);
            start.setHours(7, 0, 0, 0);
            req.body.startDate = start;
            let end = new Date(req.body.endDate)
            end.setHours(29, 59, 59, 999);
            req.body.endDate = end;
            transaction_model.getTransactionsBtwDate(req.body, (err, data) => {
                if (err) res.send(err)
                else {
                    let dateResult = [];
                    let catResult = [];
                    for (let i = 0; i < data.length; i++) {
                        let dateIndex = -1;
                        dateResult.find((item, k) => {
                            if (item.Date == data[i].Date) {
                                dateIndex = k;
                                return;
                            }
                        });
                        if (dateIndex > -1) {
                            dateResult[dateIndex].sum += data[i].sumAmount;
                        } else {
                            dateResult.push({
                                Date: data[i].Date,
                                sum: data[i].sumAmount
                            })
                        }
                        let catIndex = -1;
                        catResult.find((item, k) => {
                            if (item.Cat == data[i].Cat) {
                                catIndex = k;
                                return;
                            }
                        });
                        if (catIndex > -1) {
                            catResult[catIndex].sum += data[i].sumAmount;
                        } else {
                            catResult.push({
                                Cat: data[i].Cat,
                                sum: data[i].sumAmount,
                            })
                        }
                    }
                    dateResult = dateResult.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                    catResult = catResult.sort((a, b) => b.sum - a.sum);
                    res.json({
                        dateResult: dateResult,
                        catResult: catResult
                    });
                }
            })
        }
    }
    });
});

router.post('/front/frontByMonth',(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "staff") {
            res.json({
                status: "not authorized."
            })
        } else {
            transaction_model.getTransactionsByMonth(req.body, (err, data) => {
                if (err) res.send(err)
                else {
                    let dateResult = [];
                    let catResult = [];
                    for (let i = 0; i < data.length; i++) {
                        let dateIndex = -1;
                        dateResult.find((item, k) => {
                            if (item.Date == data[i].Date) {
                                dateIndex = k;
                                return;
                            }
                        });
                        if (dateIndex > -1) {
                            dateResult[dateIndex].sum += data[i].sumAmount;
                        } else {
                            dateResult.push({
                                Date: data[i].Date,
                                sum: data[i].sumAmount
                            })
                        }
                        let catIndex = -1;
                        catResult.find((item, k) => {
                            if (item.Cat == data[i].Cat) {
                                catIndex = k;
                                return;
                            }
                        });
                        if (catIndex > -1) {
                            catResult[catIndex].sum += data[i].sumAmount;
                        } else {
                            catResult.push({
                                Cat: data[i].Cat,
                                sum: data[i].sumAmount,
                            })
                        }
                    }
                    dateResult = dateResult.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                    catResult = catResult.sort((a, b) => b.sum - a.sum);
                    res.json({
                        dateResult: dateResult,
                        catResult: catResult
                    });
                }
            })
        }
    }
    });
});



router.post('/front/frontByDate',(req,res,next) =>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "staff") {
            res.json({
                status: "not authorized."
            })
        } else {
            log_model.createlog(
                {
                    emp_id:req.user.emp_id,
                    cat:'B2C',
                    subcat:'B2C_Day'
                }
            );
            let start = new Date(req.body.startDate);
            start.setHours(7, 0, 0, 0);
            req.body.startDate = start;
            let end = new Date(req.body.endDate)
            end.setHours(29, 59, 59, 999);
            req.body.endDate = end;
            transaction_model.getTransactionsByDate(req.body, (err, data) => {
                if (err) res.send(err)
                else {
                    let dateResult = [];
                    let catResult = [];
                    for (let i = 0; i < data.length; i++) {
                        let dateIndex = -1;
                        dateResult.find((item, k) => {
                            if (item.Date == data[i].Date) {
                                dateIndex = k;
                                return;
                            }
                        });
                        if (dateIndex > -1) {
                            dateResult[dateIndex].sum += data[i].sumAmount;
                        } else {
                            dateResult.push({
                                Date: data[i].Date,
                                sum: data[i].sumAmount
                            })
                        }
                        let catIndex = -1;
                        catResult.find((item, k) => {
                            if (item.Cat == data[i].Cat) {
                                catIndex = k;
                                return;
                            }
                        });
                        if (catIndex > -1) {
                            catResult[catIndex].sum += data[i].sumAmount;
                        } else {
                            catResult.push({
                                Cat: data[i].Cat,
                                sum: data[i].sumAmount,
                            })
                        }
                    }
                    dateResult = dateResult.sort((a, b) => a.Date - b.Date);
                    catResult = catResult.sort((a, b) => b.sum - a.sum);
                    res.json({
                        dateResult: dateResult,
                        catResult: catResult
                    });
                }
            })
        }
    }
    });
});

router.post('/feedback/newFeed',async (req, res, next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        let body ={
            emp_id:"feedbackroom",
            data:req.body
        }
        body.data[0].user.avatar = "/user/userImage/blankprofile"
        user_model.getUserByEmp(req.user.emp_id,(err,userdata)=>{
            if(err) console.log(err);
            else{
                if(userdata[0].imageprofile != undefined) body.data[0].user.avatar = "/user/userImage/"+userdata[0].imageprofile;
                body.data[0].user._id = req.user.emp_id;
                body.data[0].user.name = userdata[0].nickname;
                feedback_model.newFeedback(body,(err,data)=>{
                    if(err) console.log(err);
                    else{
                        let text = userdata[0].nickname+"\n"+req.body[0].text;
                        getSendNoti(text);
                        res.sendStatus(200);
                    }
                });
            }
        });
     }
    });
});

router.post('/clientLead/Nearest' , (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            log_model.createlog({
                emp_id:req.user.emp_id,
                cat:'POI',
                subcat:'getPOI'
            });
            req.body.Latitude = parseFloat(req.body.Latitude);
            req.body.Longitude = parseFloat(req.body.Longitude);
            lead_model.getNearest(req.body,(err,data)=>{
                if(err) console.log(err);
                else    res.json(data);
            })
        }
    }
    });
});

router.post('/clientLead/EditPlace' ,(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            req.body.Refer = req.user.emp_id;
            if(req.body.CVNumber != undefined){
                let body = {
                    "CVNumber":req.body.CVNumber,
                    "Latitude":req.body.Latitude,
                    "Longitude":req.body.Longitude
                }
                client_model.newClient(body,(err,data)=>{});
            }
            lead_model.newLead(req.body,(err,data)=>{
                if(err) console.log(err)
                else    res.sendStatus(200);
            })
        }
     }
    });
});

router.post('/clientLead/NewPlaceCP' ,(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            if(req.body.CVNumber != undefined){
                let body = {
                    "CVNumber":req.body.CVNumber,
                    "Latitude":req.body.Latitude,
                    "Longitude":req.body.Longitude
                }
                client_model.newClient(body,(err,data)=>{});
            }
            req.body.Latitude = parseFloat(req.body.Latitude);
            req.body.Longitude = parseFloat(req.body.Longitude);
            req.body.Loc = { type: "Point", coordinates: [ req.body.Longitude, req.body.Latitude ] }
            req.body.Refer = req.body.SalesCode;
            req.body.Status = "Active";
            lead_model.newCPClient(req.body,(err,data)=>{
                if(err) console.log(err)
                else    res.sendStatus(200);
            })
        }
     }
    });
});

router.post('/clientLead/NewPlace' ,(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            req.body.Latitude = parseFloat(req.body.Latitude);
            req.body.Longitude = parseFloat(req.body.Longitude);
            req.body.Loc = { type: "Point", coordinates: [ req.body.Longitude, req.body.Latitude ] }
            req.body.Refer = req.user.emp_id;
            req.body.Status = "Active";
            user_model.getUserByEmp(req.user.emp_id,(err,userdata)=>{
            if(err) console.log(err);
            else{ 
                if(req.body.Description != undefined){
                req.body.Description.forEach(item =>{
                    item.user.avatar = "/user/userImage/blankprofile";
                    if(userdata[0].imageprofile != undefined) item.user.avatar = "/user/userImage/"+userdata[0].imageprofile;
                    item.user._id = req.user.emp_id;
                    item.user.name = userdata[0].nickname;
                })}
                lead_model.newLead(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else    console.log(data);
                })
             }
            });
        }
     }
    });
});

router.post('/clientLead/updateDescripLead',(req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            let body ={
                _id:req.body._id,
                Description:req.body.messages
            }
            body.Description[0].user.avatar = "/user/userImage/blankprofile"
            user_model.getUserByEmp(req.user.emp_id,(err,userdata)=>{
                if(err) console.log(err);
                else{
                    if(userdata[0].imageprofile != undefined) body.Description[0].user.avatar = "/user/userImage/"+userdata[0].imageprofile;
                    body.Description[0].user._id = req.user.emp_id;
                    body.Description[0].user.name = userdata[0].nickname;
                    lead_model.newLead(body,(err,data)=>{
                        if(err) console.log(err)
                        else    res.sendStatus(200);
                    })
                }
            });
        }
     }
    });
})

router.post('/feedback/getFeed', async (req,res,next) =>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        feedback_model.getFeedback("feedbackroom",(err,data)=>{
            if(err) console.log(err);
            else    res.json(data);
        });
    }
    });
});

router.post('/cvname/cvname', (req, res, next) => {
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            client_model.getCVnoLead(req.body.store_id,(err, data) => {
                if (err || data == null) {
                    console.error(err);
                    res.send('something went wrong.');
                } else {
                    res.json(data);
                }
            });
        }
    }
    });
});

router.post('/lead/getLeadDes', async (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded)=>{
        if(!value){
            if(req.user.role != "admin" && req.user.role != "saleman"){
                res.json({
                    status: "not authorized."
                })
            }else{
                lead_model.getObjectLead(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else res.json(data);
                })
            }
        }
    })
});

router.post('/lead/getNearby', async (req,res,next)=>{
    let tokenarray = req.headers.authorization.split(" ");
    verify_token(tokenarray[1], (value, decoded) => {
    if (!value) {
        if (req.user.role != "admin" && req.user.role != "saleman") {
            res.json({
                status: "not authorized."
            })
        } else {
            req.body.Latitude = parseFloat(req.body.Latitude);
            req.body.Longitude = parseFloat(req.body.Longitude);
                lead_model.Othernearby(req.body,(err,data)=>{
                    if(err) console.log(err)
                    else{
                        if(data.length>0){
                            let returnjson = [];
                            data.forEach(item =>{
                                if(item.Supplier == "CP"){
                                    returnjson.push({
                                        Name:item.Name,
                                        _id:item._id,
                                        Latitude:item.Loc.coordinates[1],
                                        Longitude:item.Loc.coordinates[0],
                                        Type:item.Type,
                                        Supplier:item.Supplier,
                                        CVNumber:item.CVNumber
                                    });
                                }
                                else
                                    returnjson.push({
                                        Name:item.Name,
                                        _id:item._id,
                                        Latitude:item.Loc.coordinates[1],
                                        Longitude:item.Loc.coordinates[0],
                                        Type:item.Type,
                                        Supplier:item.Supplier,
                                    });
                            });
                            res.json(returnjson);
                        }else{
                            res.json([]);
                        }
                    }
                });
        }
    }
    });
});

let getAdminNoti = (store_id,message) => {
    user_model.getAdminNoti(store_id,(err, data) => {
        if (err) console.log(err);
        else {
            let pushToken = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].pushnoti != '')
                    pushToken.push(data[i].pushnoti);
            }
            pushnoti(pushToken, message, null);
        }
    });
}

let getSendNoti = (message) => {
    user_model.getNoti((err, data) => {
        if (err) console.log(err);
        else {
            let pushToken = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].pushnoti != '')
                    pushToken.push(data[i].pushnoti);
            }
            pushnoti(pushToken, message, null);
        }
    });
}

let pushnoti = (notitoken, message, data) => {
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
            data: {
                payload: data
            },
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
                    }
                }
            } catch (error) {
            }
        }
    })();
}

module.exports = router;