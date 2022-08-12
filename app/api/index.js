const { google } = require('googleapis');
const { authorize } = require('./google/auth');
const { getKegsFromGoogleSheets } = require('./plaato')
const SAMPLE_WIDGET = {
  // style: 'Lager',
  // name: 'Beer One',
  abv: '8.5% ABV',
  status: 'Idle',
  remaining: '48%',
  created_at: '11/11/2022',
  last_pour: '12.2oz'
};

const getBeersFromGoogleSheets = () => new Promise((resolve, reject) => {
  authorize().then((auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
      spreadsheetId: '1BxvDhm1t2vnh5vSwpPjEMgBURN6GGVJhDFkpPJPBoHA',
      range: 'Brews!A2:E'
    }, (err, res) => {
      if (err) {
        reject(err);
        return console.log('The API returned an error:', err);
      }

      const transformer = ([ id, brewery = null, style = null, name = null, background_image = null ]) => ({
        id,
        brewery,
        style,
        name,
        background_image
      });
      const filter = (item) => item.id && item.brewery && item.style && item.name
      resolve(res.data.values ? res.data.values.map(transformer).filter(filter) : []);
    });
  });
});

const getWidgetItems = async () => {
  const kegs = await getKegsFromGoogleSheets();
  let beers = await getBeersFromGoogleSheets();

  beers = beers.map((beer) => {
    beer.keg = kegs.find(keg => keg.id === beer.id)
    return beer
  });

  return beers
};

module.exports = {
  getWidgetItems
}