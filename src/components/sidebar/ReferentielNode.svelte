<script lang="ts">
  import { slide } from 'svelte/transition'
  import {
    isJSONReferentielEnding,
    isParentOfStaticEnding,
    isRealJSONReferentielObject,
    type JSONReferentielObject
  } from '../../lib/types/referentiels'
  import { codeToLevelTitle } from '../utils/refUtils'
  import { toMap } from '../utils/toMap'
  import themesList from '../../json/levelsThemesList.json'
  const themes = toMap(themesList)
  import ReferentielEnding from './ReferentielEnding.svelte'
  import StaticEnding from './StaticEnding.svelte'
  import { onMount } from 'svelte'
  export let subset: JSONReferentielObject
  export let unfold: boolean = false
  export let nestedLevelCount: number
  export let indexBase: number
  export let levelTitle: string
  export let pathToThisNode: string[]
  $: items = prepareSubset(subset)

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

  /**
   * Ordonne les entrées d'un sous-menu à l'envers lorsque son titre contient le mot `année`
   * afin de commencer par l'année la plus récente
   */
  function prepareSubset (s: JSONReferentielObject) {
    if (pathToThisNode.length !== 0 && pathToThisNode[pathToThisNode.length - 1].includes('année')) {
      return Object.entries(s).reverse()
    } else {
      return Object.entries(s)
    }
  }

  onMount(() => {
    if (nestedLevelCount === 1 && levelTitle === 'Exercices aléatoires') {
      unfold = true
    }
  })
</script>

<!--
  @component
  Composant destiné à afficher la liste des entrées d'un référentiel à un niveau N.
  On affiche le titre du niveau N et un clic sur ce titre déploie la liste des entrées
  du niveau N+1. Lorsque N=1, on considère que c'est un titre de section et le format est différent.

  #### Remarque
  Le composant s'appelle lui-même afin d'assurer récursivement le parcours entier du référentiel.
  On détecte si l'objet passé en paramètre est du type `JSONReferentielEnding` pour s'arrèter.
  Dans ce cas, le composant `ReferentielEnding.svelte` est appelé.

  #### Paramètres
  - **subset** (_JSONReferentielObject_) : la branche du référentiel à afficher.
  - **unfold** (_boolean_) : flag pour savoir si le niveau courant est déployé ou pas.
  - **nestedLevelCount** (_number_) : compteur pour connaître le nombre d'imbrication (utilisé pour la mise en page).
  - **indexBase** (_number_) : nombre utilisé pour identifier les éléments HTML.
  - **levelTitle** (_string_) : titre du niveau courant (clé du nœud retraduite sur la base des fichiers `levelsThemesList.json` et `codeToLevelList.json`).

 -->
<div class={`${$$props.class || ''}`}>
  <button
    id={'titre-liste-' + indexBase}
    type="button"
    disabled={Object.keys(subset).length === 0}
    class="w-full flex flex-row text-start items-center justify-between font-bold first-letter:first-linemarker
    {nestedLevelCount !== 1
      ? 'text-coopmaths-action dark:text-coopmathsdark-action hover:bg-coopmaths-canvas-darkest dark:hover:bg-coopmathsdark-canvas-darkest'
      : 'text-coopmaths-struct dark:text-coopmathsdark-struct py-6'}
    {unfold && nestedLevelCount !== 1
      ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest'
      : 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'}
    {Object.keys(subset).length === 0
      ? 'opacity-10'
      : 'opacity-100 cursor-pointer'}"
    style="padding-left: {(nestedLevelCount * 2) / 5}rem"
    on:click={() => {
      unfold = !unfold
    }}
  >
    <div
      id={'titre-liste-' + indexBase + '-content'}
      class=" {nestedLevelCount === 1 ? 'text-xl' : 'text-base'}"
    >
      <!-- on va chercher dans les fichiers JSON les significations des clés passées comme titre -->
      {codeToLevelTitle(levelTitle)}
      <span class="font-normal">{themeTitle(levelTitle)}</span>
    </div>
    <div>
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
        class="text-sm text-coopmaths-action dark:text-coopmathsdark-action bg-transparent transition-transform duration-500 ease-in-out
        {nestedLevelCount === 1 ? 'flex' : 'hidden'}
        {unfold ? 'bx bxs-up-arrow' : 'bx bxs-up-arrow rotate-[180deg]'}"
      />
    </div>
  </button>
  <div>
    {#if unfold}
      <ul transition:slide={{ duration: 500 }}>
        {#each items as [key, obj], i}
          <li>
            {#if isRealJSONReferentielObject(obj) && isParentOfStaticEnding(obj)}
              <StaticEnding
                pathToThisNode={[...pathToThisNode, key]}
                referentielToDisplay={obj}
                nestedLevelCount={nestedLevelCount + 1}
                isEmpty={false}
              />
            {:else if isJSONReferentielEnding(obj)}
              <ReferentielEnding
                ending={obj}
                nestedLevelCount={nestedLevelCount + 1}
                class={i === items.length - 1 ? 'pb-6' : ''}
              />
            {:else if Object.keys(obj).length === 0}
              <!-- Terminaison vide est affichée comme un bouton désactivé -->
              <StaticEnding
                pathToThisNode={[...pathToThisNode, key]}
                referentielToDisplay={{}}
                nestedLevelCount={nestedLevelCount + 1}
                isEmpty={true}
              />
            {:else}
              <svelte:self
                indexBase={`${indexBase}-${i.toString()}`}
                levelTitle={key}
                nestedLevelCount={nestedLevelCount + 1}
                pathToThisNode={[...pathToThisNode, key]}
                bind:subset={obj}
              />
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
