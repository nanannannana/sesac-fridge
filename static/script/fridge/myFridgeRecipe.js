 $("#fridge_col input[type=range]").attr({ step:50 });
 $("#fridge_col input[type=range]").addClass("form-range"); 
 $("#basket_arrow").addClass("animate__animated animate__fadeInDown");

// 선택한 식재료 list 생성
// 목표 : 식재료 name & range recipe page로 전송
var checkedIngdName = new Array();
// var checkedIngdRange = new Array();
function addToList( box1, thisRange ){
    if( box1.checked == true ){ //checkbox 클릭 - 배열에 value 추가 
        checkedIngdName.push( box1.value );
        // checkedIngdRange.push( thisRange );
        //추가된 재료명 장바구니 아래 목록으로 노출
        $("#basket_list").append(`
        <div class="${box1.value}_in basket_ingd">
        <i class="bi bi-check2-square animate__animated animate__fadeInDown" id="check_icon"></i>
        <span class="animate__animated animate__fadeInDown">${box1.value}</span></div>`); 
        // console.log( "Name : ", checkedIngdName, "Range :", checkedIngdRange );
    }else{ //check 해제시, 목록에서 삭제
        var index = checkedIngdName.indexOf( box1.value ); //해당 value의 index 배열에서 찾음
        console.log( index );
        $(`.${box1.value}_in`).remove(); //장바구니 목록에서 해당 재료명 삭제

        while( index > -1 ){ //index=0까지 배열에서 해당 value 삭제 
            checkedIngdName.splice( index, 1);
            // checkedIngdRange.splice( index, 1);
            index = checkedIngdName.indexOf( box1.value );
            // console.log( "Name : ", checkedIngdName, "Range :", checkedIngdRange );
        }
    }
}

 // 선택한 식재료 포함된 레시피 SELECT 영은
 function fromFridge(){
    const fridgeList = checkedIngdName.join(",|,");

    axios({
        method : "get",
        url : "/recipe/fromFridge",
        params : {
            fridgeList : fridgeList
        }
    })
 }



//  function checkRecipe(){

//     const checkedName = JSON.stringify(checkedIngdName);
//     const checkedRange = JSON.stringify(checkedIngdRange);

//     localStorage.setItem("fridgeData", checkedName );
//     localStorage.setItem("fridgeRange", checkedRange );

//     const fridgeData = checkedIngdName.join(",|,");
//     const fridgeRange = checkedIngdRange.join(",|,");
//     console.log( fridgeData );
//     console.log( fridgeRange );

//     localStorage.setItem("fridgeData", fridgeData );
//     localStorage.setItem("fridgeRange", fridgeRange );

//     setTimeout(()=>{
//         const fridgeName = localStorage.getItem("fridgeData");
//         const fridgeRange = localStorage.getItem("fridgeRange");
//         console.log( "fD :", JSON.parse(fridgeName) );
//         console.log( "fR :", JSON.parse(fridgeRange) );
//         console.log( "fD 2 :", JSON.parse(localStorage.getItem("fridgeData")) );
//         console.log( "fR 2 :", JSON.parse(localStorage.getItem("fridgeRange")) );
//         console.log( typeof localStorage.getItem("fridgeData") );
//         console.log( typeof localStorage.getItem("fridgeRange") );

//         console.log( "fD :", localStorage.getItem("fridgeData") );
//         console.log( "fR :", localStorage.getItem("fridgeRange") );
//     }, 3000)

//     fromFridge( checkedIngdName, checkedIngdRange );
//  }

