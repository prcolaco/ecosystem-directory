<template>
  <div v-if="totalPages > 1 && currentPage <= totalPages" class="pagination-controls">

    <template v-if="currentPage !== 1">
      <button
        class="control-button first"
        @click="navigateToPage(1)">

        <slot name="first-page"></slot>

      </button>
      <button
        class="control-button prev"
        @click="navigateToPage(currentPage - 1)">

        <slot name="prev-page"></slot>

      </button>
      <div class="breaker">
        {{ breaker }}
      </div>
    </template>

    <button
      v-for="page in pages"
      :key="`page-${page.num}`"
      :class="['page-button', { current: page.current, display: page.display }]"
      @click="navigateToPage(page.num)">
      {{ page.num }}
    </button>

    <template v-if="currentPage !== totalPages">
      <div class="breaker">
        {{ breaker }}
      </div>
      <button
        class="control-button next"
        @click="navigateToPage(currentPage + 1)">

        <slot name="next-page"></slot>

      </button>
      <button
        class="control-button last"
        @click="navigateToPage(totalPages)">

        <slot name="last-page"></slot>

      </button>

    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Controls',

  props: {
    breaker: {
      type: String,
      required: false,
      default: '⋯'
    },
    first: {
      type: String,
      required: false,
      default: 'First'
    },
    prev: {
      type: String,
      required: false,
      default: 'Prev'
    },
    next: {
      type: String,
      required: false,
      default: 'Next'
    },
    last: {
      type: String,
      required: false,
      default: 'Last'
    }
  },

  computed: {
    ...mapGetters({
      routeQuery: 'filters/routeQuery',
      totalPages: 'filters/totalPages'
    }),
    currentPage () {
      return this.routeQuery.page ? this.routeQuery.page : 1
    },
    pages () {
      const total = this.totalPages
      const current = this.currentPage
      const buffer = 2
      const compiled = []
      for (let i = 0; i < total; i++) {
        compiled.push({
          num: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery'
    }),
    navigateToPage (pg) {
      this.setRouteQuery({
        key: 'page',
        data: pg
      })
      this.$emit('navigateToPage', pg)
    }
  }
}
</script>

<style lang="scss">
// ///////////////////////////////////////////////////////////////////// General
.pagination-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

// /////////////////////////////////////////////////////////// Buttons & Breaker
.page-button,
.breaker,
.control-button {
  padding: 0.5rem;
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  color: $tiber;
  opacity: 0.5;
  font-weight: 600;
}

.page-button {
  display: none;
  &:not(.current) {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    opacity: 0.5;
    transition: 250ms ease-out;
    &:hover {
      transition: 250ms ease-in;
      text-decoration-color: currentColor;
      opacity: 0.75;
    }
  }
  &.display {
    display: flex;
  }
  &.current {
    color: $tiber;
    cursor: default;
    opacity: 1;
  }
}

.control-button {
  color: $tiber;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}
</style>
