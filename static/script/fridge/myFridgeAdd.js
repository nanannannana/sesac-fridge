
//식재료 추가 

//냉장실 & 냉동실 식재료 추가
var date = new Date();
var today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

// 냉장실에 식재료 추가 
// 냉장실에 추가 btn 클릭시,
// 중복 여부 검사
 async function checkFresh(){

    const { value: freshName } = await Swal.fire({
        title: '어떤 식재료를 보관하실건가요?',
        input: 'text',
        inputLabel: '띄어쓰기 없이 입력해주세요',
        confirmButtonColor: '#7E998F',
        showCancelButton:true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                axios({
                    method : "post",
                    url : "/myFridge/checkFresh",
                    data : { name : value }, 
                }).then((response)=>{
                    console.log("checkFresh res.data", response.data)
                    if(response.data){
                        resolve();
                    }else{ resolve("이미 보관 중인 식재료입니다");}
                })
            })
        }
    })
    if(freshName){freshModal(freshName);}
 }
 //식재료 정보 입력 받기 
 async function freshModal(freshName){
    Swal.fire({
        title: '냉장실에 보관할 재료를 알려주세요',
        html: `
            <span>식재료 이름 : </span>
            <input type="text" style="margin-bottom:1em;" class="swal2-input" id="freshName_inp" value="${freshName}" disabled><br>
            <div id="tfIngdRange" style="margin:1em;">아직 사용하거나 먹지 않았어요</div>
            <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
                class="swal2-range" id="freshRange_inp" value=100 step=50
                oninput="window.changeRange(this.value);"><br>
            <span>유통기한 : </span>
            <input type="date" style="width:60%;" class="swal2-input" id="freshExpire_inp" min=${today}>`,
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const freshRange = Swal.getPopup().querySelector('#freshRange_inp').value;
          const freshExpire = Swal.getPopup().querySelector('#freshExpire_inp').value;

        // input 미입력 시 알림 
        if( !freshName || freshRange==0 || !freshExpire) {
            Swal.showValidationMessage(`바르게 입력해주세요`)
        }

        //   if(checkIngdResult!==true){
        //     console.log("global checkIngdResult :", checkIngdResult);
        //     Swal.showValidationMessage(`이미 냉장고에 보관 중인 식재료예요`)
        //   }
          return { 
            name : freshName,
            range : freshRange,
            expire : freshExpire }
        }
      }).then((result) => {
        if(result.isConfirmed){
            addToFresh(result);            
        }else if (result.isDismissed){
            window.location.href="/myFridge/";}
    })
 }
// 입력한 정보 fresh DB로 전송&추가
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
        console.log('post addToFresh res.data : ', response.data);
        
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
// 냉장실에 추가 btn 클릭시,
// 중복 여부 검사
async function checkFrozen(){
    const { value: frozenName } = await Swal.fire({
        title: '어떤 식재료를 보관하실건가요?',
        input: 'text',
        inputLabel: '띄어쓰기 없이 입력해주세요',
        confirmButtonColor: '#7E998F',
        showCancelButton:true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                axios({
                    method : "post",
                    url : "/myFridge/checkFrozen",
                    data : { name : value }, 
                }).then((response)=>{
                    console.log("checkFrozen res.data", response.data)
                    if(response.data){
                        resolve();
                    }else{ resolve("이미 보관 중인 식재료입니다");}
                })
            })
        }
    })
    if(frozenName){frozenModal(frozenName);}
 }
function frozenModal(frozenName){
    Swal.fire({
        title: '냉동실에 보관할 재료를 알려주세요',
        html: `
            <span>식재료 이름 : </span>
            <input type="text" style="margin-bottom:1em;" class="swal2-input" id="frozenName_inp" value="${frozenName}" disabled><br>
            <div id="tfIngdRange" style="margin:1em;">아직 사용하거나 먹지 않았어요</div>
            <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
                class="swal2-range" id="frozenRange_inp" value=100 step=50
                oninput="window.changeRange(this.value);"><br>
            <span>구매일자 : </span>
            <input type="date" style="width:60%;" class="swal2-input" id="frozenDate_inp" max=${today}>`,
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const frozenRange = Swal.getPopup().querySelector('#frozenRange_inp').value;
          const frozenDate = Swal.getPopup().querySelector('#frozenDate_inp').value;
    
          if (!frozenName || frozenRange==0 || !frozenDate) {
            Swal.showValidationMessage(`바르게 입력해주세요`)
          }
          return { 
            name : frozenName,
            range : frozenRange,
            date : frozenDate }
        }
      }).then((result) => {
        if(result.isConfirmed){
            addToFrozen(result);            
        }else if (result.isDismissed) {
            window.location.href="/myFridge/";}       
    })
 }
// 입력한 정보 frozen DB로 전송&추가
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
        console.log('post addToFrozen res.data : ', response.data);
        
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
        tfIngdRange.innerHTML="<span style='color:#ED6C67;'>보관할 것이 없어요</span>";
    } 
 }
