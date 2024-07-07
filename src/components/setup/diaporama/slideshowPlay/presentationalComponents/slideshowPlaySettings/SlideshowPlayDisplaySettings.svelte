<script lang="ts">
  import ButtonIcon from '../../../../../shared/forms/ButtonIcon.svelte'
  import FullscreenButton from '../../../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'

  export let zoomPlus: () => void
  export let zoomMinus: () => void
  export let BUTTONS_CLASS: string

</script>

<FullscreenButton/>
<ButtonIcon
  icon="bx-plus"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : +"
  on:click={zoomPlus}
/>
<ButtonIcon
  icon="bx-minus"
  class="{BUTTONS_CLASS}"
  title="Raccourci clavier : -"
  on:click={zoomMinus}
/>
