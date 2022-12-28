//빈 냉장고 알림 처음 한번만 보여지게 - EMPTYcookie ,영은
function emptyAlert(fridgeName){
    Swal.fire({
        title: `${fridgeName}이 비었어요`,
        text : '식재료를 보관하고 냉장고 집사를 사용해보세요',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        confirmButtonText : '확인',
        confirmButtonColor: '#7E998F'
    }).then((result)=>{
      if(result.isConfirmed){ emptyAlertCookie(); } //확인 클릭시 알림 Cookie 생성
    })
}

// 빈 냉장고 알림 Cookie
function emptyAlertCookie(){
    axios({
        method : "post",
        url : "/myFridge/"
    })
}

// let deleteArr = ["크림치즈","쿠키","복숭아","치킨너겟"];

// function deleteTest(){
//   for(i=0; i<deleteArr.length; i++){
//     console.log( `${localStorage.getItem( deleteArr[i] + '_fridge')}`);

//     if( `${localStorage.getItem( deleteArr[i] + '_fridge')}`=="fresh" ){
//       deleteInFresh( deleteArr[i] );
//       console.log( "fresh: ", deleteArr[i]);
//     }else{ 
//       deleteInFrozen( deleteArr[i] ); 
//       console.log( "frozen :", deleteArr[i]);
//     }
//   }
// }

// function deleteInFresh( name ){ // fresh 테이블에서 삭제
//   console.log( "freshname", name )
//   axios({
//       method : "delete",
//       url : "/myFridge/deleteInFresh",
//       data : { name : name }
//   })
// }
// function deleteInFrozen( name ){ // frozen 테이블에서 삭제
//   axios({
//       method : "delete",
//       url : "/myFridge/deleteInFrozen",
//       data : { name : name }
//   })
// }  
