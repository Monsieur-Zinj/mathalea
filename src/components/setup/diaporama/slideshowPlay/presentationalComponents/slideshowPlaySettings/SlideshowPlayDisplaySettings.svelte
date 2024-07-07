<script lang="ts">
  import Button from '../../../../../shared/forms/Button.svelte'
  import FullscreenButton from '../../../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'

  export let zoomPlus: () => void
  export let zoomMinus: () => void
  export let BUTTONS_CLASS: string

</script>

<FullscreenButton/>
<Button
  icon="bx-plus"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : +"
  on:click={zoomPlus}
/>
<Button
  icon="bx-minus"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : -"
  on:click={zoomMinus}
/>
