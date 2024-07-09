<script lang="ts">
  import ModalActionWithDialog from '../../../../shared/modal/ModalActionWithDialog.svelte'
  import ButtonQRCode from '../../../../shared/forms/ButtonQRCode.svelte'
  import { copyLinkToClipboard } from '../../../../../lib/components/clipboard'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'

</script>
<div class="flex text-lg font-bold pb-2
  text-coopmaths-struct dark:text-coopmathsdark-struct"
>
  Liens
  <div class="flex flex-row pl-4 space-x-2 font-normal">
    <ModalActionWithDialog
      on:click={() => copyLinkToClipboard('linkCopiedDialog-1', buildMathAleaURL({ view: 'diaporama' }))}
      messageSuccess="Le lien est copié dans le presse-papier !"
      messageError="Le lien n'a pas pu être copié."
      dialogId="linkCopiedDialog-1"
      tooltipMessage="Lien du Diaporama"
    />
    <ButtonQRCode
      url={document.URL}
      tooltip="QR-code du diaporama"
    />
  </div>
</div>
