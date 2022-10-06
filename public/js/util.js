/**
 * Does nothing, No Operation
 * @constructor
 */
const NOOP = () => {};

/**
 * Will take a JSON string and try to convert it into an object.
 * On any failure, `defaultValue` will be returned
 * @param {string} str
 * @param {*} defaultValue
 * @return {null|*}
 */
const parseJson = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log('Invalid JSON', str);
        return defaultValue;
    }
}

/**
 * Returns the main element used to house the app
 * @return {Element}
 */
const getDomContainer = () => document.querySelector(window[window.APP_NS].selector || '#app');
