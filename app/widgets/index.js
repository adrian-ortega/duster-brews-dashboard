const path = require("path");


class Widget {
    constructor () {
        // this.id = makeId();
    }
}

class Widgets {
  constructor(path) {
    // @TODO
  }

  all() {
    const { items } = super.all();
    return items;
  }

  get(id) {
    return this.all().find((o) => o.id === id);
  }

  create (options) {
    const widget = new Widget(options);
    this.put(widget.id, widget);
    return widget;
  }
}

module.exports = new Widgets(path.resolve("storage/widgets.json"));
