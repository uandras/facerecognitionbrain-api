const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body; //destructuring, hogy áttekinthetőbb legyen
  const hash = bcrypt.hashSync(password, 10);
  //mivel egyszerre két táblát kell frissítenünk, tranzakciót használunk, hogy ne legyen inkonzisztencia
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.status(200).json(user);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }) //end transaction
    //    .catch(err => res.status(400).json(err)); //de ez egy kurva nagy security hole, mert egy csomó infó visszamegy ezzel a hibaüzenettel a kliens felé, ezért a módosított catch a következő sorban
    .catch(err => res.status(400).json("unable to register"));
  //adatbázis előtt ez volt
  /*
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.status(200).json(database.users[database.users.length - 1]);
*/
};

module.exports = {
  handleRegister: handleRegister
};
