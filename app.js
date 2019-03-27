const express = require('express');
var bodyParser = require('body-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')

require('./mongobd/mongoconnection');
var User = require('./mongobd/usersmodel');
var Ad = require('./mongobd/admodel');
const server = express();
server.use(express.static('./build'))
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.post('/signup', (req, res) => {
    res.send(req.body);
    console.log(req.body);
    var user = new User(req.body);
    user.save((err, data) => {
        if (err)
            console.log(err);
        else {
            console.log('data Inserted')
           
        }
    })

})

server.post('/adstore', (req, res) => {
    var ad = new Ad(req.body)
    ad.save((err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(data)
            console.log("data inserted");
        }
    })
})

// update Ad
server.post('/updatead', (req, res) => {
    Ad.findOneAndUpdate({ _id: req.body.id }, {
        catagory: req.body.catagory,
        condition: req.body.condition,
        brand: req.body.brand,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,

    }, function (err, data) {
        if (err) {
            console.log(err)
        }
        else {
            res.send({ updated: true })
            console.log("data inserted");
        }
    }

    )

})
server.post('/updateprofile', (req, res) => {
    console.log(req.body.id)
    User.findOneAndUpdate(
        { _id: req.body.id }, {
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            email: req.body.email,
            phone: req.body.phone,
            s_address: req.body.s_address,
            city: req.body.city,
            country: req.body.country,
            z_code: req.body.z_code
        }, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ updated: true })
                console.log("data inserted");
            }
        }

    )

})
// /update profile pic 
server.post('/updateprofilepic', (req, res) => {
    console.log(req.body.id)
    User.findOneAndUpdate(
        { _id: req.body.id }, { image: req.body.image }, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ updated: true })
                console.log("data inserted");
            }
        }

    )

})


// getAllads
server.get('/getAllads', (req, res) => {
    Ad.find({}).
        exec(function (err, ads) {
            if (err) return res.send(err)
            res.send(ads)
            console.log(ads)
        })
})
//get User
server.get('/getUser', (req, res) => {
    User.findById(req.query, function (err, data) {
        if (err) return res.send(err)
        res.send(data)
        console.log(data)
    })
})
server.get('/getDetail', (req, res) => {
    Ad.findById(req.query, function (err, data) {
        if (err) return res.send(err)
        res.send(data)
        console.log(data)
    })
})
server.get('/getUserAds', (req, res) => {
    console.log(req.query)
    Ad.find({ userID: req.query.id }, function (err, data) {
        if (err) return res.send(err)
        res.send(data)
        console.log(data)
    })

})
server.get('/deleteAd', (req, res) => {

    Ad.findOneAndDelete({ _id: req.query.id }, function (err, data) {
        if (err) return res.send(err)
        res.send({ deleted: true })
        console.log(data)
    })
})
server.get('/searchRecord',(req,res)=>{
    console.log(req.query.email)
    User.findOne({email:req.query.email},(err,data)=>{
        if(err)
        console.log(err)
        else{
            if(data===null)
            res.send({userExist:false})
            else
            res.send({userExist:true,data:data})
            console.log(data)
        }
    })
})







server.use(session({ secret: "secret-word", resave: true, saveUninitialized: true  }));
server.use(passport.initialize());
server.use(passport.session());


passport.use(new LocalStrategy(


    function (username, password, next) {

        User.findOne({ email: username, password: password }, (err, data) => {
            if (err) {
                console.log(err)
                next(null, false)
            }
            else {
                if (data == null)
                    next(null, false)
                else {
                    console.log(data)
                    next(null, data)
                }
            }
        })


    }
));
passport.serializeUser(function (user, next) {
    next(null, user.id)
});


passport.deserializeUser(function (id, next) {
    User.findOne({ _id: id }, (err, user) => {
        if (err)
            console.log(err)
        else {
            if (user == null)
                console.log(user)
            else
                next(null, user);
        }

    })


});





server.post('/login', passport.authenticate('local'), function (req, res) {
    // console.log(req.user.username);
    res.send(req.user);
    // res.redirect('/dashboard');


});

server.get("/search", function (req, res) {
    console.log(req.query)
    if (req.query.pricefrom === "" && req.query.priceto === "") {
        Ad.find({
            title: new RegExp(req.query.title, 'i'),
            location: RegExp(req.query.location, 'i'),
            catagory: RegExp(req.query.catagory, 'i'),
            brand: RegExp(req.query.brand, 'i')

        }, function (err, data) {
            if (err)
                console.log(err)
            else {

                console.log(data)
                res.send(data)
            }
        })

    }
    else if (req.query.priceto === "") {

        Ad.find({
            title: new RegExp(req.query.title, 'i'),
            location: RegExp(req.query.location, 'i'),
            catagory: RegExp(req.query.catagory, 'i'),
            brand: RegExp(req.query.brand, 'i'),
            price: { $gte: parseInt(req.query.pricefrom) }


        }, function (err, data) {
            if (err)
                console.log(err)
            else {

                console.log(data)
                res.send(data)
            }
        })

    }
    else if (req.query.pricefrom === "") {
        Ad.find({
            title: new RegExp(req.query.title, 'i'),
            location: RegExp(req.query.location, 'i'),
            catagory: RegExp(req.query.catagory, 'i'),
            brand: RegExp(req.query.brand, 'i'),
            price: { $lte: parseInt(req.query.priceto) }


        }, function (err, data) {
            if (err)
                console.log(err)
            else {

                console.log(data)
                res.send(data)
            }
        })

    }


    else {
        Ad.find({
            title: new RegExp(req.query.title, 'i'),
            location: RegExp(req.query.location, 'i'),
            catagory: RegExp(req.query.catagory, 'i'),
            brand: RegExp(req.query.brand, 'i'),
            price: { $gte: parseInt(req.query.pricefrom), $lte: parseInt(req.query.priceto) }
        }, function (err, data) {
            if (err)
                console.log(err)
            else {

                console.log(data)
                res.send(data)
            }
        })
    }
})
server.get('/dashboard', function (req, res) {
    if (!req.isAuthenticated()) {
        res.send({ authentication: false });
    }
    else {
        res.send({ authentication: true, user: req.user })
    }
});
server.get('/logout', (req, res) => {

    req.logout();
    res.send({logout:true})
})



// middle_ware function for err handling (it use 4 parameters)
server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send("something went wrong")
})


server.listen( process.env.PORT||8000, console.log("serverstarted"));

