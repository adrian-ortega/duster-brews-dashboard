const respondWithJSON = (res, data, meta, status = 200) => {
  const response = { data };
  if (meta && !isNaN(meta)) {
    status = meta;
    meta = undefined;
  }
  if (meta) {
    response.meta = meta;
  }
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(response);
};

module.exports = {
  respondWithJSON,
};
