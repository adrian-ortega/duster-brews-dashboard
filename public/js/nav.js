class Navigation extends Templateable {
  static async init() {
    const { store } = getApp();
    await store.dispatch("getSettings");
    getDomContainer().prepend(new Navigation().render(null));
    return !!document.querySelector(".nav");
  }
  template() {
    // @TODO change these two variables to pull from saved data within
    //       the settings json file
    //
    const { app_name, store } = getApp();
    const { settings } = store.getState();
    const src = settings.logo;
    const alt = app_name;
    return `<div class="nav">
      <div class="nav-left">
        <div class="nav-item logo">
          <figure><span><img src="${src}" alt="${alt}"/></span></figure>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-item has-sub">
          <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
            <span class="icon">${ICON_COG_OUTLINE}</span>
          </a>
          <div class="nav-sub">
            <h3>${APP_NS}</h3>
            <a href="/" data-route="home" class="button nav-button route-link" title="Drinks">
              <span class="icon">${ICON_FORMATTED_LIST}</span>
              <span class="text">Menu</span>
            </a>
            <h3>Manage</h3>
            <a data-route="drinks" class="button nav-button route-link" title="Drinks">
              <span class="icon">${ICON_BEER_OUTLINE}</span>
              <span class="text">Drinks</span>
            </a>
            <a data-route="locations" class="button nav-button route-link" title="Drink Locations">
              <span class="icon">${ICON_FAUCET}</span>
              <span class="text">Tap Locations</span>
            </a>
            <a data-route="breweries" class="button nav-button route-link" title="Breweries">
              <span class="icon">${ICON_BARLEY}</span>
              <span class="text">Breweries</span>
            </a>
            <hr/>
            <a data-route="settings" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_COG_OUTLINE}</span>
              <span class="text">Settings</span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  }
}
