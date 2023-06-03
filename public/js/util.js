/* eslint-disable no-unused-vars */
const ICON_FORMATTED_LIST =
  '<svg viewBox="0 0 24 24"><path d="M2 14H8V20H2M16 8H10V10H16M2 10H8V4H2M10 4V6H22V4M10 20H16V18H10M10 16H22V14H10" /></svg>';
const ICON_MENU_DOWN =
  '<svg viewBox="0 0 24 24"><path d="M7,10L12,15L17,10H7Z" /></svg>';
const ICON_RELOAD =
  '<svg viewBox="0 0 24 24"><path d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z" /></svg>';
const ICON_KEG =
  '<svg viewBox="0 0 24 24"><path d="M5,22V20H6V16H5V14H6V11H5V7H11V3H10V2H11L13,2H14V3H13V7H19V11H18V14H19V16H18V20H19V22H5M17,9A1,1 0 0,0 16,8H14A1,1 0 0,0 13,9A1,1 0 0,0 14,10H16A1,1 0 0,0 17,9Z" /></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';
const ICON_COG_OUTLINE =
  '<svg viewBox="0 0 24 24"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" /></svg>';
const ICON_BARLEY =
  '<svg viewBox="0 0 24 24"><path d="M7.33,18.33C6.5,17.17 6.5,15.83 6.5,14.5C8.17,15.5 9.83,16.5 10.67,17.67L11,18.23V15.95C9.5,15.05 8.08,14.13 7.33,13.08C6.5,11.92 6.5,10.58 6.5,9.25C8.17,10.25 9.83,11.25 10.67,12.42L11,13V10.7C9.5,9.8 8.08,8.88 7.33,7.83C6.5,6.67 6.5,5.33 6.5,4C8.17,5 9.83,6 10.67,7.17C10.77,7.31 10.86,7.46 10.94,7.62C10.77,7 10.66,6.42 10.65,5.82C10.64,4.31 11.3,2.76 11.96,1.21C12.65,2.69 13.34,4.18 13.35,5.69C13.36,6.32 13.25,6.96 13.07,7.59C13.15,7.45 13.23,7.31 13.33,7.17C14.17,6 15.83,5 17.5,4C17.5,5.33 17.5,6.67 16.67,7.83C15.92,8.88 14.5,9.8 13,10.7V13L13.33,12.42C14.17,11.25 15.83,10.25 17.5,9.25C17.5,10.58 17.5,11.92 16.67,13.08C15.92,14.13 14.5,15.05 13,15.95V18.23L13.33,17.67C14.17,16.5 15.83,15.5 17.5,14.5C17.5,15.83 17.5,17.17 16.67,18.33C15.92,19.38 14.5,20.3 13,21.2V23H11V21.2C9.5,20.3 8.08,19.38 7.33,18.33Z" /></svg>';
const ICON_BEER_OUTLINE =
  '<svg viewBox="0 0 24 24"><path d="M4 2L6 22H17L19 2H4M6.2 4H16.8L16.5 7.23C13.18 8.5 11.85 7.67 11.38 7.31C11.13 7.12 10.77 6.69 10.11 6.39C9.45 6.08 8.55 6 7.5 6.32C7.09 6.43 6.77 6.61 6.5 6.79L6.2 4M8.86 8.11C9.05 8.11 9.16 8.15 9.27 8.2C9.5 8.3 9.71 8.55 10.17 8.9C11.03 9.56 13.03 10.36 16.26 9.41L15.2 20H7.8L6.71 9.06C6.76 9 6.91 8.89 7.17 8.71C7.5 8.5 7.91 8.28 8 8.25L8 8.25H8.03C8.41 8.14 8.67 8.1 8.86 8.11Z" /></svg>';
const ICON_FAUCET =
  '<svg viewBox="0 0 24 24"><path d="M19,14.5C19,14.5 21,16.67 21,18A2,2 0 0,1 19,20A2,2 0 0,1 17,18C17,16.67 19,14.5 19,14.5M5,18V9A2,2 0 0,1 3,7A2,2 0 0,1 5,5V4A2,2 0 0,1 7,2H9A2,2 0 0,1 11,4V5H19A2,2 0 0,1 21,7V9L21,11A1,1 0 0,1 22,12A1,1 0 0,1 21,13H17A1,1 0 0,1 16,12A1,1 0 0,1 17,11V9H11V18H12A2,2 0 0,1 14,20V22H2V20A2,2 0 0,1 4,18H5Z" /></svg>';
const ICON_PLUS =
  '<svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';
const ICON_DELETE =
  '<svg viewBox="0 0 24 24"><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" /></svg>';
const ICON_CHEVRON_RIGHT =
  '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>';
const ICON_CHEVRON_LEFT =
  '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>';
/**
 * Does nothing, No Operation
 * @constructor
 */
const NOOP = () => {};

/**
 * @returns {Object}
 */
const getApp = () => window[window.APP_NS];

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
  const $el = window[window.APP_NS]
    .createElement(`<div class="notification notification--${type}">
    <p>${message}</p>
  </div>`);

  const $app = document.querySelector(selector);
  $app.appendChild($el);
  setTimeout(() => {
    $el;
    $app.removeChild($el);
  }, 1000);
};

/**
 * Shortcut for Array.isArray
 * @param {*} arr
 * @returns {Boolean}
 */
const isArray = (arr) => Array.isArray(arr);

/**
 * @param {*} obj
 * @returns {Boolean}
 */
const isObject = (obj) => typeof obj === "object" && obj !== null;

/**
 * @param {*} value
 * @returns {boolean}
 */
const isAsyncFunction = (value) =>
  value && {}.toString.call(value) === "[object AsyncFunction]";

/**
 * @param {*} value
 * @return {boolean}
 */
const isFunction = (value) =>
  (value && {}.toString.call(value) === "[object Function]") ||
  isAsyncFunction(value);

/**
 * @param {Object} object
 * @param {String} key
 * @returns {Boolean}
 */
const objectHasKey = (object, key) =>
  isObject(object) && Object.prototype.hasOwnProperty.call(object, key);

const apiGet = async (url, params = {}) => {
  const urlParams = new URLSearchParams(params);
  const response = await fetch(url + (urlParams ? "?" + urlParams : ""));
  return await response.json();
};
