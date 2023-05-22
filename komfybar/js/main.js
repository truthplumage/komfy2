var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
var res
var mCategory = 'food'

  fetch("/getMenus", requestOptions)
    .then(response => response.text())
    .then(result => {
      res = JSON.parse(result)
      let subTitle = ''
      res.forEach(item=>{
        var html=''
        if(subTitle!=item.subTitle){
          subTitle = item.subTitle
          html+=`<h1>${item.subTitle}</h1>`
        }
        html+=`
                <div class="menu-contents">
                  <div class="foods">
                    <div class="image">
                      <img src="${item.img}" alt="">
                    </div>
                    <div class="text">
                      <h2>${item.title} | ${item.price} </h2>
                      <h3> ${item.desc}</h3>
                      <div class="btn" onclick="${item.onClick}">+Add</div>
                    </div>
                  </div>
                </div> 
              `
        $('#'+item.cateTitle).append(html);
      })
    }).catch(error => console.log('error', error));

var menuArr = [];
var isOrder = false;
var tableName = location.search.split('table=')[1]
if(tableName == undefined){
  location.href='https://localhost/reqr.html' // qr로 재 유도하는 페이지
}

$(document).ready(function(){
	
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

});

window.onpageshow =  function(event) {
  //back 이벤트 일 경우
  if (event.persisted) {
      document.location.reload()
  }
}



function order(){
  if(isOrder == false){
    isOrder = true
    var orderMenu = []
    menuArr.forEach((item, i) => {
      if(item!==''){
        orderMenu.push(item)
      }
    });
    var tableName = location.search.split('table=')[1]
    console.log(tableName);
    console.log(orderMenu);

    
  if(tableName == undefined){
    tableName = location.search;
  }
  var raw = JSON.stringify({
    "table": tableName,
    "menu" : orderMenu
  });
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://localhost/order", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result)
      location.href="https://localhost/afterorder.html" // 주문 후 손님이 보는 페이지
    })
    .catch(error => console.log('error', error));
  }
}


function makeBtn(idNum, text){
  const btn = `<div class="btn" id="menu_${idNum}" onclick='menuClick(event)'>
            ${text}
          </div>`;
  $('#menuadd').html($('#menuadd').html()+btn);
  $('#menubar').show();
  console.log(idNum);
}

function menuAdd(id, text){
  menuArr.push(id);
  makeBtn(menuArr.length, text);

	const offset = $("#menuadd").scrollLeft();
	$('#menuadd').animate({scrollLeft: offset + 200}, 0);
  var cnt = 0;
  menuArr.forEach((item, i) => {
    if(item !== ''){
      cnt++
    }
  });

  $('#total_count').text('total count :'+cnt);
}



function menuClick(event){
  var id = event.target.id;
  console.log(id);
  const numberStr = id.split('_')[1]// 끝에 있는 숫자 가져오기
  const num = Number(numberStr)-1;
  menuArr[num] = '';
  var cnt = 0;
  menuArr.forEach((item, i) => {
    if(item !== ''){
      cnt++
    }
  });

  $('#total_count').text('total count :'+cnt);
  if(cnt == 0) {
    $('#menubar').hide();
  }
  $('#'+id).remove();

}
$('#menubar').hide();

$('.option').hide();
$('.option.whisky1').hide();


 function optionPopUpShow() {
   $('.option').show()
   
 }
 
 function optionPopUpHide() {
    $('.option').hide()
 }