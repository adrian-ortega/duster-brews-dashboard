const Plaato = require("../../api/plaato");
const Taps = require("../../models/Taps");
const Breweries = require("../../models/Breweries");
const { isEmpty, objectHasKey } = require("../../util/helpers");
const locationTransformer = require("./tap-transformer");

const transformFloat = (a) => (!a || isNaN(a) ? 0 : parseFloat(a));

const {
  abv: abvPin,
  keg_date: kegDatePin,
  original_gravity: oGPin,
  final_gravity: fGPin,
  percent_beer_left: percentPin,
} = Plaato.pins;

module.exports = async (drink) => {
  let tap = Taps.get(drink.tap_id);
  if (tap) {
    tap = await locationTransformer(tap);
  }

  const brewery = Breweries.get(drink.brewery_id);
  const overrides = {
    image: drink.media.find((m) => m.primary)
      ? drink.media.find((m) => m.primary).src
      : null,
    brewery_name: brewery && brewery.name,
    brewery_image:
      brewery && brewery.media.find((c) => c.primary)
        ? brewery.media.find((c) => c.primary).src
        : null,
    media: drink.media.filter((m) => objectHasKey(m, "src") && !isEmpty(m.src)),
    ibu: transformFloat(drink.ibu),
  };

  if (!isEmpty(tap) && !isEmpty(tap.token)) {
    Plaato.setToken(tap.token);
    overrides.abv = await Plaato.get(abvPin, transformFloat);
    overrides.gravity_start = await Plaato.get(oGPin, transformFloat);
    overrides.gravity_end = await Plaato.get(fGPin, transformFloat);
    overrides.percent_left = await Plaato.get(percentPin, transformFloat);
    Plaato.clear();
  }

  return {
    ...drink,
    ...overrides,
  };
};
