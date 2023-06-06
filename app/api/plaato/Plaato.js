const axios = require("axios");
const PlaatoCache = require("./PlaatoCache");
const { isArray, isFunction, objectHasKey } = require("../../util/helpers");

class Plaato {
  constructor() {
    this.invalid = {};
    this.cache = new PlaatoCache();
    this.client = axios.create({
      baseURL: "https://plaato.blynk.cc",
    });
    this.token;
    this.pins = {
      pour: "v47",
      percent_beer_left: "v48",
      pouring: "v49",
      amount_left: "v51",
      raw_temperature: "v56",
      last_pour: "v56",
      empty_keg_weight: "v62",
      beer_style: "v64",
      original_gravity: "v65",
      final_gravity: "v66",
      keg_date: "v67",
      abv: "v68",
      temperature: "v69",
      unit: "v71",
      mass_unit: "v73",
      beer_left_unit: "v74",
      measure_unit: "v75",
      max_keg_volume: "v76",
      wifi_strength: "v81",
      volume_unit: "v82",
      leak_detection: "v83",
      min_temperature: "v86",
      max_temperature: "v87",
      app_mode: "v88",
      scale_sensitivity: "v89",
      firmware_version: "v93",
    };
  }

  clear() {
    this.token = null;
    return this;
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  async get(pin, parser) {
    if (!parser || !isFunction(parser)) {
      parser = (a) => a;
    }

    try {
      if (objectHasKey(this.invalid, this.token)) {
        throw new Error("Invalid token");
      }
      if (!this.token) {
        throw new Error("No token found");
      }

      let value = undefined;

      if (this.cache.has(this.token, pin)) {
        const item = this.cache.get(this.token);
        if (objectHasKey(item, pin)) {
          value = item[pin];
        }
      }

      if (value === undefined) {
        const { data } = await this.client.get(`/${this.token}/get/${pin}`);
        value = data;
        if (isArray(data)) {
          value = data.length === 1 ? data[0] : data;
        }
        this.cache.set(this.token, { [pin]: value });
      }

      this.cache.invalidate();
      return parser(value);
    } catch (e) {
      if (
        e.response &&
        e.response.status === 400 &&
        e.response.data.match(/invalid/gim) &&
        !this.invalid[this.token]
      ) {
        this.invalid[this.token] = true;
      }
      return parser(null);
    }
  }
}

module.exports = Plaato;
