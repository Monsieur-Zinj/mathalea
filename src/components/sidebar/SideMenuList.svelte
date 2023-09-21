<script lang="ts">
  import type { ReferentielForList } from '../../lib/types'
  import NiveauListeExos from './NiveauListeExos.svelte'
  import EntreeListeOutils from '../outils/EntreeListeOutils.svelte'
  import { codeToLevelTitle, isReferentielActivated } from '../utils/referentielsUtils'
  import SearchExercice from './SearchExercice.svelte'
  import { onMount } from 'svelte'
  import { toObject } from '../utils/toObj'
  import EntreeListeRessources from './EntreeListeRessources.svelte'
  import SideMenuApps from './SideMenuApps.svelte'

  export let ref: ReferentielForList
  export let moreThanOne: boolean = false
  const refAsObject: object = {}
  onMount(() => {
    for (const entry of ref.content) {
      Object.assign(refAsObject, { [entry.key]: toObject(entry.obj) })
    }
  })

  export let isMenuDeployed: boolean = false

  /**
   * Pour décider si une entrée doit être affichée dans le menu ou pas :
   * * on regarde si la valeur d'activation du référentiel (défini dans `referentielsActivation.json`)
   * * puis on regarde le flag `activated` (défini à la création du référentiel dans `Start` — et modifiable dans le code si besoin)
   */
  function isDisplayed (): boolean {
    if (isReferentielActivated(ref.name)) {
      return ref.activated
    } else {
      return false
    }
  }
</script>

<div class={isDisplayed() ? 'flex w-full flex-col' : 'hidden'}>
  <div
    class="w-full flex flex-row justify-between items-center px-6 py-2 md:py-6"
  >
    {#if ref.type === 'apps'}
      <SideMenuApps />
    {:else}
      <button
        type="button"
        class=" font-bold text-xl text-coopmaths-struct dark:text-coopmathsdark-struct"
        on:click={() => {
          isMenuDeployed = !isMenuDeployed
        }}
      >
        {ref.title}</button
      >
      <div class={moreThanOne ? 'flex' : 'flex md:hidden'}>
        <button
          type="button"
          on:click={() => {
            isMenuDeployed = !isMenuDeployed
          }}
        >
          <i
            class="bx bxs-up-arrow {isMenuDeployed
              ? 'rotate-0'
              : 'rotate-180'} transition-transform ease-in-out duration-500 bx-xl text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
          />
        </button>
      </div>
    {/if}
  </div>
  <ul class={isMenuDeployed ? 'w-full flex flex-col pl-4 ' : 'hidden'}>
    {#if ref.type === 'outils'}
      {#each ref.content as item, i}
        <li>
          <EntreeListeOutils outil={item} />
        </li>
      {/each}
    {:else if ref.type === 'exercices' || ref.type === 'examens'}
      <SearchExercice referentiel={refAsObject} on:filters />
      {#each ref.content as item, i}
        <li>
          <NiveauListeExos
            indexBase={i.toString()}
            nestedLevelCount={1}
            pathToThisNode={[item.key]}
            levelTitle={codeToLevelTitle(item.key)}
            items={item.obj}
            section={ref.type}
          />
        </li>
      {/each}
    {:else if ref.type === 'ressources'}
      {#each ref.content as item, i}
        <li>
          <EntreeListeRessources ressource={item.obj} />
        </li>
      {/each}
    {:else if ref.type === 'bibliotheque'}
      {#each ref.content as item, i}
        <li>
          <NiveauListeExos
            indexBase={i.toString()}
            nestedLevelCount={1}
            pathToThisNode={[item.key]}
            levelTitle={codeToLevelTitle(item.key)}
            items={item.obj}
            section={ref.type}
          />
        </li>
      {/each}
    {:else}
      <li class="italic font-light">Référentiel de type inconnu...</li>
    {/if}
  </ul>
</div>
