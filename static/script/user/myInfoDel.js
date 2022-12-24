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
        localStorage.clear();
        await Swal.fire({
            icon: "success",
            title: "회원 탈퇴가 완료되었습니다!"
        });
        location.href="/";
    })
}