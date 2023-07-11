const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoDBsession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

const UserModel = require('./models/User');
const mongo_uri = "mongodb+srv://admin:admin123@cluster0.pstmaeb.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
})
const store = new mongoDBsession({
    uri: mongo_uri,
    collection: "my_sessions"
})

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "thisissecretkey",
    resave: false,
    saveUninitialized:false,
    store: store
}))


app.get('/', (req, res) => {
    // req.session.isAuth = true;
    // res.send('home');
    // console.log(req.session);
    res.render('landing')
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {});

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const {username, email, password} = req.body;
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.listen(5100, () => {
    console.log('Server running on port 5100');
})