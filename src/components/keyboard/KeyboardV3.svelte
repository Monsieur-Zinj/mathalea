<script lang="ts">
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import KeyboardBlock from './KeyboardBlockV2.svelte'
  import { fly } from 'svelte/transition'
  import { numeric2, specialKeysInLine } from './keys/keyboardContent'
  // import type { CustomKeyboard } from './types/KBContent'

  let divKeyboard: HTMLDivElement

  let isVisible = false
  const numberOfBlocks = numeric2.length
  keyboard.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
  // const keyboardHeight = (kbList: CustomKeyboard):number => {
  //   let max = 0
  //   for (const kb of kbList) {
  //     const currentMax = Math.floor(kb.content.length / kb.layout.numOfCols)
  //     if (currentMax > max) {
  //       max = currentMax
  //     }
  //   }
  //   return max
  // }
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%' }}
    bind:this={divKeyboard}
    class="bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest p-4 flex flex-row space-x-4 justify-center items-center w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    <div class="grid grid-cols-{numberOfBlocks} gap-3 md:gap-6">
      {#each numeric2 as block}
        <KeyboardBlock {block}/>
      {/each}
    </div>
    <KeyboardBlock block={specialKeysInLine} isSpecial={true}/>
  </div>
{/if}
