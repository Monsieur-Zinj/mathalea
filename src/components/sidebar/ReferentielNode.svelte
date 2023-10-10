<script lang="ts">
  import { slide } from 'svelte/transition'
  import {
    isJSONReferentielEnding,
    type JSONReferentielObject,
    type ResourceAndItsPath
  } from '../../lib/types/referentiels'
  import {
    buildReferentiel,
    getAllExercises,
    codeToLevelTitle
  } from '../utils/refUtils'
  import { toMap } from '../utils/toMap'
  import themesList from '../../json/levelsThemesList.json'
  const themes = toMap(themesList)
  import ExerciceEnding from './ExerciceEnding.svelte'
  export let subset: ResourceAndItsPath[]
  export let unfold: boolean = false
  export let nestedLevelCount: number
  export let indexBase: number
  export let levelTitle: string

  const refFromSubset: JSONReferentielObject = buildReferentiel(subset)

  /**
   * Recherche dans la liste des thèmes si le thème est référencé
   * et si oui, renvoie son intitulé
   * @param {string} themeCode code du thème
   * @return {string} intitulé du thème
   * @author Sylvain Chambon & Rémi Angot
   */
  function themeTitle (themeCode: string) {
    console.log(themes)
    if (themes.has(themeCode)) {
      return [' : ', themes.get(themeCode).get('titre')].join('')
    } else {
      return ''
    }
  }
</script>

<button
  id={'titre-liste-' + indexBase}
  type="button"
  class="flex flex-row mr-4 items-center justify-between font-bold text-coopmaths-action dark:text-coopmathsdark-action hover:bg-coopmaths-canvas-darkest dark:hover:bg-coopmathsdark-canvas-darkest cursor-pointer first-letter:first-linemarker
  {unfold
    ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest'
    : 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'}"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
  on:click={() => {
    unfold = !unfold
  }}
>
  <div id={'titre-liste-' + indexBase + '-content'} class="text-base">
    {codeToLevelTitle(levelTitle)}
    <span class="font-normal">{themeTitle(levelTitle)}</span>
  </div>
</button>
<div>
  {#if unfold}
    <ul transition:slide={{ duration: 500 }}>
      {#each Object.entries(refFromSubset) as [key, obj], i}
        <li>
          {#if isJSONReferentielEnding(obj)}
            <ExerciceEnding
              ending={obj}
              nestedLevelCount={nestedLevelCount + 1}
            />
          {:else}
            <svelte:self
              indexBase={`${indexBase}-${i.toString()}`}
              levelTitle={key}
              nestedLevelCount={nestedLevelCount + 1}
              subset={getAllExercises(obj)}
            />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
