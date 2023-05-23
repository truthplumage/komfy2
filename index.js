
//ssh -i /Users/seunghunlee/Downloads/komfybar.pem ubuntu@3.112.57.55 
//접속 방법
const fs = require('fs');
const cors = require('cors');

const url = '210.114.1.95';

const bodyParser = require('body-parser');
const orderHolding = [];
const multer = require('multer');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

const static = require('serve-static');
const path = require('path');
const nodemailer = require('nodemailer');

var http = require('http');
var https = require('https');
const DBManager = require('./dbManager/dbConnector');
const { log } = require('console');
let dbmanager = new DBManager();
const upload = multer({
  // 파일 저장 위치 (disk , memory 선택)
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, './komfybar/images');
    },
    filename: function (req, file, done) {
        
        done(null, path.basename(file.originalname));
      }
    }),
    // 파일 허용 사이즈 (5 MB)
    limits: { fileSize: 30 * 1024 * 1024 }
});

http.createServer(app
  // function(req, res){
  //   res.statusCode = 302;
  //   res.setHeader('Location', `https://${url}/index.html`);
  //   res.end();
  // }
  ).listen(80);

  var options = {
      ca: fs.readFileSync('./secret/CA2A.crt.pem'),
      key: fs.readFileSync('./secret/CA2A.key.pem'),
      cert: fs.readFileSync('./secret/CA2A.unified.crt.pem')
    };

  https.createServer(options, app).listen(443, function () {
    console.log('익스프레스로 HTTPS 웹 서버 실행: ' + 443);
  });



app.get('/', (req, res) => {
    // res.json({
    //     success: true,
    // });
    res.redirect(`https://${url}/index.html`)
});




app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/', static(path.join(__dirname, 'komfybar')));
app.get('/orderDel', (req, res)=> {
  orderHolding=[]
  res.send('ok')
})

app.post('/mailSend', ()=>{
  let transporter =
  nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS : true,
        auth: {
            user: "@gmail.com",   // gmail 계정 아이디를 입력
            pass: ""  // gmail 계정의 비밀번호를 입력
        }
    });
  let mailOptions = {
      from: "@gmail.com", // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: email, // 수신 메일 주소
      subject: '메뉴확인', // 제목
      text: '' // 내용
  };
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          log.info(error);
      } else {
          log.info('Email sent: ' + info.response);
          var user = {};
          user.email = email;
          user.number=number;
          auth_code.push(user);
          res.send({
              result: 1,
              auth: number
          });
      }
  });
})

app.post('/order', (req, res)=>{
  var date = new Date()

  console.log(`req.body.data : ${req.body.table}`)
  order ={'table':req.body.table,
          'menu':req.body.menu,
          'status':'checking',
          'date':date.toISOString()
        };
  orderHolding.push(order)
  res.send(req.body.table)


})

app.get('/orderLoad/:orderDate', (req, res)=>{
  var lastDate =new Date(req.params.orderDate)
  var resultArr = []
  orderHolding.forEach((item, i) => {
    var orderDate = new Date(item.date)
    if (orderDate > lastDate) {
      resultArr.push(item)
    }
  });

  res.send(resultArr)
})

app.get('/orderCheck/:orderNo',(req,res)=>{
  var date = new Date()
  orderHolding.forEach((item, i) => {
    if (item.date == req.params.orderNo) {
      item.status = 'checked'
      item.orderTime = date.toISOString()
      return
    }
  });
  console.log(JSON.stringify(orderHolding));
  res.send(orderHolding)
})
app.get('/getSubCate/',(req, res)=>{
  dbmanager.selectQuery(`select * from subCate join cate on subCate.cateIdx = cate.idx`, res)
})
app.post('/insertMenu/',async (req,res)=>{
  let insertMenu = req.body.menu;
  let menu = await dbmanager.getQuery('select * from menu where id=?',[insertMenu.id])
  if(menu){
    console.log(menu)
    res.status(400).send('already menu id');
    return
  }
  let max = await dbmanager.getQuery('select max(idx)+1 idx from menu where subIdx=(select idx from subCate where subTitle =?)',[insertMenu.subCate])
  console.log(max.idx)
  console.log(insertMenu);
  dbmanager.updateQuery('INSERT INTO menu (id, name, title, price, `desc`, onClick, manager, subIdx, idx) VALUES(?, ?, ?, ?, ?, ?, ?,(select idx subIdx from subCate where subTitle =?), ?);',
  [insertMenu.id, insertMenu.name, insertMenu.title, insertMenu.price, insertMenu.desc, insertMenu.onClick, insertMenu.manager, insertMenu.subCate, max[0].idx], res)
})

app.delete('/deleteMenu/:menuId/:cate', async (req,res)=>{
  let result = await dbmanager.getQuery('select img from menu where id=?', [req.params.menuId])
  fs.unlink(path.normalize("./komfybar"+result.img), function(err){
    if(err) {
      console.log("Error : ", err)
    }
  }) 
  dbmanager.updateQuery(`DELETE FROM menu WHERE id=?;`, [req.params.menuId], res)
})

app.get('/getMenus',(req,res)=>{
  dbmanager.selectQuery(`select menu.manager, menu.onClick, menu.img, menu.desc, menu.price, menu.title, menu.name, menu.id, 
  cate.cateTitle, sc.subTitle, sc.idx from menu join subCate sc on sc.idx = menu.subIdx join cate on sc.cateIdx = cate.idx order by sc.idx, menu.idx asc;
  `, res)
})

app.put('/changeMenu',async (req,res)=>{
  let body = req.body;
  console.log(body);
  await dbmanager.getQuery('update menu set idx=null where subIdx=(select idx subIdx from subCate where idx =?)',[body.subcate])
  body.menusId.forEach(async (id, i) => {
    await dbmanager.getQuery('update menu set idx=? where id=?',[(i+1),id])
  });
  res.send(body.menusId)
})

app.put('/updateMenu/:menuId/:cate',(req,res)=>{
  let menu = req.body.menu
  dbmanager.updateQuery(`update menu m SET m.name=?, m.title=?, m.price=?, m.desc=?, m.onClick=?, m.manager=? WHERE m.id=?;`, [menu.name, menu.title, menu.price, menu.desc, menu.onClick, menu.manager, menu.id], res)
})

app.post('/photo/:menuId/:cate', upload.single('file'), function (req, res, next) {
  console.log(JSON.stringify(req.params));
  dbmanager.updateQuery(`update menu SET img=? WHERE id=?;`, ['/images/'+req.file.filename, req.params.menuId], res)
});
