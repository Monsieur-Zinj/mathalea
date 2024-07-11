<script lang="ts">
  import type { InterfaceGlobalOptions } from '../../../../../lib/types'
  import type { CanOptions } from '../../../../../lib/types/can'
  import ButtonText from '../../../../shared/forms/ButtonText.svelte'
  import BasicClassicModal from '../../../../shared/modal/BasicClassicModal.svelte'
  import ModalCapytalSettingsCan from './ModalCapytalSettingsCAN.svelte'
  import ModalCapytalSettingsCorrection from './ModalCapytalSettingsCorrection.svelte'
  import ModalCapytalSettingsTitles from './ModalCapytalSettingsTitles.svelte'
  import ModalCapytalSettingsData from './ModalCapytalSettingsData.svelte'
  import ModalCapytalSettingsInteractivity from './ModalCapytalSettingsInteractivity.svelte'

  export let isSettingsDialogDisplayed = false
  export let globalOptions: InterfaceGlobalOptions
  export let canOptions: CanOptions
  export let toggleCan: () => void
  export let buildUrlAndOpenItInNewTab: (status: 'eleve' | 'usual') => void
  export let updateParams: (params: { globalOptions: InterfaceGlobalOptions, canOptions: CanOptions }) => void

  const params = {
    globalOptions,
    canOptions
  }

  $: if (globalOptions || canOptions) {
    params.globalOptions = globalOptions
    params.canOptions = canOptions
  }

</script>

<BasicClassicModal
  bind:isDisplayed={isSettingsDialogDisplayed}
  on:close={() => updateParams(params)}
>
  <div slot="header">
    Réglages de l'affichage des exercices
  </div>
  <div
    slot="content"
    class="pt-2 pl-2 grid grid-flow-row text-justify
      lg:grid-cols-2 md:gap-4 font-light"
  >
    <div class="pb-2">
      <ModalCapytalSettingsInteractivity
        bind:globalOptions={params.globalOptions}
        bind:isDisabled={params.canOptions.isChoosen}
      />
    </div>
    <div class="pb-2">
      <ModalCapytalSettingsCan
        bind:canOptions={params.canOptions}
        bind:toggleCan={toggleCan}
      />
    </div>
    <div class="pb-2">
      <ModalCapytalSettingsData
        bind:globalOptions={params.globalOptions}
      />
    </div>
    <div class="pb-2">
      <ModalCapytalSettingsTitles
        bind:globalOptions={params.globalOptions}
      />
    </div>
    <div class="pb-2">
      <ModalCapytalSettingsCorrection
        bind:globalOptions={params.globalOptions}
        bind:canOptions={params.canOptions}
      />
    </div>
  </div>
  <div slot="footer" class="flex flex-row justify-end space-x-4 w-full">
    <div class="pt-4 pb-8 px-4">
      <ButtonText
        class="text-sm py-1 px-2 rounded-md h-7"
        on:click={() => {
          isSettingsDialogDisplayed = false
        }}
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
