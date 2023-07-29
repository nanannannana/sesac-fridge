document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  axios({
    method: "get",
    url: "/api/v1/mypage/chart",
    params: {
      fresh_ingredients_categories: form.fresh_ingredients_categories.value,
      cooked_dishes_categories: form.cooked_dishes_categories.value,
    },
  })
    .then((res) => {
      const { data } = res.data;
      new Chart(document.getElementById("fresh_ingredients_categories"), {
        type: "polarArea",
        data: {
          labels: Object.keys(data.fresh_ingredients_categories),
          datasets: [
            {
              label: "count",
              data: Object.values(data.fresh_ingredients_categories),
            },
          ],
        },
        options: { responsive: false },
      });

      let randomColor = {
        backgroundColor: [],
        borderColor: [],
      };
      for (_ in data.cooked_dishes_categories) {
        let r = Math.floor(Math.random() * (255 + 1));
        let g = Math.floor(Math.random() * (255 + 1));
        let b = Math.floor(Math.random() * (255 + 1));
        randomColor.backgroundColor.push(
          `rgba(${r + "," + g + "," + b + "," + 0.2})`
        );
        randomColor.borderColor.push(`rgba(${r + "," + g + "," + b})`);
      }
      new Chart(document.getElementById("cooked_dishes_categories"), {
        type: "bar",
        data: {
          labels: Object.keys(data.cooked_dishes_categories),
          datasets: [
            {
              label: "count",
              data: Object.values(data.cooked_dishes_categories),
              barThickness: 100,
              backgroundColor: randomColor.backgroundColor,
              borderColor: randomColor.borderColor,
              borderWidth: 0.3,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 10,
            },
          },
        },
      });
    })
    .catch(() => alert("[Error] 서버 오류가 발생했습니다. 다시 시도해주세요."));
});
