// 필터 클릭시 페이지 이동
function selectFilter(filter) {
    axios({
        method : "get",
        url : "/recipe/selectFilter",
        params : { tag : filter }
    }).then((res)=> {
        console.log(res.data);
    })
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

// 요리하기 버튼을 누르면 alert창 뜨게 하기 
function cooking(data){
    // 넘어온 배열을 ,로 짜르고 ingArr에 넣기
    let ingArr = data.split(",");
    
    if(ingArr[0] == "") { // 식재료가 없는 경우
        swal.fire({
            title : "냉장고에 있는 식품과 일치하는 재료가 없어 차감될 식재료가 없습니다. :)",
            confirmButtonText : "확인",
            showCancelButton : true,
            focusConfirm : false,
        })
    }else if(ingArr.length ==1) { // 식재료가 하나인 경우
        swal.fire({
            title : "<span<이 레시피로 요리를 하고도 남을 재료가 있다면 적어주세요 :)</span>",
            html : `<form>"
            //     <input type="text" class="swal2-input" id="freshName_inp"><br>
            //     <div id="tfIngdRange" style="margin:1em;">아직 사용하거나 먹지 않았어요</div>
            //     <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
            //     class="swal2-range" id="freshRange_inp" value=100 step=50
            //     oninput="window.changeRange(this.value);"><br>
            // </form>`,
            confirmButtonText : "확인",
            showCancelButton : true,
            focusConfirm : false,
        })
    }else if(ingArr.length > 1) { // 식재료가 여러개인 경우
        // ingArr.forEach((item)=>{
        //     ingred.push(item);
        // })
        console.log(ingArr);
    }
    // if(ingArr.length == 1) { // 식재료가 하나일 경우
    //     console.log(ingArr);
    // }else if(ingArr.length > 1) { // 식재료가 여러개일 경우
    //     ingArr.forEach((item)=>{
    //         ingred.push(item);
    //     })
    //     console.log(ingArr);
    // }
    let html = "<span<이 레시피로 요리를 하고도 남을 재료가 있다면 적어주세요 :)</span>";
    // for(var i=0;i<ingArr.length;i++){
    //     html += `<input type='checkbox' value=${ingred[i]}/>`;
    //     console.log(html);
    // }
    // swal.fire({
    //     title: ingred + "이 차감됩니다.",
    //     html: 
    //     cook += "<span>이 레시피로 요리를 하고도 남을 재료가 있다면 적어주세요 :)</span>"
    //    "<form>"
        //     <input type="text" class="swal2-input" id="freshName_inp"><br>
        //     <div id="tfIngdRange" style="margin:1em;">아직 사용하거나 먹지 않았어요</div>
        //     <input type="range" style="width:70%; margin-top:0; cursor: pointer;" 
        //     class="swal2-range" id="freshRange_inp" value=100 step=50
        //     oninput="window.changeRange(this.value);"><br>
        // </form>
        
        // `,
        // confirmButtonText : '확인',
        // showCancelButton : true,
        // focusConfirm : false,
    // });
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