// function myrecipe_go() {
//     var myrecipe_go = document.getElementById("myrecipe_go");
//     myrecipe_go.submit();
// }

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

function wishlist_go(){
    var wishlist_go = document.getElementById("wishlist_go");
    wishlist_go.submit();
}

//navbar mouseover 
$(()=>{
    //recipe tab 
    $("#nav_recipe").mouseover(()=>{
        $("#nr_1").addClass("d_none");
        $("#nr_2").removeClass("hidden");
    })
    $("#nav_recipe").mouseout(()=>{
        $("#nr_1").removeClass("d_none");
        $("#nr_2").addClass("hidden");
    })
    //wishlist tab 
    $("#nav_wishlist").mouseover(()=>{
        $("#nw_1").addClass("d_none");
        $("#nw_2").removeClass("hidden");
    })
    $("#nav_wishlist").mouseout(()=>{
        $("#nw_1").removeClass("d_none");
        $("#nw_2").addClass("hidden");
    })
    //fridge tab 
    $("#nav_fridge").mouseover(()=>{
        $("#nf_1").addClass("d_none");
        $("#nf_2").removeClass("hidden");
    })
    $("#nav_fridge").mouseout(()=>{
        $("#nf_1").removeClass("d_none");
        $("#nf_2").addClass("hidden");
    })
})