// $(function(){
//     // init Masonry
//     var $grid = $('.grid');
//     $grid.imagesLoaded(()=>{
//         $grid.masonry({
//             columnWidth: '.grid-item',
//             itemSelector: '.grid-item',
//             gutter: 10,
//             horizontalOrder: true,
//             transitionDuration: '0.2s',
//         });
//     });

//     window.onscroll = () => {
//         if((window.innerHeight + window.scrollY >= document.body.offsetHeight)) {
//             alert("바닥");
//             $grid.masonry("appended", "<h1>추가추가</h1>", true);
//         }
//     }

    // window.onscroll = () => {
    //     // window height + window scrollY 값이 document height보다 클 때,
    //     if((window.innerHeight + window.scrollY >= document.body.offsetHeight)) {
    //         console.log("바닥");
    //         // for(var i=0; i<6; i++){
    //             let addContent = "<div class='grid-item'>";
    //             addContent += "<img src='https://recipe1.ezmember.co.kr/cache/recipe/2016/10/19/92c7f040e2595e5504b027a28f74959d1_m.jpg'>";
    //             addContent += "<div class='title'>제목이 들어갈 자리입니다.</div></div>";
    //         // }
    //         // $(".grid").append(addContent);
    //         $grid.append(addContent).masonry('appended', addContent, 'reload');
    //     }
    //     // if($(window).scrollTop()+200 >= $(document).height() - $(window).height){
    //     //     alert("바닥");
    //     // }
    // }

 
    // window.onscroll = function(e) {
    //     if($(window).scrollTop()+200>=$(document).height() - $(window).height()){
    //         console.log("바닥");
    //         if(!isFetching){
    //             isFetching=true;
    //             $("#loading").css("display","block");
    //             console.log(isFetching);
    //             logLists(); // 콘텐츠 추가
    //         }
    //     }
    // };
    

// })
// let msnry = new Masonry( '.grid', {
//     itemSelector: '.grid-item',
//     columnWidth: 200,
//     gutter : 20,
// });

// imagesLoaded( '.grid' ).on( 'progress', function() {
//     msnry.layout();
// });


// function zeroFill(sVal, nCnt){ // zeroFill(값, 채울갯수)
// 	var zero = '';
// 	var ret  = sVal.toString();
// 	if(nCnt > 100) return sVal; // 100개 이상 채울 수 없음;;
// 	for(var i=0 ; i < nCnt-ret.length ; i++){
// 		zero += '0';
// 	}
// 	return zero + ret;
// }

// // 83개의 이미지를 생성
// for(var i=1; i<=83; i++){
// 	// 이미지 이름은 bg_01.jpg 같은 숫자 증가 형태
// 	$('.wrap').append('<img src="https://biketago.com/img/bg_thumb/bg_' + zeroFill(i, 2) + '.jpg">');
// }

// // wrap 클래스안의 모든 이미지가 로딩되면 masonry 적용
// $imgs = $('.wrap').imagesLoaded(function(){
// 	$imgs.masonry({
// 		itemSelector : 'img', // img 태그를 대상으로 masonry 적용
// 		fitWidth : true // 내용물을 가운데 정렬하기, CSS margin:0 auto; 설정이 필요함
// 	});
// });