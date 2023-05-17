//확인 클릭시 메인으로 이동
window.onload = function fridgeAlert() {
  Swal.fire({
    html: '<h1 style="color:#7E998F;">로그인 후 이용해주세요</h1>',
    width: 600,
    padding: "3em",
    color: "#7E998F",
    background: "#fffbee url(https://sweetalert2.github.io/images/trees.png)",
    backdrop: `
          #fffbee
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `,
    confirmButtonColor: "#7E998F",
    allowOutsideClick: false,
    preConfirm: () => {
      location.href = "/login";
    },
  });
  //       })
  //     Swal.fire({
  //         title: '로그인 후 이용해주세요',
  //         confirmButtonColor: '#7E998F',
  //         allowOutsideClick : false,
  //         preConfirm : ()=>{
  //             window.location.href="/signIn";
  //         }
  //     });
  //          rgba(0,0,123,0.4)
};
