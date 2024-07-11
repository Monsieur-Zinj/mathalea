<script lang="ts">
  import NavBar from '../../../../../components/shared/header/NavBar.svelte'
  import ModalReorder from './ModalReorder.svelte'
  import HeaderButtons from './headerButtons/HeaderButtons.svelte'
  import SideMenuWrapper from './SideMenuWrapper.svelte'
  import type { VueType } from '../../../../../lib/types'
  import type { Language } from '../../../../../lib/types/languages'
  import NavBarCapytale from '../../capytale/NavBarCapytale.svelte'

  export let isExerciseDisplayed: boolean
  export let isNavBarVisible: boolean
  export let zoomUpdate: (plusMinus: ('+' | '-')) => void
  export let setAllInteractive: (isAllInteractive: boolean) => void
  export let newDataForAll: () => void
  export let trash: () => void
  export let setFullScreen: (isFullScreen: boolean) => void
  export let handleExport: (vue: VueType) => void
  export let locale: Language
  export let handleLanguage: (lang: string) => void
  export let isCapytale: boolean
  export let buildUrlAndOpenItInNewTab: (type: 'usual' | 'eleve') => void
  export let showSettingsDialog: () => void
  export let importExercises: (urlFeuilleEleve: string) => void
  export let isExercisesListEmpty: boolean
  export let isSidenavOpened: boolean
  export let toggleSidenav: (test: boolean) => void

  let reorderModalDisplayed: boolean

</script>

<header class="flex flex-col scrollbar-hide w-full
  md:sticky md:top-0 md:z-50
  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  {#if isCapytale}
    <div
      id="headerCapytale"
      class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
    >
      <NavBarCapytale
        {zoomUpdate}
        {newDataForAll}
        {trash}
        {buildUrlAndOpenItInNewTab}
        {showSettingsDialog}
        {importExercises}
        {isExercisesListEmpty}
      />
    </div>
  {:else}
    <!-- Entête -->
    {#if isNavBarVisible}
      <div
        id="headerStart"
        class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBar
          subtitle="Conception de document"
          subtitleType="design"
          {locale}
          {handleLanguage}
        />
      </div>
    {/if}
    <!-- Barre de boutons si non-smartphone  -->
    <div
      class="hidden md:flex {isExerciseDisplayed
        ? 'xl:h-[50px] md:h-[100px]'
        : 'h-0'}"
    >
      <div
        class={!isExerciseDisplayed
          ? 'hidden'
          : 'relative w-full flex flex-col justify-center items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}
        id="barre-boutons"
      >
        <SideMenuWrapper
          {isCapytale}
          {isSidenavOpened}
          {toggleSidenav}
        />
        <HeaderButtons
          bind:reorderModalDisplayed
          {zoomUpdate}
          {setAllInteractive}
          {newDataForAll}
          {trash}
          {setFullScreen}
          {handleExport}
        />
      </div>
    </div>
  {/if}
</header>

<ModalReorder {reorderModalDisplayed} />
