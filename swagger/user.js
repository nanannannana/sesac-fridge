/**
 * @swagger
 *  tags :
 *  name : User
 *  description : 유저 조회, 추가, 수정, 삭제
 */

/**
 * @swagger
 *  /signIn:
 *    get:
 *      tags:
 *      - User
 *      description: 유저 로그인 확인
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: category
 *          required: false
 *          schema:
 *            type: integer
 *            description: 카테고리
 *      responses:
 *       200:
 *        description: 로그인 성공
 */

/**
 * @swagger
 *  /idCheck:
 *    post:
 *      tags:
 *      - User
 *      description: 아이디 중복 확인을 위한 조회
 *      parameters :
 *      - in : body
 *        name : body
 *        required : true
 *        schema : 
 *          properties : 
 *          user_id :
 *          type : "root@naver.com"
 
 *      responses:
 *       200:
 *        description: 중복된 이메일 있을 땐 false, 없으면 true
 *        schema :
 *          properties :
 *          message :
 *          type : true
 */
