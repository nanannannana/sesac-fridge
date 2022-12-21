function myfridge_go() {
    var myfridge_go = document.getElementById("myfridge_go");
    myfridge_go.submit();
}

function mypage_go() {
    var mypage_go = document.getElementById("mypage_go");
    mypage_go.submit();
}

function signout_go() {
    axios({
        method: "post",
        url: "/signOut"
    })
    .then(function() {
        location.href="/";
    })
}