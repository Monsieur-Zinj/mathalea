<script lang="ts">
  import { resizeTags } from '../../../lib/components/sizeTools'
  import { mathaleaUpdateUrlFromExercicesParams } from '../../../lib/mathalea'
  import { exercicesParams, globalOptions } from '../../../lib/stores/generalStore'

  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'bx-sm md:bx-md' = 'sm'
  export let isBorderTransparent: boolean = false

  const urlParams = new URLSearchParams(window.location.search)
  const z = urlParams.get('z')
  let zoom: number = (z ? Number.parseFloat(z) : 1)

  function zoomMinus () {
    // zoom -= 0.1
    zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    updateSize()
  }

  function zoomPlus () {
    // zoom += 0.1
    zoom = Number.parseFloat((zoom + 0.1).toFixed(1))
    updateSize()
  }

  function updateSize () {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    // figures scratch
    const scratchDivs = document.getElementsByClassName('scratchblocks')
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName('svg')
      resizeTags([...svgDivs], parseInt($globalOptions.z ?? '1'))
    }
    // QCM
    const checkboxes = document.querySelectorAll('[id^=checkEx')
    resizeTags([...checkboxes], parseInt($globalOptions.z ?? '1'))
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    // Event pour apiGeom
    const zoomEvent = new CustomEvent('zoomChanged', {
      detail: { zoom: $globalOptions.z }
    })
    document.dispatchEvent(zoomEvent)
  }
</script>

<button type="button" on:click={zoomMinus} class="tooltip tooltip-left tooltip-neutral" data-tip="Réduire la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-minus border border-coopmaths-action hover:border-coopmaths-action-lightest bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmaths-action-lightest
    {isBorderTransparent ? 'lg:border-transparent' : ''}"
  />
</button>
<button type="button" on:click={zoomPlus} class="tooltip tooltip-left tooltip-neutral" data-tip="Augmenter la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-plus border border-coopmaths-action hover:border-coopmaths-action-lightest bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmaths-action-lightest
    {isBorderTransparent ? 'lg:border-transparent' : ''}"
  />
</button>
