// input창 클릭 시 validate문구 없어지게 하는 함수
function pw_click(target) {
  if (target) {
    $("#user_pw").removeClass("is-invalid");
  }
}

// enter key 작동하게 하는 함수
function enter_push() {
  if (window.event.keyCode == 13) {
    document.getElementById("button").click();
  }
}

function pw_confirm() {
  form = document.getElementById("form_pw_confirm");
  if (!form.user_pw.value) {
    $("#user_pw").addClass("is-invalid");
  } else {
    axios({
      method: "post",
      url: "/api/v1/mypage/check-password",
      data: {
        user_pw: form.user_pw.value,
      },
    })
      .then(() => (location.href = "/mypage/profile"))
      .catch((error) => {
        if (error.response.status == 400) {
          $("#user_pw").addClass("is-invalid");
        } else {
          alert("[Error] 서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
      });
  }
}
