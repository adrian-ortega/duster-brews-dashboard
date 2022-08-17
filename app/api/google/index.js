const { wait } = require('../../util/helpers');
const { authorize } = require('./auth');
const { google } = require('googleapis');

let fetchingBeersFromGoogleSheets = false;

const beerTransformer = async (row) => ({
  id: row[0],
  brewery: row[1],
  style: row[2],
  name: row[3],
  background_image: row[4]
});

const beerFilter = (row) => row[0] && row[1] && row[2] && row[3];

const getBeersFromGoogleSheets = async () => {
  try {
    if (fetchingBeersFromGoogleSheets) {
      await wait(10);
      return getBeersFromGoogleSheets();
    }

    fetchingBeersFromGoogleSheets = true;
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: '1BxvDhm1t2vnh5vSwpPjEMgBURN6GGVJhDFkpPJPBoHA',
      range: 'Brews!A2:E'
    });
    fetchingBeersFromGoogleSheets = false;
    const { data } = sheetsResponse
    return (data.values ? await Promise.all(data.values.filter(beerFilter).map(beerTransformer)) : []);
  } catch (e) {
    console.log('Error happened in getBeersFromGoogleSheets:', e);
    return [];
  }
};

module.exports = {
  getBeersFromGoogleSheets
};