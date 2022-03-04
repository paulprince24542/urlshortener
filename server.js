require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

//Mongo Db Connection
var { initdb } = require("./config/mongoDb");

//String Generator
var shortid = require("shortid");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

initdb();

//Models
var urlModel = require("./models/url.model");

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async function (req, res) {
  var url = req.body.url;
  var splitUrl = url.split("://");
  if (splitUrl[0] == "https" || splitUrl[0] == "http") {
    console.log("url");
    urlModel.findOne(
      {
        url: url,
      },
      (err, foundUrl) => {
        if (err) console.log(err);
        if (foundUrl == null) {
          var newUrl = new urlModel({
            url: url,
            shorturl: shortid.generate(),
          });
          newUrl.save((err, savedUrl) => {
            if (err) console.log(err);
            if (savedUrl._id) {
              res.status(200).json({
                original_url: savedUrl.url,
                short_url: savedUrl.shorturl,
              });
            }
          });
        } else {
          res.status(200).json({
            original_url: foundUrl.url,
            short_url: foundUrl.shorturl,
          });
        }
      }
    );
  } else {
    res.status(400).json({
      error: 'invalid url',
    });
  }
});

app.get("/api/shorturl/:short_url", async function (req, res) {
  var short_url = req.params.short_url;

  urlModel.findOne(
    {
      shorturl: short_url,
    },
    (err, foundShortUrl) => {
      if (err) console.log(err);
      if (foundShortUrl == null) {
        res.status(400).json({
          msg: "URL not found",
        });
      } else {
        console.log("Redirect Initiated");
        res.redirect(foundShortUrl.url);
      }
    }
  );
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
