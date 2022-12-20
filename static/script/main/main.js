
// document.addEventListener("DOMContentLoaded", () => {
//     new TypeIt("#title")
//       .pause(1000) // 1초
//       .delete(5, { delay: 1000 })
//       .type("Jihyang")
//       .go();
//   });

function modalCheck(){
  axios({
      method : 'post',
      url : '/modalCookie'
  })
}



