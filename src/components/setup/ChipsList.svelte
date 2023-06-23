<script lang="ts">
  import Sortable from "sortablejs"
  import ChipExo from "./ChipExo.svelte"
  import { exercicesParams, moveExercice } from "../store"
  import { onMount } from "svelte"

  let idListForChips: string[] = []
  $: idListForChips = $exercicesParams.map((p) => p.id ?? p.uuid)
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

<div
  class="w-full grid justify-items-stretch place-content-stretch grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 p-0 items-center overflow-x-auto whitespace-nowrap"
  id="chips-list"
>
  {#each idListForChips as id, indice (id + indice)}
    <ChipExo text={id} {indice} />
  {/each}
</div>
