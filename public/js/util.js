/* eslint-disable no-unused-vars */

const ICON_RELOAD =
  '<svg viewBox="0 0 24 24"><path d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z" /></svg>';
const ICON_KEG =
  '<svg viewBox="0 0 24 24"><path d="M5,22V20H6V16H5V14H6V11H5V7H11V3H10V2H11L13,2H14V3H13V7H19V11H18V14H19V16H18V20H19V22H5M17,9A1,1 0 0,0 16,8H14A1,1 0 0,0 13,9A1,1 0 0,0 14,10H16A1,1 0 0,0 17,9Z" /></svg>';
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
    return defaultValue;
  }
};

/**
 * Returns the main element used to house the app
 * @return {Element}
 */
const getDomContainer = () =>
  document.querySelector(window[window.APP_NS].selector || "#app");

/**
 * Looks for an existing widgets container or creates and adds one to the
 * dom, then returns it.
 * @returns {ChildNode}
 */
const getWidgetContainer = () => {
  const $container = getDomContainer();
  const $settings = $container.querySelector(".settings");
  if ($settings) {
    $container.removeChild($settings);
  }
  let $widgetsContainer = $container.querySelector(".widgets");
  if (!$widgetsContainer) {
    $widgetsContainer = createElementFromTemplate(
      '<div class="widgets"></div>'
    );
    $container.appendChild($widgetsContainer);
  }
  return $widgetsContainer;
};

/**
 * Wraps an image source and optional title in asemantically
 * correct HTML string.
 * @param {string} src
 * @param {string} alt
 * @return {`<figure><img src="${string}" alt=""/></figure>`}
 */
const imgTemplate = (src, alt = "") => {
  return `<figure><span><img src="${src}" alt="${alt}"/></span></figure>`;
};

/**
 * Helper, creates a DOM element from a string
 * @param template
 * @return {ChildNode}
 */
const createElementFromTemplate = (template) => {
  const _div = document.createElement("div");
  _div.innerHTML = template.trim();
  return _div.firstChild;
};

/**
 *
 * @param {String} eventName
 * @param {null|Object} detail
 * @param {DOMObject} target
 */
const fireCustomEvent = (eventName, detail = {}, target = document) => {
  const customEvent = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail,
  });
  return target.dispatchEvent(customEvent);
};

/**
 *
 * @param {*} obj
 * @returns {Boolean}
 */
const isObject = (obj) => typeof obj === "object" && obj !== null;

/**
 *
 * @param {Object} object
 * @param {String} key
 * @returns {Boolean}
 */
const objectHasKey = (object, key) =>
  isObject(object) && Object.prototype.hasOwnProperty.call(object, key);

/**
 *
 * @param {String} url
 * @param {Object} data
 * @returns {Promise<*>}
 */
const formJSONPost = (url, data = {}) => {
  return fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
