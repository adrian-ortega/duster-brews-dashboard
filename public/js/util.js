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

/**
 * Wraps an image source and optional title in asemantically
 * correct HTML string.
 * @param {string} src
 * @param {string} alt
 * @return {`<figure><img src="${string}" alt=""/></figure>`}
 */
const imgTemplate = (src, alt = '') => {
    return `<figure><img src="${src}" alt="${alt}"/></figure>`
}

/**
 * Helper, creates a DOM element from a string
 * @param template
 * @return {ChildNode}
 */
const createElementFromTemplate = (template) => {
    const _div = document.createElement('div');
    _div.innerHTML = template.trim();
    return _div.firstChild;
};
