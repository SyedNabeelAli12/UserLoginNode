const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const webSocketServer = require("websocket").server;
const express = require("express");







server.listen(port, () => {
  console.log("Listening On The Port " + port);
});

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000);
  return s4() + s4() + "-" + s4();
};

wsServer.on("request", function (request) {
 
  // const url = new URL(request.url, 'http://localhost:3001');
  // const params = url.searchParams;

  // const param1 = params.get('param1');
// console.log(request)
  var userID = request.resourceURL.query.param1;

  console.log(
    new Date() + "Recieved a new connection from origin " + request.origin + "."
  );

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected" + userID + "in" + Object.getOwnPropertyNames(clients)
  );

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message", message.utf8Data);
    }
    for (key in clients) {
      clients[key].sendUTF(message.utf8Data);
      console.log("sent Message to:", clients[key]);
    }
  });
});
