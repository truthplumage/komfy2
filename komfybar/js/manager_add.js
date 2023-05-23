var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
var subCateOptions = {}
var res

async function cateMaker(){
  let response = await fetch("/getSubCate", requestOptions)
  res = await response.json()
  htmlCate = '';
  res.forEach(cate=>{
    if(cate!=undefined){
      if(subCateOptions[cate.cateTitle] == undefined){
        subCateOptions[cate.cateTitle] = []
        htmlCate += `<option value="${cate.cateTitle}">${cate.cateTitle}</option>`
      }
      subCateOptions[cate.cateTitle].push(`<option value="${cate.subTitle}">${cate.subTitle}</option>`)
    }
  })
  $('#category').html(htmlCate)
  cateChange()
}
cateMaker();
function cateChange(){
  console.log('abc');
  var subCateHtml = ''
  subCateOptions[$('#category').val()].forEach(option=>{
    subCateHtml+=option
  })
  console.log(subCateHtml);
  $('#subCate').html(subCateHtml)
}
async function menuAdd() {
  if(checker('price', '가격을')) return;
  if(checker('title', '이름을')) return;
  if(checker('id', 'id를')) return;
  if(checker('event', '온클릭을')) return;

  var formdata = new FormData();
    var isFile = false;
    if($(`#img`)[0].files.length>0){
      isFile = true;
      console.log($(`#img`)[0].files[0]);
      formdata.append("file", $(`#img`)[0].files[0], $(`#img`)[0].files[0].filename);
    }

    var requestPhotoOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    var raw ={
      menu:{
        category:$(`#category`).val(),
      subCate:$(`#subCate`).val(),
        id:$(`#id`).val(),
        name:$(`#title`).val(),
        title:$(`#title`).val(),
        price:$(`#price`).val(),
        desc:$(`#desc`).val(),
        onClick:`menuAdd('${$('#id').val()}','${$('#title').val()} X')`,
        manager: $(`#manager`).val()
      }
    }
    console.log(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };
    try{
      let response = await fetch(`https://${url}/insertMenu`, requestOptions);
      let json = await response.json();
      console.log(json);
      if(isFile){
        let photoRes = await fetch(`https://${url}/photo/${$('#id').val()}/${$('#category').val()}`, requestPhotoOptions);
        let photoJson = await photoRes.json()
        console.log(photoJson);
        alert("메뉴가 등록되었습니다.")
      }else{
        alert("메뉴가 등록되었습니다.")
      }
    }catch(e){
      console.log(e);
      alert('중복된 아이디가 있습니다.')
    }
}

function checker(id, desc) {
  if($(`#${id}`).val()<=0){
    alert(desc+" 입력해주세요.")
    return false;
  } 
}

