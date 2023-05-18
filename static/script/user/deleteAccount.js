function info_del() {
  axios({
    method: "delete",
    url: "/user",
  }).then(function () {
    localStorage.clear();
    Swal.fire({
      icon: "success",
      title: "회원 탈퇴가 완료되었습니다!",
      showConfirmButtom: true,
      confirmButtonText: "확인",
      confirmButtonColor: "#7E998F",
      preConfirm: () => {
        location.href = "/";
      },
    });
  });
}
