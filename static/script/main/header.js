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
        localStorage.removeItem("username");
        location.href="/";
    })
}

//navbar mouseover 
$(document).ready(()=>{
    $("#nav_fridge").mouseover(()=>{
        $("#nav_fridge img").css("opacity","0")
    })

    $("#nav_fridge").mouseout(()=>{
        $("#nav_fridge img").css("opacity","1")
    })
    $("#nav_recipe").mouseover(()=>{
        $("#nav_recipe img").css("opacity","0")
    })

    $("#nav_recipe").mouseout(()=>{
        $("#nav_recipe img").css("opacity","1")
    })
})