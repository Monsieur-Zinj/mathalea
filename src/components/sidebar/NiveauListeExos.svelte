<script lang="ts">
  import { slide } from "svelte/transition"
  import EntreeListeExos from "./EntreeListeExos.svelte"
  import { toMap } from "../utils/toMap"

  export let expanded: boolean = false
  export let levelTitle: string
  export let items: any
  export let pathToThisNode: string[]
  export let nestedLevelCount: number
  export let indexBase: string
  import themesList from "../../json/levelsThemesList.json"
    import { convertLatexToSpeakableText } from "mathlive";

  const themes = toMap(themesList)
  let listeExercices: HTMLUListElement
  /**
   * Recherche dans la liste des thèmes si le thème est référencé
   * et si oui, renvoie son intitulé
   * @param {string} themeCode code du thème
   * @return {string} intitulédu thème
   * @author Sylvain Chambon & Rémi Angot
   */
  function themeTitle(themeCode: string) {
    if (themes.has(themeCode)) {
      return [" : ", themes.get(themeCode).get("titre")].join("")
    } else {
      return ""
    }
  }

  /**
   * Basculer le flag pour l'affichage du contenu
   */
   function updateItems() {
    // const item = Array.from(items, ([key, obj]) => ({ key, obj }))    
    if (items){    
      const regExpEntreesRef = /^(?:(?:(?:(?:c3)|\d)\S\d){1}|(?:can\d\S))(?:.*){0}$/g
      const regExpBrevetAnnee = /^(?:Brevet)(?:.*?)(?:année)/g
      const regExpBrevetThème = /^(?:Brevet)(?:.*?)(?:thèmes)/g
      // entrées DNB(années) années décroissantes
      if (levelTitle.match(regExpBrevetAnnee)) {
        items = new Map([...items.entries()].reverse())
      }
      // entrées exos 4A10 avant 4A10-1
      if (levelTitle.match(regExpEntreesRef)) {
        items = new Map([...items.entries()].sort())
      }
      // entrées DNB(thèmes) années décroissantes
      if ((indexBase.match(/-/g) || []).length === 2) {
        // console.log('match3')
        const parentIdElt = document.getElementById("titre-liste-" + indexBase.replaceAll(/(-\d+)$/g, ""))
        const parentTitle = parentIdElt!=null ? document.getElementById(parentIdElt.id + "-content").textContent : ""
        if (parentTitle.match(regExpBrevetThème)) {
          const regExpDNBYearMonth = /^(?:dnb_)(?<year>\d{4})_(?<month>\d{2})/g
          items = new Map(
            [...items.entries()].sort((exoA, exoB) => {
              const exoAData = [...exoA[0].matchAll(regExpDNBYearMonth)]
              const exoBData = [...exoB[0].matchAll(regExpDNBYearMonth)]
              const exoAYear = parseInt(exoAData[0].groups.year)
              const exoBYear = parseInt(exoBData[0].groups.year)
              if (exoAYear !== exoBYear) {
                return exoBYear - exoAYear
              }
              const exoAMonth = parseInt(exoAData[0].groups.month)
              const exoBMonth = parseInt(exoBData[0].groups.month)
              return exoBMonth - exoAMonth
            })
          )
        }
      }
    }
  }

  updateItems();
  
  /**
   * Basculer le flag pour l'affichage du contenu
   */
  function toggleContent() {
    expanded = !expanded
  }

  

  /* Mickel Guironnet  : 
  Très dangereux de bind:this={listeExercices} sur un arbre récursif.
  Très lourd en javascript...
  $: {
    if (listeExercices) mathaleaRenderDiv(listeExercices)
  }*/
</script>

<!-- 
  @component
  Écrire la liste des exercices disponibles 
  à partir des entrées de l'arbre du référentiel 
  convertion du fichier `referentiel2022.json`.

  Paramètres :
  - **expanded** : booléen indiquant si le contenu du niveau est affiché ou pas
  - **levelTitle** : titre du niveau
  - **items** : entrées du contenu du niveau
  - **pathToThisNode** : chemin amenant à ce niveau
  - **nestedLevelCount** : compteur pour connaître le nombre d'imbrication (utilisé pour l'indentation de la ligne) class="pl-{nestedLevelCount * 2}"
 -->
<div
  id={"titre-liste-" + indexBase}
  class="flex flex-row items-center justify-between {expanded
    ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest'
    : 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'} font-bold text-coopmaths-action dark:text-coopmathsdark-action hover:bg-coopmaths-canvas-darkest dark:hover:bg-coopmathsdark-canvas-darkest cursor-pointer"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
  on:click={toggleContent}
  on:keydown={toggleContent}
>
  <div id={"titre-liste-" + indexBase + "-content"} class="text-base">{levelTitle} <span class="font-normal">{themeTitle(levelTitle)}</span></div>
  <i class=" text-xl bg-transparent bx {expanded ? 'bx-plus rotate-[225deg]' : 'bx-plus'} transition-transform duration-500 ease-in-out" />
</div>
{#if expanded}
  {#if levelTitle === "Nouveautés" && Array.from(items, ([key, obj]) => ({ key, obj })).length === 0}
    <div class="flex flex-row p-2 justify-start items-center">
      <span class="font-light italic text-sm">Pas de publication ou de modification récente.</span>
    </div>
  {/if}
  <ul transition:slide={{ duration: 500 }}>
    {#each Array.from(items, ([key, obj]) => ({ key, obj })) as item, i}
      <li>
        {#if item.obj.has("uuid")}
          <EntreeListeExos nestedLevelCount={nestedLevelCount + 1} exercice={item.obj} />
        {:else}
          <svelte:self indexBase={`${indexBase}-${i.toString()}`} nestedLevelCount={nestedLevelCount + 1} pathToThisNode={[...pathToThisNode, item.key]} levelTitle={item.key} items={item.obj} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
