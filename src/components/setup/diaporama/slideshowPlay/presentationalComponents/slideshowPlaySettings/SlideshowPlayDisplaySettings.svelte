<script lang="ts">
  import Button from '../../../../../shared/forms/Button.svelte'
  import FullscreenButton from '../../../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'

  export let zoomPlus: () => void
  export let zoomMinus: () => void

</script>

<FullscreenButton/>
<Button
  icon="bx-plus"
  class="ml-2 bx-sm md:bx-lg"
  title="Raccourci clavier : +"
  on:click={zoomPlus}
/>
<Button
  icon="bx-minus"
  class="ml-2 bx-sm md:bx-lg"
  title="Raccourci clavier : -"
  on:click={zoomMinus}
/>
