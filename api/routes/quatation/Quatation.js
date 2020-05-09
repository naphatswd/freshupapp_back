'use strict'

/*--------------------------------------------

	@Author 	Naphat Sawasdeemeechok
	@created	2019-04-03:20:52
	@modeified 	2020-01-13:00.32
	@des		route for create quotation

----------------------------------------------*/
const { parse, stringify } = require('../../../node_modules/flatted/cjs');
const PdfPrinter = require('../../../node_modules/pdfmake/src/printer');
const moment = require('../../../node_modules/moment');
const axios = require('../../../node_modules/axios');
const fs = require('fs');

module.exports.getFactData = async (CVNumber, callback)=>{
    const body = {
    dHeader: {
          ConName: ""
      },
        ClassWithNs: "",
        paramStr: "{\"cvCode\":\""+CVNumber+"\"}",
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
          callback(jsonresult);
    });
}

module.exports.findDuplicate = async (data, callback)=>{
    const body = {
    dHeader: {
          ConName: ""
      },
        ClassWithNs: "",
        paramStr: "{\"company\":\""+data.company+"\",\"operationCode\":\""+data.operationCode+"\""
                    +",\"subOperation\":\""+data.subOperation+"\","
                    +"\"docType\":\"DCTYPCT\",\"sIssue\":\"DISSU000\","
                    +"\"cvCode\":\""+data.CVNumber+"\","
                    +"\"effectiveDate\":\""+data.issueDate+"\","
                    +"\"lstProduct\":\""+data.lstproduct+"\"}",
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
          callback(jsonresult);
    });
}

module.exports.GetQuotationID = async (callback)=>{
    const body = {
        dHeader: {
              ConName: ""
          },
            ClassWithNs: "",
            paramStr: "",
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
              callback(jsonresult);
        });
}

module.exports.GetCTCtrlRunning = async (data, callback)=>{
    const body = {
        dHeader: {
              ConName: ""
          },
            ClassWithNs: "",
            paramStr: "{\"Username\":\""+data.Salescode+"\",\"sCompany\":\""+data.company+"\""
                        +",\"sOper\":\""+data.operationCode+"\",\"sSub\":\""+data.subOperation+"\""
                        +",\"sDoctype\":\"DCTYPCT\",\"sIssue\":\"DISSU000\""
                        +",\"sDate\":\""+new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1).toISOString()+"\"}",
            methodName: ""
      };
     await axios({
            method: 'post',
            url: 'CPF_URL',
            data: body
          }).catch(error => {
            console.log("(error) GetCTCtrlRunning: "+error);
              callback(error);
          }).then(response => {
            console.log(response.data);
              let serialized = stringify(response.data);
              let unserialized  = parse(serialized);
              let JSONObj = JSON.parse(unserialized.d);
              let jsonresult = JSONObj.Result;
              let jsonstring = JSON.stringify(jsonresult).replace("\\","");
              jsonresult = JSON.parse(jsonstring);
              callback(jsonresult);
        });
}

