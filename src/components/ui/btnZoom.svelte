<script lang="ts">
  import { mathaleaUpdateUrlFromExercicesParams } from "../../lib/mathalea"
  import { exercicesParams, globalOptions } from "../store"

  export let size: "xs" | "sm" | "md" | "lg" | "bx-sm md:bx-md" = "sm"

  const urlParams = new URLSearchParams(window.location.search)
  let zoom = parseInt(urlParams.get("z")) || 1
  function zoomMinus() {
    zoom -= 0.25
    updateSize()
  }

  function zoomPlus() {
    zoom += 0.25
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }
</script>

<button type="button" on:click={zoomMinus} class="tooltip tooltip-left tooltip-neutral" data-tip="Réduire la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-minus border border-coopmaths-action hover:border-coopmaths-action-lightest bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmaths-action-lightest"
  />
</button>
<button type="button" on:click={zoomPlus} class="tooltip tooltip-left tooltip-neutral" data-tip="Augmenter la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-plus border border-coopmaths-action hover:border-coopmaths-action-lightest bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmaths-action-lightest"
  />
</button>
