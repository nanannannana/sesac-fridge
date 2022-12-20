function phone_num_hyphen(target) {
    if (target!=="") {
        $("#phone_num").removeClass("is-invalid");
    }
    target.value = target.value
     .replace(/[^0-9]/g, '')
     .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
}
function id_click(target) {
    if (target!=="") {
        $("#user_id").removeClass("is-invalid");
    }
}
function pw_click(target) {
    if (target!=="") {
        $("#user_pw").removeClass("is-invalid");
    }
}
function pw_check_click(target) {
    if (target!=="") {
        $("#user_pw_check").removeClass("is-invalid");
    }
}
function name_click(target) {
    if (target!=="") {
        $("#user_name").removeClass("is-invalid");
    }
}

// 아이디 이메일 유효성 검사
function id_check() {
    var user_id = document.getElementById("form_signup").user_id.value;
    var id_check = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (user_id == "" || id_check.test(user_id)==false) {
        $("#user_id").addClass("is-invalid");
    } else if(id_check.test(user_id)) {
        axios({
            method: "post",
            url:"/idCheck",
            data: {user_id: user_id}
        })
        .then(function(res) {
            if (res.data) {
                Swal.fire({
                    icon: 'success',
                    title: '사용 가능한 이메일 입니다.',
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '중복된 이메일 입니다!',
                    text: "다른 이메일을 사용해 주세요.",
                });
            }
        })
    }
}

// 회원가입
function signup() {
    var form = document.getElementById("form_signup");
    var id_check = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    var pw_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    var name_check = /^[a-zA-Z가-힣]{2,10}$/;
    var phone_check = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (form.user_id.value=="" || id_check.test(form.user_id.value)==false) {
        $("#user_id").addClass("is-invalid");
    } else if(form.user_pw.value=="" || pw_check.test(form.user_pw.value)==false) {
        $("#user_pw").addClass("is-invalid");
    } else if(form.user_pw_check.value=="" || form.user_pw.value!==form.user_pw_check.value) {
        $("#user_pw_check").addClass("is-invalid");
    } else if(form.user_name.value=="" || name_check.test(form.user_name.value)==false) {
        $("#user_name").addClass("is-invalid");
    } else if (form.user_phone.value=="" || phone_check.test(form.user_phone.value)==false) {
        $("#phone_num").addClass("is-invalid");
    } else {
        axios({
            method: "post",
            url: "/signupUpdate",
            data: {
                user_id: form.user_id.value,
                user_pw: form.user_pw.value,
                user_name: form.user_name.value,
                user_phone: form.user_phone.value.replace(/-/g, '')
            }
        })
        .then(function(res) {
            if (res.data) {
                Swal.fire({
                    icon: 'success',
                    title: '회원가입을 완료했습니다!',
                    text: '버튼을 누르면 메인페이지로 이동합니다.'
                });
                location.href="/signIn";
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '중복된 이메일 입니다!',
                    text: '다른 이메일을 사용해 주세요.'
                });
            }
        })
    }
}