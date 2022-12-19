// chart2 data 정리
const chart2_labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];
const chart2_data = {
  labels: chart2_labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: [
      "orange",
      "red",
      "purple",
      "orange",
      "lightblue",
    ],
    borderColor: [
      "orange",
      "red",
      "purple",
      "orange",
      "lightblue",
    ],
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};
const chart2_config = {
  type: 'doughnut',
  data: chart2_data,
  options: {}
};

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("form_hidden");
  axios({
    method: "post",
    url: "/myPage/chart",
    data: {
      ingd_name: form.ingd_name.value,
      cook_tag: form.cook_tag.value
    }
  })
  .then(function(res) {
    // chart1_labels 내용 넣기
    const chart1_labels = [...new Set(res.data[0])];
    // Color 랜덤 지정
    const Color = [];
    for (var k=0 ; k<res.data[0].length;k++) {
      var RGB_1 = Math.floor(Math.random() * (255 + 1));
      var RGB_2 = Math.floor(Math.random() * (255 + 1));
      var RGB_3 = Math.floor(Math.random() * (255 + 1));
      var strRGBA = 'rgba(' + RGB_1 + ',' + RGB_2 + ',' + RGB_3 + ')';
      Color.push(strRGBA);
    }
    //냉장고 속 재료 개수 확인
    const ingd_count = {};
    res.data[0].forEach(function(x) {
      ingd_count[x] = (ingd_count[x] || 0)+1;
    });
    //chart1 정리
    const chart1_data = {
      labels: chart1_labels,
      datasets: [{
        label: '냉장고 속 재료',
        backgroundColor: Color,
        borderColor: Color,
        data: Object.values(ingd_count),
      }]
    };
    const chart1_options = {
      // plugins: {
      //   title: {
      //     display: true,
      //     text: "냉장고 속 재료",
      //     fontSize: 30,
      //   }
      // },
      responsive: false
    };
    const chart1_config = {
      type: 'doughnut',
      data: chart1_data,
      options: chart1_options
    };
    const myChart = new Chart(
      document.getElementById('myChart'),
      chart1_config
    );
    //chart2_labels에 내용 넣기
    const chart2_labels = [...new Set(res.data[1])]; //문자열 중복 제거
    //Color 랜덤 지정
    const Color2 = [];
    for (var n=0 ; n<res.data[1].length;n++) {
      var RGB_1 = Math.floor(Math.random() * (255 + 1));
      var RGB_2 = Math.floor(Math.random() * (255 + 1));
      var RGB_3 = Math.floor(Math.random() * (255 + 1));
      var strRGBA = 'rgba(' + RGB_1 + ',' + RGB_2 + ',' + RGB_3 + ')';
      Color2.push(strRGBA);
    }
    //recipe_tag 개별 수
    const recipe_tag_count = {};
    res.data[1].forEach(function(x) {
      recipe_tag_count[x] = (recipe_tag_count[x] || 0)+1;
    });
    //chart2 정리
    const chart2_data = {
      labels: chart2_labels,
      datasets: [{
        label: '최근에 한 요리 카테고리별 차트',
        backgroundColor: Color2,
        borderColor: Color2,
        data: Object.values(recipe_tag_count),
      }]
    };
    const chart2_config = {
      type: 'bar',
      data: chart2_data,
      options: {
        responsive: false
      }
    };
    const myChart2 = new Chart(
      document.getElementById('myChart2'),
      chart2_config
    );
  })
})