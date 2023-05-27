const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3200;
const server = http.createServer(app);

// server.listen(3200,()=>{

//     console.log("server up")
// })
server.listen(port, () => {
  console.log("The SERVER FOR TEST IS RUNNING ON PORT:", port);
});
