<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import ButtonIcon from '../forms/ButtonIcon.svelte'

  export let isDisplayed: boolean
  export let isWithCloseButton: boolean = true

  const dispatch = createEventDispatcher()

  let dialog: HTMLDialogElement

  $: if (dialog && isDisplayed) dialog.showModal()
  $: if (dialog && !isDisplayed) dialog.close()
</script>

<!-- Ceux qui n'ont pas de souris ont le focus sur le bouton de la croix pour fermer donc ce n'est pas grave s'ils ne peuvent pas fermer en interagissant avec le fond de la modale -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:click|self={() => dialog.close()}
  on:close={() => {
    isDisplayed = false
    dispatch('close')
  }}
  class="rounded-xl
    w-full md:w-2/3 xl:w-1/2
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <div class="relative p-6 text-center">
    {#if isWithCloseButton}
      <ButtonIcon
      class="absolute top-3 right-3 text-2xl"
      icon="bx-x"
      on:click={() => dialog.close()}
      />
    {/if}
    <div class="w-full mb-6
      text-2xl font-bold
      text-coopmaths-struct dark:text-coopmathsdark-struct"
    >
      <slot name="header" />
    </div>
    <div class="w-full">
      <slot name="content" />
    </div>
    <div class="w-full mt-6">
      <slot name="footer" />
    </div>
  </div>
</dialog>
