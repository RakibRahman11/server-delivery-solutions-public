const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const express = require('express')

const app = express()
const port = 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpttu.mongodb.net/delivery-solutions?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    console.log('done');
    const database = client.db("deliverySolutions");
    const usersCollection = database.collection("offers");
    const userCollection = database.collection("offer");

    // GET method
    app.get('/addservices', async (req, res) => {
      const cursor = usersCollection.find({});
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/placeOrder', async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/addservices/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const service = await usersCollection.findOne(query);
      res.json(service)
    })
    
    // POST method
    app.post('/addservices', async (req, res) => {
      const services = req.body
      const result = await usersCollection.insertOne(services)
      res.json(result)
    })
    app.post('/offers', async (req, res) => {
      const id = req.params.id
      const service = { _id: ObjectId(id) };
      const result = await userCollection.insertOne(service)
      res.json(result)
    })
    app.post('/placeOrder', async (req, res) => {
      const services = req.body
      const result = await userCollection.insertOne(services)
      res.json(result)
    })
    // Delete API
    app.delete('/placeOrder/:id', async (req, res) => {
      const id = req?.params?.id;
      console.log(id);
      const query = {_id:ObjectId(id)};
      console.log(query);
      const result = await userCollection.deleteOne(query);
      res.json(result);
      console.log(result);
  })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World! done')
})

app.listen(port, () => {
  console.log('hello', port)
})