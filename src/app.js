const express = require("express");
const http = require("http");
const router = require("./router");
const config = require("./config");
const loader = require("./loader");
const session = require("express-session");
const cookieParser = require("cookie-parser");

async function create() {
  await loader.connectDB();

  console.log("### express app 초기화");
  const expressApp = express();

  expressApp.use(express.json());
  expressApp.set("view engine", "ejs");
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use("/static", express.static("static"));
  expressApp.use(cookieParser());
  expressApp.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: "sesac_fridge_id",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
      },
    })
  );

  expressApp.use("/api/v1", router.apiRouter.v1);
  expressApp.use("/", router.renderRouter);
  expressApp.use("*", (req, res) => res.render("./main/404"));

  expressApp.use((error, req, res, next) => {
    console.log("[ " + new Date() + " ]\n" + error.stack);
    res.statusCode = error.httpCode ?? 500;

    if (res.statusCode == 401) {
      return res.redirect("/login");
    }

    res.send({
      result: "failure",
      message: error.message,
    });
  });

  console.log("### express app 준비 완료🎯");

  // http 서버
  const server = http.createServer(expressApp);
  const app = {
    _app: expressApp,
    isShuttingDown: false,

    start() {
      server.listen(config.port, () =>
        console.log(`HTTP: Express listening on port ${config.port}`)
      );
    },

    stop() {
      console.log("### stopping the server");
      this.isShuttingDown = true;
      return new Promise((resolve, reject) => {
        server.close(async (error) => {
          if (error) {
            console.log(`HTTP 서버 중지 실패: ${error.message}`);
            reject(error);
          }
          console.log("### connection 중지 시작🏃");
          await loader.disconnectDB();
          console.log("### DB connection 종료");
          console.log("### server shutdown complete🖐️");
          this.isShuttingDown = false;
          resolve();
        });
      });
    },
  };

  return app;
}

module.exports = create;
