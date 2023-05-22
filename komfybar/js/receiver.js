const allMenus = [

  // {'food1':'감자튀김'},
  // {'food2':'순대튀김'},
  // {'food3':'멜론'},
  // {'food4':'로메인샐러드'},
  // {'food5':'새우 비스큐 파스타'},
  // {'food6':'치즈 플레이트'},
  // {'food7':'새우 비스큐 파스타'},
  // {'food8':'바스크치즈케잌'},
  // {'food9':'부라타토마토'},
  // {'request1':'냅킨'},
  // {'request2':'물'},

  // {'glass1':'후안길 옐로 glass'},
  // {'glass2':'러시안잭 glass'},
  // {'glass3':'콥케토니 glass'},
  // {'glass4':'콥케화이트 glass'},
  // {'glass5':'아지뭇 레드 glass'},
  // {'glass6':'아지뭇 화이트 glass'},

  // {'beer1':'피터패트'},
  // {'beer2':'사무엘아담스'},
  // {'beer3':'이네딧담'},
  // {'beer4':'세르도스 맥주'},
  // {'beer5':'라벨라로라 맥주'},
  // {'beer6':'산타리타 맥주'},

  // {'cocktail1':'컴피하이볼'},
  // {'cocktail2':'싱글몰트 하이볼'},
  // {'cocktail3':'진저애플'},
  // {'cocktail4':'진토닉'},
  // {'cocktail5':'카카오피즈'},
  // {'cocktail6':'애플마티니'},
  // {'cocktail7':'리치마티니'},
  // {'cocktail8':'뉴욕'},
  // {'cocktail9':'아마레또 사우어'},
  // {'cocktail10':'올드패션드'},
  // {'cocktail11':'갓파더'},

  // {'whisky1':'제임슨 Glass'},
  // {'whisky2':'페이머스 그라우스 Glass'},
  // {'whisky3':'듀어스 Glass'},
  // {'whisky4':'메이커스마크 Glass'},
  // {'whisky5':'와일드터키 Glass'},
  // {'whisky6':'잭다니엘 Glass'},
  // {'whisky7':'탈리스커10 Glass'},
  // {'whisky8':'맥켈란12 Glass'},
  // {'whisky9':'싱글톤12 Glass'},
  // {'whisky10':'싱글톤15 Glass'},
  // {'whisky11':'보모어12 Glass'},
  // {'whisky12':'글렌리벳12 Glass'},
  // {'whisky13':'글렌피딕12 Glass'},
  // {'whisky14':'글렌피딕15 Glass'},
  // {'whisky15':'라프로익10 Glass'},
  // {'whisky16':'아란10 Glass'},
  // {'whisky17':'아드벡10 Glass'},
  // {'whisky18':'글렌모란지10 Glass'},
  // {'whisky19':'글렌모란지 라산타 Glass'},
  // {'whisky20':'글렌모란지 퀸타루반 Glass'},
  // {'whisky21':'발베니12 Glass'},
  // {'whisky22':'발베니14 Glass'},

  // {'whiskyBottle1':'제임슨 bottle'},
  // {'whiskyBottle2':'페이머스 그라우스 bottle'},
  // {'whiskyBottle3':'듀어스 bottle'},
  // {'whiskyBottle4':'메이커스마크 bottle'},
  // {'whiskyBottle5':'와일드터키 bottle'},
  // {'whiskyBottle6':'잭다니엘 bottle'},
  // {'whiskyBottle7':'탈리스커10 bottle'},
  // {'whiskyBottle8':'맥켈란12 bottle'},
  // {'whiskyBottle9':'싱글톤12 bottle'},
  // {'whiskyBottle10':'싱글톤15 bottle'},
  // {'whiskyBottle11':'보모어12 bottle'},
  // {'whiskyBottle12':'글렌리벳12 bottle'},
  // {'whiskyBottle13':'글렌피딕12 bottle'},
  // {'whiskyBottle14':'글렌피딕15 bottle'},
  // {'whiskyBottle15':'라프로익10 bottle'},
  // {'whiskyBottle16':'아란10 bottle'},
  // {'whiskyBottle17':'아드벡10 bottle'},
  // {'whiskyBottle18':'글렌모란지10 bottle'},
  // {'whiskyBottle19':'글렌모란지 라산타 bottle'},
  // {'whiskyBottle20':'글렌모란지 퀸타루반 bottle'},
  // {'whiskyBottle21':'발베니12 bottle'},
  // {'whiskyBottle22':'발베니14 bottle'},
  
  // {'whiskyOption1':'니트'},
  // {'whiskyOption2':'온더락'},
  // {'whiskyOption3':'1/3 Bottle'},
  // {'whiskyOption4':'1 Bottle'},
  

  // {'cognac1':'레미마틴'},
  // {'cognac2':'헤네시'},

  // {'red1':'Juangil Bottle'},
  // {'red2':'Troublemaker Bottle'},
  // {'red3':'Azimut Negre Bottle'},
  // {'red4':'Sasyr Toscana Bottle'},
  // {'red5':'El picaro Bottle'},
  // {'red6':'Take it to the grave Bottle'},
  // {'red7':'Pierre Bottle'},
  // {'red8':'Paso robles Merlot Bottle'},
  // {'red9':'Chateau Copsa Rouge Bottle'},
  // {'red10':'Single Parcel Insitu Bottle'},
  // {'red11':'Coulee Douce 2020 Bottle'},
  // {'red12':'Badboys de Bordeaux Bottle'},
  // {'red13':'Take it Cabernat Sauvignon'},
  // {'red14':'Elephant'},

  // {'white1':'Russian jack Bottle'},
  // {'white2':'Catherine Marshall Bottle'},
  // {'white3':'La cour des dames Chardonnay Bottle'},
  // {'white4':'La cour des dames Vigonier Bottle'},
  // {'white5':'Azimut blanc Bottle'},
  // {'white6':'Gessami Bottle'},
  // {'white7':'Limestone Hill Bottle'},
  // {'white8':'Life from stone Bottle'},
  // {'white9':'Side one'},
  

  // {'sparkling1':'Louis Perdrier Bottle'},
  // {'sparkling2':'Gota de Maravilla Bottle'},
  // {'sparkling3':'Sprin toso spumante Bottle'},

  // {'port1':'Kopke Tawny Bottle'},
  // {'port2':'Kopke White Bottle'},


]

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
var res
fetch("https://www.komfy.kr/getMenus", requestOptions)
    .then(response => response.text())
    .then(result => {
      res = JSON.parse(result)
      res.forEach(cate=>{
        Object.keys(cate).forEach(key=>{
          if(cate[key]!=undefined){
            cate[key].forEach(subCate => { 
              subCate.data.forEach((data)=>{
                let menuName = {}
                menuName[data.id] = data.name;
                allMenus.push(menuName)
              })
            })
          }
        })
      })
      initOrder()
    })
    .catch(error => console.log('error', error));


