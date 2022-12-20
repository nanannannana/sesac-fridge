function myfridge_go() {
    var myfridge_go = document.getElementById("myfridge_go");
    myfridge_go.submit();
}

function mypage_go() {
    var mypage_go = document.getElementById("mypage_go");
    mypage_go.submit();
}
function signIn_signOut() {
    axios({
        method: "post",
        url: "/signOut"
    })
    .then(function() {
        location.href="/";
    })
}

const remember_me_flag = document.getElementById("remember_me_flag");
// is_remember_me가 0이면, 세션이 죽을 때 같이 로그아웃됨
// is_remember_me가 1이면, 세셕이 죽어도 로그아웃이 되지 않음.