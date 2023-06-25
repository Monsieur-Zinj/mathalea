<script lang="ts">
  import Sortable from "sortablejs"
  import ChipExo from "./ChipExo.svelte"
  import { exercicesParams, moveExercice } from "../store"
  import { onMount } from "svelte"
  import { uuidCount, exercisesUuidRanking } from "../utils/counts"
  import { getUniqueStringBasedOnTimeStamp } from "../utils/time"

  // let idListForChips: string[] = []
  // $: idListForChips = $exercicesParams.map((p) => {
  //   ref: p.id ?? p.uuid
  // })
  let listIdsForChips: string[] = []
  $: {
    let lIFC = []
    let ranks: number[]
    let counts
    for (const [i, ex] of $exercicesParams.entries()) {
      ranks = exercisesUuidRanking($exercicesParams)
      counts = uuidCount($exercicesParams)
      const insert: string = `${counts[ex.uuid] > 1 ? " [" + ranks[i] + "]" : ""}`
      const keyValue = getUniqueStringBasedOnTimeStamp(i)
      const obj = {
        ref: ex.id ?? ex.uuid,
        title: `${ex.id ?? ex.uuid}${insert}`,
        key: keyValue,
      }
      lIFC.push(obj)
    }
    listIdsForChips = lIFC
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

  const isPresent = (code: string) => {
    return code === exercice.get("uuid")
  }
</script>

<div
  class="w-full grid justify-items-stretch place-content-stretch grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 p-0 items-center overflow-x-auto whitespace-nowrap"
  id="chips-list"
>
  {#each listIdsForChips as id, indice (id.key)}
    <ChipExo text={id.title} {indice} />
  {/each}
</div>
