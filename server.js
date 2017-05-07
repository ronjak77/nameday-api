var express = require("express");
var path = require("path");
var names = require("./resources/nimet.json");
var names2 = require("./resources/nimet2.json");

var app = express();
app.use(express.static(__dirname + "/public"));

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
  console.log(new Date())
});


// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/today", function(req, res) {
  var date = new Date();
  var day = date.getDate().toString();
  var month = (date.getMonth() + 1).toString();
  var heroes = names[month][day];
  if (heroes.length < 0  ) {
    handleError(res, err.message, "Failed to get names.");
  } else {
    res.status(200).json({'name': heroes, 'date': date});
  }
});

app.get("/name/:name", function(req, res) {

  var date = new Date();

  for (var i = 12; i >= 0; i--) {
    var month = names2[i];
    for (var j = month.length - 1; j >= 0; j--) {
      console.log(month[j]);
    }
  }

  if(date) {
    res.status(200).json({'name': req.params.name, 'date': date});
  }
  else {
    handleError(res, err.message, "Failed to find date.");
  }

});

app.get("/:month/:day", function(req, res) {
  if(req.query.api_key === process.env.ALLOWED_KEY) {
    var month = req.params.month.toString();
    var day = req.params.day.toString();
    var heroes = names[month][day];

    if(heroes && heroes.length > 0) {
      res.status(200).json({'name': heroes});
    }
    else {
      handleError(res, err.message, "Failed to get names.");
    }
  }
});

app.get("/tomorrow", function(req, res) {
  if(req.query.api_key === process.env.ALLOWED_KEY) {
    var date = new Date();
    var day = (date.getDate() + 1).toString();
    var month = (date.getMonth() + 1).toString();
    var heroes = names[month][day];
    if (heroes.length < 0  ) {
      handleError(res, err.message, "Failed to get names.");
    } else {
      res.status(200).json({'name': heroes, 'date': date});
    }
  } else {
    res.status(403).json({status: "Not authorized"});
  }
});