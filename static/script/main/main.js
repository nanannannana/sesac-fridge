

// 유통기한 지난 식재료 DB에서 삭제 & 알림
function deleteAlert(username, exp_count){  
  axios({
    method : "delete",
    url : "/deleteAlert",
  }).then(()=>{
    //알림창 생성
    Swal.fire({
      html: `<div>${username}님,</div><div>유통기한이 지난 <strong>${exp_count}</strong>개의 재료가 삭제되었어요</div>`,
      icon :'warning',
      confirmButtonText : '확인',
      confirmButtonColor: '#7E998F'
    })
  })
}
