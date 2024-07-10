<script lang="ts">
  import type { InterfaceGlobalOptions } from '../../../../lib/types'
  import type { CanOptions } from '../../../../lib/types/can'
  import ButtonText from '../../../shared/forms/ButtonText.svelte'
  import ButtonToggle from '../../../shared/forms/ButtonToggle.svelte'
  import ButtonToggleAlt from '../../../shared/forms/ButtonToggleAlt.svelte'
  import FormRadio from '../../../shared/forms/FormRadio.svelte'
  import InputNumber from '../../../shared/forms/InputNumber.svelte'
  import InputText from '../../../shared/forms/InputText.svelte'
  import BasicClassicModal from '../../../shared/modal/BasicClassicModal.svelte'

  export let isSettingsDialogDisplayed = false
  export let globalOptions: InterfaceGlobalOptions
  export let canOptions: CanOptions
  export let toggleCan: () => void
  export let validateSettings: () => void
  export let buildUrlAndOpenItInNewTab: (status: 'eleve' | 'usual') => void

</script>

<BasicClassicModal
  bind:isDisplayed={isSettingsDialogDisplayed}
>
  <div slot="header">
    Réglages de l'affichage des exercices
  </div>
  <div
    slot="content"
    class="pt-2 pl-2 grid grid-flow-row text-justify
      lg:grid-cols-2 md:gap-4">
    <div class="pb-2">
      <div class="pl-2 pb-2 font-light text-2xl
        text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
      >
        Interactivité
      </div>
      <FormRadio
        title="Interactif"
        bind:valueSelected={globalOptions.setInteractive}
        isDisabled={canOptions.isChoosen}
        labelsValues={[
          { label: 'Laisser tel quel', value: '2' },
          { label: 'Tout interactif', value: '1' },
          { label: "Pas d'interactivité", value: '0' }
        ]}
      />
      <div class="pl-2 pt-2">
        <ButtonToggle
          titles={[
            'Les élèves peuvent répondre une seule fois',
            'Les élèves peuvent répondre plusieurs fois'
          ]}
          bind:value={globalOptions.oneShot}
        />
      </div>
    </div>
    <div class="pb-2">
      <div class="pl-2 pb-2 font-bold
        text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
      >
        Course aux nombres
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <div class="flex flex-col items-start justify-start space-y-2 text-sm font-light
          text-coopmaths-corpus-light dark:text-coopmathsdark-corpus
          {canOptions.isChoosen ? 'text-opacity-100 dark:text-opacity-100' : 'text-opacity-10 dark:text-opacity-10'}"
        >
          <ButtonToggleAlt
            title={'Format CAN'}
            class="text-opacity-100 dark:text-opacity-100"
            id={'config-eleve-format-can-toggle'}
            bind:value={canOptions.isChoosen}
            on:toggle={toggleCan}
            explanations={[
              'Les questions seront posées les unes à la suite des autres en temps limité.',
              'Chaque exercice sera dans un onglet différent'
            ]}
          />
          <div class="flex justify-start flex-row items-center space-x-2">
            <div>
              Durée :
            </div>
            <InputNumber
              id="config-eleve-can-nb-questions-input"
              bind:value={canOptions.durationInMinutes}
              isDisabled={!canOptions.isChoosen}
            />
            <div>
              minute{(canOptions.durationInMinutes !== undefined && canOptions.durationInMinutes > 1) ? 's' : ''}.
            </div>
          </div>
          <div class="flex justify-start flex-row items-center space-x-2">
            <div>
              Sous-titre :
            </div>
            <InputText
              inputID="config-eleve-can-duration-input"
              bind:value={canOptions.subTitle}
              isDisabled={!canOptions.isChoosen}
            />
          </div>

          <ButtonToggleAlt
            title={'Accès aux solutions'}
            id={'config-eleve-solutions-can-toggle'}
            bind:value={canOptions.solutionsAccess}
            isDisabled={!canOptions.isChoosen}
            explanations={[
              'Les élèves auront accès aux solutions dans le format défini ci-dessous.',
              "Les élèves n'auront pas accès aux solutions."
            ]}
          />
          <FormRadio
            title="can-solutions-config"
            bind:valueSelected={canOptions.solutionsMode}
            isDisabled={!canOptions.isChoosen || !canOptions.solutionsAccess}
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
      <div class="pl-2 pb-2 font-light text-2xl
        text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
      >
        Données
      </div>
      <div class="flex justify-start-items-center pl-2 disabled"
      >
        Tous les élèves auront des pages :
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          titles={['différentes', 'identiques']}
          bind:value={globalOptions.isDataRandom}
        />
      </div>
    </div>
    <div class="pb-2">
      <div class="pl-2 pb-2 font-light text-2xl
        text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
      >
        Affichage des titres
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          titles={['Tous les titres sont affichés', 'Tous les titres sont masqués']}
          bind:value={globalOptions.isTitleDisplayed}
        />
      </div>
    </div>
    <div class="pb-2">
      <div class="pl-2 pb-2 font-light text-2xl
        text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
      >
        Correction
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          isDisabled={canOptions.isChoosen}
          titles={['Accès aux corrections', 'Pas de corrections']}
          bind:value={globalOptions.isSolutionAccessible}
        />
      </div>
    </div>
  </div>
  <div slot="footer" class="flex flex-row justify-end space-x-4 w-full">
    <div class="pt-4 pb-8 px-4">
      <ButtonText
        class="text-sm py-1 px-2 rounded-md h-7"
        on:click={validateSettings}
        text="Valider"
      />
    </div>
    <div class="pt-4 pb-8 px-4">
      <ButtonText
        class="text-sm py-1 px-2 rounded-md h-7"
        on:click={() => {
          buildUrlAndOpenItInNewTab('eleve')
        }}
        text="Aperçu"
      />
    </div>
  </div>
</BasicClassicModal>
