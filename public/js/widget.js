/**
 * Blank PNG
 * @type {string}
 */
const TRANSPARENT_PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/**
 * An array of values for fractions in eights
 * @type {Array|Number[]}
 */
const BEER_BAR_SECTIONS = (new Array(8)).fill(0).map((v, i) => (((i+1)/8) * 100));

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

/**
 * Creates the main Widget DOM Element that displays the information for
 * each beer.
 * @param {object} item
 * @return {ChildNode}
 */
const createWidgetElement = (item) => {
    const beer_left_percent = item.keg ? parseFloat(item.keg.percent_beer_left) : 0
    const beer_bar_current_section = BEER_BAR_SECTIONS.reduce((currSec, curr, i, sections) => {
        const previous = sections[i - 1] ? sections[i - 1] : 0;
        if (beer_left_percent >= previous && beer_left_percent <= curr) {
            currSec = i;
        }
        return currSec
    }, 0);
    return createElementFromTemplate(`
<div class="widget widget--beer">
  <div class="widget__header">
    <div class="beer-name"><div>${item.name}</div></div>
    <div class="thermometer">
      <div class="thermometer__bar" style="height: ${beer_left_percent}%" data-section="${beer_bar_current_section}">
        <span class="thermometer__value">${beer_left_percent}%</span>
      </div>
    </div>
  </div>
  <div class="widget__label"${item.background_image ? ` style="background-image: url(${item.background_image});` : ''}">
    <div class="beer-brewery">${imgTemplate(TRANSPARENT_PLACEHOLDER_IMAGE, 'No Brewery Icon')}</div>
  </div>
  <div class="widget__footer">
    <p class="beer-style">${item.style}</p>
    ${item.keg ? ` <p class="beer-abv">${item.keg.abv}</p><p class="beer-created">${item.keg.keg_date}</p>` : '<p class="beer-no-keg">No Keg Info</p>'}
  </div>
  <div class="widget__indicators">
    <div class="tap-no">
        <span class="tap-no__value">${item?.keg.keg_location}</span>
    </div> 
  </div>
</div>`)
};
