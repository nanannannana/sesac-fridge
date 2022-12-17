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