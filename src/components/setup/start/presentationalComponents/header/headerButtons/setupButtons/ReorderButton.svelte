<script lang="ts">
  import Button from '../../../../../../../components/shared/forms/Button.svelte'
  export let reorderModalDisplayed: boolean

</script>

<div class="tooltip tooltip-bottom" data-tip="Réorganisation">
  <Button
    text=""
    icon="bx-transfer"
    class="flex items-center text-3xl rotate-90"
    on:click={() => {
      reorderModalDisplayed = !reorderModalDisplayed
    }}
  />
</div>
