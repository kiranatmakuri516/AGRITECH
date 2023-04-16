const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
mongoose.connect("mongodb+srv://kiran:kiran@cluster0.siuvs9s.mongodb.net/gfg");
mongoose.set('strictQuery', true);

const product_schema = new mongoose.Schema({
    name: String,
    image: String,
    price: String
});

const farmer_schema = new mongoose.Schema({
    name: String,
    mail: String,
    phone: String,
    location: String,
    password: String,
    lang: String,
    type: String,
    experience: String,
    qualification: String,
    door: String,
    street: String,
    City: String,
    state: String,
    pin: String,
    country: String,
    p_name: String,
    p_price: String,
    p_quantity: String,
    p_status: Number,
    f_name: String,
    f_price: String,
    f_quantity: String,
    f_status: Number
});

const request_schema = new mongoose.Schema({
    type: Number,
    owner_id: String,
    sender_name: String,
    sender_phone: String,
    date: String,
    day: String,
    month: String,
    year: String,
    hr: String,
    min: String,
    item: String,
    quantity: String,
    price: String,
    status: Number
});

const tools_schema = new mongoose.Schema({
    phone: String,
    location: String,
    name: String,
    image: String,
    price: String,
    id: String
});

const tname_schema = new mongoose.Schema({
    name: String
});

const locname_schema = new mongoose.Schema({
    name: String
});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));


const Product = mongoose.model("product", product_schema);
const Farmer = mongoose.model("Farmer", farmer_schema);
const Tool = mongoose.model("Tool", tools_schema);
const Tname = mongoose.model("Tname", tname_schema);
const Locname = mongoose.model("Locname", locname_schema);
const Request = mongoose.model("Request", request_schema);

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/reviews", (req, res) => {
    res.render('reviews');
});

app.get("/addproduct", (req, res) => {
    res.render('addproduct');
});

app.get("/addtool", (req, res) => {
    res.render('addtool');
});

app.get("/tools", function(req, res) {
    res.render("tools");
});

app.get("/companyend", function(req, res) {
    var user = JSON.parse(localStorage.getItem("user"));
    Farmer.find({}, function(err, data) {
        if (err) console.log("Error at get company end");
        else {
            Request.find({ sender_phone: user.phone }, function(err, reque) {
                if (err) console.log("Error at cmp requests");
                else res.render("companyend", { data: data, reque: reque, user: user });
            });
        }
    });
});

app.get("/cmpprofile/:id", function(req, res) {
    var id = req.params.id;
    Farmer.findOne({ _id: id }, function(err, data) {
        if (err) console.log("Error at cmp profile get route");
        else {
            res.render("company-farmer-profile", { data: data });
        }
    });
})

app.get("/info", function(req, res) {
    res.render("soil");
});
app.get("/soil-card", function(req, res) {
    res.render("soil-card");
});

app.get("/open-card", function(req, res) {
    res.render("open-card");
});

app.get("/open-card1", function(req, res) {
    res.render("open-card1");
});
app.get("/open-card2", function(req, res) {
    res.render("open-card2");
});
app.get("/open-card3", function(req, res) {
    res.render("open-card3");
});

app.get("/hiretools", function(req, res) {
    var user = JSON.parse(localStorage.getItem("user"));
    console.log(user.name);
    Tool.find({ id: { $ne: user._id } }, function(err, data) {
        if (err) console.log("Error at get tools");
        else res.render("hiretools", { data: data, user: user });
    });
});

app.get("/request/:owner/:sender_name/:sender_phone/:tool_name/:price", function(req, res) {
    var owner = req.params.owner;
    var sender_name = req.params.sender_name;
    var sender_phone = req.params.sender_phone;
    var tool_name = req.params.tool_name;
    var price = req.params.price;
    const kir = new Date();
    const a = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = kir.getDate();
    var day = b[kir.getDay()];
    var month = a[kir.getMonth()];
    var year = kir.getFullYear();
    var hr = kir.getHours();
    var min = kir.getMinutes();
    if (hr < 10) hr = "0" + hr;
    if (min < 10) min = "0" + min;
    const new_request = new Request({
        type: 0,
        owner_id: owner,
        sender_name: sender_name,
        sender_phone: sender_phone,
        date: date,
        day: day,
        month: month,
        year: year,
        hr: hr,
        min: min,
        item: tool_name,
        price: price,
        quantity: "1",
        status: 0
    });
    new_request.save();
    var a1 = JSON.parse(localStorage.getItem("user"));
    Request.find({ owner_id: a1._id }, function(err, reque) {
        if (err) console.log("Error at profile requets");
        else {
            localStorage.setItem("requests", JSON.stringify(reque));
            res.redirect("/hiretools");
        }
    });
});


