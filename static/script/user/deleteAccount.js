function delete_account() {
  axios({
    method: "delete",
    url: "/api/v1/user",
  })
    .then(() => {
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
    })
    .catch((error) => alert(`${error.message}`));
}
