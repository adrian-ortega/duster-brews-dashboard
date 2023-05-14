const NANOID_DEFAULT_LENGTH = 5;
const NANOID_DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const makeId = (size = NANOID_DEFAULT_LENGTH, chars = NANOID_DEFAULT_CHARS) => {
  return [...Array(size)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
};

module.exports = {
  makeId,
};
