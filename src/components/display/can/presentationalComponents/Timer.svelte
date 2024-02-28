<script>
	import { onDestroy, createEventDispatcher} from 'svelte';
    import ElapsedTime from './ElapsedTime.svelte'
    import { millisecondToMinSec } from '../../../../lib/components/time'


    export let durationInMilliSeconds
    const dispatch = createEventDispatcher()

	let elapsed = 0
	let duration =  durationInMilliSeconds // 1min
    let displayedTime = ''
    let widthFactor = 1

	let last_time = window.performance.now();
	let frame
    
    
    

	(function update() {

		

		const time = window.performance.now();
		elapsed += time - last_time;

        if (elapsed > duration){
            if (frame) cancelAnimationFrame(frame)
            frame = undefined            
            dispatch('message', {
                 state: 'endTimer',
                 elapsed,
                 duration
            })
        } else {

            frame = requestAnimationFrame(update)

            const timeD = millisecondToMinSec(duration - elapsed)
            const formattedtime = [
            timeD.minutes.toString().padStart(2, '0'),
            timeD.seconds.toString().padStart(2, '0')
            ].join(':')

            displayedTime = formattedtime

            // console.log(displayedTime)
            // console.log(elapsed)

            widthFactor = ( duration - elapsed) / duration

            last_time = time
        }
	})()

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame)
        frame = undefined
	})

</script>


<ElapsedTime {widthFactor} {displayedTime} />