module.exports.QuotationSubmitAndCreate = async (Salescode,data, callback) =>{
    let temp = JSON.stringify(data);
    temp = temp.replace(/{/g,"{");
    temp = temp.replace(/":/g,"\""+":");
    temp = temp.replace(/,"/g,",\"");
    temp = temp.replace(/:"/g,":"+"\"");
    temp = temp.replace(/",/g,"\",");
    temp = temp.replace(/"}/g,"\""+"}");
    const body = {
      dHeader: {
          UserId:Salescode,
          ConName: ""
        },
          ClassWithNs: "",
          paramStr: temp,
          methodName: ""
    };
   await axios({
          method: 'post',
          url: 'CPF_URL',
          data: body
        }).catch(error => {
          console.log(error)
            callback(error);
        }).then(response => {
            let serialized = stringify(response.data);
            let unserialized  = parse(serialized);
            let JSONObj = JSON.parse(unserialized.d);
            let jsonresult = JSONObj.Result;
            let jsonstring = JSON.stringify(jsonresult).replace("\\","");
            jsonresult = JSON.parse(jsonstring);
            callback(jsonresult);
      });
}

module.exports.FindQuatation = async (data, callback) =>{
  const body = {
    dHeader: {
          ConName: ""
      },
        ClassWithNs: "",
        paramStr: "{\"status\":\"\","
                    +"\"owner\":\""+data.Salescode+"\","
                    +"\"cvCode\":\""+data.cvCode+"\","
                    +"\"effDate\":\""+data.effDate+"\"}",
        methodName: ""
  };
 await axios({
        method: 'post',
        url: 'CPF_URL',
        data: body
      }).catch(error => {
          callback(error);
      }).then(response => {
          let serialized = stringify(response.data);
          let unserialized  = parse(serialized);
          let JSONObj = JSON.parse(unserialized.d);
          let jsonresult = JSONObj.Result;
          let jsonstring = JSON.stringify(jsonresult).replace("\\","");
          jsonresult = JSON.parse(jsonstring);
          callback(jsonresult);
    });
}
 
module.exports.generatePDF = async (data, callback)=>{
  const fontDescriptors = {
		THSarabunNew: {
      normal: __dirname + '/../../files/fonts/THSarabunNew.ttf',
      bold: __dirname + '/../../files/fonts/THSarabunNew.ttf',
      italics: __dirname + '/../../files/fonts/THSarabunNew.ttf',
      bolditalics: __dirname + '/../../files/fonts/THSarabunNew.ttf'
		}
  };
  let productData = [];
  let summary = 0;
  data.ProductData.lstQuotation.forEach(item =>{
    productData.push({
      รายละเอียดสินค้า:item.PRODUCT_NAME,
      ราคาที่ตกลง:item.CONTRACT_PRICE,
      ปริมาณ:item.QTY_CONTRACT,
      ราคารวม:item.CONTRACT_PRICE*item.QTY_CONTRACT
    });
    summary+=item.CONTRACT_PRICE*item.QTY_CONTRACT;
  });
  productData.push({
    รายละเอียดสินค้า:"รวม",
    ราคาที่ตกลง:"",
    ปริมาณ:"",
    ราคารวม:summary
  });
  getDetailOwner(data.Salescode, (saledata) => {
    if (saledata.length > 0) {
        getDetailCustomer(data.CVNumber, (cvdata) => {
            let bitmap = fs.readFileSync(__dirname + "/../../files/image/cpft.png");
            let cpft = "data:image/png;base64," + new Buffer(bitmap).toString('base64');
            let printer = new PdfPrinter(fontDescriptors);
            let pdfData = {
                header: [{
                    image: cpft,
                    fit: [80, 80],
                    margin: [10, 30]
                }],
                content: [{
                        text: "บริษัท ซีพีเอฟ เทรดดิ้งจำกัด",
                        margin: [55, 0],
                        fontSize: 9
                    }, {
                        text: "252/115-116 อาคารสำนักงานเมืองไทย-ภัทร อาคาร 2 ชั้น 28 ถนนรัชดาภิเษก แขวงห้วยขวาง",
                        margin: [55, 0],
                        fontSize: 9
                    }, {
                        text: "เขตห้วยขวาง กรุงเทพมหานคร 10310",
                        margin: [55, 0, 0, 4],
                        fontSize: 9
                    }, {
                        text: "CPF TRADING CO.,LTD",
                        margin: [55, 0],
                        fontSize: 9
                    }, {
                        text: "252/115-116 Muang Thai-Phatra Complex Tower II, 28th Floor, Ratchadaphisak Rd, Huaykwang, Bangkok, 10310",
                        margin: [55, 0],
                        fontSize: 9
                    }, {
                        text: "Home Page : www.cpfreshmartfoodservice.com",
                        margin: [55, 0],
                        fontSize: 9
                    },
                    {
                        canvas: [{
                            type: 'line',
                            x1: -30,
                            y1: 10,
                            x2: 540,
                            y2: 10,
                            lineWidth: 1
                        }]
                    },
                    {
                        text: "ใบเสนอราคา (Quotation)",
                        margin: [190, 10],
                        fontSize: 15
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'วันที่'
                            },
                            {
                                width: 'auto',
                                text: ': ' + moment(new Date(data.ProductData.lstQuotation[0].EFFECTIVE_DATE)).format("DD MMMM YYYY")
                            }
                        ],
                        columnGap: 120,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'วันที่มีผล'
                            },
                            {
                                width: 'auto',
                                text: ': ' + moment(new Date(data.ProductData.lstQuotation[0].EFFECTIVE_DATE)).format("DD MMMM YYYY") + ' / ' + moment(new Date(data.ProductData.lstQuotation[0].EXPIRY_DATE)).format("DD MMMM YYYY")
                            }
                        ],
                        columnGap: 108,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'เรียน'
                            },
                            {
                                width: 'auto',
                                text: ': ' + data.AccountNameTH
                            }
                        ],
                        columnGap: 119,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'รหัสลูกค้า'
                            },
                            {
                                width: 'auto',
                                text: ': ' + data.CVNumber
                            }
                        ],
                        columnGap: 106,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'ที่อยู่'
                            },
                            {
                                width: 'auto',
                                text: ': ' + cvdata.ADDRESS1 + " " + cvdata.ADDRESS2
                            }
                        ],
                        columnGap: 120,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    table(productData, ['รายละเอียดสินค้า', 'ราคาที่ตกลง', 'ปริมาณ', 'ราคารวม']),
                    {
                        text: "เงื่อนไขเสนอสินค้าข้างต้น",
                        margin: [-30, 10],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '1) สถานที่ส่งสินค้า'
                            },
                            {
                                width: 'auto',
                                text: ': ราคาขายข้างต้นรวมค่าจัดส่งถึงหน้าคลังสินค้าลูกค้า'
                            }
                        ],
                        columnGap: 105,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '2) ภาษีมูลค่าเพิ่ม'
                            },
                            {
                                width: 'auto',
                                text: ': ราคาสินค้าดังกล่าวมีภาษีมูลค่าเพิ่ม'
                            }
                        ],
                        columnGap: 109,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        text: "3) แบบถุงบรรจุภัณฑ์",
                        //x,y
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '4) การตรวจสอบน้ำหนักสุทธิ'
                            },
                            {
                                width: 'auto',
                                text: ': สินค้า IQF ละลายในน้ำอุณหภูมิ 23-29 องศาเซลเซียส (100% NW. 10-12 วินาที) ทุกรายการสะเด็ดน้ำ 2 นาที'
                            }
                        ],
                        columnGap: 79,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '5) การชำระเงิน'
                            },
                            {
                                width: 'auto',
                                text: ': ตามรอบกำหนดชำระของลูกค้า'
                            }
                        ],
                        columnGap: 113,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '6) การส่งมอบสินค้า'
                            },
                            {
                                width: 'auto',
                                text: ': สามารถส่งสินค้าได้ภายใน 2 วัน หลังจากที่ตกลงสั่งซื้อ'
                            }
                        ],
                        columnGap: 102,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: '7) การแจ้งรับสินค้า'
                            },
                            {
                                width: 'auto',
                                text: ': แจ้งล่วงหน้าก่อนรับสินค้า 2 วัน หลังจากที่ได้รับการตกลงซื้อขายกัน'
                            }
                        ],
                        columnGap: 103,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        columns: [{
                                width: 'auto',
                                text: 'หมายเหตุ'
                            },
                            {
                                width: 'auto',
                                text: ': การนำเสนอราคาข้างต้นสำหรับการซื้อขายภายในประเทศเท่านั้น หากต้องใช้เอกสารใดๆ ให้แจ้งก่อนทำการยืนยันการสั่งซื้อ'
                            }
                        ],
                        columnGap: 129,
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        text: "**กรณีซื้อสินค้าเพื่อส่งออกทางผู้ซื้อต้องแจ้งข้อมูลให้ทราบก่อนเสนอราคาเพื่อจัดเตรียมเอกสารส่งออกได้ถูกต้อง",
                        margin: [-30, 0],
                        fontSize: 10
                    },
                    {
                        text: "รับทราบเงื่อนไขและยืนยันการสั่งซื้อ",
                        fontSize: 9,
                        margin: [0, 10, 60, 0],
                        alignment: 'right'
                    },
                    {
                        canvas: [{
                            type: 'line',
                            x1: 200,
                            y1: 50,
                            x2: 400,
                            y2: 50,
                            lineWidth: 1
                        }],
                        alignment: 'right'
                    },
                    {
                        text: "ฝ่ายจัดซื้อ",
                        fontSize: 9,
                        margin: [0, 10, 90, 0],
                        alignment: 'right'
                    },
                    {
                        text: "ผู้เสนอสินค้า",
                        margin: [-30, 0],
                        fontSize: 9
                    },
                    {
                        text: saledata[0].USER_NAME,
                        margin: [-30, 0],
                        fontSize: 9
                    },
                    {
                        text: saledata[0].E_MAIL,
                        margin: [-30, 0],
                        fontSize: 9
                    },
                    {
                        text: saledata[0].PHONE,
                        margin: [-30, 0],
                        fontSize: 9
                    }
                ],
                defaultStyle: {
                    font: 'THSarabunNew'
                }
            };
            let doc = printer.createPdfKitDocument(pdfData);
            doc.pipe(fs.createWriteStream(__dirname + '/../../files/quotation/ExportFile_ใบเสนอราคาเลขที่_' + data.QUOTATION_ID + '.pdf'));
            doc.end();
            callback(true);
        });
    }else{
      getDetailCustomer(data.CVNumber, (cvdata) => {
        let bitmap = fs.readFileSync(__dirname + "/../../files/image/cpft.png");
        let cpft = "data:image/png;base64," + new Buffer(bitmap).toString('base64');
        let printer = new PdfPrinter(fontDescriptors);
        let pdfData = {
            header: [{
                image: cpft,
                fit: [80, 80],
                margin: [10, 30]
            }],
            content: [{
                    text: "บริษัท ซีพีเอฟ เทรดดิ้งจำกัด",
                    margin: [55, 0],
                    fontSize: 9
                }, {
                    text: "252/115-116 อาคารสำนักงานเมืองไทย-ภัทร อาคาร 2 ชั้น 28 ถนนรัชดาภิเษก แขวงห้วยขวาง",
                    margin: [55, 0],
                    fontSize: 9
                }, {
                    text: "เขตห้วยขวาง กรุงเทพมหานคร 10310",
                    margin: [55, 0, 0, 4],
                    fontSize: 9
                }, {
                    text: "CPF TRADING CO.,LTD",
                    margin: [55, 0],
                    fontSize: 9
                }, {
                    text: "252/115-116 Muang Thai-Phatra Complex Tower II, 28th Floor, Ratchadaphisak Rd, Huaykwang, Bangkok, 10310",
                    margin: [55, 0],
                    fontSize: 9
                }, {
                    text: "Home Page : www.cpfreshmartfoodservice.com",
                    margin: [55, 0],
                    fontSize: 9
                },
                {
                    canvas: [{
                        type: 'line',
                        x1: -30,
                        y1: 10,
                        x2: 540,
                        y2: 10,
                        lineWidth: 1
                    }]
                },
                {
                    text: "ใบเสนอราคา (Quotation)",
                    margin: [190, 10],
                    fontSize: 15
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'วันที่'
                        },
                        {
                            width: 'auto',
                            text: ': ' + moment(new Date(data.ProductData.lstQuotation[0].EFFECTIVE_DATE)).format("DD MMMM YYYY")
                        }
                    ],
                    columnGap: 120,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'วันที่มีผล'
                        },
                        {
                            width: 'auto',
                            text: ': ' + moment(new Date(data.ProductData.lstQuotation[0].EFFECTIVE_DATE)).format("DD MMMM YYYY") + ' / ' + moment(new Date(data.ProductData.lstQuotation[0].EXPIRY_DATE)).format("DD MMMM YYYY")
                        }
                    ],
                    columnGap: 108,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'เรียน'
                        },
                        {
                            width: 'auto',
                            text: ': ' + data.AccountNameTH
                        }
                    ],
                    columnGap: 119,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'รหัสลูกค้า'
                        },
                        {
                            width: 'auto',
                            text: ': ' + data.CVNumber
                        }
                    ],
                    columnGap: 106,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'ที่อยู่'
                        },
                        {
                            width: 'auto',
                            text: ': ' + cvdata.ADDRESS1 + " " + cvdata.ADDRESS2
                        }
                    ],
                    columnGap: 120,
                    margin: [-30, 0],
                    fontSize: 10
                },
                table(productData, ['รายละเอียดสินค้า', 'ราคาที่ตกลง', 'ปริมาณ', 'ราคารวม']),
                {
                    text: "เงื่อนไขเสนอสินค้าข้างต้น",
                    margin: [-30, 10],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '1) สถานที่ส่งสินค้า'
                        },
                        {
                            width: 'auto',
                            text: ': ราคาขายข้างต้นรวมค่าจัดส่งถึงหน้าคลังสินค้าลูกค้า'
                        }
                    ],
                    columnGap: 105,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '2) ภาษีมูลค่าเพิ่ม'
                        },
                        {
                            width: 'auto',
                            text: ': ราคาสินค้าดังกล่าวมีภาษีมูลค่าเพิ่ม'
                        }
                    ],
                    columnGap: 109,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    text: "3) แบบถุงบรรจุภัณฑ์",
                    //x,y
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '4) การตรวจสอบน้ำหนักสุทธิ'
                        },
                        {
                            width: 'auto',
                            text: ': สินค้า IQF ละลายในน้ำอุณหภูมิ 23-29 องศาเซลเซียส (100% NW. 10-12 วินาที) ทุกรายการสะเด็ดน้ำ 2 นาที'
                        }
                    ],
                    columnGap: 79,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '5) การชำระเงิน'
                        },
                        {
                            width: 'auto',
                            text: ': ตามรอบกำหนดชำระของลูกค้า'
                        }
                    ],
                    columnGap: 113,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '6) การส่งมอบสินค้า'
                        },
                        {
                            width: 'auto',
                            text: ': สามารถส่งสินค้าได้ภายใน 2 วัน หลังจากที่ตกลงสั่งซื้อ'
                        }
                    ],
                    columnGap: 102,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: '7) การแจ้งรับสินค้า'
                        },
                        {
                            width: 'auto',
                            text: ': แจ้งล่วงหน้าก่อนรับสินค้า 2 วัน หลังจากที่ได้รับการตกลงซื้อขายกัน'
                        }
                    ],
                    columnGap: 103,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    columns: [{
                            width: 'auto',
                            text: 'หมายเหตุ'
                        },
                        {
                            width: 'auto',
                            text: ': การนำเสนอราคาข้างต้นสำหรับการซื้อขายภายในประเทศเท่านั้น หากต้องใช้เอกสารใดๆ ให้แจ้งก่อนทำการยืนยันการสั่งซื้อ'
                        }
                    ],
                    columnGap: 129,
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    text: "**กรณีซื้อสินค้าเพื่อส่งออกทางผู้ซื้อต้องแจ้งข้อมูลให้ทราบก่อนเสนอราคาเพื่อจัดเตรียมเอกสารส่งออกได้ถูกต้อง",
                    margin: [-30, 0],
                    fontSize: 10
                },
                {
                    text: "รับทราบเงื่อนไขและยืนยันการสั่งซื้อ",
                    fontSize: 9,
                    margin: [0, 10, 60, 0],
                    alignment: 'right'
                },
                {
                    canvas: [{
                        type: 'line',
                        x1: 200,
                        y1: 50,
                        x2: 400,
                        y2: 50,
                        lineWidth: 1
                    }],
                    alignment: 'right'
                },
                {
                    text: "ฝ่ายจัดซื้อ",
                    fontSize: 9,
                    margin: [0, 10, 90, 0],
                    alignment: 'right'
                },
                {
                    text: "ผู้เสนอสินค้า",
                    margin: [-30, 0],
                    fontSize: 9
                },
                {
                    text: "บริษัท ซีพีเอฟ เทรดดิ้งจำกัด",
                    margin: [-30, 0],
                    fontSize: 9
                },
                {
                    text: "",
                    margin: [-30, 0],
                    fontSize: 9
                },
                {
                    text: "",
                    margin: [-30, 0],
                    fontSize: 9
                }
            ],
            defaultStyle: {
                font: 'THSarabunNew'
            }
        };
        let doc = printer.createPdfKitDocument(pdfData);
        doc.pipe(fs.createWriteStream(__dirname + '/../../files/quotation/ExportFile_ใบเสนอราคาเลขที่_' + data.QUOTATION_ID + '.pdf'));
        doc.end();
        callback(true);
      });
    }
  });
}

