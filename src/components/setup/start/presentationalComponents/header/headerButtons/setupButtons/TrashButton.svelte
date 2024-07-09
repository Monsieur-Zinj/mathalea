<script lang="ts">
    import ButtonIcon from '../../../../../../shared/forms/ButtonIcon.svelte'

    export let trash: () => void

</script>

<div
  class="tooltip tooltip-bottom"
  data-tip="Supprimer tous les exercices"
>
  <ButtonIcon
    icon="bx-trash"
    buttonClass="text-3xl"
    on:click={trash}
  />
</div>
