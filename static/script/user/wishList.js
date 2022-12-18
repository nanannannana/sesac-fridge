function wishlist_del() {
    var form = document.getElementById("form_hidden");
    axios({
        method: "delete",
        url: "/myPage/wishListDel",
        data: {recipe_id: form.recipe_id.value}
    })
    .then(function() {
        $("#heart_icon").removeClass("bi-heart-fill");
        $("#heart_icon").addClass("bi-heart");
    })
}