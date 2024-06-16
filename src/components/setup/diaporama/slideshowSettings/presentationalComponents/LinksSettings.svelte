<script lang="ts">
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQRCode from '../../../../shared/modal/ModalForQRCode.svelte'
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'

  export let QRCodeWidth: number
  export let formatQRCodeIndex: number
</script>
<div class="flex text-lg font-bold pb-2 text-coopmaths-struct dark:text-coopmathsdark-struct">
  Liens
  <div class="flex flex-row px-4 -mt-2 justify-start">
    <ModalActionWithDialog
      on:display={() => copyLinkToClipboard('linkCopiedDialog-1', buildMathAleaURL('diaporama'))}
      message="Le lien est copié dans le presse-papier !"
      dialogId="linkCopiedDialog-1"
      tooltipMessage="Lien du Diaporama"
      classForButton="mr-4 my-2"
    />
    <ModalForQRCode
      classForButton="mr-4 my-2"
      dialogId="QRCodeModal-1"
      imageId="QRCodeCanvas-1"
      url={document.URL}
      tooltipMessage="QR-code du diaporama"
      width={QRCodeWidth}
      format={formatQRCodeIndex}
    />
  </div>
</div>
