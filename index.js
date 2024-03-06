require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Post = require('./server/models/Post');

const app = express();
const PORT = process.env.PORt || 3000;

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB COnnected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send({ title: 'Posts' });
});

app.get('/add-post', async (req, res) => {
    try {
        await Post.insertMany([
            {
                title: 'First Deployed NodeJS and MongoDB in Cyclic',
                description: 'Simple Blog created with NodeJs, Express & MongoDb.'
            },
            {
                title: 'First time using MongoDB',
                description: 'its kinda easy tho'
            }
        ])
    } catch (error) {
        console.log("err" + error);
    }
});

app.get('/Post', async (req, res) => {
    if (Post) {
        res.json(Post);

    } else {
        res.send("Something went wrong");
    }
})








connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})