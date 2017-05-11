var express = require("express");
var path = require("path");
var names = require("./resources/nimet.json");
var names2 = require("./resources/nimet2.json");
var flags = require("./resources/flags.json");

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
      monthName = "tammi";
      break;
    case 2:
      monthName = "helmi";
      break;
    case 3:
      monthName = "maalis";
      break;
    case 4:
      monthName = "huhti";
      break;
    case 5:
      monthName = "touko";
      break;
    case 6:
      monthName = "kesä";
      break;
    case 7:
      monthName = "heinä";
      break;
    case 8:
      monthName = "elo";
      break;
    case 9:
      monthName = "syys";
      break;
    case 10:
      monthName = "loka";
      break;
    case 11:
      monthName = "marras";
      break;
    case 12:
      monthName = "joulu";
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
  var celebrations = "";
  var name = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
  var resultDay;
  var resultMonth;
  for (var i = 11; i >= 0; i--) {
    var month = names2[i];
    for (var j = month.length - 1; j >= 0; j--) {
      if(month[j].indexOf(name) >= 0) {
        result = (j+1) + "." + (i+1) + ".";
        resultDay = j+1;
        resultMonth = i+1;
        resultMsg = formatToHuman(i+1, j+1);
        break;
      }
    }
  }

  if(result.length > 0) {
    var other_names = names[resultMonth][resultDay];
    var location = other_names.indexOf(name);
    other_names.splice(location, 1);
    if(flags[resultMonth] != undefined) {
      if(flags[resultMonth][resultDay] != undefined) {
        celebrations = flags[resultMonth][resultDay];
      }
    };

    res.status(200).json({'name': name, 'date': result, 'resultMsg': resultMsg, 'orig_name': req.params.name, 'other_names': other_names, 'celebrations': celebrations });
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

    var celebrations = "";
    month = parseInt(month, 10);
    day = parseInt(day, 10);
    if(flags[month] != undefined) {
      if(flags[month][day] != undefined) {
        celebrations = flags[month][day];
      }
    };

    if(heroes && heroes.length > 0) {
      res.status(200).json({'name': heroes, 'celebrations': celebrations });
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