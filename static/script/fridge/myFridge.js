
 // 선택한 식재료 list 생성
 var checkedIngdList = new Array();
 function addToList( box1 ){
     if( box1.checked == true ){
         checkedIngdList.push( box1.value );
         $("#basket_ingd_list_box").append(`<p id="${box1.value}_inlist">${box1.value}</p>`);
         console.log( checkedIngdList );
     }else{
         var index = checkedIngdList.indexOf( box1.value );
         console.log( index );
         $(`#${box1.value}_inlist`).remove();

         while( index > -1 ){
             checkedIngdList.splice( index, 1);
             index = checkedIngdList.indexOf( box1.value );
             console.log( checkedIngdList );
         }
     }
 }


 // 식재료 추가 btn
 var ingdName, ingdRange=100, ingdExpire;
 var date = new Date();
 var today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
 function addIngd(){
         var addIngd_input = document.createElement("div");        
         console.log(today);
             addIngd_input.innerHTML = `<form id=addIngd_input_form>
             <span>식재료 이름 : </span>
             <input type="text" id=ingdName" oninput="changeName(this.value);"><br><br>
             <span id="tfIngdRange">100%</span><br>
             <input style="width:60%;" type="range" id="ingdRange" value=100 step=50 min=0 max=100
                 onchange="changeRange(this.value);" oninput="window.changeRange(this.value);"><br><br>
             <span id="tfIngdExpire">유통기한 : </span>
             <input type="date" id="ingdExpire" min=${today} oninput="changeExpire(this.value);"><br></form>`;
     swal({
         title: '보관할 식재료의 정보를 알려주세요',
         text: '최초 입력시 수량은 100%로 설정해주세요',
         content: addIngd_input,
         buttons : {
             catch : {text:"추가", value:"confirmed" },
             cancel : "취소",
         } 
     }).then((value)=>{
         if(value=="confirmed"){
         axios({
                 method : "post",
                 url : "/myFridge/addIngd",
                 data : {
                     name : ingdName,
                     range : ingdRange,
                     expire : ingdExpire
                 }
             }).then((response)=>{
                 console.log('post addIngd response.data : ', response.data);
                 window.location.href="/myFridge/"; 
         })}
     })
 }
//  $("#datepicker").datepicker({
//     format : "yyyy-mm-dd",
//     startDate : today,
//     autoclose: true,
//  });


 // 식재료 입력값 변수 할당        
 window.changeRange = function (value){
     var tfIngdRange = document.getElementById("tfIngdRange");
     tfIngdRange.innerHTML = value + "%";
     ingdRange = value;
 }
 function changeName(value){
     ingdName = value;
 }
 function changeExpire(value){
     ingdExpire = value;
 }