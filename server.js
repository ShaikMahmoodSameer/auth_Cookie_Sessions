// package imports
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBsession = require('connect-mongodb-session')(session);
const UserModel = require('./models/User');
const ejs = require('ejs');


// middlewares
const app = express();
// this middleware check our login session, when we're done login
const isAuth = (req, res, next) => {
    if ( req.session.isAuth ) {
        next();
    } else {
        res.redirect('/login')
    }
}


// mongodb connection
const mongo_uri = "mongodb+srv://admin:admin123@cluster0.pstmaeb.mongodb.net/sessions?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
})
// sets view engine to .ejs and views folder
app.set("view engine", "ejs");
// bodyparser
app.use(express.urlencoded({ extended: true }));
// new session
const store = new mongoDBsession({
    uri: mongo_uri,
    collection: "my_sessions"
})
// session using the key
app.use(session({
    secret: "thisissecretkey",
    resave: false,
    saveUninitialized:false,
    store: store
}))


// routes
app.get('/', (req, res) => {
    res.render('landing')
});
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        res.redirect('/login');
        console.log("User not found");
    }else{
        const isMatch = await bcrypt.compare(password, user.password);
        if( isMatch ) {
            req.session.isAuth = true;
            res.render('dashboard');
        } else {
            res.render('login');
        }
    }

});
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    const user  = await UserModel.findOne({email});

    if(user) {
        return res.redirect('/register');
    }else{
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = new UserModel({
            username, 
            email, 
            password: hashedPwd
        });
        
        await user.save();
        res.redirect('./login')
    }
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');  
})
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/')
    })
})


// running server
app.listen(5100, () => {
    console.log('Server running on port 5100');
})