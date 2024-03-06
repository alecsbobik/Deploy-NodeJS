require('dotenv').config();

const express = require('express');

// Added
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
// 

const mongoose = require('mongoose');
// const Post = require('./server/models/Post');

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

// Added
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: {maxAge new Date (Date.now() + (3600000) )}
}));
// 

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

// Added
app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));


// https://blue-handsome-chameleon.cyclic.app


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})