<script lang="ts">
  import {
    exercicesParams,
    darkMode,
    globalOptions
  } from '../../../lib/stores/generalStore'
  import { canOptions } from '../../../lib/stores/canStore'
  import { referentielLocale } from '../../../lib/stores/languagesStore'
  import {
    mathaleaGenerateSeed,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea.js'
  import Footer from '../../Footer.svelte'
  import NavBar from '../../shared/header/NavBar.svelte'
  import FormRadio from '../../shared/forms/FormRadio.svelte'
  import { onMount } from 'svelte'
  import ButtonToggleAlt from '../../shared/forms/ButtonToggleAlt.svelte'
  import ButtonQRCode from '../../shared/forms/ButtonQRCode.svelte'
  import { buildMathAleaURL } from '../../../lib/components/urls'
  // pour les tabs
  import { Tab, initTE } from 'tw-elements'
  import ButtonText from '../../shared/forms/ButtonText.svelte'
  import ButtonActionInfo from '../../shared/forms/ButtonActionInfo.svelte'

  onMount(() => {
    initTE({ Tab })
    // mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    handleSeed()
    const btnElementId = $canOptions.isChoosen
      ? 'tabs-pres-can-btn'
      : 'tabs-pres-classic-btn'
    const tabElementId = $canOptions.isChoosen
      ? 'tabs-pres-can'
      : 'tabs-pres-classic'
    const btnElement = document.getElementById(btnElementId)
    const tabElement = document.getElementById(tabElementId)
    btnElement?.setAttribute('data-te-nav-active', '')
    tabElement?.setAttribute('data-te-tab-active', '')
  })

  const availableLinkFormats = {
    clear: {
      toolTipsMessage: 'En clair',
      icon: 'bx-glasses-alt',
      isShort: false,
      isEncrypted: false
    },
    short: {
      toolTipsMessage: 'Raccourci',
      icon: 'bx-move-horizontal',
      isShort: true,
      isEncrypted: false
    },
    crypt: {
      toolTipsMessage: 'Crypté',
      icon: 'bx-lock',
      isShort: false,
      isEncrypted: true
    }
  }
  $: $canOptions.isInteractive = $globalOptions.setInteractive === '1'
  type LinkFormat = keyof typeof availableLinkFormats
  let currentLinkFormat: LinkFormat = 'clear'

  /**
   * Construit l'URL correspondant aux choix de la page de configuration et bascule sur cette page
   */
  function handleVueSetUp () {
    const nextView = $canOptions.isChoosen ? 'can' : 'eleve'
    const url = buildMathAleaURL({
      view: nextView,
      isEncrypted: availableLinkFormats[currentLinkFormat].isEncrypted
    })
    window.open(url, '_blank')?.focus()
  }

  // Gestion de la graine
  let isDataRandom: boolean = false
  function handleSeed () {
    for (const param of $exercicesParams) {
      if (!isDataRandom && param.alea === undefined) {
        param.alea = mathaleaGenerateSeed()
      } else if (isDataRandom) {
        param.alea = undefined
      }
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  function getEmbededCode () {
    return `<iframe src="${buildMathAleaURL({
      view: $canOptions.isChoosen ? 'can' : 'eleve',
      isEncrypted: availableLinkFormats[currentLinkFormat].isEncrypted
    })}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`
  }

  function toggleCan () {
    if ($canOptions.isChoosen) {
      $globalOptions.setInteractive = '1'
    }
  }
</script>

<main
  class=" {$darkMode.isActive
    ? 'dark'
    : ''} mb-auto flex flex-col min-h-screen justify-start bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <NavBar subtitle="La page Élève" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale}/>
  <div
    class="flex flex-col h-full w-full bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
  >
    <div
      class="h-full w-full md:w-2/3 lg:w-3/5 flex flex-col px-4 pb-4 md:py-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark mx-auto"
    >
      <div
        class="flex flex-col md:flex-row justify-start px-4 py-4 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      >
        <h3
          class="font-bold text-2xl text-coopmaths-struct dark:text-coopmathsdark-struct bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        >
          Réglages
        </h3>
      </div>
      <!-- Tabulations pour la présentation -->
      <ul
        class="flex list-none flex-row flex-wrap border-b-0 pl-0 pt-0 bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas"
        role="tablist"
        data-te-nav-ref
      >
        <li role="presentation" class="flex-grow basis-0 text-center">
          <a
            id="tabs-pres-classic-btn"
            href="#tabs-pres-classic"
            class="relative block font-extrabold px-7 pb-3.5 pt-4 text-base uppercase leading-tight text-coopmaths-action bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest hover:isolate hover:bg-coopmaths-action focus:isolate data-[te-nav-active]:bg-coopmaths-canvas data-[te-nav-active]:text-coopmaths-struct dark:text-coopmathsdark-action dark:hover:bg-coopmathsdark-action dark:hover:bg-opacity-20 dark:data-[te-nav-active]:bg-coopmathsdark-canvas dark:data-[te-nav-active]:text-coopmathsdark-struct
            {$canOptions.isChoosen
              ? ' hover:bg-opacity-10'
              : ' hover:bg-opacity-0'}"
            data-te-toggle="pill"
            data-te-target="#tabs-pres-classic"
            role="tab"
            aria-controls="tabs-pres-classic"
            aria-selected="true"
            on:click={() => {
              $canOptions.isChoosen = false
            }}
          >
            Présentation classique
          </a>
        </li>
        <li role="presentation" class="flex-grow basis-0 text-center">
          <a
            id="tabs-pres-can-btn"
            href="#tabs-pres-can"
            class="relative block font-extrabold px-7 pb-3.5 pt-4 text-base uppercase leading-tight text-coopmaths-action bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest hover:isolate hover:bg-coopmaths-action focus:isolate data-[te-nav-active]:bg-coopmaths-canvas data-[te-nav-active]:text-coopmaths-struct dark:text-coopmathsdark-action dark:hover:bg-coopmathsdark-action dark:hover:bg-opacity-20 dark:data-[te-nav-active]:bg-coopmathsdark-canvas dark:data-[te-nav-active]:text-coopmathsdark-struct
            {$canOptions.isChoosen
              ? ' hover:bg-opacity-0'
              : ' hover:bg-opacity-10'}"
            data-te-toggle="pill"
            data-te-target="#tabs-pres-can"
            role="tab"
            aria-controls="tabs-pres-can"
            aria-selected="false"
            on:click={() => {
              $canOptions.isChoosen = true
              toggleCan()
            }}
          >
            Course aux nombres
          </a>
        </li>
      </ul>
      <!-- Pages des réglages -->
      <div class="pb-6 pt-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
        <div
          class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
          id="tabs-pres-classic"
          role="tabpanel"
          aria-labelledby="tabs-pres-classic"
        >
          <!-- Présentation classique -->
          <div
            class="flex px-6 py-2 font-light text-lg text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          >
            Les exercices seront posés suivant les réglages ci-dessous.
          </div>
          <div class="pt-2 px-4 grid grid-flow-row md:grid-cols-3 gap-4">
            <div class="pb-2 w-full flex flex-col">
              <div
                class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
              >
                Présentation
              </div>
              <div
                class="pl-4 pb-4 w-full flex flex-row justify-start items-center space-x-2"
              >
                <div
                  class="text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus text-opacity-70 dark:text-opacity-70"
                >
                  Titre :
                </div>
                <input
                  type="text"
                  id="config-eleve-titre-input"
                  class="w-1/2 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border disabled:border-opacity-10 dark:disabled:border-opacity-10 border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0"
                  bind:value={$globalOptions.title}
                />
                <div
                  class="mt-1 text-coopmaths-corpus font-light italic text-xs {$globalOptions.title &&
                  $globalOptions.title.length === 0
                    ? ''
                    : 'invisible'}"
                >
                  Pas de bandeau si laissé vide.
                </div>
              </div>
              <FormRadio
                title="présentation"
                bind:valueSelected={$globalOptions.presMode}
                labelsValues={[
                  {
                    label: 'Tous les exercices sur une page',
                    value: 'liste_exos'
                  },
                  {
                    label: 'Une page par exercice',
                    value: 'un_exo_par_page',
                    isDisabled: $exercicesParams.length === 1
                  },
                  {
                    label: 'Toutes les questions sur une page',
                    value: 'liste_questions'
                  },
                  {
                    label: 'Une page par question',
                    value: 'une_question_par_page'
                  }
                  // { label: 'Cartes', value: 'cartes' }
                ]}
              />
              <div class="pl-4 pt-4">
                <ButtonToggleAlt
                  title={'Deux colonnes'}
                  isDisabled={$globalOptions.presMode === 'un_exo_par_page' ||
                    $globalOptions.presMode === 'une_question_par_page'}
                  bind:value={$globalOptions.twoColumns}
                  id={'config-eleve-nb-colonnes-toggle'}
                  explanations={[
                    'Les exercices seront présentés sur deux colonnes.',
                    'Les exercices seront présentés sur une seule colonne.'
                  ]}
                />
              </div>
            </div>

            <div class="pb-2">
              <div
                class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
              >
                Interactivité
              </div>
              <FormRadio
                title="Interactif"
                bind:valueSelected={$globalOptions.setInteractive}
                labelsValues={[
                  { label: 'Laisser tel quel', value: '2' },
                  { label: 'Tout interactif', value: '1' },
                  { label: "Pas d'interactivité", value: '0' }
                ]}
              />
              <div class="pl-2 pt-4">
                <ButtonToggleAlt
                  title={"Modifier l'interactivité"}
                  bind:value={$globalOptions.isInteractiveFree}
                  id={'config-eleve-interactif-permis-toggle'}
                  explanations={[
                    "Les élèves peuvent rendre l'exercice interactif ou pas.",
                    "Les élèves ne pourront pas changer le status de l'interactivité."
                  ]}
                />
              </div>
              <div class="pl-2 pt-2">
                <ButtonToggleAlt
                  title={'Une seule réponse'}
                  isDisabled={$globalOptions.setInteractive === '0'}
                  bind:value={$globalOptions.oneShot}
                  id={'config-eleve-refaire-toggle'}
                  explanations={[
                    "Les élèves n'auront qu'une seule possibilité pour répondre aux exercices.",
                    "Les élèves pourront refaire les exercices autant de fois qu'ils le souhaitent."
                  ]}
                  on:toggle={handleSeed}
                />
              </div>
            </div>
            <div class="pb-2">
              <div
                class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
              >
                Correction
              </div>
              <div class="flex flex-row justify-start items-center px-4">
                <ButtonToggleAlt
                  title={'Accès aux corrections'}
                  bind:value={$globalOptions.isSolutionAccessible}
                  id={'config-eleve-acces-corrections-toggle'}
                  explanations={[
                    'Les élèves pourront accéder aux corrections en cliquant sur un bouton.',
                    "Les élèves n'auront aucun moyen de voir la correction."
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
          id="tabs-pres-can"
          role="tabpanel"
          aria-labelledby="tabs-pres-can"
        >
          <!-- Can -->
          <div
            class="flex px-6 py-2 font-light text-lg text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          >
            Les questions seront posées les unes à la suite des autres en temps
            limité.
          </div>
          <div class="pt-2 px-4 grid grid-flow-row md:grid-cols-2 gap-4">
            <div class="pb-2 w-full flex flex-col">
              <div
                class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
              >
                Présentation
              </div>
              <div
                class="flex flex-col items-start justify-start space-y-2 px-4"
              >
                <div class="flex justify-start flex-row items-center space-x-2">
                  <div
                    class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                      ? 'text-opacity-100 dark:text-opacity-100'
                      : 'text-opacity-10 dark:text-opacity-10'}"
                  >
                    Durée :
                  </div>
                  <input
                    type="number"
                    id="config-eleve-can-duration-input"
                    class="w-1/5 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:border-opacity-10 disabled:text-opacity-10 dark:disabled:border-opacity-10 dark:disabled:text-opacity-10"
                    bind:value={$canOptions.durationInMinutes}
                    disabled={!$canOptions.isChoosen}
                  />
                  <div
                    class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                      ? 'text-opacity-100 dark:text-opacity-100'
                      : 'text-opacity-10 dark:text-opacity-10'}"
                  >
                    minute{$canOptions.durationInMinutes !== undefined &&
                    $canOptions.durationInMinutes > 1
                      ? 's'
                      : ''}.
                  </div>
                </div>
                <div class="flex justify-start flex-row items-center space-x-2">
                  <div
                    class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                      ? 'text-opacity-100 dark:text-opacity-100'
                      : 'text-opacity-10 dark:text-opacity-10'}"
                  >
                    Sous-titre :
                  </div>
                  <input
                    type="text"
                    id="config-eleve-can-duration-input"
                    class="w-1/2 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:border-opacity-10 disabled:text-opacity-10 dark:disabled:border-opacity-10 dark:disabled:text-opacity-10"
                    bind:value={$canOptions.subTitle}
                    disabled={!$canOptions.isChoosen}
                  />
                </div>
              </div>
            </div>
            <div class="pb-2">
              <div
                class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
              >
                Solutions
              </div>
              <div
                class="flex flex-col items-start justify-start space-y-2 px-4"
              >
                <ButtonToggleAlt
                  title={'Accès aux solutions'}
                  id={'config-eleve-solutions-can-toggle'}
                  bind:value={$canOptions.solutionsAccess}
                  isDisabled={!$canOptions.isChoosen}
                  explanations={[
                    'Les élèves auront accès aux solutions dans le format défini ci-dessous.',
                    "Les élèves n'auront pas accès aux solutions."
                  ]}
                />
                <FormRadio
                  title="can-solutions-config"
                  bind:valueSelected={$canOptions.solutionsMode}
                  isDisabled={!$canOptions.isChoosen ||
                    !$canOptions.solutionsAccess}
                  labelsValues={[
                    {
                      label: 'Solutions rassemblées à la fin.',
                      value: 'gathered'
                    },
                    {
                      label: 'Solutions avec les questions.',
                      value: 'split'
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pt-2 pl-2 grid grid-flow-row md:grid-cols-2 gap-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Données
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggleAlt
              title={'Données différentes'}
              bind:value={isDataRandom}
              id={'config-eleve-donnes-differentes-toggle'}
              explanations={[
                "Chaque élève aura des pages avec des données différentes d'un autre élève.",
                'Tous les élèves auront des pages identiques.'
              ]}
              on:toggle={handleSeed}
            />
          </div>
        </div>
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Affichage du titre de l'exercice
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggleAlt
              title={'Titre de l\'exercice'}
              bind:value={$globalOptions.isTitleDisplayed}
              id={'config-eleve-title-displayed-toggle'}
              explanations={[
                'Les titres sont affichés',
                'Les titres sont masqués.'
              ]}
              on:toggle={handleSeed}
            />
          </div>
        </div>
      </div>
      <div
        class="pt-4 pb-8 px-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <ButtonText
          on:click={handleVueSetUp}
          class="px-2 py-1 rounded-md"
          text="Visualiser"
        />
      </div>
      <div
        class="flex flex-row justify-start px-4 pt-4 pb-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      >
        <h3
          class="font-bold text-2xl text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          Utilisation
        </h3>
      </div>
      <div class="py-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
        <div
          class="flex flex-col md:flex-row justify-start space-x-10 items-start md:items-center px-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
        >
          <div
            class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-semibold"
          >
            Format de l'URL
          </div>
          <div class="flex">
            <FormRadio
              title="linkFormat"
              bind:valueSelected={currentLinkFormat}
              labelsValues={[
                { label: 'En clair', value: 'clear' },
                { label: 'Crypté', value: 'crypt' },
                { label: 'Raccourci', value: 'short', isDisabled: true }
              ]}
              orientation="row"
            />
          </div>
        </div>
        <div
          class="flex flex-row justify-start items-start space-x-10 pt-3 pl-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
        >
          <div class="flex flex-col items-center px-2">
            <div
              class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold"
            >
              Lien
            </div>
            <div class="my-1">
              <ButtonActionInfo
                action="copy"
                textToCopy={buildMathAleaURL({
                  view: $canOptions.isChoosen ? 'can' : 'eleve',
                  isEncrypted: availableLinkFormats[currentLinkFormat].isEncrypted
                }).toString()}
                tooltip={'Lien ' + availableLinkFormats[currentLinkFormat].toolTipsMessage}
                icon={'bx-link text-2xl'}
                cornerIcon={availableLinkFormats[currentLinkFormat].icon}
                messageSuccess="Le lien de la fiche élève est copié dans le presse-papier !"
                messageError="Impossible de copier le lien dans le presse-papier !"
              />
            </div>
          </div>
          <div class="flex flex-col justify-center items-center px-2">
            <div class="font-semibold
              text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-lightest"
            >
              QR-Code
            </div>
            <div class="my-1">
              <ButtonQRCode
                tooltip={'QR-code (lien ' + availableLinkFormats[currentLinkFormat].toolTipsMessage + ')'}
                url={buildMathAleaURL(
                  {
                    view: $canOptions.isChoosen ? 'can' : 'eleve',
                    isEncrypted: availableLinkFormats[currentLinkFormat].isEncrypted
                  }
                ).toString()}
                cornerIcon={availableLinkFormats[currentLinkFormat].icon}
              />
            </div>
          </div>
          <div class="flex flex-col justify-center items-center px-2">
            <div
              class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold"
            >
              Embarqué
            </div>
            <div class="my-1">
              <ButtonActionInfo
                action="copy"
                textToCopy={getEmbededCode()}
                tooltip={'Code (lien ' + availableLinkFormats[currentLinkFormat].toolTipsMessage + ')'}
                icon={'bx-code-alt text-2xl'}
                cornerIcon={availableLinkFormats[currentLinkFormat].icon}
                messageSuccess="Le code de la fiche élève est copié dans le presse-papier !"
                messageError="Impossible de copier le code dans le presse-papier !"
              />
            </div>
          </div>
          <div class="flex flex-col justify-center items-center px-2">
            <div
              class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold"
            >
              Fichier
            </div>
            <div class="my-1">
              <ButtonActionInfo
                action="download"
                urlToDownload={buildMathAleaURL({
                  view: $canOptions.isChoosen ? 'can' : 'eleve',
                  isEncrypted: availableLinkFormats[currentLinkFormat].isEncrypted
                }).toString()}
                fileName={$globalOptions.title ? $globalOptions.title : 'mathAlea'}
                successMessage="Le téléchargement va début dans quelques instants."
                errorMessage="Impossible de télécharger le fichier."
                tooltip={'Fichier de redirection (lien ' + availableLinkFormats[currentLinkFormat].toolTipsMessage + ')'}
                icon={'bxs-file-export text-2xl'}
                cornerIcon={availableLinkFormats[currentLinkFormat].icon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</main>
