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
    console.log(result)
    res = JSON.parse(result)
    console.log(res);
    let subTitle = ''
      res.forEach((item)=>{
        var html=''
        if(mCategory==item.cateTitle){
          if(subTitle!=item.subTitle){
            subTitle = item.subTitle
            $("#menus").append(`<h1>${item.subTitle}</h1>
            <span class="btn" id="${item.idx}_move" onclick="changeOrder(${item.idx})">+Move</span>
            <span class="btn" id="${item.idx}_moveOk" onclick="changeOrderComplete(${item.idx})">OK</span>
            <span class="btn" id="${item.idx}_moveCancel" onclick="changeOrderCancel(${item.idx})">Cancel</span>
            <br><div id="${mCategory+item.idx}_ul">`)
            $(`#${item.idx}_moveOk`).hide()
            $(`#${item.idx}_moveCancel`).hide()
          }
          $(`#${mCategory+item.idx}_ul`).append(`
        <div class="menu-contents" id="${item.id}">
          <div class="foods">
            <div class="image">
              <img src="${item.img}" id="${item.id}_img" alt="">
              
              <input type="file" id="${item.id}_imgFile">
              
            </div>
  
            <div class="text">
              <input id="${item.id}_title" value='${item.title}' disabled>
              <input id="${item.id}_price" value='${item.price}' disabled>
              <input id="${item.id}_desc" type="none" value='${item.desc}' disabled>
              <input id="${item.id}_manager" type="none" value="${item.manager}" disabled>
              <input id="${item.id}_subcate" type="none" value="${item.subTitle}" disabled hidden>
              
              <div class="btn" id="${item.id}_modi" onclick="updateMenu('${item.id}')">수정</div>
              <div class="btn" id="${item.id}_delete" onclick="deleteMenu('${item.id}')">삭제</div>
              

              <div class="btn" id="${item.id}_complete" onclick="completeMenu('${item.id}')">확인</div>
              <div class="btn" id="${item.id}_cancel" onclick="cancelMenu('${item.id}')">취소</div>
            </div>
          </div>
        
        </div> `)
        $(`#${item.id}_imgFile`).hide()
        $(`#${item.id}_complete`).hide()
        $(`#${item.id}_cancel`).hide()
        }
      })
  })
  .catch(error => console.log('error', error));
  
  
  function changeOrder(i) {
    console.log("change order");
    new Sortable(document.getElementById(mCategory+i+'_ul'), {
      group: 'shared', // set both lists to same group
      animation: 150
    });
    $(`#${i}_moveOk`).show()
    $(`#${i}_moveCancel`).show()
    $(`#${i}_move`).hide()
  }
  function changeOrderComplete(i){
    let childs = document.getElementById(`${mCategory+i}_ul`).firstChild
    let el = childs.nextElementSibling
    let changeMenu = []
    while (el) {
      changeMenu.push(el.id)
      console.log(el.id)
      el = el.nextElementSibling;
    }
    let raw = {
      'cate':mCategory,
      'subcate':i,
      'menusId':changeMenu
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };

    fetch("/changeMenu", requestOptions).then((res)=>{
      console.log(res);
      window.location.reload()
    })

    
  
  }
  function changeOrderCancel(i){
    menuShow(mCategory)
  }


  function updateMenu(id) {
    $(`#${id}_title`).attr('disabled', false)
    $(`#${id}_price`).attr('disabled', false)
    $(`#${id}_desc`).attr('disabled', false)
    $(`#${id}_event`).attr('disabled', false)
    $(`#${id}_manager`).attr('disabled', false)
    $(`#${id}_complete`).show()
    $(`#${id}_cancel`).show()
    $(`#${id}_modi`).hide()
    $(`#${id}_imgFile`).show()
    $(`#${id}_delete`).hide()
  }



  function completeMenu(id) {
    var formdata = new FormData();
    var isFile = false;
    if($(`#${id}_imgFile`)[0].files.length>0){
      isFile = true;
      console.log($(`#${id}_imgFile`)[0].files[0]);
      formdata.append("file", $(`#${id}_imgFile`)[0].files[0], $(`#${id}_imgFile`)[0].files[0].filename);
    }

    var requestPhotoOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    var name = $(`#${id}_title`).val()
    var raw ={
      menu:{
        id:id,
        name:$(`#${id}_title`).val(),
        title:$(`#${id}_title`).val(),
        price:$(`#${id}_price`).val(),
        desc:$(`#${id}_desc`).val(),
        onClick: `menuAdd('${id}', '${name} X')`,
        manager: $(`#${id}_manager`).val(),
        subcate: $(`#${id}_subcate`).val()
      }
    }
    console.log(raw);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };

    fetch("/updateMenu/"+id + "/" + mCategory, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        if(isFile){
          fetch("/photo/"+id + "/" + mCategory, requestPhotoOptions)
          .then(response => response.text())
          .then(result => location.reload())
          .catch(error => console.log('error', error));
        }else{
          location.reload();
        }
      })
      .catch(error => console.log('error', error));
    

    
  }

  function cancelMenu(id) {
    res.forEach(item => {
      if(item.id == id){
        $(`#${id}_title`).val(item.title);
        $(`#${id}_price`).val(item.price);
        $(`#${id}_desc`).val(item.desc);
        $(`#${id}_manager`).val(item.manager);
      }
    });
    $(`#${id}_title`).attr('disabled', true)
    $(`#${id}_price`).attr('disabled', true)
    $(`#${id}_desc`).attr('disabled', true)
    $(`#${id}_event`).attr('disabled', true)
    $(`#${id}_manager`).attr('disabled', true)
    $(`#${id}_complete`).hide()
    $(`#${id}_cancel`).hide()
    $(`#${id}_modi`).show()
    $(`#${id}_imgFile`).hide()
    $(`#${id}_delete`).show()

  }

  function deleteMenu(id) {
    if(confirm(id + ' 삭제하시겠습니까?')){
      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      
      fetch("/deleteMenu/"+id +'/'+mCategory , requestOptions)
        .then(response => response.text())
        .then(result => location.reload())
        .catch(error => console.log('error', error));
    }
  }
  
  function menuShow(category) {
    mCategory = category
    console.log(category)
    $('#menus').empty()
    res.forEach(element => {
      Object.keys(element).forEach(cate => {
        
        if(cate == category) {
          element[cate].forEach((subCate,i) => {
            $("#menus").append(`<h1>${subCate.title}</h1>
            <span class="btn" id="${i}_move" onclick="changeOrder(${i})">+Move</span>
            <span class="btn" id="${i}_moveOk" onclick="changeOrderComplete(${i})">OK</span>
            <span class="btn" id="${i}_moveCancel" onclick="changeOrderCancel(${i})">Cancel</span>
            <br><div id="${mCategory+i}_ul">
            `)
            $(`#${i}_moveOk`).hide()
            $(`#${i}_moveCancel`).hide()

            subCate.data.forEach(item => {
              console.log(item);
              $("#"+mCategory+i+'_ul').append(`

              <div class="menu-contents" id="${item.id}">
              <div class="foods">
              <div class="image">
              <img src="${item.img}" id="${item.id}_img" alt="">
                
              <input type="file" id="${item.id}_imgFile">
                
              </div>
              
              <div class="text">
                <input id="${item.id}_title" value='${item.title}' disabled>
                <input id="${item.id}_price" value='${item.price}' disabled>
                <input id="${item.id}_desc" type="none" value='${item.desc}' class="desc"  disabled>
                <input id="${item.id}_manager" type="none" value="${item.manager}" disabled>
                <input id="${item.id}_subcate" type="none" value="${subCate.title}" disabled hidden>

                <div class="btn" id="${item.id}_modi" onclick="updateMenu('${item.id}')">수정</div>
                <div class="btn" id="${item.id}_delete" onclick="deleteMenu('${item.id}')">삭제</div>
                <div class="btn" id="${item.id}_complete" onclick="completeMenu('${item.id}')">확인</div>
                <div class="btn" id="${item.id}_cancel" onclick="cancelMenu('${item.id}')">취소</div>
                </div>
              </div>
                
              </div> `)
              $(`#${item.id}_imgFile`).hide()
              $(`#${item.id}_complete`).hide()
              $(`#${item.id}_cancel`).hide()
              
            });
          });
        }
      });
    });
  }