function signup() {
    var form = document.getElementById("form_signup");
    var data = {
        user_id: form.user_id.value,
        user_pw: form.user_pw.value,
        user_name: form.user_name.value,
        user_phone: form.user_phone.value
    };
    axios({
        method: "post",
        url: "/signup",
        data: data
    })
    .then(async function() {
        await swal("Good job!", "You clicked the button!", "success");
        location.href="/signin";
    })
}