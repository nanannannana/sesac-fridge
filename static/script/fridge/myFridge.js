//빈 냉장고 알림 처음 한번만 보여지게 - EMPTYcookie
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

function emptyAlertCookie(){
    axios({
        method : "post",
        url : "/myFridge/"
    })
}
    
