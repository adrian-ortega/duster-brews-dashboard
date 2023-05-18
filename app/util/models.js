const ModelCollection = require("../models/Collection");
const { objectHasKey } = require("./helpers");
const { moveUploadedFile } = require("./files");
const { FILE_UPLOADS_FOLDER, FILE_UPLOADS_FOLDER_PATH } = require("./index");

const updateItemPrimaryImage = async (item, file, collection) => {
  if (
    !objectHasKey(item, "id") ||
    (objectHasKey(file, "size") && file.size === 0)
  ) {
    return false;
  }

  const ext = file.originalFilename.split(".").pop();
  const filename = `${file.newFilename}.${ext}`;

  // This is the object finally stored, and the object returned in the
  // result message.
  //
  const image = {
    primary: true,
    timestamp: new Date().getTime(),
    src: `${FILE_UPLOADS_FOLDER}/${filename}`,
  };

  await moveUploadedFile(
    file.filepath,

    // @TODO categorize items by model type?
    `${FILE_UPLOADS_FOLDER_PATH}/${filename}`
  );

  // Reset all old images' primary flag.
  //
  item.media = [...item.media].map((m) => ({ ...m, primary: false }));
  item.media.push(image);

  if (collection && collection instanceof ModelCollection) {
    collection.put(item);
  }

  return item;
};

module.exports = {
  updateItemPrimaryImage,
};
