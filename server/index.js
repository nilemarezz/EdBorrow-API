const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const BorrowitemRoute = require("./Route/ItemRoute");
const userRoute = require("./Route/userRoute");
const requestRoute = require("./Route/requestRoute");
const port = 3000;
const configDB = require("./config.json");
var multer = require("multer");
var upload = multer();
const config = require('./config.json')

const CryptoJS = require("crypto-js");
const pool = require("./config/BorrowSystemDB");

app.use(morgan("dev"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.redirect("https://edborrow.gitbook.io/api-doc/");
});

app.use("/api/items", BorrowitemRoute);
app.use("/api/users", userRoute);
app.use("/api/request", requestRoute);

app.post("/createAdmin", async (req, res) => {
  console.log(req.body.password)
  var cipherPassword = CryptoJS.AES.encrypt(
    req.params.password,
    config.CRYPTO_SECRET_KEY
  ).toString();

  const query = await pool.query(
    `INSERT Into Users (userId , password  , firstName  ,lastName ,email ,userTelNo ) 
    values ("${req.body.userId}", "${req.body.password}" , "${req.body.firstName}" , "${req.body.lastName}" , "${req.body.email}" , "${req.body.userTelNo}")`
  );
  const query2 = await pool.query(
    `INSERT into UserRole (userId ,roleId ) values ("${req.body.userId}" , "${req.body.roleId}")`
  );
  console.log(query)
  res.send('success')
});

app.post("/createAdvisor", async (req, res) => {
  console.log(req.body.password)
  var cipherPassword = CryptoJS.AES.encrypt(
    req.params.password,
    config.CRYPTO_SECRET_KEY
  ).toString();

  const query = await pool.query(
    `INSERT Into Users (userId , password  , firstName  ,lastName ,email ,userTelNo ) 
    values ("${req.body.userId}", "${cipherPassword}" , "${req.body.firstName}" , "${req.body.lastName}" , "${req.body.email}" , "${req.body.userTelNo}")`
  );
  const query2 = await pool.query(
    `INSERT into UserRole (userId ,roleId ) values ("${req.body.userId}" , "${req.body.roleId}")`
  );
  console.log(query)
  res.send('success')
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server start at port: ${port}`);
  });
}

module.exports = app;
