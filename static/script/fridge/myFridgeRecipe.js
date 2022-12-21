
 $(".fridge_ingd_box input[type=range]").attr({ step:50 });
 $(".fridge_ingd_box input[type=range]").addClass("form-range"); 
 $("#basket_arrow").addClass("animate__animated animate__fadeInDown");

 // 선택한 식재료 포함된 레시피 SELECT
 function resultRecipe(){
     axios({
         method : "post",
         url : "/myFridge/resultRecipe",
         data : { checkedIngdList : checkedIngdList }
     }).then((response)=>{
         console.log("result Recipe res.data : ", response.data );
     })
 }

// 선택한 식재료 list 생성
var checkedIngdList = new Array();
function addToList( box1 ){
    if( box1.checked == true ){ //checkbox 클릭 - 배열에 value 추가 
        checkedIngdList.push( box1.value );
        //추가된 재료명 장바구니 아래 목록으로 노출
        $("#basket_ingd_box").append(`
        <div class="${box1.value}_in basket_ingd">
        <i class="bi bi-check2-square animate__animated animate__fadeInDown" id="check_icon"></i>
        <span class="animate__animated animate__fadeInDown">${box1.value}</span></div>`); 
        console.log( checkedIngdList );
    }else{ //check 해제시, 목록에서 삭제
        var index = checkedIngdList.indexOf( box1.value ); //해당 value의 index 배열에서 찾음
        console.log( index );
        $(`.${box1.value}_in`).remove(); //장바구니 목록에서 해당 재료명 삭제

        while( index > -1 ){ //index=0까지 배열에서 해당 value 삭제 
            checkedIngdList.splice( index, 1);
            index = checkedIngdList.indexOf( box1.value );
            console.log( checkedIngdList );
        }
    }
}