const Settings = require("../../settings");
const { APP_NAMESPACE, APP_NAME } = require("../../../config");
const defaultHandler = (req, res) => {
  res.render("index", {
    locals: {
      theme: Settings.get("theme", "default"),
      title: `${APP_NAME} - Home`,
      APP_NAMESPACE,
      APP_NAME,
    },
  });
};

module.exports = {
  defaultHandler,
};
