function info_update() {
    var form = document.getElementById("form_info");
    var pw_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    var name_check = /^[a-zA-Z가-힣]{2,10}$/;
    var phone_check = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if(pw_check.test(form.user_pw.value)==false || form.user_pw.value=="") {
        axios({
            method: "post",
            url: "/myPage/profile/myInfoCheck"
        })
        .then(function() {
            Swal.fire({
                icon: 'error',
                title: '비밀번호를 정확히 입력해 주세요!',
                text: '영문, 숫자, 특수문자 중 2가지 조합으로 작성해 주세요.',
            });
        })
    } else if (name_check.test(form.user_name.value)==false || form.user_name.value=="") {
        axios({
            method: "post",
            url: "/myPage/profile/myInfoCheck"
        })
        .then(function() {
            Swal.fire({
                icon: 'error',
                title: '이름을 정확히 입력해 주세요!',
                text: '빈칸 불가, 두 글자 이상으로 작성해 주세요.',
            });
        })
    } else if(form.user_pw_new.value!==form.user_pw_check.value) {
        axios({
            method: "post",
            url: "/myPage/profile/myInfoCheck"
        })
        .then(function() {
            Swal.fire({
                icon: 'warning',
                title: '비밀번호가 일치하지 않습니다!',
                text: '비밀번호를 다시 입력해 주세요.',
            });
        })
    } else if (phone_check.test(form.user_phone.value)==false || form.user_phone.value=="") {
        axios({
            method: "post",
            url: "/myPage/profile/myInfoCheck"
        })
        .then(function() {
            Swal.fire({
                icon: 'error',
                title: '핸드폰 번호를 정확히 입력해 주세요!',
                text: '10~11글자로 입력해 주세요.',
            });
        })
    } else {
        axios({
            method: "patch",
            url: "/myPage/profile/myInfo",
            data: {
                user_id: form.user_id.value,
                user_pw: form.user_pw_new.value,
                user_name: form.user_name.value,
                user_phone: form.user_phone.value
            }
        })
        .then(function() {
            Swal.fire({
                icon: 'success',
                title: '회원정보 수정이 완료됐습니다!'
            });
        })
    }
}

function info_del() {
    axios({
        method: "post",
        url: "/myPage/profile/myInfoDel",
    })
    .then(function() {
        var form_info = document.getElementById("form_hidden");
        form_info.submit();
    })
}