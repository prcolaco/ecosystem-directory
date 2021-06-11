/*
 *
 * 🔌 [Plugin | Zero + Core] GetScrollSpeed
 *
 */

let ZERO_GETSCROLLSPEED_LAST = null
let ZERO_GETSCROLLSPEED_TIMER
let ZERO_GETSCROLLSPEED_DELTA = 0
const ZERO_GETSCROLLSPEED_DELAY = 50 // higher delay -> lower fidelity
const ZERO_GETSCROLLSPEED_CLEAR = () => {
  ZERO_GETSCROLLSPEED_LAST = null
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const GetScrollSpeed = (settings) => {
  const now = window.scrollY
  if (ZERO_GETSCROLLSPEED_LAST) {
    ZERO_GETSCROLLSPEED_DELTA = now - ZERO_GETSCROLLSPEED_LAST
  }
  ZERO_GETSCROLLSPEED_LAST = now
  clearTimeout(ZERO_GETSCROLLSPEED_TIMER)
  ZERO_GETSCROLLSPEED_TIMER = setTimeout(ZERO_GETSCROLLSPEED_CLEAR, ZERO_GETSCROLLSPEED_DELAY)
  return ZERO_GETSCROLLSPEED_DELTA
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default (ctx, inject) => {
  inject('GetScrollSpeed', GetScrollSpeed)
  console.log(`🔌 [Plugin | Zero + Core] GetScrollSpeed`)
}
