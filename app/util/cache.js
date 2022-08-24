/**
 * @param {Number} interval
 * @return {{interval, items: *[], timestamp: DOMHighResTimeStamp}}
 */
const createTimedCache = (interval) => ({
  interval,
  timestamp: performance.now(),
  items: []
});

/**
 * @param {DOMHighResTimeStamp} ts
 * @param {DOMHighResTimeStamp} timestamp
 * @param {Number} interval
 * @param {Array} items
 * @return {boolean}
 */
const hasCachedItems = (ts, { timestamp, interval, items }) =>  ((ts - timestamp) < interval) && items.length > 0

module.exports = {
  createTimedCache,
  hasCachedItems
}
