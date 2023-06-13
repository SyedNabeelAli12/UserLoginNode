const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userSign = require("./api/route/user");
// const product = require('./api/route/product')
const Product = require("./api/route/product");
const webSocketServer = require("websocket").server;
const http = require("http");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fileUpload = require("express-fileupload");
const uri =
  "mongodb+srv://kaiffaali:5WgsCJ7n8dcwH7Bf@cluster0.oial3vm.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  "mongodb+srv://kaiffaali:5WgsCJ7n8dcwH7Bf@cluster0.oial3vm.mongodb.net/?retryWrites=true&w=majority"
);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();

  //  res.status(404).json({Error:"Bad Request"
  //  })
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/user", userSign);



app.use("/product", Product);

module.exports = app;
