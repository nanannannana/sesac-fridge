// 필터 클릭시 페이지 이동
function selectFilter(filter) {
    location.href="/recipe?tag=" + filter;
}

// 최근 본 레시피 클릭 시 log 테이블에 추가
function insertLog(id, url) {
    let recipe_id = id;
    axios({
        method : "post",
        url : "/recipe/insertToLog",
        data : { id : recipe_id },
    }).then((res)=>{
        location.href=url;
    })
}

// 빈 하트 클릭 시 recipe_like 테이블에 추가
function insertLike(element, id) {
    let recipe_id = id;
    axios({
        method : "post",
        url : "/recipe/insertToLike",
        data : { id : recipe_id },
    }).then((res)=>{
        $(element).closest("h5").css('display', 'none');
        $(element).closest("button").append(
            ` <h5><i class="bi bi-balloon-heart-fill"></i>
            </h5>`
        )
    })
}


// 전역변수 let inputcnt, const checkbox
let inputcnt = 0;  // 전역변수로 설정해서 input 태그 개수 가져오기(input radiobox가 여러개일 때)

// 요리하기 버튼을 누르면 뜰 alert 창
// 식재료가 하나인 경우 [1]
// 식재료가 여러개인 경우 [2]
// 식재료가 없는 경우 [3]
async function cooking(data, range){
    // 넘어온 문자열로 짜르고 ingArr에 넣기(여러개일 경우를 대비해)
    let ingArr = data.split(",");    // 식재료
    let rangeArr = range.split(","); // 식재료 비율
    let rangeData = rangeArr.map((i) => Number(i));

    // 식재료가 하나인 경우
    if(ingArr.length === 1) { 
        // sweet alert
        const steps = ['1', '2']
        const swalQueueStep = Swal.mixin({
            confirmButtonText: '확인',
            cancelButtonText: '뒤로',
            progressSteps: steps,
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            showCloseButton: true,
            allowEnterKey : true,
            validationMessage: '사용할 재료를 선택해주세요 :('
        })
        async function backAndForth() {
            const values = [];
            let currentStep;
            let resultData = [];      // 한 개의 식재료 보낼 배열

            for (currentStep = 0; currentStep < steps.length;) {
                if (steps[currentStep] == 1) { 
                    var result = await swalQueueStep.fire({
                        title: '사용할 식재료를 선택해주세요!',
                        // inputValue: values[currentStep],
                        input : 'checkbox',
                        inputPlaceholder : `${ingArr[0]}`,
                        showCancelButton: currentStep > 0,
                        currentProgressStep: currentStep,
                    })
                    // 확인 버튼을 누르면 식재료 사용하는 걸로 간주하고 -50 차감
                    if(result) {
                        resultData.push(`${ingArr[0]}`)
                        resultData.push(`${rangeData[0]}`-50)
                    }
                } else if (steps[currentStep] == 2) { 
                    var result = await swalQueueStep.fire({
                        title: '요리를 하고 냉장고에 재료가 남는다면 체크해주세요!',
                        inputValue: values[currentStep],
                        input : 'radio',
                        inputOptions : {
                            'true': '남아요',
                            'false': '안남아요',
                        },
                        inputValidator : (result) => {
                            if(!result) {
                                return "한 개는 꼭 골라주세요! :("
                            }
                        },
                        showCancelButton: currentStep > 0,
                        currentProgressStep: currentStep,
                    })
                    if(result) {// 남으면 => rangeData가 50이면 그대로 유지, 0이면 +50 
                        if(result.value === 'true' && resultData[1] === 0) {
                            var lastidx = resultData[1];
                            resultData.pop();            
                            resultData.push(lastidx+50);  
                        }else if(result.value === 'false'){  // 안남으면 => rangeData를 0으로
                            var lastidx = resultData[1];
                            resultData.pop();
                            resultData.push(lastidx-50);
                            console.log("resultData: ", resultData);
                        } 
                    }
                } else  break; 
            
                if (result.value) {
                    values[currentStep] = result.value
                    currentStep++
                } else if (result.dismiss === 'cancel') {
                    currentStep--
                    checkboxArr.splice(0) // 뒤로가기버튼 누르면 배열 요소 모두 삭제
                    resultData.splice(0) 
                } else break;
               
                if (currentStep === steps.length) {
                    if(resultData[1] === 50) {
                        var result = Swal.fire({
                            title : `냉장고에 ${resultData[0]} 이/가 남았습니다 
                                    \n 다른 레시피에도 사용할 수 있어요! :)` 
                        })
                    }else if(resultData[1] === 0) {
                        var result = Swal.fire({
                            title : `냉장고에서 ${resultData[0]} 이/가 없어집니다
                                    \n 다른 레시피에서 사용할 수 없어요! :(`
                        })
                    }
                    updateToFridge(resultData);
                }
            }
        }
        backAndForth();

    }else if(ingArr.length > 1){  // 식재료가 여러개인 경우
        // 일치하는 식재료 checkbox들
        let input = "";
        for(var i=0; i<ingArr.length; i++){
            input += `<input type='checkbox' id="${[ingArr[i]]}" title="${rangeData[i]}"
                         value="${ingArr[i]}" onclick="checkIngd(this)"/>
                      <label for="${ingArr[i]}">&nbsp;${ingArr[i]}</label>&nbsp;&nbsp;&nbsp;`;
        }
        
        // sweet alert
        const steps = ['1', '2']
        const swalQueueStep = Swal.mixin({
            confirmButtonText: '확인',
            cancelButtonText: '뒤로',
            showCancelButton: true,
            progressSteps: steps,
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            showCloseButton: true,
            allowEnterKey : true,
        })
        async function backAndForth() {
            const values = [];
            let currentStep;
            let resultData = [];      // 첫 번째 단계에서 체크박스로 구분할 배열
            let radioResultData = []; // 두 번째 단계에서 여러 식재료를 백엔드로 보낼 배열

            for (currentStep = 0; currentStep < steps.length;) {
                if (steps[currentStep] == 1) { 
                    var result = await swalQueueStep.fire({
                        title: '사용할 식재료를 선택해주세요!',
                        inputValue: values[currentStep],
                        html : input,
                        showCancelButton: currentStep > 0,
                        currentProgressStep: currentStep,
                        allowEnterKey : true,
                        showCloseButton: true,
                        preConfirm: () => {
                            //라디오 버튼 체크 여부 
                            let cnt = 0; // 체크박스 확인할 변수

                            // 배열안에서 모든 체크박스가 checked가 안됐을때(false일 때), cnt++
                            for(var i=0;i<ingArr.length;i++){
                                if(!document.getElementById(`${ingArr[i]}`).checked){
                                    cnt++;
                                } 
                            }
                            if(cnt == ingArr.length) { 
                                Swal.showValidationMessage("사용할 재료를 선택해주세요 :(")
                            }
                        }
                    })
                    // 확인 버튼을 누르면 체크된 값 가져와서 -50 하고 객체를 배열안에 넣기
                    if(result) {
                        let resultObj = {};
                        for(var i=0;i<=checkboxArr.length*2;i++) {
                            resultObj = {
                                "name" :  checkboxArr[0],
                                "range": Number(checkboxArr[1])-50
                            }
                                resultData.push(resultObj);
                                checkboxArr.splice(0,2);
                        }
                        console.log("백에 보내는 데이터: ", resultData); 
                    }
                } else if (steps[currentStep] == 2) { 
                    let radio = "";
                    let cnt = 0;
                    for(var i=0; i<resultData.length; i++){
                        inputcnt ++;
                        cnt ++;
                        radio +=`${[resultData[i].name]} 이/가
                                <input type='radio' name="${resultData[i].name}" value="${resultData[i].range}"
                                id="radio1" title="${cnt}" onclick="checkRadio(this, ${cnt})"/>&nbsp;남아요

                                <input type='radio'  name="${resultData[i].name}" value="${resultData[i].range}"
                                id="radio2" title="${cnt}" onclick="checkRadio(this, ${cnt})"/>&nbsp;안남아요<br><br>`;
                    }
                    
                    var result = await swalQueueStep.fire({
                        title: '요리를 하고 냉장고에 재료가 남는다면 체크해주세요!',
                        inputValue: values[currentStep],
                        html : radio,
                        showCancelButton: currentStep > 0,
                        currentProgressStep: currentStep,
                        allowEnterKey : true,
                        showCloseButton: true,
                        preConfirm: () => {
                            //라디오 버튼 체크 여부 
                            let falsechk = 0;
                            let truechk = 0;
                            // 배열안에서 모든 라디오버튼이 checked가 안됐을때 alert창 띄우기
                            // 배열안에서 하나라도 라디오 버튼이 체크 안되면 alert창 띄우기
                            for(var i=0;i<resultData.length;i++){
                                if(!$(`input[type=radio][name=${resultData[i].name}]:checked`).is(':checked')){
                                    falsechk++;
                                }else if($(`input[type=radio][name=${resultData[i].name}]:checked`).is(':checked')){
                                    truechk++;
                                }
                            }
                            if(falsechk == resultData.length || truechk < resultData.length) { 
                                Swal.showValidationMessage("모두 꼭 골라주세요! :(")
                            }
                        }
                    })
                        
                    if(result) { // 백으로 보내는 데이터 처리 (radioArr)
                        let resultObj = {};   // 백으로 보낼 데이터를 객체로 변환
                        
                        for(var i=0;i<radioArr.length*2;i++) {
                            resultObj = {
                                "name" : radioArr[0],
                                "range" : Number(radioArr[1]),
                            }
                            radioResultData.push(resultObj);
                            radioArr.splice(0,2);
                        }
                        // console.log("백에 보내는 데이터: radioResultData ", radioResultData); 
                    }
                } else  break; 
            
                if (result.value) {
                    values[currentStep] = result.value
                    currentStep++
                } else if (result.dismiss === 'cancel') {
                    currentStep--
                    checkboxArr.splice(0) // 뒤로가기버튼 누르면 배열 요소 모두 삭제
                    radioArr.splice(0)
                    resultData.splice(0)
                } else break;
                
                if (currentStep === steps.length) {
                    let remain = "";  // 남는 식재료 이름 넣을 변수
                    let left = "";    // 없어지는 식재료 이름 넣을 변수

                    for(var i=0; i<radioResultData.length; i++) {
                        if(radioResultData[i].range === 50) { // 
                            remain += `${radioResultData[i].name}` + " ";
                        }else if(radioResultData[i].range === 0) { 
                            left += `${radioResultData[i].name}` + " ";
                        }
                    }
                    if(remain) { // 남는 재료가 있을 때
                         var result = Swal.fire({
                            title : `냉장고에 ${remain} 이/가 남았습니다.
                                    \n 다른 레시피에도 사용할 수 있어요! :)`,
                            showCloseButton: true,
                            allowEnterKey : true,
                        })                        
                    }if(left) { // 남는 재료가 없을 때
                        var result = Swal.fire({
                            title : `냉장고에서 ${left} 이/가 없어집니다.
                                    \n 다른 레시피에서 사용할 수 없어요! :( `,
                            showCloseButton: true,
                            allowEnterKey : true,
                        }) 
                    }if(remain && left) { // 남는 재료도 있고, 없어지는 재료도 있을 때
                        var result = Swal.fire({
                            title : `냉장고에서 ${left} 이/가 없어지고, 
                                    \n ${remain} 이/가 남았습니다.
                                    \n 냉장고에서 재료 현황을 볼 수 있어요!`,
                            showCloseButton: true,
                            allowEnterKey : true,
                        }) 
                    }
                    updateToFridge(radioResultData);
                }
            }
        }
        backAndForth();
        
    }else if(ingArr[0] == ""){  // 식재료가 없는 경우
        swal.fire({
            title : "냉장고에 있는 식품과 일치하는 재료가 없어 차감될 식재료가 없습니다. :)",
            confirmButtonText : "확인",
            showCancelButton : true,
            showCloseButton: true,
            allowEnterKey : true,
            focusConfirm : false,
        })
    }
}

