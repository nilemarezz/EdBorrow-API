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

app.use(morgan("dev"));


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.redirect("https://matas-nile.gitbook.io/api-doc/");
});

app.use("/api/items", BorrowitemRoute);
app.use("/api/users", userRoute);
app.use("/api/request", requestRoute);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server start at port: ${port}`);
  });
}

module.exports = app;
