<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 7.818 11.336">

    <g transform="translate(1.41 9.926) rotate(-90)">

      <path
        d="M0,0,3.439,4.061,4.233,5"
        transform="translate(8.517 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

      <line
        x1="4.284"
        y2="4.998"
        transform="translate(4.284 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'PrevArrow',

  props: {
    stroke: {
      type: String,
      default: '#FFFFFF',
      required: false
    },
    width: {
      type: String,
      default: '7.818',
      required: false
    },
    height: {
      type: String,
      default: '11.336',
      required: false
    }
  }
}
</script>
