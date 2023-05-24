const { faker } = require("@faker-js/faker");
const path = require("path");
const { saveFile } = require("./app/util/files");

const generateImage = () => ({
  primary: true,
  timestamp: new Date().getTime(),
  src: faker.image.url,
});

const generateBreweries = async () => {
  const items = new Array(5).fill(0).map(() => ({
    id: faker.string.nanoid(),
    name: faker.company.name(),
    media: [generateImage()],
  }));

  saveFile(path.resolve("storage/breweries.db.json"), { items });

  return items;
};

const generateTapLocations = async () => {
  const items = new Array(13).fill(0).map((_, i) => {
    return {
      id: faker.string.nanoid(),
      name: `Tap ${i + 1}`,
      token: faker.string.nanoid(),
      percentage: faker.number.float({min: 0, max: 100, precision: 0.01 }),
      active: true
    };
  });

  saveFile(path.resolve("storage/tap-locations.db.json"), { items });

  return items;
};

const generateTaps = async (breweries, locations) => {
  let locs = [...locations];
  const items = new Array(25).fill(0).map(() => {
    let active = faker.datatype.boolean();
    let location_id = null;
    const brewery = breweries[Math.floor(Math.random() * breweries.length)];

    if (active && locs.length) {
      const loc = locs.pop();
      location_id = loc.id;
    }

    return {
      id: faker.string.nanoid(),
      brewery_id: brewery.id,
      location_id,
      name: faker.commerce.product(),
      style: faker.commerce.productAdjective(),
      media: [generateImage()],
      active,
      gravity: {
        start: faker.number.float({ min: 1, max: 2, precision: 0.001 }),
        end: faker.number.float({ min: 1, max: 2, precision: 0.001 }),
      },
      abv: faker.number.float({ min: 3, max: 15, precision: 0.01 }),
      ibu: faker.number.int({ min: 20, max: 75 }),
    };
  });

  saveFile(path.resolve("storage/taps.db.json"), { items });

  return items;
};

const generate = async () => {
  const items = await generateTaps(
    await generateBreweries(),
    await generateTapLocations()
  );
  console.log(`Created ${items.length} items`);
};

(async () => {
  await generate();
  process.exit();
})();
