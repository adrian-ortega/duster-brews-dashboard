const { faker } = require("@faker-js/faker");
const path = require("path");
const { saveFile } = require("./app/util/files");
const BEER_STYLES = [
  "Lager",
  "Stout",
  "Ale",
  "Pale Ale",
  "Inda Pale Ale",
  "Bitter",
  "Saison",
  "Pilsner",
];
const randomFrom = (a) => a[Math.floor(Math.random() * a.length)];
const generateImages = () =>
  !randomFrom([true, false])
    ? []
    : [
        {
          primary: true,
          timestamp: faker.date.past().getTime(),
          src: faker.image.url(),
        },
      ];

const generateBreweries = async (total = 5) => {
  const items = new Array(total).fill(0).map(() => ({
    id: faker.string.nanoid(),
    name: faker.company.name(),
    media: generateImages(),
  }));
  saveFile(path.resolve("storage/breweries.db.json"), { items });

  return items;
};

const TAP_GROUPS = [
  { name: "Dr. Shakalu", max: 4 },
  { name: "Back Bar", max: 5 },
];

const generateTaps = async () => {
  const items = [];
  for (let c = 0; c < TAP_GROUPS.length; c++) {
    const group = TAP_GROUPS[c];
    for (let i = 0; i < group.max; i++) {
      items.push({
        id: faker.string.nanoid(),
        name: `${group.name} #${i + 1}`,
        token: null,
        percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
        keg_date: faker.date.past().toISOString(),
        active: faker.datatype.boolean(),
      });
    }
  }

  saveFile(path.resolve("storage/taps.db.json"), { items });

  return items;
};

const generateDrinks = async (breweries, taps, total = 25) => {
  let _taps = [...taps];
  const items = new Array(total).fill(0).map(() => {
    let active = faker.datatype.boolean();
    let tap_id = null;
    const brewery = randomFrom(breweries);

    if (active && _taps.length) {
      const tap = _taps.pop();
      tap_id = tap.id;
    }

    return {
      id: faker.string.nanoid(),
      brewery_id: brewery.id,
      tap_id,
      name: faker.commerce.product(),
      style: randomFrom(BEER_STYLES),
      media: generateImages(),
      active,
      gravity_start: faker.number.float({ min: 1, max: 2, precision: 0.001 }),
      gravity_end: faker.number.float({ min: 1, max: 2, precision: 0.001 }),
      abv: faker.number.float({ min: 3, max: 15, precision: 0.01 }),
      ibu: faker.number.int({ min: 20, max: 75 }),
    };
  });

  saveFile(path.resolve("storage/drinks.db.json"), { items });

  return items;
};

const generate = async () => {
  const items = await generateDrinks(
    await generateBreweries(randomFrom([5, 10, 4, 15])),
    await generateTaps(),
    randomFrom([33, 25, 30, 20, 23, 40])
  );
  console.log(`Created ${items.length} items`);
};

(async () => {
  await generate();
  process.exit();
})();
