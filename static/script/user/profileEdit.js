function profile_del() {
    axios({
        post: "post",
        url: "myPage/profileDel"
    })
    .then(function(){
        var form = document.getElementById("form_hidden");
        form.submit();
    })
}