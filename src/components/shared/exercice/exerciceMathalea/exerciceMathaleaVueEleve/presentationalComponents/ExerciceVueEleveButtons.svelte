<script lang="ts">
    import type { InterfaceGlobalOptions } from '../../../../../../lib/types'
  import type TypeExercice from '../../../../../../exercices/Exercice'
  import ButtonText from '../../../../forms/ButtonText.svelte'
  import InteractivityIcon from '../../../../icons/TwoStatesIcon.svelte'
  export let exercise: TypeExercice
  export let indiceLastExercice: number
  export let globalOptions: InterfaceGlobalOptions
  export let newData: () => void
  export let isCorrectionVisible: boolean
  export let switchCorrectionVisible: () => void
  export let isInteractif: boolean
  export let switchInteractif: () => void
  export let columnsCount: number
  export let columnsCountUpdate: (plusMinus: ('+' | '-')) => void

</script>

<div class="flex flex-row justify-start items-center {indiceLastExercice > 1 && globalOptions.presMode !== 'un_exo_par_page' ? 'ml-2 lg:ml-6' : 'ml-2'} mb-2 lg:mb-6 {globalOptions.presMode === 'recto' || globalOptions.presMode === 'verso' ? 'hidden' : 'flex'}">
  <div class={!globalOptions.oneShot && globalOptions.done !== '1' ? 'flex' : 'hidden'}>
    <ButtonText
      text="Nouvel Énoncé"
      icon="bx-refresh"
      class="py-[2px] px-2 text-[0.7rem]"
      inverted={true}
      on:click={() => {
        newData()
      }}
    />
  </div>
  <div class={globalOptions.isSolutionAccessible && !exercise.isDone && ((exercise.interactif && exercise.isDone) || !exercise.interactif) ? 'flex ml-2' : 'hidden'}>
    <ButtonText
      text={isCorrectionVisible ? 'Masquer la correction' : 'Voir la correction'}
      icon={isCorrectionVisible ? 'bx-hide' : 'bx-show'}
      class="py-[2px] px-2 text-[0.7rem] w-36"
      inverted={true}
      on:click={switchCorrectionVisible}
    />
  </div>
  <button
    class={globalOptions.isInteractiveFree && exercise?.interactifReady ? 'w-5 ml-2 tooltip tooltip-right tooltip-neutral ' : 'hidden'}
    data-tip={isInteractif ? "Désactiver l'interactivité" : 'Rendre interactif'}
    type="button"
    on:click={switchInteractif}
  >
    <InteractivityIcon isOnStateActive={isInteractif} size={4} />
  </button>
  {#if globalOptions.recorder === undefined}
    <div class="hidden md:flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct text-xs">
      <button
        class={(columnsCount > 1 && window.innerWidth > 1000) ? 'visible' : 'invisible'}
        type="button"
        on:click={() => columnsCountUpdate('-')}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus" />
      </button>
      <i class="bx ml-1 bx-xs bx-columns" />
      <button
        type="button"
        on:click={() => columnsCountUpdate('+')}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 bx-xs bx-plus" />
      </button>
    </div>
  {/if}
</div>
