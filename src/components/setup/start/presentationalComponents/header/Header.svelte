<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import NavBar from '../../../../../components/shared/header/NavBar.svelte'
  import ModalReorder from './ModalReorder.svelte'
  import HeaderButtons from './headerButtons/HeaderButtons.svelte'
  import SideMenuWrapper from './SideMenuWrapper.svelte'
  import type { VueType } from '../../../../../lib/types'
  import type { Language } from '../../../../../lib/types/languages'

  interface SideMenuWrapperComponent extends SvelteComponent {
    toggleMenu: (t: boolean) => void
  }

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

  let reorderModalDisplayed: boolean
  let sideMenuWrapperComponent: SideMenuWrapperComponent

  /**
   * Wrapper pour la fonction `toggleMenu` définie dans `sideMenuWrapperComponent`
   * @param test flag pour indiquer si un test doit être effectué sur le fait que le menu est ouvert ou pas
   */
  export const toggleMenu = (test: boolean):void => {
    sideMenuWrapperComponent.toggleMenu(test)
  }
</script>

<header
  class="md:sticky md:top-0 md:z-50 flex flex-col scrollbar-hide w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <!-- Entête -->
  {#if isNavBarVisible}
    <div
      id="headerStart"
      class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
    >
      <NavBar subtitle="Conception de document" subtitleType="design" {locale} {handleLanguage} />
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
      <SideMenuWrapper bind:this={sideMenuWrapperComponent} />
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
</header>

<ModalReorder {reorderModalDisplayed} />
