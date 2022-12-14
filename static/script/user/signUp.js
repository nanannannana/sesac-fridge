function signup {
    var form = document.getElementById("form_signup");
    var data = {
        user_id: form.user_id.value,
        user_pw: form.user_pw.value,
        user_name: form.user_name.value,
        user_phone: form.user_phone.value
    };
    axios({
        method: "post",
        url: "/signup",
        data: data
    })
    .then(function() {
        Swal.fire({
            icon: 'success',
            title: '회원가입이 완료되었습니다!',
            text: '확인 버튼 클릭 시 로그인 창으로 넘어갑니다.',
            showConfirmButton: true,
            confirmButtonText: 확인,
            timer: 1500
        })
    })
}