<script lang="ts">
  import { exercicesParams } from "../store"
  export let text = ""
  export let indice: number

  function remove() {
    exercicesParams.update((l) => [...l.slice(0, indice), ...l.slice(indice + 1)])
  }
</script>

<div
  id="exo-{indice}"
  class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-struct dark:bg-coopmathsdark-struct text-coopmaths-canvas dark:text-coopmathsdark-canvas text-xs px-1 py-[1px] shadow-sm cursor-move"
>
  {text}
  <button class="ml-2 bg-transparent hover focus:outline-none cursor-pointer" on:click={remove}>
    <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-x font-semibold text-base" />
  </button>
</div>
