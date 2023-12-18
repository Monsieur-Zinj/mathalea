<script lang="ts">
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import { usual } from './layouts/keyboardLayouts'
  import KeyboardBlock from './KeyboardBlock.svelte'
  import { fly } from 'svelte/transition'

  let divKeyboard: HTMLDivElement

  let isVisible = false
  keyboard.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%' }}
    bind:this={divKeyboard}
    class="bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest p-4 flex justify-center items-center w-full h-[20vh] md:h-[30vh] fixed bottom-0 left-0 right-0 z-[9999]"
  >
    <div class="grid grid-cols-{Object.keys(usual).length} gap-3 md:gap-6">
      {#if usual.left}
          <KeyboardBlock class="grid grid-cols-3 gap-1 md:gap-2 h-full" block={usual.left} />
        {/if}
      {#if usual.center}
        <KeyboardBlock
          class="grid grid-cols-4 gap-1 md:gap-2 h-full"
          block={usual.center}
        />
      {/if}
      {#if usual.right}
        <KeyboardBlock
          class="grid grid-cols-3 gap-1 md:gap-2 h-full"
          block={usual.right}
        />
      {/if}
    </div>
  </div>
{/if}
