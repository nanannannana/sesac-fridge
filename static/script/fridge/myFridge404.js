//확인 클릭시 메인으로 이동
window.onload = function fridgeAlert(){
    Swal.fire({
        title: '로그인 후 이용해주세요',
        confirmButtonColor: '#7E998F',
        allowOutsideClick : false,
        preConfirm : ()=>{
            window.location.href="/signIn";
        }
    });
}