<template>
  <div :class="`page page-${tag} container`">
    <h1 v-if="showcase.heading && showcase.heading.title" id="heading">
      <img
        v-if="showcase.heading.logo"
        class="logo"
        :src="$relativity(`/images/${showcase.heading.logo}`)"
        :alt="`${showcase.heading.title} logo`">
      {{ showcase.heading.title }}
    </h1>

    <div id="taxonomy-grid">
      <div v-for="(block, blockIndex) in getTaxonomyData()" :key="`block-${blockIndex}`" :class="`block block-${block.size}`">
        <div v-for="(tax, taxonomyIndex) in block.taxonomies" :key="`taxonomy-${taxonomyIndex}`" :class="`taxonomy taxonomy-${tax.size}`">
          <h2 class="taxonomy-label">
            {{ tax.label }}
          </h2>
          <div class="taxonomy-projects">
            <div v-for="(project, projectIndex) in tax.projects" :key="`project-${projectIndex}`" class="thumbnail">
              <img :src="$relativity(`/images/projects/${project.logo}`)" :alt="project.name" title="project.name" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Settings from '@/content/data/settings.json'
import ShowcaseData from '@/content/data/showcase-data.json'

// =================================================================== Functions

// ====================================================================== Export
export default {
  name: 'ShowcaseView',

  layout: 'showcase',

  data () {
    return {
      tag: 'showcase',
      smallProjectBlockSize: 5,
      mediumProjectBlockSize: 10,
      largeProjectBlockSize: 25,

      smallBlockLength: 3,
      mediumBlockLength: 2
    }
  },

  async fetch ({ store, req, route, payload, error }) {
    if (!Settings.hasOwnProperty('behavior') ||
        !Settings.behavior.hasOwnProperty('showcaseBaseRoute') ||
        route.path !== Settings.behavior.showcaseBaseRoute) {
      return error({ statusCode: 400 })
    }
    await store.dispatch('global/getBaseData', 'showcase')
    await store.dispatch('global/getBaseData', 'taxonomy')
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = `${this.seo.title}`
    const description = this.seo.description
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
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
      siteContent: 'global/siteContent'
    }),
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    },
    showcase () {
      return this.siteContent.showcase.page_content
    },
    category () {
      return this.$route.query.category || Settings.behavior.primaryCategorySlug
    },
    taxonomy () {
      return ShowcaseData.taxonomies[this.category] || null
    },
    projectList () {
      return ShowcaseData.projects
    },
    mediumProjectMinLength () {
      return !isNaN(this.$route.query.md) ? parseInt(this.$route.query.md) : 10
    },
    largeProjectMinLength () {
      const minLength = !isNaN(this.$route.query.lg) ? parseInt(this.$route.query.lg) : 25
      return minLength <= this.mediumProjectMinLength ? this.mediumProjectMinLength + 1 : minLength
    }
  },

  methods: {
    getTaxonomyData () {
      const smallProjects = []
      const mediumProjects = []
      const blocks = []

      Object.keys(this.taxonomy.tags).forEach((taxonomySlug) => {
        const taxonomyData = { label: this.taxonomy.tags[taxonomySlug] }
        const projects = this.projectList.filter((project) => {
          const projectTags = project.tags[this.category] || []
          return projectTags.includes(taxonomySlug)
        })

        if (projects.length < 1) { return }

        // Sort content into blocks based on size
        if (projects.length >= this.largeProjectMinLength) {
          taxonomyData.size = 'lg'
          taxonomyData.projects = projects.slice(0, this.largeProjectBlockSize)
          blocks.push({
            size: 'lg',
            taxonomies: [taxonomyData]
          })
        } else if (projects.length >= this.mediumProjectMinLength) {
          taxonomyData.size = 'md'
          taxonomyData.projects = projects.slice(0, this.mediumProjectBlockSize)

          if (mediumProjects.length + 1 >= this.mediumBlockLength) {
            blocks.push({
              size: 'md',
              taxonomies: [mediumProjects.shift(), taxonomyData]
            })
          } else {
            mediumProjects.push(taxonomyData)
          }
        } else {
          taxonomyData.size = 'sm'
          taxonomyData.projects = projects.slice(0, this.smallProjectBlockSize)

          if (smallProjects.length + 1 >= this.smallBlockLength) {
            blocks.push({
              size: 'sm',
              taxonomies: [smallProjects.shift(), smallProjects.shift(), taxonomyData]
            })
          } else {
            smallProjects.push(taxonomyData)
          }
        }
      })

      // Sort any other content
      if (smallProjects.length > 1) {
        blocks.push({
          size: 'sm-double',
          taxonomies: [smallProjects.shift(), smallProjects.shift()]
        })
      }

      if (mediumProjects.length > 0) {
        const _blocks = [mediumProjects.shift()]
        let size = 'md-single'
        if (smallProjects.length > 0) {
          size = 'md-sm'
          _blocks.push(smallProjects.shift())
        }
        blocks.push({
          size,
          taxonomies: _blocks
        })
      }
      return blocks
    }
  }
}
</script>

<style lang="scss" scoped>
  // ///////////////////////////////////////////////////////////////////// General
  .page {
    background-color: $white;
    padding: 2rem 0;
  }

  // ///////////////////////////////////////////////////////////////////// Heading
  #heading {
    font-family: $fontInter;
    font-weight: 500;
    font-size: 2rem;
    padding: 0 2rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img {
      width: auto;
      height: 3.75rem;
      margin-right: 0.35rem;
    }
  }

  // ///////////////////////////////////////////////////////////////////// Project Grid
  #taxonomy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 20rem);
    row-gap: 1.75rem;
    column-gap: 1.25rem;
    justify-content: center;

    .block {
      display: flex;
      flex-direction: column;

      &.block-md {
        gap: 1.2rem;
      }

      &.block-sm {
        gap: 1.2rem;
      }

      &.block-sm-double {
        gap: 1.2rem;
      }

      &.block-md-single {
        gap: 1.2rem;
      }

      &.block-md-sm {
        gap: 1.2rem; // 2.5rem
      }
    }

    .taxonomy {
      border-radius: 0.5rem;
      border: 2px solid rgba($showcaseGray, 0.5);
      position: relative;
      padding-top: 0.5rem;
      display: inline-flex;

      .taxonomy-label {
        background: $white;
        font-family: $fontInter;
        font-size: 0.75rem;
        font-weight: 500;
        color: $codGray;
        position: absolute;
        top: -0.65rem;
        left: 1.5rem;
        padding: 0 1.5rem 0 0.75rem;
      }

      .taxonomy-projects {
        padding: 1.25rem 1.5rem;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 1.1rem;
        column-gap: 1.25rem;

        .thumbnail {
          width: 2.3rem;
          height: 2.3rem;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }

      &.taxonomy-sm {
        .taxonomy-projects {
          grid-template-rows: 1fr;
        }
      }

      &.taxonomy-md {
        .taxonomy-projects {
          grid-template-rows: repeat(2, 1fr);
        }
      }

      &.taxonomy-lg {
        .taxonomy-projects {
          grid-template-rows: repeat(5, 1fr);
        }
      }
    }
  }
</style>