// 요리하기 버튼을 클릭했을 때 checked 된 것의 재료이름과 수량 갖고오기
let checkboxArr = []; // 전역변수로 설정해서 체크박스에 체크 했을 때 참고
function checkIngd(htmlTag) {
    if(htmlTag.checked == true) {
        checkboxArr.push(htmlTag.value);
        checkboxArr.push(htmlTag.title);
        console.log(checkboxArr);
    }else { // 
        var idx = checkboxArr.indexOf(htmlTag.value); // 해당 클릭한 이름의 idx를 배열에서 찾고,
        checkboxArr.slice(idx, idx+1);

        while(idx > -1 ) { // idx=0부터 배열에서 해당 idx의 name,range 삭제
            checkboxArr.splice(idx, 2);
            idx = checkboxArr.indexOf(htmlTag.value);
            console.log(checkboxArr);
        }
    }
}

// 라디오버튼의 checked 된 것의 재료이름과 수량 갖고오기
let radioArr = []; // 전역변수로 설정해서 라디오버튼에 체크했을 때 참고
function checkRadio(htmlTag, cnt) {
    // inputcnt 초기화 하는거 잊지말기!!

    for(var i=1;i<=inputcnt;i++){      // for문으로 input 개수 만큼 for문 돌리기 
        if(cnt == i) {                 // input 순서대로 (첫 번째 input => cnt 1)
            if(htmlTag.checked) {      // 라디오 버튼이라 항상 check 됨
                if(htmlTag.id == "radio1") { // 남아요 버튼일 때 => range가 50이면 그대로 유지, 0이면 +50
                    radioArr.push(htmlTag.name); // 체크했을 때 무조건 name은 radioArr안에
                    if(htmlTag.value == 50) radioArr.push(htmlTag.value);
                    else radioArr.push(htmlTag.value+50);
                    chkvalue(htmlTag.name);
                }else if(htmlTag.id == "radio2") { // 안남아요 버튼일 때(DB에서 삭제)
                    radioArr.push(htmlTag.name); // 체크했을 때 무조건 name은 radioArr안에
                    if(htmlTag.value == 50) radioArr.push(htmlTag.value-50);
                    else radioArr.push(htmlTag.value);
                    chkvalue(htmlTag.name);
                }
            }
        } 
    }
    // console.log("radioArr: ", radioArr);

    // name이 중복되면 삭제, 최초입력이면 무조건 length와 idx 2차이
    // 삭제 되는 경우는 length와 idx의 차이가 2보다 클 때 무조건 삭제
    function chkvalue (name){
        let idx = radioArr.indexOf(name); 
        if(radioArr.length-idx > 2){
            radioArr.splice(radioArr.indexOf(name), 2);
        }
    }
}

