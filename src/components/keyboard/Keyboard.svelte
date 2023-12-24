<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import KeyboardBlock from './KeyboardBlock.svelte'
  import { fly } from 'svelte/transition'
  import { Keyboard } from './types/keyboardContent'
  import { fullOperations, numeric, variables } from './layouts/keyboardBlocks'
  import { GAP_BETWEEN_BLOCKS } from './layouts/keycaps'

  export let innerWidth: number
  $: blockgapsize = innerWidth <= 768 ? GAP_BETWEEN_BLOCKS.sm : GAP_BETWEEN_BLOCKS.md

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
  onMount(() => {
    console.log('nb block: ' + myKeyboard.numberOfBlocks())
    console.log('nb keys: ' + myKeyboard.numberOfKeys())
    console.log('nb keys/block: ' + myKeyboard.numberOfKeysPerBlock())
    console.log('nb keys(reduce): ' + myKeyboard.numberOfKeysPerBlock().reduce((prev, current) => prev + current))
  })
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct p-4 flex flex-row blockgap items-start justify-center w-full fixed bottom-0 left-0 right-0 z-[9999]"
    style="--blockgapsize:{blockgapsize}"
  >
    {#if !reduced}
      {#each [...myKeyboard.blocks].reverse() as block}
        <KeyboardBlock {block} isInLine={false} {innerWidth} />
      {/each}
    {:else}
      {#each [...myKeyboard.blocks].reverse() as block}
        <KeyboardBlock {block} isInLine={true} {innerWidth} />
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
<style>
  .blockgap {
    column-gap: calc( var(--blockgapsize) * 1px);
  }
</style>
