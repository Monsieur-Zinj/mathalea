<script lang="ts">
  import StarIcon from "../icons/StarIcon.svelte"
  import { exercicesParams } from "../store"

  export let application = {
    title: "Titre",
    presentation: " blabla",
    imgPath: "images/apps/appDefault.png",
    uuid: "theUuid",
  }
  export let reversed = false
  export let selected = false

  let listeCodes: string[]
  // on compte réactivement le nombre d'occurences
  // de la ressource dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const entry of $exercicesParams) {
      listeCodes.push(entry.uuid)
    }
    listeCodes = listeCodes
  }

  function addAppToList() {
    exercicesParams.update((list) => [...list, { uuid: application.uuid }])
  }
  const isPresent = (code: string) => {
    return code === application.uuid
  }
  function removeAppFromList() {
    const matchingIndex = listeCodes.findIndex(isPresent)
    exercicesParams.update((list) => [...list.slice(0, matchingIndex), ...list.slice(matchingIndex + 1)])
  }
  function handelSelection() {
    selected = !selected
    if (selected) {
      addAppToList()
    } else {
      removeAppFromList()
    }
  }
</script>

<div class="relative block w-full rounded-lg bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark shadow-lg border border-coopmaths-canvas-darkest dark:border-coopmathsdark-canvas-darkest">
  <div class="{reversed ? 'hide' : 'block'} ">
    <img src={application.imgPath} alt="{application.title} image" class="object-fill rounded-t-lg" />
  </div>
  <div class="p-2">
    <h5 class="mb-2 text-lg font-bold leading-tight text-coopmaths-struct dark:text-coopmathsdark-struct">{application.title}</h5>
    <p class="max-h-24 min-h-24 h-24 text-sm text-ellipsis overflow-hidden mb-4 font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus leading-tight">{application.presentation}</p>
  </div>
  <div class="absolute -bottom-4 left-1/2 -translate-x-1/2">
    <button type="button" class="rounded-full h-8 w-8 bg-coopmaths-action text-coopmaths-canvas flex justify-center items-center hover:animate-pulse" on:click={handelSelection}>
      <i class="bx bx-sm {selected ? 'bx-minus' : 'bx-plus'}" />
    </button>
  </div>
  <div class="absolute top-3 right-3">
    <div class="relative">
      <StarIcon class="{selected ? 'container' : 'hidden'} top-0 left-0 h-12 w-12 text-coopmaths-warn-800 dark:text-coopmathsdark-warn" />
      <i class="{selected ? 'container' : 'hidden'} absolute top-1 left-1 bx bx-check bx-md text-coopmaths-canvas dark:text-coopmathsdark-canvas" />
    </div>
  </div>
</div>
