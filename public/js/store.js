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

  async function dispatch(action) {
    const prevState = getState();
    return objectHasKey(actions, action) && isFunction(actions[action])
      ? await actions[action].apply(null, [
          {
            state: prevState,
            commit,
            dispatch,
          },
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
  const state = {
    taps: [],
    breweries: [],
    tap_locations: [],
    fields: {},
    settings: {},
  };
  const mutations = {
    SET_TAPS: (state, value) => (state.taps = isArray(value) ? [...value] : []),
    SET_SETTINGS: (state, value) =>
      (state.settings = isObject(value) ? { ...value } : {}),
    SET_SETTING_FIELDS: (state, value) =>
      (state.fields = isObject(value) ? { ...value } : {}),
    SET_SETTING_SET_SETTING_CATEGORIES: (state, value) =>
      (state.categories = { ...value }),
    SET_BREWERIES: (state, value) =>
      (state.breweries = isArray(value) ? [...value] : []),
    SET_LOCATIONS: (state, value) =>
      (state.tap_locations = isArray(value) ? [...value] : []),
  };
  const actions = {
    getSettings: async ({ commit }) => {
      const response = await fetch("/api/settings");
      const { data } = await response.json();
      await commit("SET_SETTINGS", data.values);
      await commit("SET_SETTING_FIELDS", data.fields);
      await commit("SET_SETTING_CATEGORIES", data.categories);
      return data;
    },
    getTaps: async ({ commit }) => {
      const { data } = await apiGet("/api/taps");
      await commit("SET_TAPS", data);
      return data;
    },
    getTap: async (id) => {
      const { data } = await apiGet(`/api/taps/${id}`);
      return data;
    },
    getBreweries: async ({ commit }) => {
      const { data } = await apiGet("/api/breweries");
      await commit("SET_BREWERIES", data);
      return data;
    },
    getBrewery: async (ctx, id) => {
      const { data } = await apiGet(`/api/breweries/${id}`);
      return data;
    },
    getLocations: async ({ commit }) => {
      const { data } = await apiGet("/api/locations");
      await commit("SET_LOCATIONS", data);
      return data;
    },
    getLocation: async (ctx, id) => {
      const { data } = await apiGet(`/api/locations/${id}`);
      return data;
    },
  };
  return createStore(state, mutations, actions);
};