$('#modal').hide()
function orderDelPopUpShow() {
  $('#modal').show()
}
function orderDel() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json; charset=utf-8");
  console.log('orderDel')
  var requestOptions = {
    method: 'GET',
    headers: myHeaders

  };
  var orders;
  fetch("https://www.komfy.kr/orderDel", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      location.href='https://www.komfy.kr/receiver.html'
    })
    .catch(error => console.log('error', error));
}

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json; charset=utf-8");

var requestOptions = {
  method: 'GET',
  headers: myHeaders

};
var orders;
function initOrder(){
  fetch("https://www.komfy.kr/orderLoad/1999-01-01", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      orders = JSON.parse(result)
      $('#chatBox').html(makeOrderHtml(orders))
      $('html, body').animate({scrollTop: $(document).height() + $(window).height()});
  
      }
    )
    .catch(error => console.log('error', error));
}

function makeTimeStr(orderTime){
  var orderTime = new Date(orderTime)
  var minStr
  if (orderTime.getMinutes() < 10) {
    minStr = '0' + orderTime.getMinutes()
  } else {
    minStr = orderTime.getMinutes()
  }
  return (orderTime.getMonth() + 1) + '/' + (orderTime.getDate()) + ' ' + (orderTime.getHours()) + ':' + (minStr)
}
function chkBtnClick1(i) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json; charset=utf-8");

var requestOptions = {
method: 'GET',
headers: myHeaders,
redirect: 'follow'
};

fetch("https://www.komfy.kr/orderCheck/"+i, requestOptions)
.then(response => response.text())
.then(result => {
  console.log(result);
  location.href='https://www.komfy.kr/receiver.html'})
.catch(error => console.log('error', error));
}

function chkBtnClick2(i) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json; charset=utf-8");

var requestOptions = {
method: 'GET',
headers: myHeaders,
redirect: 'follow'
};

fetch("https://www.komfy.kr/orderCheck/"+i, requestOptions)
.then(response => response.text())
.then(result => {
  console.log(result);
  location.href='https://www.komfy.kr/receiver.html'})
.catch(error => console.log('error', error));


}

setInterval(()=>{
  var dateStr='1999-01-01'
  if (orders.length > 0) {
    dateStr = orders[orders.length-1].date
  }
  fetch("https://www.komfy.kr/orderLoad/"+dateStr, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      result = JSON.parse(result)
      result.forEach((item, i) => {
        orders.push(item)
      });
      if(result.length > 0) {
      $('html, body').animate({scrollTop: $(document).height() + $(window).height()});
      }
      $('#chatBox').append(makeOrderHtml(result))


      }
    )
    .catch(error => console.log('error', error));
}, 10000);



function makeOrderHtml(result){
  var orderhtml='';
  result.forEach((order, i) => {
    var menuHtml = '주문 메뉴 <br>';
    order.menu.forEach((item, j) => {
      var menuText;
      allMenus.forEach((menu, k) => {
        if(menu[item]!==undefined){
          menuText = menu[item]
        }
      });
      menuHtml+='*'+menuText+'<br>'
      j++
      total = j;
      
      
    });
    


    var checkBtn = ''
    if(order.status=='checking'){
      checkBtn+=`<div class="checkBox">
    
          <div class="item" onclick="chkBtnClick1('${order.date}')">
             주문입력 완료
          </div>
          


      </div>`
    }else{
      var orderTimeStr = makeTimeStr(order.orderTime);
      checkBtn+=`<div class="chat ch2">
          <div class="icon"><i>컴피</i></div>
          <div class="textbox">주문이 접수되었습니다.</div>
      </div>
      <div class="time2">
        ${orderTimeStr}
      </div>
      `

    }

    var orderDateStr = makeTimeStr(order.date);
  orderhtml += `<div class="chat ch1">
        <div class="icon"><i> ${order.table}</i></div>
        <div class="textbox">
        ${menuHtml}
        총 메뉴 갯수 : ${total}
        </div>

   </div>
   <div class="time1">
    ${orderDateStr}
   </div>
   ${checkBtn}`

 });
 return orderhtml
}