app.get("/product", (req, res) => {
    const kir = new Date();
    const a = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = kir.getDate();
    var day = b[kir.getDay()];
    var month = a[kir.getMonth()];
    var year = kir.getFullYear();
    var hr = kir.getHours();
    var min = kir.getMinutes();
    var city = "Visakhapatnam";
    if (hr < 10) hr = "0" + hr;
    if (min < 10) min = "0" + min;
    var vinee = JSON.parse(localStorage.getItem("user"));
    Product.find({}, function(err, data1) {
        if (err) console.log("error at get products route");
        else {
            const apiKey = "ec9b79c4c63c06534a519841060b102c";
            const units = "metric";
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey;
            https.get(url, (response) => {
                response.on("data", (data) => {
                    weather = JSON.parse(data);
                    res.render("products", { weather: weather, data1: data1, date: date, day: day, month: month, year: year, hr: hr, min: min, city: city, vinee: vinee });
                })
            })
        }
    });
});

app.get("/farmerview", function(req, res) {
    res.render("farmersview");
});


app.get("/farmer", (req, res) => {
    res.render('farmerend');
});
app.get("/profile", (req, res) => {
    var a = JSON.parse(localStorage.getItem("user"));
    Farmer.findOne({ _id: a._id }, function(err, data) {
        if (err) console.log("Error at profile page");
        else {
            Request.find({ owner_id: a._id }, function(err, reque) {
                if (err) console.log("Error at profile requets");
                else res.render('profile', { data: data, reque: reque });
            });
        }
    });
});

app.get("/check_request/:id", function(req, res) {
    var id = req.params.id;
    var a = JSON.parse(localStorage.getItem("user"));
    Request.findOne({ _id: id }, function(err, reque) {
        if (err) console.log("Error at profile requets");
        else {
            reque.status = 1;
            reque.save();
            Request.find({ owner_id: a._id }, function(err, reque) {
                if (err) console.log("Error at profile requets");
                else {
                    localStorage.setItem("requests", JSON.stringify(reque));
                    res.redirect("/profile");
                }
            });
        }
    });
});

app.get("/delete_request/:id", function(req, res) {
    var id = req.params.id;
    Request.deleteOne({ _id: id }).then(function() {
        Request.find({ owner_id: a._id }, function(err, reque) {
            if (err) console.log("Error at profile requets");
            else {
                localStorage.setItem("requests", JSON.stringify(reque));
                res.redirect("/profile");
            }
        });
    }).catch(function(error) {
        console.log("Error at delete request");
    });
});

app.get("/adminproduct", function(req, res) {
    Product.find({}, function(err, data) {
        if (err) console.log("error at get products route admin");
        else {
            res.render("adminend", { data: data });
        }
    });
});

app.get("/mytools", function(req, res) {
    var a = JSON.parse(localStorage.getItem("user"));
    Tool.find({ id: a._id }, function(err, data) {
        if (err) console.log("Error at get mytools");
        else res.render("mytools", { data: data, user: a });
    });
});

app.get("/deletetool/:id", function(req, res) {
    var id = req.params.id;
    Tool.deleteOne({ _id: id }).then(function() {
        res.redirect("/mytools");
    }).catch(function(error) {
        console.log("Error at deletetool");
    });
});

app.get("/logout", function(req, res) {
    localStorage.clear();
    res.redirect("/login");
});


