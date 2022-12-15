function pw_confirm() {
    axios({
        method: "post",
        url: "/myPage/profileEdit"
    })
    .then(async function() {
        await swal("Good job!", "You clicked the button!", "success");
        var form = document.getElementById("form_hidden");
        form.submit();
    })
}