<script lang="ts">
  import Sortable from "sortablejs"
  import ChipExo from "./ChipExo.svelte"
  import { exercicesParams, moveExercice } from "../store"
  import { onMount } from "svelte"

  let listeIdPourLesChips: string[] = []
  $: {
    listeIdPourLesChips = []
    for (const ex of $exercicesParams) {
      listeIdPourLesChips.push(ex.id ?? ex.uuid)
    }
    listeIdPourLesChips = listeIdPourLesChips
  }
  let chipsList: HTMLDivElement
  onMount(() => {
    chipsList = document.getElementById("chips-list")
    const sortable = Sortable.create(chipsList, {
      animation: 150,
      onEnd: (evt) => {
        exercicesParams.update((l) => {
          return moveExercice(l, evt.oldIndex, evt.newIndex)
        })
      },
    })
  })
</script>

<div class="flex flex-row p-0 items-center overflow-x-auto whitespace-nowrap space-x-2" id="chips-list">
  {#each listeIdPourLesChips as id, indice (indice)}
    <ChipExo text={id} {indice} />
  {/each}
</div>
