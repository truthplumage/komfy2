
//ssh -i /Users/seunghunlee/Downloads/komfybar.pem ubuntu@3.112.57.55 
//접속 방법
const fs = require('fs');
const cors = require('cors');

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
  //   res.setHeader('Location', 'https://210.114.1.95/index.html');
  //   res.end();
  // }
  ).listen(80);

  var options = {
      // pfx: fs.readFileSync('./secret/Convert/CA2A.pfx'),
      // passphrase: 'p7opx54b'

      ca: fs.readFileSync('./secret/CA2A.crt.pem'),
      key: fs.readFileSync('./secret/CA2A.key.pem'),
      cert: fs.readFileSync('./secret/CA2A.unified.crt.pem')
      // pfx: fs.readFileSync('./crt/savvyissafe_com.pfx')

    };

  https.createServer(options, app).listen(443, function () {
    console.log('익스프레스로 HTTPS 웹 서버 실행: ' + 443);
  });



app.get('/', (req, res) => {
    // res.json({
    //     success: true,
    // });
    res.redirect('https://210.114.1.95/index.html')
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

app.post('/insertMenu/',(req,res)=>{
  var menuFile = fs.readFileSync('./komfybar/menu.json')
  var menus = JSON.parse(menuFile.toString())
  var isDuplicate = false;
  menus.forEach((cate, i) => {
    if(req.body.menu.category == undefined) return
    Object.keys(cate).forEach(key => {
      if(key == req.body.menu.category) {
        delete req.body.menu.category
        cate[key].forEach((subCate) => {
          if(subCate.title == req.body.menu.subCate) {
            subCate.data.forEach((item, j) => {
              if(item.id !== undefined && item.id == req.body.menu.id){
                delete req.body.menu.subCate
                subCate.data[j] = req.body.menu
                isDuplicate = true
              }  
            })
            if(isDuplicate==false) {
              delete req.body.menu.subCate
              subCate.data.push(req.body.menu)
            }
          }
        });
        return
      }
    });
  });
  
  fs.writeFileSync('./komfybar/menu.json', JSON.stringify(menus))
  res.send(menus)
})

app.delete('/deleteMenu/:menuId/:cate', (req,res)=>{
  var menuFile = fs.readFileSync('./komfybar/menu.json')
  console.log(menuFile.toString());
  var menus = JSON.parse(menuFile.toString())
  console.log(JSON.stringify(menus));
  var isFind = false;
  menus.forEach((cate, i) => {
    Object.keys(cate).forEach ((key) => {
      if(key == req.params.cate){
        cate[key].forEach((subCate) =>{
          subCate.data.forEach((item, j)=>{
            if(item.id !== undefined && item.id == req.params.menuId){
              subCate.data.splice(j, 1)
              isFind = true
              return
            }
          })
          if(isFind) return
        })
        if(isFind) return
      }
    })
    if(isFind) return
  });
  fs.writeFileSync('./komfybar/menu.json', JSON.stringify(menus))
  res.send(menus)
})

app.get('/getMenus',(req,res)=>{
  let dbmanager = new DBManager();
  dbmanager.selectQuery(`select menu.manager, menu.onClick, menu.img, menu.desc, menu.price, menu.title, menu.name, menu.id, 
  cate.cateTitle, sc.subTitle, sc.idx from menu join subCate sc on sc.idx = menu.subIdx join cate on sc.cateIdx = cate.idx order by sc.idx, menu.idx asc;
  `, res)
})

app.put('/changeMenu',(req,res)=>{
  let body = req.body;
  var menuFile = fs.readFileSync('./komfybar/menu.json')
  var menus = JSON.parse(menuFile.toString())
  var data, cate;
  menus.forEach(menuCate=>{
    if(menuCate[body.cate]){
      cate = menuCate[body.cate]
      data = cate[body.subcate].data
      return;
    }
  })
  var sortMenu = [];
  body.menusId.forEach(id=>{
    data.forEach(dt=>{
      if(dt.id == id)
      sortMenu.push(dt);
    })
  })
  cate[body.subcate].data = sortMenu;
  fs.writeFileSync('./komfybar/menu.json', JSON.stringify(menus))
  res.send(menus)
})

app.put('/updateMenu/:menuId/:cate',(req,res)=>{
  var menuFile = fs.readFileSync('./komfybar/menu.json')
  var menus = JSON.parse(menuFile.toString())
  var isFind = false
  menus.forEach((cate, i) => {
    Object.keys(cate).forEach((key) =>{
      if(key == req.params.cate){
        cate[key].forEach((subCate) => {
          if(subCate.title==req.body.menu.subcate)
          subCate.data.forEach((item, j)=>{
            if(item.id !== undefined && item.id == req.params.menuId){
              subCate.data[j].title = req.body.menu.title
              subCate.data[j].name = req.body.menu.name
              subCate.data[j].price = req.body.menu.price
              subCate.data[j].desc = req.body.menu.desc
              subCate.data[j].onClick = req.body.menu.onClick
              subCate.data[j].manager = req.body.menu.manager

              isFind = true
              return
            }
          })
          if(isFind) return
        });
        if(isFind) return
      }
    })
    if(isFind) return
  });
  fs.writeFileSync('./komfybar/menu.json', JSON.stringify(menus))
  res.send(menus)
})

app.post('/photo/:menuId/:cate', upload.single('file'), function (req, res, next) {
  console.log('photo');
  var menuFile = fs.readFileSync('./komfybar/menu.json')
  var menus = JSON.parse(menuFile.toString())
  console.log(JSON.stringify(req.params));
  var isFind = false;
  menus.forEach((cate, i) => {
    Object.keys(cate).forEach((key)=>{
      if(key == req.params.cate)
      cate[key].forEach((subCate) => {
        subCate.data.forEach((item, j)=>{
          if(item.id !== undefined && item.id == req.params.menuId){
            console.log(JSON.stringify(item))
            subCate.data[j].img = '/images/'+req.file.filename            
            isFind = true;
            return; 
          }
        })
        if(isFind) return
      })
      if(isFind) return
    })
    if(isFind) return
  })
  fs.writeFileSync('./komfybar/menu.json', JSON.stringify(menus))
  //업로드 정보 확인
  console.log(req.file);
  res.send('upload success.');
});
