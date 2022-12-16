
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