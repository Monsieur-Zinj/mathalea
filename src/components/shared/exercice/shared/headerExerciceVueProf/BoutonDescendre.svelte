<script lang="ts">
  import { exercicesParams, moveExercice } from '../../../../../lib/stores/generalStore'
  export let indice: number
  export let indiceLastExercice: number
  function descendre () {
    exercicesParams.update((l) => {
      return moveExercice(l, indice, indice + 1)
    })
  }
</script>

<button
  on:click={descendre}
  class={indice === indiceLastExercice ? 'hidden md:invisible' : ''}
>
  <i
    class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-down-arrow-circle"
  />
</button>
