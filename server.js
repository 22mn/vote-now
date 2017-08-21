var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var engines  = require("consolidate");
var passport = require("passport");
var session  = require("express-session");
var path     = process.cwd();
var route   = require("./app/routes/route.js");

var app = express();
require("dotenv").load();
require("./app/config/passport")(passport);

app.engine("html", engines.nunjucks);
app.set("view engine", "html");
app.set("views", "./public/views");
app.use("/public", express.static(path+"/public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'please',
	resave: false,
	saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

route(app,passport);


var port = process.env.PORT;
app.listen(port,()=>{
	console.log("App is listening on port %s.",port);
});