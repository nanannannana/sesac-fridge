$(function(){
    $(".grid").masonry({
    columnWidth: 70,
    itemSelector: '.grid-item',
    });

})
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