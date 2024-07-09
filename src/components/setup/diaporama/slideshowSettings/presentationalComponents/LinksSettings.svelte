<script lang="ts">
  import ButtonQRCode from '../../../../shared/forms/ButtonQRCode.svelte'
  import { buildMathAleaURL } from '../../../../../lib/components/urls'
  import ButtonActionInfo from '../../../../shared/forms/ButtonActionInfo.svelte'

</script>
<div class="flex text-lg font-bold pb-2
  text-coopmaths-struct dark:text-coopmathsdark-struct"
>
  Liens
  <div class="flex flex-row pl-4 space-x-2 font-normal">
    <ButtonActionInfo
      action="copy"
      icon={'bx-link text-2xl'}
      textToCopy={buildMathAleaURL({ view: 'diaporama' }).toString()}
      tooltip="Lien du Diaporama"
      successMessage="Le lien du diaporama est copié dans le presse-papier !"
      errorMessage="Impossible de copier le lien du diaporama dans le presse-papier."
    />
    <ButtonQRCode
      url={document.URL}
      tooltip="QR-code du diaporama"
    />
  </div>
</div>