// 수정을 위한 체크한 정보 fresh와 frozen DB로 전송
function updateToFridge(result){
    let data = {}
    // 재료가 한 개일 때 {name : , range : }
    if(typeof result[0] === 'string') {
        data = {
            name : result[0],
            range : result[1],
            result : "one"
        }
    }
    // 재료가 여러 개일 때 ([{name : , range : },{}])
    if(typeof result[0] === 'object') data = result

    axios({
        method : "patch",
        url : "/recipe/toFridge",
        data : data
    }).then((res)=>{
        console.log("res.data : ", res);
    })
}



// for(var i=0;i<length;i++){
//     $(".row").append(`
//         <div class="card_parent col-md-3">
//             <div class="card">
//                 <div class="img_time">
//                     <img src="${data[i].recipe_img}" class="recipe_img img-fluid rounded">
//                     <div class="card-img-overlay d-flex justify-content-between">
//                     <span class="time">
//                         <i class="bi bi-alarm"></i>&nbsp;
//                         "${data[i].recipe_time}"
//                     </span>
//                     <button type="button" class="btn btns">
//                         ${data[i].recipe_pick == 0 ? 
//                             `<h5><i class="bi bi-balloon-heart" 
//                              onclick="insertLike(${this}, "${data[i].recipe_id}")">
//                             </i></h5>`:
//                             `<h5><i class="bi bi-balloon-heart-fill"></i></h5>`
//                         }
//                   </button>
//                 </div>
//             </div>
//             <div class=name_ingd p-3">
//                 <div class="d-flex justify-content-between align-items-center">
//                     <h5>"${data[i].recipe_title}"</h5>
//                 </div>
//                 <div class="d-flex justify-content-between align-items-center pt-2">
//                     <span>
//                         <i class="fas fa-regular fa-bowl-food"></i>&nbsp;
//                         "${data[i].recipe_ingd}"
//                     </span>
//                 </div>cd 
//             </div>
//             <div class="btn_outer mt-3 mb-3">
//                 <div class="btn_inner text-center p-1">
//                     <button type="button" class="btn show_recipe"
//                     onclick="insertLog("${data[i].recipe_id}", "${data[i].recipe_url}")">레시피보기</button>
//                     <button type="button" class="btn show_cook">요리하기</button>
//                     <h5 onclick="func();">함수실행</h5>  
//                 </div>
//             </div>
//         </div>
//     `)
// }


