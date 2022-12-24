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

function fridgeList(){
  axios({
    method : "post",
    url : "/fridgeList"
  }).then((res)=>{
    let fresh_len = res.data.freshList.length;
    let frozen_len = res.data.frozenList.length;
    localStorage.setItem("username", res.data.username);

    for(i=0; i< fresh_len; i++){
      localStorage.setItem( `${res.data.freshList[i].fresh_name}_fridge`, "fresh" );
      localStorage.setItem( `${res.data.freshList[i].fresh_name}_range`, `${res.data.freshList[i].fresh_range}` );
    }
    for(j=0; j< frozen_len; j++){
      localStorage.setItem( `${res.data.frozenList[j].frozen_name}_fridge`, "frozen" );
      localStorage.setItem( `${res.data.frozenList[j].frozen_name}_range`, `${res.data.frozenList[j].frozen_range}` );
    }
  })
}

function welcomeToast( name, count ){
  let html = `<p>${name}님🌱</p>유통기한이 임박한 식재료<b style="color:var(--btn-warn);'">${count}개</b>가 기다리고 있어요 !` 
  Swal.fire({
    html: html,
    target: '#custom-target',
    customClass: {
      container: 'position-absolute'
    },
    toast: true,
    position: 'top-right',
    showConfirmButton : false,
    // confirmButtonText : '확인',
    // confirmButtonColor : '#7E998F'
  })
}