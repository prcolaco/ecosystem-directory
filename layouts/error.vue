<template>
  <div class="error-page">

    <section class="content">
      <div class="grid">
        <div class="col">

          <div class="breadcrumbs">
            <Breadcrumbs v-if="breadcrumbsVisible" :breadcrumbs="pageData.breadcrumbs" />
          </div>

          <div class="segments-container">

            <div class="segments-row">

              <div
                v-for="(width, i) in segmentsBefore"
                :key="`segment-before-${i}`"
                class="block-segment"
                :style="`width: ${width}%`">
              </div>

              <div class="block-404">
                <p class="four-o-four">
                  404
                </p>
              </div>

              <div
                v-for="(width, i) in segmentsAfter"
                :key="`segment-after-${i}`"
                class="block-segment"
                :style="`width: ${width}%`">
              </div>

            </div>

            <div class="prompt">
              {{ pageData.message + ' ' }}
              <a :href="pageData.link.href" class="prompt-link">
                {{ pageData.link.prompt }}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Breadcrumbs from '@/modules/zero/core/Components/Breadcrumbs'

import Settings from '@/content/data/settings.json'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  components: {
    Breadcrumbs
  },

  props: {
    divisions: {
      type: Number,
      required: false,
      default: 12
    }
  },

  serverPrefetch () {
    return this.getData()
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    pageData () {
      return this.siteContent.general['404_error_page']
    },
    breadcrumbsVisible () {
      return Settings.visibility.breadcrumbs
    },
    segmentsBefore () {
      return this.generateWidths()
    },
    segmentsAfter () {
      return this.generateWidths()
    }
  },

  mounted () {
    this.$Countly.trackEvent('404_NOT_FOUND', {
      path: this.$route.path,
      referrer: document.referrer
    })
  },

  methods: {
    getData () {
      this.$store.dispatch('global/getBaseData', 'general')
    },
    generateWidths () {
      let arr = []
      const amt = Math.max(Math.ceil((this.divisions - 2) / 2), 0)
      for (let i = 0; i < amt; i++) {
        arr.push(Math.floor(5 + (Math.random() * 45)))
      }
      const ratio = arr.reduce((a, b) => a + b, 0)
      arr = arr.map(n => Math.floor(40 * (n / ratio)))
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  position: relative;
}

.breadcrumbs {
  padding: 1.5rem 0;
}

.segments-container {
  padding-top: 8rem;
  padding-bottom: 10rem;
}

.segments-row {
  position: relative;
  padding: 0 1rem;
  width: 100%;
  height: 12.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > div {
    margin: 0.25rem;
  }
}

.block-segment,
.block-404 {
  @include borderRadius2;
  height: 100%;
}

.block-segment {
  background-color: #3D8F96;
  flex: 0 1 auto;
  @include tiny {
    display: none;
  }
}

.block-404 {
  display: block;
  flex: 1;
  padding: 2.25rem;
  color: white;
  text-align: center;
  background-color: #052437;
  .four-o-four {
    font-family: $fontMontserrat;
    font-size: 5rem;
    font-weight: 600;
    @include mini {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      @include fontSize_ExtraExtraLarge;
    }
  }
}

.prompt {
  width: 100%;
  padding: 1.5rem;
  text-align: center;
  font-weight: 400;
  font: $fontInter;
}

.prompt-link {
  font-weight: 500;
  color: $paradiso;
}

</style>
