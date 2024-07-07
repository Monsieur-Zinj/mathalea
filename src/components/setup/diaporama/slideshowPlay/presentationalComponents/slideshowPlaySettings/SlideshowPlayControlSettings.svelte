<script lang="ts">
  import Button from '../../../../../shared/forms/Button.svelte'

  export let isPause: boolean
  export let isManualModeActive: boolean | undefined
  export let prevQuestion: () => void
  export let nextQuestion: () => void
  export let switchPause: (isUserAction?: boolean) => void
  export let BUTTONS_CLASS: string

</script>

<Button
  icon="bx-skip-previous"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : flèche gauche"
  on:click={prevQuestion}
/>
<Button
  icon="{isPause ? 'bx-play' : 'bx-pause'}"
  class="{BUTTONS_CLASS} {isManualModeActive ? 'invisible' : ''}"
  title="Raccourci clavier : espace"
  on:click={() => switchPause(true)}
/>
<Button
  icon="bx-skip-next"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : flèche droite"
  on:click={nextQuestion}
/>
