<script lang="ts">
  import { exercicesParams } from '../store'
  export let ressource

  /* --------------------------------------------------------------
    Gestions des ressources via la liste
   --------------------------------------------------------------- */
  const isPresent = (code: string) => {
    return code === ressource.uuid
  }
  let selectedCount = 0
  let listeCodes: string[]
  // on compte réactivement le nombre d'occurences
  // de la ressource dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const entry of $exercicesParams) {
      listeCodes.push(entry.uuid)
    }
    listeCodes = listeCodes
    selectedCount = listeCodes.filter(isPresent).length
  }
  /**
   * Ajouter la ressource courante à la liste
   */
  function addToList () {
    const newRessource = {
      url: ressource.get('url'),
      id: ressource.get('id'),
      uuid: ressource.get('uuid')
    }
    exercicesParams.update((list) => [...list, newRessource])
  }
  /**
   * Retirer la ressource de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList () {
    const matchingIndex = listeCodes.findIndex(isPresent)
    exercicesParams.update((list) => [...list.slice(0, matchingIndex), ...list.slice(matchingIndex + 1)])
  }
  /* --------------------------------------------------------------
    Gestions des icônes en début de ligne
   --------------------------------------------------------------- */
  let icon = 'bxs-message-alt'
  let rotation = '-rotate-90'
  let mouseIsOut = true
  function handleMouseOver () {
    icon = 'bx-trash'
    rotation = 'rotate-0'
    mouseIsOut = false
  }
  function handleMouseOut () {
    icon = 'bxs-message-alt'
    rotation = '-rotate-90'
    mouseIsOut = true
  }
</script>

<div class="relative flex flex-row mr-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-2">
  <div
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
    on:click={addToList}
    on:keydown={addToList}
  >
    <div class="ml-[3px] pl-2 py-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1">
      <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
        {ressource.get('titre')}
      </div>
    </div>
  </div>
  {#if selectedCount >= 1}
    <button
      type="button"
      class="absolute -left-4"
      on:mouseover={handleMouseOver}
      on:focus={handleMouseOver}
      on:mouseout={handleMouseOut}
      on:blur={handleMouseOut}
      on:click={removeFromList}
      on:keydown={removeFromList}><i class="text-coopmaths-action-light dark:text-coopmathsdark-action-light text-base bx {icon} {rotation}" /></button
    >
  {/if}
  {#if selectedCount >= 2 && mouseIsOut}
    <div class="absolute -left-[12.5px] text-[0.6rem] font-bold text-coopmaths-canvas dark:text-coopmathsdark-canvas-dark">{selectedCount}</div>
  {/if}
</div>