// const $cardParent = get(".card-parent");
// const $cards = getAll(".card");

// const CREATE_CARD_COUNT = 4;
// let cardImageNumber = 0;

// const io = new IntersectionObserver(ioObserver, {
//     threshold : 1,
// });

// function get(htmlElem) {
//     return document.querySelector(htmlElem);
// }

// function getAll(htmlElem) {
//     return document.querySelector(htmlElem)
// }

// function makeCard() {
//     if (cardImageNumber >= 12) cardImageNumber = 0;
//     for (let i = cardImageNumber; i < cardImageNumber + 4; i++) {
//         $(".row").append(`
//         <div class='col-md-3 card_parent'>
//             <div class='card'>
//                 <div class='img_time'>
//                     <img src='${"<%=data[i].recipe_img%>"}'>
//                     <div class='card-img-overlay d-flex justify-content-between">
//                         <span class='time'>
//                             <i class='bi bi-alarm'></i>&nbsp;
//                             ${"<%=data[i].recipe_time%>"}
//                         </span>
//                         <button type='button' class='btn'>
//                             <h5><i class='bi bi-balloon-heart'></i></h5>
//                         </button>
//                     </div>
//                 </div>
//                 <div class='name_imgd p-3'>
//                     <div class='d-flex justify-content-between align-items-center'>
//                         <h5>${"<%=data[i].recipe_title%>"}</h5>
//                     </div>
//                     <div class='d-flex justify-content-between align-items-center pt-2'>
//                         <span>
//                             <i class='fas fa-regular fa-bowl-food'></i>&nbsp;
//                             ${"<%=data[i].recipe_ingd%>"}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div class='btn_outer mt-3 mb-3'>
//                 <div class='btn_inner text-center p-1'>
//                     <input type='button' class='btn show_recipe' 
//                     onclick='insertLog(${"<%data[i].recipe_id%>"}, ${"<%=data[i].recipe_url%>"})'
//                     value='레시피보기'>
//                     <input type='button' class='btn show_cook' value='요리하기'>
//                 </div>
//             </div>
//         </div>`)
//     }
//     cardImageNumber += 4;
// }

// function ioObserver(entries) {
//     entries.forEach((entry) => {
//         const { target } = entry;

//         if(entry.isInterescting) {
//             io.unobserve(target);
//             loading();
//         }
//     })
// }

// function observeLastCard(io, cards) {
//     const lastItem = cards[cards.length-1];
//     io.observe(lastItem);
// }

// function init() {
//     observeLastCard(io, $cards);
// }

// init();