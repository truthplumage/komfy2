var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
var subCateOptions = {}
var res
fetch("https://www.komfy.kr/getMenus", requestOptions)
    .then(response => response.text())
    .then(result => {
      res = JSON.parse(result)
      let htmlCate = ''
      res.forEach(cate=>{
        Object.keys(cate).forEach(key=>{
          if(cate[key]!=undefined){
            if(subCateOptions[key] == undefined){
              subCateOptions[key] = []
            }
            htmlCate += `<option value="${key}">${key}</option>`
            cate[key].forEach(subCate => { 
              subCateOptions[key].push(`<option value="${subCate.title}">${subCate.title}</option>`)
            })
          }
        })
      })
      $('#category').html(htmlCate)
      cateChange()
    })
    .catch(error => console.log('error', error));
function cateChange(){
  console.log('abc');
  var subCateHtml = ''
  subCateOptions[$('#category').val()].forEach(option=>{
    subCateHtml+=option
  })
  console.log(subCateHtml);
  $('#subCate').html(subCateHtml)
}
function menuAdd() {
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

    fetch("https://www.komfy.kr/insertMenu/", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        if(isFile){
          fetch("https://www.komfy.kr/photo/"+$('#id').val()+"/"+$('#category').val(), requestPhotoOptions)
          .then(response => response.text())
          .then(result => alert("메뉴가 등록되었습니다."))
          .catch(error => console.log('error', error));
        }else{
          alert("메뉴가 등록되었습니다.")
        }
      })
      .catch(error => console.log('error', error));
    

    
}

function checker(id, desc) {
  if($(`#${id}`).val()<=0){
    alert(desc+" 입력해주세요.")
    return false;
  } 
}

