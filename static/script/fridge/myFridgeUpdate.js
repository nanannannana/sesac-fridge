
// 식재료 변경 & 삭제

function showUpdateBtns(){
    $(".updateIngd_btn").removeClass("d_none");
    $(".deleteIngd_btn").removeClass("d_none");

    $("#showUpdateBtns").addClass("d_none");
    $(".addIngd_btn").addClass("d_none");
    $(".fridge_ingd_box input[type=checkbox]").addClass("d_none");
    $("#basket_ingd_list_box").addClass("hidden");
    $("#resultRecipe").html("변경 완료 후 이용해주세요");
    $("#resultRecipe").attr("disabled",true);
}

function cancelUpdate(){
    window.location.href="/myFridge/";
}

function finishUpdate(){
    window.location.href="/myFridge/";
}

function clickUpdate(ingd){

    const thisName = $(ingd).parent().children("input:first").val();
    const thisRange = $(ingd).parent().children("input:last").val();
    const thisExpire = $(ingd).parent().children("p").text();
    const thisFridge = $(ingd).closest("form").attr("name");
    const msg = window.changeRange(thisRange);
    console.log("thisVals :", thisName, thisRange, thisExpire, thisFridge, msg);
    let swal_html;
    if( thisFridge=="fresh"){
        swal_html = `
        <span>식재료 이름 : </span>
        <input type="text" class="swal2-input" id="freshName_inp" value="${thisName}"><br>
        <span id="tfIngdRange" style="margin-top:1em;">${msg}</span><br>
        <input type="range" style="width:60%; padding:0; margin-top:0; cursor: pointer;" 
            class="swal2-input" id="freshRange_inp" value=${thisRange} step=50
            oninput="window.changeRange(this.value);"><br>
        <span>유통기한 : </span>
        <input type="date" style="width:60%; margin-top:0;" class="swal2-input" id="freshExpire_inp" value="${thisExpire}" min=${today}>`;
    }else{ swal_html=`
    <span>식재료 이름 : </span>
    <input type="text" class="swal2-input" id="frozenName_inp" value="${thisName}"><br><br>
    <span id="tfIngdRange" style="margin-top:1em;">${msg}</span><br>
    <input type="range" style="width:60%; padding:0; margin-top:0; cursor: pointer;" 
        class="swal2-input" id="frozenRange_inp" value=${thisRange} step=50
        oninput="window.changeRange(this.value);"><br>
    <span>구매일자 : </span>
    <input type="date" style="width:60%; margin-top:0;" class="swal2-input" id="frozenDate_inp" value="${thisExpire}" max=${today}>`}

    Swal.fire({
        title: '냉동실에 보관할 재료를 알려주세요',
        html: swal_html,
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
                preConfirm : ()=>{
                    window.location.href="/myFridge/";
                    showUpdateBtns();
                }
            })
    })

}