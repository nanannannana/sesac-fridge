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
            swal("이메일 또는 비밀번호를 입력해주세요.","", "warning");
        })
    } else {
        axios({
            method: "post",
            url: "/signinFlag",
            data: data
        })
        .then(async function(res) {
            if (res.data) {
                await swal("로그인에 성공하였습니다!", "버튼을 누르면 메인페이지로 이동합니다", "success");
                location.href="/";
            } else {
                await swal("로그인에 실패하였습니다!", "아이디 또는 비밀번호를 다시 입력해주세요.", "error");
            }

        })
    }

}