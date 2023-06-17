<script lang="ts">
  import { mathaleaUpdateUrlFromExercicesParams } from "../../lib/mathalea"
  import { exercicesParams, globalOptions } from "../store"

  export let size: "xs" | "sm" | "md" | "lg" | "bx-sm md:bx-md" = "sm"
  export let isBorderTransparent: boolean = false

  const urlParams = new URLSearchParams(window.location.search)
  let zoom = parseInt(urlParams.get("z")) || 1
  function zoomMinus() {
    // zoom -= 0.1
    zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    updateSize()
  }

  function zoomPlus() {
    // zoom += 0.1
    zoom = Number.parseFloat((zoom + 0.1).toFixed(1))
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    // affectation du zoom pour les figures scratch
    const scratchDivs = document.getElementsByClassName("scratchblocks")
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName("svg")
      for (const svg of svgDivs) {
        if (svg.hasAttribute("data-width") === false) {
          const originalWidth = svg.getAttribute("width")
          svg.dataset.width = originalWidth
        }
        if (svg.hasAttribute("data-height") === false) {
          const originalHeight = svg.getAttribute("height")
          svg.dataset.height = originalHeight
        }
        const w = svg.getAttribute("data-width") * $globalOptions.z
        const h = svg.getAttribute("data-height") * $globalOptions.z
        svg.setAttribute("width", w)
        svg.setAttribute("height", h)
      }
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
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
