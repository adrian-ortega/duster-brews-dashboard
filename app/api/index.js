const getWidgetItems = async () => {
  return [ {
    style: 'Lager',
    name: 'Beer One',
    abv: '8.5% ABV',
    status: 'Idle',
    remaining: '48%',
    created_at: '11/11/2022',
    last_pour: '12.2oz'
  }, {
    style: 'Lager',
    name: 'Beer One',
    abv: '8.5% ABV',
    status: 'Idle',
    remaining: '48%',
    created_at: '11/11/2022',
    last_pour: '12.2oz'
  } ];
}

module.exports = {
  getWidgetItems
}