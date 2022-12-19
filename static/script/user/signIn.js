function phone_num_hyphen(target) {
    if (target!=="") {
        $("#phone_num").removeClass("is-invalid");
    }
    target.value = target.value
     .replace(/[^0-9]/g, '')
     .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
}
function name_click(target) {
    if (target!=="") {
        $("#user_name").removeClass("is-invalid");
    }
}

function signin() {
    var form = document.getElementById("form_signin");
    var data = {
        user_id: form.user_id.value,
        user_pw: form.user_pw.value
    };
    if (form.user_id.value == "" || form.user_pw.value == "") {
        axios({
            method: "post",
            url: "/signinFlag",
            data: {signin_flag: "false"}
        })
        .then(function() {
            Swal.fire({
                icon: 'warning',
                title: '이메일 또는 비밀번호를 입력해 주세요!'
            });
        })
    } else {
        axios({
            method: "post",
            url: "/signinFlag",
            data: data
        })
        .then(async function(res) {
            if (res.data) {
                await Swal.fire({
                    icon: 'success',
                    title: '로그인에 성공하였습니다!',
                    text: "버튼을 누르면 메인페이지로 이동합니다."
                });
                location.href="/";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '로그인에 실패하였습니다!',
                    text: "이메일 또는 비밀번호를 다시 입력해주세요."
                });
            }

        })
    }

}
function id_find() {
    var form = document.getElementById("form_id_find");
    if (form.user_name.value=="") {
        $("#user_name").addClass("is-invalid");
    } else if(form.user_phone.value=="") {
        $("#phone_num").addClass("is-invalid");
    } else {
        axios({
            method: "post",
            url: "/find",
            data: {
                user_name: form.user_name.value,
                user_phone: form.user_phone.value.replace(/-/g, '')
            }
        })
        .then(function(res) {
            console.log(res.data.user_id);
        })
    }
}
// signup/signin 수정 아이디 비번 찾기 만들기