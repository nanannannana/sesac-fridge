function wishlist_del(recipe_id) {
  axios({
    method: "delete",
    url: "/api/v1/mypage/wishlist",
    data: { recipe_id },
  })
    .then(function (res) {
      const { data } = res.data;
      $("#wishlist_card_box_child").remove();
      $("#wishlist_card_box").append(
        `<div id="wishlist_card_box_child"></div>`
      );
      if (!data.length) {
        $("#wishlist_card_box_child").append(`
              <div id="none_box">
                  <img src="/static/img/wishlist_none.png">
              </div>
              `);
      } else {
        for (var i = 0; i < data.length; i++) {
          $("#wishlist_card_box_child").append(`
                  <div id="card_size" class="card mb-4 me-3">
                      <img src="${data[i]["recipe.recipe_img"]}" class="card-img" alt="recipe_img">
                      <div id="card_hover" class="card-img-overlay">
                          <i id="heart_icon" class="bi bi-heart-fill" type="button" onclick="wishlist_del(${data[i]["recipe.recipe_id"]}, this)"></i>
                          <div id="card_text_box">
                              <h1 id="card_text" class="card-title">${data[i]["recipe.recipe_title"]}</h1>
                              <h5 id="card_text" class="card-text" type="button" onclick="window.open('${data[i]["recipe.recipe_url"]}')" target="_blank">레시피 보기</h5>
                          </div>
                      </div>
                  </div>
                  `);
        }
      }
    })
    .catch(() => alert("[Error] 서버 오류가 발생했습니다. 다시 시도해주세요."));
}
