const formidable = require("formidable");
const nodePath = require("path");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");
const { deleteFile } = require("../../util/files");

const mediaDestroyHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData) => {
    if (err) {
      return next(err);
    }
    const validator = validate(formData, {
      path: ["required"],
    });
    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    const { path } = formData;
    let isUrl = false;
    try {
      const url = new URL(path);
      isUrl = url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
      isUrl = false;
    }

    const removeFromLibrary = (libary) => {
      return libary
        .all()
        .filter((a) => a.media.find(({ src }) => src === path))
        .map((a) => {
          a.media = a.media.filter(({ src }) => src !== path);
          libary.put(a);
          return a.id;
        });
    };

    // @TODO is this needed elsewhere?
    const plural = (c, s, p) => (c > 1 ? `${c} ${p}` : `${c} ${s}`);

    let deleted = false;
    if (!isUrl) {
      deleted = deleteFile(nodePath.join(nodePath.resolve("public"), path));
    }

    try {
      const Settings = require("../../settings");
      const settingsUpdated = Object.entries(Settings.all())
        .filter(([, value]) => value === path)
        .map(([key]) => (Settings.put(key, null) ? key : null))
        .filter((a) => a);

      const bIds = removeFromLibrary(require("../../models/Breweries"));
      const tIds = removeFromLibrary(require("../../models/Drinks"));
      let idsUpdatedMsg = "no entities were updated";
      if (bIds.length || tIds.length) {
        idsUpdatedMsg = "";
        if (bIds.length) {
          idsUpdatedMsg += plural(bIds.length, "brewery", "breweries");
          if (tIds.length) idsUpdatedMsg += " and ";
        }
        if (tIds.length) {
          idsUpdatedMsg += plural(tIds.length, "drink", "drinks");
        }

        idsUpdatedMsg +=
          (bIds.length === 1 && tIds.length === 0) ||
          (bIds.length === 0 && tIds.length === 1)
            ? "was"
            : "were";
        idsUpdatedMsg += " updated.";
      }

      return respondWithJSON(res, {
        error: false,
        deleted,
        isUrl,
        message:
          !deleted && !isUrl
            ? `No file to delete and ${idsUpdatedMsg}`
            : deleted
            ? `File removed and ${idsUpdatedMsg}`
            : `Updated and ${idsUpdatedMsg}`,
        settingsUpdated,
        breweryIds: bIds,
        tapIds: tIds,
      });
    } catch (e) {
      return respondWithJSON(
        res,
        { error: true, deleted, isUrl, message: "Something went wrong!" },
        500
      );
    }
  });
};

module.exports = {
  mediaDestroyHandler,
};
