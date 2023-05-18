// window.onload = function() {
//     console.log("게시글 수: ",$("#wishlist_card_box_child").children().length);
//     var post_count = $("#wishlist_card_box_child").children().length;
//     axios({
//         method: "post",
//         url: "wishList",
//         data: {num: post_count}
//     })

//     function renderPagination() {
//         if (post_count <= 9) return;

//     }
// }

// 찜리스트 좋아요 삭제
function wishlist_del(recipe_id, target) {
  var post_num = $("#wishlist_card_box_child").children().length;
  axios({
    method: "delete",
    url: "/mypage/wishlist",
    data: {
      recipe_id: recipe_id,
      num: post_num - 1,
    },
  }).then(function (res) {
    $("#wishlist_card_box_child").remove();
    $("#wishlist_card_box").append(`<div id="wishlist_card_box_child"></div>`);
    if (!res.data.length) {
      $("#wishlist_card_box_child").append(`
            <div id="none_box">
                <img src="/static/img/wishlist_none.png">
            </div>
            `);
    } else {
      for (var i = 0; i < res.data.length; i++) {
        $("#wishlist_card_box_child").append(`
                <div id="card_size" class="card mb-4 me-3">
                    <img src="${res.data[i]["recipe.recipe_img"]}" class="card-img" alt="recipe_img">
                    <div id="card_hover" class="card-img-overlay">
                        <i id="heart_icon" class="bi bi-heart-fill" type="button" onclick="wishlist_del(${res.data[i]["recipe.recipe_id"]}, this)"></i>
                        <div id="card_text_box">
                            <h1 id="card_text" class="card-title">${res.data[i]["recipe.recipe_title"]}</h1>
                            <h5 id="card_text" class="card-text" type="button" onclick="window.open('${res.data[i]["recipe.recipe_url"]}')" target="_blank">레시피 보기</h5>
                        </div>
                    </div>
                </div>
                `);
      }
    }
  });
}
