class Navigation extends Templateable {
  static init() {
    const nav = new Navigation();
    nav.render(null, getDomContainer());
  }
  template() {
    // @TODO change these two variables to pull from saved data within
    //       the settings json file
    //
    const src = "/images/duster-brews-logo.svg";
    const alt = "Duster Brews";
    return `<div class="nav">
      <div class="nav-left">
        <div class="nav-item logo">
          <figure><span><img src="${src}" alt="${alt}"/></span></figure>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-item">
          <a href="/" data-route="home" class="button nav-button route-link" title="Taps">
            <span class="icon">${ICON_FORMATTED_LIST}</span>
          </a>
        </div>
        <div class="nav-item has-sub">
          <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
            <span class="icon">${ICON_COG_OUTLINE}</span>
          </a>
          <div class="nav-sub">
            <h3>Manage</h3>
            <a href="/taps" data-route="taps" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_BEER_OUTLINE}</span>
              <span class="text">Taps</span>
            </a>
            <a href="/breweries" data-route="breweries" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_BARLEY}</span>
              <span class="text">Breweries</span>
            </a>
            <hr/>
            <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_COG_OUTLINE}</span>
              <span class="text">Settings</span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  }
}
