const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vqxo9wk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        const servicesCollection = client.db('creativeAgency').collection('services');
        const usersCollection = client.db('creativeAgency').collection('users');
        const ordersCollection = client.db('creativeAgency').collection('orders');
        const reviewsCollection = client.db('creativeAgency').collection('reviews');

        // services related api
        app.get('/services', async (req, res) => {
            const query = {};
            const services = await servicesCollection.find(query).toArray();
            res.send(services);
        });


        // users related api
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const query = { email: userInfo.email };

            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exists' });
            }

            const result = await usersCollection.insertOne(userInfo);
            res.send(result);
        });


        // orders related api
        app.post('/orders', async (req, res) => {
            const orderInfo = req.body;
            const result = await ordersCollection.insertOne(orderInfo);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }

            const query = { email: email };
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        });


        // review related api
        app.post('/reviews', async (req, res) => {
            const reviewInfo = req.body;
            const result = await reviewsCollection.insertOne(reviewInfo);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews);
        })


    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Creative Agency Server Running');
});

app.listen(port, () => {
    console.log(`Creative agency app listening on port ${port}`)
});