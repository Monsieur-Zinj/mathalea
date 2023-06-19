<script lang="ts">
  import ChipExo from "./ChipExo.svelte"
  import { exercicesParams } from "../store"

  let listeIdPourLesChips: string[] = []
  $: {
    listeIdPourLesChips = []
    for (const ex of $exercicesParams) {
      listeIdPourLesChips.push(ex.id ?? ex.uuid)
    }
    listeIdPourLesChips = listeIdPourLesChips
  }
</script>

<div class="flex flex-row p-0 items-center overflow-x-auto whitespace-nowrap space-x-2">
  {#each listeIdPourLesChips as id, indice (indice)}
    <ChipExo text={id} {indice} />
  {/each}
</div>
