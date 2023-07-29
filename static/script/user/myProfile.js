function phone_num_hyphen(target) {
  if (target !== "") {
    $("#phone_num").removeClass("is-invalid");
  }
  target.value = target.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
    .replace(/(\-{1,2})$/g, "");
}
// input창 클릭 시 validate문구 없어지게 하는 함수
function pw_click(target) {
  if (target) {
    $("#user_pw").removeClass("is-invalid");
  }
}
function check_pw_click(target) {
  if (target) {
    $("#check_user_pw").removeClass("is-invalid");
  }
}
function name_click(target) {
  if (target) {
    $("#check_user_name").removeClass("is-invalid");
  }
}

function info_update() {
  var form = document.getElementById("form_info");
  var regPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
  var regName = /^[a-zA-Z가-힣]{2,10}$/;
  var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  // 비밀번호 수정 X, 회원정보 Update O,
  if (!form.user_new_pw.value) {
    if (!regName.test(form.user_name.value)) {
      $("#check_user_name").addClass("is-invalid");
    } else if (!regPhone.test(form.user_phone.value)) {
      $("#phone_num").addClass("is-invalid");
    } else {
      axios({
        method: "patch",
        url: "/api/v1/user",
        data: {
          user_name: form.user_name.value,
          user_phone: form.user_phone.value.replace(/-/g, ""),
        },
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "회원정보 수정이 완료됐습니다!",
            showConfirmButtom: true,
            confirmButtonText: "확인",
            confirmButtonColor: "#7E998F",
          });
        })
        .catch(() => {
          alert("[Error] 서버 오류가 발생했습니다. 다시 시도해주세요.");
        });
    }
  } else {
    // 회원정보 수정(비밀번호 포함) O
    if (!form.user_new_pw.value || !regPw.test(form.user_new_pw.value)) {
      $("#user_pw").addClass("is-invalid");
    } else if (
      !form.check_user_pw.value ||
      form.user_new_pw.value !== form.check_user_pw.value
    ) {
      $("#check_user_pw").addClass("is-invalid");
    } else if (!regName.test(form.user_name.value)) {
      $("#check_user_name").addClass("is-invalid");
    } else if (!regPhone.test(form.user_phone.value)) {
      $("#phone_num").addClass("is-invalid");
    } else {
      axios({
        method: "patch",
        url: "/api/v1/user",
        data: {
          user_pw: form.user_new_pw.value,
          user_name: form.user_name.value,
          user_phone: form.user_phone.value.replace(/-/g, ""),
        },
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "회원정보 수정이 완료됐습니다!",
            showConfirmButtom: true,
            confirmButtonText: "확인",
            confirmButtonColor: "#7E998F",
          });
        })
        .catch(() =>
          alert("[Error] 서버 오류가 발생했습니다. 다시 시도해주세요.")
        );
    }
  }
}
