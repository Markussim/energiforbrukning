const key = require("./key.json")
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3068;

const config = {
  eliqAccesstoken: key.key,
  url: process.env["url"],
  format: process.env["format"],
  logLevel: process.env["logLevel"],
};
const { EliqClient } = require("eliq-promise");
const eliq = new EliqClient(config);

let oldJson = null;

io.on("connection", async (socket) => {
  console.log("Got connect!");

  let tmpJson = await eliq.getNow();

  socket.emit("power", tmpJson.power);
  socket.emit("Hmm", "hmm");

  socket.on("disconnect", function () {
    console.log("Got disconnect!");
  });
});

let json;

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

async function runOnStart() {
  try {
    json = await eliq.getNow();
  } catch (error) {
    json = null;
  }
}

runOnStart();

setInterval(function () {
  runOnStart();
  if (!oldJson || oldJson.power != json.power) {
    console.log("Not same");
    console.log(oldJson);
    console.log(json);
    io.sockets.emit("power", json.power);
  } else {
    console.log("Same");
    console.log(oldJson);
    console.log(json);
  }

  oldJson = json;
}, 10000);

server.listen(port, () => console.log(`Example app listening on port port!`));
