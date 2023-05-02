const defaultHandler = require('./log/default-handler');

const LOGGER_FATAL = 0;
const LOGGER_ERROR = 1;
const LOGGER_WARN = 2;
const LOGGER_INFO = 3;
const LOGGER_DEBUG = 4;
const LOGGER_TRACE = 5;
const LEVELS = {
    fatal: LOGGER_FATAL,
    error: LOGGER_ERROR,
    warn: LOGGER_WARN,
    info: LOGGER_INFO,
    debug: LOGGER_DEBUG,
    trace: LOGGER_TRACE
};
const LEVEL_NAMES = {
    [LOGGER_FATAL]: 'Fatal',
    [LOGGER_ERROR]: 'Error',
    [LOGGER_WARN]: 'Warning',
    [LOGGER_INFO]: 'Info',
    [LOGGER_DEBUG]: 'Debug',
    [LOGGER_TRACE]: 'Trace',
};

class Logger {
    constructor(handlers = []) {
        this.levels = {...LEVELS};
        this.levelNames = {...LEVEL_NAMES};
        this.handlers = handlers;
    }

    clear () {
        // temporary and really just sugar
        console.clear();
    }

    log({message, context = {}, type = 3}) {
        const tp = (new Date());
        const pad = n => n> 10? n : `0${n}`;
        const timestamp = `[${pad(tp.getHours())}:${pad(tp.getMinutes())}]`;
        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            handler.apply(this, [{
                message,
                context,
                type,
                levels: this.levels,
                levelNames: this.levelNames,
                timestamp
            }]);
        }
    }

    fatal(message, context = {}) {
        this.log({message, context, type: this.levels.fatal});
    }

    error(message, context = {}) {
        this.log({message, context, type: this.levels.error});
    }

    warn(message, context = {}) {
        this.log({message, context, type: this.levels.warn});
    }

    info(message, context = {}) {
        this.log({message, context, type: this.levels.info});
    }

    debug(message, context = {}) {
        this.log({message, context, type: this.levels.debug});
    }

    trace(message, context = {}) {
        this.log({message, context, type: this.levels.trace});
    }
};

module.exports = new Logger([defaultHandler]);