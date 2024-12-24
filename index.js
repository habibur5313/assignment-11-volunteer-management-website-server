const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iosi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const VolunteerNeedCollection = client
      .db("volunteersDB")
      .collection("volunteers");
    app.get("/addVolunteerNeedPost", async (req, res) => {
      const result = await VolunteerNeedCollection.find().toArray();
      res.send(result);
    });
    app.get("/addVolunteerNeedPost/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await VolunteerNeedCollection.findOne(cursor);
      res.send(result);
    });

    app.get("/volunteerNeedPostSort", async (req, res) => {
      const sortItem = { Date: 1 };
      const result = await VolunteerNeedCollection.find()
        .sort(sortItem)
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/search", async (req, res) => {
      const search = req.query.search;
      let options = {};
      let cursor = {
        postTitle: {
          $regex: search,
          $options: "i",
        },
      };
      const result = await VolunteerNeedCollection.find(
        cursor,
        options
      ).toArray();
      res.send(result);
    });

    app.get('/myVolunteerNeedPosts/:email',async(req,res) => {
      const email = req.params.email;
      const query = {
        organizerEmail: email}
        const result = await VolunteerNeedCollection.find(query).toArray()
        res.send(result)
    })

    app.post("/addVolunteerNeedPost", async (req, res) => {
      const post = req.body;
      const result = await VolunteerNeedCollection.insertOne(post);
      res.send(result);
    });

    app.patch("/posts/update/:id",async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await VolunteerNeedCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    })

    app.delete('/myPostDelete/:id',async(req,res) => {
const id = req.params.id;
const query  = {_id: new ObjectId(id)}
const result = await VolunteerNeedCollection.deleteOne(query)
res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from home");
});

app.listen(port, () => {
  console.log("server is running");
});
