const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpxka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000
const app = express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('This is Backend of Digital Agency BD')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ServicesCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  console.log("database connected successfully");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})