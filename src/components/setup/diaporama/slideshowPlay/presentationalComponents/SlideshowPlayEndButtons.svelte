<script lang="ts">
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import { mathaleaHandleComponentChange } from '../../../../../lib/mathalea'
  import ButtonQRCode from '../../../../shared/forms/ButtonQRCode.svelte'
  import ButtonActionInfo from '../../../../shared/forms/ButtonActionInfo.svelte'
  import ButtonIconTooltip from '../../../../shared/forms/ButtonIconTooltip.svelte'

  export let returnToStart: () => void
  export let backToSettings: () => void

</script>

<div class="flex flex-row items-baseline justify-center w-full my-4">
  <ButtonIconTooltip
    icon="bx-arrow-back mx-[3vw] my-2 text-[6vw]"
    tooltip="Début du Diaporama"
    on:click={returnToStart}
  />
  <ButtonIconTooltip
    icon="bx-detail mx-[3vw] my-2 text-[6vw]"
    tooltip="Questions + Réponses"
    on:click={() => mathaleaHandleComponentChange('diaporama', 'overview')}
  />
  <ButtonActionInfo
    action="copy"
    textToCopy={buildMathAleaURL({ view: 'diaporama' }).toString()}
    icon="bx-link text-[6vw] mx-[3vw] my-2"
    tooltip="Lien du Diaporama"
    successMessage="Le lien est copié dans le presse-papier !"
    errorMessage="Impossible de copier le lien dans le presse-papier."
  />
  <ButtonQRCode
    icon="bx-qr text-[6vw] mx-[3vw] my-2"
    tooltip="QR-code du diaporama"
    url={document.URL}
  />
  <ButtonIconTooltip
    icon="bx-home-alt-2 text-[6vw] mx-[3vw] my-2"
    tooltip="Sortir du diaporama"
    on:click={backToSettings}
  />
</div>
