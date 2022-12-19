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
function cooking(ingred){
    swal.fire({
        title: ingred,
        text: "You clicked the button!",
        icon: "success",
        button: "Aww yiss!",
    });
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