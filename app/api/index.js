const { getKegsFromGoogleSheets } = require('./plaato');
const { getBeersFromGoogleSheets } = require('./google');

const EMPTY_BEER_ID = 'EMPTY'

/**
 * @return {Promise<Object[]>}
 */
const getWidgetItems = async (timestamp = 0) => {
  const [ kegs, beers ] = await Promise.all([
    getKegsFromGoogleSheets(timestamp),
    getBeersFromGoogleSheets(timestamp)
  ]);

  return kegs.map((keg) => {
    try {
      const beer = beers.find(beer => beer.id === keg.id && beer.id !== EMPTY_BEER_ID);
      beer.keg = keg;
      return beer;
    } catch (e) {
      return null;
    }
  }).filter(a => a);
};

module.exports = {
  getWidgetItems
}
