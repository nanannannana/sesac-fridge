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
  if (target !== "") {
    $("#user_pw").removeClass("is-invalid");
  }
}
function pw_ck_click(target) {
  if (target !== "") {
    $("#user_pw_ck").removeClass("is-invalid");
  }
}
function name_click(target) {
  if (target !== "") {
    $("#user_name_ck").removeClass("is-invalid");
  }
}

function info_update() {
  var form = document.getElementById("form_info");
  var pw_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
  var name_check = /^[a-zA-Z가-힣]{2,10}$/;
  var phone_check = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  // 비밀번호를 수정 안 하고 update를 하는 경우,
  if (form.user_pw_new.value == "") {
    if (!form.user_name.value || !name_check.test(form.user_name.value)) {
      $("#user_name_ck").addClass("is-invalid");
    } else if (
      !form.user_phone.value ||
      !phone_check.test(form.user_phone.value)
    ) {
      $("#phone_num").addClass("is-invalid");
    } else {
      axios({
        method: "patch",
        url: "/myPage/profile/myInfo",
        data: {
          user_id: form.user_id.value,
          user_pw: form.user_pw_now.value,
          user_name: form.user_name.value,
          user_phone: form.user_phone.value.replace(/-/g, ""),
        },
      }).then(function () {
        Swal.fire({
          icon: "success",
          title: "회원정보 수정이 완료됐습니다!",
          showConfirmButtom: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#7E998F",
        });
      });
    }
  } else if (form.user_pw_now.value == form.user_pw_new.value) {
    // 새 비밀번호와 현재 비밀번호가 일치하는 경우,
    if (!form.user_pw_new.value || !pw_check.test(form.user_pw_new.value)) {
      $("#user_pw").addClass("is-invalid");
    } else if (
      !form.user_pw_check.value ||
      form.user_pw_new.value !== form.user_pw_check.value
    ) {
      $("#user_pw_ck").addClass("is-invalid");
    } else if (
      !form.user_name.value ||
      !name_check.test(form.user_name.value)
    ) {
      $("#user_name_ck").addClass("is-invalid");
    } else if (
      !form.user_phone.value ||
      !phone_check.test(form.user_phone.value)
    ) {
      $("#phone_num").addClass("is-invalid");
    } else {
      Swal.fire({
        icon: "warning",
        title: "새 비밀번호를 수정해주세요!",
        text: "현재 비밀번호와 새 비밀번호가 일치합니다.",
        showConfirmButtom: true,
        confirmButtonText: "확인",
        confirmButtonColor: "#ED6C67",
      });
    }
  } else {
    // 새 비밀번호로 수정하는 경우,
    if (!form.user_pw_new.value || !pw_check.test(form.user_pw_new.value)) {
      $("#user_pw").addClass("is-invalid");
    } else if (
      !form.user_pw_check.value ||
      form.user_pw_new.value !== form.user_pw_check.value
    ) {
      $("#user_pw_ck").addClass("is-invalid");
    } else if (
      !form.user_name.value ||
      !name_check.test(form.user_name.value)
    ) {
      $("#user_name_ck").addClass("is-invalid");
    } else if (
      !form.user_phone.value ||
      !phone_check.test(form.user_phone.value)
    ) {
      $("#phone_num").addClass("is-invalid");
    } else {
      axios({
        method: "patch",
        url: "/myPage/profile/myInfo",
        data: {
          user_id: form.user_id.value,
          user_pw: form.user_pw_new.value,
          user_name: form.user_name.value,
          user_phone: form.user_phone.value.replace(/-/g, ""),
        },
      }).then(function () {
        Swal.fire({
          icon: "success",
          title: "회원정보 수정이 완료됐습니다!",
          showConfirmButtom: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#7E998F",
        });
      });
    }
  }
}

function info_del() {
  axios({
    method: "post",
    url: "/myPage/profile/myInfoDel",
  }).then(function () {
    var form_info = document.getElementById("form_hidden");
    form_info.submit();
  });
}
