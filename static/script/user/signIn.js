// 아이디/비밀번호 찾기에서 input창 모두 입력 시 버튼 활성화 되는 함수
window.onload = function() {
    const user_name_click = document.getElementById("user_name");
    const user_pw_click = document.getElementById("phone_num");
    const find_button = document.getElementById("find_button");
    const user_id_click = document.getElementById("user_id_2");
    const user_pw_click_2 = document.getElementById("phone_num_2");
    const find_button_2 = document.getElementById("find_button_2");

    user_name_click.addEventListener('keyup',activeEvent);
    user_pw_click.addEventListener('keyup',activeEvent);
    user_id_click.addEventListener('keyup',activeEvent2);
    user_pw_click_2.addEventListener('keyup',activeEvent2);

    function activeEvent() {
        if (!(user_name_click.value && user_pw_click.value)) {
            find_button.disabled = true;
        } else {
            find_button.disabled = false;
        }
    }
    function activeEvent2() {
        if (!(user_id_click.value && user_pw_click_2.value)) {
            find_button_2.disabled = true;
        } else {
            find_button_2.disabled = false;
        }
    }
}
// 핸드폰 번호 자동 하이픈 생성하는 함수
function phone_num_hyphen(target) {
    target.value = target.value
     .replace(/[^0-9]/g, '')
     .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
}
// input창 클릭 시 validate문구 없어지게 하는 함수
function id_click(target) {
    if (target!=="") {
        $("#user_id").removeClass("is-invalid");
    }
}
function pw_click(target) {
    if (target!=="") {
        $("#user_pw").removeClass("is-invalid");
    }
}

//enter key 누르면 로그인 버튼 클릭되게 하는 함수
function enter_push() {
    if (window.event.keyCode == 13) {
        document.getElementById("button").click();
    }
}

// 로그인 버튼 클릭 시 동작하는 함수
function signin() {
    var form = document.getElementById("form_signin");
    // 자동로그인 선택 시,
    if ($('input:checkbox[id="remember_me_check"]').is(":checked")) {
        var data = {
            user_id: form.user_id.value,
            user_pw: form.user_pw.value,
            remember_me_check: form.remember_me_check.value
        };
    } else { // 자동로그인 미선택
        var data = {
            user_id: form.user_id.value,
            user_pw: form.user_pw.value,
            remember_me_check: "0"
        };
    }
    if (form.user_id.value == "") {
        $("#user_id").addClass("is-invalid");
    } else if(form.user_pw.value == "") {
        $("#user_pw").addClass("is-invalid");
    }else {
        axios({
            method: "post",
            url: "/signinFlag",
            data: data
        })
        .then(async function(res) {
            form.reset();
            if (res.data.result) {
                localStorage.setItem("username", res.data.username);
                Swal.fire({
                    icon: 'success',
                    title: '로그인에 성공하였습니다!',
                    text: "확인을 누르면 메인페이지로 이동합니다.",
                    showConfirmButtom : true,
                    confirmButtonText : '확인',
                    confirmButtonColor: '#7E998F',            
                    preConfirm : ()=>{
                        location.href="/"
                    }
                });
                // location.href="/";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '로그인에 실패하였습니다!',
                    text: "이메일 또는 비밀번호를 다시 입력해주세요.",
                    showConfirmButtom : true,
                    confirmButtonText : '확인',
                    confirmButtonColor: "#ED6C67"
                });
            }

        })
    }

}
// 아이디 찾기 클릭 시 동작하는 함수
function id_find() {
    var form = document.getElementById("form_id_find");
    axios({
        method: "post",
        url: "/idFind",
        data: {
            user_name: form.user_name.value,
            user_phone: form.user_phone.value.replace(/-/g, '')
        }
    })
    .then(function(res) {
        form.reset();
        if (res.data=="undefined") {
            $("#modal_body_text").remove();
            $("#modal_body_box").remove();
            $("#modal_body").append(`
            <div id="modal_body_text">
                <p style="font-size: 20px; font-weight: bold;">이메일을 찾지 못했습니다.</p>
                <button id="button2" type="button" class="btn" onclick="location.href='/signUp'" style="margin-right: 7px;">회원가입 하기</button>
                <button id="button3" type="button" class="btn" data-bs-dismiss="modal">닫기</button>
            </div>
            `)
        } else {
            $("#modal_body_text").remove();
            $("#modal_body_box").remove();
            $("#modal_body").append(`
            <div id="modal_body_box">
                  <p id="modal_2page_text"><span id="res_data_user_name">${res.data.user_name}</span>님의 이메일은</p>
                  <p id="modal_2page_text"><span id="res_data_user_id">${res.data.user_id}</span> 입니다.</span></p>
                  <button id="button2" type="button" class="btn pw_find_btn" data-bs-target="#ModalToggle3" data-bs-toggle="modal">비밀번호 찾기</button>
            </div>
            `)
        }
    })
}
// 비밀번호 찾기 클릭 시 동작하는 함수
function pw_find() {
    var form = document.getElementById("form_pw_find");
    axios({
        method: "post",
        url: "/pwFind",
        data: {
            user_id: form.user_id.value,
            user_phone: form.user_phone.value.replace(/-/g, '')
        }
    })
    .then(function(res) {
        form.reset();
        if (res.data==null) {
            $("#modal_body_text_2").remove();
            $("#modal_body_box_2").remove();
            $("#modal_body_2").append(`
            <div id="modal_body_text_2">
                <p style="font-size: 20px; font-weight: bold;">비밀번호를 찾지 못했습니다.</p>
                <button id="button2" type="button" class="btn" onclick="location.href='/signUp'">회원가입 하기</button>
            </div>
            `)
        } else {
            $("#modal_body_text_2").remove();
            $("#modal_body_box_2").remove();
            $("#modal_body_2").append(`
            <div id="modal_body_box_2">
                <p id="modal_body_box_text">비밀번호가 입력하신 번호로 문자 발송됐습니다!</p>
                <p id="modal_body_box_text">문자를 확인해주시기 바랍니다.</p>
            </div>
            `)
        }
    })
}

Kakao.init('5616297e86dc2afd5a71b0d8d5006554'); //javascript_key
console.log(Kakao.isInitialized()); // sdk초기화여부판단

// function kakao_login() {
//     Kakao.Auth.authorize({
//         redirectUri: "http://localhost:8080/kakao/oauth"
//     })
// }
// function requestUserInfo() {
//     Kakao.API.request({
//         url: "/v2/user/me",
//     })
//     .then(function(res) {
//         alert(JSON.stringify(res));
//     })
//     .catch(function(err) {
//         alert("failed"+JSON.stringify(err));
//     })
// }




// function kakoLogin() {
//     window.Kakao.Auth.login({
//         scope: "profile_nickname,account_email,talk_message",
//         success: function(authObj) { // login 성공
//             console.log(authObj);
//             window.Kakao.API.request({ // 유저 정보 가져오기
//                 url: "/v2/user/me",
//                 success: res => {
//                     const kakao_account = res.kakao_account;
//                     console.log(kakao_account);
//                     axios({
//                         method: "get",
//                         url: "/kakao/info",
//                         params: {
//                             user_id: kakao_account.email,
//                             user_name: kakao_account.profile.nickname
//                         }
//                     })
//                 }
//             }) 
//         }
//     });
// }
