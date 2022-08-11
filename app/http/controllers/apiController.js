const respondWithJSON = (res, data, meta = {}) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ data, meta })
}

const widgetsView = (req, res) => {
  respondWithJSON(res, [
    'lol'
  ]);
};

module.exports = {
  widgetsView
}