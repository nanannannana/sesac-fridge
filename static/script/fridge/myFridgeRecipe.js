
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
    if( box1.checked == true ){
        checkedIngdList.push( box1.value );
        $("#basket_ingd_box").append(`
        <div class="${box1.value}_in basket_ingd">
        <i class="bi bi-check2-square animate__animated animate__fadeInDown" id="check_icon"></i>
        <span class="animate__animated animate__fadeInDown">${box1.value}</span></div>`);
        console.log( checkedIngdList );
    }else{
        var index = checkedIngdList.indexOf( box1.value );
        console.log( index );
        $(`.${box1.value}_in`).remove();

        while( index > -1 ){
            checkedIngdList.splice( index, 1);
            index = checkedIngdList.indexOf( box1.value );
            console.log( checkedIngdList );
        }
    }
}