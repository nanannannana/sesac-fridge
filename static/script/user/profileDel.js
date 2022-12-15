function profile_del() {
    axios({
        method: "delete",
        url: "/myPage/profileDel"
    })
    .then(async function() {
        await swal("Good job!", "You clicked the button!", "success");
        location.href="/";
    })
}