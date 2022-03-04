var mongoose = require("mongoose");

async function initdb() {
  var db_name = "urlshortener"
  var db_user = "user24"
  var db_password = "user24"
  var uri =
    `mongodb+srv://${db_user}:${db_password}@cluster0.wl37o.mongodb.net/${db_name}?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(uri, (err) => {
      if (err) console.log(err);
      console.log("Database Connected");
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports.initdb = initdb;
