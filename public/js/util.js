/* eslint-disable no-unused-vars */

const ICON_DOTS_HORZ =
  '<svg viewBox="0 0 24 24"><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>';
const ICON_MENU_DOWN =
  '<svg viewBox="0 0 24 24"><path d="M7,10L12,15L17,10H7Z" /></svg>';
const ICON_RELOAD =
  '<svg viewBox="0 0 24 24"><path d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z" /></svg>';
const ICON_KEG =
  '<svg viewBox="0 0 24 24"><path d="M5,22V20H6V16H5V14H6V11H5V7H11V3H10V2H11L13,2H14V3H13V7H19V11H18V14H19V16H18V20H19V22H5M17,9A1,1 0 0,0 16,8H14A1,1 0 0,0 13,9A1,1 0 0,0 14,10H16A1,1 0 0,0 17,9Z" /></svg>';
const ICON_IMAGE_EDIT =
  '<svg viewBox="0 0 24 24"><path d="M22.7 14.3L21.7 15.3L19.7 13.3L20.7 12.3C20.8 12.2 20.9 12.1 21.1 12.1C21.2 12.1 21.4 12.2 21.5 12.3L22.8 13.6C22.9 13.8 22.9 14.1 22.7 14.3M13 19.9V22H15.1L21.2 15.9L19.2 13.9L13 19.9M21 5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11V19.1L12.1 18H5L8.5 13.5L11 16.5L14.5 12L16.1 14.1L21 9.1V5Z" /></svg>';
const ICON_UPLOAD =
  '<svg viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';

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
  const $settings = $container.querySelector(".edit-container");
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

const removeWidgetsContainer = () => {
  const $widgets = getDomContainer().querySelector(".widgets");
  if ($widgets) $widgets.parentNode.removeChild($widgets);
};

/**
 *
 * @returns {Element}
 */
const getEmptyWidgetsContainer = () => {
  const $widgetsContainer = getWidgetContainer();
  $widgetsContainer.innerHTML = "";
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
  return !src || src === ""
    ? ""
    : `<figure><span><img src="${src}" alt="${alt}"/></span></figure>`;
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
 * Shows a brief notification for the user
 * @param {String} message
 * @param {string} type
 */
const showNotification = (message, type = "success") => {
  const { selector } = window[window.APP_NS];
  const $el =
    createElementFromTemplate(`<div class="notification notification--${type}">
    <p>${message}</p>
  </div>`);

  const $app = document.querySelector(selector);
  $app.appendChild($el);
  setTimeout(() => {
    $el
    $app.removeChild($el);
  }, 1000);
};

const isArray = (arr) => Array.isArray(arr);

/**
 *
 * @param {*} obj
 * @returns {Boolean}
 */
const isObject = (obj) => typeof obj === "object" && obj !== null;

/**
 * Checks to see if the value passed is function
 * @param {*} value
 * @return {boolean}
 */
const isFunction = (value) => {
  return value && {}.toString.call(value) === "[object Function]";
};

/**
 *
 * @param {Object} object
 * @param {String} key
 * @returns {Boolean}
 */
const objectHasKey = (object, key) =>
  isObject(object) && Object.prototype.hasOwnProperty.call(object, key);

/**
 * Checks to see if the object passed contains a method (function)
 * with a specific name
 * @param {Object|*} object
 * @param {string|null} method
 * @return {boolean}
 */
const objectHasMethod = (object, method = null) =>
  !isObject(object) || typeof object[method] === "undefined"
    ? false
    : isFunction(object[method]);

const makeId = (size = 5) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(size)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
};
