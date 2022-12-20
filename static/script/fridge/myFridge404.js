window.onload = function testSwal(){
    Swal.fire({
        title: '로그인 후 이용해주세요',
        confirmButtonColor: '#7E998F',
        allowOutsideClick : false,
        preConfirm : ()=>{
            window.location.href="/";
        }
    });
    // $(".swal2-backdrop-show").attr("style", "background: rgba(0,0,8,.8);");
}