<script lang="ts">
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import { mathaleaHandleComponentChange } from '../../../../../lib/mathalea'
  import ButtonIcon from '../../../../shared/forms/ButtonIcon.svelte'
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ButtonQRCode from '../../../../shared/forms/ButtonQRCode.svelte'

  export let QRCodeWidth: number
  export let formatQRCodeIndex: 0 | 1 | 2
  export let returnToStart: () => void
  export let backToSettings: () => void

</script>

<div class="flex flex-row items-baseline justify-center w-full my-4">
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Début du diaporama"
  >
    <ButtonIcon
      icon="bx-arrow-back"
      class="mx-[3vw] my-2 text-[6vw]"
      on:click={returnToStart}
    />
  </div>
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Questions + Réponses"
  >
    <ButtonIcon
      icon="bx-detail text-[6vw]"
      class="mx-[3vw] my-2"
      on:click={() => mathaleaHandleComponentChange('diaporama', 'overview')}
    />
  </div>
  <ModalActionWithDialog
    on:click={() => copyLinkToClipboard('linkCopiedDialog-2', buildMathAleaURL('diaporama'))}
    messageSuccess="Le lien est copié dans le presse-papier !"
    messageError="Impossible de copier le lien dans le presse-papier."
    dialogId="linkCopiedDialog-2"
    tooltipMessage="Lien du Diaporama"
    buttonSize="text-[6vw]"
    classForButton="mx-[3vw] my-2"
  />
  <ButtonQRCode
    dialogId="QRCodeModal-2"
    imageId="QRCodeCanvas-2"
    tooltipMessage="QR-code du diaporama"
    url={document.URL}
    width={QRCodeWidth}
    format={formatQRCodeIndex}
    buttonSize="text-[6vw]"
    classForButton="mx-[3vw] my-2"
  />
  <div
    class="tooltip tooltip-bottom tooltip-neutral text-bg-coopmaths-canvas"
    data-tip="Sortir du diaporama"
  >
    <ButtonIcon
      icon="bx-home-alt-2 text-[6vw]"
      class="mx-[3vw] my-2"
      on:click={backToSettings}
    />
  </div>
</div>