async function getDetailOwner (Salescode, callback){
  const body = {
    dHeader: {
          ConName: "CPF_URL"
      },
        ClassWithNs: "",
        paramStr: "{\"sOwner\":\""+Salescode+"\"}",
        methodName: ""
  };
 await axios({
        method: 'post',
        url: 'CPF_URL',
        data: body
      }).catch(error => {
          callback(error);
      }).then(response => {
          let serialized = stringify(response.data);
          let unserialized  = parse(serialized);
          let JSONObj = JSON.parse(unserialized.d);
          let jsonresult = JSONObj.Result;
          let jsonstring = JSON.stringify(jsonresult).replace("\\","");
          jsonresult = JSON.parse(jsonstring);
          callback(jsonresult);
    });
}

async function getDetailCustomer (CVNumber, callback){
  const body = {
    dHeader: {
          ConName: ""
      },
        ClassWithNs: "",
        paramStr: "{\"cvCode\":\""+CVNumber+"\"}",
        methodName: ""
  };
 await axios({
        method: 'post',
        url: 'CPF_URL',
        data: body
      }).catch(error => {
          callback(error);
      }).then(response => {
          let serialized = stringify(response.data);
          let unserialized  = parse(serialized);
          let JSONObj = JSON.parse(unserialized.d);
          let jsonresult = JSONObj.Result;
          let jsonstring = JSON.stringify(jsonresult).replace("\\","");
          jsonresult = JSON.parse(jsonstring);
          callback(jsonresult);
    });
}

function buildTableBody(data, columns) {
  var body = [];

  body.push(columns);

  data.forEach(function(row) {
      var dataRow = [];

      columns.forEach(function(column) {
          dataRow.push(row[column].toString());
      })

      body.push(dataRow);
  });
  return body;
}

function table(data, columns) {
  return {
    layout: 'lightHorizontalLines',
    table: {
            headerRows: 1,
            widths: [ 100, '*', '*', '*' ],
            body: buildTableBody(data, columns),
        },
    margin: [ 55, 35],
    fontSize: 9
  };
}