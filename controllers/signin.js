const handleSignin = (req, res, db, bcrypt) => {
  //res.send("signin");//ezt így is lehetne, de .send helyett a .json-t használjuk, ami egy kicsit nagyobb tudású, mint a .send
  //res.json("signin");
  console.log(req.body.email);
  db.select("email", "hash")
    .from("login")
    .where("email", req.body.email)
    .then(data => {
      console.log(data[0]);
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db.select("*")
          .from("users")
          .where("email", req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin
};
