<template>
  <div :class="`page page-${tag} container`">

    <div
      ref="collapsibleSection"
      :style="{ height: `${sectionHeight}px` }"
      class="collapsible-section">
      <transition-group name="fade" tag="section">

        <section
          v-if="segmentSlider"
          id="section-segment-slider"
          ref="segmentSlider"
          key="segment-slider">
          <div class="grid">
            <div class="col">

              <SegmentSliderChart @init="resetSectionHeight" />

            </div>
          </div>
        </section>

        <section
          v-if="featuredSlider"
          id="section-featured-slider"
          ref="featuredSection"
          key="featured-slider">
          <div class="grid">

            <div class="col-12">
              <h3 class="heading">
                {{ generalPageData.section_featured_slider.heading }}
              </h3>
              <div class="description">
                {{ generalPageData.section_featured_slider.description }}
              </div>
            </div>

            <div class="col-12">
              <FeaturedProjectsSlider
                parent="Home Page"
                @init="resetSectionHeight" />
            </div>

          </div>
        </section>

        <section
          v-if="routeQuery.filters !== 'enabled'"
          id="section-filter"
          ref="filterHeading"
          key="filters-heading">
          <div class="grid">
            <div class="col">

              <h3 class="heading">
                {{ pageData.section_filter.heading }}
              </h3>

              <div class="description">
                {{ pageData.section_filter.description }}
              </div>

            </div>
          </div>
        </section>

      </transition-group>
    </div>

    <ProjectView :defaultview="gridOrListView" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import ProjectView from '@/components/ProjectView/ProjectView'

import Settings from '@/content/data/settings.json'

// =================================================================== Functions
const parseURLParams = (instance, next) => {
  const cloned = CloneDeep(instance.$route.query)
  instance.clearRouteQuery()

  if (cloned.hasOwnProperty('filters')) {
    if (cloned.filters === 'enabled') {
      if (!window.matchMedia('(max-width: 53.125rem)').matches) {
        instance.setFilterPanelOpen(true)
      }
      instance.setRouteQuery({
        key: 'filters',
        data: cloned.filters
      })
      if (!cloned.hasOwnProperty('tags')) {
        instance.clearAllTags()
      }
    } else {
      instance.mountSegmentAndFeaturedSliders()
    }
  } else {
    instance.mountSegmentAndFeaturedSliders()
  }

  if (cloned.hasOwnProperty('tags')) {
    const tags = cloned.tags.split(',')
    const slug = tags.filter(tag => instance.taxonomyLabels.hasOwnProperty(tag)).join(',')
    instance.setRouteQuery({
      key: 'tags',
      data: slug
    })
  }

  if (cloned.hasOwnProperty('results')) {
    const results = cloned.results
    if (!results.isNaN) {
      if (results > 0) {
        instance.setRouteQuery({
          key: 'results',
          data: parseInt(results)
        })
      }
    }
  }

  if (cloned.hasOwnProperty('sort-by')) {
    instance.setRouteQuery({
      key: 'sort-by',
      data: cloned['sort-by']
    })
  }

  if (cloned.hasOwnProperty('display-type')) {
    instance.setRouteQuery({
      key: 'display-type',
      data: cloned['display-type']
    })
  }

  instance.$nextTick(() => {
    setRouteQueryPage(instance, cloned)
  })
}

const setRouteQueryPage = (instance, cloned) => {
  if (cloned.hasOwnProperty('page')) {
    const page = cloned.page
    if (!page.isNaN) {
      if (page > 0) {
        instance.setRouteQuery({
          key: 'page',
          data: parseInt(page)
        })
      }
    }
  }
}

const initResize = (instance) => {
  clearTimeout(instance.timeOutFunction)
  instance.timeOutFunction = setTimeout(() => {
    instance.resetSectionHeight()
  }, 150)
}

// ====================================================================== Export
export default {
  name: 'HomePage',

  components: {
    SegmentSliderChart,
    FeaturedProjectsSlider,
    ProjectView
  },

  data () {
    return {
      tag: 'home',
      sectionHeight: 0,
      segmentSlider: false,
      featuredSlider: false,
      resize: false,
      timeOutFunction: null
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'index')
    await store.dispatch('global/getBaseData', 'taxonomy')
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = this.seo.title
    const description = this.seo.description
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: this.seo.og_url },
        { hid: 'og:type', property: 'og:type', content: this.seo.og_type },
        { hid: 'og:image', property: 'og:image', content: this.seo.og_image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.seo.og_image }
      ]
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      filterPanelOpen: 'filters/filterPanelOpen',
      taxonomyLabels: 'filters/taxonomyLabels'
    }),
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    },
    // Page Content
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent.index.page_content
    },
    gridOrListView () {
      if (Settings.visibility.defaultView === 'list') {
        return true
      }
      return false
    }
  },

  watch: {
    '$route' (route) {
      this.$Countly.trackEvent('Query Param Debug', route.query)
      if (route.query.filters === 'enabled') {
        this.collapseSegmentAndFeaturedSliders()
      }
    }
  },

  mounted () {
    parseURLParams(this)
    this.resize = () => { this.$nextTick(() => { initResize(this) }) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
    this.clearRouteQuery()
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      clearRouteQuery: 'filters/clearRouteQuery',
      setFilterPanelOpen: 'filters/setFilterPanelOpen',
      clearAllTags: 'filters/clearAllTags'
    }),
    mountSegmentAndFeaturedSliders () {
      if (Settings.visibility.segmentChart) {
        if (!this.segmentSlider) { this.segmentSlider = true }
      }
      if (Settings.visibility.featuredSlider) {
        if (!this.featuredSlider) { this.featuredSlider = true }
      }
      if (this.filterPanelOpen) { this.setFilterPanelOpen(false) }
      this.setRouteQuery({ key: 'filters', data: '' })
      this.clearAllTags()
      this.resetSectionHeight()
    },
    collapseSegmentAndFeaturedSliders () {
      if (this.segmentSlider) {
        this.segmentSlider = false
      }
      if (this.featuredSlider) {
        this.featuredSlider = false
      }
      this.sectionHeight = 0
      window.scrollTo(0, 0)
    },
    resetSectionHeight () {
      if (this.$refs.collapsibleSection.firstElementChild) {
        setTimeout(() => {
          this.sectionHeight = Math.ceil(this.$refs.collapsibleSection.firstElementChild.clientHeight)
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  @include small {
    position: relative;
  }
}

.heading {
  @include fontSize_ExtraMediumLarge;
  margin-bottom: 0.75rem;
}

#segment-slider-chart {
  margin-bottom: 5rem;
  @include small {
    margin-top: calc(4.1665vw / 2);
  }
}

#featured-projects-slider {
  margin-top: 1rem;
}

// ///////////////////////////////////////////////////////////////// Transitions
.fade {
  &-enter-active {
    transition: opacity 500ms 500ms;
  }
  &-leave-active {
    transition: opacity 500ms;
  }
  &-enter-to,
  &-leave {
    opacity: 1;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.collapsible-section {
  overflow: hidden;
  transition: height 500ms 500ms;
}
</style>
