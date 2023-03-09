// input창 클릭 시 validate문구 없어지게 하는 함수
function pw_click(target) {
  if (target !== '') {
    $('#user_pw').removeClass('is-invalid');
  }
}

// enter key 작동하게 하는 함수
function enter_push() {
  if (window.event.keyCode == 13) {
    document.getElementById('button').click();
  }
}

function pw_confirm() {
  form = document.getElementById('form_pw_confirm');
  if (form.user_pw.value == '') {
    $('#user_pw').addClass('is-invalid');
  } else {
    axios({
      method: 'post',
      url: '/myPage/profilePwConfirm',
      data: {
        user_id: form.user_id.value,
        user_pw: form.user_pw.value,
      },
    }).then(async function (res) {
      if (res.data) {
        var form_info = document.getElementById('form_hidden');
        form_info.submit();
      } else {
        $('#user_pw').addClass('is-invalid');
      }
    });
  }
}