app.post("/request1/:owner/:sender_name/:sender_phone/:tool_name", function(req, res) {
    var owner = req.params.owner;
    var sender_name = req.params.sender_name;
    var sender_phone = req.params.sender_phone;
    var tool_name = req.params.tool_name;
    const kir = new Date();
    const a = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = kir.getDate();
    var day = b[kir.getDay()];
    var month = a[kir.getMonth()];
    var year = kir.getFullYear();
    var hr = kir.getHours();
    var min = kir.getMinutes();
    if (hr < 10) hr = "0" + hr;
    if (min < 10) min = "0" + min;
    const new_request = new Request({
        type: 1,
        owner_id: owner,
        sender_name: sender_name,
        sender_phone: sender_phone,
        date: date,
        day: day,
        month: month,
        year: year,
        hr: hr,
        min: min,
        item: tool_name,
        price: req.body.price,
        quantity: req.body.quantity,
        status: 0
    });
    new_request.save();
    var a1 = JSON.parse(localStorage.getItem("user"));
    Request.find({ owner_id: a1._id }, function(err, reque) {
        if (err) console.log("Error at profile requets");
        else {
            localStorage.setItem("requests", JSON.stringify(reque));
            res.redirect("/companyend");
        }
    });
});


app.post("/signup", function(req, res) {
    const user = new Farmer({
        name: req.body.name,
        mail: req.body.mail,
        phone: req.body.phone,
        location: "-",
        password: req.body.password,
        type: req.body.type,
        lang: req.body.fav_language,
        experience: "-",
        qualification: "-",
        door: "-",
        street: "-",
        City: "-",
        state: "-",
        pin: "-",
        country: "-",
        p_name: "-",
        p_price: "-",
        p_quantity: "-",
        p_status: 0,
        f_name: "-",
        f_price: "-",
        f_quantity: "-",
        f_status: 0
    });
    user.save();
    res.redirect("/login");
});

app.post("/addproduct", function(req, res) {
    console.log(req.body);
    const ins = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price
    });
    ins.save();
    res.redirect("/adminproduct");
});

app.post("/addtool", function(req, res) {
    var data = JSON.parse(localStorage.getItem("user"));
    const ins = new Tool({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        phone: data.phone,
        location: data.City,
        id: data._id
    });
    ins.save();
    res.redirect("/mytools");
});

app.post("/login", function(req, res) {
    if (req.body.mail == "admin@gmail.com" && req.body.password == "we3")
        res.redirect("/adminproduct");
    Farmer.findOne({ mail: req.body.mail, password: req.body.password }, function(err, data) {
        if (err) console.log("Error in login");
        else if (data) {
            localStorage.setItem("user", JSON.stringify(data));
            Request.find({ owner_id: data._id }, function(err, reque) {
                if (err) console.log("Error at profile requets");
                else {
                    localStorage.setItem("requests", JSON.stringify(reque));
                    if (data.type == "one")
                        res.redirect("/product");
                    else
                        res.redirect("/companyend");
                }
            });
        } else res.redirect("/login");
    });
});

app.post("/search_crop", function(req, res) {
    if (req.body.crop_name == "") {
        res.redirect("/product");
    }
    const kir = new Date();
    const a = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = kir.getDate();
    var day = b[kir.getDay()];
    var month = a[kir.getMonth()];
    var year = kir.getFullYear();
    var hr = kir.getHours();
    var min = kir.getMinutes();
    var city = "Visakhapatnam";
    var vinee = JSON.parse(localStorage.getItem("user"));
    Product.find({ name: req.body.crop_name }, function(err, data1) {
        if (err) console.log("Error at Search crop post route");
        else {
            const apiKey = "ec9b79c4c63c06534a519841060b102c";
            const city = "Visakhapatnam";
            const units = "metric";
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey;
            https.get(url, (response) => {
                response.on("data", (data) => {
                    weather = JSON.parse(data);
                    res.render("products", { weather: weather, data1: data1, date: date, day: day, month: month, year: year, hr: hr, min: min, city: city, vinee: vinee });

                })
            })
        }
    });
});

