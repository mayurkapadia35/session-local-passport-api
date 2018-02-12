const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const express=require('express');
const LocalStrategy=require('passport-local').Strategy;
const passport=require('passport');

var session=require('express-session');

var result;
var sess;

const LocalStorage=require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
var app=express();

var username="";

mongoose.connect('mongodb://localhost:27017/dbusers');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

//------------------------- Session Code-------------------------

app.use(session({secret: 'mysecretkey'}));



//---------------------------- Model -----------------------------
const schema=mongoose.Schema;

var UserDetail=new schema({
    username: String,
    password: String,
    name: String
});

const UserDetails=mongoose.model('tblusersss',UserDetail,'tblusersss');

app.get('/',(req,res)=>{
    sess=req.session;
    if(sess.username)
    {
        res.render('welcome.ejs',{data:sess.username});
    }
    else
    {
        res.sendFile('auth.html',{ root : "../"});
        }
});


// app.get('/welcome',(req,res)=>{
//
//         sess=req.session;
//         if(sess.username)
//         {
//             res.write('<h1>Hello '+ sess.username +'</h1>');
//             res.end('<a href="+">Logout</a>');
//         }
//         else
//         {
//             // res.sendFile('auth.html',{ root : "./"});
//             res.write('<h1>Please Login First..!!!</h1>');
//         }
//         // sess.username=req.query.username;
//         // sess.password=req.query.password;
//         // res.send("Welcome "+req.query.username+" !!");
//         // result=req.query.username;
//         // res.sendFile('welcome.html',{ root : "./"},result);
// });

// app.post('/logout',function (req,res) {
//     req.session.destroy(function (err) {
//         if(err){
//             console.log(err);
//         }else{
//             res.redirect('/auth.html');
//         }
//     });
// });


app.post('/logout',(req,res)=>{

    req.session.destroy(function (err) {
       res.sendFile('auth.html',{ root : "../"});
    });
});

app.get('/error',(req,res)=>{
    console.log(req.body.username);
    res.send("Error logging in !!!");
});

//------------ Session Maintain-----------

passport.serializeUser(function(user, cb) {
    cb(null, user.id);

});

passport.deserializeUser(function(id, cb) {
    UserDetails.findById(id, function(err, user) {
        cb(err, user);
    });
});

//-------------------Passport Authentication ------------------------

passport.use(new LocalStrategy(
    function(username,password,done) {
        UserDetails.findOne({
           username: username
        },function (err,user) {
            if(err){
                return done(err);
            }

            if(!user){
                return done(null,false);
            }

            if(user.password !=password){
                return done(null,false);
            }
            return done(null,user);
        });
    }
));

app.post('/',passport.authenticate('local',{ failureRedirect: '/error' }),
    function (req,res) {
        //localStorage.setItem("myusername",req.user.username);
        // res.redirect('/success?username='+req.user.username);
        //res.redirect('/success');

        sess=req.session;
        sess.username=req.user.username;
        sess.password=req.user.password;
        console.log(sess.username);
        console.log(sess.password);
        var data=sess.username;
        res.render('welcome.ejs',{data:data});
    });



app.listen(3002,(req,res)=>{
    console.log("Connected to the server 3002");
});

