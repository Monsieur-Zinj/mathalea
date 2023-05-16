<script lang="ts">
  import { exercicesParams } from "../store"
  import renderMathInElement from "katex/dist/contrib/auto-render.js"

  export let outil

  let nomDeExercice: HTMLDivElement

  $: {
    if (nomDeExercice && nomDeExercice.outerText.includes("$")) {
      renderMathInElement(nomDeExercice, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
        ],
        // Les accolades permettent d'avoir une formule non coupée
        preProcess: (chaine: string) => "{" + chaine.replaceAll(String.fromCharCode(160), "\\,") + "}",
        throwOnError: true,
        errorColor: "#CC0000",
        strict: "warn",
        trust: false,
      })
      // console.log(nomDeExercice.outerText)
    }
  }

  /*--------------------------------------------------------------
    Gestions des outils via la liste
   ---------------------------------------------------------------*/
  const isPresent = (code: string) => {
    return code === outil.uuid
  }
  const tags = outil.tags
  let selectedCount = 0
  let listeCodes: string[]
  // on compte réactivement le nombre d'occurences
  // de l'outil dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const exo of $exercicesParams) {
      listeCodes.push(exo.uuid)
    }
    listeCodes = listeCodes
    selectedCount = listeCodes.filter(isPresent).length
  }
  /**
   * Ajouter l'outil courant à la liste
   */
  function addToList() {
    console.log(outil)
    const newExercise = {
      url: outil.url,
      id: outil.id,
      uuid: outil.uuid,
    }
    exercicesParams.update((list) => [...list, newExercise])
    console.log("from add :")
    console.log($exercicesParams)
  }
  /**
   * Retirer l'outil de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList() {
    let matchingIndex = listeCodes.findIndex(isPresent)
    exercicesParams.update((list) => [...list.slice(0, matchingIndex), ...list.slice(matchingIndex + 1)])
    console.log("from remove :")
    console.log($exercicesParams)
  }

  /*--------------------------------------------------------------
    Gestions des icônes en début de ligne
   ---------------------------------------------------------------*/
  let icon = "bxs-message-alt"
  let rotation = "-rotate-90"
  let mouseIsOut = true
  function handleMouseOver() {
    icon = "bx-trash"
    rotation = "rotate-0"
    mouseIsOut = false
  }
  function handleMouseOut() {
    icon = "bxs-message-alt"
    rotation = "-rotate-90"
    mouseIsOut = true
  }
</script>

<!-- 
  @component
  Écrit le nom d'un outil sur le format : code + titre

  Par exemple : *5A12-1 - Primalité ou pas*

  Ajoute un tag en tête de ligne si le fichier est présent
  dans la liste des outils sélectionnés

  __Paramètres__ :
  
  - **outil** : objet de type *Exo* (`{"id": UUID de l'exo, "code": nom de l'exo (par exemple "6N12-3")}`)
  
 -->
<div class="relative flex flex-row mr-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-2">
  <div
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
    on:click={addToList}
    on:keydown={addToList}
  >
    <div class="ml-[3px] pl-2 py-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1" bind:this={nomDeExercice}>
      <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
        <span class="font-bold">{outil.id} - </span>{outil.titre}
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
