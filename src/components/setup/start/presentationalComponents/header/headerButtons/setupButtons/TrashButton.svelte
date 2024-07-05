<script lang="ts">
    import Button from '../../../../../../../components/shared/forms/Button.svelte'

    export let trash: () => void

</script>

<div
  class="tooltip tooltip-bottom"
  data-tip="Supprimer tous les exercices"
>
  <Button
    text=""
    icon="bx-trash"
    class="text-3xl"
    on:click={trash}
  />
</div>
