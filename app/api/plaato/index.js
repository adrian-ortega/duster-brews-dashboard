const axios = require('axios')
const { authorize, google } = require('../google/auth');

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

const plaatoGet = (token, pin) => axios.get(`${PLAATO_API_BASE_URI}/${token}/get/${pin}`)
  .then(({ data }) => data[0]).catch(() => null);

const getKegsFromGoogleSheets = async () => {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth })
  const sheetsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: '1BxvDhm1t2vnh5vSwpPjEMgBURN6GGVJhDFkpPJPBoHA',
    range: 'Plaato Keg Auth_Tokens!A2:B'
  });

  const transformer = async ([ keg_name, token ]) => {
    const keg = { keg_name, token };
    await Promise.all([
      plaatoGet(token, PINS.beer_style).then(value => {keg.id = value}),
      plaatoGet(token, PINS.abv).then(value=> {keg.abv = value}),
      plaatoGet(token, PINS.volume_unit).then(value => { keg.volume_unit = value }),
      plaatoGet(token, PINS.keg_date).then(value => { keg.created_at = value }),
      plaatoGet(token, PINS.amount_left).then(value => { keg.remaining = value }),
      plaatoGet(token, PINS.max_keg_volume).then(value => { keg.max = value }),
      plaatoGet(token, PINS.last_pour).then(value => { keg.las_pour = value })
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
