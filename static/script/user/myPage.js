document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form_hidden');
  axios({
    method: 'post',
    url: '/myPage/chart',
    data: {
      fresh_category: form.fresh_category.value,
      cook_tag: form.cook_tag.value,
    },
  }).then(function (res) {
    // chart1_labels 내용 넣기
    // 냉장고 카테고리 값 無: 임의의 값 넣기, 有: 해당 카테고리 값 넣기
    const chart1_labels =
      res.data[0][0] !== '' ? [...new Set(res.data[0])] : ['none'];
    //냉장고 속 재료 개수 확인
    // 냉장고 카테고리 값 無: 임의의 값 넣기, 有: 중복되는 카테고리명을 합친 뒤 개수와 함께 딕셔너리 형태로 넣기
    let ingd_count = {};
    if (res.data[0][0] !== '') {
      res.data[0].forEach(function (x) {
        ingd_count[x] = (ingd_count[x] || 0) + 1;
      });
    } else {
      ingd_count = {
        none: 0,
      };
    }
    //chart1 정리
    const chart1_data = {
      labels: chart1_labels,
      datasets: [
        {
          label: '냉장고 속 재료',
          data: Object.values(ingd_count),
        },
      ],
    };
    const chart1_config = {
      type: 'polarArea',
      data: chart1_data,
      options: {
        responsive: false,
      },
    };
    const myChart = new Chart(
      document.getElementById('myChart'),
      chart1_config
    );

    //chart2_labels에 내용 넣기
    // 최근에 한 요리에 관한 값 無: 임의의 값 넣기, 有: 최근에 한 요리에 관한 카테고리 값 넣기
    const chart2_labels =
      res.data[1][0] !== '' ? [...new Set(res.data[1])] : ['none']; //문자열 중복 제거
    // Color 랜덤 지정
    let Color = [];
    if (res.data[1][0] !== '') {
      for (var k = 0; k < res.data[1].length; k++) {
        var RGB_1 = Math.floor(Math.random() * (255 + 1));
        var RGB_2 = Math.floor(Math.random() * (255 + 1));
        var RGB_3 = Math.floor(Math.random() * (255 + 1));
        var strRGBA = 'rgba(' + RGB_1 + ',' + RGB_2 + ',' + RGB_3 + ')';
        Color.push(strRGBA);
      }
    }
    //recipe_tag 개별 수
    let recipe_tag_count = {};
    if (res.data[1][0] !== '') {
      res.data[1].forEach(function (x) {
        recipe_tag_count[x] = (recipe_tag_count[x] || 0) + 1;
      });
    } else {
      recipe_tag_count = {
        none: 0,
      };
    }
    console.log(Object.values(recipe_tag_count));
    //chart2 정리
    const chart2_data = {
      labels: chart2_labels,
      datasets: [
        {
          label: '최근에 한 요리 카테고리별 차트',
          data: Object.values(recipe_tag_count),
          barThickness: 100,
          backgroundColor: Color,
          borderColor: Color,
        },
      ],
    };
    const chart2_config = {
      type: 'bar',
      data: chart2_data,
      options: {
        responsive: false,
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
      },
    };
    const myChart2 = new Chart(
      document.getElementById('myChart2'),
      chart2_config
    );
  });
});
