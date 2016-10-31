var express =	require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var path = require("path");
var fs = require('fs');
var app	= express();

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
require('./routes/routes')(app);

app.use(function (req, res) {
   res.status(404).render("error");
 });

module.exports = app;
app.listen(3000, function() {
  console.log("Started on PORT 3000");
});
