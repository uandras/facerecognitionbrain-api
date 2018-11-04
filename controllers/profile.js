const handleProfile = (req, res, db) => {
  //a :id miatt a profile után bármilyen id-t elküldhetünk a frontenden, azt itt fel tudjuk dolgozni
  const { id } = req.params;
  db("users")
    .where("id", id) //a végére kéne .select(mezők) is, de ha select * akkor az elhagyható
    .then(user => {
      if (user.length === 0) res.status(404).json("no such user");
      else res.status(200).json(user[0]);
    })
    .catch(err => res.status(400).json("Error getting user"));
};

module.exports = {
  handleProfile: handleProfile
};
