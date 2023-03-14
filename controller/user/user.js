const { user } = require("../../model/");
const CryptoJS = require("crypto-js");
const request = require("request");
const axios = require("axios");
const qs = require("qs");
const { fresh } = require("../../model");
const { Op } = require("sequelize");
const env = process.env;
const location = require("location-href");

//global variables
//로그인 시각 기준으로 시간 set
let today = new Date();

let date = new Date(); // 오늘+2일 후
date.setDate(date.getDate() + 2);

let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정

// 소셜 로그인 구현
exports.getSignin = function (req, res) {
  const kakao_auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${env.REST_API_KEY}&redirect_uri=${env.REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,talk_message`;
  res.render("user/signIn", { kakao_auth_url: kakao_auth_url });
};
exports.getKakao = (req, res) => {
  res.render("user/kakaoLogin");
};
exports.kakaoAccess = async (req, res) => {
  // console.log(req.body.code);
  var access_token;
  var userId;
  await axios
    .post(
      "https://kauth.kakao.com/oauth/token",
      `grant_type=authorization_code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&code=${req.body.code}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    )
    .then((res) => {
      access_token = res.data.access_token;
    });

  await axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    .then(async (res) => {
      userId = res.data.kakao_account.email;
      const idFind = await user.findOne({
        raw: true,
        where: { user_id: res.data.kakao_account.email },
      });
      console.log("idFind: ", idFind);
      if (!idFind) {
        await user.create({
          user_id: res.data.kakao_account.email,
          user_pw: "kakao",
          user_name: res.data.kakao_account.profile.nickname,
          user_phone: "",
        });
      }
    });
  res.cookie("user_id", userId, {
    httpOnly: true,
  });
  res.cookie("access_token", access_token, {
    httpOnly: true,
  });
  res.send({ user_id: userId });
};

// 로그인 확인
exports.postSigninFlag = async function (req, res) {
  let result = await user.findOne({
    raw: true,
    where: { user_id: req.body.user_id, user_pw: req.body.user_pw },
  });
  if (result !== null) {
    req.session.user = req.body.user_id;
    const option = {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3일 뒤 자동로그인 설정 만료
    };
    if (req.body.remember_me_check == 1) {
      //로그인O, 자동로그인O
      console.log("자동로그인 선택");
      res.cookie("user_id", req.body.user_id, option); //서버에서 쿠키 생성 => 클라이언트로 보내기
      res.send({
        username: result.user_name,
      });
    } else {
      //로그인O, 자동로그인X
      console.log("자동로그인 미선택");
      res.send({
        username: result.user_name,
      });
    }
  } else {
    //로그인 실패
    res.send(false);
  }
};

//아이디 찾기
exports.postIdFind = async function (req, res) {
  const result = await user.findOne({
    raw: true,
    where: {
      user_name: req.body.user_name,
      user_phone: req.body.user_phone,
    },
  });
  if (result !== null) {
    res.send(result);
  } else {
    res.send(false);
  }
};

//비밀번호 찾기(메세지 보내기) 함수 설정
let send_message = function (result) {
  var user_phone_number = result.user_phone; //수신 전화번호 기입
  var resultCode = 404; // 결과 코드(default: 404)
  const date = Date.now().toString(); // 보내는 시간 기입(지금)
  const uri = env.NCP_SENS_ID; //서비스 ID
  const secretKey = env.NCP_SENS_SECRET; // Secret Key
  const accessKey = env.NCP_SENS_ACCESS; //Access Key
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);
  request(
    {
      method: method,
      json: true,
      uri: url,
      headers: {
        "Contenc-type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: {
        type: "SMS",
        countryCode: "82",
        from: "01023085214", //발신번호기입(NCP에 등록한 번호)
        content: `${result.user_name}님의 비밀번호는 ${result.user_pw}입니다.`, //문자내용 기입
        messages: [{ to: `${user_phone_number}` }],
      },
    },
    function (err, res, html) {
      if (err) console.log(err);
      else {
        resultCode = 200;
        console.log(html);
      }
    }
  );
  return resultCode;
};

exports.postPwFind = async function (req, res) {
  let result = await user.findOne({
    raw: true,
    where: {
      user_id: req.body.user_id,
      user_phone: req.body.user_phone,
    },
  });
  if (result === null) {
    res.send(false);
  } else {
    //비밀번호 찾기 함수 필요한 부분에 넣기
    //유저가 입력한 아이디와 핸드폰 번호가 mysql에 있을 경우, 유저 핸드폰 번호로 비밀번호 메세지 보냄
    send_message(result);
    res.send(true);
  }
};

// 회원가입 페이지 렌더
exports.getSignup = function (req, res) {
  res.render("user/signUp");
};

// 아이디 중복 확인
exports.postIdCheck = async function (req, res) {
  console.log("아이디 중복확인", req.body);
  // let data = {user_id: req.body.user_id};
  let result = await user.findOne({
    raw: true,
    where: { user_id: req.body.user_id },
  });
  console.log("result: ", result);
  if (result !== null) res.send(false);
  else res.send(true);
};

// 회원가입 성공
exports.postSignupUpdate = async function (req, res) {
  let result = await user.findAll({ where: { user_id: req.body.user_id } });
  let data = {
    user_id: req.body.user_id,
    user_pw: req.body.user_pw,
    user_name: req.body.user_name,
    user_phone: req.body.user_phone,
  };
  if (result.length > 0) {
    res.send(false);
  } else {
    await user.create(data);
    res.send(true);
  }
};
//로그아웃
exports.postSignOut = async function (req, res) {
  console.log("토큰확인: ", req.cookies.access_token);
  //쿠키 삭제
  const option = {
    httpOnly: true,
    maxAge: 0,
  };
  res.cookie("user_id", null, option);
  res.cookie("access_token", null, option);
  // 세션 삭제
  req.session.destroy((err) => {
    if (err) throw err;
  });
  if (req.cookies.access_token) {
    res.send({
      REST_API_KEY: env.REST_API_KEY,
      LOGOUT_REDIRECT_URI: env.LOGOUT_REDIRECT_URI,
    });
  } else {
    res.send(true);
  }
};
