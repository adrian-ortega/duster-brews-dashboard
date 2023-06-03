const Plaato = require("../../api/plaato");
const Locations = require("../../models/TapLocations");
const Breweries = require("../../models/Breweries");
const { isEmpty, objectHasKey } = require("../../util/helpers");
const locationTransformer = require("./location-transformer");

const {
  abv: abvPin,
  keg_date: kegDatePin,
  original_gravity: oGPin,
  final_gravity: fGPin,
  percent_beer_left: percentPin,
} = Plaato.pins;

module.exports = async (tap) => {
  let location = Locations.get(tap.location_id);
  if (location) {
    location = await locationTransformer(location);
  }

  const brewery = Breweries.get(tap.brwery_id);
  const overrides = {
    image: tap.media.find((m) => m.primary)
      ? tap.media.find((m) => m.primary).src
      : null,
    brewery_name: brewery && brewery.name,
    brewery_image:
      brewery && brewery.media.find((c) => c.primary)
        ? brewery.media.find((c) => c.primary).src
        : null,
    media: tap.media.filter((m) => objectHasKey(m, "src") && !isEmpty(m.src)),
    ibu: parseFloat(tap.ibu),
  };

  if (!isEmpty(location) && !isEmpty(location.token)) {
    Plaato.setToken(location.token);
    overrides.abv = await Plaato.get(abvPin, parseFloat);
    overrides.keg_date = await Plaato.get(kegDatePin, (d) => new Date(d));
    overrides.gravity_start = await Plaato.get(oGPin, parseFloat);
    overrides.gravity_end = await Plaato.get(fGPin, parseFloat);
    overrides.percent_left = await Plaato.get(percentPin, parseFloat);
    Plaato.clear();
  }

  return {
    ...tap,
    ...overrides,
  };
};
