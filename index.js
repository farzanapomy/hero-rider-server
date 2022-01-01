const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjoai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('hero-rider')
        const riderCollections = database.collection('riders');

        app.post('/riders', async (req, res) => {
            const rider = req.body;
            const result = await riderCollections.insertOne(rider);
            console.log(rider);
            res.json(result);
        })

        app.get('/allRider',async(req,res)=>{
            const cursor=riderCollections.find({});
            const result = await cursor.toArray();
            res.json(result);
        })




        app.get('/riders/:email', async (req, res) => {
            const email = req.params.email;
            const newEmail = ({ email: email });
            console.log(newEmail);
            const cursor = riderCollections.find(newEmail);
            const result = await cursor.toArray();
            res.send(result);
        })


        console.log('database connected');


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Server is connected')
})

app.listen(port, () => {
    console.log('server is running at ', port)
})