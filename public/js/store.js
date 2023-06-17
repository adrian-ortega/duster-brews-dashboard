const createStore = (
  initialState,
  initialMutators = {},
  initialActions = {}
) => {
  const mutators = { ...initialMutators };
  const actions = { ...initialActions };
  const state = new Proxy(
    { value: initialState },
    {
      set(obj, prop, value) {
        obj[prop] = value;
      },
    }
  );

  function getState() {
    return { ...state.value };
  }

  function isDeepEqual(a, b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      const aValue = a[key];
      const bValue = b[key];
      const isObjects = isObject(aValue) && isObject(bValue);
      if (
        (isObjects && !isDeepEqual(aValue, bValue)) ||
        (!isObjects && aValue !== bValue)
      ) {
        return false;
      }
    }
    return true;
  }

  async function commit(mutation, value) {
    const prevState = getState();
    async function reducer(state, mutation, value) {
      if (isFunction(mutators[mutation])) {
        await mutators[mutation].apply(null, [state, value]);
      }
      return state;
    }
    const newState = await reducer(prevState, mutation, value);
    state.value = newState;
    if (!isDeepEqual(prevState, newState)) {
      console.log("createStore.commit", mutation, value);
    }
  }

  async function dispatch(action, data) {
    const prevState = getState();
    if (!objectHasKey(actions, action)) {
      throw new Error(`Store action '${action}' does not exist`);
    }

    return isFunction(actions[action])
      ? await actions[action].apply(null, [
          {
            state: prevState,
            commit,
            dispatch,
          },
          data,
        ])
      : null;
  }

  return {
    getState,
    commit,
    dispatch,
  };
};

const createAppStore = (app) => {
  const SET_DRINKS = "SET_DRINKS";
  const SET_DRINK_FIELDS = "SET_DRINK_FIELDS";
  const SET_SETTINGS = "SET_SETTINGS";
  const SET_SETTING_FIELDS = "SET_SETTING_FIELDS";
  const SET_SETTING_CATEGORIES = "SET_SETTING_CATEGORIES";
  const SET_BREWERIES = "SET_BREWERIES";
  const SET_BREWERY_FIELDS = "SET_BREWERY_FIELDS";
  const SET_TAPS = "SET_TAPS";
  const SET_TAP_FIELDS = "SET_TAP_FIELDS";

  const state = {
    drinks: [],
    drink_fields: [],
    breweries: [],
    brewery_fields: [],
    taps: [],
    tap_fields: [],
    settings: {},
    setting_fields: {},
  };
  const mutations = {
    [SET_DRINKS]: (state, value) =>
      (state.drinks = isArray(value) ? [...value] : []),
    [SET_DRINK_FIELDS]: (state, value) =>
      (state.drink_fields = isArray(value) ? [...value] : []),
    [SET_SETTINGS]: (state, value) =>
      (state.settings = isObject(value) ? { ...value } : {}),
    [SET_SETTING_FIELDS]: (state, value) =>
      (state.setting_fields = isObject(value) ? { ...value } : {}),
    [SET_SETTING_CATEGORIES]: (state, value) =>
      (state.categories = { ...value }),
    [SET_BREWERIES]: (state, value) =>
      (state.breweries = isArray(value) ? [...value] : []),
    [SET_BREWERY_FIELDS]: (state, value) =>
      (state.brewery_fields = isArray(value) ? [...value] : []),
    [SET_TAPS]: (state, value) =>
      (state.taps = isArray(value) ? [...value] : []),
    [SET_TAP_FIELDS]: (state, value) =>
      (state.tap_fields = isArray(value) ? [...value] : []),
  };
  const actions = {
    getSettings: async ({ commit }) => {
      const { data } = await apiGet("/api/settings");
      await commit(SET_SETTINGS, data.values);
      await commit(SET_SETTING_FIELDS, data.fields);
      await commit(SET_SETTING_CATEGORIES, data.categories);
      return data;
    },
    getDrinkFields: async ({ state, commit }) => {
      if (state.drink_fields.length > 0) return state.drink_fields;
      const { data } = await apiGet("/api/drinks/fields");
      await commit(SET_DRINK_FIELDS, data);
      return data;
    },
    getDrinks: async ({ commit }) => {
      const { data } = await apiGet("/api/drinks");
      await commit(SET_DRINKS, data);
      return data;
    },
    getDrink: async (ctx, id) => {
      const { data } = await apiGet(`/api/drinks/${id}`);
      return data;
    },
    getBreweryFields: async ({ state, commit }) => {
      if (state.brewery_fields.length > 0) return state.brewery_fields;
      const { data } = await apiGet("/api/breweries/fields");
      await commit(SET_BREWERY_FIELDS, data);
      return data;
    },
    getBreweries: async ({ commit }) => {
      const { data } = await apiGet("/api/breweries");
      await commit(SET_BREWERIES, data);
      return data;
    },
    getBrewery: async (ctx, id) => {
      const { data } = await apiGet(`/api/breweries/${id}`);
      return data;
    },
    getTapFields: async ({ state, commit }) => {
      if (state.tap_fields.length > 0) return state.tap_fields;
      const { data } = await apiGet("/api/taps/fields");
      await commit(SET_TAP_FIELDS, data);
      return data;
    },
    getTaps: async ({ commit }) => {
      const { data } = await apiGet("/api/taps");
      await commit(SET_TAPS, data);
      return data;
    },
    getTap: async (ctx, id) => {
      const { data } = await apiGet(`/api/taps/${id}`);
      return data;
    },
  };
  return createStore(state, mutations, actions);
};
