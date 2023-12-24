<script lang="ts">
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import KeyboardBlock from './KeyboardBlock.svelte'
  import { fly } from 'svelte/transition'
  import { Keyboard } from './types/keyboardContent'
  import { fullOperations, numeric, variables } from './layouts/keyboardBlocks'

  export let innerWidth: number

  const myKeyboard = new Keyboard(fullOperations).add(numeric).add(variables)
  // const specialKeys: KeyboardBlock = myKeyboard.blocks[0]
  let divKeyboard: HTMLDivElement
  let reduced: boolean = false

  let isVisible = false
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
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct p-4 flex flex-row space-x-4 md:space-x-12 items-start justify-center w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    {#if !reduced}
      {#each [...myKeyboard.blocks].reverse() as block}
        <KeyboardBlock {block} isInLine={false} {innerWidth}/>
      {/each}
    {:else}
    {#each [...myKeyboard.blocks].reverse() as block}
        <KeyboardBlock {block} isInLine={true} {innerWidth}/>
      {/each}
    {/if}
    <button
      type="button"
      class="z-[10000] absolute right-0 top-0 md:right-3 md:top-3 h-5 w-5 rounded-sm bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action-light dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas dark:text-coopmaths-canvas"
      on:click={async () => {
        reduced = !reduced
        await tick()
        mathaleaRenderDiv(divKeyboard)
      }}
    >
      <i class="bx {reduced ? 'bx-plus' : 'bx-minus'}" />
    </button>
  </div>
{/if}
