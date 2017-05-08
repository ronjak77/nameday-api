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

function formatToHuman(month, day) {
  var monthName;
  switch(month) {
    case 1:
      monthName = "Tammi";
      break;
    case 2:
      monthName = "Helmi";
      break;
    case 3:
      monthName = "Maalis";
      break;
    case 4:
      monthName = "Huhti";
      break;
    case 5:
      monthName = "Touko";
      break;
    case 6:
      monthName = "Kesä";
      break;
    case 7:
      monthName = "Heinä";
      break;
    case 8:
      monthName = "Elo";
      break;
    case 9:
      monthName = "Syys";
      break;
    case 10:
      monthName = "Loka";
      break;
    case 11:
      monthName = "Marras";
      break;
    case 12:
      monthName = "Joulu";
      break;
    default:
      monthName = "";
  }
  var formattedString = "" + monthName + "kuun " + day + ".";
  return formattedString;
}

app.get("/today", function(req, res) {
  var date = new Date();
  var day = date.getDate().toString();
  var month = (date.getMonth() + 1).toString();
  var heroes = names[month][day];
  if (heroes.length < 0  ) {
    handleError(res, "Failed to get names.", "Failed to get names.");
  } else {
    res.status(200).json({'name': heroes, 'date': date});
  }
});

app.get("/name/:name", function(req, res) {

  var result = "";
  var resultMsg = "";
  var name = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);

  for (var i = 11; i >= 0; i--) {
    var month = names2[i];
    for (var j = month.length - 1; j >= 0; j--) {
      if(month[j].indexOf(name) >= 0) {
        result = (j+1) + "." + (i+1) + ".";
        resultMsg = formatToHuman(i+1, j+1);
        break;
      }
    }
  }

  if(result.length > 0) {
    res.status(200).json({'name': req.params.name, 'date': result, 'resultMsg': resultMsg});
  }
  else {
    handleError(res, "Failed to find date.", ("Failed to find any namedays for input " + req.params.name ) );
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