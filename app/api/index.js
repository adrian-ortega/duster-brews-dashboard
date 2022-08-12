const { google } = require('googleapis');
const { authorize } = require('./google/auth');
const { getKegsFromGoogleSheets } = require('./plaato')
const { wait } = require("../util/helpers");

let fetchingBeersFromGoogleSheets = false;
const getBeersFromGoogleSheets = async () => {
  if(fetchingBeersFromGoogleSheets) {
    await wait(10);
    return getBeersFromGoogleSheets();
  }

  fetchingBeersFromGoogleSheets = true;
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetsResponse = sheets.spreadsheets.values.get({
    spreadsheetId: '1BxvDhm1t2vnh5vSwpPjEMgBURN6GGVJhDFkpPJPBoHA',
    range: 'Brews!A2:E'
  });
  fetchingBeersFromGoogleSheets = false;
  const transformer = async (row) => ({
    id: row[0],
    brewery: row[1],
    style: row[2],
    name: row[3],
    background_image: row[4]
  });
  const filter = (row) => row[0] && row[1] && row[2] && row[3];
  const { data } = sheetsResponse
  return (data.values ? await Promise.all(data.values.filter(filter).map(transformer)) : []);
};

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
