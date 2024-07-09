<script lang="ts">
  import ButtonIcon from '../../../../../../shared/forms/ButtonIcon.svelte'

  export let zoomUpdate: (plusMinus: ('+' | '-')) => void

</script>

<div
  class="tooltip tooltip-bottom"
  data-tip="Réduire la taille du texte"
>
  <ButtonIcon
    icon="bx-zoom-out text-3xl"
    on:click={() => zoomUpdate('-')}
  />
</div>
<div
  class="tooltip tooltip-bottom"
  data-tip="Augmenter la taille du texte"
>
  <ButtonIcon
    icon="bx-zoom-in text-3xl"
    on:click={() => zoomUpdate('+')}
  />
</div>
