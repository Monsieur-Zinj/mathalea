<script lang="ts">
  import {
    exercicesParams,
    darkMode,
    globalOptions
  } from '../../../lib/stores/generalStore'
  import { canOptions } from '../../../lib/stores/canStore'
  import {
    mathaleaGenerateSeed,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea.js'
  import Footer from '../../Footer.svelte'
  import NavBar from '../../shared/header/NavBar.svelte'
  import Button from '../../shared/forms/Button.svelte'
  import FormRadio from '../../shared/forms/FormRadio.svelte'
  import { onMount } from 'svelte'
  import ButtonToggleAlt from '../../shared/forms/ButtonToggleAlt.svelte'
  import ModalActionWithDialog from '../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQRCode from '../../shared/modal/ModalForQRCode.svelte'
  import {
    copyLinkToClipboard,
    copyEmbeddedCodeToClipboard
  } from '../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../lib/components/urls'
  import type { NumericRange } from '../../../lib/types'
  import displayKeyboardToggle from '../../../lib/displayKeyboardToggle'

  onMount(() => {
    // mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    handleSeed()
  })

  const formatQRCodeIndex: NumericRange<0, 2> = 0
  const QRCodeWidth = 100

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
    const url = buildMathAleaURL(nextView)
    console.log(url)
    window.open(url, '_blank')?.focus()
  }

  // Gestion du clavier
  let isBetaKeyboard: boolean = $globalOptions.beta ?? false
  function handleKeyboard () {
    $globalOptions.beta = isBetaKeyboard
    displayKeyboardToggle(isBetaKeyboard)
  }

  // Gestion de la graine
  let isDataRandom: boolean = false
  function handleSeed () {
    for (const param of $exercicesParams) {
      if (!isDataRandom && param.alea === undefined) {
        param.alea = mathaleaGenerateSeed()
      } else {
        param.alea = undefined
      }
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  function toggleCan () {
    if ($canOptions.isChoosen) {
      $globalOptions.setInteractive = '1'
      isBetaKeyboard = true
    }
  }
</script>

<main
  class="mb-auto flex flex-col min-h-screen justify-between bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive
    ? 'dark'
    : ''}"
>
  <NavBar subtitle="La page Élève" subtitleType="export" />
  <div
    class="flex flex-col h-full w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    <div
      class="h-full w-full md:w-2/3 lg:w-3/5 flex flex-col p-4 md:py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas mx-auto"
    >
      <div
        class="flex flex-col md:flex-row justify-start px-4 py-2 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <h3
          class="font-bold text-2xl text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          Réglages
        </h3>
      </div>
      <div class="pt-2 pl-2 grid grid-flow-row md:grid-cols-2 gap-4">
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
              class="text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus
                    {$canOptions.isChoosen
                      ? 'text-opacity-10 dark:text-opacity-10'
                      : 'text-opacity-70 dark:text-opacity-70'}"
            >
              Titre
            </div>
            <input
              type="text"
              id="config-eleve-titre-input"
              class="w-1/2 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border disabled:border-opacity-10 dark:disabled:border-opacity-10 border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0"
              bind:value={$globalOptions.title}
              disabled={$canOptions.isChoosen}
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
            isDisabled={$canOptions.isChoosen}
            labelsValues={[
              { label: 'Tous les exercices sur une page', value: 'liste_exos' },
              {
                label: 'Une page par exercice',
                value: 'un_exo_par_page',
                isDisabled: $exercicesParams.length === 1
              },
              {
                label: 'Toutes les questions sur une page',
                value: 'liste_questions'
              },
              { label: 'Une page par question', value: 'une_question_par_page' }
              // { label: 'Cartes', value: 'cartes' }
            ]}
          />
          <div class="pl-4 pt-4">
            <ButtonToggleAlt
              title={'Deux colonnes'}
              isDisabled={$globalOptions.presMode === 'un_exo_par_page' ||
                $globalOptions.presMode === 'une_question_par_page' ||
                $canOptions.isChoosen}
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
            Course aux nombres
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <div class="flex flex-col items-start justify-start space-y-2">
              <ButtonToggleAlt
                title={'Format CAN'}
                id={'config-eleve-format-can-toggle'}
                bind:value={$canOptions.isChoosen}
                on:toggle={toggleCan}
                explanations={[
                  'Les questions seront posées les unes à la suite des autres en temps limité.',
                  'Le format est classique, à définir dans Présentation.'
                ]}
              />
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
                  minute{($canOptions.durationInMinutes !== undefined && $canOptions.durationInMinutes > 1) ? 's' : ''}.
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
                isDisabled={!$canOptions.isChoosen || !$canOptions.solutionsAccess}
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
              isDisabled={$globalOptions.setInteractive === '0' || $canOptions.isChoosen}
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
              isDisabled={$globalOptions.setInteractive === '0' || $canOptions.isChoosen}
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
          <div
            class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Clavier
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggleAlt
              title={'Clavier expérimental'}
              bind:value={isBetaKeyboard}
              id={'config-eleve-clavier-experimental'}
              explanations={[
                'Nouveau clavier en test.',
                "On reste sur l'ancien clavier."
              ]}
              on:toggle={handleKeyboard}
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
              isDisabled={$canOptions.isChoosen}
            />
          </div>
        </div>
      </div>
      <div class="pt-4 pb-8 px-4">
        <Button
          on:click={handleVueSetUp}
          class="px-2 py-1 rounded-md"
          title="Visualiser"
        />
      </div>
      <div class="flex flex-row justify-start px-4 py-2">
        <h3
          class="font-bold text-2xl text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          Utilisation
        </h3>
      </div>
      <div
        class="flex flex-col md:flex-row justify-start space-x-10 items-start md:items-center px-4"
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
      <div class="flex flex-row justify-start items-start space-x-10 pt-3 pl-4">
        <div class="flex flex-col items-center px-2">
          <div
            class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold"
          >
            Lien
          </div>
          <div class="my-1">
            <ModalActionWithDialog
              on:display={() =>
                copyLinkToClipboard(
                  'linkCopiedDialog',
                  buildMathAleaURL($canOptions.isChoosen ? 'can' : 'eleve'),
                  availableLinkFormats[currentLinkFormat].isShort,
                  availableLinkFormats[currentLinkFormat].isEncrypted
                )}
              message="Le lien de la fiche élève est copié dans le presse-papier !"
              messageError="Impossible de créer le lien dans le presse-papier !"
              dialogId="linkCopiedDialog"
              tooltipMessage={'Lien ' +
                availableLinkFormats[currentLinkFormat].toolTipsMessage}
              buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
            />
          </div>
        </div>
        <div class="flex flex-col justify-center items-center px-2">
          <div
            class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-lightest font-semibold"
          >
            QR-Code
          </div>
          <div class="my-1">
            <ModalForQRCode
              tooltipMessage={'QR-code (lien ' +
                availableLinkFormats[currentLinkFormat].toolTipsMessage +
                ')'}
              width={QRCodeWidth}
              format={formatQRCodeIndex}
              isEncrypted={availableLinkFormats[currentLinkFormat].isEncrypted}
              isShort={availableLinkFormats[currentLinkFormat].isShort}
              url={buildMathAleaURL($canOptions.isChoosen ? 'can' : 'eleve').toString()}
              buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
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
            <ModalActionWithDialog
              on:display={() =>
                copyEmbeddedCodeToClipboard(
                  'embeddedCodeCopiedDialog',
                  buildMathAleaURL($canOptions.isChoosen ? 'can' : 'eleve'),
                  availableLinkFormats[currentLinkFormat].isShort,
                  availableLinkFormats[currentLinkFormat].isEncrypted
                )}
              message="Le code de la fiche élève est copié dans le presse-papier !"
              messageError="Impossible de créer le code dans le presse-papier !"
              dialogId="embeddedCodeCopiedDialog"
              tooltipMessage={'Code (lien ' +
                availableLinkFormats[currentLinkFormat].toolTipsMessage +
                ')'}
              buttonIcon={'bx-code-alt'}
              buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</main>
