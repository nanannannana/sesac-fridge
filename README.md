# 🌱<a href="http://15.164.224.195:8080/">새싹 냉장고</a>
> 간편하게 식재료를 관리할 수 있도록 도와주며, 이를 기반으로 다양한 레시피를 추천해주는 서비스
* 급하게 장을 봐야 할 때 간편하게 냉장고 식재료 현황을 확인할 수 있으면 좋겠다는 생각에서 시작된 서비스입니다. 이 서비스는 냉장고과 냉동고를 구분하여 식재료를 관리하며, 유통기한이 지난 재료는 알림으로 사용자에게 알려줌으로써, 사용자가 냉장고 속 식재료 현황을 쉽게 파악할 수 있도록 개발하였습니다. 또한 냉장고 식재료를 기반으로 한 맞춤형 레시피 추천과 정확도 검색 기능을 제공하여, 사용자가 보유한 식재료를 최대한 활용하면서 맛있는 요리를 할 수 있도록 개발하였습니다.

<br>

<div align="center">
   
   ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
   ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white)
   ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
   ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
   ![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
   
   ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)
   ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white)
   ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
   ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jQuery&logoColor=white)
   ![BootStrap](https://img.shields.io/badge/BootStrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
   
</div>

<br>
<br>

## ⭐️ 주요 기능 
* 냉장고에 식재료 추가, 수정 및 삭제
* 유통기한 경과, 임박 식재료 알림 및 경과 식재료 자동 삭제
* 냉장고 식재료 기반 맞춤형 레시피 추천 제공
* 레시피에 사용된 냉장고 식재료 자동 변경
* 회원관리 CRUD 및 소셜 로그인(카카오) 제공
* 냉장고 식재료 현황 및 레시피 좋아요 기능 제공

<br>
<br>
<br>

## ⭐️ ERD
<img width="1233" alt="fridgeDB" src="https://github.com/nanannannana/nanannannana/assets/114964102/534e3cf0-8846-49f1-b157-f750e0c20cce">

#### ❖ 총 7개 테이블

|user|fresh|frozen|recipe|recipe_like|log|cooklog|
|---|---|---|---|---|---|---|
|사용자TB|냉장실TB|냉동실TB|크롤링 한 레시피TB|좋아요 한 레시피TB|최근에 본 레시피TB|최근에 한 요리TB|
* user 테이블은 5개 테이블(fresh, frozen, recipe_like, log, cooklog)의 FK이며 1:N관계
* recipe 테이블은 3개의 테이블(recipe_like, log, cooklog)의 FK이며 1:N관계

<br>
<br>
<br>

## ⭐️ 담당 기능
* Sequelize ORM을 이용해 CRUD 구현
* Cookie & Session을 사용한 자동로그인 구현
* NCP(Naver Cloud Platform)의 SMS API를 사용한 사용자 비밀번호 발송
* REST API를 사용하여 소셜 로그인(kakao) 구현
* AWS EC2를 사용하여 배포
* 정규표현식을 사용한 아이디 중복 및 유효성 검사 기능 구현(form-validation)
* BootStrap을 이용한 반응형 웹 구현

<br>
<br>
<br>

## ⭐️ 디렉토리 구조
```bash
├── README.md
├── package-lock.json
├── package.json
├── node_modules
├── .env
├── app.js (node 실행 최상위 js)
├── views : ejs 뷰단
│   ├── fridge : 냉장고 페이지
│   │   ├── myFridge.ejs
│   │   ├── myFridge404.ejs
│   ├── main : 메인 페이지
│   │   └── main.ejs
│   │   ├── 404.ejs
│   │   ├── footer.ejs
│   │   └── head.ejs
│   │   └── header.ejs
│   │   ├── dbRegex.ejs : DB 정규화 페이지
│   ├── recipe : 레시피 페이지
│   │   └── recipe.ejs
│   │   └── recipe_non.ejs
│   ├── user : 회원관련 페이지
│   │   └── kakaoLogin.ejs
│   │   └── myProfile.ejs
│   │   └── deleteAccount.ejs
│   │   └── myPage.ejs
│   │   └── myPageSideBar.ejs
│   │   └── pwConfirm.ejs
│   │   └── signIn.ejs
│   │   └── signUp.ejs
│   │   └── wishList.ejs
└── static : css, img, script
│   ├── css
│   │   └── fridge : 냉장고 페이지 관련 css
│   │   └── main : 메인 페이지 관련 css
│   │   └── recipe : 레시피 페이지 관련 css
│   │   └── user : 유저 관련 css
│   │   └── basic.css : 공통 관련 css
│   ├── img
│   ├── script
│   │   └── fridge : 냉장고 페이지 관련 js
│   │   └── main : 메인 페이지 관련 js
│   │   └── recipe : 레시피 페이지 관련 js
│   │   └── user : 유저 관련 js
└── routes : 라우터
│   ├── fridgeRoute.js
│   ├── mainRoute.js
│   ├── myPageRoute.js
│   ├── recipeRoute.js
│   ├── userRoute.js
└── model : sequelize 모델
│   ├── cooklog.js
│   ├── fresh.js
│   ├── frozen.js
│   ├── index.js
│   ├── recipe_like.js
│   ├── recipe.js
│   ├── user.js
└── controller : controller
│   ├── fridge
│   ├── main
│   ├── recipe
│   ├── user
└── config 
   ├── config.js
```
