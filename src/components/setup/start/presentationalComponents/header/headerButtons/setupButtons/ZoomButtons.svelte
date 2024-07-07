<script lang="ts">
  import ButtonIcon from '../../../../../../shared/forms/ButtonIcon.svelte'

  export let zoomUpdate: (plusMinus: ('+' | '-')) => void

</script>

<div
  class="tooltip tooltip-bottom"
  data-tip="Réduire la taille du texte"
>
  <ButtonIcon
    icon="bx-zoom-out"
    class="flex items-center text-3xl"
    on:click={() => zoomUpdate('-')}
  />
</div>
<div
  class="tooltip tooltip-bottom"
  data-tip="Augmenter la taille du texte"
>
  <ButtonIcon
    icon="bx-zoom-in"
    class="flex items-center text-3xl"
    on:click={() => zoomUpdate('+')}
  />
</div>
