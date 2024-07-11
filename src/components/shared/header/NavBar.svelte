<script lang="ts">
  import {
    globalOptions,
    darkMode,
    callerComponent
  } from '../../../lib/stores/generalStore'
  import ButtonIcon from '../forms/ButtonIcon.svelte'
  import { mathaleaHandleComponentChange } from '../../../lib/mathalea'
  import NavBarSubtitle from './NavBarSubtitle.svelte'
  import {
    VUES_WITH_LANG_STATUS_ONLY,
    type Language
  } from '../../../lib/types/languages'
  import LanguageStatus from '../ui/LanguageStatus.svelte'
  import LanguageDropdown from '../ui/LanguageDropdown.svelte'
  import LanguageIcon from '../ui/LanguageIcon.svelte'
  import ModalLanguageChoice from '../modal/ModalLanguageChoice.svelte'
  import BasicClassicModal from '../modal/BasicClassicModal.svelte'

  export let title: string = 'MathALÉA'
  export let subtitle: string = ''
  export let subtitleType: 'export' | 'design' = 'export'
  export let locale: Language
  export let handleLanguage: (lang: string) => void

  let languageChoiceModal: BasicClassicModal
  let showLanguageChoiceModal: boolean = false

  function goToMathalea (paramV: string | undefined) {
    if (paramV !== undefined) {
      mathaleaHandleComponentChange(paramV, $callerComponent)
    }
  }
</script>

<!--
  @component
  Barre de titre pour une section du site positionnée en haut dans la page.
  Contient un titre pour l'endroit du site (MathALÉA, etc.),
  un sous titre pour indiquer la section (export, ), un bouton pour gérer le mode sombre et éventuellement
  un bouton pour fermer (c'est-à-dire revenir à la page d'accueil de la section.)

  ### Paramètres

  * `title` : le titre de la page (`MathALÉA` par défaut)
  * `subtitle` : son sous-titre
  * `subTItleType` : mot indiquant le type de la section pour décider de l'affichage (seulelemnt deux mode `export` et `design`)

  ### Exemple

  ```tsx
    <NavBarV2 subtitle="Conception de document" subtitleType="design" />
  ```
 -->

<nav class="p-4
  md:h-[120px]
  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <!-- container -->
  <div class="flex flex-row justify-between items-start w-full mx-auto
    space-x-0 md:space-x-6"
  >
    <div class="flex justify-start flex-col
      space-x-0 md:space-x-2"
    >
      <div class="flex align-middle
        flex-col md:flex-row">
        <div>
          <div
            on:click={() => goToMathalea($globalOptions.v)}
            on:keydown={() => goToMathalea($globalOptions.v)}
            role="link"
            tabindex="0"
            class="relative inline-flex font-logo9 tracking-tighter font-black
            text-3xl md:text-6xl
            {subtitleType === 'design'
              ? 'text-coopmaths-struct dark:text-coopmathsdark-struct'
              : `cursor-pointer
                text-coopmaths-action dark:text-coopmathsdark-action
                hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest`}"
          >
            {title}
          </div>
          <div class="absolute ml-3 -mt-1 font-light text-sm
              text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
          >
            <span class="font-light font-sans tracking-normal">par</span>
            <a
              href="https://coopmaths.fr"
              target="_blank"
              rel="noreferrer"
              class="font-extrabold font-logo9 tracking-tighter
                text-coopmaths-action dark:text-coopmathsdark-action
                hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
            >
              CoopMaths
            </a>
          </div>
        </div>
        <NavBarSubtitle {subtitle} type={subtitleType} />
      </div>
    </div>
    <div class="flex flex-row space-x-4 pt-2
      pr-0 md:pr-4"
    >
      {#if $globalOptions.v && VUES_WITH_LANG_STATUS_ONLY.includes($globalOptions.v)}
        <LanguageStatus {locale} />
      {:else}
        <!-- Menu déroulant en mode desktop -->
        <div class="hidden md:block">
          <LanguageDropdown {locale} {handleLanguage} />
        </div>
        <!-- En mode smartphone bouton commandant un dialogue -->
        <div class="md:hidden">
          <button
            type="button"
            on:click={() => {
              showLanguageChoiceModal = !showLanguageChoiceModal
            }}
          >
            <LanguageIcon {locale} />
          </button>
        </div>
      {/if}
      <label
        class="swap swap-rotate
          text-coopmaths-action dark:text-coopmathsdark-action
          hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
      >
        <!-- this hidden checkbox controls the state -->
        <input
          id="hidden-checkbox-for-darkmode"
          type="checkbox"
          class="invisible"
          bind:checked={$darkMode.isActive}
        />
        <div class="swap-on"><i class="bx bx-sm bx-sun" /></div>
        <div class="swap-off"><i class="bx bx-sm bx-moon" /></div>
      </label>
      <ButtonIcon
        icon="bx-x {subtitleType === 'design' ? 'hidden' : ''}"
        class="text-3xl"
        on:click={() => {
          goToMathalea($globalOptions.v)
        }}
      />
    </div>
  </div>
</nav>
<ModalLanguageChoice
  {languageChoiceModal}
  bind:showLanguageChoiceModal
  {locale}
  {handleLanguage}
/>
