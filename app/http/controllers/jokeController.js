const axios = require("axios");
const { respondWithJSON } = require("../../util/http");
const getJoke = async (req, res) => {
  const { data } = await axios.get("https://api.chucknorris.io/jokes/random");
  return respondWithJSON(res, data.value);
};

module.exports = {
  getJoke,
};
