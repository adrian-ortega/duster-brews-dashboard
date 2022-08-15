const axios = require('axios')
const { authorize, google } = require('../google/auth');
const {wait} = require("../../util/helpers");

const PLAATO_API_BASE_URI = 'https://plaato.blynk.cc'
// https://intercom.help/plaato/en/articles/5004722-pins-plaato-keg
const PINS = {
  pour: 'v47',
  percent_beer_left: 'v48',
  pouring: 'v49',
  amount_left: 'v51',
  raw_temperature: 'v56',
  last_pour: 'v56',
  empty_keg_weight: 'v62',
  beer_style: 'v64',
  original_gravity: 'v65',
  final_gravity: 'v66',
  keg_date: 'v67',
  abv: 'v68',
  temperature: 'v69',
  unit: 'v71',
  mass_unit: 'v73',
  beer_left_unit: 'v74',
  measure_unit: 'v75',
  max_keg_volume: 'v76',
  wifi_strength: 'v81',
  volume_unit: 'v82',
  leak_detection: 'v83',
  min_temperature: 'v86',
  max_temperature: 'v87',

  app_mode: 'v88',
  scale_sensitivity: 'v89',
  firmware_version: 'v93',
}

const plaatoGet = (token, pin, keg, key) => axios.get(`${PLAATO_API_BASE_URI}/${token}/get/${pin}`)
  .then(({ data }) => {keg[key] = data[0]}).catch(() => { keg[key] = null });

let fetchingFromGoogleSheets = false
const getKegsFromGoogleSheets = async () => {
  if (fetchingFromGoogleSheets) {
    await wait(10);
    return getKegsFromGoogleSheets();
  }

  fetchingFromGoogleSheets = true
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth })
  const sheetsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: '1BxvDhm1t2vnh5vSwpPjEMgBURN6GGVJhDFkpPJPBoHA',
    range: 'Plaato Keg Auth_Tokens!A2:B'
  });
  fetchingFromGoogleSheets = false
  const transformer = async ([ keg_name, token ]) => {
    const keg = { keg_name, token };
    await Promise.all([
      plaatoGet(token, PINS.beer_style, keg, 'id'),
      plaatoGet(token, PINS.abv, keg, 'abv'),
      plaatoGet(token, PINS.volume_unit, keg, 'volume_unit'),
      plaatoGet(token, PINS.keg_date, keg, 'keg_date'),
      plaatoGet(token, PINS.amount_left, keg, 'remaining'),
      plaatoGet(token, PINS.max_keg_volume, keg, 'max_keg_volume'),
      plaatoGet(token, PINS.last_pour, keg, 'last_pour'),
      plaatoGet(token, PINS.pouring, keg, 'pouring')
    ]);
    return keg;
  };
  const filter = ([name, token]) => name && token;
  const { data } = sheetsResponse
  return (data.values ? await Promise.all(data.values.filter(filter).map(transformer)) : []);
};

module.exports = {
  getKegsFromGoogleSheets
}
