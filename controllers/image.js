const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "69f4a37f28664a1996fbea732ea3c4c8"
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to use API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      res.status(400).json("unable to get entries");
    });
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
