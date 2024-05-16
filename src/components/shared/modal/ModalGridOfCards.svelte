<script>
  import { isModalForStaticsVisible } from '../../../lib/stores/generalStore'

  export let displayModal // boolean
  export const closeModal = () => {
    dialog.close()
    displayModal = false
  }

  let dialog // HTMLDialogElement

  $: if (dialog && displayModal) dialog.showModal()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    displayModal = false
  }}
  on:click|self={() => dialog.close()}
  class={`${$$props.class || 'rounded-xl w-2/3 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}`}
>
  <div on:click|stopPropagation class="relative p-8" role="button" tabindex="0">
    <div class="text-4xl text-coopmaths-struct font-light mb-6">
      <slot name="header" />
    </div>
    <div class="w-full">
      <slot name="content" />
    </div>
    <slot name="buttons" />
    <!-- svelte-ignore a11y-autofocus -->
    <button
      class="absolute top-3 right-3"
      autofocus
      on:click={() => {
        dialog.close()
        $isModalForStaticsVisible = false
      }}
    >
      <i
        class="bx bx-x text-2xl text-coopmaths-action hover:text-coopmaths-action-lightest"
      />
    </button>
  </div>
</dialog>
