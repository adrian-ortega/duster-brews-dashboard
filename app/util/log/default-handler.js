const chalk = require("chalk");
const { isEmpty } = require("../helpers");
const { DEBUG } = require("../../../config");

module.exports = ({ message, context, type, levels, timestamp }) => {
  switch (type) {
    case levels.fatal:
    case levels.error:
      message = chalk.red(message);
      break;
    case levels.warn:
      message = chalk.yellow(message);
      break;
    case levels.info:
      message = chalk.cyan(message);
      break;
  }

  const args = [`${chalk.gray(timestamp)} ${message}`];

  if (DEBUG && !isEmpty(context)) {
    args.push(context);
  }

  console.log.apply(null, args);
};
