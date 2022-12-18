function pw_confirm() {
    form = document.getElementById("form_pw_confirm");
    axios({
        method: "post",
        url: "/myPage/profilePwConfirm",
        data: {
            user_id: form.user_id.value,
            user_pw: form.user_pw.value
        }
    })
    .then(async function(res) {
        if(res.data) {
            var form_info = document.getElementById("form_hidden");
            form_info.submit();
        } else {
            Swal.fire({
                icon: "error",
                title: "비밀번호가 일치하지 않습니다!",
                text: "비밀번호를 다시 입력해 주세요."
            })
        }
    })
}