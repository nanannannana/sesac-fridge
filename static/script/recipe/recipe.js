// 필터 클릭시 페이지 이동
function selectFilter(filter) {
  location.href = "/recipe?tag=" + filter;
}

// 로그아웃 시 식재료 일치 레시피나 요리하기 버튼 클릭 시
// 또는 냉장고에 식재료가 없을 시 레시피나 요리하기 버튼 클릭 시
function warnAlert(isLogin) {
  if (isLogin === "true") {
    Swal.fire({
      icon: "warning",
      title: "나의 냉장고에 여러 재료를 좀 더\n 추가하고 사용할 수 있습니다 :)",
      showConfirmButton: true,
      confirmButtonColor: "#7E998F",
      allowEnterKey: true,
    });
  } else {
    Swal.fire({
      icon: "warning",
      title: "로그인 후 이용하실 수 있습니다 :)",
      showConfirmButton: true,
      confirmButtonColor: "#7E998F",
      allowEnterKey: true,
    });
  }
}
// 최근 본 레시피 클릭 시 log 테이블에 추가
function insertLog(id, url, login) {
  if (login === "false") {
    // 비로그인 시
    window.open("about:blank").location.href = url;
  } else {
    // 로그인 시
    let recipe_id = id;
    axios({
      method: "post",
      url: "/recipe/insertToLog",
      data: { id: recipe_id },
    }).then((res) => {
      window.open("about:blank").location.href = url;
    });
  }
}

