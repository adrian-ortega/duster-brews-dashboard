/**
 * @param {*} a
 * @return {boolean}
 */
const isUndefined = (a) => typeof a === "undefined";

/**
 * @param {Object|Array} a
 * @returns {Object|Array}
 */
const sanitizedCopy = (a) => (isObject(a) ? { ...a } : isArray(a) ? [...a] : a);

/**
 * @param {string} str
 * @return {boolean}
 */
const isString = (str) => {
  return Object.prototype.toString.call(str) === "[object String]";
};

/**
 * @param {Array|*} arr
 * @return {arg is any[]}
 */
const isArray = (arr) => {
  return Array.isArray(arr);
};

/**
 * @param {Object|*} obj
 * @return {boolean}
 */
const isObject = (obj) => {
  return typeof obj === "object" && obj !== null;
};

/**
 * Checks to see if the value passed is function
 * @param {*} value
 * @return {boolean}
 */
const isFunction = (value) => {
  return value && {}.toString.call(value) === "[object Function]";
};

/**
 * Checks to see if the object passed contains a method (function)
 * with a specific name
 * @param {Object|*} object
 * @param {string|null} method
 * @return {boolean}
 */
const objectHasMethod = (object, method = null) => {
  if (!isObject(object) || isUndefined(object[method])) {
    return false;
  }

  return isFunction(object[method]);
};

/**
 * Wraps the pesky hasOwnProperty call in a helper.
 * @param {Object|*} object
 * @param {string} key
 * @return {boolean}
 */
const objectHasKey = (object, key) => {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key);
};

/**
 * Creates a FormData (PHP-style notated), object for use with HTTP Requests
 * with APIs
 * @param {Object} object
 * @param {FormData|null} fd
 * @param {null|string} parent
 * @return FormData
 */
const objectToFormData = (object, fd = null, parent = null) => {
  const formData = fd || new FormData();
  let formKey;
  Object.entries(object).forEach(([property, value]) => {
    formKey = parent ? `${parent}[${property}]` : property;
    if (isObject(value)) {
      objectToFormData(value, formData, property);
    } else {
      formData.append(formKey, value);
    }
  });
  return formData;
};

/**
 * Will fire a function, return the value or the default if the value is undefined
 * @param {*} valueOrFunc
 * @param {null|*} defaultValue
 * @return {*|null}
 */
const getValue = (valueOrFunc, defaultValue = null) => {
  return isFunction(valueOrFunc)
    ? valueOrFunc()
    : !isUndefined(valueOrFunc)
    ? valueOrFunc
    : defaultValue;
};

/**
 * @param {string} jsonString
 * @param {null|*} defaultValue
 * @return {null|*}
 */
const parseJson = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.log("Invalid JSON", {
      jsonString,
      errorStack: e.stack,
    });
    return defaultValue;
  }
};

/**
 * Will return a promise with a true value after x microsecs
 * @param ms
 * @returns {Promise<unknown>}
 */
const wait = (ms = 10) =>
  new Promise((a) => {
    setTimeout(() => {
      a(true);
    }, ms);
  });

const isEmpty = (mixedValue) => {
  const emptyValues = [undefined, null, false, 0, "", "0"];
  for (let i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedValue === emptyValues[i]) {
      return true;
    }
  }

  if (isObject(mixedValue)) {
    for (let key in mixedValue) {
      if (objectHasKey(mixedValue, key)) {
        return false;
      }
    }
    return true;
  }

  return false;
};

/**
 * String to slug
 * @param {String} str 
 * @returns String
 */
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

module.exports = {
  sanitizedCopy,
  NOOP: () => {},
  wait,
  parseJson,

  isUndefined,
  isString,
  isFunction,
  isObject,
  isArray,
  isEmpty,

  objectHasMethod,
  objectHasKey,
  objectHasProperty: objectHasKey,
  objectToFormData,

  getValue,
  slugify,
};
