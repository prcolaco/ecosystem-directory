// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import GeneralSiteData from '@/content/pages/general.json'
import IndexSiteData from '@/content/pages/index.json'
import ProjectSiteData from '@/content/pages/project.json'
import ShowcaseSiteData from '@/content/pages/showcase.json'
import TaxonomyData from '@/content/data/taxonomy.json'
import Settings from '@/content/data/settings.json'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------

const insertEntityTerm = (input) => {
  const string = JSON.stringify(input)
  const mapObj = Settings.nomenclature
  const replaced = string.replace(/\b(?:entityTermPlural|entityTerm)\b/gi, matched => mapObj[matched])
  return JSON.parse(replaced)
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  filterButtonFloating: 'middle'
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent,
  navigation: (state) => {
    const siteContent = state.siteContent
    if (siteContent.hasOwnProperty('general')) {
      return siteContent.general.navigation
    }
    return false
  },
  filterButtonFloating: state => state.filterButtonFloating
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////// getBaseData
  async getBaseData ({ commit }, payload) {
    const key = typeof payload === 'string' ? payload : payload.key
    let data = false
    switch (key) {
      case 'taxonomy': data = insertEntityTerm(TaxonomyData); break
      case 'general': data = insertEntityTerm(GeneralSiteData); break
      case 'index': data = insertEntityTerm(IndexSiteData); break
      case 'project': data = insertEntityTerm(ProjectSiteData); break
      case 'showcase': data = ShowcaseSiteData; break
      default : data = payload.data; break
    }
    if (data) {
      await this.dispatch('global/setSiteContent', { key, data })
    }
  },
  // //////////////////////////////////////////////////////////// setSiteContent
  setSiteContent ({ commit }, payload) {
    commit('SET_SITE_CONTENT', payload)
  },
  // /////////////////////////////////////////////////// setFilterButtonFloating
  setFilterButtonFloating ({ commit }, toggle) {
    commit('SET_FILTER_BUTTON_FLOATING', toggle)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.siteContent = {}
  },
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
  },
  SET_FILTER_BUTTON_FLOATING (state, toggle) {
    state.filterButtonFloating = toggle
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
