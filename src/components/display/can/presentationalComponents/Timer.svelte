<script>
import { onDestroy, createEventDispatcher } from 'svelte'
    import ElapsedTime from './ElapsedTime.svelte'
    import { millisecondToMinSec } from '../../../../lib/components/time'
  import { canOptions } from '../../../../lib/stores/canStore'

    export let durationInMilliSeconds
    const dispatch = createEventDispatcher()

let elapsed = 0
const duration = durationInMilliSeconds // 1min
    let displayedTime = ''
    let widthFactor = 1

let lastTime = window.performance.now()
let frame

(function update () {
  const time = window.performance.now()
  elapsed += time - lastTime

  if (elapsed > duration) {
    if (frame) cancelAnimationFrame(frame)
    frame = undefined
    dispatch('message', {
      state: 'endTimer',
      elapsed,
      duration
    })
  } else {
    frame = requestAnimationFrame(update)

    $canOptions.remainingTimeInSeconds = Math.floor((duration - elapsed) / 1000)

    const timeD = millisecondToMinSec(duration - elapsed)
    const formattedtime = [
      timeD.minutes.toString().padStart(2, '0'),
      timeD.seconds.toString().padStart(2, '0')
    ].join(':')

    displayedTime = formattedtime

    // console.log(displayedTime)
    // console.log(elapsed)

    widthFactor = (duration - elapsed) / duration

    lastTime = time
  }
})()

onDestroy(() => {
  if (frame) cancelAnimationFrame(frame)
  frame = undefined
})

</script>

<ElapsedTime {widthFactor} {displayedTime} />
