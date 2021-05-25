// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  activeTags: [],
  collection: []
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  activeTags: state => state.activeTags,
  collection: state => state.collection
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setActiveTags ({ commit }, tags) {
    commit('SET_ACTIVE_TAGS', tags)
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setCollection ({ commit }, collection) {
    commit('SET_COLLECTION', collection)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.activeTags = []
    state.collection = []
  },
  SET_ACTIVE_TAGS (state, tags) {
    state.activeTags = tags
  },
  SET_COLLECTION (state, collection) {
    state.collection = collection
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
