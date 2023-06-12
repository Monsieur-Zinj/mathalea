<script>
  export let showSettingsDialog // boolean
  export const closeModal = () => dialog.close()

  let dialog // HTMLDialogElement

  $: if (dialog && showSettingsDialog) dialog.showModal()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:close={() => (showSettingsDialog = false)} on:click|self={() => dialog.close()} class="rounded-xl w-1/2">
  <div on:click|stopPropagation class="relative p-8">
    <div class="text-4xl text-coopmaths-struct font-light mb-6">
      <slot name="header" />
    </div>
    <div class="w-full">
      <slot name="content" />
    </div>
    <slot name="buttons" />
    <!-- svelte-ignore a11y-autofocus -->
    <button class="absolute -top-1 -right-1" autofocus on:click={() => dialog.close()}> <i class="bx bx-x text-2xl text-coopmaths-action hover:text-coopmaths-action-lightest" /></button>
  </div>
</dialog>
