<script lang="ts">
  import BasicInfoModal from '../modal/BasicInfoModal.svelte'
  import ButtonIconTooltip from './ButtonIconTooltip.svelte'
  import ButtonText from './ButtonText.svelte'

  export let action: 'copy' | 'download'
  export let textToCopy: string = ''
  export let urlToDownload: string = ''
  export let fileName: string = 'mathAlea'

  export let icon: string = ''
  export let tooltip: string = ''
  export let disabled: boolean = false
  export let floatUnderText: string = ''
  export let cornerIcon: string = ''
  export let cornerIconClass: string = ''

  export let text: string = ''
  export let title: string = ''
  export let inverted: boolean = false

  export let successMessage: string = 'Copié dans le presse-papier'
  export let errorMessage: string = 'Une erreur est survenue lors de la copie dans le presse-papier.'
  export let displayDuration: number = 3000

  let contentDisplayed: 'success' | 'error' | 'none' = 'none'

  let actionFunction: () => void
  $: actionFunction = action === 'copy' ? copyToClipboard : downloadFile

  function copyToClipboard () {
    if (textToCopy === '') {
      console.error('Le texte à copier est vide')
      contentDisplayed = 'error'
      return
    }
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        contentDisplayed = 'success'
      },
      (err) => {
        console.error('Impossible de copier le texte dans le presse-papier', err)
        contentDisplayed = 'error'
      }
    )
  }

  async function downloadFile () {
    if (urlToDownload === '') {
      console.error('L\'URL à télécharger est vide')
      contentDisplayed = 'error'
      return
    }
    try {
      const text = `<html><head><meta http-equiv="refresh" content="0;URL=${encodeURI(urlToDownload)}"></head></html>`
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', fileName + '.html')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      contentDisplayed = 'success'
    } catch (error) {
      console.error('Impossible de télécharger le fichier', error)
      contentDisplayed = 'error'
    }
  }

</script>

{#if text === ''}
  <ButtonIconTooltip
      {icon}
      {tooltip}
      {disabled}
      {floatUnderText}
      {cornerIcon}
      {cornerIconClass}
      class="{$$props.class || ''}"
      on:click={actionFunction}
  />
{:else}
  <ButtonText
      {text}
      {title}
      {disabled}
      {icon}
      {inverted}
      class="{$$props.class || ''}"
      on:click={actionFunction}
  />
{/if}

<BasicInfoModal
  bind:contentDisplayed={contentDisplayed}
  {successMessage}
  {errorMessage}
  {displayDuration}
/>
