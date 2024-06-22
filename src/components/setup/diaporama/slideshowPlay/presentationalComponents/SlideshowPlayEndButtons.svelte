<script lang="ts">
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import { mathaleaHandleComponentChange } from '../../../../../lib/mathalea'
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQrCode from '../../../../shared/modal/ModalForQRCode.svelte'

  export let QRCodeWidth: number
  export let formatQRCodeIndex: 0 | 1 | 2
  export let returnToStart: () => void

</script>

<div class="flex flex-row items-center justify-center w-full mx-10 my-4">
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Début du diaporama"
  >
    <button
      type="button"
      class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
      on:click={returnToStart}
      on:keydown={returnToStart}
    >
      <i class="bx text-[100px] bx-arrow-back" />
    </button>
  </div>
  <div
    class="tooltip tooltip-bottom tooltip-neutral"
    data-tip="Questions + Réponses"
  >
    <button
      type="button"
      class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
      on:click={() => mathaleaHandleComponentChange('diaporama', 'overview')}
    >
      <i class="bx text-[100px] bx-detail" />
    </button>
  </div>
  <ModalActionWithDialog
    on:display={() => copyLinkToClipboard('linkCopiedDialog-2', buildMathAleaURL('diaporama'))}
    message="Le lien est copié dans le presse-papier !"
    dialogId="linkCopiedDialog-2"
    tooltipMessage="Lien du Diaporama"
    buttonSize="text-[100px]"
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
    <button
      type="button"
      class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
      on:click={() => mathaleaHandleComponentChange('diaporama', '')}
    >
      <i class="bx text-[100px] bx-home-alt-2" />
    </button>
  </div>
</div>
