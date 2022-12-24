//확인 클릭시 메인으로 이동
window.onload = function fridgeAlert(){
    Swal.fire({
        title: '로그인 후 이용해주세요',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fffbee url(https://sweetalert2.github.io/images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `
      })
    // Swal.fire({
    //     title: '로그인 후 이용해주세요',
    //     confirmButtonColor: '#7E998F',
    //     allowOutsideClick : false,
    //     preConfirm : ()=>{
    //         window.location.href="/signIn";
    //     }
    // });
}