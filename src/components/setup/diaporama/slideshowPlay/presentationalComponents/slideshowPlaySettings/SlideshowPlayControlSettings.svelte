<script lang="ts">
  import Button from '../../../../../shared/forms/Button.svelte'

  export let isPause: boolean
  export let isManualModeActive: boolean | undefined
  export let prevQuestion: () => void
  export let nextQuestion: () => void
  export let switchPause: (isUserAction?: boolean) => void
</script>

<Button
  icon="bx-skip-previous"
  class="ml-2 bx-sm md:bx-lg"
  title="Raccourci clavier : flèche gauche"
  on:click={prevQuestion}
/>
<Button
  icon="{isPause ? 'bx-play' : 'bx-pause'}"
  class="ml-2 bx-sm md:bx-lg {isManualModeActive ? 'invisible' : ''}"
  title="Raccourci clavier : espace"
  on:click={() => switchPause(true)}
/>
<Button
  icon="bx-skip-next"
  class="ml-2 bx-sm md:bx-lg"
  title="Raccourci clavier : flèche droite"
  on:click={nextQuestion}
/>
