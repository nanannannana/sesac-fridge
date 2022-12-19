function wishlist_del(recipe_id, target) {
    axios({
        method: "delete",
        url: "/myPage/wishListDel",
        data: {recipe_id: recipe_id}
    })
    .then(function(res) {
        $("#heart_icon").removeClass("bi-heart-fill");
        $("#heart_icon").addClass("bi-heart");
        $("#wishlist_card_box_child").remove();
        $("#wishlist_card_box").append(`<div id="wishlist_card_box_child"></div>`);
        for (var i=0; i<res.data.recipe_id.length;i++) {
            $("#wishlist_card_box_child").append(`
                    <div id="card_size" class="card mb-4 me-3">
                        <img src="${res.data.recipe_img[i]}" class="card-img" alt="...">
                        <div id="card_hover" class="card-img-overlay">
                            <i id="heart_icon" class="bi bi-heart-fill" type="button" onclick="wishlist_del(${res.data.recipe_id[i]}, this)"></i>
                            <form id="form_hidden">
                                <input type="hidden" name="recipe_id" value="${res.data.recipe_id[i]}">
                            </form>
                            <div id="card_text_box">
                                <h1 id="card_text" class="card-title">${res.data.recipe_title[i]}</h1>
                                <h5 id="card_text" class="card-text" type="button" onclick="location.href='${res.data.recipe_url[i]}'" target="_blank">레시피 보기</h5>
                            </div>
                        </div>
                    </div>
        `)};
    })
}