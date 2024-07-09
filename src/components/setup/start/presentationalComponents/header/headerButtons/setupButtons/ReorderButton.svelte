<script lang="ts">
  import ButtonIcon from '../../../../../../shared/forms/ButtonIcon.svelte'
  export let reorderModalDisplayed: boolean

</script>

<div class="tooltip tooltip-bottom" data-tip="Réorganisation">
  <ButtonIcon
    icon="bx-transfer text-3xl rotate-90"
    on:click={() => {
      reorderModalDisplayed = !reorderModalDisplayed
    }}
  />
</div>
