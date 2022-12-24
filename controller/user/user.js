const { user } = require("../../model/");
const CryptoJS = require("crypto-js");
const request = require("request");
const axios = require('axios');
const qs = require('qs');
const { fresh } = require("../../model");
const { Op } = require("sequelize");
const env = process.env;

//global variables
//로그인 시각 기준으로 시간 set
let today = new Date();  
    
let date = new Date(); // 오늘+2일 후
date.setDate( date.getDate()+2 ); 

let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정

// 로그인 페이지 렌더
exports.getSignin = function(req,res) {
    const kakao_auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${env.REST_API_KEY}&redirect_uri=${env.REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,talk_message`
    // kakao_auth_url: kakao_auth_url
    res.render("user/signIn", {
        kakao_auth_url: kakao_auth_url
    });
}

// 간편로그인
exports.kakao_token = async function(req,res) {
     //access토큰을 받기 위한 코드
    let token = await axios({  //token
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
            'Content-type':'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({  // 주소 -> 문자열
            grant_type: 'authorization_code', // 고정값
            client_id: env.REST_API_KEY,
            client_secret: env.CLINET_SECRET_KEY,
            redirect_uri: env.REDIRECT_URI,
            code: req.query.code,
        }) //객체를 string 으로 변환
    })
    console.log("token: ",token.data);
    // token에 access_token이 있는 경우
    if ("access_token" in token.data) {
        const kakao_user = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            } //헤더에 내용을 보고 보내주겠다.
        })
        // kakao 회원 정보 확인
        console.log("user: ",kakao_user.data);
        // kakao로 가입한 회원 이메일, 이름(닉네임) session에 넣기
        req.session.kakao_name = kakao_user.data.kakao_account.profile.nickname;
        req.session.user = kakao_user.data.kakao_account.email;

        // 새 회원인지 기존 회원인지 확인 절차
        let result = await user.findOne({
            raw: true,
            where: {
                user_id: req.session.user
            }
        });
        if (result) { //DB에 user_id가 있으면 main페이지로
            const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
            // console.log("id: ",final_user_id);
             // 임박 식재료 개수
            let fresh_count = await fresh.findAndCountAll({
                where: {
                    fresh_expire : {
                        [Op.gte] : today,
                        [Op.lte] : date
                    },
                    user_user_id : final_user_id               
                },
            })
            // 유통기한 지난 식재료 개수 & list
            let exp_list = await fresh.findAndCountAll({
                where : {
                    fresh_expire : {
                        [Op.lt] : today
                    },
                    user_user_id : final_user_id
                }
            })
            exp_list_arr=exp_list.rows; //global 배열에 유통기한 지난 식재료 목록 담음 
            res.render("main/main", {
                isLogin : true, 
                fresh_count : fresh_count.count,
                exp_count : exp_list.count,
            });
        } else {
            res.redirect("/kakao/info"); //없으면 추가info창으로
        }

        // // 회원가입 완료 -> prompt창(alert-input)에 user_phone 나중에 회원정보 페이지에서 바꿔주세요 -> main화면으로
        // //main 페이지에 필요한 데이터 정리
    } else {
        res.send(false);
    }
}
exports.getKakaoInfo = function(req,res) {
    res.render("user/kakaoInfo");
}
exports.postKakaoInfo = async function(req,res) {
    await user.create({
        user_id: req.session.user,
        user_pw: "hello123$",
        user_name: req.session.kakao_name,
        user_phone: req.body.user_phone
    })
    res.send(true);
}

// 로그인 확인
exports.postSigninFlag = async function(req,res) {
    let result = await user.findAll({where:{user_id:req.body.user_id, user_pw: req.body.user_pw}});
    console.log(req.body);
    if (result.length>0) {
        req.session.user = req.body.user_id;
        const option = {
            httpOnly: true,
            maxAge: 3*24*60*60*1000 //3일 뒤 자동로그인 설정 만료
        };
        // 자동로그인
        if (req.body.remember_me_check==1) {
            res.cookie("user_id",req.body.user_id,option); //서버에서 쿠키 생성 => 클라이언트로 보내기
            res.send({result: true, username: result[0].user_name});
        } else {
            res.send({result: true, username: result[0].user_name});
        }
    } else {
        res.send(false);
    }
}

//아이디 찾기
exports.postIdFind = async function(req,res) {
    let result = await user.findAll({
        where: {
            user_name: req.body.user_name,
            user_phone: req.body.user_phone
        }
    });
    if (result[0]===undefined) {
        res.send("undefined");
    } else {
        res.send(result[0]);
    }
}

//비밀번호 찾기(메세지 보내기) 함수 설정
let send_message = function(result) {
    var user_phone_number = result.user_phone; //수신 전화번호 기입
    var resultCode = 404; // 결과 코드(default: 404)
    const date = Date.now().toString(); // 보내는 시간 기입(지금)
    const uri = env.NCP_SENS_ID; //서비스 ID
    const secretKey = env.NCP_SENS_SECRET;// Secret Key
    const accessKey = env.NCP_SENS_ACCESS;//Access Key
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
    request({
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
        from: "01023085214", //발신번호기입(NCP에 등록한 번호(지향님 번호))
        content: `${result.user_name}님의 비밀번호는 ${result.user_pw}입니다.`, //문자내용 기입
        messages: [
          { to: `${user_phone_number}`, },],
      },
    },
    function (err, res, html) {
        if (err) console.log(err);
        else { resultCode = 200; console.log(html); }
    }
    );
    return resultCode;
  }

exports.postPwFind = async function(req,res) {
    let result = await user.findOne({
        raw: true,
        where: {
            user_id: req.body.user_id,
            user_phone: req.body.user_phone
        }
    });
    if (result===null) {
        res.send("null");
    } else {
        //비밀번호 찾기 함수 필요한 부분에 넣기
        //유저가 입력한 아이디와 핸드폰 번호가 mysql에 있을 경우, 유저 핸드폰 번호로 비밀번호 메세지 보냄
        send_message(result);
        res.send(true);
    }
}

// 회원가입 페이지 렌더
exports.getSignup = function(req,res) {
    res.render("user/signUp");
}

// 아이디 중복 확인
exports.postIdCheck = async function(req,res) {
    // let data = {user_id: req.body.user_id};
    let result = await user.findAll({where:{user_id: req.body.user_id}});
    if (result.length>0) res.send(false)
    else res.send(true);
}

// 회원가입 성공
exports.postSignupUpdate = async function(req,res) {
    let result = await user.findAll({where:{user_id: req.body.user_id}});
    let data = {
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
        user_name: req.body.user_name,
        user_phone: req.body.user_phone
    }
    if (result.length>0) {
        res.send(false);
    } else {
        await user.create(data);
        res.send(true);
    }
}
//로그아웃
exports.postSignOut = function(req,res) {
    //쿠키 삭제
    const option = {
        httpOnly: true,
        maxAge: 0,
    }
    res.cookie("user_id",null,option);
    // 세션 삭제
    req.session.destroy(function(err) {
        if (err) throw err;
        res.send(true);
    })
}
