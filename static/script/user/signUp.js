// 아이디 이메일 유효성 검사
function id_check() {
    var user_id = document.getElementById("form_signup").user_id.value;
    var id_check = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (user_id == "" || id_check.test(user_id)==false) {
        axios({
            method: "post",
            url: "/idCheck",
            data: {user_id:"none"}
        })
        .then(function() {
            swal("이메일을 정확히 입력하세요", "1", "error");
        })
    } else if(id_check.test(user_id)) {
        axios({
            method: "post",
            url:"/idCheck",
            data: {user_id: user_id}
        })
        .then(function(res) {
            if (res.data) swal("사용가능한 이메일 입니다", "사용 가능", "success");
            else swal("중복된 이메일 입니다", "사용 불가", "warning");
        })
    }
}

function signup() {
    var form = document.getElementById("form_signup");
    var id_check = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    var pw_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    var name_check = /^[a-zA-Z가-힣]{2,10}$/;
    var phone_check = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (id_check.test(form.user_id.value)==false || form.user_id.value=="") {
        axios({
            method: "post",
            url: "/signupflag",
            data: {false: "none"}
        })
        .then(function(res) {
            if (res.data) swal("이메일의 양식을 맞춰주세요!", "warning!", "warning")
            else swal("중복된 이메일 입니다", "warning!", "warning");
        })
    } else if(pw_check.test(form.user_pw.value)==false || form.user_pw.value=="") {
        axios({
            method: "post",
            url: "/signupflag",
            data: {false: "none"}
        })
        .then(function(res) {
            swal("비밀번호의 양식을 맞춰주세요!", "warning!", "warning");
        })
    } else if(name_check.test(form.user_name.value)==false || form.user_name.value=="") {
        axios({
            method: "post",
            url: "/signupflag",
            data: {false: "none"}
        })
        .then(function(res) {
            swal("이름을 정확히 입력해주세요!", "warning!", "warning");
        })
    } else if(phone_check.test(form.user_phone.value)==false || form.user_phone.value=="") {
        axios({
            method: "post",
            url: "/signupflag",
            data: {false: "none"}
        })
        .then(function(res) {
            swal("전화번호 정확히 입력해주세요!", "warning!", "warning");
        })
    } else {
        axios({
            method: "post",
            url: "/signupflag",
            data: {
                user_id: form.user_id.value,
                user_pw: form.user_pw.value,
                user_name: form.user_name.value,
                user_phone: form.user_phone.value
            }
        })
        .then(async function(res) {
            if (res.data) await swal("회원가입을 완료했습니다!", "success!", "success")
            else swal("중복된 이메일 입니다", "사용 불가", "warning");
            location.href="/signIn";
        })
    }
}