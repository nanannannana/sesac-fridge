
// 식재료 변경 & 삭제

// 변경삭제 Btn 클릭시 Btn 변화
function showUpdateBtns(){
    $(".updateIngd_btn").removeClass("d_none");
    $(".deleteIngd_btn").removeClass("d_none");
    $(".warn_text").removeClass("d_none");
    $("#basket_warn").removeClass("hidden");
    $("#smile_emoji").removeClass("hidden");


    $("#showUpdateBtns").addClass("d_none");
    $(".fresh_box").remove();
    $(".frozen_box").remove();
    $(".change_box1").remove();
    $(".change_box2").css("width","50%");
    $(".change_box3").css("width","50%");
    $(".fridge_ingd_box input[type=checkbox]").addClass("d_none");
    $("#basket_ingd_box").addClass("hidden");
    $(".basket_text").addClass("d_none");
    $("#basket_arrow").addClass("hidden");
    $("#result_recipe").html("");
    $("#result_recipe").attr("disabled",true);
}
// 변경-취소 Btn 클릭시,
function cancelUpdate(){
    window.location.href="/myFridge/";
}
// 변경-완료 Btn 클릭시,
function finishUpdate(){
    window.location.href="/myFridge/";
}

// 변경- 각 식재료 하단 수정 Btn 클릭시
async function clickUpdate(ingd){
    const thisId = $(ingd).parent().children("span").text();
    const thisName = $(ingd).parent().children("input:first").val();
    const thisRange = $(ingd).parent().children("input:last").val();
    const thisExpire = $(ingd).parent().children("p").text();
    const thisFridge = $(ingd).closest("form").attr("name");
    console.log("thisVals :", thisId, thisName, thisRange, thisExpire, thisFridge);

    // 냉장실- 냉동실 구분
        if( thisFridge=="fresh"){
            Swal.fire({
                html : `
                <span>식재료 이름 : </span>
                <input type="text" style="margin-bottom:1em;" class="swal2-input" id="freshName_inp" value="${thisName}" disabled><br>
                <div id="tfIngdRange" style="margin:1em;"></div>
                <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
                    class="swal2-range" id="freshRange_inp" value=${thisRange} step=50
                    oninput="window.changeRange(this.value);"><br>
                <span>유통기한 : </span>
                <input type="date" style="width:60%;" class="swal2-input" id="freshExpire_inp" value="${thisExpire}" min=${today}>`,
                confirmButtonText: '확인',
                confirmButtonColor: '#7E998F',
                showCancelButton: true,
                focusConfirm: false,
                preConfirm : ()=>{
                const freshId = thisId;
                const freshName = thisName;
                const freshRange = Swal.getPopup().querySelector('#freshRange_inp').value;
                const freshExpire = Swal.getPopup().querySelector('#freshExpire_inp').value;

                if (!freshName || freshRange==0 || !freshExpire) {
                    Swal.showValidationMessage(`바르게 입력했는지 확인해주세요`)
                }

                return { 
                    id : freshId,
                    newName : freshName,
                    range : freshRange,
                    expire : freshExpire 
                }}
            }).then((result) => {
                console.log("result",result);
                console.log("result value name",result.value.name);

                if(result.isConfirmed){
                    updateFresh(result);            
                }else if(result.isDismissed){
                    window.location.href="/myFridge/";
                    showUpdateBtns();
                }
            })
        }else{ 
        Swal.fire({
            html: `
            <span>식재료 이름 : </span>
            <input type="text" style="margin-bottom:1em;" class="swal2-input" id="frozenName_inp" value="${thisName}" disabled><br>
            <div id="tfIngdRange" style="margin:1em;"></div>
            <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
                class="swal2-range" id="frozenRange_inp" value=${thisRange} step=50
                oninput="window.changeRange(this.value);"><br>
            <span>구매일자 : </span>
            <input type="date" style="width:60%;" class="swal2-input" id="frozenDate_inp" value="${thisExpire}" max=${today}>`,
            confirmButtonText: '확인',
            confirmButtonColor: '#7E998F',
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const frozenId = thisId;
                const frozenName = thisName;
                const frozenRange = Swal.getPopup().querySelector('#frozenRange_inp').value;
                const frozenDate = Swal.getPopup().querySelector('#frozenDate_inp').value;
            if (!frozenName || frozenRange==0 || !frozenDate) {
                Swal.showValidationMessage(`바르게 입력했는지 확인해주세요`)
            }
            return { 
                name : frozenName,
                range : frozenRange,
                date : frozenDate 
            }}
        }).then((result) => {
        if(result.isConfirmed){
            updateFrozen(result);            
        }else if (result.isCancelled) {
            window.location.href="/myFridge/";
            showUpdateBtns();
        }       
    })
}
}
// 수정한 정보 냉장실 DB에 반영
function updateFresh(result){
    axios({
        method : "patch",
        url : "/myFridge/updateFresh",
        data : {
        name : result.value.name,
        range : result.value.range,
        expire : result.value.expire,
        }
    }).then((response)=>{
        console.log('patch updateFresh res.data : ', response.data);
        
        Swal.fire({
        icon: 'success',
        text : `
        ${result.value.name}(이/가) 
        ${result.value.expire}까지 냉장실에 보관됩니다
        `.trim(),
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        preConfirm:()=>{window.location.href="/myFridge/";}
        })
    })
}
// 수정한 정보 냉동실 DB에 반영
function updateFrozen(result){
    axios({
        method : "patch",
        url : "/myFridge/updateFrozen",
        data : {
        name : result.value.name,
        range : result.value.range,
        date : result.value.date,
        }
    }).then((response)=>{
        console.log('post updateFrozen res.data : ', response.data);
        
        Swal.fire({
        icon: 'success',
        text : `
        ${result.value.date}에 구매한 ${result.value.name}(이/가) 냉동실에 보관됩니다`.trim(),
        confirmButtonText: '확인',
        confirmButtonColor: '#7E998F',
        preConfirm:()=>{window.location.href="/myFridge/";}
        })
    })
}

function clickDelete( ingd ){
    Swal.fire({
        title: `${ingd.value}(을/를) 제거하시겠어요?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7E998F',
        cancelButtonColor: '##ED6C67',
        confirmButtonText: '제거해주세요',
        cancelButtonText: '취소',
        preConfirm : ()=>{
            const name = ingd.value;
            const fridgeName = $(ingd).closest("form").attr("name");
            return { name : name, fridgeName : fridgeName };
        }
      }).then((result) => {
        console.log(result.value);
        if(result.isConfirmed){
            deleteIngd(result.value.name, result.value.fridgeName);
        }else{
        window.location.href="/myFridge/";
        showUpdateBtns();
        }
      })
}

function deleteIngd( name, fridgeName ){
    axios({
        method : "delete",
        url : "/myFridge/deleteIngd",
        data : { name : name, fridgeName : fridgeName }
    }).then((response)=>{
        console.log(response.data);
            Swal.fire({
                title : `나의 냉장고에서 ${response.data.name}(이/가) 제거되었습니다`,
                text : '새로운 재료를 추가해보세요',
                icon : 'success',
                confirmButtonColor: '#7E998F',
                confirmButtonText: '확인',
            }).then((result)=>{
                if(result.isConfirmed){
                    window.location.href="/myFridge/";
                    showUpdateBtns();
                }
            })
    })
}