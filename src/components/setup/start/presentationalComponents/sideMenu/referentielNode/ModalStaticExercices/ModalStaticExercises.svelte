<script lang="ts">

  // ==============================================================================================
  //
  //                                        DEAD CODE
  //
  // ==============================================================================================

  import ModalGridOfCards from '../../../../../../shared/modal/ModalGridOfCards.svelte'
  import { isStaticType, type JSONReferentielEnding, type StaticItemInreferentiel } from '../../../../../../../lib/types/referentiels'
  import CardForStatic from '../../../../../../shared/ui/CardForStatic.svelte'
  import { doesImageExist } from '../../../../../../../lib/components/images'
  import BreadcrumbHeader from './BreadcrumbHeader.svelte'

  export let isVisible: boolean
  export let bibliothequePathToSection: string[]
  export let bibliothequeUuidInExercisesList: string[]
  export let bibliothequeDisplayedContent: Record<string, JSONReferentielEnding>
  let bibliothequeChoiceModal: ModalGridOfCards

  const buildBiblioToBeDisplayed = (): StaticItemInreferentiel[] => {
    const results: StaticItemInreferentiel[] = []
    if (bibliothequeDisplayedContent) {
      Object.values(bibliothequeDisplayedContent).forEach((item) => {
        if (isStaticType(item)) {
          results.push(item)
        }
      })
    }
    return results
  }
</script>
<!-- Fenêtre de dialogue pour le choix des exercices de la bibliothèque statique -->
<ModalGridOfCards
  bind:this={bibliothequeChoiceModal}
  bind:displayModal={isVisible}
>
  <div slot="header">
    <BreadcrumbHeader path={bibliothequePathToSection} />
  </div>
  <div slot="content">
    <div class="mx-2 pt-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each buildBiblioToBeDisplayed() as exercise}
          {#if doesImageExist(exercise.png)}
            <CardForStatic
              {exercise}
              selected={bibliothequeUuidInExercisesList.includes(exercise.uuid)}
            />
          {/if}
        {/each}
      </div>
    </div>
  </div>
</ModalGridOfCards>
