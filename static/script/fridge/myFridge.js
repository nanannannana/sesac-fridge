//빈 냉장고 알림 modal cookie

function emptyAlert(fridgeName){
    Swal.fire({
        title: `${fridgeName} 비었어요`,
        text : '식재료를 보관하고 냉장고 집사를 이용해보세요',
        icon: 'info',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
}

function emptyAlertCookie(){
    axios({
        method : "post",
        url : "/myFridge/"
    })
}
    
