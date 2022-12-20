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

// 요리하기 버튼을 누르면 alert 창
function cooking(data, range){
    // 넘어온 문자열로 짜르고 ingArr에 넣기(여러개일 경우를 대비해)
    let ingArr = data.split(",");    // 식재료
    let rangeArr = range.split(","); // 식재료 비율
    let rangeData = rangeArr.map((i) => Number(i));

    if(ingArr.length === 1) { // 식재료가 하나인 경우
        swal.fire({
            title : "<span>요리를 하고도 남을 재료가 있다면 적어주시고, \n 만약 그렇지 않다면 확인버튼을 눌러주세요. :)</span>",
            html : `<div class="mb-3"></div>
                <input type="checkbox" id="ingr" title="${ingArr[0]}" value="${rangeData[0]}" />&nbsp;
                <label for="ingr">${ingArr[0]}</label>`,
            confirmButtonText : "확인",
            showCancelButton : true,
            focusConfirm : false,
            preConfirm: () => {
                let ingd_name = Swal.getPopup().querySelector("#ingr").title;
                let ingd_range = Swal.getPopup().querySelector("#ingr").value;

                // 체크박스 체크 여부
                const checkbox = document.querySelector("#ingr");
                if(!checkbox.checked) Swal.showValidationMessage("체크해주세요")
                return {
                    name : ingd_name,
                    range : ingd_range,
                }
            }
        }).then((result)=>{
            if(result.isConfirmed){
                updateToFridge(result);
            }
        })
    }else if(ingArr.length > 1){  // 식재료가 여러개인 경우
        // 일치하는 식재료 checkbox들
        let input = "";
        for(var i=0; i<ingArr.length; i++){
            input += `<input type='checkbox' class="ingd" id="i${[i]}" title="${ingArr[i]}" value="${rangeData[i]}"/>
                      <label for="${ingArr[i]}">${ingArr[i]}</label>&nbsp;&nbsp;`;
        }
        console.log(input);
        swal.fire({
            title : "<span>이 레시피로 요리를 하고도 남을 재료가 있다면 적어주세요 :)</span>",
            html : input,
            confirmButtonText : "확인",
            showCancelButton : true,
            focusConfirm : false,
            preConfirm: () => {
                // 백쪽에 넘겨줄 재료와 비율
                let multiple_ingd = [];
                for(var i=0; i<ingArr.length; i++) {
                    multiple_ingd.push(Swal.getPopup().getElementsByTagName("input")[i].title);
                    multiple_ingd.push(Swal.getPopup().getElementsByTagName("input")[i].value);
                }
                console.log(multiple_ingd);
                
                // 체크박스 체크 여부
                // const checkbox = document.querySelector("input[type=checkbox]");
                // if(!checkbox.checked) Swal.showValidationMessage("체크해주세요")
                // return {
                //     name : ingd_name,
                //     range : ingd_range,
                // }
            }
        })
        
    }else if(ingArr[0] == ""){  // 식재료가 없는 경우
        swal.fire({
            title : "냉장고에 있는 식품과 일치하는 재료가 없어 차감될 식재료가 없습니다. :)",
            confirmButtonText : "확인",
            showCancelButton : true,
            focusConfirm : false,
        })
    }
}

// 수정을 위한 체크한 정보 fresh와 frozen DB로 전송
function updateToFridge(result){
    let data = {
        name : result.value.name,
        range : result.value.range
    }
    axios({
        method : "patch",
        url : "/recipe/toFridge",
        data : data
    }).then((res)=>{
        
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