// 빈 하트 클릭 시 recipe_like 테이블에 추가
function insertLike(element, id) {
  let recipe_id = id;
  axios({
    method: "post",
    url: "/recipe/insertToLike",
    data: { id: recipe_id },
  }).then((res) => {
    // 찜리스트에 담겼다고 alert창띄우기
    if (res.data == true) {
      $(element).closest("h5").css("display", "none");
      $(element)
        .closest("button")
        .append(
          ` <h5><i class="bi bi-balloon-heart-fill"></i>
                </h5>`
        );
      Swal.fire({
        icon: "success",
        title:
          "레시피가 찜리스트에 담겼습니다. :-)\n찜 리스트에 가서 확인해주세요. ",
        showConfirmButton: true,
        confirmButtonColor: "#7E998F",
        allowEnterKey: true,
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      Swal.fire({
        icon: "warning",
        title:
          "레시피가 이미 찜리스트에 있습니다.\n찜 리스트에 가서 확인해주세요. ",
        showConfirmButton: true,
        confirmButtonColor: "#7E998F",
        allowEnterKey: true,
      });
    }
  });
}

// 좋아요 삭제 버튼
function deleteLike(element, id) {
  let recipe_id = id;
  axios({
    method: "delete",
    url: "/recipe/deleteFromLike",
    data: { id: recipe_id },
  }).then((res) => {
    if (res.data === 1) {
      Swal.fire({
        icon: "success",
        title: "찜하기가 삭제되었습니다 :-)",
        showConfirmButton: true,
        confirmButtonColor: "#7E998F",
        allowEnterKey: true,
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  });
}

// 전역변수 let inputcnt, const checkbox
let inputcnt = 0; // 전역변수로 설정해서 input 태그 개수 가져오기(input radiobox가 여러개일 때)

// 요리하기 버튼을 누르면 뜰 alert 창
async function cooking(data, range, id) {
  // 넘어온 문자열로 짜르고 ingArr에 넣기(여러개일 경우를 대비해)
  // id는 cooklog 테이블에 넣기 위해서 매개변수로 받는다. (나중에 업데이트 하고 실행할 함수에 변수로)
  let ingArr = data.split(","); // 식재료
  let rangeArr = range.split(","); // 식재료 비율
  let rangeData = rangeArr.map((i) => Number(i));

  let input = "";
  for (var i = 0; i < ingArr.length; i++) {
    input += `<input type='checkbox' id="${[ingArr[i]]}" title="${rangeData[i]}"
                        value="${ingArr[i]}" onclick="checkIngd(this)"/>
                    <label for="${ingArr[i]}">&nbsp;${
      ingArr[i]
    }</label>&nbsp;&nbsp;&nbsp;`;
  }
  // sweet alert
  const steps = ["1", "2"];
  const swalQueueStep = Swal.mixin({
    confirmButtonText: "확인",
    confirmButtonColor: "#7E998F",
    cancelButtonText: "뒤로",
    showCancelButton: true,
    progressSteps: steps,
    inputAttributes: {
      required: true,
    },
    reverseButtons: true,
    showCloseButton: true,
    allowEnterKey: true,
  });
  async function backAndForth() {
    const values = [];
    let currentStep;
    let resultData = []; // 첫 번째 단계에서 체크박스로 구분할 배열
    let radioResultData = []; // 두 번째 단계에서 여러 식재료를 백엔드로 보낼 배열

    for (currentStep = 0; currentStep < steps.length; ) {
      if (steps[currentStep] == 1) {
        // 첫 번째 단계
        var result = await swalQueueStep.fire({
          title: "사용할 식재료를 선택해주세요!",
          inputValue: values[currentStep],
          html: input,
          showCancelButton: currentStep > 0,
          currentProgressStep: currentStep,
          allowEnterKey: true,
          showCloseButton: true,
          preConfirm: () => {
            //라디오 버튼 체크 여부
            let cnt = 0; // 체크박스 확인할 변수

            // 배열안에서 모든 체크박스가 checked가 안됐을때(false일 때), cnt++
            for (var i = 0; i < ingArr.length; i++) {
              if (!document.getElementById(`${ingArr[i]}`).checked) {
                cnt++;
              }
            }
            if (cnt == ingArr.length) {
              Swal.showValidationMessage("사용할 재료를 선택해주세요 :(");
            }
          },
        });
        // 첫 번째 단계에서 백으로 보내는 데이터
        // 확인 버튼을 누르면 체크된 값 가져와서 -50 하고 객체를 배열안에 넣기
        if (result) {
          let resultObj = {};
          for (var i = 0; i <= checkboxArr.length * 6; i++) {
            resultObj = {
              name: checkboxArr[0],
              range: Number(checkboxArr[1]) - 50,
            };
            resultData.push(resultObj);
            checkboxArr.splice(0, 2);
          }
          console.log("checkboxArr.length", checkboxArr.length);
          console.log("첫 번째 단계에서 백에 보내는 데이터: ", resultData);
        }
      } else if (steps[currentStep] == 2) {
        // 두 번째 단계
        let radio = "";
        let cnt = 0;
        for (var i = 0; i < resultData.length; i++) {
          inputcnt++;
          cnt++;
          radio += `${[resultData[i].name]} 이/가
                            <input type='radio' name="${
                              resultData[i].name
                            }" value="${resultData[i].range}"
                            id="radio1" title="${cnt}" onclick="checkRadio(this, ${cnt})"/>&nbsp;남아요

                            <input type='radio'  name="${
                              resultData[i].name
                            }" value="${resultData[i].range}"
                            id="radio2" title="${cnt}" onclick="checkRadio(this, ${cnt})"/>&nbsp;안남아요<br><br>`;
        }

        var result = await swalQueueStep.fire({
          title: "요리를 하고 냉장고에 재료가 남는다면 체크해주세요!",
          inputValue: values[currentStep],
          html: radio,
          showCancelButton: currentStep > 0,
          currentProgressStep: currentStep,
          allowEnterKey: true,
          showCloseButton: true,
          preConfirm: () => {
            //라디오 버튼 체크 여부
            let falsechk = 0;
            let truechk = 0;
            // 배열안에서 모든 라디오버튼이 checked가 안됐을때 alert창 띄우기
            // 배열안에서 하나라도 라디오 버튼이 체크 안되면 alert창 띄우기
            for (var i = 0; i < resultData.length; i++) {
              if (
                !$(`input[type=radio][name=${resultData[i].name}]:checked`).is(
                  ":checked"
                )
              ) {
                falsechk++;
              } else if (
                $(`input[type=radio][name=${resultData[i].name}]:checked`).is(
                  ":checked"
                )
              ) {
                truechk++;
              }
            }
            if (falsechk == resultData.length || truechk < resultData.length) {
              Swal.showValidationMessage("모두 꼭 골라주세요! :(");
            }
          },
        });
      } else break;

      // 방향키 설정
      if (result.value) {
        values[currentStep] = result.value;
        currentStep++;
      } else if (result.dismiss === "cancel") {
        currentStep--;
        checkboxArr.splice(0); // 뒤로가기버튼 누르면 배열 요소 모두 삭제
        radioArr.splice(0);
        resultData.splice(0);
      } else break;

      // 두 번째 단계 완료 후 DB에 데이터 넘기기 위한 함수 실행
      if (currentStep === steps.length) {
        updateToFridge(radioArr, id);
      }
    }
  }
  backAndForth();

  // 식재료가 없는 경우
  if (ingArr[0] == "") {
    swal.fire({
      title:
        "냉장고에 있는 식품과 일치하는 재료가 없어 차감될 식재료가 없습니다. :)",
      confirmButtonText: "확인",
      confirmButtonColor: "#7E998F",
      showCancelButton: true,
      showCloseButton: true,
      allowEnterKey: true,
      focusConfirm: false,
    });
  }
}

// 요리하기 버튼을 클릭했을 때 checked 된 것의 재료이름과 수량 갖고오기
let checkboxArr = []; // 전역변수로 설정해서 체크박스에 체크 했을 때 참고
function checkIngd(htmlTag) {
  if (htmlTag.checked == true) {
    checkboxArr.push(htmlTag.value);
    checkboxArr.push(htmlTag.title);
    console.log(checkboxArr);
  } else {
    //
    var idx = checkboxArr.indexOf(htmlTag.value); // 해당 클릭한 이름의 idx를 배열에서 찾고,
    checkboxArr.slice(idx, idx + 1);

    while (idx > -1) {
      // idx=0부터 배열에서 해당 idx의 name,range 삭제
      checkboxArr.splice(idx, 2);
      idx = checkboxArr.indexOf(htmlTag.value);
      console.log(checkboxArr);
    }
  }
}

// 남는 것 안남는 것 라디오 버튼
// 라디오버튼의 checked 된 것의 재료이름과 수량 갖고오기
let radioArr = []; // 전역변수로 설정해서 라디오버튼에 체크했을 때 참고
function checkRadio(htmlTag, cnt) {
  // inputcnt 초기화는 새로고침 할때마다!

  for (var i = 1; i <= inputcnt; i++) {
    // for문으로 input 개수 만큼 for문 돌리기
    if (cnt == i) {
      // input 순서대로 (첫 번째 input => cnt 1)
      if (htmlTag.checked) {
        // 라디오 버튼이라 항상 check 됨
        if (htmlTag.id == "radio1") {
          // 남아요 버튼일 때 => range가 50이면 그대로 유지, 0이면 +50
          radioArr.push(htmlTag.name); // 체크했을 때 무조건 name은 radioArr안에
          if (htmlTag.value == 50) radioArr.push(htmlTag.value);
          else radioArr.push(htmlTag.value + 50);
          chkvalue(htmlTag.name);
        } else if (htmlTag.id == "radio2") {
          // 안남아요 버튼일 때(DB에서 삭제)
          radioArr.push(htmlTag.name); // 체크했을 때 무조건 name은 radioArr안에
          if (htmlTag.value == 50) radioArr.push(htmlTag.value - 50);
          else radioArr.push(htmlTag.value);
          chkvalue(htmlTag.name);
        }
      }
    }
  }
  // console.log("radioArr: ", radioArr);

  // name이 중복되면 삭제, 최초입력이면 무조건 length와 idx 2차이
  // 삭제 되는 경우는 length와 idx의 차이가 2보다 클 때 무조건 삭제
  function chkvalue(name) {
    let idx = radioArr.indexOf(name);
    if (radioArr.length - idx > 2) {
      radioArr.splice(radioArr.indexOf(name), 2);
    }
  }
}

// 수정을 위한 체크한 정보 fresh와 frozen DB로 전송
function updateToFridge(result, id) {
  // 1. 배열 result를 백단에 보낼 데이터를 객체 배열형태로
  let resultArr = [];
  for (var i = 0; i < result.length * 6; i++) {
    let resultObj = {
      name: result[0],
      range: Number(result[1]),
    };
    resultArr.push(resultObj);
    result.splice(0, 2);
  }
  // 2. 백단에 데이터를 보내기 전에 range가 0이면 delArr에 넣기
  let delArr = resultArr.filter((item) => {
    return item.range === 0;
  });
  // 3. delArr 안에 delMust 요소를 추가해 range가 0일때를 구분
  for (var i = 0; i < delArr.length; i++) {
    delArr[i]["delMust"] = "1";
  }
  // console.log("두 번째 단계에서 백에 보내는 데이터 : ", resultArr);
  axios({
    method: "patch",
    url: "/recipe/toFridge",
    data: resultArr,
  }).then((res) => {
    console.log("res.data : ", res.data);
    if (res.data || res.data == 0 || res.data == 1) {
      Swal.fire({
        icon: "success",
        title: "냉장고에 재료 변동사항이 \n 생겼습니다! :) ",
        showConfirmButton: false,
      });
      insertCookLog(id);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      Swal.fire({
        icon: "warning",
        title: "이상한 오류",
      });
    }
  });
}

// 요리하기 버튼을 누르면 최근 한 요리 cooklog 테이블에 추가
function insertCookLog(id) {
  let recipe_id = id;
  axios({
    method: "post",
    url: "/recipe/insertToCookLog",
    data: { id: recipe_id },
  }).then((res) => {
    console.log("res.data", res.data);
  });
}
