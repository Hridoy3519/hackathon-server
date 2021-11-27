const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.voagd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("bidding-website");
    const productCollections = database.collection("products");
    const userCollections = database.collection("users");

    //Get Api to get all the products
    app.get("/products", async (req, res) => {
      const cursor = productCollections.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //API to load a single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollections.findOne(query);
      res.send(product);
    });

    //API to save user on Mongodb
    app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await userCollections.insertOne(user);
        console.log(result);
        res.json(result);
      });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("AquaTick server is running");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
