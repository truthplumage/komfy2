const allMenus = []

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
var res
fetch("/getMenus", requestOptions)
    .then(response => response.text())
    .then(result => {
      res = JSON.parse(result)
      console.log(res);
      res.forEach(menu=>{
        allMenus.push(menu)
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
  fetch("/orderDel", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      location.href='/receiver.html'
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
  fetch("/orderLoad/1999-01-01", requestOptions)
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

fetch("/orderCheck/"+i, requestOptions)
.then(response => response.text())
.then(result => {
  console.log(result);
  location.href='/receiver.html'})
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

fetch("/orderCheck/"+i, requestOptions)
.then(response => response.text())
.then(result => {
  console.log(result);
  location.href='/receiver.html'})
.catch(error => console.log('error', error));


}

setInterval(()=>{
  var dateStr='1999-01-01'
  if (orders.length > 0) {
    dateStr = orders[orders.length-1].date
  }
  fetch("/orderLoad/"+dateStr, requestOptions)
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
        if(menu.id == item){
          menuText = menu.name
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
