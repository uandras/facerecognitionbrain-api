//tips for code review:
// - don't have to do everything in server.js (see "controllers" folder)
//      but, beware to pass all the parameters needed (p.e.: db, bcrypt)

const express = require("express");
const bodyParser = require("body-parser"); //ez kell a json küldemények parse-olásához
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

//a knex függvény meghívásával inicializáljuk az adatbázist
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "uatest",
    password: "123",
    database: "smartbrain"
  }
});

//a következő kikommentezett blokk egy példa a select-re
/*
db.select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });
*/

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("up and working");
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt); //a db és a bcrypt: "dependency injection"
}); //ez azért kell, hogy átadjuk a bcrypt-et ésa a db-t, mert a másik file azt nem ismeri

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

/*
* / --> res="This is working"
* /signin --> POST = success/fail
* /register --> POST = user object
* /profile:userId --> GET = user
* /image --> PUT --> updated user object
* */

/*
bcrypt.hash("bacon", null, null, function(err, hash) {
  // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
  // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
  // res = false
});
*/
