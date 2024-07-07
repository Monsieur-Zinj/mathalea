<script lang="ts">
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import { mathaleaHandleComponentChange } from '../../../../../lib/mathalea'
  import Button from '../../../../shared/forms/Button.svelte';
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQrCode from '../../../../shared/modal/ModalForQRCode.svelte';

  export let QRCodeWidth: number;
  export let formatQRCodeIndex: 0 | 1 | 2
  export let returnToStart: () => void
  export let backToSettings: () => void

</script>

<div class="flex flex-row items-baseline justify-center w-full mx-10 my-4">
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Début du diaporama"
  >
    <Button
      icon="bx-arrow-back text-[100px]"
      class="mx-12 my-2"
      on:click={returnToStart}
    />
  </div>
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Questions + Réponses"
  >
    <Button
      icon="bx-detail text-[100px]"
      class="mx-12 my-2"
      on:click={() => mathaleaHandleComponentChange('diaporama', 'overview')}
    />
  </div>
  <ModalActionWithDialog
    on:display={() => copyLinkToClipboard('linkCopiedDialog-2', buildMathAleaURL('diaporama'))}
    message="Le lien est copié dans le presse-papier !"
    messageError="Impossible de copier le lien dans le presse-papier."
    dialogId="linkCopiedDialog-2"
    tooltipMessage="Lien du Diaporama"
    buttonSize="text-[100px]"
    classForButton="mx-12 my-2"
  />
  <ModalForQrCode
    dialogId="QRCodeModal-2"
    imageId="QRCodeCanvas-2"
    tooltipMessage="QR-code du diaporama"
    url={document.URL}
    width={QRCodeWidth}
    format={formatQRCodeIndex}
    buttonSize="text-[100px]"
    classForButton="mx-12 my-2"
  />
  <div
    class="tooltip tooltip-bottom tooltip-neutral text-bg-coopmaths-canvas"
    data-tip="Sortir du diaporama"
  >
    <Button
      icon="bx-home-alt-2 text-[100px]"
      class="mx-12 my-2"
      on:click={backToSettings}
    />
  </div>
</div>
