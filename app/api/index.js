const { getKegsFromGoogleSheets } = require('./plaato')
const { getBeersFromGoogleSheets } = require('./google')

/**
 * @return {Promise<Object[]>}
 */
const getWidgetItems = async () => {
  const [ kegs, beers ] = await Promise.all([
    getKegsFromGoogleSheets(),
    getBeersFromGoogleSheets()
  ])

  return beers.map((beer) => {
    beer.keg = kegs.find(keg => keg.id === beer.id)
    if (beer.keg && beer.keg.id) {
      delete beer.keg.id;
    }
    return beer
  });
};

module.exports = {
  getWidgetItems
}
