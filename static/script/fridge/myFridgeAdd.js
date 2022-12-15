

//식재료 추가 & 식재료 list 생성


// 선택한 식재료 list 생성
 var checkedIngdList = new Array();
 function addToList( box1 ){
     if( box1.checked == true ){
         checkedIngdList.push( box1.value );
         $("#basket_ingd_list_box").append(`<p class="animate__animated animate__pulse" id="${box1.value}_inlist">${box1.value}</p>`);
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


 // 냉장실에 식재료 추가 btn
 var ingdName, ingdRange=100, ingdExpire;
 var date = new Date();
 var today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


 function addToFresh(){
    Swal.fire({
        title: '냉장실에 보관할 재료를 알려주세요',
        html: `<form id=addIngd_input_form>
        <span>식재료 이름 : </span>
        <input type="text" class="swal2-input" id="ingdName""><br><br>
        <span id="tfIngdRange">아직 사용하지 않았어요</span><br>
        <input style="width:60%;" type="range" class="swal2-input" id="ingdRange" value=100 step=50
            oninput="window.changeRange(this.value);"><br><br>
        <span id="tfIngdExpire">유통기한 : </span>
        <input type="date" class="swal2-input" id="ingdExpire" min=${today}><br></form>`,
        confirmButtonText: '추가',
        cancelButtonText: '취소',
        focusConfirm: false,
        preConfirm: () => {
          const ingdName = Swal.getPopup().querySelector('#ingdName').value;
          const ingdRange = Swal.getPopup().querySelector('#ingdRange').value;
          const ingdExpire = Swal.getPopup().querySelector('#ingdExpire').value;
    
          if (!ingdName || !ingdRange) {
            Swal.showValidationMessage(`Please enter login and password`)
          }
          return { 
            name : ingdName,
            range : ingdRange,
            expire : ingdExpire }
        }
      }).then((result) => {
        Swal.fire(`
          Name: ${result.value.name}
          Range: ${result.value.range}
          Expire: ${result.value.expire}
        `.trim())
      })
    //      var addIngd_input = document.createElement("div");        
    //      console.log(today);
    //          addIngd_input.innerHTML = `<form id=addIngd_input_form>
    //          <span>식재료 이름 : </span>
    //          <input type="text" id=ingdName" oninput="changeName(this.value);"><br><br>
    //          <span id="tfIngdRange">아직 사용하지 않았어요</span><br>
    //          <input style="width:60%;" type="range" id="ingdRange" value=100 step=50 min=0 max=100
    //              onchange="changeRange(this.value);" oninput="window.changeRange(this.value);"><br><br>
    //          <span id="tfIngdExpire">유통기한 : </span>
    //          <input type="date" id="ingdExpire" min=${today} oninput="changeExpire(this.value);"><br></form>`;
    //  swal({
    //      title: '보관할 식재료의 정보를 알려주세요',
    //      text: '얼마나 사용하셨나요?',
    //      content: addIngd_input,
    //      buttons : {
    //          catch : {text:"추가", value:"confirmed" },
    //          cancel : "취소",
    //      } 
    //  }).then((value)=>{
    //      if(value=="confirmed"){
    //      axios({
    //              method : "post",
    //              url : "/myFridge/addToFresh",
    //              data : {
    //                  name : ingdName,
    //                  range : ingdRange,
    //                  expire : ingdExpire,
    //              }
    //          }).then((response)=>{
    //              console.log('post addToFresh response.data : ', response.data);
    //              window.location.href="/myFridge/"; 
    //      })}
    //  })
 }




  

//  냉동실에 식재료 추가 Btn
 function addToFrozen(){
    var addIngd_input = document.createElement("div");        
    console.log(today);
        addIngd_input.innerHTML = `<form id=addIngd_input_form>
        <span>식재료 이름 : </span>
        <input type="text" id=ingdName" oninput="changeName(this.value);"><br><br>
        <span id="tfIngdRange">아직 사용 전이에요</span><br>
        <input style="width:60%;" type="range" id="ingdRange" value=100 step=50 min=0 max=100
            onchange="changeRange(this.value);" oninput="window.changeRange(this.value);"><br><br>
        <span id="tfIngdExpire">구매일자 : </span>
        <input type="date" id="ingdExpire" max=${today} oninput="changeExpire(this.value);"><br></form>`;
swal({
    title: '보관할 식재료의 정보를 알려주세요',
    text: '얼마나 사용하셨나요?',
    padding: '3em',
    content: addIngd_input,
    buttons : {
        catch : {text:"추가", value:"confirmed" },
        cancel : "취소",
    } 
}).then((value)=>{
    if(value=="confirmed"){
    axios({
            method : "post",
            url : "/myFridge/addToFrozen",
            data : {
                name : ingdName,
                range : ingdRange,
                date : ingdExpire,
            }
        }).then((response)=>{
            console.log('post addToFrozen response.data : ', response.data);
            window.location.href="/myFridge/"; 
    })}
})
}


 // 식재료 입력값 변수 할당        
 window.changeRange = function (value){
    $("#addIngd_input_form").removeClass("animate__animated animate__headShake");
    var tfIngdRange = document.getElementById("tfIngdRange");
    if(value=="100"){ tfIngdRange.innerHTML="아직 사용 전이에요";}
    else if(value=="50"){tfIngdRange.innerHTML="사용하고 남았어요";}
    else{ 
        $("#addIngd_input_form").addClass("animate__animated animate__headShake");
        tfIngdRange.innerHTML="<span style='color:red;'>입력할 수 없는 값입니다</span>";
    }
    ingdRange = value;
 }
 function changeName(value){
     ingdName = value;
 }
 function changeExpire(value){
     ingdExpire = value;
 }