app.post("/search_admincrop", function(req, res) {
    if (req.body.crop_name == "") {
        res.redirect("/adminproduct");
    }
    Product.find({ name: req.body.crop_name }, function(err, data) {
        if (err) console.log("Error at Search admin crop post route");
        else {
            res.render("adminend", { data: data });
        }
    });
});

app.post("/search_tool", function(req, res) {
    if (req.body.tool_name == "") {
        res.redirect("/mytools");
    }
    var vinee = JSON.parse(localStorage.getItem("user"));
    Tool.find({ name: req.body.tool_name, id: vinee._id }, function(err, data) {
        if (err) console.log("Error at search tool route");
        else res.render("mytools", { data: data });
    });
});

app.post("/search_tool/hire", function(req, res) {
    if (req.body.tool_name == "") {
        res.redirect("/hiretools");
    }
    var user = JSON.parse(localStorage.getItem("user"));
    Tool.find({ name: req.body.tool_name, id: { $ne: user._id } }, function(err, data) {
        if (err) console.log("Error at search tool route");
        else res.render("hiretools", { data: data, user: user });
    });
});

app.post("/addproduct", function(req, res) {
    console.log(req.body);
    const prod = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price
    });
    prod.save();
    res.redirect("/adminproduct");
});

app.post("/updateproduct/:id", function(req, res) {
    var id = req.params.id;
    Product.findOne({ _id: id }, function(err, data) {
        if (err) console.log("error in product update");
        else {
            data.price = req.body.price;
            data.save();
            res.redirect("/adminproduct");
        }
    });
});

app.post("/updatetool/:id", function(req, res) {
    var id = req.params.id;
    console.log(id);
    Tool.updateOne({ _id: id }, { price: req.body.price }, function(err, data) {
        if (err) console.log("error in product update");
        else {
            res.redirect("/mytools");
        }
    });
});

app.post("/search_user", function(req, res) {
    if (req.body.cl == "")
        res.redirect("/companyend");
    Farmer.find({ $or: [{ City: req.body.cl }, { p_name: req.body.cl }] }, function(err, data) {
        if (err) console.log("Error at search user in company end");
        else {
            var user = JSON.parse(localStorage.getItem("user"));
            Request.find({ sender_phone: user.phone }, function(err, reque) {
                if (err) console.log("Error at cmp requests");
                else res.render("companyend", { data: data, reque: reque, user: user });
            });
        }
    })
});

app.post("/update", function(req, res) {
    var user = JSON.parse(localStorage.getItem("user"));
    console.log(req.body);
    Farmer.findOne({ _id: user._id }, function(err, data) {
        if (err) console.log("error at update details");
        else {
            data.name = req.body.name;
            data.location = req.body.city;
            data.phone = req.body.phone;
            data.mail = req.body.mail;
            data.experience = req.body.experience;
            data.qualification = req.body.qualification;
            data.door = req.body.door;
            data.street = req.body.street;
            data.City = req.body.city;
            data.state = req.body.state;
            data.pin = req.body.pin;
            data.country = req.body.country;
            data.save();
            Farmer.findOne({ _id: user._id }, function(err, data) {
                if (err) console.log("error at update details of farmer 2")
                else {
                    localStorage.setItem("user", JSON.stringify(data));
                    res.redirect("/profile");
                }
            });
        }
    })
});

app.post("/update1", function(req, res) {
    var user = JSON.parse(localStorage.getItem("user"));
    console.log(req.body);
    Farmer.findOne({ _id: user._id }, function(err, data) {
        if (err) console.log("error at update details");
        else {
            data.p_name = req.body.pname;
            data.p_price = req.body.pprice;
            data.p_quantity = req.body.pquantity;
            data.p_status = req.body.pstatus;
            data.f_name = req.body.fname;
            data.f_price = req.body.fprice;
            data.f_quantity = req.body.fquantity;
            data.f_status = req.body.fstatus;
            data.save();
            Farmer.findOne({ _id: user._id }, function(err, data) {
                if (err) console.log("error at update details of farmer 2")
                else {
                    localStorage.setItem("user", JSON.stringify(data));
                    res.redirect("/profile");
                }
            });
        }
    })
});

app.listen(3000, () => {
    console.log("Server started at 3000");
});