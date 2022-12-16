

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

    let checkIngdResult;
 function checkIngd( ingdName, fridgeName ){
    let isFresh;
    if( fridgeName=="es"){
        isFresh=true;
    }else{ isFresh=false; }

    console.log("isFresh:", isFresh);

    axios({
        method : "post",
        url : "/myFridge/checkIngdName",
        data : { name : ingdName, isFresh : isFresh }, 
    }).then((response)=>{
        console.log("checkIngdresponse.data", response.data)
        checkIngdResult=response.data;
    })
 }


 //냉장실 & 냉동실 식재료 추가
 var date = new Date();
 var today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

// 냉장실에 식재료 추가 
// 냉장실에 추가 btn 클릭시,
 function clickToFresh(){
    Swal.fire({
        title: '냉장실에 보관할 재료를 알려주세요',
        html: `
            <span>식재료 이름 : </span>
            <input type="text" class="swal2-input" id="freshName_inp"><br><br>
            <span id="tfIngdRange" style="margin-top:1em;">아직 사용하거나 먹지 않았어요</span><br>
            <input type="range" style="width:60%; padding:0; margin-top:0; cursor: pointer;" 
                class="swal2-input" id="freshRange_inp" value=100 step=50
                oninput="window.changeRange(this.value);"><br>
            <span>유통기한 : </span>
            <input type="date" style="width:60%; margin-top:0;" class="swal2-input" id="freshExpire_inp" min=${today}>`,
        confirmButtonText: '추가',
        confirmButtonColor: '#7E998F',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const freshName = Swal.getPopup().querySelector('#freshName_inp').value;
          const freshRange = Swal.getPopup().querySelector('#freshRange_inp').value;
          const freshExpire = Swal.getPopup().querySelector('#freshExpire_inp').value;
          const fridgeName = Swal.getPopup().querySelector('#freshName_inp').getAttribute("id").slice(2,4);
          console.log("fridgeName:", fridgeName);

          if(checkIngdResult!==true){
            console.log("global checkIngdResult :", checkIngdResult);
            Swal.showValidationMessage(`이미 냉장고에 보관 중인 식재료예요`)
          }

            // input 미입력 시 알림 
          if (!freshName || freshRange==0 || !freshExpire) {
            Swal.showValidationMessage(`입력하지 않은 정보가 있어요`)
          }

          return { 
            name : freshName,
            range : freshRange,
            expire : freshExpire }
        }
      }).then((result) => {
        if(result.isConfirmed){
            addToFresh(result);            
        }else if (result.isCancelled) {
            window.location.href="/myFridge/";}
    })
 }
// 입력한 식재료 냉장실에 추가하는 함수
 function addToFresh(result){
    axios({
        method : "post",
        url : "/myFridge/addToFresh",
        data : {
        name : result.value.name,
        range : result.value.range,
        expire : result.value.expire,
        }
    }).then((response)=>{
        console.log('post addToFresh response.data : ', response.data);
        
        Swal.fire({
        icon: 'success',
        text : `
        ${result.value.name} ${result.value.range}%가 
        ${result.value.expire}까지 냉장실에 보관됩니다
        `.trim(),
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        preConfirm:()=>{window.location.href="/myFridge/";}
        })
    })
 }


//  냉동실에 식재료 추가
// 냉동실에 추가 btn 클릭시,
function clickToFrozen(){
    Swal.fire({
        title: '냉동실에 보관할 재료를 알려주세요',
        html: `
            <span>식재료 이름 : </span>
            <input type="text" class="swal2-input" id="frozenName_inp"><br><br>
            <span id="tfIngdRange" style="margin-top:1em;">아직 사용하거나 먹지 않았어요</span><br>
            <input type="range" style="width:60%; padding:0; margin-top:0; cursor: pointer;" 
                class="swal2-input" id="frozenRange_inp" value=100 step=50
                oninput="window.changeRange(this.value);"><br>
            <span>구매일자 : </span>
            <input type="date" style="width:60%; margin-top:0;" class="swal2-input" id="frozenDate_inp" max=${today}>`,
        confirmButtonText: '추가',
        confirmButtonColor: '#7E998F',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const frozenName = Swal.getPopup().querySelector('#frozenName_inp').value;
          const frozenRange = Swal.getPopup().querySelector('#frozenRange_inp').value;
          const frozenDate = Swal.getPopup().querySelector('#frozenDate_inp').value;
    
          if (!frozenName || frozenRange==0 || !frozenDate) {
            Swal.showValidationMessage(`입력하지 않은 정보가 있어요`)
          }
          return { 
            name : frozenName,
            range : frozenRange,
            date : frozenDate }
        }
      }).then((result) => {
        if(result.isConfirmed){
            addToFrozen(result);            
        }else if (result.isCancelled) {
            window.location.href="/myFridge/";}       
    })
 }
 // 입력한 식재료 냉동실에 추가하는 함수
 function addToFrozen(result){
    axios({
        method : "post",
        url : "/myFridge/addToFrozen",
        data : {
        name : result.value.name,
        range : result.value.range,
        date : result.value.date,
        }
    }).then((response)=>{
        console.log('post addToFrozen response.data : ', response.data);
        
        Swal.fire({
        icon: 'success',
        text : `
        ${result.value.date}에 구매한 ${result.value.name} 
        ${result.value.range}%가 냉동실에 보관됩니다`.trim(),
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        preConfirm:()=>{window.location.href="/myFridge/";}
        })
    })
 }

 // 식재료 입력값 변수 할당        
 window.changeRange = function(value){
    $("#frozenRange_inp").removeClass("animate__animated animate__shakeX");
    var tfIngdRange = document.getElementById("tfIngdRange");
    if(value=="100"){ tfIngdRange.innerHTML="아직 사용하거나 먹지 않았어요";}
    else if(value=="50"){tfIngdRange.innerHTML="사용하거나 먹고 남았어요";}
    else{ 
        $("#frozenRange_inp").addClass("animate__animated animate__shakeX");
        tfIngdRange.innerHTML="<span style='color:#ED6C67;'>입력할 수 없는 값입니다</span>";
    } 
 }
