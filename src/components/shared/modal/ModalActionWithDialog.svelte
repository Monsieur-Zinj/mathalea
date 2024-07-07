<script lang="ts">
  import ButtonIcon from '../forms/ButtonIcon.svelte'
  import ButtonText from '../forms/ButtonText.svelte'
  export let messageSuccess: string
  export let messageError: string
  export let dialogId: string = 'dialogbox'
  export let tooltipMessage: string = ''
  export let buttonSize: string = 'text-2xl'
  export let buttonIcon: string = 'bx-link'
  export let buttonSecondIcon: string = ''
  export let classForButton: string = ''
  export let title: string = ''

</script>

<div class="{tooltipMessage ? 'tooltip tooltip-bottom tooltip-neutral' : ''}" data-tip={tooltipMessage}>
  {#if title.length === 0}
    <ButtonIcon
      id="modalaction-button"
      {buttonSecondIcon}
      icon="{buttonIcon}"
      class="{classForButton} {buttonSize}"
      on:click
  />
  {:else}
    <ButtonText
      id="modalaction-button"
      text={title}
      class="{classForButton}"
    />
  {/if}
</div>

<dialog
  id={dialogId + '-success'}
  class="rounded-xl p-6 shadow-lg
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark
    text-coopmaths-corpus dark:text-coopmathsdark-corpus-light"
>
  <div class="container font-light">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html messageSuccess}
  </div>
</dialog>

<dialog
  id={dialogId + '-error'}
  class="rounded-xl p-6 shadow-lg
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark
    text-coopmaths-corpus dark:text-coopmathsdark-corpus-light"
>
  <div class="container font-light">
    {messageError}
  </div>
</dialog>
