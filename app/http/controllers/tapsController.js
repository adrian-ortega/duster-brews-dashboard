const formidable = require("formidable");
const Taps = require("../../models/Taps");
const BreweriesCollection = require("../../models/Breweries");
const { respondWithJSON } = require("../../util/http");
const { validate } = require("../../validation");
const { moveUploadedFile } = require("../../util/files");
const { FILE_UPLOADS_FOLDER_PATH, FILE_UPLOADS_FOLDER } = require("../../util");

const tapsGetHandler = (req, res) => respondWithJSON(res, Taps.all());
const tapsGetFieldsHandler = (req, res) =>
  respondWithJSON(res, [
    {
      label: "Name",
      name: "name",
      value: null,
      type: "text",
      required: true,
    },
    {
      label: "Brewery",
      name: "brewery_id",
      value: null,
      type: "select",
      required: true,
      options: BreweriesCollection.all().map((brewery) => {
        return {
          value: brewery.id,
          text: brewery.name,
        };
      }),
    },
    {
      label: "Style",
      name: "style",
      value: null,
      type: "text",
      required: true,
    },
    {
      label: "Gravity Start",
      name: "gravity_start",
      value: null,
      type: "text",
    },
    {
      label: "Gravity End",
      name: "gravity_end",
      value: null,
      type: "text",
    },
    {
      label: "ABV",
      name: "abv",
      value: null,
      type: "text",
    },
    {
      label: "IBU",
      name: "ibu",
      value: null,
      type: "text",
    },
  ]);

const tapsPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validator = validate(
      { ...formData, ...files },
      {
        name: "required",
        brewery_id: ["required", "breweryExists"],
        style: "required",
      }
    );

    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    const tap = Taps.create({
      brewery_id: formData.brewery_id,
      name: formData.name,
      style: formData.style,
    });

    return respondWithJSON(res, tap);
  });
};

const tapsMediaHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      next(err);
    }
    const validator = validate(
      { ...formData, ...files },
      {
        media: ["required", "isValidImage"],
        tap_id: ["required", "tapExists"],
      }
    );
    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    const filename = `${files.media.newFilename}.${files.media.originalFilename
      .split(".")
      .pop()}`;

    // This is the object finally stored, and the object returned in the 
    // result message.
    //
    const image = {
      primary: true,
      src: `${FILE_UPLOADS_FOLDER}/${filename}`,
    };

    await moveUploadedFile(
      files.media.filepath,
      `${FILE_UPLOADS_FOLDER_PATH}/${filename}`
    );

    const tap = Taps.get(formData.tap_id);

    // Reset all old images' primary flag.
    //
    tap.media = tap.media.map(image => ({ ...image, primary: false }));

    // Add the latest primary image, push to the tap then update.
    tap.media.push(image);
    Taps.put(tap);

    return respondWithJSON(res, {
      status: "success",
      image,
    });
  });
};

module.exports = {
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
};
