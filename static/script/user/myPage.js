document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  axios({
    method: "get",
    url: "/mypage/chart",
    params: {
      fresh_ingredients_category: form.fresh_ingredients_category.value,
      cooked_dishes_category: form.cooked_dishes_category.value,
    },
  }).then((res) => {
    new Chart(document.getElementById("fresh_ingredients_category"), {
      type: "polarArea",
      data: {
        labels: Object.keys(res.data.fresh_ingredients_category),
        datasets: [
          {
            label: "count",
            data: Object.values(res.data.fresh_ingredients_category),
          },
        ],
      },
      options: { responsive: false },
    });

    let randomColor = {
      backgroundColor: [],
      borderColor: [],
    };
    for (_ in res.data.cooked_dishes_category) {
      let r = Math.floor(Math.random() * (255 + 1));
      let g = Math.floor(Math.random() * (255 + 1));
      let b = Math.floor(Math.random() * (255 + 1));
      randomColor.backgroundColor.push(
        `rgba(${r + "," + g + "," + b + "," + 0.2})`
      );
      randomColor.borderColor.push(`rgba(${r + "," + g + "," + b})`);
    }
    new Chart(document.getElementById("cooked_dishes_category"), {
      type: "bar",
      data: {
        labels: Object.keys(res.data.cooked_dishes_category),
        datasets: [
          {
            label: "count",
            data: Object.values(res.data.cooked_dishes_category),
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
  });
});
