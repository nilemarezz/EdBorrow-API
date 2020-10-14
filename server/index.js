const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const BorrowitemRoute = require("./Route/ItemRoute");
const userRoute = require("./Route/userRoute");
const requestRoute = require("./Route/requestRoute");
const dataRoute = require("./Route/DataRoute")
const port = 3000;
const cron = require("node-cron");
const AdminRoute = require('./Route/AdminRoute')
const SystemRoute = require('./Route/SystemRoute')
const { checkLateItem, checkExpRequest } = require("./Controller/Request");
const { listen } = require("socket.io");
const handleSocket = require("./config/socket");


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date'));

app.use(cors());

app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use("/api/items", BorrowitemRoute);
app.use("/api/users", userRoute);
app.use("/api/request", requestRoute);
app.use("/api/data", dataRoute);
app.use("/api/admin", AdminRoute)
app.use("/api/system", SystemRoute)

// Check item late by cron-job (every 1.00 AM)
cron.schedule("0 1 * * *", () => {
  checkLateItem();
  checkExpRequest();
})


if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => {
    console.log(`Server start at port: ${port}`);
  });
  const io = listen(server);
  app.io = io;
  handleSocket(io);
}


module.exports = app;
