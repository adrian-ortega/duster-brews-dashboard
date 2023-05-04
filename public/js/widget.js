/**
 * Creates the main Widget DOM Element that displays the information for
 * each beer.
 * @param {object} item
 * @return {ChildNode}
 */
const createWidgetElement = ({ keg, brewery, style, name, background_image }) => {
  const template = `<div id="keg-${keg.id}" class="widget">
    <div class="widget__image">${imgTemplate(background_image, name)}</div>
    <div class="widget__content">
      <p class="keg__location">${keg.keg_location}</p>
      <h2 class="keg__name">${name}</h2>
      <p class="keg__brewery">${brewery}</p>
      <div class="widget__content-footer">
        <div class="keg__detail"><h3>${style}</h3></div>
        <div class="keg__detail"><p>ABV</p><h3>${keg.abv}%</h3></div>
        <div class="keg__detail"><p>IBUS</p><h3>0</h3></div>
        <div class="keg__detail"><p>Kegged</p><h3>${keg.keg_date}</h3></div>
      </div>
    </div>
  </div>`;
  return createElementFromTemplate(template);
};
