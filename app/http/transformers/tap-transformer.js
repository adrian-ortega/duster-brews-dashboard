const Plaato = require("../../api/plaato");
const { isEmpty } = require("../../util/helpers");

const transformDate = (d) => (d ? new Date(d) : null);

module.exports = async (tap) => {
  const overrides = {};
  if (tap.active && !isEmpty(tap.token)) {
    overrides.keg_date = await Plaato.get(Plaato.pins.keg_date, transformDate);
  }

  return {
    ...tap,
    ...overrides,
  };
};
