<script lang="ts">
  import ButtonIcon from '../../../../../shared/forms/ButtonIcon.svelte'

  export let isPause: boolean
  export let isManualModeActive: boolean | undefined
  export let prevQuestion: () => void
  export let nextQuestion: () => void
  export let switchPause: (isUserAction?: boolean) => void
  export let BUTTONS_CLASS: string

</script>

<ButtonIcon
  icon="bx-skip-previous"
  buttonClass="{BUTTONS_CLASS}"
  title="Raccourci clavier : flèche gauche"
  on:click={prevQuestion}
/>
<ButtonIcon
  icon="{isPause ? 'bx-play' : 'bx-pause'}"
  buttonClass="{BUTTONS_CLASS} {isManualModeActive ? 'invisible' : ''}"
  title="Raccourci clavier : espace"
  on:click={() => switchPause(true)}
/>
<ButtonIcon
  icon="bx-skip-next"
  buttonClass="{BUTTONS_CLASS}"
  title="Raccourci clavier : flèche droite"
  on:click={nextQuestion}
/>
