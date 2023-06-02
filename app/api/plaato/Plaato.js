const axios = require("axios");
const log = require("../../util/log");
const { isArray, isFunction } = require("../../util/helpers");

class Plaato {
  constructor() {
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
    try {
      if (!this.token) {
        throw new Error("No token found");
      }

      if (!parser || !isFunction(parser)) {
        parser = (a) => a;
      }

      const { data } = await this.client.get(`/${this.token}/get/${pin}`);
      if (isArray(data)) {
        return parser(data.length === 1 ? data[0] : data);
      }
      return parser(data);
    } catch (e) {
      log.error("Plaato Error:", e);
      return null;
    }
  }
}

module.exports = Plaato;
