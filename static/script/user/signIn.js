function signin() {
    var form = document.getElementById("form_signin");
    var data = {
        user_id: form.user_id.value,
        user_pw: form.user_pw.value
    };
    if (form.user_id.value == "") {
        axios({
            method: "post",
            url: "/signinFlag",
            data: {flag_false: "false"}
        })
        .then(function() {
            swal("아이디 빈칸 안 됨", "빈칸 노", "warning");
        })
    } else if (form.user_pw.value == "") {
        axios({
            method: "post",
            url: "/signinFlag",
            data: {flag_false: "false"}
        })
        .then(function() {
            swal("비밀번호 빈칸 안 됨", "빈칸 노", "warning");
        })
    } else {
        axios({
            method: "post",
            url: "/signinFlag",
            data: data
        })
        .then(async function() {
            await swal("Good job!", "You clicked the button!", "success");
            location.href="/";
        })
    }

}