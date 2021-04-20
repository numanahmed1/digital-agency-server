const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpxka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is Backend of Digital Agency BD");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("products");
  const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admins");
  const reviewsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("reviews");
  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("orders");

  app.post("/add-service", (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/add-review", (req, res) => {
    const newReview = req.body;
    reviewsCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/add-email", (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/selected-service", (req, res) => {
    const queryId = ObjectId(req.query.id);
    servicesCollection.find({ _id: queryId }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/add-order", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/orders-list", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ adminEmail: email }).toArray((err, admins) => {
      const filter = {};
      if (admins.length === 0) {
        filter.email = email;
      }
      ordersCollection.find(filter).toArray((err, documents) => {
        res.send(documents);
      });
    });
  });

  app.post("/is-admin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ adminEmail: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  app.delete("/delete-service/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    servicesCollection.findOneAndDelete({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  app.patch("/update-order/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    ordersCollection
      .updateOne({ _id: id }, { $set: { status: req.body.currentStatus } })
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
});

app.listen(port);
