<script lang="ts">
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import KeyboardBlock from './KeyboardBlock.svelte'
  import { fly } from 'svelte/transition'
  import { numeric, specialKeysBlock } from './layouts/keyboards'

  let divKeyboard: HTMLDivElement

  let isVisible = false
  const numberOfBlocks = numeric.length
  keyboard.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct p-4 flex flex-row space-x-4 justify-center items-center w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    <div class="grid grid-cols-{numberOfBlocks} gap-3 md:gap-6">
      {#each numeric as block}
        <KeyboardBlock {block}/>
      {/each}
    </div>
    <KeyboardBlock block={specialKeysBlock} isSpecial={true}/>
  </div>
{/if}
