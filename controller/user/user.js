const { user } = require("../../model/");
const CryptoJS = require("crypto-js");
const request = require("request");
const axios = require("axios");
const bcrypt = require("bcryptjs");

// 로그인 페이지 렌더링
exports.getSignin = function (req, res) {
  res.render("user/signIn");
};

// 소셜 로그인(Redirect URI)
exports.getKakao = (req, res) => {
  res.render("user/kakaoLogin");
};

// 로그인 확인
exports.postFindUser = async function (req, res) {
  if (req.body.access_token) {
    console.log("소셜 로그인");
    // [1] 소셜 로그인 회원가입/로그인
    const user_id = await user.findOne({
      raw: true,
      attributes: ["user_id"],
      where: { user_id: req.body.user_id },
    });

    if (!user_id) {
      await user.create({
        user_id: req.body.user_id,
        user_pw: "kakao",
        user_name: req.body.nickname,
        user_phone: "",
      });
    }

    req.session.cookie.maxAge = 1 * 24 * 60 * 60 * 1000;
    req.session.user = req.body.user_id;
    req.session.access_token = req.body.access_token;
    req.session.kakao_login = true;

    res.status(200).send(true);
  } else if (req.body.user_id) {
    console.log("일반 로그인");
    // [2] 일반 로그인
    const user_info = await user.findOne({
      raw: true,
      where: { user_id: req.body.user_id },
    });

    // 로그인 성공
    if (user_info && bcrypt.compareSync(req.body.user_pw, user_info.user_pw)) {
      if (req.body.remember_me_check == 1) {
        // 자동 로그인
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30일 유지
        req.session.user = req.body.user_id;
        res.status(200).send(true);
      } else {
        req.session.user = req.body.user_id;
        res.status(200).send(true);
      }
    } else {
      res.status(200).send(false);
    }
  } else {
    res.status(400).send({ message: "bad request" });
  }
};

// 아이디 & 비밀번호 찾기
exports.postFindAccount = async function (req, res) {
  // 아이디 찾기
  if (req.body.user_name) {
    const user_info = await user.findOne({
      raw: true,
      where: {
        user_name: req.body.user_name,
        user_phone: req.body.user_phone,
      },
    });
    if (user_info) {
      res.status(200).send({
        user_id: user_info.user_id,
        user_name: user_info.user_name,
      });
    } else {
      res.status(200).send(false);
    }
  } else {
    // 비밀번호 찾기
    const user_info = await user.findOne({
      raw: true,
      where: {
        user_id: req.body.user_id,
        user_phone: req.body.user_phone,
      },
    });

    if (user_info) {
      const temp_pw = Math.random().toString(36);
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(temp_pw, salt);
      await user.update(
        { user_pw: hash },
        { where: { user_id: req.body.user_id } }
      );

      send_message(user_info, temp_pw);
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  }
};

//메세지 전송(비밀번호)
const send_message = (user_info, temp_pw) => {
  const result_code = 404; // 결과 코드(default: 404)
  const date = Date.now().toString(); // 현재 시간으로 전송
  const uri = process.env.NCP_SENS_ID; //서비스 ID
  const secretKey = process.env.NCP_SENS_SECRET; // Secret Key
  const accessKey = process.env.NCP_SENS_ACCESS; //Access Key
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
        from: "01023085214", //발신번호(NCP에 등록한 번호)
        content: `${user_info.user_name}님의 임시 비밀번호는 ${temp_pw}입니다.`, //문자내용
        messages: [{ to: `${user_info.user_phone}` }],
      },
    },
    (err, res, html) => {
      if (err) console.log(err);
      else {
        result_code = 200;
        console.log(html);
      }
    }
  );
  return result_code;
};

// 회원가입 페이지 렌더
exports.getSignup = function (req, res) {
  res.render("user/signUp");
};

// 아이디 중복 확인
exports.postCheckId = async function (req, res) {
  const user_id = await user.findOne({
    raw: true,
    attributes: ["user_id"],
    where: { user_id: req.body.user_id },
  });
  if (user_id) res.status(200).send(false);
  else res.status(200).send(true);
};

// 회원가입 성공
exports.postCreateUser = async function (req, res) {
  const user_info = await user.findOne({
    where: { user_id: req.body.user_id },
  });

  // 비밀번호 암호화
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.user_pw, salt);

  const user_data = {
    user_id: req.body.user_id,
    user_pw: hash,
    user_name: req.body.user_name,
    user_phone: req.body.user_phone,
  };
  if (user_info) {
    res.status(200).send(false);
  } else {
    await user.create(user_data);
    res.status(200).send(true);
  }
};

// 회원정보 수정
exports.patchUpdateUser = async function (req, res) {
  if (req.body.user_pw) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.user_pw, salt);

    const user_data = {
      user_id: req.body.user_id,
      user_pw: hash,
      user_name: req.body.user_name,
      user_phone: req.body.user_phone,
    };

    await user.update(user_data, {
      where: { user_id: req.session.user },
    });
  } else {
    const user_data = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      user_phone: req.body.user_phone,
    };

    await user.update(user_data, {
      where: { user_id: req.session.user },
    });
  }

  res.status(200).send(true);
};

//로그아웃
exports.getSignOut = async function (req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("sesac_fridge_id").redirect("/");
  });
};

// 회원탈퇴
exports.deleteUser = async (req, res) => {
  if (req.session.access_token) {
    await axios
      .post("https://kapi.kakao.com/v1/user/unlink", null, {
        headers: {
          Authorization: `Bearer ${req.session.access_token}`,
        },
      })
      .then(async (response) => {
        if (response.status == 200) {
          await user.destroy({
            where: { user_id: req.session.user },
          });
          req.session.destroy((err) => {
            if (err) throw err;
          });
          return res.status(200).send(true);
        }
      })
      .catch((err) => console.log(err));
  } else if (req.session.user) {
    await user.destroy({
      where: { user_id: req.session.user },
    });
    req.session.destroy((err) => {
      if (err) throw err;
    });
    return res.status(200).send(true);
  }

  return res.status(400).send(false);
};
