function info_del() {
    var form = document.getElementById("form_hidden");
    axios({
        method: "delete",
        url: "/myPage/profile/myInfoDel",
        data: {
            user_id: form.user_id.value
        }
    })
    .then(async function() {
        await Swal.fire({
            icon: "success",
            title: "회원 탈퇴가 완료되었습니다!",
            text: "돌아와~"
        });
        location.href="/signUp";
    })
}