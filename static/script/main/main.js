// 유통기한 지난 식재료 DB에서 삭제 & 알림
let user_name = "<%=user_name%>"
function deleteAlert(user_name, exp_count){  
  axios({
    method : "delete",
    url : "/deleteAlert",
  }).then((res)=>{
    let len = res.data.list.length;
    console.log("list :", res.data.list);
    //알림창 생성
    Swal.fire({
      html: `
      <h3 class="mb-2">${user_name}님,</h3>
      <div class="mb-2"><mark>${res.data.list}</mark>의</div> 
      <div class="mb-2">유통기한이 지나 삭제되었습니다</div>
      <small>냉장고를 확인해주세요</small>
      `,
      icon :'warning',
      confirmButtonText : '확인',
      confirmButtonColor: '#7E998F'
    })
  })
}

// function fridgeList(){
//   axios({
//     method : "post",
//     url : "/fridgeList"
//   }).then((res)=>{
//     let fresh_len = res.data.freshList.length;
//     let frozen_len = res.data.frozenList.length;
//     localStorage.setItem("username", res.data.username);

//     for(i=0; i< fresh_len; i++){
//       localStorage.setItem( `${res.data.freshList[i].fresh_name}_fridge`, "fresh" );
//       localStorage.setItem( `${res.data.freshList[i].fresh_name}_range`, `${res.data.freshList[i].fresh_range}` );
//     }
//     for(j=0; j< frozen_len; j++){
//       localStorage.setItem( `${res.data.frozenList[j].frozen_name}_fridge`, "frozen" );
//       localStorage.setItem( `${res.data.frozenList[j].frozen_name}_range`, `${res.data.frozenList[j].frozen_range}` );
//     }
//   })
// }

function welcomeToast( user_name, count ){
  if( Number(count)>0 ){
    let html = `<p id="p1">${user_name}님🌱</p><p id="p2" style="display: inline-block; margin:0 0 5px 0;">유통기한이 임박한 식재료</p><b style="color:var(--btn-warn);'"> ${count}개</b><p style="display: inline-block; margin:0;">가 기다리고 있어요 !</p>`;
    Swal.fire({
      html: html,
      target: '#custom-target',
      customClass: {
        container: 'position-absolute'
      },
      toast: true,
      position: 'top-right',
      showConfirmButton : false,
    })
  }
  // else{
  //   let html = `<p>${name}님🌱</p> 반갑습니다 !`;
  //   Swal.fire({
  //     html: html,
  //     target: '#custom-target',
  //     customClass: {
  //       container: 'position-absolute'
  //     },
  //     toast: true,
  //     position: 'top-right',
  //     showConfirmButton : false,
  //   })
  // }
}