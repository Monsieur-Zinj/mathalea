<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import NavBar from '../../../../../components/shared/header/NavBar.svelte'
  import ModalReorder from './ModalReorder.svelte'
  import HeaderButtons from './headerButtons/HeaderButtons.svelte'
  import SideMenuWrapper from './SideMenuWrapper.svelte'
  import type { VueType } from '../../../../../lib/types'
  import type { Language } from '../../../../../lib/types/languages'
    import NavBarIframe from '../../../capytale/NavBarIframe.svelte'
    import ButtonsDeck from '../../../../shared/ui/ButtonsDeck.svelte'
    import ButtonIconTooltip from '../../../../shared/forms/ButtonIconTooltip.svelte'
    import InputText from '../../../capytale/InputText.svelte'
    import ButtonText from '../../../../shared/forms/ButtonText.svelte'
    import { canOptions } from '../../../../../lib/stores/canStore'
    import { exercicesParams, globalOptions } from '../../../../../lib/stores/generalStore'
    import { mathaleaUpdateExercicesParamsFromUrl } from '../../../../../lib/mathalea'
    import ButtonWithTooltip from '../../../capytale/ButtonWithTooltip.svelte'

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
  export let isCapytale: boolean
  export let urlFeuilleEleve: string
  export let buildUrlAndOpenItInNewTab: (type: 'usual' | 'eleve') => void
  export let showSettingsDialog: () => void

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
    {#if isCapytale}
      <div
        id="headerCapytale"
        class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBarIframe>
          <div slot="buttons" class="w-full">
            <ButtonsDeck class="mt-4 md:mt-0">
              <div
                slot="setup-buttons"
                class="flex flex-row justify-center items-center space-x-4"
              >
                <ButtonIconTooltip
                  icon="bx-zoom-out text-3xl"
                  tooltip="Réduire la taille du texte"
                  on:click={() => zoomUpdate('-')}
                />
                <ButtonIconTooltip
                  icon="bx-zoom-in text-3xl"
                  tooltip="Augmenter la taille du texte"
                  on:click={() => zoomUpdate('+')}
                />
                <ButtonIconTooltip
                  icon="bx-refresh text-3xl"
                  tooltip="Nouveaux énoncés"
                  on:click={newDataForAll}
                />
                <ButtonIconTooltip
                  icon="bx-trash text-3xl"
                  tooltip="Supprimer tous les exercicess"
                  on:click={trash}
                />
              </div>
              <div slot="input" class="flex flex-row items-center space-x-4">
                <InputText
                  title="Importer les exercices d'une feuille élève"
                  placeholder="Lien"
                  bind:value={urlFeuilleEleve}
                  classAddenda="w-50"
                />
                <ButtonText
                  class="text-sm py-1 px-2 rounded-md h-7"
                  text="Ajouter"
                  disabled={urlFeuilleEleve.length === 0}
                  on:click={() => {
                    // exemple URL vue élève
                    // http://localhost:5173/alea/?uuid=01873&id=6C20&uuid=99522&id=6C22&uuid=64422&id=6C23&v=confeleve&v=eleve&title=&es=11101
                    let url = urlFeuilleEleve.replace('&v=confeleve', '')
                    url = url.replace('&v=eleve', '&recorder=capytale')
                    if (url.includes('v=can')) {
                      $canOptions.isChoosen = true
                    }
                    url = url.replace('&v=can', '&recorder=capytale')
                    url = url.replace(/es=\d/g, 'es=1') // Force la vue 1 page par exercice
                    if (url.includes('coopmaths.fr/alea')) {
                      const options = mathaleaUpdateExercicesParamsFromUrl(url)
                      if (options !== null) {
                        globalOptions.update(() => {
                          return options
                        })
                      } else {
                        alert('URL non valide !')
                      }
                      // On maintient Capytale car l'import d'une url non valide créé un objet globalOptions vide
                      $globalOptions.recorder = 'capytale'
                    }
                    urlFeuilleEleve = ''
                  }}
                />
              </div>
              <div
                slot="export-buttons"
                class="flex flex-row justify-center items-center space-x-4"
              >
                <ButtonIconTooltip
                  icon="bx-cog text-3xl"
                  tooltip="Régler l'affichage du mode élève"
                  disabled={$exercicesParams.length === 0}
                  on:click={showSettingsDialog}
                />
                <div>
                  <ButtonWithTooltip
                    tooltipTitle="Rejoindre MathALÉA"
                    tooltipPlacement="auto"
                    class="text-3xl"
                    isDisabled={$exercicesParams.length === 0}
                    on:click={() => {
                      buildUrlAndOpenItInNewTab('usual')
                    }}
                    title=""
                    icon="bx-log-out bx-rotate-180"
                  />
                </div>
              </div>
            </ButtonsDeck>
          </div>
        </NavBarIframe>
      </div>
    {:else}
      <div
        id="headerStart"
        class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBar subtitle="Conception de document" subtitleType="design" {locale} {handleLanguage} />
      </div>
    {/if}
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
