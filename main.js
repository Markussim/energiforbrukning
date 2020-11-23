const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

const config = {
  eliqAccesstoken: "a612b8362dac11eb95f696b78e6a6b19",
  url: process.env["url"],
  format: process.env["format"],
  logLevel: process.env["logLevel"],
};
const { EliqClient } = require("eliq-promise");
const eliq = new EliqClient(config);

io.on("connection", (socket) => {
  console.log("Got connect!");

  let interval = setInterval(() => {
    socket.emit("power", 400);
  }, 1000);

  socket.on("msg", function (data) {
    console.log(data);
  });

  socket.on("disconnect", function () {
    clearInterval(interval);
    console.log("Got disconnect!");
  });
});

let json;

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

async function runOnStart() {
  json = await eliq.getNow();
}

//runOnStart();

function getpower() {
  return json.power;
}

app.listen(port, () => console.log(`Example app listening on port port!`));
