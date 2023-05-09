const respondWithJSON = (res, data, meta) => {
  res.setHeader("Content-Type", "application/json");
  const response = { data };
  if (meta) {
    response.meta = meta;
  }
  res.json(response);
};

module.exports = {
    respondWithJSON
}