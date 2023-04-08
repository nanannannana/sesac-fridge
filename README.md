# 🌱<a href="http://43.201.83.209:8080/">새싹 냉장고</a>
> 냉장고에 있는 식품 관리 및 식재료 기반 레시피 추천 서비스

## 이 서비스의 장점

1. 언제 어디에서나 간편하게 냉장고 속 식재료를 확인할 수 있는 서비스를 제공해 중복 구매나 과소비를 방지하게 해줍니다.
2. 유통기한, 구매 일자를 관리해 유통기한 임박 식재료와 경과 식재료의 알림을 띄워 버려지는 식재료를 줄입니다.
3. 레시피에 관련해 사용할 식재료 양을 확인할 수 있어 버리는 음식을 줄일 수 있습니다.


## 🛠️ Stacks 
## Backend, DB, Server
![Node.js](https://img.shields.io/badge/-Node.js-%23339933)
![Express.js](https://img.shields.io/badge/-Expess.js-%23000000)
![Sequelize](https://img.shields.io/badge/-Sequelize-%2352B0E7)
![MySql](https://img.shields.io/badge/-Mysql-%234479A1)
![AWS(EC2)](https://img.shields.io/badge/-AWS(EC2)-%23232F3E)


## Frontend
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/-Bootstrap-%237952B3)
![SweetAlert](https://img.shields.io/badge/-SweetAlert-%23F48FB1)
![Chart.js](https://img.shields.io/badge/-Chart.js-%23FF6384)
![Axios](https://img.shields.io/badge/-Axios-%235A29E4)
![Ajax](https://img.shields.io/badge/-Ajax-%2364B5F6)


## Communication
![Github](https://img.shields.io/badge/-Github-%23181717)
![Figma](https://img.shields.io/badge/-Figma-%23F24E1E)
![Notion](https://img.shields.io/badge/-Notion-%23000000)
![Whale](https://img.shields.io/badge/-Whale-%2300A1E0)

---
## 👍 주요 기능 

### ⭐️ 냉장고에 식재료 추가, 수정 삭제
- 유통기한 경과 식재료 알림 및 자동 삭제
- 유통기한 임박 식재료 알림

### ⭐️ 레시피 추천
- 나의 냉장고에 있는 식재료 기반 레시피 추천
- 레시피로 요리한 후 냉장고 식재료 자동 변경

### ⭐️ 회원 관련
- 로그인(카카오로그인), 정보 수정, 탈퇴
- 찜하기, 최근 한 요리 보기, 냉장실 카테고리 현황보기 

---
## 📌 아키텍쳐

### 디렉토리 구조
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
│   │   └── kakaoInfo.ejs
│   │   └── kakaoLogin.ejs
│   │   └── myInfo.ejs
│   │   └── myInfoDel.ejs
│   │   └── myPage.ejs
│   │   └── myPageBasic.ejs
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
