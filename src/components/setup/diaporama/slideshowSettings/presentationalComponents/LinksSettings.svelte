<script lang="ts">
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQRCode from '../../../../shared/modal/ModalForQRCode.svelte'
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import { isIntegerInRange0to2 } from '../../../../../lib/types/integerInRange'

  export let QRCodeWidth: number
  export let formatQRCodeIndex: number
</script>
<div class="flex text-lg font-bold pb-2
  text-coopmaths-struct dark:text-coopmathsdark-struct"
>
  Liens
  <div class="flex flex-row px-4 -mt-2 justify-start">
    <ModalActionWithDialog
      on:click={() => copyLinkToClipboard('linkCopiedDialog-1', buildMathAleaURL('diaporama'))}
      messageSuccess="Le lien est copié dans le presse-papier !"
      messageError="Le lien n'a pas pu être copié."
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
      format={isIntegerInRange0to2(formatQRCodeIndex) ? formatQRCodeIndex : 0}
    />
  </div>
</div>
