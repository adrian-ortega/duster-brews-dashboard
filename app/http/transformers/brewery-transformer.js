const Taps = require("../../models/Taps");
const { objectHasKey, isEmpty } = require("../../util/helpers");
module.exports = async (brewery) => {
  let count = { total: 0, active: 0 };
  let image = brewery.media.find((m) => m.primary);
  if (!image) {
    image = null;
  }

  const taps = Taps.all().filter(({ brewery_id }) => brewery.id === brewery_id);
  if (taps.length > 0) {
    count.total = taps.length;
    count.total = taps.filter(({ active }) => active).length;
  }

  return {
    ...brewery,
    image,
    count,
    media: brewery.media.filter(
      (m) => objectHasKey(m, "src") && !isEmpty(m.src)
    ),
  };
};
