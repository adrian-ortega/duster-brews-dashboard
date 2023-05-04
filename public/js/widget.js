/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const keg_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>keg</title><path d="M5,22V20H6V16H5V14H6V11H5V7H11V3H10V2H11L13,2H14V3H13V7H19V11H18V14H19V16H18V20H19V22H5M17,9A1,1 0 0,0 16,8H14A1,1 0 0,0 13,9A1,1 0 0,0 14,10H16A1,1 0 0,0 17,9Z" /></svg>`;

/**
 * Creates the main Widget DOM Element that displays the information for
 * each beer.
 * @param {object} item
 * @return {ChildNode}
 */
const createWidgetElement = ({ keg, brewery, brewery_image, style, name, background_image, abv, ibu }) => {
  abv = parseFloat(keg.abv > 0 ? keg.abv : abv).toFixed(1);
  ibu = parseInt(ibu, 10)
  const keg_percent = parseFloat(keg.percent_beer_left).toFixed(1);
  const template = `<div id="keg-${keg.id}" class="widget">
    <div class="widget__image">${imgTemplate(background_image, name)}</div>
    <div class="widget__content">
      <div class="widget__content-header">
        <div class="keg__image">${imgTemplate(brewery_image, brewery)}</div>
        <div class="keg__header">
          <p class="keg__location">${keg.keg_location}</p>
          <h2 class="keg__name">${name}</h2>
          <p class="keg__brewery">${brewery}</p>
        </div>
      </div>
      <div class="widget__content-footer">
        <div class="keg__detail"><h3>${style}</h3></div>
        <div class="keg__detail">
          <p><span class="icon">${keg_icon}</span></p>
          <h3>${keg_percent}%</h3>
        </div>
        <div class="keg__detail"><p>ABV</p><h3>${abv}%</h3></div>
        <div class="keg__detail"><p>IBUS</p><h3>${ibu}</h3></div>
        <div class="keg__detail"><p>Kegged</p><h3>${keg.keg_date}</h3></div>
      </div>
    </div>
  </div>`;
  return createElementFromTemplate(template);
};
