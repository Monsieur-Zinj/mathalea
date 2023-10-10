<script lang="ts">
  import { slide } from 'svelte/transition'
  import {
    isJSONReferentielEnding,
    type JSONReferentielObject
  } from '../../lib/types/referentiels'
  import { codeToLevelTitle } from '../utils/refUtils'
  import { toMap } from '../utils/toMap'
  import themesList from '../../json/levelsThemesList.json'
  const themes = toMap(themesList)
  import ReferentielEnding from './ReferentielEnding.svelte'
  export let subset: JSONReferentielObject
  export let unfold: boolean = false
  export let nestedLevelCount: number
  export let indexBase: number
  export let levelTitle: string

  // const refFromSubset: JSONReferentielObject = buildReferentiel(subset)

  /**
   * Recherche dans la liste des thèmes si le thème est référencé
   * et si oui, renvoie son intitulé
   * @param {string} themeCode code du thème
   * @return {string} intitulé du thème
   * @author Sylvain Chambon & Rémi Angot
   */
  function themeTitle (themeCode: string) {
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
  class="w-full flex flex-row mr-4 items-center justify-between font-bold cursor-pointer first-letter:first-linemarker
  {nestedLevelCount !== 1
    ? 'text-coopmaths-action dark:text-coopmathsdark-action hover:bg-coopmaths-canvas-darkest dark:hover:bg-coopmathsdark-canvas-darkest'
    : 'text-coopmaths-struct dark:text-coopmathsdark-struct py-6'}
  {unfold && nestedLevelCount !== 1
    ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest'
    : 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'}"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
  on:click={() => {
    unfold = !unfold
  }}
>
  <div
    id={'titre-liste-' + indexBase + '-content'}
    class=" {nestedLevelCount === 1 ? 'text-2xl pl-2' : 'text-base'}"
  >
    <!-- on va chercher dans les fichiers JSON les significations des clés passées comme titre -->
    {codeToLevelTitle(levelTitle)}
    <span class="font-normal">{themeTitle(levelTitle)}</span>
  </div>
  <div class="pr-4">
    <!-- Suivant que c'est le premier niveau (nestedLevelCount = 1) ou pas, on a un affichage différent :
    le premier niveau correspond au tritre du référentiel -->
    <i
      class="text-xl bg-transparent transition-transform duration-500 ease-in-out
      {nestedLevelCount === 1 ? 'hidden' : 'flex'}
      {unfold && nestedLevelCount !== 1
        ? 'bx bx-plus rotate-[225deg]'
        : 'bx bx-plus'}"
    />
    <i
      class="text-xl text-coopmaths-action dark:text-coopmathsdark-action bg-transparent transition-transform duration-500 ease-in-out
      {nestedLevelCount === 1 ? 'flex' : 'hidden'}
      {unfold
        ? 'bx bxs-up-arrow'
        : 'bx bxs-up-arrow rotate-[180deg]'}"
    />
  </div>
</button>
<div>
  {#if unfold}
    <ul transition:slide={{ duration: 500 }}>
      {#each Object.entries(subset) as [key, obj], i}
        <li>
          {#if isJSONReferentielEnding(obj)}
            <ReferentielEnding
              ending={obj}
              nestedLevelCount={nestedLevelCount + 1}
            />
          {:else}
            <svelte:self
              indexBase={`${indexBase}-${i.toString()}`}
              levelTitle={key}
              nestedLevelCount={nestedLevelCount + 1}
              bind:subset={obj}
            />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
