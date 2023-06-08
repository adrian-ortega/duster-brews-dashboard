class App {
  constructor() {
    this.app_name = "";
    this.selector = "#app";
    this.route = "home";
    this.booted = false;
    this.ws = null;
    this.router = new Router();
    this.Forms = Forms;
    this.Templates = new Templates();
    this.store = createAppStore(this);
  }

  init(name, namespace) {
    if (!this.booted) {
      this.app_name = name;
      this.booted = true;
      window.APP_NS = namespace;
      window[namespace] = this;
    }
  }
}
